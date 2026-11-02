// @vitest-environment jsdom
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ReviewImagePool, type ReviewImage } from './images';
import { useImage, type Images } from './preview';
import type { FileEntry } from '../platform';

const file = (name: string): FileEntry => ({ path: `/owned/${name}`, name, size: 100, mtime_ms: 10 });
const picture = (width: number): ReviewImage => ({ bitmap: { close: vi.fn() } as unknown as ImageBitmap, width, height: width, kind: 'camera' });
let node: HTMLDivElement, root: Root, pool: ReviewImagePool;
function Picture({ source, edge, images }: { source: FileEntry | null; edge: number; images: Images }) {
  const result = useImage(source, edge, false, images);
  return <output>{result?.image?.width ?? 'waiting'}</output>;
}
beforeEach(() => {
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  node = document.createElement('div'); document.body.append(node); root = createRoot(node); pool = new ReviewImagePool();
});
afterEach(async () => { await act(async () => root.unmount()); pool.dispose(); node.remove(); });

it('marks an already decoded cache hit ready without another load event or decode', async () => {
  const load = vi.fn(async () => picture(64));
  const images = { pool, loader: { load, version: 'recipe-1' } } as Images;
  await act(async () => root.render(<Picture source={file('a.ARW')} edge={64} images={images} />));
  expect(node.textContent).toBe('64');
  await act(async () => root.render(<Picture source={null} edge={64} images={images} />));
  await act(async () => root.render(<Picture source={file('a.ARW')} edge={64} images={images} />));
  expect(node.textContent).toBe('64'); expect(load).toHaveBeenCalledOnce();
});

it('rejects a late larger candidate after switching photos and serializes its replacement', async () => {
  let finish!: (image: ReviewImage) => void;
  const load = vi.fn(async (_file: FileEntry, edge: number) => edge === 128 && load.mock.calls.length === 2
    ? new Promise<ReviewImage>((resolve) => { finish = resolve; }) : picture(edge));
  const images = { pool, loader: { load, version: 'recipe-1' } } as Images;
  await act(async () => root.render(<Picture source={file('a.ARW')} edge={64} images={images} />));
  expect(node.textContent).toBe('64');
  await act(async () => root.render(<Picture source={file('a.ARW')} edge={128} images={images} />));
  expect(node.textContent).toBe('waiting');
  await act(async () => root.render(<Picture source={file('b.ARW')} edge={256} images={images} />));
  expect(node.textContent).toBe('waiting'); expect(load).toHaveBeenCalledTimes(2);
  const stale = picture(128); await act(async () => finish(stale));
  expect(stale.bitmap.close).toHaveBeenCalledOnce();
  expect(node.textContent).toBe('256'); expect(load).toHaveBeenCalledTimes(3);
  expect(pool.status).toMatchObject({ active: 0, queued: 0 });
});
