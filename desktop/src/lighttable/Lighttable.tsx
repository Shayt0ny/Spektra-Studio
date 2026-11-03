// SPDX-License-Identifier: GPL-3.0-or-later
// Copyright (C) 2026 shayt0ny
// Workflow inspired by Photo-All, independently integrated with Spektra's
// snapshots and renderer. Attribution: /PHOTO_ALL_REFERENCE.md.
import * as Dialog from '@radix-ui/react-dialog';
import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { FileEntry } from '../platform';
import { tz } from '../i18n';
import { click, sessionStore } from '../state/session';
import { inTauri } from '../host/transport';
import { lighttableStore, useLighttable, reviewKey, type ReviewMode, type Decision } from './review';
import { reviewLoader } from './loader';
import { ReviewImagePool, type ReviewImage } from './images';
import { FIT_VIEW, fittedImage, gridWindow, panBy, stripWindow, zoomAt, type ReviewView } from './model';
import './lighttable.css';
import { useImage, useViewport, type Images } from './preview';
import { FilmDesk, type DeskHandle } from './FilmDesk';
import {defaultDeveloped,developedPreference} from './device';
import { LibraryView } from './LibraryView';
import { libraryStore, useLibrary } from './library';

const modeLabel = (mode: ReviewMode) => ({ library: tz('Albums & filters', '图集与筛选'), desk: tz('Film desk', '胶片台面'), grid: tz('Contact sheet', '接触表'), single: tz('Single', '单张'), compare: tz('Compare', '双图比较'), roll: tz('Film roll', '胶卷浏览') })[mode];
const decisionLabel = (mark: Decision) => ({ keep: tz('Keep', '保留'), reject: tz('Reject', '排除'), unmarked: tz('Unmarked', '未标记') })[mark];
const imageLabel = (kind: ReviewImage['kind']) => kind === 'developed' ? tz('Developed preview', '显影预览') : tz('Camera / original preview', '相机／原片预览');

const Preview = memo(function Preview({ file, images }: { file: FileEntry; images: Images }) {
  const result = useImage(file, 384, false, images), canvas = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const node = canvas.current, image = result?.image; if (!node || !image) return;
    node.width = image.width; node.height = image.height; node.getContext('2d')?.drawImage(image.bitmap, 0, 0);
    return () => { node.width = 1; node.height = 1; };
  }, [result]);
  return <div className="lt-preview">
    {result?.image ? <canvas ref={canvas} /> : <span className={result?.error ? 'lt-preview-error' : 'caption'} title={result?.error}>
      {result?.error ? tz('Preview unavailable · open in editor', '无快速预览 · 可进入编辑器') : tz('Loading…', '加载中…')}</span>}
  </div>;
});
const ReviewCard = memo(function ReviewCard({ file, images, compact = false }: { file: FileEntry; images: Images; compact?: boolean }) {
  const active = useLighttable((s) => s.current === file.path), mark = useLighttable((s) => s.marks[reviewKey(file)] ?? 'unmarked');
  return <button className={`lt-card ${compact ? 'lt-compact' : ''} ${active ? 'is-current' : ''} mark-${mark}`}
    data-testid="lt-card" data-path={file.path} aria-pressed={active} title={file.name}
    onClick={() => lighttableStore.getState().choose(file.path)}
    onDoubleClick={() => { lighttableStore.getState().choose(file.path); lighttableStore.getState().setMode('single'); }}>
    <Preview file={file} images={images} />
    <span className="lt-card-caption"><span>{file.name}</span><b aria-label={decisionLabel(mark)}>{mark === 'keep' ? '✓' : mark === 'reject' ? '×' : ''}</b></span>
  </button>;
});
const ContactSheet = memo(function ContactSheet({ files, images }: { files: FileEntry[]; images: Images }) {
  const { ref, size } = useViewport(), current = useLighttable((s) => s.current);
  const window = gridWindow(files.length, size.width, size.height, size.y);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    const index = files.findIndex((f) => f.path === current), top = Math.floor(index / window.columns) * window.rowHeight;
    if (top < node.scrollTop || top + window.rowHeight > node.scrollTop + node.clientHeight) node.scrollTop = top;
  }, [current, files, ref, window.columns, window.rowHeight]);
  return <div className="lt-contact-scroll" ref={ref} data-testid="lt-grid">
    <div className="lt-contact-space" style={{ height: window.height }}>
      <div className="lt-contact-cells" style={{ transform: `translateY(${window.top}px)`, gridTemplateColumns: `repeat(${window.columns}, minmax(0,1fr))` }}>
        {files.slice(window.start, window.end).map((file) => <ReviewCard key={reviewKey(file)} file={file} images={images} />)}
      </div>
    </div>
  </div>;
});
const FilmRoll = memo(function FilmRoll({ files, images, large = false }: { files: FileEntry[]; images: Images; large?: boolean }) {
  const { ref, size } = useViewport(), current = useLighttable((s) => s.current);
  const cell = large ? 340 : 148, window = stripWindow(files.length, size.width, size.x, cell);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    const index = files.findIndex((f) => f.path === current), left = index * cell;
    if (left < node.scrollLeft || left + cell > node.scrollLeft + node.clientWidth) node.scrollLeft = Math.max(0, left - (node.clientWidth - cell) / 2);
  }, [current, files, ref, cell]);
  return <div ref={ref} className={`lt-roll-scroll ${large ? 'is-large' : ''}`} data-testid={large ? 'lt-roll' : 'lt-strip'}
    onWheel={(e) => { if (!e.ctrlKey && Math.abs(e.deltaY) > Math.abs(e.deltaX) && ref.current) ref.current.scrollLeft += e.deltaY; }}>
    <div className="lt-roll-space" style={{ width: window.width }}>
      <div className="lt-roll-cells" style={{ transform: `translateX(${window.left}px)` }}>
        {files.slice(window.start, window.end).map((file) => <div key={reviewKey(file)} style={{ width: cell, flex: '0 0 auto' }}><ReviewCard file={file} images={images} compact={!large} /></div>)}
      </div>
    </div>
  </div>;
});

