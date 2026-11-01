import { describe, expect, it, vi } from 'vitest';
import { createReviewStore, reviewKey } from './review';
const files = Array.from({ length: 3 }, (_, i) => ({ path: `/owned/${i}.NEF`, name: `${i}.NEF`, size: i + 1, mtime_ms: 1 }));

describe('independent review decisions', () => {
  it('persists decisions separately, keeps the review range fixed and undoes only review marks', async () => {
    const save = vi.fn(async () => {}), store = createReviewStore({ load: async () => null, save });
    await store.getState().start(files, files[0]!.path);
    store.getState().setMode('single'); store.getState().mark('keep'); store.getState().mark('reject');
    expect(store.getState().entries).toEqual(files);
    expect(store.getState().current).toBe(files[2]!.path);
    store.getState().undoMark();
    expect(store.getState().marks[reviewKey(files[1]!)]).toBeUndefined();
    expect(store.getState().current).toBe(files[1]!.path);
    store.getState().redoMark(); await store.getState().flush();
    expect(save).toHaveBeenLastCalledWith(expect.objectContaining({ marks: expect.objectContaining({ [reviewKey(files[0]!)]: 'keep', [reviewKey(files[1]!)]: 'reject' }) }));
  });
  it('keeps unsaved decisions recoverable and refuses to close until a failed save succeeds', async () => {
    let fail = true;
    const store = createReviewStore({ load: async () => null, save: async () => { if (fail) throw new Error('disk full'); } });
    await store.getState().start(files, files[0]!.path); store.getState().mark('keep');
    expect(await store.getState().close()).toBe(false);
    expect(store.getState().open).toBe(true); expect(store.getState().error).toContain('disk full');
    fail = false; expect(await store.getState().close()).toBe(true);
    expect(store.getState().open).toBe(false);
  });
  it('defaults to the desk and does not advance a desk or grid selection when marking', async () => {
    const store = createReviewStore({ load: async () => null, save: async () => {} });
    await store.getState().start(files, files[0]!.path); store.getState().mark('keep');
    expect(store.getState().mode).toBe('desk');
    expect(store.getState().current).toBe(files[0]!.path);
    store.getState().setMode('grid'); store.getState().mark('reject');
    expect(store.getState().current).toBe(files[0]!.path);
    expect(reviewKey({ ...files[0]!, size: 999 })).not.toBe(reviewKey(files[0]!));
    await store.getState().flush();
  });
});
