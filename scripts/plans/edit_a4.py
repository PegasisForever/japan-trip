"""Sep 26 2026 (4): fly north one day later (Fri Jan 29). New day 10 (Thu Jan 28): Toyota Automobile Museum from Osaka.
Hokkaido days move one day later; the slow Sapporo day (Feb 1) goes; Sapporo 1 night."""
import json, copy
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
old = {d['n']: d for d in p['days']}

def W(a, b, label='Walk', dur='5 min'):
    return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, b, label, dur, mode='train'):
    return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}

places['toyota-auto-museum'] = {
    'id': 'toyota-auto-museum', 'ref': 'toyota-automobile-museum', 'en': 'Toyota Automobile Museum', 'ja': 'トヨタ博物館', 'romaji': 'Toyota Hakubutsukan',
    'lat': 35.17317, 'lon': 137.05769, 'kind': 'car',
    'blurb': 'About 140 cars from all over the world, from the first petrol cars to Japanese sports cars, in Nagakute near Nagoya. A second hall shows Japanese car culture: posters, toys, models.',
    'info': [{'label': 'Hours', 'value': '9:30–17:00, last entry 16:30; closed Mondays (official site, Sep 26, 2026)'},
             {'label': 'Entry', 'value': 'About ¥1,200 (check the official site)'},
             {'label': 'Restaurant', 'value': 'AVIEW, 1F of the car hall, 9:30–17:00 (food L.O. 16:00)'},
             {'label': 'Access', 'value': 'Linimo line, Geidai-dori Station, 5 min on foot'}],
    'tips': ["Aoki's maybe from the choice list.", 'Start in the main hall on 2F (world cars), then 3F (Japanese cars), then the culture hall.']}
places['bincho-esca'] = {
    'id': 'bincho-esca', 'ref': None, 'en': 'Hitsumabushi Nagoya Bincho, ESCA', 'ja': 'ひつまぶし名古屋備長 エスカ店', 'romaji': 'Hitsumabushi Nagoya Binchō Esuka-ten',
    'lat': 35.16958, 'lon': 136.88079, 'kind': 'food',
    'blurb': "Nagoya's grilled eel on rice (hitsumabushi), eaten 3 ways: plain, with condiments, then with hot broth. In the ESCA mall 1 min from the Shinkansen gates. All cooked.",
    'info': [{'label': 'Cost', 'value': 'Hitsumabushi about ¥4,500–6,000'},
             {'label': 'Where', 'value': 'ESCA underground mall, Shinkansen side of Nagoya Station (hitsumabushi.co.jp)'}],
    'tips': ['Online booking on the official site: useful at dinner time.']}

