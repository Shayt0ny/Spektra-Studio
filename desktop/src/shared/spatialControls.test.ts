// Copyright (C) 2026 shayt0ny. SPDX-License-Identifier: GPL-3.0-or-later
import { expect, it } from 'vitest';
import { decodeFilmParams, delta, FILM_PARAMS_DEFAULT as defaults, fullDelta } from './params';
import { decodeSidecar, encodeSidecar, newSidecar } from './sidecar';
import { applyClip } from './clipboard';

it('old sidecars keep the existing spatial defaults and precise engine units', () => {
  expect(fullDelta(decodeFilmParams({}))).toMatchObject({ lens_blur_um: 0, grain_blur: .65,
    enlarger_lens_blur: 0, scanner_lens_blur: 0, scanner_unsharp_radius: .7, scanner_unsharp_amount: .7 });
});
it('persists all controls through sidecar JSON and routes film/print deltas', () => {
  const sidecar = newSidecar();
  sidecar.params = { ...defaults, cameraLensBlurUm: 5, grainBlur: 1.5, enlargerLensBlur: 2,
    scannerUnsharpRadius: 1.2, scannerUnsharpAmount: 0 };
  expect(decodeSidecar(JSON.parse(JSON.stringify(encodeSidecar(sidecar)))).params).toEqual(sidecar.params);
  expect([...delta({ ...defaults, cameraLensBlurUm: 5, grainBlur: 2 }, defaults).layers]).toEqual(['shoot']);
  expect([...delta({ ...defaults, enlargerLensBlur: 2, scannerUnsharpAmount: 0 }, defaults).layers]).toEqual(['print']);
  expect(fullDelta(sidecar.params)).toMatchObject({ lens_blur_um: 5, grain_blur: 1.5,
    enlarger_lens_blur: 2, scanner_unsharp_radius: 1.2, scanner_unsharp_amount: 0 });
});
it('copies film controls and scanner/enlarger controls only with their chosen group', () => {
  const source = newSidecar(), target = newSidecar();
  source.params = { ...defaults, cameraLensBlurUm: 5, grainBlur: 2, enlargerLensBlur: 3,
    scannerUnsharpRadius: 4, scannerUnsharpAmount: 1 };
  const film = applyClip({ groups: ['filmEffects'], settings: source, sourceName: 'test' }, target);
  expect(film.params).toMatchObject({ cameraLensBlurUm: 5, grainBlur: 2, enlargerLensBlur: 0, scannerUnsharpRadius: .7 });
  const print = applyClip({ groups: ['printEffects'], settings: source, sourceName: 'test' }, target);
  expect(print.params).toMatchObject({ cameraLensBlurUm: 0, grainBlur: .65, enlargerLensBlur: 3,
    scannerUnsharpRadius: 4, scannerUnsharpAmount: 1 });
});
it('guards imported limits while preserving zero as the explicit off value', () => {
  expect(decodeFilmParams({ cameraLensBlurUm: Infinity, grainBlur: NaN, enlargerLensBlur: -1,
    scannerUnsharpRadius: 100, scannerUnsharpAmount: 0 })).toMatchObject({ cameraLensBlurUm: 0,
    grainBlur: .65, enlargerLensBlur: 0, scannerUnsharpRadius: 20, scannerUnsharpAmount: 0 });
  expect(fullDelta({ ...defaults, enlargerLensBlur: 5, printEffects: false }).enlarger_lens_blur).toBe(0);
});
