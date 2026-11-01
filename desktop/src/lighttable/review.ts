// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Review decisions deliberately never enter a photo recipe or editor history.
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { platform, type FileEntry } from '../platform';
export type Decision = 'keep' | 'reject' | 'unmarked';
export type ReviewMode = 'desk' | 'grid' | 'single' | 'compare' | 'roll' | 'library';
type Marks = Record<string, Exclude<Decision, 'unmarked'>>;
interface Change { key: string; path: string; before: Decision; after: Decision }
export const reviewKey = (f: FileEntry) => JSON.stringify([f.path, f.size, f.mtime_ms]);
interface ReviewStorage { load(): Promise<unknown>; save(value: { version: number; marks: Marks }): Promise<void> }
export interface ReviewState {
  open: boolean; ready: boolean; closing: boolean; entries: FileEntry[]; current: string | null; reference: string | null;
  mode: ReviewMode; marks: Marks; dirty: boolean; saving: boolean; error: string; undo: Change[]; redo: Change[];
  start(entries: readonly FileEntry[], current: string | null): Promise<void>;
  choose(path: string): void; navigate(delta: number): void; pin(): void; setMode(mode: ReviewMode): void;
  reviewRange(entries: readonly FileEntry[]): void;
  mark(decision: Decision): void; undoMark(): void; redoMark(): void; flush(): Promise<boolean>; close(): Promise<boolean>;
}
export function createReviewStore(storage: ReviewStorage) {
  let loaded = false, load: Promise<void> | null = null, saving: Promise<boolean> | null = null, revision = 0;
  const store = createStore<ReviewState>((set, get) => {
    const apply = (key: string, decision: Decision) => {
      const marks = { ...get().marks };
      if (decision === 'unmarked') delete marks[key]; else marks[key] = decision;
      revision++; set({ marks, dirty: true });
    };
    const schedule = () => { queueMicrotask(() => { if (!saving) void get().flush(); }); };
    return {
      open: false, ready: false, closing: false, entries: [], current: null, reference: null, mode: 'desk',
      marks: {}, dirty: false, saving: false, error: '', undo: [], redo: [],
      async start(entries, current) {
        if (get().open || !entries.length) return;
        const photos = entries.map((f) => ({ ...f }));
        set({ open: true, closing: false, entries: photos, current: photos.some((f) => f.path === current) ? current : photos[0]!.path,
          reference: null, mode: 'desk', undo: [], redo: [], error: '' });
        if (loaded) { set({ ready: true }); return; }
        load ??= (async () => {
          try {
            const value = await storage.load(), marks: Marks = {};
            if (value && typeof value === 'object' && 'marks' in value && value.marks && typeof value.marks === 'object') {
              for (const [key, mark] of Object.entries(value.marks)) if (mark === 'keep' || mark === 'reject') marks[key] = mark;
            }
            loaded = true; set({ marks, ready: true });
          } catch (e) { set({ ready: false, error: String(e) }); }
          finally { load = null; }
        })();
        await load;
      },
      choose(path) { if (!get().closing && get().entries.some((f) => f.path === path)) set({ current: path }); },
      reviewRange(entries) {
        if (get().closing || !entries.length) return;
        const files = [...new Map(entries.map((f) => [f.path, { ...f }])).values()];
        set({ entries: files, current: files.some((f) => f.path === get().current) ? get().current : files[0]!.path, reference: null, mode: 'desk' });
      },
      navigate(delta) {
        const s = get(), index = s.entries.findIndex((f) => f.path === s.current);
        const next = s.entries[Math.max(0, Math.min(s.entries.length - 1, index + delta))];
        if (next && !s.closing) set({ current: next.path });
      },
      pin() {
        const s = get(); if (s.closing) return;
        set({ reference: s.current });
        const index = s.entries.findIndex((f) => f.path === s.current);
        if (s.mode === 'compare' && s.entries.length > 1) get().navigate(index === s.entries.length - 1 ? -1 : 1);
      },
      setMode(mode) {
        if (get().closing) return;
        const s = get(), index = s.entries.findIndex((f) => f.path === s.current);
        set({ mode, ...(mode === 'compare' && !s.reference ? { reference: s.entries[Math.max(0, index - 1)]?.path ?? s.current } : {}) });
        if (mode === 'compare' && get().reference === get().current && s.entries.length > 1) get().navigate(index === s.entries.length - 1 ? -1 : 1);
      },
      mark(decision) {
        const s = get(), file = s.entries.find((f) => f.path === s.current);
        if (!s.open || !s.ready || s.closing || !file) return;
        const key = reviewKey(file), before = s.marks[key] ?? 'unmarked';
        if (decision !== before) {
          apply(key, decision); set({ undo: [...s.undo.slice(-199), { key, path: file.path, before, after: decision }], redo: [], error: '' }); schedule();
        }
        if (s.mode !== 'grid' && s.mode !== 'desk' && s.mode !== 'library') get().navigate(1);
      },
      undoMark() {
        const s = get(), change = s.undo.at(-1); if (!change || s.closing) return;
        apply(change.key, change.before); set({ undo: s.undo.slice(0, -1), redo: [...s.redo, change], current: change.path }); schedule();
      },
      redoMark() {
        const s = get(), change = s.redo.at(-1); if (!change || s.closing) return;
        apply(change.key, change.after); set({ undo: [...s.undo, change], redo: s.redo.slice(0, -1), current: change.path }); schedule();
      },
      async flush() {
        if (saving) { const result = await saving; if (!result) return false; return get().dirty ? get().flush() : true; }
        if (!get().dirty) return true;
        const savedRevision = revision, marks = { ...get().marks };
        set({ saving: true });
        saving = (async () => {
          try { await storage.save({ version: 1, marks }); set({ dirty: revision !== savedRevision, error: '' }); return true; }
          catch (e) { set({ error: String(e), dirty: true }); return false; }
        })();
        const ok = await saving; saving = null; set({ saving: false });
        return ok && get().dirty ? get().flush() : ok;
      },
      async close() {
        if (get().closing) return false;
        set({ closing: true });
        if (!await get().flush()) { set({ closing: false }); return false; }
        set({ open: false, closing: false, entries: [], current: null, reference: null }); return true;
      },
    };
  });
  return store;
}
export const lighttableStore = createReviewStore({ load: () => platform().storeRead('Lighttable', 'review.json'), save: (value) => platform().storeWrite('Lighttable', 'review.json', value) });
export const useLighttable = <T>(selector: (s: ReviewState) => T) => useStore(lighttableStore, selector);
