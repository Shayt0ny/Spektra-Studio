#!/usr/bin/env python3
"""Owned native export fixtures: true PNG16, WebP pixels/ICC, record-only copies."""
import argparse, hashlib, json, struct, tempfile, zlib
from pathlib import Path
from PIL import Image
from host_smoke import Host, write_png
from host_proof import good, tiff_pixels

def png16_pixels(path):
    data = path.read_bytes(); at = 8; packed = b''; width = height = 0
    while at < len(data):
        size = struct.unpack_from('>I', data, at)[0]; name = data[at+4:at+8]; body = data[at+8:at+8+size]; at += 12 + size
        if name == b'IHDR':
            width, height, depth, color, *_ = struct.unpack('>IIBBBBB', body); assert (depth, color) == (16, 2)
        if name == b'IDAT': packed += body
    raw = zlib.decompress(packed); stride = width * 6; previous = bytearray(stride); result = bytearray()
    for y in range(height):
        method = raw[y * (stride+1)]; row = bytearray(raw[y*(stride+1)+1:(y+1)*(stride+1)])
        for i in range(stride):
            a = row[i-6] if i >= 6 else 0; b = previous[i]; c = previous[i-6] if i >= 6 else 0
            if method == 1: predictor = a
            elif method == 2: predictor = b
            elif method == 3: predictor = (a+b)//2
            elif method == 4:
                p = a+b-c; distances = [abs(p-a), abs(p-b), abs(p-c)]; predictor = [a,b,c][distances.index(min(distances))]
            else: assert method == 0; predictor = 0
            row[i] = (row[i] + predictor) & 255
        result.extend(row); previous = row
    return struct.pack('<' + 'H' * (len(result)//2), *struct.unpack('>' + 'H' * (len(result)//2), result))

def exercise(host, folder):
    source = folder / 'owned.png'; write_png(str(source), 127, 81)
    params = {'grain_active':False, 'glare_active':False, 'auto_exposure':False}
    request = {'source_path':str(source), 'params':params, 'color_space':'sRGB', 'long_edge':0,
               'adjustments':{'exposure':.27,'saturation':12}, 'geometry':{'quarterTurns':1}, 'overwrite':False}
    outputs = {}
    for fmt in ('png16','tiff16','png','webp-lossless'):
        path = folder / ('out.' + fmt); good(host,'export_frame',{**request,'format':fmt,'path':str(path)}); outputs[fmt] = path
    exact = png16_pixels(outputs['png16']); assert exact == tiff_pixels(outputs['tiff16']), 'PNG16 sample bytes differ from TIFF16'
    samples = struct.unpack('<' + 'H' * (len(exact)//2), exact); assert any(v % 257 for v in samples), '16-bit output is only expanded 8-bit'
    with Image.open(outputs['png']) as png, Image.open(outputs['webp-lossless']) as webp:
        assert png.size == webp.size and png.convert('RGB').tobytes() == webp.convert('RGB').tobytes(), 'WebP changed RGB samples'
        assert png.info.get('icc_profile') == webp.info.get('icc_profile') and webp.info.get('icc_profile'), 'WebP ICC lost'
    original = source.read_bytes(); target = folder / 'copy.png'; recipe = {'schemaVersion':3,'adjustments':{'exposure':.9}}
    result,_ = good(host,'copy_original',{'source_path':str(source),'path':str(target),'recipe':recipe})
    assert hashlib.sha256(original).digest() == hashlib.sha256(target.read_bytes()).digest()
    envelope = json.loads(Path(result['recipe_path']).read_text()); assert envelope['sidecar'] == recipe
    reread,_ = good(host,'read_recipe',{'path':result['recipe_path']}); assert reread == envelope
    header,_ = host.call('copy_original',{'source_path':str(source),'path':str(source),'recipe':recipe,'overwrite':True}); assert not header.get('ok')
    assert source.read_bytes() == original, 'source was overwritten'
    assert not list(folder.glob('.*.partial-*')), 'partial output leaked'

if __name__ == '__main__':
    p=argparse.ArgumentParser(); p.add_argument('--host',required=True); p.add_argument('--resources',required=True); args=p.parse_args()
    host=Host([args.host,'--resources',args.resources])
    try:
        with tempfile.TemporaryDirectory(prefix='spk-extended-export-') as work: exercise(host,Path(work))
        print('PASS: PNG16 samples, WebP lossless RGB/ICC, original copy and portable recipe; source unchanged')
    finally:
        if host.p.poll() is None:
            try: host.call('shutdown')
            finally: host.p.wait(timeout=20)
