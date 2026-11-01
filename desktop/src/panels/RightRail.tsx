// RightRail.tsx — "Parameters" (`Panels/RightPanel.swift`):
//   Pre-Dev:  Latitude · Input / Camera · Film Format · Scene Placement
//   Post-Dev: White Balance · Exposure · Curve · Color Balance (Layer 2)

import { useEffect, useRef, useState } from 'react';
import { RawToneSection } from './RawToneSection';
import { RAW_TONE_DEFAULT } from '@shared/rawTone';
import { HSL_NAMES, type HslName, type HslBand } from '@shared/colorDetail';
import { autoAdjust, autoCurve, autoPlaceScene, canAutoAdjust, setFilmStrength, setParametersStage } from '../state/session';
import { Checkbox, NumberField, PillMenu, ScrubSlider, Section, SegmentedSwitch, ToggleRow, signed } from '../controls/controls';
import { isChinese, t, tz } from '../i18n';
import { cameraParams, pairFocus, setCamera, shownAdjustments, shownDecode as selectedDecode, updatePair, canPickNeutral, currentPlacementWindow, hostRedecodes, placeScene, placementReady, resetScenePlacement, setAdjustments, setDecode, setFilmFrame, setFilmSide, setParams, setSideLengthMM, startNeutralPick, useSession } from '../state/session';
import { settingsStore, useSettings } from '../state/settings';
import {
  type AEMethod,
  EFFECTS_DEFAULT,
  EFFECT_RANGES,
  FILM_FRAMES,
  FILM_FRAME_CUSTOM,
  SIDE_UNIT_DECIMALS,
  SIDE_UNIT_PER_MM,
  type SideUnit,
  aeMethodOf,
  applyAEMethod,
} from '@shared/params';
import { type ColorZone, type CurveChannel, CURVE_CHANNELS, CURVES_IDENTITY, ADJUSTMENTS_DEFAULT, isNeutral } from '@shared/adjustments';
import {
  type AsShot,
  TEMPERATURE_RANGE,
  TINT_RANGE,
  WB_MODES,
  applyBoxes,
  boxesOf,
  isRawPath,
  modeOf,
  shownDecode,
  withPreset,
  withTemperature,
  withTint,
} from '@shared/whiteBalance';
import { LensProfileImport } from './LensProfileImport';
import { CurveEditor } from './CurveEditor';
import { LocalMasksSection } from './LocalMasksSection';
import { unsupportedReason } from './gate';
import { type LatitudeReply, type PlacementSide, placementMessage } from '@shared/latitude';
import { edgeEffective, edgeFormat } from '@shared/filmEdge';

export function RightRail() {
  const tab = useSettings((s) => s.parametersTab);
  const selection=useSession(s=>s.selection),pair=useSession(s=>s.pair),hello=useSession(s=>s.hello),batch=useSession(s=>s.batchExporting);
  const rawReady=!!selection&&isRawPath(selection)&&!pair&&!!hello?.methods?.includes('render_source');
  useEffect(()=>{setParametersStage(tab);},[tab,selection,pair,hello,batch]);
  const edited = useSession((s) => shownAdjustments(s).enabled && !isNeutral(shownAdjustments(s)));
  return (
    <aside className="rail right" data-testid="right-rail">
      <div className="rail-header">{t('railParameters')}</div>
      <SegmentedSwitch
        value={tab}
        onChange={setParametersStage}
        options={[
          { value: 'raw', label: tz('RAW tone','RAW 影调'), disabled: !rawReady||batch },
          { value: 'preDev', label: t('tabPreDev'), disabled: batch },
          { value: 'postDev', label: t('tabPostDev'), disabled: batch, marked: edited, markHelp: tz('The grade is not neutral.', '调色不是中性的。') },
        ]}
      />
      <div className="hairline" />
      <div className="rail-scroll">
        {tab === 'raw' ? (
          <div data-testid="raw-page">
            <p className="caption">{tz('RAW base · before film and crop. Return to Pre-Dev to see the film result.','RAW 基底 · 胶片与裁剪前。切回「显影前」查看胶片效果。')}</p>
            <RawToneSection />
            <CurveSection stage="raw" />
            <ColorBalanceSection stage="raw" />
            <ColorDetailSection stage="raw" />
          </div>
        ) : tab === 'preDev' ? (
          <>
            <LatitudeSection />
            <CameraSection />
            <FilmFormatSection />
            <FilmEffectsSection />
            <ScenePlacementSection />
          </>
        ) : (
          <>
            <LocalMasksSection />
            <WhiteBalanceSection />
            <ExposureSection />
            <CurveSection />
            <ColorBalanceSection />
            <ColorDetailSection />
          </>
        )}
      </div>
    </aside>
  );
}

// ------------------------------------------------------------------ Latitude

