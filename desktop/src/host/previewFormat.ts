// Display transport only. AMD/Radeon drivers use the eight-bit compatibility
// path; working pixels, film rendering and file-output precision are unchanged.
import type { HelloResult } from '@shared/protocol';

export function amdPreviewDevice(hello: HelloResult | null | undefined): boolean {
  const primary = hello?.backend?.device_name;
  // The actual selected GPU wins on hybrid systems. Do not infer a GPU from
  // build_info, the CPU name, OS or a list of other installed adapters.
  const name = typeof primary === 'string' && primary.trim() ? primary : hello?.capabilities?.backend?.gpu;
  return typeof name === 'string' && /\b(?:amd|radeon)\b|advanced\s+micro\s+devices/i.test(name);
}

/** The request and its display-cache descriptor must use this same policy. */
export function previewFormat(hello: HelloResult | null | undefined, surface: 'view' | 'source'): 'rgba8' | 'rgba16' {
  if (amdPreviewDevice(hello)) return 'rgba8';
  const formats = surface === 'view' ? hello?.view_formats : hello?.source_formats;
  return formats?.includes('rgba16') ? 'rgba16' : 'rgba8';
}
