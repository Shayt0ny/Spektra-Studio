#!/usr/bin/env python3
"""Spatial controls: legacy pixels, owning stages, bypasses, striped halos and file proof.

Run --record BEFORE rebuilding to pin the previous binary's defaults, then rerun
without --record against the new host. Synthetic PNG only; no user RAW is changed.
"""
import hashlib
import json
from pathlib import Path
import sys
import tempfile

import numpy as np
from PIL import Image
from host_smoke import Host
from host_proof import tiff_pixels

host = Host([sys.argv[1], '--resources', sys.argv[2]])
baseline = Path(sys.argv[3])
record = '--record' in sys.argv

def call(method, params=None):
    reply, data = host.call(method, params)
    assert reply['ok'], reply
    return reply['result'], data

def digest(data):
    return hashlib.sha256(data).hexdigest()

try:
    call('hello')
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / 'spatial.png'
        y, x = np.indices((257, 321))
        a = np.empty((257, 321, 3), dtype=np.uint8)
        a[..., 0] = np.where((x // 4 + y // 5) % 2, 210, 42)
        a[..., 1] = np.where(x > 155, 183, 68)
        a[..., 2] = 45 + (y * 160 // 257)
        Image.fromarray(a).save(path)
        original = digest(path.read_bytes())
        common = {'auto_exposure': False, 'glare_active': False, 'grain_active': False,
                  'halation_active': False, 'preview_long_edge': 800}
        opened, _ = call('open', {'path': str(path), 'params': common})
        sid = opened['session']

        def set_params(delta):
            call('set_params', {'session': sid, 'delta': delta})

        def render(extra=None):
            result, pixels = call('render', {'session': sid, 'tier': 'full', 'format': 'rgba16',
                                            'display': 'srgb', **(extra or {})})
            assert len(pixels) == result['image']['width'] * result['image']['height'] * 8
            return pixels

        previous = {}
        for grain in (False, True):
            set_params({'grain_active': grain})
            px = render()
            previous[str(grain)] = digest(px)
        if record:
            baseline.write_text(json.dumps(previous, indent=2), encoding='utf-8')
            print('RECORDED previous-host default pixel hashes', previous, flush=True)
        else:
            assert previous == json.loads(baseline.read_text()), (previous, baseline.read_text())
            print('PASS previous binary default pixels: grain on/off bit-exact', flush=True)
            defaults = {'lens_blur_um': 0, 'grain_blur': .65, 'enlarger_lens_blur': 0,
                        'scanner_unsharp_radius': .7, 'scanner_unsharp_amount': .7,
                        'grain_active': False, 'scan_film': False, 'digital_intermediate': False,
                        'striped': False}
            set_params(defaults)
            neutral = render()
            def preview():
                result,pixels=call('render_view',{'session':sid,'tier':'live','format':'rgba8','display':'srgb','long_edge':256})
                assert len(pixels)==result['image']['width']*result['image']['height']*4
                return pixels
            neutral_preview=preview()
            assert digest(neutral) == previous['False']
            # Rendering actual pixels also catches an accepted but disconnected slider.
            cases = [('lens_blur_um', 150), ('enlarger_lens_blur', 2),
                     ('scanner_lens_blur', 2), ('scanner_unsharp_radius', 2),
                     ('scanner_unsharp_amount', 0)]
            for key, value in cases:
                set_params({key: value})
                changed = render()
                assert changed != neutral, f'{key} did not affect pixels'
                assert preview()!=neutral_preview, f'{key} did not affect live preview'
                set_params({key: 0 if key.endswith('lens_blur') or key == 'lens_blur_um' else .7})
                assert render() == neutral, f'{key} failed exact restoration'
                assert preview()==neutral_preview, f'{key} live preview failed restoration'
                print('PASS actual pixel change and exact restore:', key, flush=True)
            set_params({'grain_active': True})
            grained = render()
            set_params({'grain_blur': 2})
            assert render() != grained, 'grain diffusion did not affect density/render'
            set_params({'grain_blur': .65})
            assert render() == grained
            # Grain-off prunes its own density diffusion; direct scans bypass enlarger.
            set_params({'grain_active': False, 'grain_blur': 9})
            assert render() == neutral
            set_params({'grain_blur': .65, 'scan_film': True})
            direct = render()
            set_params({'enlarger_lens_blur': 10})
            assert render() == direct
            set_params({'scan_film': False, 'enlarger_lens_blur': 0, 'digital_intermediate': True})
            di = render()
            set_params({'enlarger_lens_blur': 10, 'scanner_unsharp_amount': 4})
            assert render() == di
            print('PASS inactive grain, direct film and DI bypasses', flush=True)
            set_params(defaults)
            for radius in (1.3, 4):  # FIR halos and IIR whole-frame path
                set_params({'enlarger_lens_blur': radius, 'striped': False})
                whole = render()
                set_params({'striped': True, 'strip_rows': 23})
                striped = render()
                error = np.abs(np.frombuffer(whole, '<u2').astype(int) - np.frombuffer(striped, '<u2').astype(int))
                assert error.max() <= 1, (radius, int(error.max()))
                print('PASS enlarger stripe halo/whole-frame agreement:', radius, int(error.max()), flush=True)
            final = {**common, **defaults, 'grain_active': True, 'grain_blur': 1.1,
                        'lens_blur_um': 20, 'enlarger_lens_blur': 1.3,
                        'scanner_unsharp_radius': 1.2, 'scanner_unsharp_amount': .4}
            set_params(final)
            # File export and proof use the same settings; inspect actual TIFF samples.
            request = {'session': sid, 'params': final, 'source_path': str(path), 'format': 'tiff16',
                       'color_space': 'sRGB', 'display': 'srgb', 'proof_long_edge': 1024}
            result, proof = call('render_proof', request)
            dest = Path(tmp) / 'spatial.tif'
            call('export_frame', {**request, 'path': str(dest)})
            file_pixels = np.frombuffer(tiff_pixels(dest), '<u2').astype(np.uint32)
            file_codes = ((file_pixels * 255 + 32767) // 65535).astype(np.uint8)
            proof_codes = np.frombuffer(proof, np.uint8).reshape(-1, 4)[:, :3].reshape(-1)
            assert np.array_equal(file_codes, proof_codes), 'TIFF differs from proof'
            assert digest(path.read_bytes()) == original
            print('PASS TIFF16/proof exact pixels; input unchanged', flush=True)
        call('close', {'session': sid})
finally:
    host.call('shutdown')
    host.p.wait(timeout=15)
