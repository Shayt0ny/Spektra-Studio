import argparse,hashlib,shutil,tempfile,time
from pathlib import Path
from host_smoke import Host
from host_proof import good

def exercise(host,source):
    digest=hashlib.sha256(source.read_bytes()).digest()
    with tempfile.TemporaryDirectory(prefix='spk-raw-auto-') as folder:
        owned=Path(folder)/source.name;shutil.copy2(source,owned)
        opened,_=good(host,'open',{'path':str(owned),'params':{'grain_active':False,'glare_active':False}});sid=opened['session']
        hello,_=good(host,'hello');assert 'raw_auto_curve' in hello['view_options']
        owned.rename(owned.with_suffix(owned.suffix+'.offline'))
        timings=[]
        for mode in ('tone','white_balance','curve','curve','tone'):
            started=time.perf_counter();result,_=good(host,'auto_raw',{'session':sid,'mode':mode});timings.append((mode,round((time.perf_counter()-started)*1000,2)))
            assert result['analysis_source']=='cached_raw_samples' and 16<=result['samples']<=8192 and result['sample_limit']==8192
            if mode=='curve':
                pts=result['curve']['points'];assert len(pts)==7 and pts[0]==[0,0] and pts[-1]==[1,1]
                assert all(a[0]<b[0] and a[1]<b[1] for a,b in zip(pts,pts[1:]))
            elif mode=='white_balance':assert 2000<=result['temperature_k']<=50000 and abs(result['tint'])<=150
        good(host,'close',{'session':sid})
    assert hashlib.sha256(source.read_bytes()).digest()==digest
    print('PASS cached RAW auto tone/WB/curve with owned file offline, <=8192 samples, monotone editable curve; source SHA unchanged')
    print('LOCAL_AUTO_ROUNDTRIP_MS',timings)
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--host',required=True);p.add_argument('--resources',required=True);p.add_argument('--raw',required=True);a=p.parse_args()
    host=Host([a.host,'--resources',a.resources])
    try:exercise(host,Path(a.raw))
    finally:
        if host.p.poll() is None:host.call('shutdown');host.p.wait(timeout=20)
