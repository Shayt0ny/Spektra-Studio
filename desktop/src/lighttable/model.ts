// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Independent geometry for the review workspace. Workflow reference:
// https://github.com/YZH2006517/Photo-All (see PHOTO_ALL_REFERENCE.md).
export interface Size { width: number; height: number }
export interface ReviewView { scale: number; cx: number; cy: number }
export const FIT_VIEW: ReviewView = { scale: 1, cx: .5, cy: .5 };
const bounded = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export function gridWindow(count: number, width: number, height: number, scroll: number) {
  const columns = Math.max(1, Math.floor(Math.max(1, width - 32) / 232));
  const rowHeight = 222, rows = Math.ceil(count / columns);
  const first = Math.max(0, Math.floor(scroll / rowHeight) - 1);
  const last = Math.min(rows, Math.ceil((scroll + height) / rowHeight) + 1);
  return { start: Math.min(count, first * columns), end: Math.min(count, last * columns), columns, rowHeight, top: first * rowHeight, height: rows * rowHeight };
}
export function stripWindow(count: number, width: number, scroll: number, cell = 148) {
  const start = Math.max(0, Math.floor(scroll / cell) - 2);
  return { start: Math.min(count, start), end: Math.min(count, Math.ceil((scroll + width) / cell) + 2), left: start * cell, width: count * cell, cell };
}
export function fittedImage(area: Size, image: Size, view: ReviewView) {
  const fit = Math.min(area.width / image.width, area.height / image.height);
  const width = image.width * fit * view.scale, height = image.height * fit * view.scale;
  return { width, height, x: area.width / 2 - view.cx * width, y: area.height / 2 - view.cy * height, fit };
}
export function zoomAt(view: ReviewView, scale: number, pointer: { x: number; y: number }, area: Size, image: Size): ReviewView {
  scale = bounded(scale, 1, 16);
  if (scale === 1) return { ...FIT_VIEW };
  const before = fittedImage(area, image, view), after = fittedImage(area, image, { ...view, scale });
  return { scale, cx: bounded((pointer.x - before.x) / before.width - (pointer.x - area.width / 2) / after.width, 0, 1),
    cy: bounded((pointer.y - before.y) / before.height - (pointer.y - area.height / 2) / after.height, 0, 1) };
}
export function panBy(view: ReviewView, dx: number, dy: number, area: Size, image: Size): ReviewView {
  if (view.scale === 1) return view;
  const rect = fittedImage(area, image, view);
  return { ...view, cx: bounded(view.cx - dx / rect.width, 0, 1), cy: bounded(view.cy - dy / rect.height, 0, 1) };
}