type ColorStage='post'|'raw';
function useRawColorDisabled(stage:ColorStage,capability='raw_color') {
  return useSession(s=>stage==='raw'&&(!s.engineSession||s.batchExporting||s.redecoding||s.developing||!s.hello?.view_options?.includes(capability)));
}
function ColorDetailSection({stage='post'}:{stage?:ColorStage}) {
  const a=useSession(shownAdjustments),raw=useSession(s=>s.sidecar.decode.rawTone??RAW_TONE_DEFAULT);
  const supported=useSession(s=>!!s.hello?.view_options?.includes(stage==='raw'?'raw_color':'hsl_texture'));
  const rawDisabled=useRawColorDisabled(stage),disabled=stage==='raw'?rawDisabled:!supported||!a.enabled;
  const [name,setName]=useState<HslName>('red'),hsl=stage==='raw'?raw.hsl:a.hsl,band=hsl?.[name]??zero;
  const names=[tz('Red','红'),tz('Orange','橙'),tz('Yellow','黄'),tz('Green','绿'),tz('Aqua','青'),tz('Blue','蓝'),tz('Purple','紫'),tz('Magenta','洋红')];
  const change=(patch:Partial<HslBand>)=>stage==='raw'?setDecode(d=>{const q=d.rawTone??RAW_TONE_DEFAULT;return {...d,rawTone:{...q,hsl:{...q.hsl,[name]:{...(q.hsl?.[name]??zero),...patch}}}};}):setAdjustments(q=>({...q,hsl:{...q.hsl,[name]:{...(q.hsl?.[name]??zero),...patch}}}));
  const reset=()=>stage==='raw'?setDecode(d=>({...d,rawTone:{...(d.rawTone??RAW_TONE_DEFAULT),hsl:{}}})):setAdjustments(q=>({...q,hsl:{},texture:0,clarity:0}));
  return <Section id={stage==='raw'?'rawHsl':'colorDetail'} title={stage==='raw'?'HSL':tz('HSL & detail','HSL 与质感')} unsupported={!supported?tz('Update the native engine.','请更新原生引擎。'):null} onReset={reset} resetEnabled={!disabled}>
    <PillMenu label={tz('Color range','颜色范围')} value={name} options={HSL_NAMES.map((value,i)=>({value,label:names[i]!}))} onChange={setName} />
    <ScrubSlider label={tz('Hue','色相')} value={band.hue} range={[-30,30]} zero={0} snap={5} format={v=>`${v>0?'+':''}${v.toFixed(0)}°`} disabled={disabled} onChange={hue=>change({hue})} testId={stage==='raw'?'raw-hsl-hue':'hsl-hue'} />
    <ScrubSlider label={tz('Saturation','饱和度')} value={band.saturation} range={[-100,100]} zero={0} snap={10} disabled={disabled} onChange={saturation=>change({saturation})} testId={stage==='raw'?'raw-hsl-saturation':'hsl-saturation'} />
    <ScrubSlider label={tz('Luminance','明亮度')} value={band.luminance} range={[-100,100]} zero={0} snap={10} disabled={disabled} onChange={luminance=>change({luminance})} testId={stage==='raw'?'raw-hsl-luminance':'hsl-luminance'} />
    {stage==='post'&&<><ScrubSlider label={tz('Texture','纹理')} value={a.texture??0} range={[-100,100]} zero={0} snap={10} disabled={disabled} onChange={texture=>setAdjustments(q=>({...q,texture}))} testId="detail-texture" />
    <ScrubSlider label={tz('Clarity','清晰度')} value={a.clarity??0} range={[-100,100]} zero={0} snap={10} disabled={disabled} onChange={clarity=>setAdjustments(q=>({...q,clarity}))} testId="detail-clarity" /></>}
    <p className="caption">{stage==='raw'?tz('Overlapping colour ranges, applied before film. Double-click values to type.','颜色范围平滑重叠，在胶片前应用。双击数值可键盘输入。'):tz('Overlapping color ranges; positive detail enhances local contrast, negative softens. Applied before masks. Double-click values to type.','颜色范围平滑重叠；质感正值增强局部反差、负值柔化，在蒙版前应用。双击数值可键盘输入。')}</p>
  </Section>;
}

function LatitudeSection() {
  const noFilm = useSession((s) => s.sidecar.noFilm);
  const film = useSession((s) => s.sidecar.params.filmStock);
  const paper = useSession((s) => s.sidecar.params.printStock);
  const catalog = useSession((s) => s.catalog);
  const { reply, failure } = useSession((s) => s.latitude);
  const name = (id: string) => catalog.stock(id)?.name.replace(/^(Kodak|Fujifilm) (Professional )?/, '') ?? id;
  return (
    <Section id="latitude" title={t('sectionLatitude')} trailing={`${name(film)} · ${name(paper)}`} unsupported={noFilm ? tz('Film simulation is bypassed.', '当前不应用胶片模拟。') : failure}>
      <LatitudePlot reply={reply} />
    </Section>
  );
}

function LatitudePlot({ reply }: { reply: LatitudeReply | null }) {
  const W = 240;
  const H = 60;
  if (!reply) return <svg className="plot" viewBox={`0 0 ${W} ${H}`} height={H} />;
  const h = reply.scene.histogram;
  const f = h.placed_fractions ?? h.fractions;
  const peak = Math.max(...f, 1e-9);
  const x = (ev: number) => ((ev - h.lo_ev) / (h.hi_ev - h.lo_ev)) * W;
  const n = f.length;
  let below = 0;
  let above = 0;
  let total = 0;
  f.forEach((v, i) => {
    const c = h.lo_ev + ((i + 0.5) * (h.hi_ev - h.lo_ev)) / n;
    total += v;
    if (c < reply.medium.shadow_ev) below += v;
    else if (c > reply.medium.highlight_ev) above += v;
  });
  const pct = (v: number) => ((v / (total || 1)) * 100).toFixed(1) + ' %';
  return (
    <>
      <svg className="plot" viewBox={`0 0 ${W} ${H}`} height={H} data-testid="latitude-plot">
        <rect x={x(reply.medium.shadow_ev)} y={0} width={x(reply.medium.highlight_ev) - x(reply.medium.shadow_ev)} height={H} fill="var(--latitude-beyond)" />
        {f.map((v, i) => (
          <rect key={i} x={(i / n) * W} y={H - (v / peak) * (H - 4)} width={W / n} height={(v / peak) * (H - 4)} fill="var(--latitude-inside)" />
        ))}
      </svg>
      <div className="caption num">
        {t('latitudeBelow')} {pct(below)} · {t('latitudeWithin')} {pct(total - below - above)} · {t('latitudeAbove')} {pct(above)} · {reply.medium.latitude_stops.toFixed(2)} {t('latitudeHeld')}
      </div>
    </>
  );
}

