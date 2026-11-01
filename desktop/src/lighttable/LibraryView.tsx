// SPDX-License-Identifier: GPL-3.0-or-later
// Workflow reference: Photo-All; integrated with Spektra's shared preview pool.
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { tz } from '../i18n';
import { platform, type FileEntry } from '../platform';
import { host } from '../host/client';
import { sessionStore } from '../state/session';
import { useViewport, useImage, type Images } from './preview';
import { gridWindow } from './model';
import { reviewKey } from './review';
import { libraryStore, useLibrary } from './library';
import { FACETS, analyzePreview, facetCounts, filterPhotos, type Facet, type FilterValues, type LibraryPhoto } from './filters';
import './library.css';
const names = () => ({ color: tz('Color', '颜色'), warmth: tz('Warmth', '冷暖'), brightness: tz('Brightness', '亮度'), content: tz('Content tags', '内容标签'), saturation: tz('Saturation', '饱和度'), contrast: tz('Contrast', '对比度'), orientation: tz('Orientation', '方向'), format: tz('Format', '格式'), pixels: tz('Megapixels', '像素'), quality: tz('Detail reference', '清晰度参考'), style: tz('Recipe style', '配方风格'), film: tz('Film', '胶片') });
function optionLabel(value: string) {
  const cn: Record<string, string> = { unknown: '待分析', neutral: '中性', red: '红', orange: '橙', yellow: '黄', green: '绿', cyan: '青', blue: '蓝', purple: '紫', magenta: '品红', cool: '冷', warm: '暖', dark: '暗', normal: '适中', bright: '亮', muted: '低饱和', vivid: '高饱和', soft: '柔和', hard: '强对比', landscape: '横幅', portrait: '竖幅', square: '方幅', low: '低', medium: '中', high: '高', untagged: '无标签', under12: '<12 MP', '12to24': '12–24 MP', '24to45': '24–45 MP', '45plus': '≥45 MP', unprocessed: '未显影', edited: '已调色', 'no-film': '无胶片' };
  if (['under12', '12to24', '24to45', '45plus'].includes(value)) return cn[value];
  if (cn[value]) return tz(value === 'unknown' ? 'Not analyzed' : value.replaceAll('-', ' '), cn[value]!);
  return sessionStore.getState().catalog.stock(value)?.name ?? value;
}
export function LibraryView({ entries, images, onReview }: { entries: FileEntry[]; images: Images; onReview(files: FileEntry[]): void }) {
  const s = useLibrary((v) => v), [album, setAlbum] = useState('all'), [search, setSearch] = useState(''), [filters, setFilters] = useState<FilterValues>({});
  const [name, setName] = useState(''), [focused, setFocused] = useState<string | null>(null), [tagText, setTagText] = useState('');
  const [progress, setProgress] = useState(''), [busy, setBusy] = useState(false), abort = useRef<AbortController | null>(null);
  const { ref, size } = useViewport();
  useEffect(() => { void libraryStore.getState().init(entries); }, [entries]);
  useEffect(() => {
    libraryStore.setState({ cancelAnalysis: () => abort.current?.abort() });
    return () => { abort.current?.abort(); libraryStore.setState({ cancelAnalysis() {} }); };
  }, []);
  const selectedAlbum = s.albums.find((a) => a.id === album);
  const source = useMemo(() => {
    const paths = album === 'range' ? entries.map((f) => f.path) : selectedAlbum ? selectedAlbum.paths : Object.keys(s.photos);
    return paths.map((p) => s.photos[p]).filter((p): p is LibraryPhoto => !!p);
  }, [album, entries, selectedAlbum, s.photos]);
  const visible = useMemo(() => filterPhotos(source, filters, search), [source, filters, search]);
  const counts = useMemo(() => facetCounts(source, filters, search), [source, filters, search]);
  const window = gridWindow(visible.length, size.width, size.height, size.y);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [album, filters, search, ref]);
  const analyze = async () => {
    if (busy) { abort.current?.abort(); return; }
    const controller = new AbortController(); abort.current = controller; setBusy(true); let done = 0, failed = 0;
    try {
      for (const photo of source) {
        if (controller.signal.aborted) break;
        done++; setProgress(tz(`Analyzing camera previews ${done}/${source.length}`, `分析相机预览 ${done}/${source.length}`));
        const file = photo.file, key = `${reviewKey(file)}:384:camera`;
        try {
          const lease = await images.pool.acquire(key, (signal) => images.loader.load(file, 384, false, signal), controller.signal, -5);
          try {
            const factor = 48 / Math.max(lease.image.width, lease.image.height);
            const canvas = new OffscreenCanvas(Math.max(1, Math.round(lease.image.width * factor)), Math.max(1, Math.round(lease.image.height * factor)));
            const ctx = canvas.getContext('2d')!; ctx.drawImage(lease.image.bitmap, 0, 0, canvas.width, canvas.height);
            const analysis = analyzePreview(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
            const probe = await host().probe(file.path); if (controller.signal.aborted) break;
            const recipe = await images.loader.recipe(file); if (controller.signal.aborted) break;
            libraryStore.getState().updatePhoto(file.path, { analysis, width: probe.width, height: probe.height,
              style: recipe.noFilm ? 'no-film' : recipe.state === 'unprocessed' ? 'unprocessed' : 'edited', film: recipe.noFilm ? 'no-film' : recipe.params.filmStock });
          } finally { lease.release(); }
        } catch { if (!controller.signal.aborted) failed++; }
      }
      await libraryStore.getState().flush();
      setProgress(controller.signal.aborted ? tz('Analysis stopped.', '分析已停止。') : tz(`Analyzed ${done - failed}; unavailable ${failed}.`, `已分析 ${done - failed} 张；${failed} 张暂不可用。`));
    } finally { setBusy(false); }
  };
  return <section className="lt-library" data-testid="lt-library">
    <div className="lt-library-bar">
      <label>{tz('Album', '图集')} <select data-testid="lt-album" value={album} onChange={(e) => { abort.current?.abort(); setAlbum(e.target.value); setFocused(null); }}>
        <option value="all">{tz('All registered photos', '全部已登记照片')} · {Object.keys(s.photos).length}</option>
        <option value="range">{tz('Entry review range', '本次进入范围')} · {entries.length}</option>
        {s.albums.filter((a) => !a.trashedAt).map((a) => <option key={a.id} value={a.id}>{a.name} · {a.paths.length}</option>)}
        <option value="trash">{tz('Album recycle bin', '图集回收站')} · {s.albums.filter((a) => a.trashedAt).length}</option>
      </select></label>
      <input aria-label={tz('New album name', '新图集名称')} placeholder={tz('Album name', '图集名称')} value={name} onChange={(e) => setName(e.target.value)} maxLength={120} />
      <button className="lt-button" disabled={!name.trim() || !s.ready || busy} onClick={() => { const id = s.create(name, visible.map((p) => p.file.path)); if (id) { setAlbum(id); setName(''); setFilters({}); setSearch(''); } }}>{tz('Create from results', '用筛选结果新建')}</button>
      <button className="lt-button" disabled={!s.ready || busy} onClick={() => void platform().pickFiles(tz('Add originals to library', '把原片登记到图集库')).then(async (paths) => { if (paths.length) { s.register(await platform().expandPaths(paths)); setAlbum('all'); } }).catch((e: unknown) => setProgress(String(e)))}>{tz('Import records', '导入记录')}</button>
      {selectedAlbum && !selectedAlbum.trashedAt && <><button className="lt-button" disabled={!name.trim() || busy} onClick={() => { s.rename(album, name); setName(''); }}>{tz('Rename', '重命名')}</button>
        <button className="lt-button" disabled={busy} onClick={() => s.members(album, [...selectedAlbum.paths, ...entries.map((f) => f.path)])}>{tz('Add entry range', '加入本次范围')}</button>
        <button className="lt-button" disabled={busy} onClick={() => { s.trash(album); setAlbum('all'); }}>{tz('Recycle album', '回收图集')}</button></>}
      <button className="lt-button" disabled={!s.undo.length || busy} onClick={s.undoAlbum}>{tz('Undo album', '撤销图集操作')}</button><button className="lt-button" disabled={!s.redo.length || busy} onClick={s.redoAlbum}>{tz('Redo', '重做')}</button>
    </div>
    {s.error && <div className="lt-error" role="alert">{s.error}<button className="lt-button" onClick={() => { if (!s.ready) void s.init(entries); else void s.flush(); }}>{tz('Retry', '重试')}</button></div>}
    {album === 'trash' ? <div className="lt-library-trash"><p>{tz('Only album records are removed. Disk originals are never deleted.', '这里只清除图集记录，永远不删除磁盘原文件。')}</p>
      {s.albums.filter((a) => a.trashedAt).map((a) => <div key={a.id}><strong>{a.name}</strong><span>{a.paths.length} {tz('photos', '张')}</span><button className="lt-button" onClick={() => s.restore(a.id)}>{tz('Restore', '恢复')}</button><button className="lt-button" onClick={() => void platform().confirm(tz('Destroy album record?', '销毁图集记录？'), tz('Disk originals and other albums remain available.', '磁盘原文件及其他图集仍会保留。')).then((yes) => { if (yes) s.destroy(a.id); })}>{tz('Destroy record', '销毁记录')}</button></div>)}
    </div> : <>
      <div className="lt-library-search"><input aria-label={tz('Search photos and tags', '搜索照片和标签')} placeholder={tz('Search filenames / manual content tags…', '搜索文件名／手动内容标签…')} value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="lt-button" disabled={!source.length || !s.ready} onClick={() => void analyze()}>{busy ? tz('Stop analysis', '停止分析') : tz('Analyze this range', '分析当前范围')}</button>
        <button className="lt-button" onClick={() => { setFilters({}); setSearch(''); }}>{tz('Clear filters', '清除筛选')}</button>
        <button className="lt-button lt-primary" disabled={!visible.length || busy} data-testid="lt-review-results" onClick={() => onReview(visible.map((p) => p.file))}>{tz(`Review ${visible.length} photos`, `观片 ${visible.length} 张`)}</button>
      </div>
      <details className="lt-library-filters" open><summary>{tz('Linked filters', '联动筛选')} · {visible.length} / {source.length}</summary><div>
        {FACETS.map((facet: Facet) => <label key={facet}>{names()[facet]}<select data-testid={`lt-filter-${facet}`} value={filters[facet] ?? ''} onChange={(e) => setFilters((v) => ({ ...v, [facet]: e.target.value }))}>
          <option value="">{tz('All', '全部')}</option>{Object.entries(counts[facet]).sort(([a], [b]) => a.localeCompare(b)).map(([value, count]) => <option key={value} value={value} disabled={!count && filters[facet] !== value}>{optionLabel(value)} · {count}</option>)}
        </select></label>)}
      </div></details>
      <div className="lt-library-note" role="status">{progress || tz('Visual filters use camera previews; quality is only a detail heuristic. Content tags are manual; no recognition model is installed.', '视觉筛选基于相机预览；清晰度只是参考。内容标签为手动填写，尚未安装识图模型。')}</div>
      <div className="lt-library-grid" ref={ref}><div className="lt-contact-space" style={{ height: window.height }}><div className="lt-contact-cells" style={{ transform: `translateY(${window.top}px)`, gridTemplateColumns: `repeat(${window.columns},minmax(0,1fr))` }}>
        {visible.slice(window.start, window.end).map((photo) => <LibraryCard key={reviewKey(photo.file)} photo={photo} images={images} active={focused === photo.file.path} onSelect={() => { setFocused(photo.file.path); setTagText(photo.tags.join(', ')); }} onOpen={() => onReview([photo.file])} />)}
      </div></div></div>
      {focused && s.photos[focused] && <div className="lt-library-tag-editor"><span title={s.photos[focused]!.file.name}>{s.photos[focused]!.file.name}</span><input aria-label={tz('Manual content tags', '手动内容标签')} placeholder={tz('portrait, sky, travel…', '人像、天空、旅行…')} value={tagText} onChange={(e) => setTagText(e.target.value)} />
        <button className="lt-button" onClick={() => s.updatePhoto(focused, { tags: tagText.split(/[,，、;；]/) })}>{tz('Save tags', '保存标签')}</button>
        {selectedAlbum && <button className="lt-button" onClick={() => { s.members(album, selectedAlbum.paths.filter((p) => p !== focused)); setFocused(null); }}>{tz('Remove from album', '从图集移除')}</button>}
      </div>}
    </>}
    <div className="lt-library-note">{s.dirty ? tz('Library changes not saved yet.', '图集修改尚未保存。') : tz('Library stored locally. Album removal never deletes originals.', '图集保存在本机；移除图集不会删除原文件。')}</div>
  </section>;
}
const LibraryCard = memo(function LibraryCard({ photo, images, active, onSelect, onOpen }: { photo: LibraryPhoto; images: Images; active: boolean; onSelect(): void; onOpen(): void }) {
  const result = useImage(photo.file, 384, false, images), canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const node = canvas.current, image = result?.image; if (!node || !image) return;
    node.width = image.width; node.height = image.height; node.getContext('2d')?.drawImage(image.bitmap, 0, 0);
    return () => { node.width = 1; node.height = 1; };
  }, [result]);
  return <button className={`lt-card ${active ? 'is-current' : ''}`} data-testid="lt-library-card" onClick={onSelect} onDoubleClick={onOpen}>
    <div className="lt-preview">{result?.image ? <canvas ref={canvas} /> : <span>{result?.error ? tz('Preview unavailable', '无快速预览') : '…'}</span>}</div><span className="lt-card-caption"><span>{photo.file.name}</span></span>
  </button>;
});
