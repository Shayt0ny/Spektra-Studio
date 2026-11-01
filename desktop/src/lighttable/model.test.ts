import { describe, expect, it } from 'vitest';
import { gridWindow, stripWindow, fittedImage, zoomAt, panBy } from './model';

describe('bounded lighttable layout and synchronized viewing', () => {
  it('mounts only visible rows and overscan even for fifty thousand photographs', () => {
    const a = gridWindow(50_000, 1100, 640, 0), b = gridWindow(50_000, 1100, 640, 100_000);
    expect(a.end - a.start).toBeLessThan(40);
    expect(b.start).toBeGreaterThan(1000);
    expect(b.end - b.start).toBeLessThan(45);
    expect(stripWindow(50_000, 900, 100_000).end - stripWindow(50_000, 900, 100_000).start).toBeLessThan(16);
  });
  it('keeps the image point under the pointer and shares normalized pan between unequal photos', () => {
    const area = { width: 800, height: 600 }, image = { width: 1600, height: 1200 };
    const view = { scale: 1, cx: .5, cy: .5 };
    const before = fittedImage(area, image, view);
    const next = zoomAt(view, 2, { x: 600, y: 300 }, area, image);
    const after = fittedImage(area, image, next);
    expect((600 - after.x) / after.width).toBeCloseTo((600 - before.x) / before.width);
    expect(panBy(next, 100, 0, area, image).cx).toBeLessThan(next.cx);
    expect(fittedImage(area, { width: 1200, height: 1600 }, next).height).toBeGreaterThan(area.height);
  });
});
