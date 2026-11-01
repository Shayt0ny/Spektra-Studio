import { describe, expect, it } from 'vitest';
import type { HelloResult } from '@shared/protocol';
import { amdPreviewDevice, previewFormat } from './previewFormat';
const hello = (value: object) => ({ view_formats: ['rgba8', 'rgba16'], source_formats: ['rgba8', 'rgba16'], ...value }) as HelloResult;

describe('preview transport policy', () => {
  it('recognizes AMD using legacy capability GPU names when the primary name is absent or blank', () => {
    for (const device_name of [undefined, '', '   ']) {
      const h = hello({ backend: { device_name }, capabilities: { backend: { gpu: 'radeon RX 6600' } } });
      expect(amdPreviewDevice(h)).toBe(true);
      expect(previewFormat(h, 'view')).toBe('rgba8'); expect(previewFormat(h, 'source')).toBe('rgba8');
    }
  });
  it('does not downgrade the active NVIDIA/Intel GPU based on other adapter or CPU information', () => {
    for (const device_name of ['NVIDIA GeForce RTX 4060', 'Intel Arc Graphics']) {
      const h = hello({ backend: { device_name }, build_info: 'AMD Ryzen workstation', capabilities: { backend: { gpu: 'AMD Radeon other adapter' } } });
      expect(amdPreviewDevice(h)).toBe(false); expect(previewFormat(h, 'view')).toBe('rgba16');
    }
  });
  it('preserves independent source/view negotiation and legacy eight-bit support', () => {
    const h = hello({ source_formats: ['rgba8'] });
    expect(previewFormat(h, 'view')).toBe('rgba16'); expect(previewFormat(h, 'source')).toBe('rgba8');
    expect(previewFormat(null, 'view')).toBe('rgba8'); expect(previewFormat(undefined, 'source')).toBe('rgba8');
  });
});
