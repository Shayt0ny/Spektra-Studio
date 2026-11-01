import {describe,it,expect} from 'vitest';
import {RAW_TONE_DEFAULT,decodeRawTone,rawToneActive} from './rawTone';
import {decodeSidecar,encodeSidecar,newSidecar} from './sidecar';
import {decodeWire} from './whiteBalance';
describe('RAW colour recipe',()=>{
  it('preserves legacy defaults and inactive hue without enabling a source pass',()=>{
    expect(decodeRawTone({})).toEqual(RAW_TONE_DEFAULT);
    expect(rawToneActive(decodeRawTone({colorBalance:{master:{hue:120}}}))).toBe(false);
    expect(rawToneActive(decodeRawTone({hsl:{red:{hue:15}}}))).toBe(true);
  });
  it('round-trips RAW colours separately from the film and post-development grade',()=>{
    const a=newSidecar();a.decode.rawTone=decodeRawTone({exposure:-.5,colorBalance:{shadows:{hue:200,saturation:.2}},hsl:{blue:{hue:12,saturation:-20,luminance:5}}});
    const b=decodeSidecar(encodeSidecar(a));
    expect(b.decode.rawTone).toEqual(a.decode.rawTone);
    expect(b.adjustments).toEqual(a.adjustments);expect(b.params).toEqual(a.params);
    expect(decodeWire(b.decode,true)?.raw_tone).toEqual(a.decode.rawTone);
    expect(decodeWire(b.decode,false)).toBeNull();
  });
  it('bounds imported colour controls before sending the native request',()=>{
    const a=decodeRawTone({hsl:{blue:{hue:99,saturation:-101,luminance:NaN}},colorBalance:{master:{hue:80,saturation:5,luminance:Infinity}}});
    expect(a.hsl?.blue).toEqual({hue:30,saturation:-100,luminance:0});
    expect(a.colorBalance?.master).toEqual({hue:80,saturation:1,luminance:0});
  });
});
