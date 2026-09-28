"""Copies every gallery photo that the plan shows onto our own host (public/photos/g/),
in the three sizes the app uses: /photos/ (1280 px), /photos/m/ (640 px), /photos/t/ (320 px square).
Gallery entries then point to "g/<file>.jpg" instead of Wikimedia, Trip.com or Airbnb. Safe to run again."""
import json, os, re, hashlib, subprocess, time, urllib.request
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = f'{HERE}/..'
UA = {'User-Agent': 'YukimichiTripPlanner/1.0 (personal trip planner; photo copy with credit) python-urllib'}
plan = json.load(open(f'{ROOT}/src/data/plan.json'))
gal_f = f'{ROOT}/src/data/gallery.json'
gal = json.load(open(gal_f))

used = set(s['place'] for d in plan['days'] for s in d['stops']) | set(d['sleep'] for d in plan['days'] if d.get('sleep'))
keys = set()
for p in plan['places']:
    if p['id'] not in used: continue
    keys.add(p['id'])
    if p.get('ref'): keys |= {p['ref'], p['ref'].replace('plan-', '', 1)}

for d in ('g', 'm/g', 't/g'): os.makedirs(f'{ROOT}/public/photos/{d}', exist_ok=True)

def fetch(url, path):
    for i in range(5):
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=90).read()
            open(path, 'wb').write(data); return True
        except Exception as e:
            print('  retry', e); time.sleep(4 * (i + 1))
    return False

n = 0
for key in sorted(keys & set(gal)):
    for i, ph in enumerate(gal[key]):
        src = ph['big']
        if not src.startswith('http'): continue
        name = re.sub(r'[^a-z0-9-]', '', key.lower())[:40] + '-' + hashlib.md5(src.encode()).hexdigest()[:8] + '.jpg'
        big = f'{ROOT}/public/photos/g/{name}'
        if not os.path.exists(big):
            tmp = big + '.src'
            if not fetch(src, tmp) and not fetch(ph['mid'], tmp): print('FAILED', key, src); continue
            subprocess.run(['convert', tmp + '[0]', '-auto-orient', '-resize', '1280x1280>', '-quality', '80', '-strip', '-interlace', 'Plane', big], check=True)
            subprocess.run(['convert', big, '-resize', '640x640>', '-quality', '78', '-strip', f'{ROOT}/public/photos/m/g/{name}'], check=True)
            subprocess.run(['convert', big, '-resize', '320x320^', '-gravity', 'center', '-extent', '320x320', '-quality', '76', '-strip', f'{ROOT}/public/photos/t/g/{name}'], check=True)
            os.remove(tmp); n += 1
            time.sleep(0.3)
        ph['big'] = ph['mid'] = f'g/{name}'
    # Save after each place, so a stopped run keeps what it copied
    json.dump(gal, open(gal_f, 'w'), ensure_ascii=False, indent=1)
json.dump(gal, open(gal_f, 'w'), ensure_ascii=False, indent=1)
left = [(k, p['big']) for k in keys & set(gal) for p in gal[k] if p['big'].startswith('http')]
print('copied', n, '| still remote in used galleries:', len(left))
