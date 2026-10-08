"""Checks every day of src/data/plan.json: the travel chain (last night's hotel → ... → tonight's hotel),
the order of the stops, the clock times, and the walk/drive times against OpenStreetMap routing."""
import json, os, re, hashlib, time, urllib.request, math
HERE = os.path.dirname(os.path.abspath(__file__))
UA = {'User-Agent': 'YukimichiTripPlanner/1.0 (personal trip planner) python-urllib'}
plan = json.load(open(f'{HERE}/../src/data/plan.json'))
P = {p['id']: p for p in plan['places']}

def osrm(a, b, profile):
    base = {'car': 'https://router.project-osrm.org/route/v1/driving/', 'foot': 'https://routing.openstreetmap.de/routed-foot/route/v1/driving/'}[profile]
    url = base + f"{a['lon']:.5f},{a['lat']:.5f};{b['lon']:.5f},{b['lat']:.5f}" + '?overview=false&steps=true'
    f = f'{HERE}/cache/osrm/' + hashlib.md5(url.encode()).hexdigest() + '.json'
    if not os.path.exists(f):
        for i in range(4):
            try: open(f, 'wb').write(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read()); break
            except Exception as e: time.sleep(3)
        time.sleep(1)
    try: d = json.load(open(f))
    except Exception: return None
    if d.get('code') != 'Ok': return None
    r = d['routes'][0]
    names = []
    for leg in r['legs']:
        for s in leg['steps']:
            n = s.get('ref') or s.get('name')
            if n and s['distance'] > 1500 and n not in names: names.append(n)
    return r['distance'], r['duration'], names

def mins(t):
    if not t: return None
    t = t.replace('–', '-')
    h = re.search(r'(\d+)\s*h', t); m = re.search(r'(\d+)\s*min', t)
    if not h and not m: return None
    v = (int(h.group(1)) * 60 if h else 0) + (int(m.group(1)) if m else 0)
    if h and not m and re.search(r'h\s*(\d+)\b', t): v += int(re.search(r'h\s*(\d+)\b', t).group(1))
    return v

def clock(s):
    m = re.match(r'^(\d{1,2}):(\d{2})$', s or '')
    return int(m.group(1)) * 60 + int(m.group(2)) if m else None

def km(a, b):
    R = 6371; x = math.radians(b['lon'] - a['lon']) * math.cos(math.radians((a['lat'] + b['lat']) / 2)); y = math.radians(b['lat'] - a['lat'])
    return R * math.hypot(x, y)

issues = []
prev = None
for d in plan['days']:
    n = d['n']; legs = d['legs']; out = lambda msg: issues.append(f'Day {n}: {msg}')
    for l in legs:
        for k in ('from', 'to'):
            if l[k] not in P: out(f'unknown place {l[k]}')
    if prev and legs and legs[0]['from'] != prev: out(f'first travel leaves {legs[0]["from"]}, but last night was {prev}')
    for a, b in zip(legs, legs[1:]):
        if a['to'] != b['from']: out(f'travel breaks: {a["from"]}→{a["to"]} then {b["from"]}→{b["to"]}')
    if d.get('sleep') and legs and legs[-1]['to'] != d['sleep']: out(f'last travel ends at {legs[-1]["to"]}, but you sleep at {d["sleep"]}')
    # Stops in the order the travel reaches them
    path = [legs[0]['from']] + [l['to'] for l in legs] if legs else []
    i = 0
    for s in d['stops']:
        try: i = path.index(s['place'], i)
        except ValueError: out(f'stop {s["place"]} is not reached by the travel (in this order)')
    # Clock times go forward and leave room for the travel
    last_t = None
    for s in d['stops']:
        t = clock(s.get('time'))
        if t is None: continue
        if last_t is not None and t < last_t: out(f'time goes back at {s["place"]} {s["time"]}')
        last_t = t
    # Walk and drive times against the map
    for l in legs:
        a, b = P.get(l['from']), P.get(l['to'])
        if not a or not b or l['mode'] not in ('walk', 'drive'): continue
        said = mins(l.get('duration'))
        r = osrm(a, b, 'foot' if l['mode'] == 'walk' else 'car')
        if not r: out(f'no route {l["from"]}→{l["to"]}'); continue
        dist, dur, names = r
        real = dist / 1000 / 4.5 * 60 if l['mode'] == 'walk' else dur / 60
        if said is None: continue
        # Walks inside a ski area or a station: skip very short ones
        if l['mode'] == 'walk' and dist < 300: continue
        lo, hi = (0.6, 1.8) if l['mode'] == 'walk' else (0.75, 2.2)
        if said < real * lo - 3 or said > real * hi + 8:
            out(f'{l["mode"]} {l["from"]}→{l["to"]}: plan says {l["duration"]}, map {dist/1000:.1f} km ≈ {real:.0f} min' + (f' via {", ".join(names[:5])}' if l['mode'] == 'drive' else ''))
    prev = d.get('sleep')