function Detail({ file, images, developed, view, onView, active, onActive }: {
  file: FileEntry; images: Images; developed: boolean; view: ReviewView; onView: (view: ReviewView) => void; active: boolean; onActive(): void;
}) {
  const { ref, size } = useViewport(), canvas = useRef<HTMLCanvasElement>(null);
  const result = useImage(file, 2048, developed, images, 10), image = result?.image;
  const drag = useRef<{ x: number; y: number; view: ReviewView } | null>(null), pending = useRef<ReviewView | null>(null), raf = useRef(0);
  const latest = useRef(view); latest.current = pending.current ?? view;
  const schedule = (next: ReviewView) => {
    pending.current = next;
    if (!raf.current) raf.current = requestAnimationFrame(() => { raf.current = 0; const value = pending.current; pending.current = null; if (value) onView(value); });
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useLayoutEffect(() => {
    const node = canvas.current; if (!node || !image) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    node.width = Math.max(1, Math.round(size.width * dpr)); node.height = Math.max(1, Math.round(size.height * dpr));
    const ctx = node.getContext('2d', { alpha: false }); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = '#181a1c'; ctx.fillRect(0, 0, size.width, size.height);
    const rect = fittedImage(size, image, view); ctx.imageSmoothingQuality = 'high'; ctx.drawImage(image.bitmap, rect.x, rect.y, rect.width, rect.height);
  }, [image, size, view]);
  useEffect(() => { const node = canvas.current; return () => { if (node) { node.width = 1; node.height = 1; } }; }, []);
  const stop = (e: React.PointerEvent) => { drag.current = null; if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); };
  return <section className={`lt-detail ${active ? 'is-active' : ''}`} data-testid="lt-detail" data-path={file.path} data-view-scale={view.scale} data-view-cx={view.cx} data-view-cy={view.cy}>
    <header><button className="lt-photo-name" onClick={onActive} title={file.name}>{file.name}</button><span>{image ? imageLabel(image.kind) : developed ? tz('Preparing developed preview…', '正在准备显影预览…') : imageLabel('camera')}</span></header>
    <div className="lt-detail-image" ref={ref} data-testid="lt-detail-image"
      onPointerDown={(e) => { if (e.button !== 0 || !image) return; onActive(); e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, view: latest.current }; }}
      onPointerMove={(e) => { if (drag.current && image) schedule(panBy(drag.current.view, e.clientX - drag.current.x, e.clientY - drag.current.y, size, image)); }}
      onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={() => { drag.current = null; }}
      onDoubleClick={() => { pending.current = null; cancelAnimationFrame(raf.current); raf.current = 0; onView(view.scale === 1 ? { ...FIT_VIEW, scale: 2 } : FIT_VIEW); }}
      onWheel={(e) => {
        if (!image) return;
        const rect = e.currentTarget.getBoundingClientRect();
        schedule(zoomAt(latest.current, latest.current.scale * Math.exp(-e.deltaY * .0015), { x: e.clientX - rect.left, y: e.clientY - rect.top }, size, image));
      }}>
      {image ? <canvas ref={canvas} /> : <div className="lt-loading" role="status">{result?.error ?? tz('Loading preview…', '正在加载预览…')}</div>}
    </div>
  </section>;
}

