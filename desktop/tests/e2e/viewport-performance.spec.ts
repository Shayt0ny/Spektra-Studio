import {expect,test} from '@playwright/test';
import type {sessionStore} from '../../src/state/session';
interface Metrics{draws:number;uniforms:number;uploads:number;reads:number;requests:number}
type AppWindow=Window&{__spk:{sessionStore:typeof sessionStore};__viewportMetrics:Metrics};
test('RAW page pan and zoom reuse the decoded texture without rendering film',async({page})=>{
  await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await page.getByRole('tab',{name:'RAW tone',exact:true}).click();
  await page.evaluate(async()=>{const path='/src/state/session.ts',m=await import(path);m.setView({fit:false,zoom:.7,cx:.5,cy:.5});await m.refreshOriginal();});
  await page.waitForTimeout(500);
  await page.evaluate(async()=>{
    const win=window as unknown as AppWindow,metrics:Metrics={draws:0,uniforms:0,uploads:0,reads:0,requests:0};win.__viewportMetrics=metrics;
    const proto=WebGL2RenderingContext.prototype as unknown as Record<string,(...args:unknown[])=>unknown>;
    for(const name of ['drawArrays','texImage2D','readPixels']){const original=proto[name]!;proto[name]=function(this:WebGL2RenderingContext,...args:unknown[]){if(this.canvas===document.querySelector('.canvas-gl')){if(name==='drawArrays')metrics.draws++;else if(name==='texImage2D')metrics.uploads++;else metrics.reads++;}return original.apply(this,args);};}
    const path='/src/host/client.ts',client=await import(path),host=client.host(),request=host.transport.request.bind(host.transport);
    host.transport.request=(method:string,...args:unknown[])=>{if(['render_source','render_view','render','redecode'].includes(method))metrics.requests++;return request(method,...args);};
  });
  const box=(await page.getByTestId('canvas').boundingBox())!;
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down({button:'middle'});await page.mouse.move(box.x+box.width*.65,box.y+box.height*.6,{steps:40});await page.mouse.up({button:'middle'});
  const pan=await page.evaluate(()=>(window as unknown as AppWindow).__viewportMetrics);console.log('RAW_PAN_METRICS',JSON.stringify(pan));
  expect(pan.draws).toBeGreaterThan(0);expect(pan.uploads).toBe(0);expect(pan.reads).toBeLessThanOrEqual(1);expect(pan.requests).toBe(0);
  const during=await page.evaluate(async()=>{const path='/src/state/session.ts',m=await import(path);for(let i=0;i<12;i++)m.setView({zoom:.8+i*.01});await new Promise<void>(r=>requestAnimationFrame(()=>r()));return (window as unknown as AppWindow).__viewportMetrics.requests;});
  expect(during).toBe(0);
});
test('pan reuses static GPU state and zoom waits for input to settle before fetching detail',async({page})=>{
  await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await page.evaluate(async()=>{
    const win=window as unknown as AppWindow,metrics:Metrics={draws:0,uniforms:0,uploads:0,reads:0,requests:0};win.__viewportMetrics=metrics;
    const proto=WebGL2RenderingContext.prototype as unknown as Record<string,(...args:unknown[])=>unknown>;
    for(const name of ['drawArrays','texImage2D','readPixels',...Object.getOwnPropertyNames(proto).filter(k=>k.startsWith('uniform'))]){
      const original=proto[name];if(typeof original!=='function')continue;
      proto[name]=function(this:WebGL2RenderingContext,...args:unknown[]){if(this.canvas===document.querySelector('.canvas-gl')){if(name==='drawArrays')metrics.draws++;else if(name==='texImage2D')metrics.uploads++;else if(name==='readPixels')metrics.reads++;else metrics.uniforms++;}return original.apply(this,args);};
    }
    const module='/src/host/client.ts',client=await import(module),host=client.host(),render=host.renderView.bind(host);
    host.renderView=(...args:unknown[])=>{metrics.requests++;return render(...args);};
    win.__spk.sessionStore.setState({nativeSize:{width:7200,height:4800},view:{fit:false,zoom:.5,cx:.5,cy:.5}});
    const sessionModule='/src/state/session.ts',session=await import(sessionModule);await session.refreshOriginal();await session.requestPrint();
  });
  await expect(page.getByTestId('tier-badge')).toHaveText('full');await page.waitForTimeout(500);
  await page.evaluate(()=>{const m=(window as unknown as AppWindow).__viewportMetrics;Object.assign(m,{draws:0,uniforms:0,uploads:0,reads:0,requests:0});});
  const canvas=page.getByTestId('canvas'),box=(await canvas.boundingBox())!;
  await page.mouse.move(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.down({button:'middle'});await page.mouse.move(box.x+box.width*.65,box.y+box.height*.6,{steps:40});await page.mouse.up({button:'middle'});
  const pan=await page.evaluate(()=>(window as unknown as AppWindow).__viewportMetrics);console.log('PAN_METRICS',JSON.stringify(pan));
  // One pending navigator refresh may finish; it must not run per movement.
  expect(pan.draws).toBeGreaterThan(0);expect(pan.requests).toBe(0);expect(pan.reads).toBeLessThanOrEqual(1);expect(pan.uploads).toBe(0);
  expect(pan.uniforms/pan.draws).toBeLessThan(25);
  const during=await page.evaluate(async()=>{
    const module='/src/state/session.ts',session=await import(module),metrics=(window as unknown as AppWindow).__viewportMetrics;metrics.requests=0;
    for(let frame=0;frame<3;frame++){for(let i=0;i<8;i++)session.setView({fit:false,zoom:.51+(frame*8+i)*.005});await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));}
    return metrics.requests;
  });
  expect(during).toBe(0);
  await expect.poll(()=>page.evaluate(()=>(window as unknown as AppWindow).__viewportMetrics.requests)).toBeGreaterThan(0);
});
