"""Photo galleries: helpers find extra Wikimedia Commons photos per place.

  python3 gallery.py list                          # all item ids with names and existing main photo
  python3 gallery.py search ID "query" ["query"...]  # collect up to 15 candidates, prints a contact sheet path
        a query may be "Category:Nakano Broadway" to list that Commons category
  python3 gallery.py pick ID 3 7 1 ...             # save chosen candidates (in this order) for ID
  python3 gallery.py build                         # merge all picks into src/data/gallery.json
Photos are linked from Wikimedia's servers (not downloaded), in two sizes.
"""
import json, os, re, sys, time, subprocess, urllib.request, urllib.parse, hashlib
UA={'User-Agent':'YukimichiTripPlanner/1.0 (https://de75-173-32-75-236.ngrok-free.app; personal trip planner) python-urllib'}
HERE=os.path.dirname(os.path.abspath(__file__))
C=os.path.join(HERE,'cache/gcands'); P=os.path.join(HERE,'cache/gpicks')
SHEETS='/tmp/claude-1000/-home-rmng-japan-trip/6dca0d6b-e9ae-4d2b-abbf-b88742096826/scratchpad/gallery'
os.makedirs(C,exist_ok=True); os.makedirs(P,exist_ok=True); os.makedirs(SHEETS,exist_ok=True)

def get(u,binary=False,tries=6):
    for i in range(tries):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=30).read()
            return r if binary else json.loads(r)
        except urllib.error.HTTPError as e:
            if e.code in (429,503): time.sleep(4*(i+1)); continue
            raise
        except Exception: time.sleep(2)
    raise RuntimeError('rate limited')

def items():
    data=json.loads(subprocess.check_output(['node','export.ts'],cwd=HERE))
    ideas=json.load(open(os.path.join(HERE,'../src/data/ideas.json')))
    out=[{'id':p['id'],'en':p['en'],'ja':p['ja'],'type':'place:'+p['kind']} for p in data['places']]
    out+=[{'id':o['id'],'en':o['title'],'ja':o['titleJa'],'type':'idea:'+o['kind'],'query':o.get('photoQuery','')} for o in ideas]
    return out

STD=[250,330,500,960,1280,1920]
def thumb(title,want,orig_w):
    """Standard-size Wikimedia thumbnail URL (originals and odd sizes are rate limited)."""
    name=title.split(':',1)[1].replace(' ','_')
    h=hashlib.md5(name.encode()).hexdigest()
    w=max([x for x in STD if x<=min(want,orig_w)] or [250])
    q=urllib.parse.quote(name)
    return f'https://upload.wikimedia.org/wikipedia/commons/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}'

def strip(h): return re.sub(r'\s+',' ',re.sub('<[^>]+>','',h or '')).strip()

def search(pid,queries):
    seen=set(); cands=[]
    for q in queries:
        base=dict(action='query',format='json',prop='imageinfo',iiprop='url|size|mime|extmetadata',iiurlwidth=1920)
        if q.startswith('Category:'):
            base.update(generator='categorymembers',gcmtitle=q,gcmtype='file',gcmlimit=40)
        else:
            base.update(generator='search',gsrsearch=q+' filetype:bitmap',gsrnamespace=6,gsrlimit=25)
        d=get('https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode(base))
        pages=sorted(d.get('query',{}).get('pages',{}).values(),key=lambda x:x.get('index',0))
        for pg in pages:
            ii=(pg.get('imageinfo') or [{}])[0]
            if pg['title'] in seen or ii.get('mime')!='image/jpeg' or ii.get('width',0)<800: continue
            seen.add(pg['title'])
            md=ii.get('extmetadata',{})
            big=thumb(pg['title'],1920,ii['width'])
            mid=thumb(pg['title'],960,ii['width'])
            cands.append({'title':pg['title'],'big':big,'mid':mid,'url':ii['descriptionurl'],'w':ii['width'],'h':ii['height'],
                          'author':(strip(md.get('Artist',{}).get('value')) or 'Unknown')[:70],'license':strip(md.get('LicenseShortName',{}).get('value')) or 'see source'})
            if len(cands)>=15: break
        if len(cands)>=15: break
        time.sleep(1)
    json.dump(cands,open(f'{C}/{pid}.json','w'),ensure_ascii=False)
    # A new search gives new numbers: drop previews from an earlier search of this id
    for old in os.listdir(C):
        if old.startswith(pid+'_') and old.endswith('.jpg'): os.remove(f'{C}/{old}')
    args=[]
    for i,c in enumerate(cands):
        f=f'{C}/{pid}_{i}.jpg'
        if not os.path.exists(f):
            small=thumb(c['title'],250,c['w'])
            # Previews: two quick tries, then skip this one rather than wait
            try: data=get(small,True,tries=2)
            except Exception: continue
            if len(data)<1000: continue
            open(f,'wb').write(data)
            time.sleep(0.3)
        if os.path.exists(f) and os.path.getsize(f)>1000: args+=['-label',f'#{i} {c["w"]}x{c["h"]}',f]
    if not args: print('no candidates for',pid); return
    sheet=f'{SHEETS}/{pid}.jpg'
    subprocess.run(['montage',*args,'-tile','5x','-geometry','250x170+3+3','-pointsize','13',sheet],check=True)
    print(len(cands),'candidates. Contact sheet:',sheet)
    for i,c in enumerate(cands): print(f'  #{i} {c["title"][5:90]}')

cmd=sys.argv[1] if len(sys.argv)>1 else ''
if cmd=='list':
    for it in items(): print(it['id'],'|',it['en'],'|',it['ja'],'|',it['type'])
elif cmd=='search':
    search(sys.argv[2],sys.argv[3:])
elif cmd=='pick':
    pid=sys.argv[2]; cands=json.load(open(f'{C}/{pid}.json'))
    chosen=[cands[int(i)] for i in sys.argv[3:]]
    json.dump(chosen,open(f'{P}/{pid}.json','w'),ensure_ascii=False,indent=1)
    print('saved',len(chosen),'photos for',pid)
elif cmd=='build':
    out={}
    for f in sorted(os.listdir(P)):
        if f.endswith('.json'):
            out[f[:-5]]=[{'big':thumb(c['title'],1920,c['w']),'mid':thumb(c['title'],960,c['w']),**{k:c[k] for k in ('url','author','license','title')}} for c in json.load(open(f'{P}/{f}'))]
    json.dump(out,open(os.path.join(HERE,'../src/data/gallery.json'),'w'),ensure_ascii=False,indent=1)
    print(len(out),'galleries,',sum(len(v) for v in out.values()),'photos')
else: print(__doc__)