new10 = {
    'n': 10, 'date': '2027-01-28', 'weekday': '木', 'region': 'chubu',
    'short': 'Toyota museum', 'cover': 'toyota-auto-museum',
    'title': 'Toyota Automobile Museum, then eel dinner in Nagoya',
    'titleJa': '新大阪 → 名古屋 → トヨタ博物館 → 名古屋駅',
    'romaji': 'Shin-Ōsaka → Nagoya → Toyota Hakubutsukan → Nagoya-eki',
    'summary': 'A late start, one Nozomi to Nagoya and the Linimo line to the Toyota Automobile Museum: 140 cars from all over the world, lunch in the museum. Grilled eel (hitsumabushi) at Nagoya Station, and back in Osaka for the night.',
    'temp': '1 – 9 °C',
    'alerts': ['Pack tonight: tomorrow the bus to Itami leaves Namba at 09:00.'],
    'stops': [
        {'place': 'matsuya-nipponbashi', 'time': '08:15', 'note': 'Breakfast: gyudon or a breakfast set, 20 min.'},
        {'place': 'toyota-auto-museum', 'time': '11:00', 'note': "The car hall: world cars on 2F, Japanese cars on 3F, 1 h 15 (Aoki's pick)."},
        {'place': 'toyota-auto-museum', 'time': '12:15', 'note': 'Lunch: AVIEW museum restaurant, 45 min.'},
        {'place': 'toyota-auto-museum', 'time': '13:00', 'note': 'The rest of the car hall and the culture hall; leave at 15:30.'},
        {'place': 'bincho-esca', 'time': '16:45', 'note': 'Dinner: hitsumabushi (grilled eel on rice), 1 h.'},
        {'place': 'dormy-namba', 'time': '19:15', 'note': 'Last night in Osaka; pack.'},
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        T('matsuya-nipponbashi', 'toyota-auto-museum', 'Walk to Namba (10 min); Midosuji Line, Namba about 08:50 → Shin-Osaka 09:05; Tokaido Shinkansen Nozomi, Shin-Osaka about 09:20 → Nagoya 10:10; Higashiyama Line, Nagoya about 10:15 → Fujigaoka 10:42; Linimo, Fujigaoka about 10:47 → Geidai-dori 10:57; walk 5 min', '2 h 15', 'shinkansen'),
        T('toyota-auto-museum', 'bincho-esca', 'Walk to Geidai-dori (5 min); Linimo, Geidai-dori about 15:40 → Fujigaoka 15:50; Higashiyama Line, Fujigaoka about 15:55 → Nagoya 16:22; walk to ESCA (Shinkansen side), 10 min', '1 h 5'),
        T('bincho-esca', 'dormy-namba', 'Walk to the Shinkansen gates (3 min); Tokaido Shinkansen Nozomi, Nagoya about 18:00 → Shin-Osaka 18:50; Midosuji Line, Shin-Osaka about 18:55 → Namba 19:10; walk 10 min', '1 h 15', 'shinkansen'),
    ],
    'sleep': 'dormy-namba', 'sleepNote': 'Dormy Inn, last night in Osaka.',
    'notes': ['Aoki marked the Toyota Automobile Museum maybe; it is different from the Toyota loom-and-car museum on day 6.',
              'The Nozomi is not covered by the JR Pass (you do not use one).',
              'Train times are from the current timetable; check them on Jorudan the day before.'],
    'cost': '≈ ¥22,000 per person (Nozomi return ≈ ¥13,400, subway and Linimo ≈ ¥1,400, museum ≈ ¥1,200, lunch, eel ≈ ¥5,000)',
}

dates = {10: ('2027-01-29', '金'), 11: ('2027-01-30', '土'), 12: ('2027-01-31', '日'), 13: ('2027-02-01', '月')}
moved = []
for n in (10, 11, 12, 13):
    d = copy.deepcopy(old[n])
    d['n'] = n + 1
    d['date'], d['weekday'] = dates[n]
    moved.append(d)
m = {d['n']: d for d in moved}

# day 11 (was 10, fly north)
d = m[11]
d['notes'] = [x for x in d['notes'] if not x.startswith('Yamamoto Shokudo')]
d['alerts'] = [a for a in d['alerts'] if 'Bus to Itami' not in a] + ['Bus to Itami: Namba-ekimae 09:00 → Itami North Terminal 09:30, ¥730.']
d['alerts'] = sorted(set(d['alerts']), key=d['alerts'].index)
# day 13 (was 12, drift) and day 14 (was 13, to Sapporo)
s = json.dumps(m[13], ensure_ascii=False).replace('Saturday ski traffic', 'Sunday ski traffic: park at Hirafu lot 1 early')
m[13] = json.loads(s)
d = m[14]
d['sleepNote'] = 'One night in Sapporo. Laundry night 4 (hotel coin laundry): clean clothes for the flights.'
d['alerts'] = d['alerts'] + ['Laundry night 4: clean clothes for the flights.']
for st in d['stops']:
    if st['place'] == 'daruma':
        st['note'] = st['note']
d['stops'].append({'place': 'mega-donki-sapporo', 'time': '20:00', 'note': 'Last tax-free shopping; Pegasis fills and weighs the suitcase.'})
d['legs'] = [l for l in d['legs'] if not (l['from'] == 'daruma' and l['to'] == 'route-inn-sapporo')] + [
    W('daruma', 'mega-donki-sapporo', 'Walk north to Tanukikoji', '8 min'), W('mega-donki-sapporo', 'route-inn-sapporo', dur='10 min')]

p['days'] = [old[n] for n in range(1, 10)] + [new10] + moved + [old[15]]

# ---------- text with dates
def fix(obj, pairs):
    s = json.dumps(obj, ensure_ascii=False)
    for a, b in pairs:
        s = s.replace(a, b)
    return json.loads(s)