// -------------------------------------------------------------------- Camera

function CameraSection() {
  const tool = useSession((s) => s.tool);
  const pickerReady = useSession(() => canPickNeutral());
  const state = useSession((s) => s);
  const p = cameraParams(state), focus = pairFocus(state), hole = focus ? state.pair?.[focus] : null;
  const vignette = useSession((s) => shownAdjustments(s).vignette.amount);
  const ae = aeMethodOf(p);
  const lens = (focus ? state.pairInfo?.[focus]?.metadata : state.metadata)?.lens_correction;
  const customLens = !!selectedDecode(state).lensProfile;
  const lensReady = (lens?.available === true || customLens) && !!state.hello?.methods?.includes(state.pair ? 'update_pair' : 'redecode') && !state.batchExporting;
  const lensReason = lens?.reason || tz('No matching lens profile is available for this photograph.', '此照片没有匹配的镜头配置文件。');
  const lensParts = lens ? [lens.distortion && tz('distortion', '畸变'), lens.tca && tz('colour fringing', '横向色差'), lens.vignetting && tz('vignetting', '暗角')].filter(Boolean).join(' · ') : '';
  const wb = useWhiteBalance();
  const options: { value: AEMethod; label: string }[] = [
    { value: 'custom', label: t('meteringCustom') },
    { value: 'balanced', label: t('meteringBalanced') },
    { value: 'center', label: t('meteringCenter') },
    { value: 'protect_highlights', label: t('meteringProtectHighlights') },
    { value: 'protect_shadows', label: t('meteringProtectShadows') },
  ];
  options.push({ value: 'center_weighted', label: tz('Original centre-weighted meter', '原版中央加权测光') });
  if (ae === 'legacy') options.push({ value: 'legacy', label: t('meteringCenterWeightedLegacy') });
  const asShot = !p.autoExposure && p.exposureCompensationEV === 0;
  return (
    <Section
      id="camera"
      title={t('sectionCamera')}
      onReset={() => setCamera((q) => ({ ...q, exposureCompensationEV: 0 }))}
      resetHelp={t('helpResetFilmExposure')}
      menu={[
        { label: t('helpResetFilmExposure'), onSelect: () => setCamera((q) => ({ ...q, exposureCompensationEV: 0 })) },
        // The presets keep their English names, as on the Mac.
        ...WB_MODES.filter((m) => m !== 'Custom').map((m) => ({
          label: `${t('helpWhiteBalancePreset')}: ${m}`,
          checked: wb.mode === m,
          disabled: !!wb.reason,
          onSelect: () => setDecode((d) => withPreset(d, wb.asShot, m)),
        })),
      ]}
    >
      <PillMenu label={t('cameraMetering')} value={ae} options={options} fill onChange={(v) => setCamera((q) => applyAEMethod(q, v))} testId="metering" />
      <ScrubSlider label={tz('Camera lens blur (µm)', '相机镜头模糊（微米）')} value={p.cameraLensBlurUm} range={[0, 200]} zero={0} snap={0.05} format={(v) => v.toFixed(2)}
        disabled={state.sidecar.noFilm} reason={tz('Available with film simulation.', '启用胶片模拟后可用。')}
        onChange={(v) => setParams((q) => ({ ...q, cameraLensBlurUm: v }))} testId="camera-lens-blur" />
      {hole && focus && <PillMenu label={tz('Exposure scope', '曝光范围')} value={hole.exposureScope}
        options={[{ value: 'frame', label: tz('Frame', '这一格') }, { value: 'film', label: tz('+ Film', '+ 胶片') }]}
        onChange={(v) => updatePair((p) => ({ ...p, [focus]: { ...p[focus]!, exposureScope: v } }))} />}
      <ScrubSlider
        label={t('cameraFilmExposure')}
        sublabel={
          <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
            {t('cameraFilmExposureAsShot')}
            <Checkbox on={asShot} label={t('cameraFilmExposureAsShot')} onChange={() => setCamera((q) => ({ ...applyAEMethod(q, 'custom'), exposureCompensationEV: 0 }))} />
          </span>
        }
        value={p.exposureCompensationEV}
        range={hole ? [-5, 5] : [-3, 3]}
        snap={1 / 3}
        format={signed(1)}
        onChange={(v) => setCamera((q) => ({ ...q, exposureCompensationEV: v }))}
        testId="film-exposure"
      />
      <ScrubSlider
        label={t('cameraTemperature')}
        sublabel={<AsShotLine on={wb.boxes.temp} enabled={!!wb.asShot && !wb.reason} onChange={(v) => setDecode((d) => applyBoxes(d, wb.asShot, { temp: v }))} />}
        value={wb.shown.temperature}
        range={TEMPERATURE_RANGE}
        zero={wb.asShot?.temperature ?? 5500}
        snap={100}
        format={(v) => v.toFixed(0)}
        onChange={(v) => setDecode((d) => withTemperature(d, wb.asShot, v))}
        disabled={!!wb.reason}
        reason={wb.reason ?? undefined}
        gradient="linear-gradient(90deg,#005982,#8FA83C,#FFF100)"
        testId="wb-temperature"
      />
      <ScrubSlider
        label={t('cameraTint')}
        sublabel={<AsShotLine on={wb.boxes.tint} enabled={!!wb.asShot && !wb.reason} onChange={(v) => setDecode((d) => applyBoxes(d, wb.asShot, { tint: v }))} />}
        value={wb.shown.tint}
        range={TINT_RANGE}
        zero={wb.asShot?.tint ?? 0}
        snap={5}
        format={signed(1)}
        onChange={(v) => setDecode((d) => withTint(d, wb.asShot, v))}
        disabled={!!wb.reason}
        reason={wb.reason ?? undefined}
        gradient="linear-gradient(90deg,#00A93A,#8AA45E,#E4007F)"
        testId="wb-tint"
      />
      <button className="pill" disabled={!pickerReady} onClick={startNeutralPick} aria-pressed={tool === 'neutral'} data-testid="pick-neutral">
        {tool === 'neutral' ? tz('Cancel neutral picker', '取消中性灰取样') : tz('Pick neutral white balance', '吸取中性灰白平衡')}
      </button>
      <ScrubSlider label={t('cameraVignetting')} value={vignette} range={[-100, 100]} snap={5} format={signed(0)} onChange={(v) => setAdjustments((a) => ({ ...a, vignette: { ...a.vignette, amount: v } }))} />
      <ToggleRow label={t('cameraLensCorrection')} on={selectedDecode(state).lensCorrection} onChange={(v) => setDecode((d) => ({ ...d, lensCorrection: v }))} disabled={!lensReady} reason={!lensReady ? lensReason : undefined} testId="lens-correction" />
      <LensProfileImport />
      {state.decodeError && <p className="caption" role="alert">{tz('Decode settings were not applied: ', '解码设置未能应用：') + state.decodeError}</p>}
      <p className="caption" data-testid="lens-profile">{lensReady ? `${lens?.profile ?? ''}${lensParts ? ` · ${lensParts}` : ''}` : lensReason}</p>
    </Section>
  );
}

