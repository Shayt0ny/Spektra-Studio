// Copyright (C) 2026 shayt0ny. SPDX-License-Identifier: GPL-3.0-or-later
import { expect, test, type Page } from '@playwright/test';

async function enter(page: Page, id: string, value: string) {
  const input = page.getByTestId(id).locator('input');
  await input.fill(value); await input.press('Enter');
}
const params = (page: Page) => page.evaluate(() => {
  const w = window as unknown as { __spk: { sessionStore: { getState(): { sidecar: { params: Record<string, unknown> } } } } };
  return w.__spk.sessionStore.getState().sidecar.params;
});

test('spatial controls commit, reset, undo and disable without losing the recipe', async ({ page }) => {
  await page.goto('/?open=');
  await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.getByRole('tab', { name: 'Pre-Dev', exact: true }).click();
  const before = await params(page);
  for (const [id, value, key, expected] of [
    ['camera-lens-blur', '5', 'cameraLensBlurUm', 5], ['grain-blur', '1.2', 'grainBlur', 1.2],
    ['enlarger-lens-blur', '2', 'enlargerLensBlur', 2],
    ['scanner-unsharp-radius', '1.1', 'scannerUnsharpRadius', 1.1],
    ['scanner-unsharp-amount', '45', 'scannerUnsharpAmount', .45],
  ] as const) {
    await enter(page, id, value);
    await expect.poll(async () => (await params(page))[key]).toBe(expected);
  }
  await page.keyboard.press('Control+z');
  await expect.poll(async () => (await params(page)).scannerUnsharpAmount).toBe(before.scannerUnsharpAmount);
  // Double-click resets the radius to the model's existing 0.7, not zero.
  await page.getByTestId('scanner-unsharp-radius').getByRole('slider').dblclick();
  await expect.poll(async () => (await params(page)).scannerUnsharpRadius).toBe(.7);
  await page.getByTestId('grain-toggle').click();
  await expect(page.getByTestId('grain-blur').locator('input')).toBeDisabled();
  expect((await params(page)).grainBlur).toBe(1.2);
  await page.screenshot({ path: '../build/spatial-controls-ui.png' });
});

test('Chinese labels and zero sharpening remain available', async ({ page }) => {
  await page.goto('/?open=');
  await expect(page.getByTestId('tier-badge')).toHaveText('full', { timeout: 25000 });
  await page.evaluate(() => {
    const w = window as unknown as { __spk: { settingsStore: { getState(): { set(key: string, value: string): void } } } };
    w.__spk.settingsStore.getState().set('language', 'simplifiedChinese');
  });
  await expect(page.getByTestId('scanner-unsharp-radius')).toContainText('扫描锐化半径');
  await expect(page.getByTestId('enlarger-lens-blur')).toContainText('放大机镜头模糊');
  await enter(page, 'scanner-unsharp-amount', '0');
  await expect.poll(async () => (await params(page)).scannerUnsharpAmount).toBe(0);
});
