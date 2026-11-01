#!/usr/bin/env python3
"""Read-only camera regression: RAW colours precede film and survive private export."""
import argparse,hashlib,tempfile
from pathlib import Path
from host_smoke import Host
from host_proof import good,tiff_pixels

def exercise(host,path):
    digest=hashlib.sha256(path.read_bytes()).digest()
    params={'auto_exposure':False,'grain_active':False,'glare_active':False,'halation_active':False,'preview_long_edge':800}
    opened,_=good(host,'open',{'path':str(path),'params':params});sid=opened['session']
    source={'session':sid,'format':'rgba8','display':'srgb','long_edge':256}
    view={**source,'tier':'live'}
    _,base=good(host,'render_source',source);_,film=good(host,'render_view',view)
    edits=[{'hsl':{'blue':{'hue':30,'saturation':-70,'luminance':15},'green':{'hue':-20,'saturation':30}}},
        {'colorBalance':{'master':{'hue':30,'saturation':.3,'luminance':.1},'shadows':{'hue':220,'saturation':.1}}}]
    for tone in edits:
        decode={'raw_tone':tone}
        good(host,'redecode',{'session':sid,'decode':decode})
        _,changed=good(host,'render_source',source);assert changed!=base,'RAW colour controls ignored'
        _,graded=good(host,'render_view',view);assert graded!=film,'RAW colour did not feed film'
        with tempfile.TemporaryDirectory(prefix='spk-raw-colour-') as folder:
            target=Path(folder)/'proof.tif'
            request={'session':sid,'source_path':str(path),'decode':decode,'format':'tiff8','color_space':'sRGB',
                'long_edge':256,'proof_long_edge':512,'generation':3,'geometry':{'quarterTurns':1,'crop':{'x':.1,'y':.1,'width':.8,'height':.8}},'adjustments':{'exposure':.3}}
            proof,pixels=good(host,'render_proof',request);good(host,'export_frame',{**request,'path':str(target)})
            assert tiff_pixels(target)==bytes(v for i,v in enumerate(pixels) if i%4!=3),'proof/file mismatch'
            master=Path(folder)/'master16.tif'
            good(host,'export_frame',{**request,'path':str(master),'format':'tiff16','no_film':True,'adjustments':{'enabled':False}})
            assert len(tiff_pixels(master))==proof['file_width']*proof['file_height']*6
        _,after=good(host,'render_source',source);assert after==changed,'private export changed the current RAW recipe'
        good(host,'redecode',{'session':sid,'decode':{}})
        _,restored=good(host,'render_source',source);assert restored==base,'RAW reset drifted'
        print('PASS RAW source and film change, exact proof/export, 16-bit export, private recipe and restore:',next(iter(tone)),flush=True)
    assert hashlib.sha256(path.read_bytes()).digest()==digest,'source modified'
    good(host,'close',{'session':sid})
    print('PASS source SHA256 unchanged',flush=True)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--host',required=True);p.add_argument('--resources',required=True);p.add_argument('--raw',required=True);a=p.parse_args()
    host=Host([a.host,'--resources',a.resources])
    try:exercise(host,Path(a.raw))
    finally:
        if host.p.poll() is None:host.call('shutdown');host.p.wait(timeout=20)
