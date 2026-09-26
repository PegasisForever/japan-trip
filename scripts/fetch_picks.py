"""Downloads the picked Commons photo for each place in 3 sizes and writes the credits file."""
import json, urllib.request, os, re, subprocess, time
UA={'User-Agent':'YukimichiTripPlanner/1.0 (https://de75-173-32-75-236.ngrok-free.app; personal trip planner) python-urllib'}
cands=json.load(open('cache/cands.json')); picks=json.load(open('picks.json'))
credits=json.load(open('../src/data/photos.json'))
for d in ('','t/','m/'): os.makedirs(f'../public/photos/{d}',exist_ok=True)
def strip(h): return re.sub(r'\s+',' ',re.sub('<[^>]+>','',h or '')).strip()
for pid,i in picks.items():
    src_id,_,idx=str(i).rpartition(':') if ':' in str(i) else (pid,'',i)
    c=cands[src_id or pid][int(idx)]
    if credits.get(pid,{}).get('url')==c['url'] and os.path.exists(f'../public/photos/{pid}.jpg'): continue
    src=f'cache/full_{pid}.jpg'
    for k in range(8):
        try: open(src,'wb').write(urllib.request.urlopen(urllib.request.Request(c['thumb1280'],headers=UA),timeout=60).read()); break
        except Exception as e: print(' retry',pid,e); time.sleep(20*(k+1))
    subprocess.run(['convert',src,'-resize','1280x>','-quality','78','-strip','-interlace','Plane',f'../public/photos/{pid}.jpg'],check=True)
    subprocess.run(['convert',src,'-resize','640x>','-quality','76','-strip',f'../public/photos/m/{pid}.jpg'],check=True)
    subprocess.run(['convert',src,'-resize','320x320^','-gravity','center','-extent','320x320','-quality','76','-strip',f'../public/photos/t/{pid}.jpg'],check=True)
    author=strip(c['meta'].get('Artist')) or 'Unknown'
    credits[pid]={'author':author[:70],'license':strip(c['meta'].get('LicenseShortName')) or 'see source','url':c['url']}
    print(pid,'<-',c['title'],flush=True); time.sleep(2)
json.dump(credits,open('../src/data/photos.json','w'),ensure_ascii=False,indent=1)
