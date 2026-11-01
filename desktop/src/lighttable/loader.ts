// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Shared native snapshot/proof paths preserve masks, film edge and geometry;
// browsing never calls editor select/open, solve, sidecarSave or exportFrame.
import { host, type RgbaImage } from '../host/client';
import { type FileEntry, platform } from '../platform';
import { isPairPath } from '@shared/pair';
import { decodeSidecar } from '@shared/sidecar';
import { isRawPath } from '@shared/whiteBalance';
import { cachedReviewDisplay, sessionStore } from '../state/session';
import { settingsStore } from '../state/settings';
import { captureExportFrames, renderProof, type ExportJob, type SelectedExportFrame } from '../export/exporter';
import { DEFAULT_RECIPES } from '../export/recipes';
import { imageData, preview8 } from '../canvas/colorSpace';
import type { ReviewImage } from './images';
import { tz } from '../i18n';

function check(signal: AbortSignal) { if (signal.aborted) throw new DOMException('Cancelled', 'AbortError'); }
async function bitmap(image: RgbaImage, kind: ReviewImage['kind'], edge: number, signal: AbortSignal): Promise<ReviewImage> {
  check(signal);
  const ratio = Math.min(1, edge / Math.max(image.width, image.height));
  const w = Math.max(1, Math.round(image.width * ratio)), h = Math.max(1, Math.round(image.height * ratio));
  const pixels = imageData(preview8(image, w, h));
  const canvas = new OffscreenCanvas(w, h), ctx = canvas.getContext('2d', { colorSpace: 'srgb' })!;
  ctx.putImageData(pixels, 0, 0);
  const result = canvas.transferToImageBitmap(); canvas.width = 1; canvas.height = 1;
  if (signal.aborted) { result.close(); check(signal); }
  return { bitmap: result, width: w, height: h, kind };
}

/** Frozen at entry, including unsaved edits, while the editor stays mounted. */
export function reviewLoader() {
  const s = sessionStore.getState(), preferences = settingsStore.getState();
  const selected: SelectedExportFrame | null = s.selection ? structuredClone({ path: s.selection, sidecar: s.sidecar,
    native: s.nativeSize ?? undefined, metadata: s.metadata, pair: s.pair, pairInfo: s.pairInfo }) : null;
  const catalog = s.catalog, gate = structuredClone(s.gate), methods = [...(s.hello?.methods ?? [])], frameOptions = s.hello?.frame_options;
  const version = JSON.stringify([s.imageVersion, s.selection, s.sidecar, preferences.recalculateEffectsAfterCrop]);
  const recipe = async (file: FileEntry) => file.path === selected?.path ? selected.sidecar : decodeSidecar(await platform().sidecarLoad(file.path));
  return { version, recipe, async load(file: FileEntry, edge: number, developed: boolean, signal: AbortSignal): Promise<ReviewImage> {
    check(signal);
    if (!developed && !isPairPath(file.path)) {
      // No fallback to a full RAW decode for contact sheets or film rolls.
      const raw = isRawPath(file.path);
      if (raw && !s.hello?.thumbnail_options?.includes('embedded-only'))
        throw new Error(tz('No fast camera preview. Open this photo in the editor.', '没有快速相机预览，请在编辑器中打开此照片。'));
      return bitmap(await host().thumbnail(file.path, edge, raw), 'camera', edge, signal);
    }
    if (!developed) throw new Error(tz('Pair recipe — choose Developed in single view.', '拼接配方，请在单张模式选择“显影效果”。'));
    const saved = await recipe(file);
    check(signal);
    const cached = await cachedReviewDisplay(file.path, saved);
    check(signal);
    if (cached) return bitmap(cached, 'developed', edge, signal);
    const frames = await captureExportFrames([file.path], selected, catalog, gate, preferences.recalculateEffectsAfterCrop, () => signal.aborted);
    check(signal);
    const prepared = frames[0];
    if (!prepared || 'error' in prepared) throw new Error(prepared && 'error' in prepared ? prepared.error : 'No review frame');
    let active: ExportJob | null = null;
    const abort = () => { if (active) void host().cancel(active.session, active.progressId).catch(() => {}); };
    signal.addEventListener('abort', abort, { once: true });
    try {
      const result = await renderProof({ ...DEFAULT_RECIPES[2]!, longEdge: 0 }, prepared.frame, catalog, methods, 'srgb', edge, 1,
        { frameOptions, cancelled: () => signal.aborted, active: (job) => { active = job; if (signal.aborted) abort(); } });
      check(signal);
      if (!result) throw new DOMException('Cancelled', 'AbortError');
      return await bitmap(result, 'developed', edge, signal);
    } finally { signal.removeEventListener('abort', abort); }
  } };
}
