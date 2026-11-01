// SPDX-License-Identifier: GPL-3.0-or-later
// A local, bounded RGB lens. Geometry only; this is a visual approximation.
export function lensDiameter(requested: number, area: { width: number; height: number }) {
  return Math.max(32, Math.min(360, requested, Math.floor(Math.min(area.width, area.height) * .66)));
}
export function lensBands(radius: number, refractive: boolean) {
  if (!refractive) return [{ inner: 0, outer: radius, scale: 1 }];
  return Array.from({ length: 10 }, (_, i) => {
    const r = (i + .5) / 10, edge = Math.max(0, (r - .55) / .45);
    return { inner: i * radius / 10, outer: (i + 1) * radius / 10 + .3, scale: 1 + .12 * edge ** 2 };
  });
}
