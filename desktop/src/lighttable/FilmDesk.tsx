// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Physical lightbox workflow reference: Photo-All. See PHOTO_ALL_REFERENCE.md.
import { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { FileEntry } from '../platform';
import { tz } from '../i18n';
import { lighttableStore, reviewKey, useLighttable } from './review';
import { useImage, useViewport, type Images } from './preview';
import type { ReviewImage } from './images';
import { FilmLoupe } from './FilmLoupe';
import { DESK_BATCH, deskFit, deskLayout, deskPage, deskScope, deskZoom, filmAngle, filmBounds, filmContains, filmPoint, readDesk, writeDesk, type DeskState, type FilmPiece } from './desk';
import {arrangeFilms,flowStrip,joinFilms,splitFilms,moveFilms,stripMembers,stripBox,transformFilms,scatterFilms,type Arrangement} from './filmStrips';
import './desk.css';

export interface DeskHandle { key(key: string): boolean }
interface Props { files: FileEntry[]; images: Images; developed: boolean; onDeveloped(value: boolean): void }
export const FilmDesk = forwardRef<DeskHandle, Props>(function FilmDesk(props, ref) {
  const current = useLighttable((s) => s.current), index = props.files.findIndex((f) => f.path === current);
  const page = deskPage(props.files.length, index);
  const scope = useMemo(() => deskScope(props.files.map(reviewKey)), [props.files]);
  const files = useMemo(() => props.files.slice(page.start, page.end), [props.files, page.start, page.end]);
  return <DeskPage {...props} ref={ref} key={`${scope}:${page.page}`} files={files} scope={`${scope}:${page.page}`} start={page.start}
    page={page.page} pages={page.pages} onPage={(delta) => {
      const file = props.files[(page.page + delta) * DESK_BATCH]; if (file) lighttableStore.getState().choose(file.path);
    }} />;
});

interface PageProps extends Props { scope: string; start: number; page: number; pages: number; onPage(delta: number): void }
const DeskPage = forwardRef<DeskHandle, PageProps>(function DeskPage({ files, images, developed, onDeveloped, scope, start, page, pages, onPage }, handle) {
  const keys = useMemo(() => files.map(reviewKey), [files]);
  const [initial] = useState(() => {
    let saved: DeskState | null = null, error = '';
    try { saved = readDesk(localStorage, scope); } catch { error = tz('Table layout could not be restored.', '未能恢复台面布局。'); }
    if (saved?.pieces.map((p) => p.key).join('\0') !== keys.join('\0')) saved = null;
    return { state: saved ?? { pieces: arrangeFilms(deskLayout(keys),'mixed'), view: { x: 0, y: 0, scale: 1 }, lamp: true, brightness: 1, arranged: true,toolsOpen:false }, saved: !!saved, error };
  });
  const [state, setState] = useState<DeskState>(initial.state), latest = useRef(state), raf = useRef(0);
  const [error, setError] = useState(initial.error), [loupe, setLoupe] = useState(false), [magnification, setMagnification] = useState(3);
  const [diameter, setDiameter] = useState(240), [refractive, setRefractive] = useState(true);
  const textures = useRef(new Map<string, ReviewImage>()), [textureRevision, setTextureRevision] = useState(0);
  const onImage = useCallback((key: string, image: ReviewImage | null) => {
    if (image) textures.current.set(key, image); else textures.current.delete(key);
    setTextureRevision((v) => v + 1);
  }, []);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null), pointerRaf = useRef(0), pendingPointer = useRef<typeof pointer>(null);
  const { ref, size } = useViewport(), area = useRef(size); area.current = size;
  const current = useLighttable((s) => s.current), autoFit = useRef(!initial.saved);
  const drag = useRef<{ id: number; x: number; y: number; state: DeskState; keys?: string[] } | null>(null);
  const [dragging,setDragging]=useState(false),[multiple,setMultiple]=useState<string[]>([]),[developedKey,setDevelopedKey]=useState('');
  const pendingAspects=useRef(new Map<string,number>());
  const measuredAspects=useRef(new Set<string>());
  const update = useCallback((next: DeskState) => {
    latest.current = next;
    if (!raf.current) raf.current = requestAnimationFrame(() => { raf.current = 0; setState(latest.current); });
  }, []);
  const save = useCallback(() => {
    try { writeDesk(localStorage, scope, latest.current); setError(''); }
    catch { setError(tz('Table layout could not be saved locally. Free some storage and retry.', '台面布局未能保存到本机，请释放存储空间后重试。')); }
  }, [scope]);
  useEffect(() => { const timer = setTimeout(save, 300); return () => clearTimeout(timer); }, [state, save]);
  useEffect(() => () => {
    cancelAnimationFrame(raf.current); cancelAnimationFrame(pointerRaf.current);
    try { writeDesk(localStorage, scope, latest.current); } catch { /* The visible save status reports storage failures while mounted. */ }
  }, [scope]);
  useLayoutEffect(() => {
    if (autoFit.current && size.width > 1 && size.height > 1) update({ ...latest.current, view: deskFit(latest.current.pieces, size) });
  }, [size, update]);
  const fit = () => { autoFit.current = true; update({ ...latest.current, view: deskFit(latest.current.pieces, area.current) }); };
  const zoom = (factor: number, point = { x: area.current.width / 2, y: area.current.height / 2 }) => {
    autoFit.current = false; const s = latest.current; update({ ...s, view: deskZoom(s.view, s.view.scale * factor, point) });
  };
  const toggleLamp = () => update({ ...latest.current, lamp: !latest.current.lamp });
  useImperativeHandle(handle, () => ({ key(key) {
    if (key === 'v') setLoupe((v) => !v);
    else if (key === 'l') toggleLamp();
    else if (key === '0') fit();
    else if (key === '+' || key === '=') zoom(1.25);
    else if (key === '-') zoom(1 / 1.25);
    else if (key === 'escape' && loupe) setLoupe(false);
    else return false;
    return true;
  } }));
  const onAspect = useCallback((key: string, aspect: number) => {
    if(drag.current){pendingAspects.current.set(key,aspect);return;}
    measuredAspects.current.add(key);
    const s = latest.current, piece = s.pieces.find((p) => p.key === key);
    if (!piece) return;
    const ready=measuredAspects.current.size>=keys.length;
    if(Math.abs(piece.aspect-aspect)<.001){if(ready&&autoFit.current)update({...s,view:deskFit(s.pieces,area.current)});return;}
    const aspects = Object.fromEntries(s.pieces.map((p) => [p.key, p.key === key ? aspect : p.aspect]));
    let pieces = s.arranged ? s.pieces.map((p) => {if(p.key!==key)return p;const width=Math.max(48,Math.min(1200,p.width/p.aspect*aspect));return {...p,aspect,width,x:p.x+(p.width-width)/2};}) : deskLayout(keys, aspects);
    if(piece.strip){const box=stripBox(s.pieces.filter(p=>p.strip===piece.strip));pieces=flowStrip(pieces,piece.strip,piece.width/piece.aspect,{x:box.cx,y:box.cy});}
    update({ ...s, pieces, view: autoFit.current&&ready ? deskFit(pieces, area.current) : s.view });
  }, [keys, update]);
  const selectedKey = files.find((f) => f.path === current); const selected = selectedKey ? reviewKey(selectedKey) : '';
  const chosen=multiple.includes(selected)?multiple:selected?[selected]:[];
  useEffect(()=>{
    if(!developed){setDevelopedKey('');return;}if(dragging)return;
    const timer=setTimeout(()=>setDevelopedKey(selected),200);return()=>clearTimeout(timer);
  },[selected,developed,dragging]);
  const changePiece = (rotate:boolean,factor=1)=>{
    const s=latest.current;autoFit.current=false;update({...s,arranged:true,pieces:transformFilms(s.pieces,selected,rotate,factor)});
  };
  const arrange=(mode:Arrangement)=>{autoFit.current=true;const pieces=arrangeFilms(latest.current.pieces,mode);update({...latest.current,pieces,arranged:true,view:deskFit(pieces,area.current)});};
  const finishDrag=()=>{drag.current=null;setDragging(false);const pending=[...pendingAspects.current];pendingAspects.current.clear();for(const [key,aspect] of pending)onAspect(key,aspect);};
  const world = pointer ? { x: (pointer.x - state.view.x) / state.view.scale, y: (pointer.y - state.view.y) / state.view.scale } : null;
  const raised=new Set(stripMembers(state.pieces,chosen));
  const ordered = [...state.pieces.filter(p=>!raised.has(p.key)),...state.pieces.filter(p=>raised.has(p.key))];
  const hit = loupe && world ? ordered.toReversed().find((piece) => filmContains(piece, world)) : undefined;
  const hovered = hit && world ? { piece: hit, point: filmPoint(hit, world) } : undefined;
  const hoveredFile = hovered?.point ? files.find((f) => reviewKey(f) === hovered.piece.key) ?? null : null;
  const brightness = state.lamp ? state.brightness : .12;
  return <div className="lt-desk" data-testid="lt-desk" data-lamp={state.lamp} data-scale={state.view.scale}>
    <div className="lt-desk-bar">
      <button className="lt-button" data-testid="lt-desk-tools-toggle" aria-expanded={!!state.toolsOpen} onClick={()=>update({...latest.current,toolsOpen:!latest.current.toolsOpen})}>{state.toolsOpen?'▾':'▸'} {tz('Table tools','台面工具')}</button>
      <span className="caption">{developed?tz('Developed preview','显影预览'):tz('Fast originals','普通预览')}</span>
      <button className="lt-button" onClick={fit}>{tz('Fit table','查看全台')}</button>
    </div>
    <div className="lt-desk-controls" hidden={!state.toolsOpen} data-testid="lt-desk-tools">
      <div className="lt-desk-control-group">
        <button className={`lt-button ${state.lamp ? 'on' : ''}`} data-testid="lt-desk-lamp" aria-pressed={state.lamp} onClick={toggleLamp}>{tz('Lamp', '台灯')} <kbd>L</kbd></button>
        <label>{tz('Brightness', '亮度')} <input aria-label={tz('Table brightness', '台灯亮度')} type="range" min="30" max="150" step="5" value={Math.round(state.brightness * 100)} onChange={(e) => update({ ...latest.current, brightness: Number(e.target.value) / 100 })} /><span>{Math.round(state.brightness * 100)}%</span></label>
        <button className="lt-button" onClick={() => update({ ...latest.current, brightness: 1, lamp: true })}>{tz('Neutral 100%', '标准 100%')}</button>
        <label><input type="checkbox" data-testid="lt-desk-realistic" checked={!!state.realistic} onChange={e=>{const next={...latest.current,realistic:e.target.checked};latest.current=next;setState(next);}}/>{tz('Realistic lightbox','拟真灯箱')}</label>
      </div>
      <div className="lt-desk-control-group lt-desk-layout-tools">
        <span>{tz('Layout','摆放')}</span>{(['single','strips','mixed'] as const).map((mode,i)=><button className="lt-button" key={mode} data-testid={`lt-desk-arrange-${mode}`} onClick={()=>arrange(mode)}>{[tz('Singles','单张'),tz('Film strips','胶片条'),tz('Mixed','混合摆放')][i]}</button>)}
        <button className="lt-button" data-testid="lt-desk-join" disabled={chosen.length<2} onClick={()=>{const pieces=joinFilms(latest.current.pieces,chosen);autoFit.current=true;update({...latest.current,pieces,arranged:true,view:deskFit(pieces,area.current)});}}>{tz('Join selected','连接所选')}</button>
        <button className="lt-button" data-testid="lt-desk-split" disabled={!state.pieces.find(p=>p.key===selected)?.strip} onClick={()=>update({...latest.current,pieces:splitFilms(latest.current.pieces,selected),arranged:true})}>{tz('Split strip','拆开当前条')}</button>
        <span className="caption">{tz('Ctrl-click to select several','Ctrl 点选多张')}</span>
      </div>
      <div className="lt-desk-control-group">
        <button className="lt-button" data-testid="lt-desk-scatter" onClick={() => {
          autoFit.current = true; const pieces = scatterFilms(latest.current.pieces, crypto.getRandomValues(new Uint32Array(1))[0]!);
          update({ ...latest.current, pieces, arranged: true, view: deskFit(pieces, area.current) });
        }}>{tz('Scatter films', '散落胶片')}</button>
        <button className="lt-button" data-testid="lt-desk-tile" onClick={() => { autoFit.current = true; const pieces = deskLayout(keys, Object.fromEntries(latest.current.pieces.map((p) => [p.key, p.aspect]))); update({ ...latest.current, pieces, arranged: false, view: deskFit(pieces, area.current) }); }}>{tz('Tile films', '平铺胶片')}</button>
        <button className="lt-button" data-testid="lt-desk-fit" onClick={fit}>{tz('Fit table', '查看全台')}</button>
        <button className="lt-button" aria-label={tz('Shrink selected film', '缩小当前胶片')} onClick={() => changePiece(false, .85)}>−</button>
        <button className="lt-button" aria-label={tz('Enlarge selected film', '放大当前胶片')} onClick={() => changePiece(false, 1 / .85)}>＋</button>
        <button className="lt-button" data-testid="lt-desk-rotate" onClick={() => changePiece(true)}>{tz('Rotate placement', '旋转摆放')} ↻</button>
      </div>
      <div className="lt-desk-control-group">
        <button className="lt-button" data-testid="lt-desk-loupe-toggle" aria-pressed={loupe} onClick={() => setLoupe(!loupe)}>{tz('Loupe', '放大镜')} <kbd>V</kbd></button>
        <label>{tz('Power', '倍率')} <input className="lt-lens-number" aria-label={tz('Loupe magnification', '放大镜倍率')} type="number" min="1" max="20" step=".5" value={magnification} onChange={(e) => { const n = e.target.valueAsNumber; if (Number.isFinite(n)) setMagnification(Math.max(1, Math.min(20, n))); }} />×</label>
        <label>{tz('Lens size', '镜片尺寸')} <input aria-label={tz('Lens diameter', '镜片直径')} type="range" min="140" max="360" step="10" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} /></label>
        <label title={tz('Visual glass simulation; turn off for neutral detail inspection.', '视觉折射仿真；精确观察颜色细节时可关闭。')}><input aria-label={tz('Glass refraction', '镜片折射')} type="checkbox" checked={refractive} onChange={(e) => setRefractive(e.target.checked)} />{tz('Glass', '折射')}</label>
        <select data-testid="lt-desk-source" aria-label={tz('Table preview source', '台面预览来源')} value={developed ? 'developed' : 'camera'} onChange={(e) => onDeveloped(e.target.value === 'developed')}>
          <option value="camera">{tz('Fast originals', '快速原片')}</option><option value="developed">{tz('Selected: developed', '当前选中：显影效果')}</option>
        </select>
      </div>
    </div>
    {error && <div className="lt-error" role="alert">{error}<button className="lt-button" onClick={save}>{tz('Retry', '重试')}</button></div>}
    <div className={`lt-desk-surface ${state.lamp ? 'lamp-on' : 'lamp-off'} ${loupe ? 'loupe-on' : ''} ${state.realistic?'is-realistic':''}`} ref={ref} data-testid="lt-desk-surface"
      style={{ '--desk-light': state.brightness } as CSSProperties}
      onWheel={(e) => { const rect = e.currentTarget.getBoundingClientRect(); zoom(Math.exp(-Math.max(-120, Math.min(120, e.deltaY)) * .002), { x: e.clientX - rect.left - e.currentTarget.clientLeft, y: e.clientY - rect.top - e.currentTarget.clientTop }); }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        const key = (e.target as HTMLElement).closest<HTMLElement>('[data-film-key]')?.dataset.filmKey;
        const file=key?files.find(f=>reviewKey(f)===key):null;
        if(key&&(e.ctrlKey||e.metaKey)){
          const next=chosen.includes(key)?chosen.filter(k=>k!==key):[...chosen,key];
          if(next.length){setMultiple(next);if(!next.includes(selected)){const first=files.find(f=>reviewKey(f)===next[0]);if(first)lighttableStore.getState().choose(first.path);}}e.preventDefault();return;
        }
        const moving=key?stripMembers(latest.current.pieces,chosen.includes(key)?chosen:[key]):undefined;
        if(file){if(!chosen.includes(key!))setMultiple([key!]);lighttableStore.getState().choose(file.path);}
        autoFit.current=false;setDragging(true);drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,state:latest.current,keys:moving};
        e.currentTarget.setPointerCapture(e.pointerId); e.preventDefault();
      }}
      onPointerMove={(e) => {
        if (loupe) {
          const rect = e.currentTarget.getBoundingClientRect(); pendingPointer.current = { x: e.clientX - rect.left - e.currentTarget.clientLeft, y: e.clientY - rect.top - e.currentTarget.clientTop };
          if (!pointerRaf.current) pointerRaf.current = requestAnimationFrame(() => { pointerRaf.current = 0; setPointer(pendingPointer.current); });
        }
        const d = drag.current; if (!d || d.id !== e.pointerId) return;
        const dx = e.clientX - d.x, dy = e.clientY - d.y, s = d.state;
        if (d.keys) update({...latest.current,arranged:true,pieces:moveFilms(s.pieces,d.keys,dx/s.view.scale,dy/s.view.scale)});
        else update({ ...latest.current, view: { ...s.view, x: s.view.x + dx, y: s.view.y + dy } });
      }} onPointerUp={finishDrag} onPointerCancel={finishDrag} onLostPointerCapture={finishDrag}
      onPointerLeave={() => { if (!drag.current) { cancelAnimationFrame(pointerRaf.current); pointerRaf.current = 0; if (!loupe) { pendingPointer.current = null; setPointer(null); } } }}>
      <div className="lt-desk-rim" aria-hidden="true"><span>SPEKTRA STUDIO <i className={state.lamp ? 'is-lit' : ''} /></span><span>DIFFUSED LIGHT / {state.lamp ? `${Math.round(state.brightness * 100)}%` : 'OFF'}</span></div>
      <div className="lt-desk-world" style={{ transform: `translate(${state.view.x}px,${state.view.y}px) scale(${state.view.scale})` }}>
        {[...new Set(ordered.map(p=>p.strip).filter((v):v is string=>!!v))].map(id=>{const members=ordered.filter(p=>p.strip===id),box=stripBox(members),w=members.reduce((n,p)=>n+p.width+24,0)-members.length+1,h=members[0]!.width/members[0]!.aspect+48;return <div key={id} className="lt-film-strip-shadow" style={{width:w,height:h,transform:`translate(${box.cx-w/2}px,${box.cy-h/2}px) rotate(${filmAngle(members[0]!)}deg)`}} aria-hidden="true"/>;})}
        {ordered.map((piece) => {
          const b = filmBounds(piece), v = state.view, visible = (b.x + b.width) * v.scale + v.x >= -40 && b.x * v.scale + v.x <= size.width + 40 && (b.y + b.height) * v.scale + v.y >= -40 && b.y * v.scale + v.y <= size.height + 40;
          const file = files.find((f) => reviewKey(f) === piece.key);
          return visible && file ? <Film key={piece.key} piece={piece} file={file} number={start + files.indexOf(file) + 1} active={chosen.includes(piece.key)} developed={developed && piece.key === developedKey} images={images} brightness={brightness} onAspect={onAspect} onImage={onImage} /> : null;
        })}
      </div>
      {loupe && pointer && <FilmLoupe file={hoveredFile} pointer={pointer} area={size} images={images} developed={developed && !!hoveredFile && reviewKey(hoveredFile)===developedKey} state={state} ordered={ordered} textures={textures.current} revision={textureRevision} magnification={magnification} diameter={diameter} refractive={refractive} />}
      <div className="lt-desk-help">{tz('Drag film to arrange · drag table to pan · wheel to zoom · double-click film to inspect', '拖动单张或整条胶片 · Ctrl 多选 · 滚轮缩放 · I 纯净观片')}</div>
    </div>
    <div className="lt-desk-bottom"><span>{tz('Film edges and lamp are display only. Original colors: lamp 100%.', '胶片边框和台灯仅用于观片；查看原色请设为标准 100%。')}</span>
      <div><button className="lt-button" disabled={page === 0} onClick={() => onPage(-1)}>← {tz('Previous tray', '上一台')}</button><span data-testid="lt-desk-page">{page + 1} / {pages} · {files.length} {tz('films', '张')}</span><button className="lt-button" disabled={page + 1 >= pages} onClick={() => onPage(1)}>{tz('Next tray', '下一台')} →</button></div>
    </div>
  </div>;
});

