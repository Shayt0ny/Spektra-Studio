// SPDX-License-Identifier: GPL-3.0-or-later
// Record-only library. Its storage interface has no file-delete operation.
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { platform, type FileEntry } from '../platform';
import { reviewKey } from './review';
import type { LibraryPhoto } from './filters';
export interface Album { id: string; name: string; paths: string[]; trashedAt?: number }
interface AlbumChange { id: string; before: Album | null; after: Album | null }
interface Document { version: 1; photos: Record<string, LibraryPhoto>; albums: Album[]; undo: AlbumChange[]; redo: AlbumChange[] }
interface LibraryStorage { load(): Promise<unknown>; save(value: Document): Promise<void> }
interface LibraryState extends Document {
  ready: boolean; dirty: boolean; error: string;
  init(files?: readonly FileEntry[]): Promise<void>; register(files: readonly FileEntry[]): void;
  create(name: string, paths: string[]): string | null; rename(id: string, name: string): void;
  members(id: string, paths: string[]): void; trash(id: string): void; restore(id: string): void; destroy(id: string): void;
  updatePhoto(path: string, value: Partial<Omit<LibraryPhoto, 'file'>>): void;
  undoAlbum(): void; redoAlbum(): void; flush(): Promise<boolean>;
  cancelAnalysis(): void;
}
const empty = (): Document => ({ version: 1, photos: {}, albums: [], undo: [], redo: [] });
function decode(raw: unknown): Document {
  const d = empty(); if (!raw || typeof raw !== 'object') return d;
  const o = raw as Partial<Document>;
  if (o.photos && typeof o.photos === 'object') for (const p of Object.values(o.photos)) {
    if (!p || !p.file || typeof p.file.path !== 'string' || typeof p.file.name !== 'string' || !Number.isFinite(p.file.size) || !Number.isFinite(p.file.mtime_ms)) continue;
    d.photos[p.file.path] = { ...p, tags: Array.isArray(p.tags) ? p.tags.filter((t) => typeof t === 'string').slice(0, 64) : [] };
  }
  const album = (a: Album | null): boolean => a === null || !!a && typeof a.id === 'string' && typeof a.name === 'string' && Array.isArray(a.paths) && a.paths.every((p) => typeof p === 'string');
  if (Array.isArray(o.albums)) d.albums = o.albums.filter((a) => a && album(a));
  for (const key of ['undo', 'redo'] as const) if (Array.isArray(o[key])) d[key] = o[key]!.filter((c) => c && typeof c.id === 'string' && album(c.before) && album(c.after)).slice(-40);
  return d;
}
export function createLibraryStore(storage: LibraryStorage) {
  let loading: Promise<void> | null = null, saving: Promise<boolean> | null = null, revision = 0, timer: ReturnType<typeof setTimeout> | undefined;
  const store = createStore<LibraryState>((set, get) => {
    const changed = () => { revision++; set({ dirty: true }); clearTimeout(timer); timer = setTimeout(() => { void get().flush(); }, 750); };
    const apply = (change: AlbumChange, history = true) => {
      const albums = get().albums.filter((a) => a.id !== change.id); if (change.after) albums.push(change.after);
      const undo = [...get().undo, change].slice(-40);
      // Bound history bytes as well as step count for large shared albums.
      while (undo.length > 1 && JSON.stringify(undo).length > 2 * 1024 * 1024) undo.shift();
      set({ albums, ...(history ? { undo, redo: [] } : {}) }); changed();
    };
    const modify = (id: string, fn: (album: Album) => Album | null) => {
      const before = get().albums.find((a) => a.id === id); if (!get().ready || !before) return;
      const after = fn(before); if (JSON.stringify(before) !== JSON.stringify(after)) apply({ id, before, after });
    };
    return { ...empty(), ready: false, dirty: false, error: '', cancelAnalysis() {},
      async init(files = []) {
        if (!get().ready) {
          loading ??= (async () => {
            try { set({ ...decode(await storage.load()), ready: true, error: '' }); }
            catch (e) { set({ error: String(e) }); }
            finally { loading = null; }
          })(); await loading;
        }
        if (get().ready) get().register(files);
      },
      register(files) {
        if (!get().ready) return;
        const photos = { ...get().photos }; let different = false;
        for (const file of files) {
          const prior = photos[file.path]; if (prior && reviewKey(prior.file) === reviewKey(file)) continue;
          photos[file.path] = { file: { ...file }, tags: prior?.tags ?? [] }; different = true;
        }
        if (different) { set({ photos }); changed(); }
      },
      create(name, paths) {
        name = name.trim().slice(0, 120); if (!get().ready || !name) return null;
        const id = crypto.randomUUID(); apply({ id, before: null, after: { id, name, paths: [...new Set(paths)].filter((p) => !!get().photos[p]) } }); return id;
      },
      rename(id, name) { if (name.trim()) modify(id, (a) => ({ ...a, name: name.trim().slice(0, 120) })); },
      members(id, paths) { modify(id, (a) => ({ ...a, paths: [...new Set(paths)].filter((p) => !!get().photos[p]) })); },
      trash(id) { modify(id, (a) => ({ ...a, trashedAt: Date.now() })); },
      restore(id) { modify(id, (a) => { const copy = { ...a }; delete copy.trashedAt; return copy; }); },
      destroy(id) { modify(id, () => null); },
      updatePhoto(path, value) {
        const photo = get().photos[path]; if (!get().ready || !photo) return;
        const next = { ...photo, ...value, file: photo.file, tags: value.tags ? [...new Set(value.tags.map((t) => t.trim().slice(0, 80)).filter(Boolean))].slice(0, 64) : photo.tags };
        if (JSON.stringify(photo) === JSON.stringify(next)) return;
        set({ photos: { ...get().photos, [path]: next } }); changed();
      },
      undoAlbum() {
        const c = get().undo.at(-1); if (!c) return;
        apply({ ...c, before: c.after, after: c.before }, false); set({ undo: get().undo.slice(0, -1), redo: [...get().redo, c].slice(-40) });
      },
      redoAlbum() {
        const c = get().redo.at(-1); if (!c) return;
        apply(c, false); set({ undo: [...get().undo, c].slice(-40), redo: get().redo.slice(0, -1) });
      },
      async flush() {
        clearTimeout(timer);
        if (saving) { if (!await saving) return false; return get().dirty ? get().flush() : true; }
        if (!get().dirty) return true;
        const s = get(), at = revision, value: Document = { version: 1, photos: s.photos, albums: s.albums, undo: s.undo, redo: s.redo };
        saving = (async () => {
          try { await storage.save(value); set({ dirty: at !== revision, error: '' }); return true; }
          catch (e) { set({ error: String(e) }); return false; }
        })(); const ok = await saving; saving = null; return ok && get().dirty ? get().flush() : ok;
      },
    };
  }); return store;
}
export const libraryStore = createLibraryStore({ load: () => platform().storeRead('Lighttable', 'library.json'), save: (value) => platform().storeWrite('Lighttable', 'library.json', value) });
export const useLibrary = <T>(selector: (s: LibraryState) => T) => useStore(libraryStore, selector);
