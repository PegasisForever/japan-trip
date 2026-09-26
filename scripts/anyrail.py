"""Rail geometry for any train leg in Japan, from OpenStreetMap.
- Shinkansen legs: shortest path on the Shinkansen network (all main lines).
- Other train legs: shortest path on all railway tracks inside the leg's bounding box (fetched and cached per leg).
"""
import json, os, math, heapq, urllib.request, urllib.parse, time, hashlib
HERE=os.path.dirname(os.path.abspath(__file__)); CACHE=os.path.join(HERE,'cache/anyrail'); os.makedirs(CACHE,exist_ok=True)
UA={'User-Agent':'YukimichiTripPlanner/1.0 (https://de75-173-32-75-236.ngrok-free.app; personal trip planner) python-urllib'}
SHINKANSEN=[5263977,1837932,1860622,5947648,1926393,1860557,5361845,5361971]

def overpass(q,key):
    f=f'{CACHE}/{key}.json'
    if os.path.exists(f): return json.load(open(f))
    for i in range(6):
        try:
            d=json.load(urllib.request.urlopen(urllib.request.Request('https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':q}).encode(),headers=UA),timeout=300))
            json.dump(d,open(f,'w')); return d
        except Exception as e: print('  overpass retry',e); time.sleep(15*(i+1))
    raise RuntimeError('overpass failed')

def dist(a,b): return math.hypot((a[0]-b[0])*math.cos(math.radians(a[1])),a[1]-b[1])

class Graph:
    def __init__(self,ways,join=0.002):
        self.adj={}
        for w in ways:
            for a,b in zip(w,w[1:]):
                d=dist(a,b); self.adj.setdefault(a,[]).append((b,d)); self.adj.setdefault(b,[]).append((a,d))
        self.cell=0.004; self.grid={}
        for p in self.adj: self.grid.setdefault((int(p[0]//self.cell),int(p[1]//self.cell)),[]).append(p)
        # Transfers between nearby tracks (station changes), with a small penalty
        for p in list(self.adj):
            for q in self.near(p,join):
                if q!=p and dist(p,q)<join: self.adj[p].append((q,0.006+dist(p,q)*3))
    def near(self,p,r):
        cx,cy=int(p[0]//self.cell),int(p[1]//self.cell); k=int(r//self.cell)+1
        return [q for i in range(cx-k,cx+k+1) for j in range(cy-k,cy+k+1) for q in self.grid.get((i,j),[])]
    def nearest(self,p):
        for r in (0.004,0.015,0.05,0.2):
            c=self.near(p,r)
            if c: return min(c,key=lambda q:dist(p,q))
        return None
    def path(self,A,B):
        s,t=self.nearest(A),self.nearest(B)
        if not s or not t: return None
        D={s:0}; prev={}; pq=[(0,s)]
        while pq:
            dd,u=heapq.heappop(pq)
            if u==t: break
            if dd>D[u]: continue
            for v,w in self.adj[u]:
                nd=dd+w
                if nd<D.get(v,1e9): D[v]=nd; prev[v]=u; heapq.heappush(pq,(nd,v))
        if t!=s and t not in prev: return None
        p=[t]
        while p[-1]!=s: p.append(prev[p[-1]])
        return p[::-1]

def ways_of(d):
    out=[]
    for el in d['elements']:
        if el['type']=='way' and 'geometry' in el: out.append([(round(g['lon'],6),round(g['lat'],6)) for g in el['geometry']])
        if el['type']=='relation':
            for m in el.get('members',[]):
                if m['type']=='way' and 'geometry' in m: out.append([(round(g['lon'],6),round(g['lat'],6)) for g in m['geometry']])
    return out

_sk=None
def shinkansen_graph():
    global _sk
    if _sk is None:
        ways=[]
        for rel in SHINKANSEN: ways+=ways_of(overpass(f'[out:json][timeout:300];relation({rel});out geom;',f'rel{rel}'))
        _sk=Graph(ways,join=0.012)
    return _sk

def simplify(line,tol=0.0005):
    out=[line[0]]
    for p in line[1:]:
        if dist(out[-1],p)>tol: out.append(p)
    out.append(line[-1]); return out

def route(points,shinkansen=False,pad=0.08,join=0.002):
    if shinkansen: g=shinkansen_graph()
    else:
        lons=[p[0] for p in points]; lats=[p[1] for p in points]
        s,w,n,e=min(lats)-pad,min(lons)-pad,max(lats)+pad,max(lons)+pad
        area=(n-s)*(e-w)
        kinds='rail|subway|light_rail|tram|monorail' if area<0.6 else 'rail'
        q=f'[out:json][timeout:300];way["railway"~"^({kinds})$"][!"service"]({s:.3f},{w:.3f},{n:.3f},{e:.3f});out geom;'
        key='bbox-'+hashlib.md5(q.encode()).hexdigest()[:12]
        g=Graph(ways_of(overpass(q,key)),join=join)
    out=[points[0]]
    for a,b in zip(points,points[1:]):
        seg=g.path(a,b)
        if seg is None: return None
        out+=seg
    out.append(points[-1])
    return simplify(out)