print('\n'.join(issues) or 'no issues')

# Every photo the plan shows must come from our own host (run scripts/local_photos.py to copy new ones)
gal = json.load(open(f'{HERE}/../src/data/gallery.json'))
used = set(s['place'] for d in plan['days'] for s in d['stops']) | set(d['sleep'] for d in plan['days'] if d.get('sleep'))
remote = []
for pid in sorted(used):
    p = P[pid]
    for k in {pid, p.get('ref') or '', (p.get('ref') or '').replace('plan-', '', 1)} - {''}:
        remote += [f'{pid}: {ph["big"][:60]}' for ph in gal.get(k, []) if ph['big'].startswith('http')]
print(f'{len(remote)} photos not on our host' + (':\n' + '\n'.join(remote[:10]) if remote else ''))

# Every place the plan shows has a photo, found the same way as src/data/plan.ts does
OLD = json.load(open(f'{HERE}/../src/data/photos.json'))
IDEA = json.load(open(f'{HERE}/../src/data/ideaPhotos.json'))
refs = {}
for p in plan['places']:
    if p.get('ref'): refs[p['ref']] = refs.get(p['ref'], 0) + 1
def has_photo(p):
    if refs.get(p.get('ref'), 0) > 1 and gal.get(p['id']): return True
    for key in [k for k in (p.get('ref'), p['id']) if k]:
        if key.replace('plan-', '', 1) in OLD or key in IDEA: return True
    return bool(gal.get(p.get('ref') or p['id']) or gal.get(p['id']))
problems = [f'{pid}: no photo' for pid in sorted(used) if not has_photo(P[pid])]
# Several places made from one idea: each needs its own photos and its own "what to do", or it shows the idea's (another place's)
problems += [f'{pid}: shares {P[pid]["ref"]} with other places but has no photos of its own' for pid in sorted(used)
             if refs.get(P[pid].get('ref'), 0) > 1 and not gal.get(pid)]
ref_exp = {i['id'] for i in json.load(open(f'{HERE}/../src/data/ideas.json')) if i.get('experience')}
ref_exp |= {k.replace('plan-', '', 1) for k in json.load(open(f'{HERE}/../src/data/plannedExperience.json'))}
problems += [f'{pid}: shares {P[pid]["ref"]} with other places but has no "experience" of its own' for pid in sorted(used)
             if refs.get(P[pid].get('ref'), 0) > 1 and not P[pid].get('experience') and P[pid]['ref'].replace('plan-', '', 1) in ref_exp | {P[pid]['ref']} & ref_exp]
# A visit is for a day that goes there, and its photos exist
days_at = {}
for d in plan['days']:
    for pid in [s['place'] for s in d['stops']] + ([d['sleep']] if d.get('sleep') else []): days_at.setdefault(pid, set()).add(str(d['n']))
for p in plan['places']:
    for n, v in p.get('visits', {}).items():
        if n not in days_at.get(p['id'], set()): problems.append(f'{p["id"]}: visit for day {n}, but the plan does not go there that day')
        if v.get('gallery') and not gal.get(v['gallery']): problems.append(f'{p["id"]}: day {n} gallery {v["gallery"]} is empty')
        if v.get('gallery'): remote += [f'{p["id"]} day {n}: {ph["big"][:60]}' for ph in gal.get(v['gallery'], []) if ph['big'].startswith('http')]
print(f'{len(problems)} photo/text problems' + (':\n' + '\n'.join(problems) if problems else ''))
if remote: print(f'{len(remote)} photos not on our host (with day photos):\n' + '\n'.join(remote[:10]))
