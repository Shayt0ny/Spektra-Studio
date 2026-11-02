import {deskLayout,deskScatter,filmAngle,filmBounds,type FilmPiece} from './desk';
export type Arrangement='single'|'strips'|'mixed';
export function stripMembers(pieces:FilmPiece[],keys:readonly string[]){
  const wanted=new Set(keys),groups=new Set(pieces.filter(p=>wanted.has(p.key)&&p.strip).map(p=>p.strip));
  return pieces.filter(p=>wanted.has(p.key)||p.strip&&groups.has(p.strip)).map(p=>p.key);
}
export function stripBox(pieces:FilmPiece[]){
  const boxes=pieces.map(filmBounds),x=Math.min(...boxes.map(b=>b.x)),y=Math.min(...boxes.map(b=>b.y));
  const width=Math.max(...boxes.map(b=>b.x+b.width))-x,height=Math.max(...boxes.map(b=>b.y+b.height))-y;
  return {x,y,width,height,cx:x+width/2,cy:y+height/2};
}
export function flowStrip(pieces:FilmPiece[],id:string,height?:number,center?:{x:number;y:number},angle?:number):FilmPiece[]{
  const group=pieces.filter(p=>p.strip===id);if(!group.length)return pieces;
  const first=group[0]!,box=stripBox(group),h=Math.max(24,Math.min(600,height??first.width/first.aspect));
  const degrees=angle??filmAngle(first),r=degrees*Math.PI/180,c=center??{x:box.cx,y:box.cy};
  const widths=group.map(p=>Math.max(48,Math.min(1200,h*p.aspect))),total=widths.reduce((n,w)=>n+w+24,0)-group.length+1;
  let cursor=-total/2;const laid=new Map<string,FilmPiece>();
  group.forEach((p,i)=>{const width=widths[i]!,offset=cursor+(width+24)/2;cursor+=width+23;
    laid.set(p.key,{...p,width,x:c.x+offset*Math.cos(r)-(width+24)/2,y:c.y+offset*Math.sin(r)-(width/p.aspect+48)/2,turn:((Math.round(degrees/90)%4)+4)%4,tilt:degrees-Math.round(degrees/90)*90});});
  return pieces.map(p=>laid.get(p.key)??p);
}
export function arrangeFilms(pieces:FilmPiece[],mode:Arrangement):FilmPiece[]{
  if(mode==='single'||pieces.length<2)return deskLayout(pieces.map(p=>p.key),Object.fromEntries(pieces.map(p=>[p.key,p.aspect])));
  let next:FilmPiece[]=pieces.map(p=>({...p,width:Math.max(48,Math.min(280,150*p.aspect)),strip:undefined,turn:0,tilt:0}));let row=0,index=0;
  const linked=mode==='strips'?pieces.length:Math.max(2,Math.floor(pieces.length*.5));
  while(index+1<linked){const count=Math.min(3,linked-index),id=`strip-${row}`,keys=new Set(pieces.slice(index,index+count).map(p=>p.key));
    next=next.map(p=>keys.has(p.key)?{...p,strip:id}:p);next=flowStrip(next,id,150,{x:450,y:130+row*240},0);row++;index+=count;}
  const rowHeight=Math.max(240,...next.slice(index).map(p=>p.width/p.aspect+84));
  next=next.map((p,i)=>i<index?p:{...p,x:40+((i-index)%3)*350,y:row*240+40+Math.floor((i-index)/3)*rowHeight});return next;
}
export function joinFilms(pieces:FilmPiece[],keys:readonly string[]):FilmPiece[]{
  const members=stripMembers(pieces,keys);if(members.length<2)return pieces;
  const id=`linked-${pieces.findIndex(p=>p.key===members[0])}`,wanted=new Set(members);
  return flowStrip(pieces.map(p=>wanted.has(p.key)?{...p,strip:id}:p),id,150,undefined,0);
}
export function splitFilms(pieces:FilmPiece[],key:string){
  const id=pieces.find(p=>p.key===key)?.strip,members=pieces.filter(p=>id&&p.strip===id);let i=0;
  return pieces.map(p=>{if(!id||p.strip!==id)return p;const distance=(i++-(members.length-1)/2)*30,r=filmAngle(p)*Math.PI/180;
    return {...p,strip:undefined,x:Math.max(-100000,Math.min(100000,p.x+distance*Math.cos(r))),y:Math.max(-100000,Math.min(100000,p.y+distance*Math.sin(r)))};});
}
export function moveFilms(pieces:FilmPiece[],keys:readonly string[],dx:number,dy:number){
  const wanted=new Set(stripMembers(pieces,keys)),group=pieces.filter(p=>wanted.has(p.key));if(!group.length)return pieces;
  dx=Math.max(-100000-Math.min(...group.map(p=>p.x)),Math.min(100000-Math.max(...group.map(p=>p.x)),dx));
  dy=Math.max(-100000-Math.min(...group.map(p=>p.y)),Math.min(100000-Math.max(...group.map(p=>p.y)),dy));
  return pieces.map(p=>wanted.has(p.key)?{...p,x:p.x+dx,y:p.y+dy}:p);
}
export function transformFilms(pieces:FilmPiece[],key:string,rotate:boolean,factor:number){
  const first=pieces.find(p=>p.key===key);if(!first)return pieces;
  if(first.strip)return flowStrip(pieces,first.strip,first.width/first.aspect*factor,undefined,filmAngle(first)+(rotate?90:0));
  return pieces.map(p=>p.key!==key?p:rotate?{...p,turn:(p.turn+1)%4}:{...p,width:Math.max(48,Math.min(1200,p.width*factor))});
}
export function scatterFilms(pieces:FilmPiece[],seed:number){
  if(!pieces.some(p=>p.strip))return deskScatter(pieces,seed);
  let value=seed>>>0;const random=()=>{value=(Math.imul(value,1664525)+1013904223)>>>0;return value/4294967296;};
  let next=pieces;const seen=new Set<string>();let i=0;
  for(const p of pieces){const unit=p.strip??p.key;if(seen.has(unit))continue;seen.add(unit);
    const center={x:350+(i%2)*650+(random()-.5)*150,y:140+Math.floor(i/2)*300+(random()-.5)*90},angle=(random()-.5)*24;
    if(p.strip)next=flowStrip(next,p.strip,undefined,center,angle);
    else next=next.map(q=>q.key===p.key?{...q,x:center.x-(q.width+24)/2,y:center.y-(q.width/q.aspect+48)/2,turn:0,tilt:angle}:q);i++;}
  return next;
}