async function isFullscreen() {
  return inTauri() ? (await import('@tauri-apps/api/window')).getCurrentWindow().isFullscreen() : !!document.fullscreenElement;
}
async function setFullscreen(enabled: boolean) {
  if (inTauri()) await (await import('@tauri-apps/api/window')).getCurrentWindow().setFullscreen(enabled);
  else if (enabled && !document.fullscreenElement) await document.documentElement.requestFullscreen();
  else if (!enabled && document.fullscreenElement) await document.exitFullscreen();
}

export function Lighttable() {
  const open = useLighttable((s) => s.open);
  return open ? <LighttableBody /> : null;
}
function LighttableBody() {
  const s = useLighttable((state) => state), [images] = useState<Images>(() => ({ pool: new ReviewImagePool(), loader: reviewLoader() }));
  const [developed, setDevelopedState] = useState(()=>{const automatic=defaultDeveloped(sessionStore.getState().hello,(navigator as Navigator&{deviceMemory?:number}).deviceMemory,navigator.hardwareConcurrency);try{return developedPreference(localStorage,automatic);}catch{return automatic;}}), [view, setView] = useState<ReviewView>(FIT_VIEW), [sync, setSync] = useState(true);
  const setDeveloped=(value:boolean)=>{setDevelopedState(value);try{localStorage.setItem('spektra.lighttable.developed',value?'on':'off');}catch{return;}}
  const [referenceView, setReferenceView] = useState<ReviewView>(FIT_VIEW), [immersive, setImmersive] = useState(false), [notice, setNotice] = useState('');
  const full = useRef<{ initial: boolean | null; work: Promise<void> }>({ initial: null, work: Promise.resolve() });
  const root = useRef<HTMLDivElement>(null), closingAction = useRef(false), desk = useRef<DeskHandle>(null);
  const current = s.entries.find((f) => f.path === s.current), reference = s.entries.find((f) => f.path === s.reference);
  const currentPath = s.current;
  const libraryError = useLibrary((v) => v.error);
  const kept = s.entries.filter((f) => s.marks[reviewKey(f)] === 'keep');
  useEffect(() => { images.pool.retainOwner(); return () => images.pool.releaseOwner(); }, [images]);
  useEffect(() => { void libraryStore.getState().init(s.entries); }, [s.entries]);
  useEffect(() => {
    const node = root.current;
    const preventBrowserZoom = (e: WheelEvent) => { if (e.ctrlKey) e.preventDefault(); };
    node?.addEventListener('wheel', preventBrowserZoom, { passive: false });
    return () => node?.removeEventListener('wheel', preventBrowserZoom);
  }, []);
  useEffect(() => { setView(FIT_VIEW); setReferenceView(FIT_VIEW); }, [currentPath, s.reference, s.mode, developed]);
  useEffect(() => {
    if (developed || (s.mode !== 'single' && s.mode !== 'compare')) return;
    const abort = new AbortController(), index = s.entries.findIndex((f) => f.path === currentPath);
    const timer = setTimeout(() => {
      for (const file of [s.entries[index + 1], s.entries[index - 1]]) if (file) {
        const key = `${reviewKey(file)}:2048:camera`;
        void images.pool.acquire(key, (signal) => images.loader.load(file, 2048, false, signal), abort.signal, -10)
          .then((lease) => lease.release()).catch(() => {});
      }
    }, 250);
    return () => { clearTimeout(timer); abort.abort(); };
  }, [currentPath, s.entries, s.mode, developed, images]);
  const close = useCallback(async (edit = false, selectKept = false) => {
    if (sessionStore.getState().batchExporting || closingAction.current) return;
    closingAction.current = true;
    const state = lighttableStore.getState(), path = state.current;
    const selected = state.entries.filter((f) => state.marks[reviewKey(f)] === 'keep').map((f) => f.path);
    try {
      await full.current.work;
      if (full.current.initial !== null) await setFullscreen(full.current.initial);
      libraryStore.getState().cancelAnalysis();
      if (!await libraryStore.getState().flush()) return;
      if (!await state.close()) return;
      if ((edit || selectKept) && !sessionStore.getState().batchExporting) {
        const editor = sessionStore.getState(), paths = edit && path ? [path] : selected;
        const extra = state.entries.filter((f) => paths.includes(f.path) && !editor.frames.some((old) => old.path === f.path));
        if (extra.length) sessionStore.setState({ frames: [...editor.frames, ...extra] });
      }
      if (selectKept && selected.length && !sessionStore.getState().batchExporting) sessionStore.setState({ picked: selected });
      if (edit && path) click(path);
    } catch (e) { setNotice(String(e)); }
    finally { closingAction.current = false; }
  }, []);
  const toggleFullscreen = useCallback(() => {
    full.current.work = full.current.work.catch(() => {}).then(async () => {
      const current = await isFullscreen(); full.current.initial ??= current; await setFullscreen(!current);
    }).catch((e: unknown) => setNotice(String(e)));
  }, []);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const node = e.target as HTMLElement | null;
      if (node?.closest('input,select,textarea,[contenteditable="true"]')) return;
      const key = e.key.toLowerCase(), state = lighttableStore.getState();
      if ((e.ctrlKey || e.metaKey) && key === 'q') { e.preventDefault(); if (inTauri()) void import('@tauri-apps/api/window').then((w) => w.getCurrentWindow().close()); return; }
      if ((e.ctrlKey || e.metaKey) && key === 'z') { e.preventDefault(); if (state.mode === 'library') { if (e.shiftKey) libraryStore.getState().redoAlbum(); else libraryStore.getState().undoAlbum(); } else if (e.shiftKey) state.redoMark(); else state.undoMark(); return; }
      if ((e.ctrlKey || e.metaKey) && key === 'y') { e.preventDefault(); if (state.mode === 'library') libraryStore.getState().redoAlbum(); else state.redoMark(); return; }
      if (e.ctrlKey || e.metaKey || e.altKey || key === ' ' && node?.closest('button')) return;
      if (state.mode === 'library' && !['escape', 'f11', 'i', ' '].includes(key)) return;
      if (state.mode === 'desk' && !(e.repeat && (key === 'v' || key === 'l')) && desk.current?.key(key)) { e.preventDefault(); return; }
      if (['arrowleft', 'arrowright', 'p', 'x', 'u', 'd', 'g', 'e', 'c', 'r', 'i', 'f11', 'escape', ' ', '0', '+', '=', '-'].includes(key)) e.preventDefault();
      if (key === 'arrowleft') state.navigate(-1); else if (key === 'arrowright') state.navigate(1);
      else if (key === 'p' && !e.repeat) state.mark('keep'); else if (key === 'x' && !e.repeat) state.mark('reject'); else if (key === 'u' && !e.repeat) state.mark('unmarked');
      else if (key === 'd') state.setMode('desk'); else if (key === 'g') state.setMode('grid'); else if (key === 'e') state.setMode('single'); else if (key === 'c') state.setMode('compare'); else if (key === 'r') state.setMode('roll');
      else if (key === 'i' && !e.repeat) setImmersive((value) => !value); else if (key === 'f11' && !e.repeat) toggleFullscreen();
      else if (key === ' ') setImmersive(false);
      else if (key === '0') { setView(FIT_VIEW); setReferenceView(FIT_VIEW); }
      else if (key === '+' || key === '=') setView((v) => ({ ...v, scale: Math.min(16, v.scale * 1.25) }));
      else if (key === '-') setView((v) => v.scale / 1.25 <= 1 ? FIT_VIEW : { ...v, scale: v.scale / 1.25 });
      else if (key === 'escape') { if (immersive) setImmersive(false); else void close(); }
    };
    window.addEventListener('keydown', down, true);
    return () => window.removeEventListener('keydown', down, true);
  }, [close, immersive, toggleFullscreen]);
  // These are display-only states; not a call to the editor's setView.
  const setMode = (mode: ReviewMode) => lighttableStore.getState().setMode(mode);
  const detail = s.mode === 'single' || s.mode === 'compare';
  return <Dialog.Root open onOpenChange={(open) => { if (!open) void close(); }}>
    <Dialog.Portal><Dialog.Overlay className="lt-overlay" />
      <Dialog.Content ref={root} className={`lt-workspace ${immersive ? 'is-immersive' : ''}`} data-testid="lighttable" aria-describedby="lt-help"
        onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <header className="lt-header">
          <div className="lt-brand"><span className="lt-brand-dot" /><div><Dialog.Title>{tz('Lighttable', '观片台')}</Dialog.Title><span>Spektra Studio</span></div></div>
          <nav className="lt-mode" aria-label={tz('Viewing mode', '观片模式')}>
            {(['desk', 'grid', 'single', 'compare', 'roll', 'library'] as ReviewMode[]).map((mode) => <button key={mode} className={s.mode === mode ? 'on' : ''} aria-pressed={s.mode === mode} data-testid={`lt-mode-${mode}`} disabled={s.closing || mode === 'compare' && s.entries.length < 2} onClick={() => setMode(mode)}>{modeLabel(mode)}</button>)}
          </nav>
          <div className="lt-header-actions">
            <button className="lt-button" onClick={() => setImmersive(!immersive)}>{tz('Hide tools', '隐藏工具')} <kbd>I</kbd></button>
            <button className="lt-button" onClick={toggleFullscreen}>{tz('Full screen', '全屏')} <kbd>F11</kbd></button>
            <button className="lt-button lt-return" disabled={s.closing} data-testid="lt-close" onClick={() => void close()}>{s.closing ? tz('Saving…', '保存中…') : tz('Back to editor', '返回编辑器')}</button>
          </div>
        </header>
        <div className="lt-toolbar">
          <div><strong>{s.entries.length}</strong> {tz('photos', '张照片')}<span className="lt-divider">/</span><span className="lt-kept">✓ {kept.length} {tz('kept', '已保留')}</span></div>
          {detail ? <div className="lt-view-options">
            <label>{tz('Preview', '预览')} <select data-testid="lt-source" value={developed ? 'developed' : 'camera'} onChange={(e) => setDeveloped(e.target.value === 'developed')}>
              <option value="camera">{tz('Fast original', '快速原片')}</option><option value="developed">{tz('Developed look', '显影效果')}</option></select></label>
            <button className="lt-button" onClick={() => { setView(FIT_VIEW); setReferenceView(FIT_VIEW); }}>{tz('Fit', '适合窗口')}</button><span className="lt-zoom" data-testid="lt-zoom">{view.scale.toFixed(1)}×</span>
            {s.mode === 'compare' && <><label><input type="checkbox" checked={sync} onChange={(e) => setSync(e.target.checked)} /> {tz('Sync zoom / pan', '同步缩放／平移')}</label><button className="lt-button" onClick={() => lighttableStore.getState().pin()}>{tz('Pin current on left', '当前照片固定到左侧')}</button></>}
          </div> : <span className="lt-preview-note">{s.mode === 'desk' ? tz('A lightbox for your films · arrange, illuminate and inspect', '把胶片放上灯箱，摆放、点亮、放大查看') : tz('Fast original previews · double-click to inspect', '快速原片预览 · 双击查看单张')}</span>}
          <span className="lt-save-status" role="status">{s.saving ? tz('Saving marks…', '正在保存标记…') : s.dirty ? tz('Marks not saved', '标记尚未保存') : s.ready ? tz('Marks saved locally', '标记已保存在本机') : tz('Loading marks…', '正在加载标记…')}</span>
        </div>
        {(s.error || notice || libraryError && s.mode !== 'library') && <div className="lt-error" role="alert">{s.error || notice || libraryError}<button className="lt-button" onClick={() => {
          if (libraryError) { void libraryStore.getState().init(s.entries).then(async () => { await libraryStore.getState().flush(); await lighttableStore.getState().flush(); }); return; }
          if (!s.ready) { const entries = s.entries, current = s.current; void lighttableStore.getState().close().then((closed) => { if (closed) void lighttableStore.getState().start(entries, current); }); }
          else void lighttableStore.getState().flush(); setNotice('');
        }}>{tz('Retry', '重试')}</button></div>}
        <div className="lt-stage" data-testid="lt-stage">
          {s.mode === 'library' ? <LibraryView entries={s.entries} images={images} onReview={(files) => lighttableStore.getState().reviewRange(files)} /> : s.mode === 'desk' ? <FilmDesk ref={desk} files={s.entries} images={images} developed={developed} onDeveloped={setDeveloped} /> : s.mode === 'grid' ? <ContactSheet files={s.entries} images={images} /> : s.mode === 'roll' ? <FilmRoll files={s.entries} images={images} large /> :
            <div className={`lt-details ${s.mode === 'compare' ? 'is-pair' : ''}`}>
              {s.mode === 'compare' && reference && <Detail key={`left:${reference.path}`} file={reference} images={images} developed={developed} view={sync ? view : referenceView} onView={sync ? setView : setReferenceView} active={false} onActive={() => {}} />}
              {current && <Detail key={`right:${current.path}`} file={current} images={images} developed={developed} view={view} onView={setView} active onActive={() => {}} />}
            </div>}
        </div>
        {s.mode !== 'library' && <div className="lt-review-tools">
          <div className="lt-navigation"><button className="lt-button" onClick={() => s.navigate(-1)} aria-label={tz('Previous photo', '上一张')}>←</button><span>{s.entries.findIndex((f) => f.path === s.current) + 1} / {s.entries.length}</span><button className="lt-button" onClick={() => s.navigate(1)} aria-label={tz('Next photo', '下一张')}>→</button></div>
          <div className="lt-mark-actions">{(['keep', 'reject', 'unmarked'] as Decision[]).map((mark, index) => <button key={mark} data-testid={`lt-mark-${mark}`} className={`lt-button lt-mark-${mark} ${current && (s.marks[reviewKey(current)] ?? 'unmarked') === mark ? 'on' : ''}`} disabled={!s.ready || s.closing} onClick={() => s.mark(mark)}>{decisionLabel(mark)} <kbd>{['P', 'X', 'U'][index]}</kbd></button>)}
            <button className="lt-button" disabled={!s.undo.length || s.closing} onClick={s.undoMark} title="Ctrl+Z">{tz('Undo mark', '撤销标记')}</button><button className="lt-button" disabled={!s.redo.length || s.closing} onClick={s.redoMark} title="Ctrl+Shift+Z">{tz('Redo', '重做')}</button></div>
          <div className="lt-edit-actions"><button className="lt-button" disabled={!kept.length || s.closing} onClick={() => void close(false, true)}>{tz('Select kept & return', '选中保留照片并返回')}</button><button className="lt-button lt-primary" disabled={!current || s.closing} data-testid="lt-edit" onClick={() => void close(true)}>{tz('Edit this photo', '编辑这张照片')}</button></div>
        </div>}
        {detail && <FilmRoll files={s.entries} images={images} />}
        <footer className="lt-footer"><p id="lt-help">{detail ? tz('Wheel: zoom · drag: pan · preview up to 2048 px · open editor for original detail', '滚轮缩放 · 拖动平移 · 预览长边最高 2048 像素 · 原始细节请进入编辑器') : s.mode === 'desk' ? tz('V loupe · L lamp · 0 fit · D desk · P keep · X reject · detail up to 2048 px', 'V 放大镜 · L 台灯 · 0 全台 · D 台面 · P 保留 · X 排除 · 细节预览最高 2048 像素') : tz('P keep · X reject · U unmark · D desk · G sheet · E single · C compare · R roll', 'P 保留 · X 排除 · U 取消标记 · D 台面 · G 接触表 · E 单张 · C 双图 · R 胶卷')}{' · '}{tz('Review marks do not change photo edits.', '选片标记不改变调色。')}</p></footer>
        {immersive && <button className="lt-show-tools lt-button" onClick={() => setImmersive(false)}>{tz('Show tools', '显示工具')} <kbd>I / Esc</kbd></button>}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
