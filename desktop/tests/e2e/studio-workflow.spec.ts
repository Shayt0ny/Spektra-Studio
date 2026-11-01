import {expect,test,type Page} from '@playwright/test';
import type {sessionStore} from '../../src/state/session';
import type {frameImages} from '../../src/state/frames';
type App={sessionStore:typeof sessionStore;frameImages:typeof frameImages};
const snapshot=(page:Page)=>page.evaluate(()=>{const app=(window as unknown as{__spk:App}).__spk,s=app.sessionStore.getState();return{masks:s.sidecar.adjustments.localMasks??[],preview:s.maskPreviewId,original:s.showingOriginal,undo:s.undo.length,checksum:app.frameImages.print?.data.reduce((v,n,i)=>i%41===0?v+n:v,0)};});
async function open(page:Page){await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});await page.getByRole('tab',{name:'Post-Dev',exact:true}).click();}
test('brush wheel and Alt eraser, cursor and temporary compare do not corrupt saved edits',async({page})=>{
  await open(page);const initial=await snapshot(page);await page.getByTestId('add-mask-brush').click();
  const overlay=page.getByTestId('local-mask-overlay'),box=(await overlay.boundingBox())!,from={x:box.x+box.width*.45,y:box.y+box.height*.45};
  await page.mouse.move(from.x,from.y);await expect(page.getByTestId('mask-brush-cursor')).toBeVisible();
  const radius=Number(await page.getByTestId('mask-brush-cursor').locator('circle').first().getAttribute('r')),undo=(await snapshot(page)).undo;
  await page.mouse.wheel(0,-120);await expect.poll(async()=>Number(await page.getByTestId('mask-brush-cursor').locator('circle').first().getAttribute('r'))).toBeGreaterThan(radius);
  expect((await snapshot(page)).undo).toBe(undo);
  await page.mouse.down();await page.mouse.move(from.x+80,from.y+40,{steps:8});await page.mouse.up();
  expect((await snapshot(page)).masks[0]!.strokes[0]!.radius).toBeGreaterThan(.06);
  await page.keyboard.down('Alt');await page.mouse.move(from.x,from.y);await page.mouse.down();await page.mouse.move(from.x+30,from.y+15,{steps:4});await page.mouse.up();await page.keyboard.up('Alt');
  expect((await snapshot(page)).masks[0]!.strokes[1]!.erase).toBe(true);
  const field=page.getByTestId('mask-exposure').locator('input');await field.fill('1.2');await field.press('Enter');
  await expect.poll(async()=>(await snapshot(page)).checksum).not.toBe(initial.checksum);
  const saved=await snapshot(page),compare=page.getByTestId('mask-compare');await compare.scrollIntoViewIfNeeded();const b=(await compare.boundingBox())!;
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await expect(compare).toHaveAttribute('aria-pressed','true');
  await expect.poll(async()=>(await snapshot(page)).checksum).toBe(initial.checksum);
  expect((await snapshot(page)).masks).toEqual(saved.masks);expect((await snapshot(page)).undo).toBe(saved.undo);
  await page.mouse.up();await expect(compare).toHaveAttribute('aria-pressed','false');await expect.poll(async()=>(await snapshot(page)).checksum).toBe(saved.checksum);
  await compare.focus();await page.keyboard.down('Space');expect((await snapshot(page)).original).toBe(false);await page.keyboard.up('Space');
  await page.screenshot({path:test.info().outputPath('mask-workflow.png')});
  await page.setViewportSize({width:1100,height:680});expect(await page.getByTestId('mask-toolbar').evaluate(el=>el.scrollWidth>el.clientWidth+1)).toBe(false);
});
test('purpose export presets show resolution, quality and destination without replacing custom settings',async({page})=>{
  await open(page);await page.getByTestId('export-button').click();
  await expect(page.getByTestId('export-print-lut')).toBeEnabled();await expect(page.getByTestId('export-print-lut')).toHaveAttribute('title',/normalized negative-density/);
  await page.getByTestId('preset-share').click();const summary=page.getByTestId('export-output-summary');
  await expect(summary).toContainText('sRGB');await expect(summary).toContainText('92%');await expect(summary).toContainText('Long edge 2560');await expect(summary).toContainText('Save to:');
  await page.getByTestId('preset-original').click();await expect(summary).toContainText('100%');await expect(summary).toContainText('1800 × 1200 px');await expect(summary).toContainText('Original size');
  await page.getByTestId('preset-editing').click();await expect(summary).toContainText('TIFF');await expect(summary).toContainText('16 bit');await expect(summary).toContainText('ProPhoto');
  await page.setViewportSize({width:1100,height:680});expect(await summary.evaluate(el=>el.scrollWidth>el.clientWidth+1)).toBe(false);
  await page.screenshot({path:test.info().outputPath('export-workflow.png')});
});
