import { expect, test, type Page } from '@playwright/test';
import type { sessionStore } from '../../src/state/session';
type App = { sessionStore: typeof sessionStore };
const snapshot = (page: Page) => page.evaluate(() => {
  const s = (window as unknown as { __spk: App }).__spk.sessionStore.getState();
  return JSON.stringify({ selection: s.selection, picked: s.picked, sidecar: s.sidecar, undo: s.undo, redo: s.redo, view: s.view, original: s.showingOriginal, engine: s.engineSession });
});
async function open(page: Page) {
  await page.goto('/?open='); await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.getByTestId('lighttable-button').click(); await expect(page.getByTestId('lighttable')).toBeVisible();
  await expect(page.getByTestId('lighttable')).toContainText(/Marks saved locally|标记已保存在本机/);
}

test('independent review, shortcuts, marks and mode switches preserve the editor and survive reopening', async ({ page }) => {
  await open(page); const before = await snapshot(page);
  await page.getByTestId('lt-mode-grid').click();
  await expect(page.getByTestId('lt-grid').locator('canvas').first()).toBeVisible();
  await page.getByTestId('lt-mode-single').click();
  await page.keyboard.press('p'); await expect(page.getByTestId('lighttable')).toContainText('1 kept');
  await page.keyboard.press('x'); await page.keyboard.press('Control+z');
  await page.getByTestId('lt-mode-compare').click(); await expect(page.getByTestId('lt-detail')).toHaveCount(2);
  const pane = page.getByTestId('lt-detail-image').last(); await expect(pane.locator('canvas')).toBeVisible();
  const box = (await pane.boundingBox())!; await page.mouse.move(box.x + box.width * .7, box.y + box.height * .5); await page.mouse.wheel(0, -500);
  await expect(page.getByTestId('lt-zoom')).not.toHaveText('1.0×');
  await page.keyboard.press('Space'); await page.keyboard.press('c'); await page.keyboard.press('Control+e');
  await expect(page.getByTestId('export-page')).not.toBeVisible();
  expect(await snapshot(page)).toBe(before);
  await page.getByTestId('lt-mode-roll').click(); await expect(page.getByTestId('lt-roll')).toBeVisible();
  await page.getByTestId('lt-close').click(); await expect(page.getByTestId('lighttable')).not.toBeVisible(); expect(await snapshot(page)).toBe(before);
  await page.getByTestId('lighttable-button').click(); await expect(page.getByTestId('lighttable')).toContainText('1 kept');
  await page.screenshot({ path: test.info().outputPath('lighttable-contact-sheet.png') });
});

test('virtual grid and roll bound mounted pictures and never open RAW sessions for fast browsing', async ({ page }) => {
  await page.goto('/?open='); await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.evaluate(async () => {
    // @ts-expect-error Vite source module.
    const { host } = await import('/src/host/client.ts');
    const transport = host().transport, request = transport.request.bind(transport), calls: string[] = [];
    (window as unknown as { reviewCalls: string[] }).reviewCalls = calls;
    transport.request = (method: string, params: Record<string, unknown>) => { calls.push(method); return request(method, params); };
    const store = (window as unknown as { __spk: App }).__spk.sessionStore;
    const files = Array.from({ length: 5000 }, (_, i) => ({ path: `/mock/review/${i}.NEF`, name: `${i}.NEF`, size: 1000 + i, mtime_ms: 1 }));
    store.setState({ frames: files });
  });
  await page.getByTestId('lighttable-button').click(); await page.getByTestId('lt-mode-grid').click(); const grid = page.getByTestId('lt-grid');
  await expect(grid.locator('canvas').first()).toBeVisible(); expect(await grid.getByTestId('lt-card').count()).toBeLessThan(45);
  await grid.evaluate((el) => { el.scrollTop = 150000; });
  await expect.poll(() => grid.getByTestId('lt-card').first().getAttribute('data-path')).not.toBe('/mock/review/0.NEF');
  expect(await grid.getByTestId('lt-card').count()).toBeLessThan(45);
  await page.getByTestId('lt-mode-roll').click(); expect(await page.getByTestId('lt-roll').getByTestId('lt-card').count()).toBeLessThan(12);
  const calls = await page.evaluate(() => (window as unknown as { reviewCalls: string[] }).reviewCalls);
  expect(calls.filter((method) => ['open', 'open_pair', 'render_view', 'render_proof', 'export_frame', 'solve'].includes(method))).toEqual([]);
});

