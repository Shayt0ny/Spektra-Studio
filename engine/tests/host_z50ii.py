#!/usr/bin/env python3
"""Read-only Nikon Z50 II camera edit regression; photos never bundled."""
import argparse,hashlib,tempfile
from pathlib import Path
from host_smoke import Host
from host_proof import good,tiff_pixels
def exercise(host,path):
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    params={'auto_exposure':False,'grain_active':False,'glare_active':False,'halation_active':False,'preview_long_edge':800}
    outputs=[]
    for mode in ('auto','candidate'):
        opened,_=good(host,'open',{'path':str(path),'params':params,'decode':{'raw_decoder':mode}})
        assert opened['kind']=='raw' and opened['metadata']['model']=='Z50_2'
        assert opened['metadata']['raw_decoder']=='candidate-f4956c4'
        assert opened['height']>opened['width'] and opened['metadata']['orientation']==8
        sid=opened['session'];base_decode={'raw_decoder':mode}
        view={'session':sid,'tier':'live','format':'rgba8','display':'srgb','long_edge':256}
        source={'session':sid,'format':'rgba8','display':'srgb','long_edge':256}
        _,original=good(host,'render_source',source);_,film=good(host,'render_view',view)
        assert original and film and original!=film and len(set(original))>32
        outputs.append((hashlib.sha256(original).hexdigest(),hashlib.sha256(film).hexdigest()))
        good(host,'set_params',{'session':sid,'delta':{'exposure_compensation_ev':1}})
        _,brighter=good(host,'render_view',view);assert brighter!=film,'film exposure ignored'
        _,untouched=good(host,'render_source',source);assert untouched==original,'film edits changed RAW source'
        good(host,'set_params',{'session':sid,'delta':{'exposure_compensation_ev':0}})
        good(host,'redecode',{'session':sid,'decode':{**base_decode,'white_balance':{'mode':'custom','temperature_k':3700,'tint':10}}})
        _,custom=good(host,'render_source',source);assert custom!=original,'RAW WB ignored'
        good(host,'redecode',{'session':sid,'decode':{**base_decode,'raw_tone':{'exposure':-1}}})
        _,darker=good(host,'render_source',source);assert darker!=original,'RAW tone ignored'
        with tempfile.TemporaryDirectory(prefix='spk-z50ii-') as work:
            output=Path(work)/'graded.tif'
            request={'session':sid,'source_path':str(path),'decode':{**base_decode,'raw_tone':{'exposure':-1}},
                'format':'tiff8','color_space':'sRGB','long_edge':256,'proof_long_edge':512,'generation':5,
                'geometry':{'crop':{'x':.1,'y':.1,'width':.8,'height':.8},'quarterTurns':1},'adjustments':{'exposure':.3}}
            proof,pixels=good(host,'render_proof',request)
            good(host,'export_frame',{**request,'path':str(output)})
            assert tiff_pixels(output)==bytes(v for i,v in enumerate(pixels) if i%4!=3),'proof/file mismatch'
            assert proof['file_width']>proof['file_height'],'source orientation or output turn lost'
            deep=Path(work)/'source16.tif'
            good(host,'export_frame',{**request,'path':str(deep),'format':'tiff16','no_film':True,'adjustments':{'enabled':False}})
            assert len(tiff_pixels(deep))==proof['file_width']*proof['file_height']*6
        good(host,'redecode',{'session':sid,'decode':base_decode})
        _,restored=good(host,'render_source',source);assert restored==original,'RAW restore drifted'
        good(host,'close',{'session':sid})
        print(f'PASS Z50 II {mode}: native film/RAW exposure, WB, crop/turn, TIFF8/16, exact proof and restore',flush=True)
    assert outputs[0]==outputs[1],'Auto fallback differs from forced candidate'
    assert hashlib.sha256(path.read_bytes()).hexdigest()==digest,'source changed'
    print('PASS automatic fallback matches candidate; source SHA256 unchanged',flush=True)
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--host',required=True);parser.add_argument('--resources',required=True);parser.add_argument('--raw',required=True);a=parser.parse_args()
    host=Host([a.host,'--resources',a.resources])
    try:exercise(host,Path(a.raw))
    finally:
        if host.p.poll() is None:host.call('shutdown');host.p.wait(timeout=20)