/** "As Shot ☐" — the second line under Temperature and Tint (`AsShotLine`). */
function AsShotLine({ on, enabled, onChange }: { on: boolean; enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {t('cameraFilmExposureAsShot')}
      <Checkbox on={on} label={t('cameraFilmExposureAsShot')} disabled={!enabled} onChange={onChange} />
    </span>
  );
}

/**
 * The decode white balance as the rows read it (`WhiteBalanceRows.swift`):
 * RAW only, and only on a host that can re-decode (R2's `redecode`).
 */
function useWhiteBalance() {
  const decode = useSession(selectedDecode);
  const shot = useSession((s) => { const side = pairFocus(s); return side ? s.pairInfo?.[side]?.metadata?.as_shot : s.metadata?.as_shot; });
  const selection = useSession((s) => s.selection);
  const kind = useSession((s) => { const side = pairFocus(s); return side ? s.pairInfo?.[side]?.kind : s.frameKind; });
  const methods = useSession((s) => s.hello?.methods);
  const asShot: AsShot | null = shot ? { temperature: shot.temperature_k, tint: shot.tint } : null;
  const isRaw = kind ? kind === 'raw' : !!selection && isRawPath(selection);
  let reason: string | null = null;
  if (selection && !isRaw) reason = t('reasonDecodeWBDisabled');
  else if (!hostRedecodes(methods))
    reason = tz('This engine host cannot change white balance at decode (it has no `redecode`).', '此引擎进程不能在解码时更改白平衡（没有 `redecode`）。');
  return { mode: modeOf(decode), shown: shownDecode(decode, asShot), boxes: boxesOf(decode, asShot), asShot, reason };
}

// --------------------------------------------------------------- Film Format

function FilmFormatSection() {
  const p = useSession((s) => s.sidecar.params);
  const gate = useSession((s) => s.gate);
  const unit = useSettings((s) => s.sideUnit);
  const isCustom = p.filmFrame === FILM_FRAME_CUSTOM.id;
  const heldFrame = edgeEffective(p.filmEdge, gate) ? edgeFormat(p.filmEdge.format) : undefined;
  const heldReason = heldFrame ? tz(
    `Set by Film Edge: ${heldFrame.label} (${heldFrame.long} × ${heldFrame.short} mm). Switch Film Edge off to choose a frame here.`,
    `由片边设定：${heldFrame.label}（${heldFrame.long} × ${heldFrame.short} mm）。关闭片边后可在此选择画幅。`,
  ) : undefined;
  const lengthDisabled = !!heldFrame || !isCustom;
  return (
    <Section
      id="filmFormat"
      title={t('filmFormat')}
      onReset={() => {
        // The gate overrides the physical frame without replacing its saved
        // controls. Resetting format leaves the independent effects alone.
        if (!heldFrame) {
          setFilmFrame('135');
          setFilmSide('short');
        }
        setParams((q) => ({ ...q, densityCurveGamma: 1 }));
      }}
      resetHelp={t('helpResetFilmFormat')}
    >
      <PillMenu
        label={t('filmFormatSize')}
        value={p.filmFrame}
        options={FILM_FRAMES.map((f) => ({ value: f.id, label: f.id, badge: f.isCine ? 'CINE' : undefined }))}
        onChange={(v) => setFilmFrame(v)}
        display={heldFrame?.label}
        disabled={!!heldFrame}
        reason={heldReason}
        testId="film-format-size"
      />
      <PillMenu
        label={t('filmFormatSide')}
        value={p.filmSide}
        options={[
          { value: 'short', label: t('filmFormatShort') },
          { value: 'long', label: t('filmFormatLong') },
        ]}
        onChange={(v) => setFilmSide(v)}
        disabled={!!heldFrame}
        reason={heldReason}
        testId="film-format-side"
      />
      <div className={'row' + (lengthDisabled ? ' disabled' : '')} title={heldReason ?? (isCustom ? undefined : t('reasonNonCustomSideLength'))}>
        <span className="row-label">{t('filmFormatSideLength')}</span>
        <NumberField
          value={p.sideLengthMM / SIDE_UNIT_PER_MM[unit]}
          decimals={SIDE_UNIT_DECIMALS[unit]}
          label={t('filmFormatSideLength')}
          onCommit={(v) => setSideLengthMM(v * SIDE_UNIT_PER_MM[unit])}
          disabled={lengthDisabled}
        />
        <PillMenu<SideUnit>
          value={unit}
          options={[
            { value: 'mm', label: 'mm' },
            { value: 'cm', label: 'cm' },
            { value: 'inch', label: 'inch' },
          ]}
          onChange={(v) => settingsStore.getState().set('sideUnit', v)}
          disabled={!!heldFrame}
          reason={heldReason}
          testId="film-format-unit"
        />
      </div>
      <ScrubSlider label={tz('Film response gamma', '胶片响应 Gamma')} value={p.densityCurveGamma} range={[.2, 4]} zero={1} snap={.1} format={(v) => v.toFixed(2)} onChange={(v) => setParams((q) => ({ ...q, densityCurveGamma: v }))} testId="density-gamma" />
    </Section>
  );
}