const Film = memo(function Film({ file, piece, number, images, active, developed, brightness, onAspect, onImage }: {
  file: FileEntry; piece: FilmPiece; number: number; images: Images; active: boolean; developed: boolean; brightness: number; onAspect(key: string, aspect: number): void; onImage(key: string, image: ReviewImage | null): void;
}) {
  const camera=useImage(file,384,false,images,active?5:0),detail=useImage(developed?file:null,2048,true,images,-1),canvas=useRef<HTMLCanvasElement>(null);
  const result=detail?.image?detail:camera;
  const mark = useLighttable((s) => s.marks[piece.key] ?? 'unmarked'), image = result?.image;
  useLayoutEffect(() => {
    if (!image || !canvas.current) return;
    const node = canvas.current; node.width = image.width; node.height = image.height; node.getContext('2d')?.drawImage(image.bitmap, 0, 0);
    onAspect(piece.key, image.width / image.height); onImage(piece.key, image);
    return () => { onImage(piece.key, null); node.width = 1; node.height = 1; };
  }, [image, onAspect, onImage, piece.key]);
  return <button className={`lt-film ${piece.strip?'in-strip':''} ${active ? 'is-current' : ''}`} data-testid="lt-film" data-strip={piece.strip??''} data-film-key={piece.key} data-path={file.path} data-x={piece.x} data-y={piece.y} data-turn={piece.turn} data-tilt={piece.tilt ?? 0} data-width={piece.width} data-preview-kind={image?.kind ?? 'loading'}
    aria-pressed={active} aria-label={file.name} title={developed&&detail?.error?`${file.name} · ${tz('Developed preview unavailable; showing the original.','显影预览暂不可用，已显示普通预览。')}`:file.name}
    style={{ width: piece.width + 24, height: piece.width / piece.aspect + 48, transform: `translate(${piece.x}px,${piece.y}px) rotate(${filmAngle(piece)}deg)` }}
    onClick={(e) => {if(!e.ctrlKey&&!e.metaKey)lighttableStore.getState().choose(file.path);}} onDoubleClick={() => { lighttableStore.getState().choose(file.path); lighttableStore.getState().setMode('single'); }}>
    <span className="lt-film-perfs top" aria-hidden="true" style={{ opacity: Math.min(1, brightness) }} /><span className="lt-film-edge top"><b>SPEKTRA</b><span>{String(number).padStart(2, '0')} ▸</span></span>
    <div className="lt-film-image" style={{ height: piece.width / piece.aspect }}>
      {image ? <canvas ref={canvas} style={{ filter: brightness === 1 ? undefined : `brightness(${brightness})` }} /> : <span title={result?.error}>{result?.error ? tz('No preview · open in editor', '无预览 · 可进入编辑器') : tz('Loading…', '加载中…')}</span>}
    </div>
      {mark !== 'unmarked' && <span className={`lt-film-mark ${mark}`}>{mark === 'keep' ? '✓' : '×'}</span>}
    <span className="lt-film-edge bottom"><span>{file.name}</span><b>{String(number).padStart(2, '0')}A</b></span><span className="lt-film-perfs bottom" aria-hidden="true" style={{ opacity: Math.min(1, brightness) }} />
  </button>;
});

