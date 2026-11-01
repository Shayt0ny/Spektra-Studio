#!/usr/bin/env python3
"""Whole-look blend, original endpoints and common output; owned fixture only."""
import argparse
from pathlib import Path
import struct
import tempfile
from host_smoke import Host, write_tiff16
from host_proof import good, tiff_pixels

def exercise(host, folder):
    source=folder/'source.tif'; write_tiff16(str(source),96,64)
    params={'grain_active':False,'glare_active':False,'halation_active':False,'preview_long_edge':800}
    opened,_=good(host,'open',{'path':str(source),'params':params}); sid=opened['session']
    base={'session':sid,'tier':'full','format':'rgba16','display':'srgb','long_edge':0,'adjustments':{'enabled':False}}
    _,full=good(host,'render_view',base)
    _,explicit=good(host,'render_view',{**base,'film_strength':1})
    assert full==explicit, '100% moved the default picture'
    _,zero=good(host,'render_view',{**base,'film_strength':0})
    _,raw=good(host,'render_view',{**base,'no_film':True})
    assert zero==raw, '0% does not use the decoded original'
    assert zero!=full, 'film strength was ignored'
    # File output includes the common gamut transform after the blend.
    planes=[]
    for amount in (0,.2,1):
        path=folder/f'{amount}.tif'
        good(host,'export_frame',{'session':sid,'source_path':str(source),'path':str(path),'format':'tiff16',
            'color_space':'prophoto','film_strength':amount,'adjustments':{'enabled':False}})
        planes.append([x[0] for x in struct.iter_unpack('<H',tiff_pixels(path))])
    assert planes[0]!=planes[1] and planes[1]!=planes[2], 'file output ignored the amount'
    geom={'quarterTurns':1,'flipH':True,'crop':{'x':.1,'y':.1,'width':.7,'height':.8}}
    grade={'enabled':True,'exposure':.6,'contrast':15,'saturation':-20}
    request={'session':sid,'source_path':str(source),'film_strength':.2,'geometry':geom,'adjustments':grade,
        'format':'tiff8','color_space':'sRGB','proof_long_edge':192,'generation':3}
    proof,pixels=good(host,'render_proof',request); path=folder/'graded.tif'
    good(host,'export_frame',{**request,'path':str(path)})
    assert tiff_pixels(path)==bytes(x for i,x in enumerate(pixels) if i%4!=3), 'proof/file blend mismatch'
    assert proof['file_height']>proof['file_width'], 'geometry lost'
    for amount in (-.1,1.1,'20'):
        reply,_=host.call('render_view',{**base,'film_strength':amount}); assert not reply['ok'],reply
    # Framing reuses the actual gate coverage instead of stretching the photo.
    good(host,'set_params',{'session':sid,'delta':{'overscan_active':True}})
    framed,p=good(host,'render_view',{**base,'film_strength':.2})
    assert p and framed['image']['width']>96
    good(host,'close',{'session':sid})

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--host',required=True);parser.add_argument('--resources',required=True);args=parser.parse_args()
    host=Host([args.host,'--resources',args.resources])
    try:
        with tempfile.TemporaryDirectory(prefix='spk-film-strength-') as work:exercise(host,Path(work))
        print('PASS 100% exact, 0% decoded source, 20% working blend, grade/geometry/proof/export and physical gate')
    finally:
        if host.p.poll() is None:host.call('shutdown');host.p.wait(timeout=20)
