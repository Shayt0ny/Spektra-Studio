import {it,expect} from 'vitest';
import type {HelloResult} from '@shared/protocol';
import {defaultDeveloped,developedPreference} from './device';
const hello={backend:{device_name:'AMD Radeon RX 6600',vram_mb:8192},methods:['render_proof']} as HelloResult;
it('only positively identified capable devices default to developed previews',()=>{
  expect(defaultDeveloped(hello,8,8)).toBe(true);
  expect(defaultDeveloped(hello,4,8)).toBe(false);expect(defaultDeveloped(hello,8,2)).toBe(false);
  expect(defaultDeveloped({...hello,backend:{...hello.backend,vram_mb:2048}},8,8)).toBe(false);
  expect(defaultDeveloped({...hello,backend:{...hello.backend,device_name:'Intel UHD Graphics'}},8,8)).toBe(false);
  expect(defaultDeveloped(hello,undefined,8)).toBe(false);expect(defaultDeveloped(null,8,8)).toBe(false);
});
it('remembers an explicit preview choice and safely handles unavailable storage',()=>{
  expect(developedPreference({getItem:()=>null},true)).toBe(true);expect(developedPreference({getItem:()=> 'off'},true)).toBe(false);
  expect(developedPreference({getItem:()=> 'on'},false)).toBe(true);expect(developedPreference({getItem:()=>{throw Error('owned');}},false)).toBe(false);
});