test('developed comparison does not alter editor recipes, and its synchronized views move together', async ({ page }) => {
  await open(page); const before = await snapshot(page);
  await page.getByTestId('lt-mode-compare').click(); await page.getByTestId('lt-source').selectOption('developed');
  await expect(page.getByTestId('lt-detail-image').locator('canvas')).toHaveCount(2, { timeout: 25000 });
  await expect(page.getByTestId('lt-detail').first()).toContainText('Developed preview');
  const pane = page.getByTestId('lt-detail-image').last(), box = (await pane.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.wheel(0, -600);
  await expect(page.getByTestId('lt-zoom')).not.toHaveText('1.0×');
  const scales = await page.getByTestId('lt-detail').evaluateAll((elements) => elements.map((el) => el.getAttribute('data-view-scale')));
  expect(scales[0]).toBe(scales[1]); expect(Number(scales[0])).toBeGreaterThan(1);
  expect(await snapshot(page)).toBe(before);
  await page.setViewportSize({ width: 1100, height: 680 });
  await page.screenshot({ path: test.info().outputPath('lighttable-comparison-small.png') });
  expect(await page.getByTestId('lighttable').evaluate((el) => el.scrollWidth > el.clientWidth + 1)).toBe(false);
  await page.getByTestId('lt-close').click(); expect(await snapshot(page)).toBe(before);
});

test('selected kept photos return for export only on an explicit action; marks never delete files', async ({ page }) => {
  await open(page); await page.getByTestId('lt-mark-keep').click();
  await page.getByRole('button', { name: 'Select kept & return', exact: true }).click();
  await expect(page.getByTestId('lighttable')).not.toBeVisible();
  const picked = await page.evaluate(() => (window as unknown as { __spk: App }).__spk.sessionStore.getState().picked);
  expect(picked).toHaveLength(1);
  await page.getByTestId('lighttable-button').click(); await page.getByTestId('lt-mode-single').click();
  await page.keyboard.press('ArrowRight'); const chosen = await page.getByTestId('lt-detail').getAttribute('data-path');
  await page.getByTestId('lt-edit').click(); await expect(page.getByTestId('lighttable')).not.toBeVisible();
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spk: App }).__spk.sessionStore.getState().selection)).toBe(chosen);
});

test('save failure remains visible, retains the mark and allows retry before leaving', async ({ page }) => {
  await open(page);
  await page.evaluate(async () => {
    // @ts-expect-error Vite source.
    const { platform } = await import('/src/platform/index.ts');
    const p = platform(), save = p.storeWrite.bind(p); let fail = true;
    p.storeWrite = async (area: string, name: string, value: unknown) => {
      if (area === 'Lighttable' && fail) throw new Error('Owned test: disk unavailable');
      return save(area, name, value);
    };
    (window as unknown as { allowReviewSave(): void }).allowReviewSave = () => { fail = false; };
  });
  await page.getByTestId('lt-mark-keep').click(); await expect(page.getByRole('alert')).toContainText('disk unavailable');
  await page.getByTestId('lt-close').click(); await expect(page.getByTestId('lighttable')).toBeVisible();
  await expect(page.getByTestId('lighttable')).toContainText('1 kept');
  await page.evaluate(() => (window as unknown as { allowReviewSave(): void }).allowReviewSave());
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect(page.getByTestId('lighttable')).toContainText('Marks saved locally');
  await page.getByTestId('lt-close').click(); await expect(page.getByTestId('lighttable')).not.toBeVisible();
});

test('fullscreen and immersive review restore the entry window state', async ({ page }) => {
  await open(page); await page.getByRole('button', { name: /Full screen/ }).click();
  await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(true);
  await page.keyboard.press('i'); await expect(page.getByRole('button', { name: /Show tools/ })).toBeVisible();
  await page.keyboard.press('i'); await page.getByTestId('lt-close').click();
  await expect(page.getByTestId('lighttable')).not.toBeVisible(); await expect.poll(() => page.evaluate(() => !!document.fullscreenElement)).toBe(false);
});

for (const language of ['english', 'simplifiedChinese']) for (const scale of [100, 115, 130]) {
  test(`small lighttable layout: ${language} ${scale}%`, async ({ page }) => {
    await page.addInitScript(({ language, scale }) => localStorage.setItem('ui2.settings', JSON.stringify({ language, interfaceScale: scale })), { language, scale });
    await page.setViewportSize({ width: 1100, height: 680 }); await open(page);
    await page.getByTestId('lt-mode-compare').click(); await expect(page.getByTestId('lt-detail-image').locator('canvas')).toHaveCount(2);
    const report = await page.getByTestId('lighttable').evaluate((el) => ({ overflow: el.scrollWidth > el.clientWidth + 1,
      height: el.querySelector('.lt-stage')!.getBoundingClientRect().height, close: el.querySelector('[data-testid="lt-close"]')!.getBoundingClientRect().bottom }));
    expect(report.overflow).toBe(false); expect(report.height).toBeGreaterThan(130); expect(report.close).toBeLessThan(680);
    await page.screenshot({ path: test.info().outputPath(`lighttable-${language}-${scale}.png`) });
  });
}
