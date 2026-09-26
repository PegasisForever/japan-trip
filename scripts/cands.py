"""Collects up to 6 Commons photo candidates per place so a human (or Claude) can pick the best one."""
import json, urllib.request, urllib.parse, os, sys, time, subprocess
UA={'User-Agent':'YukimichiTripPlanner/1.0 (personal trip site; contact via github)'}
queries=json.load(open('photo-queries.json'))
os.makedirs('cache/cands',exist_ok=True)
db=json.load(open('cache/cands.json')) if os.path.exists('cache/cands.json') else {}
only=sys.argv[1:]
def fetch(u,binary=False):
    for i in range(10):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
            return r if binary else json.loads(r)
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(30*(i+1)); continue
            raise
    raise SystemExit('rate limited')
for pid,q in queries.items():
    if only and pid not in only: continue
    if not only and pid in db: continue
    params=dict(action='query',format='json',generator='search',gsrsearch=q+' filetype:bitmap',gsrnamespace=6,gsrlimit=20,prop='imageinfo',iiprop='url|size|mime|extmetadata',iiurlwidth=1280)
    d=fetch('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params))
    pages=sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0))
    out=[]
    for pg in pages:
        ii=pg.get('imageinfo',[{}])[0]
        if ii.get('mime')!='image/jpeg' or ii.get('width',0)<900 or ii.get('width',0)<ii.get('height',1)*(0.7 if pid in ('hotel-shinjuku','nakano') else 1.05): continue
        thumb=ii['thumburl'].replace('/1280px-','/250px-')
        f=f'cache/cands/{pid}_{len(out)}.jpg'
        open(f,'wb').write(fetch(thumb,True)); time.sleep(1.5)
        out.append({'title':pg['title'],'thumb1280':ii['thumburl'],'url':ii['descriptionurl'],'meta':{k:ii['extmetadata'].get(k,{}).get('value','') for k in ('Artist','LicenseShortName')}})
        if len(out)==6: break
    db[pid]=out; print(pid,len(out),flush=True)
    json.dump(db,open('cache/cands.json','w'),ensure_ascii=False)
    time.sleep(2)
