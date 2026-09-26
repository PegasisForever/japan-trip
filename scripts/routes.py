"""Builds src/data/routes.json: real road geometry (OSRM) and Shinkansen track (OpenStreetMap) per day leg."""
from localrail import route as rail_route
import json, subprocess, urllib.request, os, hashlib, time, math
data=json.loads(subprocess.check_output(['node','export.ts']))
P={p['id']:p for p in data['places']}
rail=json.load(open('cache/railpaths.json'))
os.makedirs('cache/osrm',exist_ok=True)
def osrm(pts,profile):
    base={'car':'https://router.project-osrm.org/route/v1/driving/','foot':'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'}[profile]
    url=base+';'.join(f"{lon:.5f},{lat:.5f}" for lon,lat in pts)+'?overview=full&geometries=geojson'
    h=hashlib.md5(url.encode()).hexdigest(); f=f'cache/osrm/{h}.json'
    if not os.path.exists(f):
        for i in range(4):
            try:
                r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'trip-planner/1.0'}),timeout=60).read(); open(f,'wb').write(r); break
            except Exception as e: print('retry',e); time.sleep(3)
        time.sleep(1)
    d=json.load(open(f))
    if d.get('code')!='Ok': raise SystemExit(f'OSRM failed {url}')
    return d['routes'][0]['geometry']['coordinates'], d['routes'][0]['distance'], d['routes'][0]['duration']
def near(a,b): return math.hypot(a[0]-b[0],a[1]-b[1])<0.05
out={}; km=0
for d in data['days']:
    for i,leg in enumerate(d['legs']):
        a,b=P[leg['from']],P[leg['to']]; pa=(a['lon'],a['lat']); pb=(b['lon'],b['lat'])
        key=f"{d['n']}-{i}"; m=leg['mode']
        if m in ('drive','bus','walk'):
            pts=[pa]+[(v[0],v[1]) for v in leg.get('via',[])]+[pb]
            coords,dist,dur=osrm(pts,'foot' if m=='walk' else 'car')
            if m=='drive': km+=dist/1000
            out[key]=[[round(x,5),round(y,5)] for x,y in coords]
            print(key,m,leg['from'],'->',leg['to'],f"{dist/1000:.0f}km {dur/60:.0f}min")
        elif m=='train':
            pts=[pa]+[(v[0],v[1]) for v in leg.get('via',[])]+[pb]
            line=rail_route(pts)
            if line: out[key]=[[round(x,5),round(y,5)] for x,y in line]; print(key,'train',leg['from'],'->',leg['to'],len(line),'pts')
            else: print('NO RAIL PATH',key,leg['from'],leg['to'])
        elif m=='shinkansen':
            for line in rail.values():
                s=line[0]; e=line[-1]
                if near(s,pa) and near(e,pb): out[key]=line; break
                if near(e,pa) and near(s,pb): out[key]=line[::-1]; break
            else: print('no rail geometry for',key,leg['from'],leg['to'])
print('total drive km',round(km))
json.dump(out,open('../src/data/routes.json','w'),separators=(',',':'))
