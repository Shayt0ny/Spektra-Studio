// SPDX-License-Identifier: GPL-3.0-or-later
// Camera-preview statistics, not RAW scene measurements or an AI quality score.
import type { FileEntry } from '../platform';
export const FACETS = ['color', 'warmth', 'brightness', 'content', 'saturation', 'contrast', 'orientation', 'format', 'pixels', 'quality', 'style', 'film'] as const;
export type Facet = typeof FACETS[number];
export type FilterValues = Partial<Record<Facet, string>>;
export interface VisualAnalysis { color: string; warmth: string; brightness: string; saturation: string; contrast: string; orientation: string; quality: string }
export interface LibraryPhoto { file: FileEntry; analysis?: VisualAnalysis; width?: number; height?: number; tags: string[]; style?: string; film?: string }
const classify = (v: number, low: number, high: number, a: string, b: string, c: string) => v < low ? a : v > high ? c : b;
export function analyzePreview(rgba: Uint8ClampedArray, width: number, height: number): VisualAnalysis {
  let sum = 0, squared = 0, saturation = 0, warmth = 0, edge = 0, edgeCount = 0;
  const colors = new Float64Array(8), luma = new Float64Array(width * height);
  const count = Math.max(1, width * height);
  for (let i = 0; i < width * height; i++) {
    const r = rgba[i * 4]! / 255, g = rgba[i * 4 + 1]! / 255, b = rgba[i * 4 + 2]! / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min, sat = max ? delta / max : 0;
    const y = .2126 * r + .7152 * g + .0722 * b; luma[i] = y; sum += y; squared += y * y; saturation += sat; warmth += r - b;
    if (delta > .06 && sat > .12) {
      const hue = ((max === r ? (g - b) / delta : max === g ? (b - r) / delta + 2 : (r - g) / delta + 4) * 60 + 360) % 360;
      colors[Math.floor((hue + 22.5) % 360 / 45)]! += sat;
    }
    if (i % width) { edge += Math.abs(y - luma[i - 1]!); edgeCount++; }
    if (i >= width) { edge += Math.abs(y - luma[i - width]!); edgeCount++; }
  }
  const mean = sum / count, deviation = Math.sqrt(Math.max(0, squared / count - mean * mean));
  const dominant = Array.from(colors).indexOf(Math.max(...colors));
  return { color: saturation / count < .12 ? 'neutral' : ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple', 'magenta'][dominant]!,
    warmth: classify(warmth / count, -.06, .06, 'cool', 'neutral', 'warm'),
    brightness: classify(mean, .28, .7, 'dark', 'normal', 'bright'),
    saturation: classify(saturation / count, .15, .55, 'muted', 'normal', 'vivid'),
    contrast: classify(deviation, .12, .28, 'soft', 'normal', 'hard'),
    orientation: Math.abs(width / height - 1) < .03 ? 'square' : width > height ? 'landscape' : 'portrait',
    quality: classify(edge / Math.max(1, edgeCount), .018, .075, 'low', 'medium', 'high') };
}
export function facetValues(photo: LibraryPhoto, facet: Facet): string[] {
  if (facet === 'content') return photo.tags.length ? photo.tags : ['untagged'];
  if (facet === 'format') return [photo.file.name.split('.').at(-1)?.toUpperCase() ?? 'unknown'];
  if (facet === 'pixels') {
    if (!photo.width || !photo.height) return ['unknown'];
    const mp = photo.width * photo.height / 1e6; return [mp < 12 ? 'under12' : mp < 24 ? '12to24' : mp < 45 ? '24to45' : '45plus'];
  }
  if (facet === 'style') return [photo.style ?? 'unknown'];
  if (facet === 'film') return [photo.film ?? 'unknown'];
  return [photo.analysis?.[facet] ?? 'unknown'];
}
export function filterPhotos(photos: LibraryPhoto[], filters: FilterValues, search: string, except?: Facet) {
  const words = search.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return photos.filter((p) => words.every((word) => `${p.file.name} ${p.tags.join(' ')}`.toLocaleLowerCase().includes(word)) &&
    FACETS.every((facet) => facet === except || !filters[facet] || facetValues(p, facet).includes(filters[facet]!)));
}
export function facetCounts(photos: LibraryPhoto[], filters: FilterValues, search: string) {
  return Object.fromEntries(FACETS.map((facet) => {
    const counts: Record<string, number> = {};
    for (const p of photos) for (const value of facetValues(p, facet)) counts[value] ??= 0;
    for (const p of filterPhotos(photos, filters, search, facet)) for (const value of facetValues(p, facet)) counts[value] = (counts[value] ?? 0) + 1;
    return [facet, counts];
  })) as Record<Facet, Record<string, number>>;
}
