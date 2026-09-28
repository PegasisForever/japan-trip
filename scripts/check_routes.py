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
