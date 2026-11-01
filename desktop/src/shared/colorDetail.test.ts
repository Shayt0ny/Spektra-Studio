import { describe,expect,it } from 'vitest';
import { applyDetail, detailActive, hslPixel } from './colorDetail';
describe('HSL and spatial detail',()=>{
  it('turns saturated red into a known orange with independent H/S/L, keeping grey neutral',()=>{
    const bands={red:{hue:30,saturation:-50,luminance:0}};
    expect(hslPixel([1,0,0],bands)).toEqual([.75,.5,.25]);
    expect(hslPixel([.4,.4,.4],bands)).toEqual([.4,.4,.4]);
    expect(detailActive({hsl:bands})).toBe(true);
  });
  it('does no work at neutral and enhances or softens fine detail without modifying alpha',()=>{
    const source=Float32Array.from({length:64*64*4},(_,i)=>i%4===3?1:Math.floor(i/4)%2?.6:.4),neutral=source.slice();
    applyDetail(neutral,64,64,{});expect(neutral).toEqual(source);
    const up=source.slice(),down=source.slice();applyDetail(up,64,64,{texture:100});applyDetail(down,64,64,{texture:-100});
    expect(up[4]!).toBeGreaterThan(source[4]!);expect(down[4]!).toBeLessThan(source[4]!);expect(up[7]).toBe(1);
  });
});
