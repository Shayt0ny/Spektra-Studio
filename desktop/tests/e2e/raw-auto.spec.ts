import {test,expect} from '@playwright/test';
import type {SessionState} from '../../src/state/session';
interface AppWindow {__spk:{sessionStore:{getState():SessionState}}}
test('RAW automatic curve is editable, isolated, undoable and single flight',async({page})=>{
  await page.goto('/?open=&allFeatures=1');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await page.getByRole('tab',{name:'RAW tone',exact:true}).click();
  const before=await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar);
  await page.evaluate(async()=>{const path='/src/host/client.ts',m=await import(path),h=m.host(),request=h.transport.request.bind(h.transport);h.transport.request=async(method:string,...args:unknown[])=>{if(method==='auto_raw')await new Promise(r=>setTimeout(r,300));return request(method,...args);};});
  await page.getByTestId('raw-auto-curve').click();await expect(page.getByTestId('raw-auto-tone')).toBeDisabled();await expect(page.getByTestId('raw-auto-wb')).toBeDisabled();
  await expect(page.getByTestId('raw-auto-curve-message')).toContainText('Automatic RAW luminance curve applied');
  const after=await page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar);
  expect(after.decode.rawTone?.curves.luma.points).toHaveLength(7);expect(after.adjustments).toEqual(before.adjustments);expect(after.params).toEqual(before.params);
  await page.getByTestId('raw-curve-editor').click({position:{x:110,y:90}});
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.decode.rawTone?.curves.luma.points.length)).toBeGreaterThanOrEqual(7);
  await page.keyboard.press('Control+z');await page.keyboard.press('Control+z');
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__spk.sessionStore.getState().sidecar.decode.rawTone)).toBeUndefined();
});
test('RAW white balance actions have borders and automatic failures recover without losing the image',async({page})=>{
  await page.goto('/?open=&allFeatures=1');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});await page.getByRole('tab',{name:'RAW tone',exact:true}).click();
  for(const id of ['raw-auto-wb','raw-neutral-picker']){
    const style=await page.getByTestId(id).evaluate(e=>{const s=getComputedStyle(e);return {border:s.borderTopStyle,width:parseFloat(s.borderTopWidth)};});expect(style.border).toBe('solid');expect(style.width).toBeGreaterThan(0);
  }
  await page.evaluate(async()=>{const path='/src/host/client.ts',m=await import(path),h=m.host(),request=h.transport.request.bind(h.transport);let fail=true;h.transport.request=async(method:string,...args:unknown[])=>{if(method==='auto_raw'&&fail){fail=false;throw new Error('Owned analysis failure');}return request(method,...args);};});
  await page.getByTestId('raw-auto-wb').click();await expect(page.getByTestId('raw-wb-message')).toContainText('Owned analysis failure');await expect(page.getByTestId('raw-auto-wb')).toBeEnabled();
  await page.getByTestId('raw-auto-wb').click();await expect(page.getByTestId('raw-wb-message')).toContainText('Automatic white balance applied');
  await expect(page.getByTestId('raw-wb-temperature').locator('input')).toHaveValue('5100 K');
  await page.evaluate(async()=>{const path='/src/state/settings.ts',m=await import(path);m.settingsStore.getState().set('language','simplifiedChinese');m.settingsStore.getState().set('interfaceScale',130);m.settingsStore.getState().set('rightWidth',280);});
  expect(await page.getByTestId('right-rail').evaluate(e=>e.scrollWidth-e.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({path:test.info().outputPath('raw-bounded-auto-buttons-zh.png')});
});
test('lighttable contains no visible upstream watermark while source credits remain in About',async({page})=>{
  await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});await page.getByTestId('lighttable-button').click();
  await expect(page.getByTestId('lt-desk-surface')).toBeVisible();await expect(page.getByText(/Photo-All|YZH2006517/)).toHaveCount(0);
  await page.screenshot({path:test.info().outputPath('lighttable-without-watermark.png')});await page.getByTestId('lt-close').click();
  await page.evaluate(async()=>{const path='/src/state/session.ts',m=await import(path);m.setPages({aboutOpen:true});});
  await expect(page.getByRole('button',{name:'YZH2006517 · Photo-All',exact:true})).toBeVisible();
});
