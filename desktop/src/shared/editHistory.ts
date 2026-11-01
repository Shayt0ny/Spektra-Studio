// SPDX-License-Identifier: GPL-3.0-or-later
// Bounded per-photo history; saved atomically in the same sidecar as its head.
import { type Sidecar, type DecodeSettings, newSidecar, decodeSidecar } from './sidecar';
import type { FilmParams } from './params';
import type { Adjustments } from './adjustments';
import { type Geometry, encodeGeometry } from './geometry';
import { type HalfFramePair, decodePair, encodePair } from './pair';
export interface UndoEntry {
  noFilm?: boolean; filmStrength?: number; params: FilmParams; adjustments: Adjustments; geometry: Geometry;
  heldCrop?: Geometry | null; pair?: HalfFramePair | null; decode: DecodeSettings; placementNeedsFit?: boolean;
}
export function historyEntry(sidecar: Sidecar, pair: HalfFramePair | null): UndoEntry {
  return { noFilm: sidecar.noFilm, filmStrength: sidecar.filmStrength, params: sidecar.params, adjustments: sidecar.adjustments, geometry: sidecar.geometry,
    heldCrop: sidecar.heldCrop ?? null, pair, decode: sidecar.decode, placementNeedsFit: sidecar.placementNeedsFit };
}
function encode(entry: UndoEntry) {
  return { noFilm: entry.noFilm ?? false, ...(entry.filmStrength === undefined ? {} : { filmStrength: entry.filmStrength }), params: entry.params, adjustments: entry.adjustments,
    geometry: encodeGeometry(entry.geometry), heldCrop: entry.heldCrop ? encodeGeometry(entry.heldCrop) : null,
    pair: entry.pair ? encodePair(entry.pair) : null, decode: entry.decode, placementNeedsFit: entry.placementNeedsFit ?? false };
}
function stamp(entry: UndoEntry) {
  const sorted=(v:unknown):unknown=>Array.isArray(v)?v.map(sorted):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>[k,sorted(x)])):v;
  const text = JSON.stringify(sorted(encode(entry))); let a = 2166136261, b = 2654435769;
  for (let i = 0; i < text.length; i++) { a = Math.imul(a ^ text.charCodeAt(i), 16777619); b = Math.imul(b ^ text.charCodeAt(i), 2246822519); }
  return `${text.length}:${a >>> 0}:${b >>> 0}`;
}
export function encodeEditHistory(head: UndoEntry, undo: UndoEntry[], redo: UndoEntry[]) {
  let budget = 2 * 1024 * 1024;
  const pack = (entries: UndoEntry[]) => {
    const out: ReturnType<typeof encode>[] = [];
    for (const entry of entries.slice(-60).toReversed()) {
      const value = encode(entry), size = JSON.stringify(value).length;
      if (size > budget) break; budget -= size; out.unshift(value);
    }
    return out;
  };
  return { version: 1, head: stamp(head), undo: pack(undo), redo: pack(redo) };
}
export function decodeEditHistory(raw: unknown, head: UndoEntry): { undo: UndoEntry[]; redo: UndoEntry[] } {
  const empty = { undo: [] as UndoEntry[], redo: [] as UndoEntry[] };
  if (!raw || typeof raw !== 'object') return empty;
  const data = raw as Record<string, unknown>;
  if (data.version !== 1 || data.head !== stamp(head)) return empty;
  const decode = (entries: unknown) => {
    if (!Array.isArray(entries) || entries.length > 60 || JSON.stringify(entries).length > 2 * 1024 * 1024) return [];
    const out: UndoEntry[] = [];
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object' || !entry.params || !entry.adjustments || !entry.geometry || !entry.decode) return [];
      const sidecar = decodeSidecar({ ...newSidecar(), ...entry });
      out.push({ ...historyEntry(sidecar, entry.pair ? decodePair(entry.pair) : null),
        ...(typeof entry.filmStrength === 'number' && entry.filmStrength >= 0 && entry.filmStrength <= 1 ? { filmStrength: entry.filmStrength } : {}) });
    }
    return out;
  };
  return { undo: decode(data.undo), redo: decode(data.redo) };
}
