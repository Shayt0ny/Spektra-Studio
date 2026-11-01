import {test,expect,type Page} from '@playwright/test';
import type {SessionState} from '../../src/state/session';
interface AppWindow {__spk:{sessionStore:{getState():SessionState}}}
async function value(page:Page,id:string,v:string){const field=page.getByTestId(id).locator('input');await field.fill(v);await field.press('Enter');await expect(field).toBeEnabled();}
test('RAW page uses the whole source, native WB, independent colour controls and persistent undo',async({page})=>{
  await page.goto('/?open=&allFeatures=1');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  const tabs=page.getByTestId('right-rail').getByRole('tab');await expect(tabs).toHaveText(['RAW tone','Pre-Dev','Post-Dev']);
  await page.evaluate(async()=>{const path='/src/state/session.ts',m=await import(path);m.setGeometry((g:SessionState['sidecar']['geometry'])=>({...g,quarterTurns:1,crop:{x:.15,y:.15,width:.7,height:.5}}));});
  const baseline=await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar);
  await tabs.filter({hasText:'RAW tone'}).click();await expect(page.getByTestId('raw-page')).toBeVisible();
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().showingOriginal)).toBe(true);
  // The navigator must also show the whole RAW, without the rotated crop.
  await expect.poll(()=>page.getByTestId('navigator').locator('canvas').evaluate((c:HTMLCanvasElement)=>c.width/c.height)).toBeCloseTo(1.5,1);
  await value(page,'raw-wb-temperature','4300');await value(page,'raw-wb-tint','12');
  await value(page,'raw-balance-hue','220');await value(page,'raw-balance-saturation','0.2');
  await value(page,'raw-hsl-hue','15');await value(page,'raw-hsl-saturation','-30');
  const plot=page.getByTestId('raw-curve-editor');const box=await plot.boundingBox();expect(box).toBeTruthy();await plot.click({position:{x:box!.width*.5,y:box!.height*.35}});
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.decode.rawTone?.curves.rgb.points.length)).toBe(3);
  const edited=await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar);
  expect(edited.decode).toMatchObject({whiteBalance:'Custom',temperature:4300,tint:12,rawTone:{colorBalance:{master:{hue:220,saturation:.2}},hsl:{red:{hue:15,saturation:-30}}}});
  expect(edited.params).toEqual(baseline.params);expect(edited.adjustments).toEqual(baseline.adjustments);expect(edited.noFilm).toEqual(baseline.noFilm);
  await page.screenshot({path:test.info().outputPath('raw-colour-page.png')});
  await page.waitForTimeout(850);await page.reload();await expect(page.getByTestId('raw-page')).toBeVisible();await expect(page.getByTestId('raw-wb-tint').locator('input')).toHaveValue('+12.0');
  await page.keyboard.press('Control+z');await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.decode.rawTone?.curves.rgb.points.length)).toBe(2);
  await page.getByRole('tab',{name:'Pre-Dev',exact:true}).click();await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().showingOriginal)).toBe(false);
  await page.getByRole('tab',{name:'Post-Dev',exact:true}).click();await expect(page.getByTestId('hsl-hue').locator('input')).toHaveValue('0°');
});

test('RAW automatic tone preserves hand-tuned colour and fits the compact Chinese rail',async({page})=>{
  await page.goto('/?open=&allFeatures=1');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await page.getByRole('tab',{name:'RAW tone',exact:true}).click();await value(page,'raw-hsl-hue','10');
  await page.getByTestId('raw-auto-tone').click();await expect(page.getByTestId('raw-auto-message')).toContainText('Automatic tone applied');
  await expect(page.getByTestId('raw-hsl-hue').locator('input')).toHaveValue('+10°');
  await page.evaluate(async()=>{const path='/src/state/settings.ts',m=await import(path);m.settingsStore.getState().set('language','simplifiedChinese');m.settingsStore.getState().set('interfaceScale',130);m.settingsStore.getState().set('rightWidth',280);});
  await expect(page.getByRole('tab',{name:'RAW 影调',exact:true})).toBeVisible();
  const overflow=await page.getByTestId('right-rail').evaluate(e=>e.scrollWidth-e.clientWidth);expect(overflow).toBeLessThanOrEqual(1);
  await page.screenshot({path:test.info().outputPath('raw-page-zh-130.png')});
});
