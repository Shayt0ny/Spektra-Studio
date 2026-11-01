// SPDX-License-Identifier: GPL-3.0-or-later
// Workflow reference: Photo-All. Independent bounded Canvas2D implementation.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FileEntry } from '../platform';
import { tz } from '../i18n';
import type { ReviewImage } from './images';
import { useImage, type Images } from './preview';
import { filmAngle, filmBounds, type DeskState, type FilmPiece } from './desk';
import { lensBands, lensDiameter } from './lens';
import { reviewKey } from './review';

export function FilmLoupe({ file, pointer, area, images, developed, state, ordered, textures, revision, magnification, diameter, refractive }: {
  file: FileEntry | null; pointer: { x: number; y: number }; area: { width: number; height: number }; images: Images;
  developed: boolean; state: DeskState; ordered: FilmPiece[]; textures: Map<string, ReviewImage>; revision: number;
  magnification: number; diameter: number; refractive: boolean;
}) {
  const [settled, setSettled] = useState<FileEntry | null>(null), canvas = useRef<HTMLCanvasElement>(null);
  const scratch = useRef<HTMLCanvasElement | null>(null), side = lensDiameter(diameter, area);
  useEffect(() => { const timer = setTimeout(() => setSettled(file), 100); return () => clearTimeout(timer); }, [file]);
  const result = useImage(settled?.path === file?.path ? file : null, 2048, developed, images, 20);
  useLayoutEffect(() => {
    const node = canvas.current; if (!node) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1), pad = 24, extent = Math.round((side + pad * 2) * dpr);
    const sample = scratch.current ??= document.createElement('canvas');
    if (sample.width !== extent) sample.width = sample.height = extent;
    const ctx = sample.getContext('2d')!, target = node.getContext('2d')!;
    const output = Math.round(side * dpr); if (node.width !== output) node.width = node.height = output;
    ctx.resetTransform(); ctx.clearRect(0, 0, extent, extent);
    ctx.fillStyle = state.lamp ? `rgb(${Math.min(255, 238 * state.brightness)},${Math.min(255, 239 * state.brightness)},${Math.min(255, 237 * state.brightness)})` : '#515552';
    ctx.fillRect(0, 0, extent, extent);
    ctx.translate(extent / 2 - pointer.x * magnification * dpr, extent / 2 - pointer.y * magnification * dpr);
    ctx.scale(magnification * dpr, magnification * dpr);
    ctx.translate(state.view.x, state.view.y); ctx.scale(state.view.scale, state.view.scale);
    const center = { x: (pointer.x - state.view.x) / state.view.scale, y: (pointer.y - state.view.y) / state.view.scale };
    const reach = (side / 2 + pad) / (magnification * state.view.scale), brightness = state.lamp ? state.brightness : .12;
    for (const piece of ordered) {
      const b = filmBounds(piece);
      if (b.x > center.x + reach || b.x + b.width < center.x - reach || b.y > center.y + reach || b.y + b.height < center.y - reach) continue;
      const width = piece.width + 24, height = piece.width / piece.aspect + 48;
      ctx.save(); ctx.translate(piece.x + width / 2, piece.y + height / 2); ctx.rotate(filmAngle(piece) * Math.PI / 180);
      ctx.fillStyle = '#1c1a16'; ctx.fillRect(-width / 2, -height / 2, width, height);
      ctx.fillStyle = state.lamp ? '#dce0d6' : '#454b44';
      for (let x = -width / 2 + 8; x < width / 2 - 8; x += 21) {
        ctx.fillRect(x, -height / 2 + 4, Math.min(9, width / 2 - 8 - x), 7);
        ctx.fillRect(x, height / 2 - 11, Math.min(9, width / 2 - 8 - x), 7);
      }
      const image = file && piece.key === reviewKey(file) && result?.image ? result.image : textures.get(piece.key);
      if (image) {
        ctx.filter = brightness === 1 ? 'none' : `brightness(${brightness})`;
        ctx.drawImage(image.bitmap, -piece.width / 2, -(height - 48) / 2, piece.width, height - 48); ctx.filter = 'none';
      } else { ctx.fillStyle = '#121212'; ctx.fillRect(-piece.width / 2, -(height - 48) / 2, piece.width, height - 48); }
      ctx.fillStyle = '#c8a765'; ctx.font = '8px monospace';
      ctx.fillText('SPEKTRA', -width / 2 + 13, -height / 2 + 21); ctx.restore();
    }
    target.resetTransform(); target.clearRect(0, 0, output, output);
    const radius = output / 2;
    for (const band of lensBands(radius, refractive)) {
      target.save(); target.beginPath(); target.arc(radius, radius, band.outer, 0, Math.PI * 2);
      if (band.inner) target.arc(radius, radius, Math.max(0, band.inner - .3), 0, Math.PI * 2, true);
      target.clip(); const width = extent * band.scale;
      target.drawImage(sample, (output - width) / 2, (output - width) / 2, width, width); target.restore();
    }
  }, [file, pointer, state, ordered, textures, revision, magnification, side, refractive, result]);
  useEffect(() => () => { if (scratch.current) scratch.current.width = scratch.current.height = 1; }, []);
  return <div className={`lt-desk-loupe ${refractive ? 'is-glass' : ''}`} data-testid="lt-desk-loupe" data-diameter={side} data-magnification={magnification} data-refractive={refractive}
    style={{ width: side + 12, height: side + 12, left: Math.max(0, Math.min(area.width - side - 12, pointer.x - side / 2 - 6)), top: Math.max(0, Math.min(area.height - side - 40, pointer.y - side / 2 - 6)) }}>
    <canvas ref={canvas} style={{ width: side, height: side }} />
    <span>{`${magnification}× · ${developed ? tz('Developed', '显影') : tz('Original', '原片')}`}{file && !result?.image ? result?.error ? ` · ${tz('Preview unavailable', '预览不可用')}` : ` · ${tz('Loading detail…', '加载细节…')}` : ''}</span>
  </div>;
}
