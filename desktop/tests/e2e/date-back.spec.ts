import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';

test('custom date/time and percentage scale remain editable through photo changes', async ({ page }) => {
  await page.goto('/?open=&allFeatures=1');
  await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 20_000 });
  const section = page.locator('[data-section=dateBack]');
  if (!await page.getByTestId('date-back-enable').isVisible()) await section.locator('.disclosure').click();
  await page.getByTestId('date-back-enable').click();
  await page.getByTestId('date-back-custom').click();
  await page.getByTestId('date-back-datetime').fill('2026-11-02T18:45');
  await page.getByTestId('date-back-content').click();
  await page.getByRole('menuitem', { name: 'Date and time', exact: true }).click();
  const size = page.getByTestId('date-back-size').locator('input');
  await size.fill('170 %'); await size.press('Enter');
  const read = () => page.evaluate(() => {
    return (window as unknown as { __spk: { sessionStore: { getState(): { sidecar: { params: { dateBack: unknown } } } } } }).__spk.sessionStore.getState().sidecar.params.dateBack;
  });
  await expect.poll(read).toMatchObject({ customDateTime: '2026-11-02T18:45', content: 'date_time', size: 1.7, text: "'26 11 2 18:45" });
  await page.evaluate(async () => {
    // @ts-expect-error Vite source module.
    const { setParams } = await import('/src/state/session.ts');
    setParams((p: Record<string, unknown>) => ({ ...p, exposureCompensationEV: 1.5 }));
  });
  await expect.poll(read).toMatchObject({ customDateTime: '2026-11-02T18:45', size: 1.7, text: "'26 11 2 18:45" });
  await expect(size).toHaveValue('170 %');
  await expect(page.getByTestId('date-back-datetime')).toHaveValue('2026-11-02T18:45');
  await section.screenshot({ path: resolve('../build/precision-fp64/date-controls.png') });
});
