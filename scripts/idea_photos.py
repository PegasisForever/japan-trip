"""Photos for ideas. Usage:
  python3 idea_photos.py cands            # collect up to 5 Commons candidates per idea (skips ones done)
  python3 idea_photos.py sheet OUT ids..  # contact sheet
  python3 idea_photos.py fetch            # download picks from ideas/photo-picks.json ({id: index})
"""
import json, os, re, sys, time, subprocess, urllib.request, urllib.parse
UA={'User-Agent':'YukimichiTripPlanner/1.0 (https://de75-173-32-75-236.ngrok-free.app; personal trip planner) python-urllib'}
import hashlib
def std_thumb(title,want,orig_w):
    name=title.split(':',1)[1].replace(' ','_'); h=hashlib.md5(name.encode()).hexdigest()
    w=max([x for x in (250,330,500,960,1280,1920) if x<=min(want,orig_w)] or [250]); q=urllib.parse.quote(name)
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}'
DB='cache/icands.json'; os.makedirs('cache/icands',exist_ok=True)
def get(u,binary=False):
    for i in range(10):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
            return r if binary else json.loads(r)
        except urllib.error.HTTPError as e:
            if e.code==429: time.sleep(20*(i+1)); continue
            raise
    raise SystemExit('rate limited')
ideas=json.load(open('../src/data/ideas.json'))
db=json.load(open(DB)) if os.path.exists(DB) else {}
cmd=sys.argv[1]
if cmd=='cands':
    only=set(sys.argv[2:])
    for o in ideas:
        if (only and o['id'] not in only) or (not only and o['id'] in db): continue
        q=o.get('photoQuery') or o['title']
        words=q.split(); pages=[]
        # Fewer words until something is found
        while words and not pages:
            params=dict(action='query',format='json',generator='search',gsrsearch=' '.join(words)+' filetype:bitmap',gsrnamespace=6,gsrlimit=20,prop='imageinfo',iiprop='url|size|mime|extmetadata',iiurlwidth=1280)
            d=get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(params))
            pages=[pg for pg in d.get('query',{}).get('pages',{}).values() if pg.get('imageinfo',[{}])[0].get('mime')=='image/jpeg' and pg['imageinfo'][0].get('width',0)>=900]
            pages.sort(key=lambda x:x.get('index',0))
            if not pages: words=words[:-1]
        out=[]
        for pg in pages:
            ii=pg.get('imageinfo',[{}])[0]
            if ii.get('mime')!='image/jpeg' or ii.get('width',0)<900 or ii.get('width',0)<ii.get('height',1)*0.9: continue
            f=f'cache/icands/{o["id"]}_{len(out)}.jpg'
            try: open(f,'wb').write(get(std_thumb(pg['title'],250,ii['width']),True)); time.sleep(0.5)
            except Exception: continue
            out.append({'title':pg['title'],'thumb1280':std_thumb(pg['title'],1280,ii['width']),'url':ii['descriptionurl'],'meta':{k:ii['extmetadata'].get(k,{}).get('value','') for k in ('Artist','LicenseShortName')}})
            if len(out)==5: break
        db[o['id']]=out; json.dump(db,open(DB,'w'),ensure_ascii=False)
        print(o['id'],len(out),'|',q,flush=True); time.sleep(1.5)
elif cmd=='sheet':
    out=sys.argv[2]; args=[]
    for pid in sys.argv[3:]:
        for i in range(5):
            f=f'cache/icands/{pid}_{i}.jpg'
            args+=['-label',f'{pid[:28]} #{i}',f if (i<len(db.get(pid,[])) and os.path.exists(f)) else 'xc:gray']
    subprocess.run(['montage',*args,'-tile','5x','-geometry','250x160+3+3','-pointsize','12',out],check=True)
elif cmd=='fetch':
    picks=json.load(open('ideas/photo-picks.json'))
    import glob as _g
    for extra in sorted(_g.glob('ideas/photo-picks-*.json')): picks.update(json.load(open(extra)))
    credits=json.load(open('../src/data/ideaPhotos.json'))
    for d in ('','t/','m/'): os.makedirs(f'../public/photos/{d}ideas',exist_ok=True)
    strip=lambda h: re.sub(r'\s+',' ',re.sub('<[^>]+>','',h or '')).strip()
    for pid,i in picks.items():
        src_id=pid
        if isinstance(i,str): src_id,i=i.split(':'); i=int(i)   # "other-id:index" reuses another idea's photo
        if i is None or src_id not in db or i>=len(db[src_id]): credits.pop(pid,None); continue
        c=db[src_id][i]
        if credits.get(pid,{}).get('url')==c['url'] and os.path.exists(f'../public/photos/ideas/{pid}.jpg'): continue
        src=f'cache/ifull_{pid}.jpg'; open(src,'wb').write(get(c['thumb1280'],True))
        subprocess.run(['convert',src,'-resize','1280x>','-quality','78','-strip','-interlace','Plane',f'../public/photos/ideas/{pid}.jpg'],check=True)
        subprocess.run(['convert',src,'-resize','640x>','-quality','76','-strip',f'../public/photos/m/ideas/{pid}.jpg'],check=True)
        subprocess.run(['convert',src,'-resize','320x320^','-gravity','center','-extent','320x320','-quality','76','-strip',f'../public/photos/t/ideas/{pid}.jpg'],check=True)
        credits[pid]={'author':(strip(c['meta'].get('Artist')) or 'Unknown')[:70],'license':strip(c['meta'].get('LicenseShortName')) or 'see source','url':c['url']}
        print(pid,'<-',c['title'],flush=True); time.sleep(1.5)
    json.dump(credits,open('../src/data/ideaPhotos.json','w'),ensure_ascii=False,indent=1)
