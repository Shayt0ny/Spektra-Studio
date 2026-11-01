// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FileEntry } from '../platform';
import { reviewKey } from './review';
import type { reviewLoader } from './loader';
import type { ReviewImagePool, ReviewImage } from './images';
export interface Images { pool: ReviewImagePool; loader: ReturnType<typeof reviewLoader> }
export function useViewport() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, set] = useState({ width: 1, height: 1, x: 0, y: 0 });
  useLayoutEffect(() => {
    const node = ref.current; if (!node) return;
    let raf = 0;
    const measure = () => {
      raf = 0; const next = { width: node.clientWidth, height: node.clientHeight, x: node.scrollLeft, y: node.scrollTop };
      set((old) => Object.keys(next).every((k) => next[k as keyof typeof next] === old[k as keyof typeof old]) ? old : next);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const observer = new ResizeObserver(schedule); observer.observe(node); node.addEventListener('scroll', schedule, { passive: true }); measure();
    return () => { observer.disconnect(); node.removeEventListener('scroll', schedule); cancelAnimationFrame(raf); };
  }, []);
  return { ref, size };
}
export function useImage(file: FileEntry | null, edge: number, developed: boolean, images: Images, priority = 0) {
  const key = file ? `${reviewKey(file)}:${edge}:${developed ? images.loader.version : 'camera'}` : '';
  const [result, set] = useState<{ key: string; image?: ReviewImage; error?: string } | null>(null);
  useEffect(() => {
    if (!file) return;
    const abort = new AbortController(); let release: (() => void) | undefined;
    void images.pool.acquire(key, (signal) => images.loader.load(file, edge, developed, signal), abort.signal, priority)
      .then((lease) => {
        if (abort.signal.aborted) { lease.release(); return; }
        release = lease.release; set({ key, image: lease.image });
      }).catch((error: unknown) => { if (!abort.signal.aborted) set({ key, error: String(error) }); });
    return () => { abort.abort(); release?.(); };
    // Source identity and the frozen recipe are already in key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, images, priority]);
  return result?.key === key ? result : null;
}
