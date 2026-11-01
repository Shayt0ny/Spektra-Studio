import { expect, test } from '@playwright/test';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { FrameDecoder, encodeFrame } from '../../src/shared/framing';

const dir = process.env.SPEKTRALAB_HOST_DIR, python = process.env.SPEKTRALAB_TEST_PYTHON;
test.skip(!dir || !python || !existsSync(join(dir, 'spektralab-host.exe')), 'requires staged native Vulkan host and owned Pillow fixture');

test('native lighttable pixels agree with file output after local mask, crop and turn; editor session survives', async ({ page }) => {
  test.setTimeout(120000);
  const work = mkdtempSync(join(tmpdir(), 'spektra-lighttable-')), source = join(work, 'owned.png'), target = join(work, 'check.png');
  execFileSync(python!, ['-c', 'from PIL import Image; import sys; im=Image.new("RGB",(160,120)); im.putdata([(x*255//159,y*255//119,(x+y)*255//278) for y in range(120) for x in range(160)]); im.save(sys.argv[1])', source]);
  const child = spawn(join(dir!, 'spektralab-host.exe'), ['--resources', join(dir!, 'engine')], { stdio: ['pipe', 'pipe', 'ignore'] });
  const decoder = new FrameDecoder(); let id = 0;
  const pending = new Map<number, { resolve(value: { result: Record<string, unknown>; pixels: number[] }): void; reject(error: Error): void }>();
  child.stdout.on('data', (data: Buffer) => {
    for (const frame of decoder.push(new Uint8Array(data))) {
      const h = frame.header as { id: number; ok: boolean; result: Record<string, unknown>; error: unknown }, waiter = pending.get(h.id); pending.delete(h.id);
      if (!waiter) continue;
      if (!h.ok) waiter.reject(new Error(JSON.stringify(h.error))); else waiter.resolve({ result: h.result, pixels: Array.from(frame.payload) });
    }
  });
  child.on('exit', () => { for (const waiter of pending.values()) waiter.reject(new Error('Native host exited')); pending.clear(); });
  const call = (method: string, params: Record<string, unknown> = {}) => new Promise<{ result: Record<string, unknown>; pixels: number[] }>((resolve, reject) => {
    const request = ++id; pending.set(request, { resolve, reject }); child.stdin.write(encodeFrame({ id: request, method, params }));
  });
  try {
    const hello = (await call('hello')).result, editor = (await call('open', { path: source, params: { grain_active: false, glare_active: false } })).result.session;
    const editorBefore = await call('render_view', { session: editor, tier: 'full', format: 'rgba8', display: 'srgb', generation: 1 });
    await page.exposeFunction('nativeReviewCall', (method: string, params: Record<string, unknown>) => call(method, params));
    await page.goto('/');
    const pixels = await page.evaluate(async ({ source, hello }) => {
      // @ts-expect-error Vite source.
      const { host } = await import('/src/host/client.ts');
      // @ts-expect-error Vite source.
      const { sessionStore } = await import('/src/state/session.ts');
      // @ts-expect-error Vite source.
      const { newSidecar } = await import('/src/shared/sidecar.ts');
      // @ts-expect-error Vite source.
      const { newLocalMask } = await import('/src/shared/localMasks.ts');
      // @ts-expect-error Vite source.
      const { featureGate } = await import('/src/shared/params.ts');
      // @ts-expect-error Vite source.
      const { reviewLoader } = await import('/src/lighttable/loader.ts');
      const transport = host().transport;
      transport.request = async (method: string, params: Record<string, unknown>) => {
        const response = await (window as unknown as { nativeReviewCall(method: string, params: Record<string, unknown>): Promise<{ result: Record<string, unknown>; pixels: number[] }> }).nativeReviewCall(method, params);
        return { result: response.result, payload: new Uint8Array(response.pixels) };
      };
      const sidecar = newSidecar(), mask = newLocalMask('linear', 'owned-gradient'); mask.adjustments.exposure = 1;
      sidecar.params = { ...sidecar.params, grainActive: false, glareActive: false };
      sidecar.adjustments = { ...sidecar.adjustments, exposure: -.4, localMasks: [mask] };
      sidecar.geometry = { ...sidecar.geometry, crop: { x: .2, y: .1, width: .6, height: .8 }, quarterTurns: 1, flipH: true };
      const entry = { path: source, name: 'owned.png', size: 1, mtime_ms: 1 };
      sessionStore.setState({ frames: [entry], selection: source, sidecar, nativeSize: { width: 160, height: 120 }, metadata: null,
        hello, gate: featureGate([], false, true), engineSession: null });
      const before = JSON.stringify(sessionStore.getState().sidecar), loader = reviewLoader();
      const image = await loader.load(entry, 2048, true, new AbortController().signal);
      const canvas = new OffscreenCanvas(image.width, image.height), context = canvas.getContext('2d')!; context.drawImage(image.bitmap, 0, 0);
      const data = Array.from(context.getImageData(0, 0, image.width, image.height).data); image.bitmap.close();
      const unchanged = before === JSON.stringify(sessionStore.getState().sidecar);
      return { width: image.width, height: image.height, kind: image.kind, data, unchanged };
    }, { source, hello });
    expect(pixels.unchanged).toBe(true); expect(pixels.kind).toBe('developed');
    // Export the exact frozen request produced by the loader through a second
    // native call, with a file destination instead of a display payload.
    const request = await page.evaluate(async () => {
      // @ts-expect-error Vite source.
      const { captureExportFrames } = await import('/src/export/exporter.ts');
      // @ts-expect-error Vite source.
      const { sessionStore } = await import('/src/state/session.ts');
      // @ts-expect-error Vite source.
      const { fullDelta } = await import('/src/shared/params.ts');
      const s = sessionStore.getState(), frames = await captureExportFrames([s.selection], { path: s.selection, sidecar: s.sidecar, native: s.nativeSize, metadata: null }, s.catalog, s.gate, false);
      const frame = frames[0].frame;
      return { source_path: frame.path, params: fullDelta(frame.params, frame.gate, s.catalog), adjustments: frame.adjustments, geometry: frame.geometry, source_geometry: frame.sourceGeometry };
    });
    await call('export_frame', { ...request, path: target, format: 'png', color_space: 'srgb' });
    const exported = JSON.parse(execFileSync(python!, ['-c', 'from PIL import Image; import json,sys; im=Image.open(sys.argv[1]).convert("RGBA"); print(json.dumps({"width":im.width,"height":im.height,"data":list(im.tobytes())}))', target], { encoding: 'utf8' })) as typeof pixels;
    expect([pixels.width, pixels.height]).toEqual([exported.width, exported.height]);
    expect(pixels.data).toEqual(exported.data);
    const after = await call('render_view', { session: editor, tier: 'full', format: 'rgba8', display: 'srgb', generation: 2 });
    expect(after.pixels).toEqual(editorBefore.pixels);
  } finally { await call('shutdown').catch(() => {}); child.stdin.end(); }
});
