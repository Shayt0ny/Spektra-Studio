// Encoded working-space HSL and bounded spatial detail, before local masks.
export const HSL_NAMES = ['red','orange','yellow','green','aqua','blue','purple','magenta'] as const;
export type HslName = typeof HSL_NAMES[number];
export interface HslBand { hue: number; saturation: number; luminance: number }
export type HslSettings = Partial<Record<HslName, HslBand>>;
export interface ColorDetail { hsl?: HslSettings; texture?: number; clarity?: number }
export const HSL_CENTERS = [0,30,60,120,180,240,270,300];
const clamp=(n:number,a=0,b=1)=>Math.max(a,Math.min(b,n));
export function decodeDetail(raw: Record<string,unknown>): ColorDetail {
  const result: ColorDetail = {}, num=(v:unknown,limit:number)=>typeof v==='number'&&Number.isFinite(v)?clamp(v,-limit,limit):0;
  if(raw.hsl&&typeof raw.hsl==='object') {
    result.hsl={};
    for(const name of HSL_NAMES) {const b=(raw.hsl as Record<string,unknown>)[name];if(b&&typeof b==='object') {
      const band=b as Record<string,unknown>;result.hsl[name]={hue:num(band.hue,30),saturation:num(band.saturation,100),luminance:num(band.luminance,100)};
    }}
  }
  if(raw.texture!==undefined)result.texture=num(raw.texture,100);
  if(raw.clarity!==undefined)result.clarity=num(raw.clarity,100);
  return result;
}
export function detailActive(a: ColorDetail) { return !!a.texture||!!a.clarity||Object.values(a.hsl??{}).some(b=>b.hue!==0||b.saturation!==0||b.luminance!==0); }
export function hslPixel(c: readonly number[], bands: HslSettings): [number,number,number] {
  const r=clamp(c[0]!),g=clamp(c[1]!),b=clamp(c[2]!),hi=Math.max(r,g,b),lo=Math.min(r,g,b),d=hi-lo;
  if(d<1e-6)return [r,g,b];
  let h=((hi===r?(g-b)/d:hi===g?(b-r)/d+2:(r-g)/d+4)*60+360)%360,l=(hi+lo)/2,s=d/Math.max(1e-6,1-Math.abs(2*l-1));
  let dh=0,ds=0,dl=0,total=0;
  HSL_NAMES.forEach((name,i)=>{const center=HSL_CENTERS[i]!,distance=(h-center+540)%360-180;
    const span=distance<0?(center-HSL_CENTERS[(i+7)%8]!+360)%360:(HSL_CENTERS[(i+1)%8]!-center+360)%360;
    const w=Math.max(0,1-Math.abs(distance)/span),a=bands[name];
    total+=w;if(a){dh+=w*a.hue;ds+=w*a.saturation/100;dl+=w*a.luminance/100;}});
  const chroma=clamp(s/.15)/Math.max(total,1e-6);
  h=(h+dh*chroma+360)%360;s=clamp(s*(1+ds*chroma));l=clamp(l+.25*dl*chroma);
  const cc=(1-Math.abs(2*l-1))*s,x=cc*(1-Math.abs((h/60)%2-1)),m=l-cc/2;
  const v=h<60?[cc,x,0]:h<120?[x,cc,0]:h<180?[0,cc,x]:h<240?[0,x,cc]:h<300?[x,0,cc]:[cc,0,x];
  return [v[0]!+m,v[1]!+m,v[2]!+m];
}
export function applyDetail(data:Float32Array,width:number,height:number,a:ColorDetail) {
  if(!detailActive(a))return;
  const original=data.slice(),scale=Math.max(width,height)/2048,texture=(a.texture??0)/100,clarity=(a.clarity??0)/100;
  const sample=(x:number,y:number,c:number)=>{
    x=clamp(x,0,width-1);y=clamp(y,0,height-1);const x0=Math.floor(x),y0=Math.floor(y),x1=Math.min(width-1,x0+1),y1=Math.min(height-1,y0+1),dx=x-x0,dy=y-y0;
    return (original[(y0*width+x0)*4+c]!*(1-dx)+original[(y0*width+x1)*4+c]!*dx)*(1-dy)+(original[(y1*width+x0)*4+c]!*(1-dx)+original[(y1*width+x1)*4+c]!*dx)*dy;
  };
  for(let y=0;y<height;y++)for(let x=0;x<width;x++) {
    const i=(y*width+x)*4,c=[original[i]!,original[i+1]!,original[i+2]!],l=.2126*c[0]!+.7152*c[1]!+.0722*c[2]!;
    for(let ch=0;ch<3;ch++) {
      let delta=0;
      for(const [amount,radius,gain] of [[texture,1.5*scale,.6],[clarity,12*scale,.4]] as const)if(amount!==0) {
        let sum=0;for(const [dx,dy] of [[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]])sum+=sample(x+dx!*radius,y+dy!*radius,ch);
        delta+=amount*gain*(c[ch]!-sum/8)*(radius>3*scale?4*l*(1-l):1);
      }
      c[ch]=clamp(c[ch]!+delta);
    }
    const out=a.hsl?hslPixel(c,a.hsl):c;for(let ch=0;ch<3;ch++)data[i+ch]=out[ch]!;
  }
}
