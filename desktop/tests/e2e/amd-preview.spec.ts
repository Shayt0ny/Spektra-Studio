import { expect, test } from '@playwright/test';

for (const [device, format] of [['AMD Radeon RX 6600', 'rgba8'], ['NVIDIA GeForce RTX 4060', 'rgba16'], ['Intel(R) Arc(TM) Graphics', 'rgba16']]) {
  test(`preview compatibility policy: ${device} requests ${format}`, async ({ page }) => {
    await page.goto('/?open='); await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
    const actual = await page.evaluate(async ({ device }) => {
      // @ts-expect-error Vite source.
      const { host } = await import('/src/host/client.ts');
      // @ts-expect-error Vite source.
      const { sessionStore, setAdjustments, refreshOriginal } = await import('/src/state/session.ts');
      // @ts-expect-error Vite source.
      const { frameImages } = await import('/src/state/frames.ts');
      const connection = host(), state = await connection.state();
      const hello = { ...state.hello, backend: { ...state.hello.backend, device_name: device },
        view_formats: ['rgba8', 'rgba16'], source_formats: ['rgba8', 'rgba16'] };
      connection.transport.state = async () => ({ phase: 'ready', hello });
      sessionStore.setState({ hello });
      const request = connection.transport.request.bind(connection.transport), calls: { method: string; format: unknown }[] = [];
      connection.transport.request = (method: string, params: Record<string, unknown>) => {
        if (method === 'render_view' || method === 'render_source') calls.push({ method, format: params.format });
        return request(method, params);
      };
      setAdjustments((a: { exposure: number }) => ({ ...a, exposure: a.exposure + .2 }));
      await refreshOriginal();
      // Unchanged NVIDIA/Intel originals correctly avoid a redundant readback.
      // Exercise their native source request explicitly as well as checking
      // the image already published by the session.
      const source = await connection.renderSource(sessionStore.getState().engineSession, { long_edge: 512, display: 'srgb', generation: 901 });
      const end = performance.now() + 15000;
      while ((sessionStore.getState().developing || frameImages.print?.format !== calls.find((c) => c.method === 'render_view')?.format) && performance.now() < end)
        await new Promise((resolve) => setTimeout(resolve, 25));
      return { calls, print: frameImages.print?.format, original: frameImages.original?.format, source: source.format, error: sessionStore.getState().lastError };
    }, { device });
    expect(actual.calls.some((c) => c.method === 'render_view')).toBe(true);
    expect(actual.calls.some((c) => c.method === 'render_source')).toBe(true);
    expect(actual.calls.every((c) => c.format === format), JSON.stringify(actual.calls)).toBe(true);
    expect(actual.print).toBe(format); expect(actual.original).toBe(format); expect(actual.source).toBe(format); expect(actual.error).toBeNull();
    await expect(page.getByTestId('canvas')).toBeVisible();
  });
}
