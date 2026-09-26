"""Finds a real photo per place on Wikimedia Commons, saves 1280px + 320px copies and the credit."""
import json, subprocess, urllib.request, urllib.parse, os, re, sys, time
UA={'User-Agent':'YukimichiTripPlanner/1.0 (personal trip site)'}
data=json.loads(subprocess.check_output(['node','export.ts']))
queries=json.load(open('photo-queries.json'))
credits=json.load(open('../src/data/photos.json')) if os.path.exists('../src/data/photos.json') else {}
only=set(sys.argv[1:])
os.makedirs('../public/photos/t',exist_ok=True)
def api(params):
    params.update(format='json',action='query')
    u='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params)
    return json.load(urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60))
def strip(h): return re.sub('<[^>]+>','',h or '').strip()
def get(url,path):
    for i in range(5):
        try:
            open(path,'wb').write(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=90).read()); return
        except Exception as e: print('  retry',e); time.sleep(5*(i+1))
for p in data['places']:
    pid=p['id']
    if only and pid not in only: continue
    if not only and pid in credits and os.path.exists(f'../public/photos/{pid}.jpg'): continue
    q=queries.get(pid)
    if not q: print('no query',pid); continue
    common=dict(prop='imageinfo',iiprop='url|size|mime|extmetadata',iiurlwidth=1280)
    if q.startswith('File:'):
        d=api(dict(titles=q,**common))
    else:
        d=api(dict(generator='search',gsrsearch=q+' filetype:bitmap',gsrnamespace=6,gsrlimit=12,**common))
    pages=sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0))
    pick=None
    for pg in pages:
        ii=pg.get('imageinfo',[{}])[0]
        if ii.get('mime')=='image/jpeg' and ii.get('width',0)>=1000 and ii.get('width',0)>=ii.get('height',0)*0.9:
            pick=(pg,ii); break
    if not pick: print('NO PHOTO',pid,q); continue
    pg,ii=pick; md=ii['extmetadata']
    get(ii['thumburl'],f'../public/photos/{pid}.jpg')
    subprocess.run(['convert',f'../public/photos/{pid}.jpg','-resize','1280x>','-quality','80','-strip',f'../public/photos/{pid}.jpg'])
    subprocess.run(['convert',f'../public/photos/{pid}.jpg','-resize','320x320^','-gravity','center','-extent','320x320','-quality','78','-strip',f'../public/photos/t/{pid}.jpg'])
    credits[pid]={'author':strip(md.get('Artist',{}).get('value'))[:60] or 'Unknown','license':strip(md.get('LicenseShortName',{}).get('value')) or 'see source','url':ii['descriptionurl'],'title':pg['title']}
    print(pid,'<-',pg['title'])
    json.dump(credits,open('../src/data/photos.json','w'),ensure_ascii=False,indent=1)
    time.sleep(1.5)
