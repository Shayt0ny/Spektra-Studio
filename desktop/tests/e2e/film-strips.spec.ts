import {test,expect,type Page} from '@playwright/test';
async function open(page:Page){await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});await page.getByTestId('lighttable-button').click();await expect(page.getByTestId('lt-film').locator('canvas')).toHaveCount(8);}
test('mixed strips drag together, split independently and retain placement with clean photo surfaces',async({page})=>{
  await open(page);await expect(page.getByTestId('lt-desk-tools')).toBeHidden();
  await expect(page.locator('.lt-film-source')).toHaveCount(0);
  const films=()=>page.getByTestId('lt-film').evaluateAll(nodes=>nodes.map(e=>({key:e.getAttribute('data-film-key')!,strip:e.getAttribute('data-strip'),x:Number(e.getAttribute('data-x')),y:Number(e.getAttribute('data-y'))})));
  const before=await films(),group=before.filter(p=>p.strip);expect(group.length).toBeGreaterThan(1);expect(before.some(p=>!p.strip)).toBe(true);
  const piece=page.locator(`[data-film-key=${JSON.stringify(group[0]!.key)}]`),box=(await piece.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+80,box.y+box.height/2+30,{steps:30});await page.mouse.up();
  const moved=await films(),delta=moved.find(p=>p.key===group[0]!.key)!.x-group[0]!.x;expect(delta).toBeGreaterThan(10);
  for(const p of group)expect(moved.find(q=>q.key===p.key)!.x-p.x).toBeCloseTo(delta,4);
  await page.getByTestId('lt-desk-tools-toggle').click();await page.getByTestId('lt-desk-split').click();
  await expect(piece).toHaveAttribute('data-strip','');const split=await films();
  await page.getByTestId('lt-close').click();await page.getByTestId('lighttable-button').click();await expect.poll(films).toEqual(split);
  await page.getByTestId('lt-desk-arrange-mixed').click();
  await page.getByTestId('lt-desk-realistic').check();
  const white=await page.getByTestId('lt-desk-surface').evaluate(e=>getComputedStyle(e).backgroundColor.match(/\d+/g)!.slice(0,3).map(Number));expect(white[0]).toBe(white[1]);expect(white[1]).toBe(white[2]);
  expect(await page.getByTestId('lt-film').first().locator('canvas').evaluate(e=>getComputedStyle(e).filter)).toBe('none');
  await page.getByRole('button',{name:'Hide tools I',exact:true}).click();await expect(page.getByTestId('lt-desk-tools-toggle')).toBeHidden();
  await expect.poll(()=>page.getByTestId('lt-desk-surface').evaluate(surface=>{const area=surface.getBoundingClientRect(),rects=[...surface.querySelectorAll('[data-testid="lt-film"]')].map(e=>e.getBoundingClientRect());return Math.abs((Math.min(...rects.map(r=>r.top))+Math.max(...rects.map(r=>r.bottom)))/2-(area.top+area.bottom)/2);})).toBeLessThan(4);
  await page.screenshot({path:test.info().outputPath('clean-mixed-film-table.png')});
});
test('selecting and joining individual photographs makes one movable strip without changing editor edits',async({page})=>{
  await open(page);await page.getByTestId('lt-desk-tools-toggle').click();await page.getByTestId('lt-desk-arrange-single').click();
  const pieces=page.getByTestId('lt-film');await pieces.nth(0).click();await pieces.nth(1).click({modifiers:['Control']});await page.getByTestId('lt-desk-join').click();
  await expect.poll(()=>page.locator('[data-testid="lt-film"][data-strip]:not([data-strip=""])').count()).toBe(2);
  await page.getByTestId('lt-desk-arrange-strips').click();await expect.poll(()=>page.locator('[data-testid="lt-film"][data-strip]:not([data-strip=""])').count()).toBe(8);
});
for(const memory of [4,8])test(`device default uses ${memory===8?'developed':'ordinary'} previews with ${memory} GB and remembers explicit choices`,async({page})=>{
  await page.goto('/?open=');await expect(page.getByTestId('tier-badge')).toHaveText('full',{timeout:25000});
  await page.evaluate(async memory=>{Object.defineProperty(navigator,'deviceMemory',{get:()=>memory,configurable:true});Object.defineProperty(navigator,'hardwareConcurrency',{get:()=>8,configurable:true});const path='/src/state/session.ts',m=await import(path),s=m.sessionStore.getState();m.sessionStore.setState({hello:{...s.hello,methods:[...s.hello.methods,'render_proof'],backend:{...s.hello.backend,device_name:'AMD Radeon RX 6600',vram_mb:8192}}});},memory);
  await page.getByTestId('lighttable-button').click();await page.getByTestId('lt-desk-tools-toggle').click();await expect(page.getByTestId('lt-desk-source')).toHaveValue(memory===8?'developed':'camera');
  await page.getByTestId('lt-desk-source').selectOption('camera');await page.getByTestId('lt-close').click();await page.getByTestId('lighttable-button').click();await expect(page.getByTestId('lt-desk-source')).toHaveValue('camera');
});
test('a failed developed request retains an ordinary image and a responsive table',async({page})=>{
  await open(page);await page.getByTestId('lt-desk-tools-toggle').click();
  await page.evaluate(async()=>{const path='/src/host/client.ts',m=await import(path),h=m.host(),request=h.transport.request.bind(h.transport);h.transport.request=(method:string,...args:unknown[])=>method==='render_proof'?Promise.reject(new Error('owned preview failure')):request(method,...args);});
  await page.getByTestId('lt-desk-source').selectOption('developed');
  const other=page.getByTestId('lt-film').first(),path=await other.getAttribute('data-path');await other.click();
  const selected=page.locator(`[data-testid="lt-film"][data-path=${JSON.stringify(path)}]`);
  await expect(selected).toHaveAttribute('title',/showing the original/);await expect(selected).toHaveAttribute('data-preview-kind','camera');await expect(selected.locator('canvas')).toBeVisible();
  await expect(page.getByTestId('lt-desk-tools-toggle')).toBeEnabled();
});
test('dragging a strip does not repaint photo canvases or request new native images',async({page})=>{
  await open(page);await page.waitForTimeout(650);
  await page.evaluate(async()=>{
    const w=window as unknown as {deskMetrics:{draws:number;requests:number}};w.deskMetrics={draws:0,requests:0};
    const proto=CanvasRenderingContext2D.prototype,draw=proto.drawImage;proto.drawImage=function(this:CanvasRenderingContext2D,...args:Parameters<typeof draw>){if(this.canvas.closest('[data-testid="lt-film"]'))w.deskMetrics.draws++;return draw.apply(this,args);} as typeof draw;
    const path='/src/host/client.ts',m=await import(path),h=m.host(),request=h.transport.request.bind(h.transport);h.transport.request=(method:string,...args:unknown[])=>{if(['thumbnail','render_proof','render_view','open'].includes(method))w.deskMetrics.requests++;return request(method,...args);};
  });
  const strip=page.locator('[data-testid="lt-film"][data-strip]:not([data-strip=""])').first(),box=(await strip.boundingBox())!;
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+70,box.y+box.height/2+20,{steps:40});
  const metrics=await page.evaluate(()=>(window as unknown as {deskMetrics:{draws:number;requests:number}}).deskMetrics);console.log('STRIP_DRAG_METRICS',JSON.stringify(metrics));expect(metrics).toEqual({draws:0,requests:0});await page.mouse.up();
});