function FilmEffectsSection(){
  const p=useSession(s=>s.sidecar.params),e=p.effects;
  const overall=useSession(s=>s.sidecar.filmStrength), supportsOverall=useSession(s=>!!s.hello?.view_options?.includes('film_strength'));
  const noFilm=useSession(s=>s.sidecar.noFilm);
  const monochrome=useSession(s=>s.catalog.isMonochrome(s.sidecar.params.filmStock));
  const noLayer=useSession(s=>s.catalog.hasNoAntihalationLayer(s.sidecar.params.filmStock));
  const setE=(patch:Partial<typeof e>)=>setParams(q=>({...q,effects:{...q.effects,...patch}}));
  const strength=(label:string,key:'grain'|'halation'|'scatter'|'couplers'|'glare',enabled:boolean)=><ScrubSlider label={label} value={e[key]} range={[...EFFECT_RANGES[key]] as [number,number]} zero={1} snap={.25} format={v=>`${Math.round(v*100)} %`} parse={v=>Number.parseFloat(v)/100} disabled={!enabled} reason={t('reasonEffectOff')} onChange={v=>setE({[key]:v})} testId={`effect-strength-${key}`}/>;
  return <Section id="filmEffects" title={tz('Film effects','胶片效果')} onReset={()=>setParams(q=>({...q,grainActive:true,grainBlur:0.65,halationActive:true,glareActive:true,effects:EFFECTS_DEFAULT}))}
    resetHelp={t('helpResetEffectStrengths')} menu={[
      {label:t('helpAllEffectsOn'),onSelect:()=>setParams(q=>({...q,grainActive:true,halationActive:true,glareActive:true}))},
      {label:t('helpAllEffectsOff'),onSelect:()=>setParams(q=>({...q,grainActive:false,halationActive:false,glareActive:false}))},
      {label:monochrome?tz('Single-layer grain (black-and-white film)','单层颗粒（黑白胶片）'):t('helpSubLayerGrain'),checked:monochrome||e.grainLayered,disabled:!p.grainActive||monochrome,onSelect:()=>setE({grainLayered:!e.grainLayered})},
    ]}>
      <ScrubSlider label={tz('Overall film strength','整体胶片强度')} value={overall*100} range={[0,100]} zero={100} snap={10}
        format={v=>`${Math.round(v)} %`} disabled={!supportsOverall||noFilm||p.digitalIntermediate}
        reason={tz('Requires film view and an updated engine; unavailable for DI codes.','需要启用胶片模拟并使用新版引擎，数字中间片模式不适用。')}
        onChange={v=>setFilmStrength(v/100)} testId="overall-film-strength" />
      <p className="caption">{tz('100% keeps the complete look; 20% blends it with the decoded original. Post-Dev and masks follow. Film borders stay intact.','100% 保留完整效果；20% 与原始显影基底混合，之后再应用显影后调色和蒙版。胶片边框保留。')}</p>
      <ToggleRow label={t('filmGrain')} on={p.grainActive} onChange={v=>setParams(q=>({...q,grainActive:v}))} testId="grain-toggle"/>
      {strength(t('filmGrainStrength'),'grain',p.grainActive)}
      <ScrubSlider label={tz('Density diffusion (px)', '显影密度扩散（像素）')} value={p.grainBlur} range={[0, 10]} zero={0.65} snap={0.05} format={(v) => v.toFixed(2)}
        disabled={!p.grainActive || e.grain === 0 || noFilm} reason={tz('Requires active grain; 0 disables diffusion.', '需开启颗粒；0 关闭密度扩散。')}
        onChange={(v) => setParams((q) => ({ ...q, grainBlur: v }))} testId="grain-blur" />
      <ToggleRow label={t('filmHalation')} on={p.halationActive} onChange={(v) => setParams((q) => ({ ...q, halationActive: v }))} />
      {strength(t('filmHalationStrength'),'halation',p.halationActive)}
      {noLayer ? (
        <ToggleRow label={t('filmAntihalationLayer')} on={false} disabled reason={t('reasonNoAntihalationLayer')} onChange={() => {}} testId="antihalation-toggle" />
      ) : (
        <ToggleRow label={t('filmAntihalationLayer')} on={!e.antihalationRemoved} disabled={!p.halationActive} reason={t('reasonEffectOff')} onChange={(v) => setE({ antihalationRemoved: !v })} testId="antihalation-toggle" />
      )}
      {/* 1.3.4: offered on a film with no anti-halation layer only (the one film whose halo the
          engine draws from it), in both layouts, under the layer it belongs to. */}
      {noLayer && (
        <ScrubSlider label={t('filmHighlightHeadroom')} value={e.highlightHeadroom} range={[...EFFECT_RANGES.highlightHeadroom] as [number, number]} zero={4} snap={0.5} format={(v) => v.toFixed(1)} disabled={!p.halationActive} reason={t('reasonEffectOff')} onChange={(v) => setE({ highlightHeadroom: v })} testId="headroom-slider" />
      )}
      <details className="effects-advanced"><summary>{tz('Advanced effects','高级效果')}</summary>
          {strength(t('filmScatterStrength'), 'scatter', p.halationActive)}
          <ScrubSlider label={t('filmHighlightBoost')} value={e.highlightBoost} range={[0, 8]} snap={0.5} format={(v) => v.toFixed(1)} disabled={!p.halationActive} onChange={(v) => setE({ highlightBoost: v })} />
          <ToggleRow label={t('filmCouplers')} on={e.couplersActive} onChange={(v) => setE({ couplersActive: v })} />
          {strength(t('filmCouplersStrength'), 'couplers', e.couplersActive)}
      </details>
      <ToggleRow label={t('filmGlare')} on={p.glareActive} disabled={!p.printEffects} reason={t('reasonPrintEffectsOff')} onChange={(v) => setParams((q) => ({ ...q, glareActive: v }))} />
      {strength(t('filmGlareStrength'), 'glare', p.glareActive && p.printEffects)}
    </Section>
  ;
}

