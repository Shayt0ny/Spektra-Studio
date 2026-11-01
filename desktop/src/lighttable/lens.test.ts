import { describe, expect, it } from 'vitest';
import { lensBands, lensDiameter } from './lens';
describe('bounded local lens', () => {
  it('leaves the outer table visible and bounds render resolution at large settings', () => {
    expect(lensDiameter(360, { width: 1100, height: 300 })).toBe(198);
    expect(lensDiameter(240, { width: 1600, height: 700 })).toBe(240);
  });
  it('keeps center sampling unchanged and bends only the outer RGB image', () => {
    const bands = lensBands(150, true);
    expect(bands).toHaveLength(10); expect(bands[0]!.scale).toBe(1); expect(bands.at(-1)!.scale).toBeGreaterThan(1);
    expect(lensBands(150, false)).toEqual([{ inner: 0, outer: 150, scale: 1 }]);
    for (let i = 1; i < bands.length; i++) expect(bands[i]!.inner).toBeLessThan(bands[i - 1]!.outer);
  });
});
