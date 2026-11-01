import { expect, test, type Page } from '@playwright/test';
import type { sessionStore } from '../../src/state/session';
type App = { sessionStore: typeof sessionStore };
const editor = (page: Page) => page.evaluate(() => {
  const s = (window as unknown as { __spk: App }).__spk.sessionStore.getState();
  return JSON.stringify({ selection: s.selection, picked: s.picked, sidecar: s.sidecar, undo: s.undo, redo: s.redo, view: s.view, original: s.showingOriginal, engine: s.engineSession });
});
async function open(page: Page) {
  await page.goto('/?open='); await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.getByTestId('lighttable-button').click(); await expect(page.getByTestId('lt-desk')).toBeVisible();
  await expect(page.getByTestId('lt-film').first().locator('canvas')).toBeVisible();
}
test('physical desk moves, resizes and rotates film, preserves placement, and leaves editor pixels and edits alone', async ({ page }) => {
  await open(page); const before = await editor(page), path = await page.getByTestId('lt-film').first().getAttribute('data-path');
  const film = page.locator(`[data-testid="lt-film"][data-path="${path}"]`), oldX = Number(await film.getAttribute('data-x'));
  const box = (await film.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 70, box.y + box.height / 2 + 18, { steps: 8 }); await page.mouse.up();
  await expect.poll(async () => Number(await film.getAttribute('data-x'))).toBeGreaterThan(oldX + 20);
  const x = await film.getAttribute('data-x'), width = Number(await film.getAttribute('data-width'));
  await page.getByRole('button', { name: 'Enlarge selected film', exact: true }).click();
  await expect.poll(async () => Number(await film.getAttribute('data-width'))).toBeGreaterThan(width);
  await page.getByTestId('lt-desk-rotate').click(); await expect(film).toHaveAttribute('data-turn', '1');
  await page.getByTestId('lt-desk-lamp').click(); await expect(page.getByTestId('lt-desk')).toHaveAttribute('data-lamp', 'false');
  await page.getByTestId('lt-close').click(); expect(await editor(page)).toBe(before);
  await page.getByTestId('lighttable-button').click();
  await expect(film).toHaveAttribute('data-x', x!); await expect(film).toHaveAttribute('data-turn', '1');
  await expect(page.getByTestId('lt-desk')).toHaveAttribute('data-lamp', 'false');
  await page.getByRole('button', { name: 'Neutral 100%', exact: true }).click(); await page.getByTestId('lt-desk-tile').click();
  await expect(film).toHaveAttribute('data-turn', '0'); expect(await editor(page)).toBe(before);
  await page.screenshot({ path: test.info().outputPath('physical-film-desk.png') });
});
test('loupe follows the photo after rotation and Escape closes it before leaving the desk', async ({ page }) => {
  await open(page); const before = await editor(page);
  await page.getByTestId('lt-desk-rotate').click(); await page.getByTestId('lt-desk-fit').click();
  await page.keyboard.press('v');
  const current = page.locator('[data-testid="lt-film"][aria-pressed="true"]'), box = (await current.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId('lt-desk-loupe')).toContainText('3× · Original');
  await page.screenshot({ path: test.info().outputPath('physical-film-desk-loupe.png') });
  await page.keyboard.press('Escape'); await expect(page.getByTestId('lt-desk-loupe-toggle')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByTestId('lighttable')).toBeVisible();
  await page.getByTestId('lt-desk-source').selectOption('developed');
  await expect(current).toContainText('DEVELOPED'); await expect(current).toHaveAttribute('data-preview-kind', 'developed');
  expect(await editor(page)).toBe(before);
  await page.keyboard.press('Escape'); await expect(page.getByTestId('lighttable')).not.toBeVisible(); expect(await editor(page)).toBe(before);
});
test('scattering keeps photo pixels intact, persists tilts and returns to a tidy table', async ({ page }) => {
  await open(page); const before = await editor(page);
  await expect.poll(() => page.locator('[data-testid="lt-film"][data-preview-kind="camera"]').count()).toBe(8);
  const pixels = () => page.getByTestId('lt-film').evaluateAll((films) => Object.fromEntries(films.map((film) => {
    const canvas = film.querySelector('canvas')!;
    return [film.getAttribute('data-path')!, canvas.toDataURL()];
  })));
  const originals = await pixels();
  await page.getByTestId('lt-desk-scatter').click();
  await expect.poll(async () => Number(await page.getByTestId('lt-film').first().getAttribute('data-tilt'))).not.toBe(0);
  expect(await pixels()).toEqual(originals); expect(await editor(page)).toBe(before);
  const positions = () => page.getByTestId('lt-film').evaluateAll((films) => films.map((film) =>
    [film.getAttribute('data-path'), film.getAttribute('data-x'), film.getAttribute('data-y'), film.getAttribute('data-tilt')]));
  const scattered = await positions();
  await page.screenshot({ path: test.info().outputPath('scattered-lightbox.png') });
  await page.getByTestId('lt-close').click(); await page.getByTestId('lighttable-button').click();
  await expect.poll(positions).toEqual(scattered);
  await page.getByTestId('lt-desk-scatter').click(); await expect.poll(positions).not.toEqual(scattered);
  await page.getByTestId('lt-desk-loupe-toggle').click();
  const selected = page.locator('[data-testid="lt-film"][aria-pressed="true"]'), box = (await selected.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.getByTestId('lt-desk-loupe')).toContainText('3× · Original');
  await page.getByTestId('lt-desk-tile').click();
  await expect.poll(async () => page.getByTestId('lt-film').evaluateAll((films) => films.every((film) => film.getAttribute('data-tilt') === '0'))).toBe(true);
  expect(await editor(page)).toBe(before);
});
test('five thousand RAWs stay in trays of twelve and camera review opens no render sessions', async ({ page }) => {
  await page.goto('/?open='); await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.evaluate(async () => {
    // @ts-expect-error Vite source module.
    const { host } = await import('/src/host/client.ts');
    const transport = host().transport, request = transport.request.bind(transport), calls: string[] = [];
    (window as unknown as { reviewCalls: string[] }).reviewCalls = calls;
    transport.request = (method: string, params: Record<string, unknown>) => { calls.push(method); return request(method, params); };
    const frames = Array.from({ length: 5000 }, (_, i) => ({ path: `/mock/review/${i}.NEF`, name: `${i}.NEF`, size: 1000 + i, mtime_ms: 1 }));
    (window as unknown as { __spk: App }).__spk.sessionStore.setState({ frames });
  });
  await page.getByTestId('lighttable-button').click(); await expect(page.getByTestId('lt-desk-page')).toHaveText('1 / 417 · 12 films');
  await expect(page.getByTestId('lt-film').first().locator('canvas')).toBeVisible(); expect(await page.getByTestId('lt-film').count()).toBeLessThanOrEqual(12);
  await page.getByRole('button', { name: 'Next tray →', exact: true }).click(); await expect(page.getByTestId('lt-desk-page')).toHaveText('2 / 417 · 12 films');
  await expect(page.getByTestId('lt-film').first()).toHaveAttribute('data-path', '/mock/review/13.NEF');
  expect(await page.getByTestId('lt-film').count()).toBeLessThanOrEqual(12);
  const calls = await page.evaluate(() => (window as unknown as { reviewCalls: string[] }).reviewCalls);
  expect(calls.filter((method) => ['open', 'open_pair', 'render_view', 'render_proof', 'export_frame', 'solve'].includes(method))).toEqual([]);
});
for (const language of ['english', 'simplifiedChinese']) for (const scale of [100, 130]) {
  test(`physical desk fits small screens: ${language} ${scale}%`, async ({ page }) => {
    await page.addInitScript(({ language, scale }) => localStorage.setItem('ui2.settings', JSON.stringify({ language, interfaceScale: scale })), { language, scale });
    await page.setViewportSize({ width: 1100, height: 680 }); await open(page);
    const report = await page.getByTestId('lighttable').evaluate((el) => ({ overflow: el.scrollWidth > el.clientWidth + 1,
      surface: el.querySelector('[data-testid="lt-desk-surface"]')!.getBoundingClientRect().height,
      bottom: el.querySelector('.lt-desk-bottom')!.getBoundingClientRect().bottom,
      stage: el.querySelector('.lt-stage')!.getBoundingClientRect().bottom }));
    expect(report.overflow).toBe(false); expect(report.surface).toBeGreaterThan(130); expect(report.bottom).toBeLessThanOrEqual(report.stage + 1);
    await page.screenshot({ path: test.info().outputPath(`physical-desk-${language}-${scale}.png`) });
  });
}