// ----------------------------------------------------------- Scene Placement

function ScenePlacementSection() {
  const s = useSession((s) => s);
  const [autoMessage, setAutoMessage] = useState('');
  const sl = s.sidecar.params.sceneLatitude, l = s.latitude;
  const unsupported = unsupportedReason('scene_latitude_mapping', s.gate.sceneLatitude);
  const ready = placementReady();
  const reason = unsupported ?? (s.sidecar.noFilm ? tz('Scene placement is unavailable while film simulation is bypassed.', '不应用胶片模拟时不使用场景置位。') : s.sidecar.params.digitalIntermediate && !s.sidecar.params.scanFilm
    ? tz('Scene placement is unavailable in Digital Intermediate mode.', '数字中间片模式不使用场景置位。')
    : ready ? null : l.failure ?? tz('Waiting for the scene latitude measurement…', '正在等待场景宽容度测量…'));
  const row = (side: PlacementSide) => {
    const window = currentPlacementWindow(side);
    const why = placementMessage(l.refusal ?? (window?.span === null ? window.below : null), side, l.reply, isChinese());
    return <div key={side}>
      <ScrubSlider label={side === 'highlight' ? t('placementHighlight') : t('placementShadow')}
        value={side === 'highlight' ? sl.highlightPullBack : sl.shadowPullBack} range={[0, 8]} snap={0.25}
        format={(v) => v.toFixed(2)} onChange={(v) => placeScene(side, v)} disabled={!ready}
        reason={reason ?? undefined} usable={window?.span ? [window.span] : []} testId={`placement-${side}`} />
      {why && <div className="caption" data-testid={`placement-${side}-reason`}>{why}</div>}
    </div>;
  };
  return (
    <Section id="scenePlacement" title={t('sectionScenePlacement')} unsupported={unsupported} onReset={resetScenePlacement} resetHelp={t('helpResetPlacement')} resetEnabled={s.gate.sceneLatitude && (sl.active || sl.highlightPullBack > 0 || sl.shadowPullBack > 0)}>
      <p className="caption">{tz('Fits the scene’s highlights and shadows into this film/paper latitude before development. Pull-back is measured in stops; this is separate from Post-Dev exposure.', '在显影前，把原片高光和暗部安排进当前胶片／相纸的宽容度。回拉单位是曝光档，与显影后曝光调整分开。')}</p>
      <button className="btn" style={{ width: '100%' }} data-testid="auto-scene-placement" disabled={!ready} title={tz('Use the current measured suggestion; Ctrl+Z undoes the whole action.', '使用当前测量的建议值，Ctrl+Z 可整体撤销。')} onClick={() => setAutoMessage(autoPlaceScene())}>{tz('Auto scene placement', '一键自动置位')}</button>
      {autoMessage && <p className="caption" role="status" data-testid="auto-scene-message">{autoMessage}</p>}
      {reason && !unsupported && <p className="caption">{reason}</p>}
      {row('highlight')}{row('shadow')}
    </Section>
  );
}

// ---------------------------------------------------------------- Post-Dev

