import { describe, expect, it } from 'vitest';
import { decodeEditHistory, encodeEditHistory, historyEntry } from './editHistory';
import { decodeSidecar, encodeSidecar, newSidecar } from './sidecar';
describe('persistent non-destructive edit history', () => {
  it('restores undo and redo only for the exact saved head', () => {
    const head = historyEntry(newSidecar(), null), before = structuredClone(head); before.adjustments.exposure = -.4;
    const data = JSON.parse(JSON.stringify(encodeEditHistory(head, [before], [head])));
    expect(decodeEditHistory(data, head)).toEqual({ undo: [before], redo: [head] });
    expect(decodeEditHistory(data, historyEntry(decodeSidecar(encodeSidecar(newSidecar())), null))).toEqual({ undo: [before], redo: [head] });
    const edited = structuredClone(head); edited.geometry.angle = 2;
    expect(decodeEditHistory(data, edited)).toEqual({ undo: [], redo: [] });
  });
  it('keeps a bounded recent tail instead of growing every photo indefinitely', () => {
    const head = historyEntry(newSidecar(), null), entries = Array.from({ length: 90 }, (_, i) => ({ ...head, adjustments: { ...head.adjustments, exposure: i / 100 } }));
    const data = encodeEditHistory(head, entries, []); expect(data.undo).toHaveLength(60);
    expect(data.undo.at(-1)?.adjustments.exposure).toBe(.89); expect(JSON.stringify(data).length).toBeLessThan(2 * 1024 * 1024);
  });
});
