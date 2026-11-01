// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Independent tabletop geometry. Placement never enters a photo recipe.
import type { Size } from './model';
export interface DeskView { x: number; y: number; scale: number }
export interface FilmPiece { key: string; x: number; y: number; width: number; aspect: number; turn: number; tilt?: number }
export interface DeskState { pieces: FilmPiece[]; view: DeskView; lamp: boolean; brightness: number; arranged: boolean; realistic?:boolean }
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const DESK_BATCH = 12;
export function deskPage(count: number, index: number) {
  const page = Math.floor(clamp(index, 0, Math.max(0, count - 1)) / DESK_BATCH), start = page * DESK_BATCH;
  return { start, end: Math.min(count, start + DESK_BATCH), page, pages: Math.ceil(count / DESK_BATCH) };
}
export function deskScope(keys: readonly string[]) {
  let hash = 2166136261;
  for (const key of keys) for (const char of `${key}\0`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `${keys.length}-${hash >>> 0}`;
}
export function deskLayout(keys: readonly string[], aspects: Record<string, number> = {}): FilmPiece[] {
  const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(keys.length * 1.35))));
  return keys.slice(0, DESK_BATCH).map((key, i) => {
    const aspect = clamp(aspects[key] ?? 1.5, .1, 10), width = Math.max(48, Math.min(280, 210 * aspect));
    return { key, x: 38 + (i % columns) * 350 + (280 - width) / 2, y: 40 + Math.floor(i / columns) * 300, width, aspect, turn: 0 };
  });
}
export function deskScatter(pieces: FilmPiece[], seed: number): FilmPiece[] {
  // One bounded arrangement on click, rather than a running physics simulation.
  let value = seed >>> 0;
  const random = () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
  const base = deskLayout(pieces.map((p) => p.key), Object.fromEntries(pieces.map((p) => [p.key, p.aspect])));
  const columns = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(base.length * 1.35))));
  return base.map((p, i) => ({ ...p,
    x: p.x - (i % columns) * 40 + (Math.floor(i / columns) % 2 ? 35 : 0) + (random() - .5) * 70,
    y: p.y - Math.floor(i / columns) * 30 + (random() - .5) * 60,
    tilt: (random() < .5 ? -1 : 1) * (3 + random() * 13), width: p.width * (.94 + random() * .1),
  }));
}
export const filmAngle = (p: FilmPiece) => p.turn * 90 + (p.tilt ?? 0);
export function filmBounds(p: FilmPiece) {
  const w = p.width + 24, h = p.width / p.aspect + 48, angle = filmAngle(p) * Math.PI / 180;
  const width = Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle));
  const height = Math.abs(w * Math.sin(angle)) + Math.abs(h * Math.cos(angle));
  return { x: p.x + (w - width) / 2, y: p.y + (h - height) / 2, width, height };
}
export function deskFit(pieces: FilmPiece[], area: Size): DeskView {
  if (!pieces.length) return { x: 0, y: 0, scale: 1 };
  const bounds = pieces.map(filmBounds), x = Math.min(...bounds.map((p) => p.x)), y = Math.min(...bounds.map((p) => p.y));
  const width = Math.max(...bounds.map((p) => p.x + p.width)) - x, height = Math.max(...bounds.map((p) => p.y + p.height)) - y;
  const scale = clamp(Math.min(Math.max(1, area.width - 48) / width, Math.max(1, area.height - 48) / height), .015, 3);
  return { scale, x: (area.width - width * scale) / 2 - x * scale, y: (area.height - height * scale) / 2 - y * scale };
}
export function deskZoom(view: DeskView, scale: number, point: { x: number; y: number }): DeskView {
  scale = clamp(scale, .015, 6);
  return { scale, x: point.x - (point.x - view.x) * scale / view.scale, y: point.y - (point.y - view.y) * scale / view.scale };
}
function filmLocal(p: FilmPiece, point: { x: number; y: number }) {
  const w = p.width + 24, h = p.width / p.aspect + 48, dx = point.x - p.x - w / 2, dy = point.y - p.y - h / 2;
  const angle = -filmAngle(p) * Math.PI / 180;
  return { x: dx * Math.cos(angle) - dy * Math.sin(angle) + w / 2, y: dx * Math.sin(angle) + dy * Math.cos(angle) + h / 2 };
}
export function filmContains(p: FilmPiece, point: { x: number; y: number }) {
  const local = filmLocal(p, point);
  return local.x >= 0 && local.x <= p.width + 24 && local.y >= 0 && local.y <= p.width / p.aspect + 48;
}
export function filmPoint(p: FilmPiece, point: { x: number; y: number }) {
  const local = filmLocal(p, point), x = local.x - 12, y = local.y - 24;
  const u = x / p.width, v = y / (p.width / p.aspect);
  return u >= 0 && u <= 1 && v >= 0 && v <= 1 ? { u, v } : null;
}
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
const STORAGE_KEY = 'spektra.lighttable.desk.v1';
function valid(value: unknown): value is DeskState {
  if (!value || typeof value !== 'object') return false;
  const s = value as DeskState, n = (v: number, a: number, b: number) => Number.isFinite(v) && v >= a && v <= b;
  return (s.realistic===undefined||typeof s.realistic==='boolean') && typeof s.lamp === 'boolean' && typeof s.arranged === 'boolean' && n(s.brightness, .3, 1.5) && !!s.view &&
    n(s.view.x, -1000000, 1000000) && n(s.view.y, -1000000, 1000000) && n(s.view.scale, .015, 6) &&
    Array.isArray(s.pieces) && s.pieces.length <= DESK_BATCH && s.pieces.every((p) => p && typeof p.key === 'string' &&
      n(p.x, -100000, 100000) && n(p.y, -100000, 100000) && n(p.width, 44, 1200) && n(p.aspect, .1, 10) && Number.isInteger(p.turn) && n(p.turn, 0, 3) && (p.tilt === undefined || n(p.tilt, -16, 16)));
}
function tables(storage: Storage): Record<string, unknown> {
  const raw = storage.getItem(STORAGE_KEY); if (!raw) return {};
  const data: unknown = JSON.parse(raw);
  return data && typeof data === 'object' && 'version' in data && data.version === 1 && 'tables' in data && data.tables && typeof data.tables === 'object' && !Array.isArray(data.tables)
    ? data.tables as Record<string, unknown> : {};
}
export function readDesk(storage: Storage, scope: string): DeskState | null {
  const state = tables(storage)[scope]; return valid(state) ? state : null;
}
export function writeDesk(storage: Storage, scope: string, state: DeskState) {
  let previous: Record<string, unknown>;
  try { previous = tables(storage); } catch (e) { if (e instanceof SyntaxError) previous = {}; else throw e; }
  const entries = Object.entries(previous).filter(([key, value]) => key !== scope && valid(value)).slice(-7);
  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tables: Object.fromEntries([...entries, [scope, state]]) }));
}
