import { expect, test, type Page } from '@playwright/test';

interface HistogramJob { worker: Worker; data: { id: number; px: Uint8Array } }
declare global {
  interface Window { histogramJobs: HistogramJob[]; finishHistogram(index: number): void }
}

// Hold real readbacks at the worker boundary so completion order is controlled.
async function setup(page: Page) {
  await page.addInitScript(() => {
    const NativeWorker = window.Worker;
    const pending: { worker: Worker; data: { id: number; px: Uint8Array } }[] = [];
    Object.assign(window, { histogramJobs: pending, finishHistogram(index: number) {
      const job = pending.splice(index, 1)[0]!;
      const h = { r: new Uint32Array(256), g: new Uint32Array(256), b: new Uint32Array(256), y: new Uint32Array(256) };
      for (let i = 0; i < job.data.px.length; i += 4) {
        const [r, g, b] = job.data.px.subarray(i, i + 3);
        h.r[r!]!++; h.g[g!]!++; h.b[b!]!++; h.y[Math.round(.2126 * r! + .7152 * g! + .0722 * b!)]!++;
      }
      job.worker.onmessage?.({ data: { id: job.data.id, h } } as MessageEvent);
    } });
    window.Worker = class {
      onmessage: Worker['onmessage'] = null;
      constructor(url: string | URL, options?: WorkerOptions) {
        if (!String(url).includes('histogram.worker')) return new NativeWorker(url, options);
      }
      postMessage(data: { id: number; px: Uint8Array }) { pending.push({ worker: this as unknown as Worker, data }); }
      terminate() {}
    } as unknown as typeof Worker;
  });
  await page.goto('/?open=');
  await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 20_000 });
  await page.evaluate(async () => {
    // @ts-expect-error Vite source module.
    const { sessionStore } = await import('/src/state/session.ts');
    // @ts-expect-error Vite source module.
    const { frameImages } = await import('/src/state/frames.ts');
    const image = (r: number, b: number) => ({ width: 16, height: 16, format: 'rgba8', colorSpace: 'srgb',
      data: new Uint8Array(Array.from({ length: 256 }, () => [r, 0, b, 255]).flat()) });
    frameImages.print = { ...frameImages.print, ...image(220, 0) };
    frameImages.original = image(0, 220);
    sessionStore.setState((s: { imageVersion: number }) => ({ imageVersion: s.imageVersion + 1, showingOriginal: false }));
  });
  await expect.poll(() => latestPixel(page, 0)).toBeGreaterThan(180);
  await expect.poll(async () => { await finishAll(page); return page.getByTestId('histogram').isVisible(); }).toBe(true);
}

const jobs = (page: Page) => page.evaluate(() => window.histogramJobs.length);
const latestPixel = (page: Page, channel: number) => page.evaluate((c) => window.histogramJobs.at(-1)?.data.px[c] ?? -1, channel);
const finishAll = (page: Page) => page.evaluate(async () => {
  while (window.histogramJobs.length) window.finishHistogram(0);
  await new Promise(requestAnimationFrame);
});
const paths = (page: Page) => page.getByTestId('histogram').locator('path').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('d')?.match(/L[\d.]+ 0.0/g)));

const original = (page: Page, on: boolean) => page.evaluate(async (showingOriginal) => {
  // @ts-expect-error Vite source module.
  const { sessionStore } = await import('/src/state/session.ts');
  sessionStore.setState({ showingOriginal });
}, on);

test('histogram follows Original and returns to the processed photo', async ({ page }) => {
  await setup(page);
  await expect(page.getByTestId('histogram')).toBeVisible();
  const processed = await paths(page);
  await original(page, true);
  await expect.poll(() => latestPixel(page, 2)).toBeGreaterThan(180);
  await finishAll(page);
  await expect.poll(() => paths(page)).not.toEqual(processed);
  await original(page, false);
  await expect.poll(() => latestPixel(page, 0)).toBeGreaterThan(180);
  await finishAll(page);
  await expect.poll(() => paths(page)).toEqual(processed);
});

test('late histogram work cannot overwrite the final edit or revive a cleared frame', async ({ page }) => {
  await setup(page);
  const replace = (blue: boolean) => page.evaluate(async (b) => {
    // @ts-expect-error Vite source module.
    const { frameImages } = await import('/src/state/frames.ts');
    // @ts-expect-error Vite source module.
    const { sessionStore } = await import('/src/state/session.ts');
    const data = frameImages.print.data.slice();
    for (let i = 0; i < data.length; i += 4) { data[i] = b ? 0 : 220; data[i + 2] = b ? 220 : 0; }
    frameImages.print = { ...frameImages.print, data };
    sessionStore.setState((s: { imageVersion: number }) => ({ imageVersion: s.imageVersion + 1 }));
  }, blue);
  await replace(false); await expect.poll(() => jobs(page)).toBe(1);
  await replace(true); await expect.poll(() => jobs(page)).toBe(2);
  await page.evaluate(async () => { window.finishHistogram(1); await new Promise(requestAnimationFrame); });
  await expect(page.getByTestId('histogram')).toBeVisible();
  const final = await paths(page);
  await finishAll(page);
  await expect.poll(() => paths(page)).toEqual(final);
  await replace(false); await expect.poll(() => jobs(page)).toBe(1);
  await page.evaluate(async () => {
    // @ts-expect-error Vite source module.
    const { frameImages } = await import('/src/state/frames.ts');
    // @ts-expect-error Vite source module.
    const { sessionStore } = await import('/src/state/session.ts');
    frameImages.print = null; frameImages.original = null;
    sessionStore.setState((s: { imageVersion: number }) => ({ imageVersion: s.imageVersion + 1 }));
  });
  await expect(page.getByTestId('histogram')).toHaveCount(0);
  await finishAll(page);
  await expect(page.getByTestId('histogram')).toHaveCount(0);
});
