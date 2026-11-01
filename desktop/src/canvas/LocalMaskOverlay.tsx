import {useEffect,useId,useMemo,useRef,useState} from 'react';
import {outputPoint,sourcePoint,type Point} from '@shared/geometry';
import {maskCoverage,rasterizeBrush,type LocalMask} from '@shared/localMasks';
import {useSession,sessionStore,beginGesture,setMaskPreview} from '../state/session';
import {tz} from '../i18n';
import {canEditMasks,changeMask,maskUi,useMaskUi} from '../state/localMasks';
import type {Layout} from './Canvas';
interface Drag{frame:string|null;id:string;points:Point[];handle:'start'|'end'|null;radius:number;erase:boolean}
export function LocalMaskOverlay({layout,dpr}:{layout:Layout;dpr:number}){
  const ui=useMaskUi(s=>s),masks=useSession(s=>s.sidecar.adjustments.localMasks),selection=useSession(s=>s.selection),mask=masks?.find(m=>m.id===ui.selected);
  const ref=useRef<SVGSVGElement>(null),drag=useRef<Drag|null>(null),[draft,setDraft]=useState<Drag|null>(null);
  const clipId=useId();
  const before=useSession(s=>!!s.maskPreviewId&&s.maskPreviewId===ui.selected);
  const [cursor,setCursor]=useState<Point|null>(null),[alt,setAlt]=useState(false);
  useEffect(()=>()=>setMaskPreview(null),[mask?.id]);
  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if(e.key==='Alt'){setAlt(e.type==='keydown');if(maskUi.getState().editing)e.preventDefault();}};
    const blur=()=>{setAlt(false);setMaskPreview(null);};
    window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);window.removeEventListener('blur',blur);};
  },[]);
  useEffect(()=>{
    const el=ref.current;if(!el||!mask||mask.kind!=='brush')return;
    const wheel=(e:WheelEvent)=>{if(e.ctrlKey||!canEditMasks())return;e.preventDefault();e.stopPropagation();const radius=maskUi.getState().brushRadius??mask.radius;maskUi.setState({brushRadius:Math.max(.002,Math.min(.4,radius*Math.exp(-Math.sign(e.deltaY)*.12)))});};
    el.addEventListener('wheel',wheel,{passive:false});return()=>el.removeEventListener('wheel',wheel);
  },[mask,ui.editing]);
  useEffect(()=>{drag.current=null;setDraft(null);},[selection]);
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){drag.current=null;setDraft(null);maskUi.setState({editing:false});setMaskPreview(null);}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[]);
  const shape=mask?JSON.stringify({...mask,name:undefined,adjustments:undefined}):'';
  const preview=useMemo(()=>{
    if(!shape||!ui.overlay)return null;const mask=JSON.parse(shape)as LocalMask;if(!mask.enabled)return null;
    const aspect=layout.native.width/layout.native.height,w=Math.max(1,Math.round(aspect>=1?384:384*aspect)),h=Math.max(1,Math.round(aspect>=1?384/aspect:384)),raster=mask.kind==='brush'?rasterizeBrush(mask,aspect):undefined;
    const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');if(!ctx)return null;const image=ctx.createImageData(w,h);
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;image.data[i]=255;image.data[i+1]=55;image.data[i+2]=55;image.data[i+3]=Math.round(maskCoverage(mask,{x:(x+.5)/w,y:(y+.5)/h},raster)*85);}
    ctx.putImageData(image,0,0);return canvas.toDataURL();
  },[shape,ui.overlay,layout.native.width,layout.native.height]);
  const toView=(p:Point)=>{const q=outputPoint(layout.display,p,layout.native);return{x:(layout.offset.x+q.x*layout.outSize.width)/dpr,y:(layout.offset.y+q.y*layout.outSize.height)/dpr};};
  const toSource=(e:React.PointerEvent)=>{const r=ref.current!.getBoundingClientRect();return sourcePoint(layout.display,{x:((e.clientX-r.left)*dpr-layout.offset.x)/layout.outSize.width,y:((e.clientY-r.top)*dpr-layout.offset.y)/layout.outSize.height},layout.native);};
  if(!mask||!canEditMasks())return null;
  const origin=toView({x:0,y:0}),x=toView({x:1,y:0}),y=toView({x:0,y:1});
  const transform=`matrix(${x.x-origin.x} ${x.y-origin.y} ${y.x-origin.x} ${y.y-origin.y} ${origin.x} ${origin.y})`;
  const a=toView(mask.start),b=toView(mask.end),points=draft?.points??[];
  const radius=ui.brushRadius??mask.radius,screenRadius=radius*Math.min(layout.native.width,layout.native.height)*Math.hypot(x.x-origin.x,x.y-origin.y)/layout.native.width;
  const end=(e:React.PointerEvent)=>{
    e.stopPropagation();const d=drag.current;drag.current=null;setDraft(null);
    if(!d||d.frame!==sessionStore.getState().selection||d.id!==mask.id)return;
    const last=d.points.at(-1)!;beginGesture();
    changeMask(d.id,m=>{
      if(m.kind==='brush'){if(m.strokes.length>=128)return m;return{...m,radius:d.radius,strokes:[...m.strokes,{points:d.points,radius:d.radius,erase:d.erase}]};}
      if(d.handle==='start'&&m.kind==='radial'){const dx=last.x-m.start.x,dy=last.y-m.start.y;return{...m,start:last,end:{x:Math.max(0,Math.min(1,m.end.x+dx)),y:Math.max(0,Math.min(1,m.end.y+dy))}};}
      return d.handle?{...m,[d.handle]:last}:{...m,start:d.points[0]!,end:last};
    });
  };
  return <>
    <div className="mask-toolbar" data-testid="mask-toolbar" onPointerDown={e=>e.stopPropagation()}>
      <span title={mask.name}>{tz('Mask: ','蒙版：')+(mask.name||tz('Unnamed','未命名'))}{before?tz(' · Before',' · 调整前'):''}</span>
      <button className="btn" aria-label={ui.editing?tz('Finish mask drawing on canvas','完成画布蒙版绘制'):tz('Edit mask region on canvas','编辑画布蒙版选区')} onClick={()=>maskUi.setState({editing:!ui.editing})}>{ui.editing?tz('Finish drawing','完成绘制'):tz('Edit region','编辑选区')}</button>
      <button className="btn" aria-pressed={before} data-testid="mask-compare" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);setMaskPreview(mask.id);}}
        onPointerUp={()=>setMaskPreview(null)} onPointerCancel={()=>setMaskPreview(null)} onLostPointerCapture={()=>setMaskPreview(null)}
        onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();e.stopPropagation();setMaskPreview(mask.id);}}} onKeyUp={e=>{e.stopPropagation();setMaskPreview(null);}} onBlur={()=>setMaskPreview(null)}>{tz('Hold to compare','按住对比')}</button>
      <button className="btn" aria-label={tz('Deselect mask','取消选择蒙版')} onClick={()=>{setMaskPreview(null);maskUi.setState({selected:null,editing:false});}}>×</button>
    </div>
    {ui.editing&&<svg ref={ref} className={'local-mask-overlay'+(mask.kind==='brush'?' brush':'')} width="100%" height="100%" data-testid="local-mask-overlay" onPointerDown={e=>{
    if(e.button!==0||before)return;e.stopPropagation();const rect=ref.current!.getBoundingClientRect(),vx=(e.clientX-rect.left)*dpr,vy=(e.clientY-rect.top)*dpr;
    if(vx<layout.offset.x||vy<layout.offset.y||vx>layout.offset.x+layout.outSize.width||vy>layout.offset.y+layout.outSize.height)return;
    const p=toSource(e);if(p.x<0||p.y<0||p.x>1||p.y>1)return;ref.current!.setPointerCapture(e.pointerId);
    const target=(e.target as SVGElement).dataset.handle as 'start'|'end'|undefined;
    const d:Drag={frame:selection,id:mask.id,points:[p],handle:target??null,radius,erase:ui.erase!==e.altKey};drag.current=d;setDraft(d);
  }} onPointerMove={e=>{const rect=e.currentTarget.getBoundingClientRect();setCursor({x:e.clientX-rect.left,y:e.clientY-rect.top});const d=drag.current;if(!d)return;e.stopPropagation();const p=toSource(e);p.x=Math.max(0,Math.min(1,p.x));p.y=Math.max(0,Math.min(1,p.y));
    const next={...d,points:d.points.length<1024?[...d.points,p]:d.points};drag.current=next;setDraft(next);
  }} onPointerLeave={()=>{if(!drag.current)setCursor(null);}} onPointerUp={end} onPointerCancel={e=>{e.stopPropagation();drag.current=null;setDraft(null);}}>
    <rect width="100%" height="100%" fill="transparent" pointerEvents="all"/>
    <defs><clipPath id={clipId}><rect x={layout.offset.x/dpr} y={layout.offset.y/dpr} width={layout.outSize.width/dpr} height={layout.outSize.height/dpr}/></clipPath></defs>
    {preview&&!before&&<g clipPath={`url(#${clipId})`} pointerEvents="none"><g transform={transform}><image href={preview} x="0" y="0" width="1" height="1" preserveAspectRatio="none"/></g></g>}
    {mask.kind!=='brush'&&!before&&<><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="white" strokeWidth="1.5" strokeDasharray="5 3"/>
      <circle data-handle="start" cx={a.x} cy={a.y} r="6" fill="var(--accent)" stroke="white"/><circle data-handle="end" cx={b.x} cy={b.y} r="6" fill="var(--card)" stroke="white"/></>}
    {points.length>0&&<polyline points={(mask.kind==='brush'?points:[points[0]!,points.at(-1)!]).map(p=>{const v=toView(p);return`${v.x},${v.y}`;}).join(' ')} fill="none" stroke={draft?.erase?'white':'#ff5555'} strokeOpacity=".6" strokeWidth={mask.kind==='brush'?screenRadius*2:2} strokeLinecap="round" strokeLinejoin="round" pointerEvents="none"/>}
    {cursor&&mask.kind==='brush'&&!before&&<g pointerEvents="none" data-testid="mask-brush-cursor" stroke={ui.erase!==alt?'#fff':'#ffd19a'} fill="none"><circle cx={cursor.x} cy={cursor.y} r={screenRadius} strokeWidth="1.5"/><circle cx={cursor.x} cy={cursor.y} r={screenRadius*(1-mask.feather)} strokeWidth=".75" strokeDasharray="3 3"/></g>}
  </svg>}</>;
}
