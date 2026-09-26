import json, sys, urllib.request, urllib.parse, os
def fetch(rel):
    p=f'cache/rel_{rel}.json'
    if os.path.exists(p): return json.load(open(p))
    q=f'[out:json][timeout:120];relation({rel});out geom;'
    req=urllib.request.Request('https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':q}).encode(),headers={'User-Agent':'trip-planner/1.0'})
    d=json.load(urllib.request.urlopen(req,timeout=180)); json.dump(d,open(p,'w')); return d
def chain(rel):
    d=fetch(rel)['elements'][0]
    ways=[[(g['lon'],g['lat']) for g in m['geometry']] for m in d['members'] if m['type']=='way' and 'geometry' in m]
    # greedy chaining
    line=list(ways.pop(0)); 
    import math
    dist=lambda a,b:(a[0]-b[0])**2+(a[1]-b[1])**2
    while ways:
        best=None
        for i,w in enumerate(ways):
            for rev in (False,True):
                ww=w[::-1] if rev else w
                for end in ('tail','head'):
                    dd=dist(line[-1],ww[0]) if end=='tail' else dist(ww[-1],line[0])
                    if best is None or dd<best[0]: best=(dd,i,rev,end)
        dd,i,rev,end=best; w=ways.pop(i); w=w[::-1] if rev else w
        if dd>0.0004: continue  # skip disjoint bits (>~2km)
        line = line+w if end=='tail' else w+line
    return line
if __name__=="__main__":
  out={}
  for name,rel in [('tohoku',9326156),('yamagata',5361845),('hokkaido',5947648)]:
      l=chain(rel); out[name]=l; print(name,len(l),l[0],l[-1])
  json.dump(out,open('cache/rail.json','w'))
