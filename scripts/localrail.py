"""Routes local train/subway/tram legs along real OpenStreetMap track geometry.
Graph = all track segments in a region + walking-transfer edges (with a penalty) between nearby tracks."""
import json, os, math, heapq, urllib.request, urllib.parse, time
REGIONS={
 'tokyo':(35.45,139.55,35.85,140.45),
 'sendai':(38.18,140.28,38.42,141.12),
 'hakodate':(41.70,140.60,41.95,140.80),
 'sapporo':(42.74,141.28,43.10,141.72),
}
def fetch(name):
    f=f'cache/localrail_{name}.json'
    if os.path.exists(f): return json.load(open(f))
    s,w,n,e=REGIONS[name]
    q=f'[out:json][timeout:300];way["railway"~"^(rail|subway|light_rail|tram|monorail)$"][!"service"]({s},{w},{n},{e});out geom;'
    for i in range(5):
        try:
            d=json.load(urllib.request.urlopen(urllib.request.Request('https://overpass-api.de/api/interpreter',data=urllib.parse.urlencode({'data':q}).encode(),headers={'User-Agent':'trip-planner/1.0'}),timeout=400)); break
        except Exception as ex: print('overpass retry',ex); time.sleep(20)
    ways=[[(round(g['lon'],6),round(g['lat'],6)) for g in el['geometry']] for el in d['elements'] if 'geometry' in el]
    json.dump(ways,open(f,'w')); return ways
def dist(a,b): return math.hypot((a[0]-b[0])*math.cos(math.radians(a[1])),a[1]-b[1])
class Graph:
    def __init__(self,ways):
        self.adj={}
        for w in ways:
            for a,b in zip(w,w[1:]):
                d=dist(a,b); self.adj.setdefault(a,[]).append((b,d)); self.adj.setdefault(b,[]).append((a,d))
        self.nodes=list(self.adj)
        # grid index for nearest-node lookups and transfer edges
        self.cell=0.003; self.grid={}
        for p in self.nodes: self.grid.setdefault((int(p[0]//self.cell),int(p[1]//self.cell)),[]).append(p)
        for p in self.nodes:
            for q in self.near(p,0.002):
                if q!=p:
                    d=dist(p,q)
                    if d<0.002: self.adj[p].append((q,0.008+d*3))  # transfer: about 1 km penalty
    def near(self,p,r):
        cx,cy=int(p[0]//self.cell),int(p[1]//self.cell); k=int(r//self.cell)+1
        return [q for i in range(cx-k,cx+k+1) for j in range(cy-k,cy+k+1) for q in self.grid.get((i,j),[])]
    def nearest(self,p):
        for r in (0.003,0.01,0.03,0.1):
            c=self.near(p,r)
            if c: return min(c,key=lambda q:dist(p,q))
        return min(self.nodes,key=lambda q:dist(p,q))
    def path(self,A,B):
        s,t=self.nearest(A),self.nearest(B); D={s:0}; prev={}; pq=[(0,s)]
        while pq:
            dd,u=heapq.heappop(pq)
            if u==t: break
            if dd>D[u]: continue
            for v,w in self.adj[u]:
                nd=dd+w
                if nd<D.get(v,1e9): D[v]=nd; prev[v]=u; heapq.heappush(pq,(nd,v))
        if t not in prev and s!=t: return None
        p=[t]
        while p[-1]!=s: p.append(prev[p[-1]])
        return p[::-1]
_graphs={}
def region_of(p):
    for k,(s,w,n,e) in REGIONS.items():
        if s<=p[1]<=n and w<=p[0]<=e: return k
def route(points):
    reg=region_of(points[0])
    if reg is None or any(region_of(p)!=reg for p in points): return None
    if reg not in _graphs: _graphs[reg]=Graph(fetch(reg)); print('graph',reg,len(_graphs[reg].nodes))
    g=_graphs[reg]; out=[points[0]]
    for a,b in zip(points,points[1:]):
        seg=g.path(a,b)
        if seg is None: return None
        out+=seg
    out.append(points[-1])
    simp=[out[0]]
    for p in out[1:]:
        if dist(simp[-1],p)>0.0004: simp.append(p)
    simp.append(out[-1]); return simp
