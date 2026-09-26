"""Builds src/data/routes/<plan>.json for every plan in src/data/plans/:
roads (OSRM) for drive/bus/walk, OpenStreetMap tracks for train and Shinkansen. Flights and ropeways stay straight/curved."""
import json, glob, os, sys, hashlib, time, urllib.request
from anyrail import route as rail_route
HERE=os.path.dirname(os.path.abspath(__file__))
UA={'User-Agent':'YukimichiTripPlanner/1.0 (https://de75-173-32-75-236.ngrok-free.app; personal trip planner) python-urllib'}
os.makedirs(f'{HERE}/cache/osrm',exist_ok=True)

def osrm(pts,profile):
    base={'car':'https://router.project-osrm.org/route/v1/driving/','foot':'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'}[profile]
    url=base+';'.join(f"{lon:.5f},{lat:.5f}" for lon,lat in pts)+'?overview=full&geometries=geojson'
    f=f'{HERE}/cache/osrm/'+hashlib.md5(url.encode()).hexdigest()+'.json'
    if not os.path.exists(f):
        for i in range(4):
            try: open(f,'wb').write(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=60).read()); break
            except Exception as e: print('  osrm retry',e); time.sleep(3)
        time.sleep(1)
    try: d=json.load(open(f))
    except Exception: return None
    return d['routes'][0]['geometry']['coordinates'] if d.get('code')=='Ok' else None

only=sys.argv[1:]
for path in sorted(glob.glob(f'{HERE}/../src/data/plans/*.json')):
    name=os.path.basename(path)[:-5]
    if only and name not in only: continue
    plan=json.load(open(path)); P={p['id']:p for p in plan['places']}
    out={}; miss=0
    for d in plan['days']:
        for i,leg in enumerate(d['legs']):
            a,b=P.get(leg['from']),P.get(leg['to'])
            if not a or not b: print('  missing place',name,d['n'],leg['from'],leg['to']); continue
            pts=[(a['lon'],a['lat'])]+[tuple(v) for v in leg.get('via',[])]+[(b['lon'],b['lat'])]
            m=leg['mode']; line=None
            if m in ('drive','bus','walk'): line=osrm(pts,'foot' if m=='walk' else 'car')
            elif m=='shinkansen':
                try: line=rail_route(pts,shinkansen=True)
                except Exception as e: print('  rail error',e)
            elif m=='train':
                try: line=rail_route(pts)
                except Exception as e: print('  rail error',e)
                if not line:
                    # Long local trips: try again with more room around the tracks and easier transfers
                    try: line=rail_route(pts,pad=0.25,join=0.01)
                    except Exception as e: print('  rail error',e)
            else: continue
            if not line and m in ('train','shinkansen'):
                # Last resort: follow the roads, which is still closer to the real path than a straight line
                line=osrm(pts,'car')
                if line: print('  road line for',name,d['n'],m,leg['from'],'->',leg['to'])
            if line: out[f"{d['n']}-{i}"]=[[round(x,5),round(y,5)] for x,y in line]
            else: miss+=1; print('  no line',name,d['n'],m,leg['from'],'->',leg['to'])
    json.dump(out,open(f'{HERE}/../src/data/routes/{name}.json','w'),separators=(',',':'))
    print(name,len(out),'lines,',miss,'straight')