pairs = [
    ('Thu Jan 28, ¥16,330', 'Fri Jan 29, ¥16,330'),
    ('buy them in Kutchan on Jan 28', 'buy them in Kutchan on Jan 29'),
    ('twin, non-smoking, Jan 28–31 (3 nights, room only)', 'twin, non-smoking, Jan 29 – Feb 1 (3 nights, room only)'),
    ('4WD (studless standard), Jan 28 13:50 – Jan 31', '4WD (studless standard), Jan 29 13:50 – Feb 1'),
    ('Thu Jan 28 13:40 → Sun Jan 31 about 12:45', 'Fri Jan 29 13:40 → Mon Feb 1 about 12:45'),
    ('"Jan 28, 29, 30"', '"Jan 29, 30, 31"'),
    ('"Jan 31, Feb 1"', '"Feb 1"'),
    ('Twin with breakfast ¥16,500 (Rakuten early-bird, Jan 31)', 'Twin with breakfast ¥19,800 per room (Rakuten, Feb 1, Sep 26, 2026)'),
    ('Be in the queue by 11:20 on Sunday.', 'Be in the queue by 11:20 on Monday.'),
    ('.Base ski rental for both, Jan 29–30', '.Base ski rental for both, Jan 30–31'),
    ('Rusutsu snow drift, Sat Jan 30', 'Rusutsu snow drift, Sun Jan 31'),
]
p['bookFirst'] = fix(p['bookFirst'], pairs)
p['flights'] = fix(p['flights'], pairs)
p['places'] = fix(list(places.values()), pairs)
p['days'] = fix(p['days'], pairs)
for x in p['bookFirst']:
    if x['what'].startswith('Dormy Inn PREMIUM Namba'):
        x['what'] = 'Dormy Inn PREMIUM Namba, twin: Jan 23–25 (2 nights) and Jan 26–29 (3 nights)'
    if x['what'].startswith('STAY RESORT NISEKO'):
        x['why'] = 'book now (by Sep 30, 2026): a twin was free for Jan 29 – Feb 1 on Rakuten on Sep 26 (¥81,360 for 2 people, room only); the sister hotel STAY LIVING NISEKO has the same price.'
    if 'Rusutsu' in x['what']:
        x['why'] = x['why'].replace('email activity@rusutsu.co.jp now', 'email activity@rusutsu.co.jp now (ask for Sun Jan 31)')

# ---------- top level
p['tagline'] = 'Always together: one short Hakone–Fuji car trip from Kawasaki to Mishima, an Osaka hotel with a ryokan night in Nara Park, and 4 nights in Hokkaido.'
p['summary'] = p['summary'].replace('Den Den Town and Liberty Walk,', 'Den Den Town, Liberty Walk and the Toyota Automobile Museum,') \
    .replace('2 nights in Sapporo with a slow last day.', '1 night in Sapporo.')
c = p['cost']
c['hotels'] = c['hotels'].replace('Dormy Inn PREMIUM Namba 4 nights ≈ ¥40,000 not checked', 'Dormy Inn PREMIUM Namba 5 nights ≈ ¥50,000 not checked') \
    .replace('Route Inn 2 nights ≈ ¥16,500', 'Route Inn 1 night ≈ ¥9,900').replace('≈ ¥175,000 per person', '≈ ¥178,500 per person')
c['transport'] = c['transport'].replace('airport buses and trains', 'Nagoya museum day ≈ ¥14,800; airport buses and trains')
c['activities'] = c['activities'].replace(', Maruyama Zoo ¥800', ', Toyota Automobile Museum ≈ ¥1,200')
c['total'] = c['total'].replace('≈ ¥399,000 Pegasis / ¥379,000 Aoki', '≈ ¥417,000 Pegasis / ¥397,000 Aoki')
w = p['who']
w['pegasis'] = w['pegasis'].replace('(5 h of travel; Maruyama Zoo in Sapporo has penguins too)', '(5 h of travel)')
w['aoki'] = w['aoki'].replace('Toyota museum,', 'Toyota museum, and your maybe the Toyota Automobile Museum (an extra day from Osaka),', 1)

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
print('dropped:', [x['id'] for x in p['places'] if x['id'] not in used])
p['places'] = [x for x in p['places'] if x['id'] in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
for dd in p['days'][8:]:
    print(dd['n'], dd['date'], dd['weekday'], dd['short'], dd['sleep'])
