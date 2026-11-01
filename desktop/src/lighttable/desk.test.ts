import { describe, expect, it } from 'vitest';
import { deskFit, deskLayout, deskPage, deskScatter, deskZoom, filmAngle, filmContains, filmPoint, filmBounds, readDesk, writeDesk, type DeskState } from './desk';

describe('physical lighttable geometry and independent preferences', () => {
  it('pages large libraries without mounting every photograph', () => {
    expect(deskPage(5000, 4999)).toEqual({ start: 4992, end: 5000, page: 416, pages: 417 });
    expect(deskLayout(Array.from({ length: 12 }, (_, i) => String(i)))).toHaveLength(12);
  });
  it('fits landscape, portrait and rotated films without clipping', () => {
    const pieces = deskLayout(['a', 'b', 'c'], { a: 2, b: .5, c: 1 }); pieces[1]!.turn = 1;
    const area = { width: 840, height: 410 }, view = deskFit(pieces, area);
    for (const piece of pieces) {
      const b = filmBounds(piece);
      expect(b.x * view.scale + view.x).toBeGreaterThanOrEqual(23.99);
      expect(b.y * view.scale + view.y).toBeGreaterThanOrEqual(23.99);
      expect((b.x + b.width) * view.scale + view.x).toBeLessThanOrEqual(816.01);
      expect((b.y + b.height) * view.scale + view.y).toBeLessThanOrEqual(386.01);
    }
  });
  it('keeps the point under the pointer fixed while zooming', () => {
    const view = { x: 20, y: -80, scale: .7 }, p = { x: 220, y: 150 }, next = deskZoom(view, 2, p);
    expect((p.x - next.x) / next.scale).toBeCloseTo((p.x - view.x) / view.scale);
    expect((p.y - next.y) / next.scale).toBeCloseTo((p.y - view.y) / view.scale);
  });
  it('scatters a bounded tray reproducibly with small tilts and fits every rotated corner', () => {
    const original = deskLayout(Array.from({ length: 12 }, (_, i) => String(i)), { '0': .6, '1': 2.3 });
    const pieces = deskScatter(original, 1123), area = { width: 970, height: 390 }, view = deskFit(pieces, area);
    expect(deskScatter(original, 1123)).toEqual(pieces); expect(deskScatter(original, 1124)).not.toEqual(pieces);
    expect(original.every((p) => p.tilt === undefined)).toBe(true);
    expect(pieces.map((p) => p.key)).toEqual(original.map((p) => p.key));
    for (const p of pieces) {
      expect(Math.abs(p.tilt!)).toBeGreaterThanOrEqual(3); expect(Math.abs(p.tilt!)).toBeLessThanOrEqual(16);
      const angle = filmAngle(p) * Math.PI / 180, w = p.width + 24, h = p.width / p.aspect + 48;
      for (const dx of [-w / 2, w / 2]) for (const dy of [-h / 2, h / 2]) {
        const x = (p.x + w / 2 + dx * Math.cos(angle) - dy * Math.sin(angle)) * view.scale + view.x;
        const y = (p.y + h / 2 + dx * Math.sin(angle) + dy * Math.cos(angle)) * view.scale + view.y;
        expect(x).toBeGreaterThanOrEqual(23.99); expect(x).toBeLessThanOrEqual(area.width - 23.99);
        expect(y).toBeGreaterThanOrEqual(23.99); expect(y).toBeLessThanOrEqual(area.height - 23.99);
      }
    }
  });
  it('maps the loupe to the photo after every quarter turn, excluding the film edge', () => {
    const piece = deskLayout(['a'])[0]!;
    for (const turn of [0, 1, 2, 3]) for (const tilt of [-16, 0, 13.5]) {
      piece.turn = turn; piece.tilt = tilt;
      const cx = piece.x + (piece.width + 24) / 2, cy = piece.y + (piece.width / piece.aspect + 48) / 2;
      const angle = (turn * 90 + tilt) * Math.PI / 180, dx = piece.width * .25, dy = 0;
      const point = filmPoint(piece, { x: cx + dx * Math.cos(angle) - dy * Math.sin(angle), y: cy + dx * Math.sin(angle) + dy * Math.cos(angle) });
      expect(point?.u).toBeCloseTo(.75); expect(point?.v).toBeCloseTo(.5);
      const edge = { x: cx + (piece.width / 2 + 6) * Math.cos(angle), y: cy + (piece.width / 2 + 6) * Math.sin(angle) };
      expect(filmContains(piece, edge)).toBe(true); expect(filmPoint(piece, edge)).toBeNull();
      expect(filmPoint(piece, { x: -999, y: -999 })).toBeNull();
    }
  });
  it('rejects malformed saved coordinates and bounds retained tables', () => {
    let value = ''; const storage = { getItem: () => value || null, setItem: (_: string, v: string) => { value = v; } };
    const state: DeskState = { pieces: deskLayout(['a']), view: { x: 0, y: 0, scale: 1 }, lamp: true, brightness: 1, arranged: false };
    for (let i = 0; i < 11; i++) writeDesk(storage, String(i), state);
    expect(Object.keys(JSON.parse(value).tables)).toHaveLength(8);
    expect(readDesk(storage, '0')).toBeNull(); expect(readDesk(storage, '10')).toEqual(state);
    const parsed = JSON.parse(value); parsed.tables['10'].pieces[0].width = -5; value = JSON.stringify(parsed);
    expect(readDesk(storage, '10')).toBeNull();
  });
});
