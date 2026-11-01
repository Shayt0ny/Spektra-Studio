import { describe, expect, it } from 'vitest';
import { createLibraryStore } from './library';
import { analyzePreview, facetCounts, filterPhotos, type LibraryPhoto } from './filters';
const files = [0, 1].map((i) => ({ path: `/owned/${i}.CR3`, name: `${i}.CR3`, size: 10, mtime_ms: 1 }));
describe('shared record-only albums and linked facets', () => {
  it('destroys only the album, keeps shared originals and persists undo across restart', async () => {
    let saved: unknown; const storage = { load: async () => saved, save: async (v: unknown) => { saved = structuredClone(v); } };
    const store = createLibraryStore(storage); await store.getState().init(files);
    const a = store.getState().create('A', files.map((f) => f.path))!, b = store.getState().create('B', [files[0]!.path])!;
    store.getState().trash(a); store.getState().destroy(a); await store.getState().flush();
    expect(store.getState().albums.map((v) => v.id)).toEqual([b]); expect(Object.keys(store.getState().photos)).toHaveLength(2);
    const next = createLibraryStore(storage); await next.getState().init(); next.getState().undoAlbum();
    expect(next.getState().albums.find((v) => v.id === a)?.trashedAt).toBeTypeOf('number');
    next.getState().restore(a); expect(next.getState().albums.find((v) => v.id === a)?.trashedAt).toBeUndefined(); await next.getState().flush();
  });
  it('invalidates statistics when the original changes without dropping its manual tags', async () => {
    const store = createLibraryStore({ load: async () => null, save: async () => {} }); await store.getState().init(files);
    store.getState().updatePhoto(files[0]!.path, { tags: ['portrait'], width: 100 });
    store.getState().register([{ ...files[0]!, size: 99 }]);
    expect(store.getState().photos[files[0]!.path]?.width).toBeUndefined(); expect(store.getState().photos[files[0]!.path]?.tags).toEqual(['portrait']); await store.getState().flush();
  });
  it('counts each facet against every other chosen condition and retains clearable zero options', () => {
    const photos: LibraryPhoto[] = files.map((file, i) => ({ file, tags: [i ? 'sky' : 'portrait'], film: i ? 'filmB' : 'filmA', style: 'edited' }));
    expect(filterPhotos(photos, { film: 'filmA' }, 'portrait')).toHaveLength(1);
    const counts = facetCounts(photos, { film: 'filmA', content: 'sky' }, '');
    expect(counts.film).toEqual({ filmA: 0, filmB: 1 }); expect(counts.content).toEqual({ portrait: 1, sky: 0 });
  });
  it('measures small camera previews without opening a RAW render session', () => {
    const pixels = new Uint8ClampedArray(32 * 16 * 4); for (let i = 0; i < pixels.length; i += 4) { pixels[i] = 220; pixels[i + 1] = 10; pixels[i + 2] = 5; pixels[i + 3] = 255; }
    expect(analyzePreview(pixels, 32, 16)).toMatchObject({ color: 'red', warmth: 'warm', saturation: 'vivid', contrast: 'soft', orientation: 'landscape' });
  });
});
