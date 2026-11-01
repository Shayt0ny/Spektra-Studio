#!/usr/bin/env python3
"""Read-only user camera regression. Outputs stay in an owned temporary folder."""
import argparse,hashlib,tempfile
from pathlib import Path
from host_smoke import Host
from host_proof import good,tiff_pixels
def exercise(host,path):
    before=hashlib.sha256(path.read_bytes()).digest()
    params={'auto_exposure':False,'grain_active':False,'halation_active':False,'glare_active':False,'preview_long_edge':800}
    opened,_=good(host,'open',{'path':str(path),'params':params});sid=opened['session']
    assert opened['kind']=='raw' and opened['metadata']['model']=='DC-ZS300'
    request={'session':sid,'tier':'live','display':'srgb','format':'rgba8','long_edge':256}
    _,base=good(host,'render_view',request)
    good(host,'set_params',{'session':sid,'delta':{'exposure_compensation_ev':1}})
    _,brighter=good(host,'render_view',request);assert base!=brighter,'film exposure ignored'
    good(host,'set_params',{'session':sid,'delta':{'exposure_compensation_ev':0}})
    source={'session':sid,'display':'srgb','format':'rgba8','long_edge':256}
    _,original=good(host,'render_source',source)
    good(host,'redecode',{'session':sid,'decode':{'raw_tone':{'exposure':-1}}})
    _,darker=good(host,'render_source',source);assert darker!=original,'RAW tone ignored'
    with tempfile.TemporaryDirectory(prefix='spk-panasonic-') as folder:
        file=Path(folder)/'raw-master.tif'
        view={'session':sid,'source_path':str(path),'format':'tiff16','color_space':'sRGB','long_edge':256,
            'no_film':True,'decode':{'raw_tone':{'exposure':-1}},'adjustments':{'enabled':False},'generation':1,'proof_long_edge':512}
        proof,pixels=good(host,'render_proof',view);good(host,'export_frame',{**view,'path':str(file)})
        codes=tiff_pixels(file)
        assert len(codes)==proof['file_width']*proof['file_height']*6
    good(host,'redecode',{'session':sid,'decode':{'white_balance':{'mode':'custom','temperature_k':4000,'tint':10}}})
    _,custom=good(host,'render_source',source);assert custom!=original,'WB change ignored'
    for mode in ('tone','white_balance'):
        auto,_=good(host,'auto_raw',{'session':sid,'mode':mode});assert auto['samples']>=16
        assert 'raw_tone' in auto if mode=='tone' else 2000<=auto['temperature_k']<=50000
    good(host,'redecode',{'session':sid,'decode':{}})
    _,restored=good(host,'render_source',source);assert restored==original,'restore changed the source'
    good(host,'close',{'session':sid})
    assert hashlib.sha256(path.read_bytes()).digest()==before,'source changed'
    print('PASS DC-ZS300 native RAW, film edits, RAW tone, WB, auto, TIFF16/proof, exact restore; source SHA unchanged')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--host',required=True);p.add_argument('--resources',required=True);p.add_argument('--raw',required=True);a=p.parse_args()
    host=Host([a.host,'--resources',a.resources])
    try:exercise(host,Path(a.raw))
    finally:
        if host.p.poll() is None:host.call('shutdown');host.p.wait(timeout=20)
