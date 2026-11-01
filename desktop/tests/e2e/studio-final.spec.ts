import { expect,test,type Page } from '@playwright/test';
import type { SessionState } from '../../src/state/session';
import type { Geometry } from '../../src/shared/geometry';
interface AppWindow { __spk:{sessionStore:{getState():SessionState}} }
const open=async(page:Page)=>{await page.goto('/?open=&allFeatures=1');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});};
test('whole-film strength, RAW auto, HSL/detail and persisted undo are usable from their panels',async({page})=>{
  await open(page);
  const overall=page.getByTestId('overall-film-strength').locator('input');await overall.fill('20');await overall.press('Enter');
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.filmStrength)).toBe(.2);
  await page.getByRole('tab',{name:'RAW tone',exact:true}).click();
  const raw=page.getByTestId('raw-exposure').locator('input');await raw.fill('-1');await raw.press('Enter');
  await expect(page.getByTestId('raw-auto-tone')).toBeEnabled();await page.getByTestId('raw-auto-tone').click();
  await expect(page.getByTestId('raw-auto-message')).toContainText('Automatic tone applied');
  await page.waitForTimeout(850);await page.reload();await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await expect(page.getByTestId('raw-exposure').locator('input')).toHaveValue('+0.35 EV');await page.keyboard.press('Control+z');
  await expect(page.getByTestId('raw-exposure').locator('input')).toHaveValue('-1.00 EV');
  await page.getByRole('tab',{name:'Post-Dev',exact:true}).click();const sat=page.getByTestId('hsl-saturation').locator('input');await sat.fill('-50');await sat.press('Enter');
  const texture=page.getByTestId('detail-texture').locator('input');await texture.fill('50');await texture.press('Enter');
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.adjustments.texture)).toBe(50);
  await page.screenshot({path:test.info().outputPath('neutral-hsl-detail.png')});
});
test('shareable presets have one visible menu with safe recipe import and clearly labelled paper LUT',async({page})=>{
  await open(page);
  await page.evaluate(async()=>{const path='/src/platform/index.ts',p=(await import(path)).platform();p.pickSave=async()=>'/owned/shared.spektra-recipe.json';p.pickFiles=async()=>['/owned/shared.spektra-recipe.json'];});
  await page.getByTestId('recipe-menu').click();await expect(page.getByRole('menuitem',{name:'Save paper LUT (.cube)…'})).toBeEnabled();
  await expect(page.getByText('It is not the complete final look.',{exact:false})).toBeVisible();
  await page.getByRole('menuitem',{name:'Save preset / recipe to share…'}).click();
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().status)).toContain('Portable recipe exported');
  await page.getByTestId('overall-film-strength').locator('input').fill('40');await page.getByTestId('overall-film-strength').locator('input').press('Enter');
  await page.getByTestId('recipe-menu').click();await page.getByRole('menuitem',{name:'Import preset / recipe…'}).click();
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.filmStrength)).toBe(1);
});
test('square framing survives border toggles and realistic lightbox is optional without photo changes',async({page})=>{
  await open(page);
  await page.evaluate(async()=>{const path='/src/state/session.ts',m=await import(path);m.setGeometry((g:Geometry)=>({...g,aspect:'square',crop:{x:.2,y:.15,width:.4,height:.6}}));});
  await page.getByTestId('film-edge-enable').click();await expect(page.getByTestId('film-edge-follow-crop')).toHaveAttribute('aria-checked','true');
  const g=await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.geometry);expect(g.crop).toEqual({x:.2,y:.15,width:.4,height:.6});
  await page.getByTestId('film-edge-enable').click();expect(await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.geometry.crop)).toEqual(g.crop);
  await page.getByTestId('lighttable-button').click();const realistic=page.getByTestId('lt-desk-realistic');await expect(realistic).not.toBeChecked();
  await realistic.check();await expect(page.getByTestId('lt-desk-surface')).toHaveClass(/is-realistic/);
  await page.screenshot({path:test.info().outputPath('optional-realistic-table.png')});
  await page.getByTestId('lt-close').click();expect(await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.geometry.crop)).toEqual(g.crop);
});
