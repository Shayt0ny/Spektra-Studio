import { CURVES_IDENTITY, curvesIdentity, decodeAdjustments, zoneNeutral, type CurveSet,type ColorBalance } from './adjustments';
import { detailActive,type HslSettings } from './colorDetail';
export interface RawTone { exposure:number;contrast:number;highlights:number;shadows:number;whites:number;blacks:number;curves:CurveSet;colorBalance?:ColorBalance;hsl?:HslSettings }
export const RAW_TONE_DEFAULT:RawTone={exposure:0,contrast:0,highlights:0,shadows:0,whites:0,blacks:0,curves:CURVES_IDENTITY};
export function decodeRawTone(raw:unknown):RawTone {
  const o=raw&&typeof raw==='object'?raw as Record<string,unknown>:{};
  const number=(key:string,limit:number)=>typeof o[key]==='number'&&Number.isFinite(o[key])?Math.max(-limit,Math.min(limit,o[key] as number)):0;
  const decoded=decodeAdjustments({curves:o.curves,colorBalance:o.colorBalance,hsl:o.hsl});
  for(const zone of Object.values(decoded.colorBalance)){
    zone.hue=Math.max(-360,Math.min(360,zone.hue));
    zone.saturation=Math.max(-1,Math.min(1,zone.saturation));
    zone.luminance=Math.max(-1,Math.min(1,zone.luminance));
  }
  return {exposure:number('exposure',5),contrast:number('contrast',100),highlights:number('highlights',100),shadows:number('shadows',100),whites:number('whites',100),blacks:number('blacks',100),curves:decoded.curves,
    ...(o.colorBalance?{colorBalance:decoded.colorBalance}:{}),...(o.hsl?{hsl:decoded.hsl}:{})};
}
export function rawToneActive(a:RawTone|undefined) {return !!a&&(a.exposure!==0||a.contrast!==0||a.highlights!==0||a.shadows!==0||a.whites!==0||a.blacks!==0||!curvesIdentity(a.curves)||Object.values(a.colorBalance??{}).some(z=>!zoneNeutral(z))||detailActive({hsl:a.hsl}));}