function WhiteBalanceSection() {
  const a = useSession(shownAdjustments);
  return (
    <Section id="wb2" title={t('sectionWhiteBalance')} trailing={t('statusRightRailWBScope')} onReset={() => setAdjustments((q) => ({ ...q, temperature: 0, tint: 0 }))} resetHelp={t('helpReset')}>
      <ScrubSlider label={tz('Temp.', '色温偏移')} value={a.temperature} range={[-100, 100]} snap={5} format={signed(0)} gradient="linear-gradient(90deg,#5d7de8,#bbb,#e8c04e)" onChange={(v) => setAdjustments((q) => ({ ...q, temperature: v }))} />
      <ScrubSlider label={tz('Tint', '色调偏移')} value={a.tint} range={[-100, 100]} snap={5} format={signed(0)} gradient="linear-gradient(90deg,#62c462,#bbb,#d05bd0)" onChange={(v) => setAdjustments((q) => ({ ...q, tint: v }))} />
    </Section>
  );
}

function ExposureSection() {
  const a = useSession(shownAdjustments);
  const autoReady = useSession(() => canAutoAdjust());
  const autoBusy = useSession((s) => s.autoAdjusting);
  const autoMessage = useSession((s) => s.autoAdjustMessage);
  const row = (label: string, key: 'exposure' | 'contrast' | 'brightness' | 'saturation' | 'highlights' | 'shadows' | 'blackPoint' | 'whitePoint', range: [number, number], digits: number, snap: number) => (
    <ScrubSlider key={key} label={label} value={a[key]} range={range} snap={snap} format={signed(digits)} onChange={(v) => setAdjustments((q) => ({ ...q, [key]: v }))} testId={'adj-' + key} />
  );
  return (
    <Section
      id="exposure2"
      title={t('sectionExposure')}
      onReset={() => setAdjustments((q) => ({ ...q, exposure: 0, contrast: 0, brightness: 0, saturation: 0, highlights: 0, shadows: 0, blackPoint: 0, whitePoint: 0 }))}
      resetHelp={t('helpReset')}
    >
      {/* Automatic adjustment controls Copyright (C) 2026 shayt0ny. */}
      <button className="btn" style={{width:'100%',marginBottom:6}} data-testid="auto-adjust" disabled={!autoReady}
        title={tz('Suggest a conservative starting point. Keeps RAW white balance and film settings; Ctrl+Z undoes the whole action.', '生成保守的调色起点；保留 RAW 白平衡和胶片设置，Ctrl+Z 可整体撤销。')}
        onClick={() => void autoAdjust()}>{autoBusy ? tz('Analyzing…','正在分析…') : tz('Auto adjust','一键自动调整')}</button>
      {autoMessage && <div className="caption" role="status" data-testid="auto-adjust-message">{autoMessage}</div>}
      {row(t('clipExposure'), 'exposure', [-3, 3], 2, 1 / 4)}
      {row(t('exposureContrast'), 'contrast', [-50, 50], 0, 5)}
      {row(t('exposureBrightness'), 'brightness', [-50, 50], 0, 5)}
      {row(t('exposureSaturation'), 'saturation', [-100, 100], 0, 5)}
      {row(t('exposureHighlights'), 'highlights', [-100, 100], 0, 5)}
      {row(t('exposureShadows'), 'shadows', [-100, 100], 0, 5)}
      {row(t('exposureBlackPoint'), 'blackPoint', [-50, 50], 0, 1)}
      {row(t('exposureWhitePoint'), 'whitePoint', [-50, 50], 0, 1)}
    </Section>
  );
}

const CHANNEL_LABEL: Record<CurveChannel, () => string> = {
  rgb: () => 'RGB',
  luma: () => t('curveLuma'),
  red: () => t('curveRed'),
  green: () => t('curveGreen'),
  blue: () => t('curveBlue'),
};

function CurveSection({stage='post'}:{stage?:ColorStage}) {
  const [ch,setCh]=useState<CurveChannel>('rgb');
  const ready=useSession(()=>canAutoAdjust()),busy=useSession(s=>s.autoAdjusting),message=useSession(s=>s.autoCurveMessage);
  const disabled=useRawColorDisabled(stage,'raw_tone');
  const reset=(all=false)=>stage==='raw'?setDecode(d=>{const a=d.rawTone??RAW_TONE_DEFAULT;return {...d,rawTone:{...a,curves:all?CURVES_IDENTITY:{...a.curves,[ch]:{points:[[0,0],[1,1]]}}}};}):setAdjustments(q=>({...q,curves:all?CURVES_IDENTITY:{...q.curves,[ch]:{points:[[0,0],[1,1]]}}}));
  return <Section id={stage==='raw'?'rawCurve':'curve'} title={stage==='raw'?tz('RAW curves','RAW 曲线'):t('sectionCurve')} onReset={()=>reset()} resetEnabled={!disabled} resetHelp={t('helpReset')}
    menu={[{label:t('helpResetChannels'),disabled,onSelect:()=>reset(true)}]}>
    {stage==='post'&&<><button className="btn curve-auto" data-testid="auto-curve" disabled={!ready} onClick={()=>void autoCurve().then(applied=>{if(applied)setCh('luma');})}
      title={tz('Build an editable luminance curve. Other controls and colour curves are preserved.','生成可编辑的明度曲线，保留其他调色和色彩通道曲线。')}>
      {busy?tz('Analyzing…','正在分析…'):tz('Auto luma curve','自动明度曲线')}</button>
      {message&&<div className="caption" role="status" data-testid="auto-curve-message">{message}</div>}</>}
    <div className="curve-channels">{CURVE_CHANNELS.map(c=><button key={c} className={'btn'+(c===ch?' primary':'')} onClick={()=>setCh(c)}>{CHANNEL_LABEL[c]()}</button>)}</div>
    <div style={{pointerEvents:disabled?'none':undefined,opacity:disabled?.5:1}}><CurveEditor channel={ch} stage={stage}/></div>
    {stage==='raw'&&<p className="caption">{tz('Log-light axis with extended HDR endpoints. Select a point to enter input/output values.','对数光量坐标，端点向 HDR 延伸。选中控制点后可输入数值。')}</p>}
  </Section>;
}

