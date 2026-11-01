// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// One producer at a time, including cancellation: a stale RAW must release
// its private host frame before another producer can begin.
export interface ReviewImage { bitmap: ImageBitmap; width: number; height: number; kind: 'camera' | 'developed' }
export interface ImageLease { image: ReviewImage; release(): void }
interface Entry { image: ReviewImage; bytes: number; refs: number }
type Loader = (signal: AbortSignal) => Promise<ReviewImage>;
interface Task { key: string; loader: Loader; priority: number; controller: AbortController; users: number;
  promise: Promise<Entry>; resolve(value: Entry): void; reject(error: unknown): void }
const cancelled = () => new DOMException('Cancelled', 'AbortError');
export class ReviewImagePool {
  private cache = new Map<string, Entry>();
  private tasks = new Map<string, Task>();
  private queue: Task[] = [];
  private active: Task | null = null;
  private bytes = 0;
  private closed = false;
  private cleanup: ReturnType<typeof setTimeout> | undefined;
  constructor(private cap = 64 * 1024 * 1024) {}
  retainOwner() { clearTimeout(this.cleanup); }
  releaseOwner() { this.cleanup = setTimeout(() => this.dispose(), 0); }
  get status() { return { bytes: this.bytes, entries: this.cache.size, active: this.active ? 1 : 0, queued: this.queue.length }; }
  async acquire(key: string, loader: Loader, signal: AbortSignal, priority = 0): Promise<ImageLease> {
    if (this.closed || signal.aborted) throw cancelled();
    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key); this.cache.set(key, cached);
      return this.lease(cached);
    }
    let task = this.tasks.get(key);
    if (!task) {
      let resolve!: Task['resolve'], reject!: Task['reject'];
      const promise = new Promise<Entry>((yes, no) => { resolve = yes; reject = no; });
      task = { key, loader, priority, controller: new AbortController(), users: 0, promise, resolve, reject };
      this.tasks.set(key, task); this.queue.push(task);
    }
    task.priority = Math.max(task.priority, priority);
    task.users++;
    const request = task;
    return new Promise<ImageLease>((resolve, reject) => {
      let done = false;
      const finish = (error: unknown, entry?: Entry) => {
        if (done) return;
        done = true; signal.removeEventListener('abort', abort); request.users--;
        if (!request.users && this.tasks.get(key) === request) {
          request.controller.abort(); this.tasks.delete(key);
        }
        if (error) reject(error); else resolve(this.lease(entry!));
      };
      const abort = () => finish(cancelled());
      signal.addEventListener('abort', abort, { once: true });
      request.promise.then((entry) => finish(null, entry), (error) => finish(error));
      this.pump();
    });
  }
  private lease(entry: Entry): ImageLease {
    entry.refs++;
    let released = false;
    return { image: entry.image, release: () => { if (!released) { released = true; entry.refs--; this.trim(); } } };
  }
  private trim() {
    for (const [key, entry] of this.cache) {
      if (this.bytes <= this.cap && !this.closed) break;
      if (entry.refs) continue;
      this.cache.delete(key); this.bytes -= entry.bytes; entry.image.bitmap.close();
    }
  }
  private pump() {
    if (this.active || this.closed) return;
    this.queue.sort((a, b) => b.priority - a.priority);
    const task = this.queue.shift(); if (!task) return;
    if (task.controller.signal.aborted) { task.reject(cancelled()); this.pump(); return; }
    this.active = task;
    void (async () => {
      try {
        const image = await task.loader(task.controller.signal);
        if (task.controller.signal.aborted || this.closed) { image.bitmap.close(); throw cancelled(); }
        const entry = { image, refs: 0, bytes: image.width * image.height * 4 };
        this.cache.set(task.key, entry); this.bytes += entry.bytes;
        task.resolve(entry);
        // Promise consumers pin the entry before eviction runs.
        queueMicrotask(() => this.trim());
      } catch (e) { task.reject(e); }
      finally {
        if (this.tasks.get(task.key) === task) this.tasks.delete(task.key);
        this.active = null; this.pump();
      }
    })();
  }
  dispose() {
    this.closed = true; clearTimeout(this.cleanup);
    for (const task of this.tasks.values()) { task.controller.abort(); if (task !== this.active) task.reject(cancelled()); }
    this.tasks.clear(); this.queue = []; this.cap = 0; this.trim();
  }
}
