import json, heapq, math
from rail import fetch
segs=[]
for rel in [1860622,5361845,5947648,9326156]:
    d=fetch(rel)['elements'][0]
    segs+=[[(round(g['lon'],6),round(g['lat'],6)) for g in m['geometry']] for m in d['members'] if m['type']=='way' and 'geometry' in m]
adj={}
def dist(a,b): return math.hypot((a[0]-b[0])*math.cos(math.radians(a[1])),a[1]-b[1])
for w in segs:
    for a,b in zip(w,w[1:]):
        adj.setdefault(a,[]).append(b); adj.setdefault(b,[]).append(a)
nodes=list(adj)
# connect near-gaps (<150m) between way ends
ends=[w[0] for w in segs]+[w[-1] for w in segs]
for e in ends:
    for n in nodes:
        if n!=e and dist(e,n)<0.012: adj[e].append(n); adj[n].append(e)
def near(p): return min(nodes,key=lambda n:dist(n,p))
def path(A,B):
    s,t=near(A),near(B); D={s:0}; prev={}; pq=[(0,s)]
    while pq:
        dd,u=heapq.heappop(pq)
        if u==t: break
        if dd>D[u]: continue
        for v in adj[u]:
            nd=dd+dist(u,v)
            if nd<D.get(v,1e9): D[v]=nd; prev[v]=u; heapq.heappush(pq,(nd,v))
    p=[t]
    while p[-1]!=s: p.append(prev[p[-1]])
    return p[::-1]
import sys
st={'tokyo':(139.7671,35.6812),'yamagata':(140.3276,38.2485),'fukushima':(140.4593,37.7544),'sendai':(140.8819,38.2601),'shinhakodate':(140.6486,41.9046)}
res={}
res['tokyo-yamagata']=path(st['tokyo'],st['fukushima'])+path(st['fukushima'],st['yamagata'])
res['sendai-shinhakodate']=path(st['sendai'],st['shinhakodate'])
for k,v in res.items():
    # simplify: keep every point > 300m apart
    out=[v[0]]
    for p in v[1:]:
        if dist(out[-1],p)>0.003: out.append(p)
    out.append(v[-1]); res[k]=out; print(k,len(out),out[0],out[-1])
json.dump(res,open('cache/railpaths.json','w'))