const ZONES: { key: 'master' | 'shadows' | 'midtones' | 'highlights'; label: () => string }[] = [
  { key: 'master', label: () => tz('Master', '整体') },
  { key: 'shadows', label: () => t('exposureShadows') },
  { key: 'midtones', label: () => t('balanceMidtones') },
  { key: 'highlights', label: () => t('exposureHighlights') },
];

function ColorBalanceSection({stage='post'}:{stage?:ColorStage}) {
  const cb=useSession(s=>stage==='raw'?(s.sidecar.decode.rawTone?.colorBalance??ADJUSTMENTS_DEFAULT.colorBalance):shownAdjustments(s).colorBalance);
  const disabled=useRawColorDisabled(stage);
  const [zone,setZone]=useState<(typeof ZONES)[number]['key']>('master');
  const z=cb[zone];
  const setZ=(patch:Partial<ColorZone>)=>stage==='raw'?setDecode(d=>{const a=d.rawTone??RAW_TONE_DEFAULT,c=a.colorBalance??ADJUSTMENTS_DEFAULT.colorBalance;return {...d,rawTone:{...a,colorBalance:{...c,[zone]:{...c[zone],...patch}}}};}):setAdjustments(q=>({...q,colorBalance:{...q.colorBalance,[zone]:{...q.colorBalance[zone],...patch}}}));
  const reset=()=>stage==='raw'?setDecode(d=>({...d,rawTone:{...(d.rawTone??RAW_TONE_DEFAULT),colorBalance:ADJUSTMENTS_DEFAULT.colorBalance}})):setAdjustments(q=>({...q,colorBalance:ADJUSTMENTS_DEFAULT.colorBalance}));
  return <Section id={stage==='raw'?'rawColorBalance':'colorbalance'} title={t('sectionColorBalance')} onReset={reset} resetEnabled={!disabled} resetHelp={t('helpReset')}>
    <div className="row" style={{gap:4}}>{ZONES.map(zz=><button key={zz.key} className={'btn'+(zz.key===zone?' primary':'')} style={{height:18,padding:'0 8px',fontSize:'var(--fs-small)'}} onClick={()=>setZone(zz.key)}>{zz.label()}</button>)}</div>
    <div style={{pointerEvents:disabled?'none':undefined,opacity:disabled?.5:1}}><HueWheel zone={z} onChange={setZ}/></div>
    <ScrubSlider label={tz('Hue','色相')} value={z.hue} range={[0,360]} snap={15} format={v=>v.toFixed(0)+'°'} gradient="linear-gradient(90deg,#e8524e,#e8c04e,#62c462,#4ec0e8,#5d7de8,#d05bd0,#e8524e)" disabled={disabled} onChange={hue=>setZ({hue})} testId={stage==='raw'?'raw-balance-hue':undefined}/>
    <ScrubSlider label={t('exposureSaturation')} value={z.saturation} range={[0,1]} snap={.05} disabled={disabled} onChange={saturation=>setZ({saturation})} testId={stage==='raw'?'raw-balance-saturation':undefined}/>
    <ScrubSlider label={tz('Luminance','亮度')} value={z.luminance} range={[-1,1]} snap={.05} format={signed(2)} disabled={disabled} onChange={luminance=>setZ({luminance})} testId={stage==='raw'?'raw-balance-luminance':undefined}/>
  </Section>;
}

const zero: ColorZone = { hue: 0, saturation: 0, luminance: 0 };

/** A small hue/saturation disc: drag to set both (the Mac's ColorWheel, simplified). */
function HueWheel({ zone, onChange }: { zone: ColorZone; onChange: (z: Partial<ColorZone>) => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const R = 46;
  const set = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const sat = Math.min(1, Math.hypot(dx, dy) / R);
    const hue = ((Math.atan2(-dy, dx) * 180) / Math.PI + 360) % 360;
    onChange({ hue, saturation: sat });
  };
  const a = (zone.hue * Math.PI) / 180;
  return (
    <div className="row" style={{ justifyContent: 'center' }}>
      <svg
        ref={ref}
        width={R * 2 + 6}
        height={R * 2 + 6}
        viewBox={`${-R - 3} ${-R - 3} ${R * 2 + 6} ${R * 2 + 6}`}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture(e.pointerId);
          set(e);
        }}
        onPointerMove={(e) => e.buttons && set(e)}
        style={{ cursor: 'crosshair' }}
      >
        <defs>
          <radialGradient id="wheel-fade">
            <stop offset="0" stopColor="#2d2d2c" stopOpacity="1" />
            <stop offset="1" stopColor="#2d2d2c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r={R} fill="none" stroke="url(#hue)" />
        {Array.from({ length: 36 }, (_, i) => {
          const a0 = (i * 10 * Math.PI) / 180;
          const a1 = ((i + 1) * 10 * Math.PI) / 180;
          return <path key={i} d={`M0 0 L${R * Math.cos(a0)} ${-R * Math.sin(a0)} A${R} ${R} 0 0 0 ${R * Math.cos(a1)} ${-R * Math.sin(a1)} Z`} fill={`hsl(${i * 10 + 5} 55% 50%)`} />;
        })}
        <circle r={R} fill="url(#wheel-fade)" />
        <circle cx={zone.saturation * R * Math.cos(a)} cy={-zone.saturation * R * Math.sin(a)} r={4} fill="none" stroke="var(--knob)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}
