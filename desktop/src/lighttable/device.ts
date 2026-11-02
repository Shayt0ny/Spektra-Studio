import type {HelloResult} from '@shared/protocol';
export function defaultDeveloped(hello:HelloResult|null,memoryGB?:number,cores?:number){
  const device=hello?.backend;
  return !!device&&device.available!==false&&!!hello.methods?.includes('render_proof')&&(device.vram_mb??0)>=4096
    &&(memoryGB??0)>=8&&(cores??0)>=6&&!/llvmpipe|software|microsoft basic|\bUHD\b|\bIris\b/i.test(device.device_name);
}
export function developedPreference(storage:Pick<Storage,'getItem'>,automatic:boolean){
  try{const saved=storage.getItem('spektra.lighttable.developed');return saved==='on'?true:saved==='off'?false:automatic;}catch{return automatic;}
}
