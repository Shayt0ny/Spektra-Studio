import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {newSidecar} from '@shared/sidecar';
import {RAW_TONE_DEFAULT} from '@shared/rawTone';
import type {Curve} from '@shared/adjustments';
import type {HelloResult} from '@shared/protocol';
import type * as Session from './session';
const fake=vi.hoisted(()=>({request:vi.fn()}));
vi.mock('../host/client',()=>({HostCallError:class extends Error{},host:()=>({transport:{request:fake.request},setParams:async()=>({})})}));
vi.mock('../platform',()=>({platform:()=>({log:vi.fn(),sidecarSave:async()=>''}),baseName:(p:string)=>p,dirName:()=>'/owned'}));
let m:typeof Session;
const curve:Curve={points:[[0,0],[.35,.4],[.7,.75],[1,1]]};
beforeEach(async()=>{
  vi.useFakeTimers();vi.resetModules();vi.clearAllMocks();m=await import('./session');
  const hello={methods:['auto_raw'],view_options:['raw_auto_curve']} as HelloResult;
  m.sessionStore.setState({selection:'/owned/a.NEF',engineSession:'one',frameKind:'raw',rawEditing:true,hello,hostState:{phase:'ready',hello},sidecar:newSidecar()});
});
afterEach(()=>{vi.clearAllTimers();vi.useRealTimers();});
it('coalesces different automatic buttons and commits one independent, undoable luminance curve',async()=>{
  let finish!:(v:unknown)=>void;fake.request.mockImplementation(()=>new Promise(r=>{finish=r;}));
  const before=m.sessionStore.getState().sidecar,first=m.autoRaw('curve');
  expect(await m.autoRaw('white_balance')).toBe(false);expect(m.sessionStore.getState().rawAuto.busy).toBe(true);
  await vi.advanceTimersByTimeAsync(0);expect(fake.request).toHaveBeenCalledTimes(1);finish({result:{curve}});expect(await first).toBe(true);
  const after=m.sessionStore.getState().sidecar;expect(after.decode.rawTone?.curves.luma).toEqual(curve);
  expect(after.params).toBe(before.params);expect(after.adjustments).toBe(before.adjustments);expect(after.decode.rawTone?.curves.rgb).toEqual(RAW_TONE_DEFAULT.curves.rgb);
  expect(m.sessionStore.getState().rawAuto.busy).toBe(false);m.undo();expect(m.sessionStore.getState().sidecar.decode).toEqual(before.decode);
});
it('rejects stale results after a photograph switch',async()=>{
  let finish!:(v:unknown)=>void;fake.request.mockImplementation(()=>new Promise(r=>{finish=r;}));
  const pending=m.autoRaw('curve');await vi.advanceTimersByTimeAsync(0);
  m.sessionStore.setState({selection:'/owned/b.NEF',engineSession:'two',sidecar:newSidecar()});finish({result:{curve}});
  expect(await pending).toBe(false);expect(m.sessionStore.getState().sidecar.decode.rawTone).toBeUndefined();expect(m.sessionStore.getState().rawAuto.busy).toBe(false);
});
it('does not overlap a Post-Dev automatic adjustment',async()=>{
  m.sessionStore.setState({autoAdjusting:true});expect(m.canAutoRaw('curve')).toBe(false);expect(await m.autoRaw('curve')).toBe(false);expect(fake.request).not.toHaveBeenCalled();
});
it('keeps the recipe and restores controls on a failed or invalid automatic suggestion',async()=>{
  const before=m.sessionStore.getState().sidecar;fake.request.mockRejectedValueOnce(new Error('owned failure'));
  let pending=m.autoRaw('tone');await vi.advanceTimersByTimeAsync(0);expect(await pending).toBe(false);
  expect(m.sessionStore.getState().sidecar).toBe(before);expect(m.sessionStore.getState().rawAuto).toMatchObject({busy:false,message:'owned failure'});
  fake.request.mockResolvedValue({result:{curve:{points:[[0,0],[.8,.9],[.5,.6],[1,1]]}}});
  pending=m.autoRaw('curve');await vi.advanceTimersByTimeAsync(0);expect(await pending).toBe(false);expect(m.sessionStore.getState().sidecar).toBe(before);
});
it('automatic light preserves hand-tuned curves, balance and HSL',async()=>{
  const sidecar=newSidecar();sidecar.decode.rawTone={...RAW_TONE_DEFAULT,curves:{...RAW_TONE_DEFAULT.curves,luma:curve},hsl:{blue:{hue:10,saturation:-20,luminance:5}}};
  m.sessionStore.setState({sidecar});fake.request.mockResolvedValue({result:{raw_tone:{exposure:.35,shadows:10}}});
  const pending=m.autoRaw('tone');await vi.advanceTimersByTimeAsync(0);expect(await pending).toBe(true);
  expect(m.sessionStore.getState().sidecar.decode.rawTone).toMatchObject({exposure:.35,shadows:10,curves:{luma:curve},hsl:sidecar.decode.rawTone?.hsl});
});
