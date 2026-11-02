import {it,expect} from 'vitest';
import {deskLayout,filmAngle,filmPoint,readDesk,writeDesk} from './desk';
import {arrangeFilms,stripMembers,moveFilms,transformFilms,joinFilms,splitFilms,scatterFilms} from './filmStrips';
it('mixed layout contains connected strips and singles; dragging preserves all group offsets',()=>{
  const pieces=arrangeFilms(deskLayout(Array.from({length:8},(_,i)=>String(i))),'mixed');
  expect(pieces.some(p=>p.strip)).toBe(true);expect(pieces.some(p=>!p.strip)).toBe(true);
  const members=stripMembers(pieces,[pieces[0]!.key]),moved=moveFilms(pieces,[pieces[0]!.key],75,-20);
  expect(members.length).toBeGreaterThan(1);
  moved.forEach((p,i)=>{expect(p.x-pieces[i]!.x).toBe(members.includes(p.key)?75:0);expect(p.y-pieces[i]!.y).toBe(members.includes(p.key)?-20:0);});
  const split=splitFilms(moved,pieces[0]!.key);expect(stripMembers(split,[pieces[0]!.key])).toEqual([pieces[0]!.key]);
});
it('joining, rotating and resizing keeps every member clickable and preserves photographic aspect',()=>{
  const start=deskLayout(['a','b','c','d'],{a:.67,b:1.5,c:1}),joined=joinFilms(start,['a','b','c']);
  let next=transformFilms(joined,'b',true,1);next=transformFilms(next,'a',false,.85);
  for(const p of next){expect(p.aspect).toBe(start.find(q=>q.key===p.key)!.aspect);if(p.strip){expect(filmAngle(p)).toBe(90);const point=filmPoint(p,{x:p.x+(p.width+24)/2,y:p.y+(p.width/p.aspect+48)/2});expect(point?.u).toBeCloseTo(.5);expect(point?.v).toBeCloseTo(.5);}}
  expect(next[3]).toEqual(start[3]);
});
it('scatter is deterministic and retains group membership, and placement survives local storage',()=>{
  const original=arrangeFilms(deskLayout(['a','b','c','d','e','f','g','h']),'mixed'),pieces=scatterFilms(original,42);
  expect(scatterFilms(original,42)).toEqual(pieces);expect(pieces.map(p=>p.strip)).toEqual(original.map(p=>p.strip));
  let raw='';const storage={getItem:()=>raw||null,setItem:(_:string,v:string)=>{raw=v;}};
  const state={pieces,view:{x:0,y:0,scale:1},lamp:true,brightness:1,arranged:true,toolsOpen:false};writeDesk(storage,'test',state);expect(readDesk(storage,'test')).toEqual(state);
});
