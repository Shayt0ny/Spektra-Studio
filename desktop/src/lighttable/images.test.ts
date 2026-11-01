import { describe, expect, it, vi } from 'vitest';
import { ReviewImagePool, type ReviewImage } from './images';
const picture = (size = 16): ReviewImage => ({ bitmap: { close: vi.fn() } as unknown as ImageBitmap, width: size, height: size, kind: 'camera' });
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('review resource lifetime', () => {
  it('deduplicates consumers and retains only bounded idle decoded pictures', async () => {
    const pool = new ReviewImagePool(1024), abort = new AbortController(), first = picture();
    const load = vi.fn(async () => first);
    const [a, b] = await Promise.all([pool.acquire('a', load, abort.signal), pool.acquire('a', load, abort.signal)]);
    expect(load).toHaveBeenCalledTimes(1); a.release(); b.release();
    const second = await pool.acquire('b', async () => picture(), abort.signal); second.release();
    await tick(); expect(pool.status.bytes).toBeLessThanOrEqual(1024);
    expect(first.bitmap.close).toHaveBeenCalledOnce(); pool.dispose(); expect(pool.status.bytes).toBe(0);
  });
  it('does not start a second RAW producer until an aborted first producer actually releases', async () => {
    const pool = new ReviewImagePool(), a = new AbortController(), b = new AbortController();
    let finish!: (image: ReviewImage) => void;
    const old = pool.acquire('old', () => new Promise((resolve) => { finish = resolve; }), a.signal).catch(() => null);
    a.abort(); const next = vi.fn(async () => picture());
    const pending = pool.acquire('new', next, b.signal);
    await tick(); expect(next).not.toHaveBeenCalled();
    const stale = picture(); finish(stale); await old; const lease = await pending;
    expect(stale.bitmap.close).toHaveBeenCalledOnce(); expect(next).toHaveBeenCalledOnce(); lease.release(); pool.dispose();
  });
  it('drops queued offscreen work and closes all pictures when the workspace exits', async () => {
    const pool = new ReviewImagePool(), a = new AbortController(), b = new AbortController();
    let finish!: (image: ReviewImage) => void;
    const active = pool.acquire('a', () => new Promise((resolve) => { finish = resolve; }), a.signal).catch(() => null);
    const load = vi.fn(async () => picture()), pending = pool.acquire('b', load, b.signal).catch(() => null);
    b.abort(); pool.dispose(); const late = picture(); finish(late); await Promise.all([active, pending]);
    expect(load).not.toHaveBeenCalled(); expect(late.bitmap.close).toHaveBeenCalledOnce(); expect(pool.status.bytes).toBe(0);
  });
});
