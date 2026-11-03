import { RAW_TONE_DEFAULT,type RawTone } from '@shared/rawTone';
import { setDecode,useSession,canPickNeutral,startNeutralPick,autoRaw,canAutoRaw } from '../state/session';
import { WB_MODES,TEMPERATURE_RANGE,TINT_RANGE,modeOf,shownDecode,withPreset,withTemperature,withTint } from '@shared/whiteBalance';
import { PillMenu,ScrubSlider,Section } from '../controls/controls';
import { tz } from '../i18n';
export function RawToneSection(){
  const decode=useSession(s=>s.sidecar.decode),frameKind=useSession(s=>s.frameKind),pair=useSession(s=>s.pair),hello=useSession(s=>s.hello),selection=useSession(s=>s.selection),engineSession=useSession(s=>s.engineSession);
  const batchExporting=useSession(s=>s.batchExporting),developing=useSession(s=>s.developing),redecoding=useSession(s=>s.redecoding);
  const s={sidecar:{decode},frameKind,pair,hello,selection,engineSession,batchExporting,developing,redecoding};
  const shot=useSession(s=>s.metadata?.as_shot),tool=useSession(s=>s.tool);
  const automatic=useSession(s=>s.rawAuto);const busy=automatic.busy;
  if(s.frameKind!=='raw'||s.pair)return null;
  const tone=s.sidecar.decode.rawTone??RAW_TONE_DEFAULT,supported=!!s.hello?.view_options?.includes('raw_tone');
  const disabled=!supported||!s.engineSession||s.batchExporting||s.developing||s.redecoding||busy;
  const asShot=shot?{temperature:shot.temperature_k,tint:shot.tint}:null,wb=shownDecode(decode,asShot);
  const set=(patch:Partial<RawTone>)=>setDecode(d=>({...d,rawTone:{...(d.rawTone??RAW_TONE_DEFAULT),...patch}}));
  return <>
    <Section id="rawWhiteBalance" title={tz('RAW white balance','RAW 白平衡')} resetEnabled={!disabled} onReset={()=>setDecode(d=>withPreset(d,asShot,'As Shot'))}>
      <PillMenu label={tz('White balance','白平衡')} disabled={disabled} value={modeOf(decode)} options={WB_MODES.map(value=>({value,label:value==='As Shot'?tz('As shot','拍摄时'):value}))} onChange={v=>{if(!disabled)setDecode(d=>withPreset(d,asShot,v));}} />
      <ScrubSlider label={tz('Temperature','色温')} value={wb.temperature} range={TEMPERATURE_RANGE} zero={asShot?.temperature??5500} snap={100} disabled={disabled} format={v=>`${v.toFixed(0)} K`} gradient="linear-gradient(90deg,#5d7de8,#bbb,#e8c04e)" onChange={v=>setDecode(d=>withTemperature(d,asShot,v))} testId="raw-wb-temperature" />
      <ScrubSlider label={tz('Tint','色调')} value={wb.tint} range={TINT_RANGE} zero={asShot?.tint??0} snap={5} disabled={disabled} format={v=>`${v>0?'+':''}${v.toFixed(1)}`} gradient="linear-gradient(90deg,#62c462,#bbb,#d05bd0)" onChange={v=>setDecode(d=>withTint(d,asShot,v))} testId="raw-wb-tint" />
      <div className="raw-wb-actions"><button className="btn" disabled={disabled||!canAutoRaw()} onClick={()=>void autoRaw('white_balance')} data-testid="raw-auto-wb">{tz('Auto white balance','自动白平衡')}</button>
        <button className="btn" data-testid="raw-neutral-picker" disabled={disabled||!canPickNeutral()} onClick={startNeutralPick} aria-pressed={tool==='neutral'}>{tool==='neutral'?tz('Cancel picker','取消取样'):tz('Pick neutral','中性灰吸管')}</button></div>
      {automatic.mode==='white_balance'&&automatic.message&&<p className="caption" role="status" data-testid="raw-wb-message">{automatic.message}</p>}
    </Section>
    <Section id="rawTone" title={tz('RAW light','RAW 光线')} resetEnabled={!disabled} unsupported={!supported?tz('Update the native engine.','请更新原生引擎。'):null} onReset={()=>set({exposure:0,contrast:0,highlights:0,shadows:0,whites:0,blacks:0})}>
    <button className="btn" style={{width:'100%'}} disabled={disabled||!canAutoRaw()} onClick={()=>void autoRaw('tone')} data-testid="raw-auto-tone">{tz('Auto tone','自动影调')}</button>
    <p className="caption">{tz('Adjust the native RAW before film. Film auto metering can rebalance exposure; choose manual film metering to retain an absolute exposure change.','先调整 RAW，再进入胶片模拟。胶片自动测光会重新平衡曝光；需要保留绝对曝光变化时，可选手动胶片测光。')}</p>
    {(['exposure','contrast','highlights','shadows','whites','blacks'] as const).map((key,i)=><ScrubSlider key={key} label={[tz('RAW Exposure','RAW 曝光'),tz('Contrast','对比度'),tz('Highlights','高光'),tz('Shadows','阴影'),tz('Whites','白色'),tz('Blacks','黑色')][i]!}
      value={tone[key]} range={key==='exposure'?[-5,5]:[-100,100]} zero={0} snap={key==='exposure'?.25:10} disabled={disabled} format={v=>`${v>0?'+':''}${v.toFixed(key==='exposure'?2:0)}${key==='exposure'?' EV':''}`} onChange={v=>set({[key]:v})} testId={`raw-${key}`} />)}
    {automatic.mode==='tone'&&automatic.message&&<p className="caption" role="status" data-testid="raw-auto-message">{automatic.message}</p>}
  </Section></>;
}
