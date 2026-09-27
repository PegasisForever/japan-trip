"""Sep 26 2026 (8): one hour later where possible (days 2, 3, 4, 8, 10, 12, 13)."""
import json, re
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
D = {d['n']: d for d in p['days']}
def W(a, b, label='Walk', dur='5 min'): return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, b, label, dur, mode='train'): return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}
def S(place, time, note): return {'place': place, 'time': time, 'note': note}
def sh(t, m=60):
    h, mm = map(int, t.split(':')); x = h * 60 + mm + m
    return f'{x // 60:02d}:{x % 60:02d}'
def shift_label(s, m=60):
    return re.sub(r'(?<![\d¥])(\d{1,2}):(\d{2})(?!\d)', lambda g: sh(g.group(0), m), s)
BF = 'Breakfast: coffee and onigiri from the konbini, or a café (the hotel buffet ends at 09:00; eat it by 09:00 if you are up).'

# ---------- Day 2: leave 11:00; City Hall view moves here (night view)
d = D[2]
d['stops'] = [
    S('hotel-super-shinjuku', '10:15', BF),
    S('meiji-jingu', '11:15', 'The forest path to the main hall and back, 40 min.'),
    S('takeshita', '12:05', 'Crêpes, snacks and fun shops, 40 min.'),
    S('uobei-shibuya', '13:00', 'Lunch: touch-screen sushi (cooked plates for Aoki), 40 min.'),
    S('shibuya-parco', '13:50', "Nintendo TOKYO and Pokémon Center on 6F, 1 h (Aoki's pick)."),
    S('hachiko', '15:00', "Girls Band Cry ep 3 meeting place, the Scramble crossing, 20 min (Aoki's pick)."),
    S('shibuya-sky', '15:55', "Rooftop at sunset (about 16:55) and the city lights, 1 h 20 (Aoki's pick)."),
    S('isetan', '19:10', "Dinner: half-price sushi and bento in the food hall before the 20:00 close (Pegasis's pick)."),
    S('tmg', '20:05', 'Free night view from the 45th-floor North Deck (open to 21:30; the South Deck is closed on this 3rd Tuesday), 30 min (both of you wanted it).'),
    S('golden-gai', '21:00', 'One drink in a tiny bar, 45 min (both of you wanted it).'),
]
d['legs'] = [
    T('hotel-super-shinjuku', 'meiji-jingu', 'Walk to JR Shinjuku (12 min); JR Yamanote Line, Shinjuku about 11:05 → Harajuku 11:09; walk 2 min', '20 min'),
    W('meiji-jingu', 'takeshita', 'Walk back past Harajuku Station', '10 min'),
    T('takeshita', 'uobei-shibuya', 'JR Yamanote Line, Harajuku about 12:48 → Shibuya 12:50; walk to Dogenzaka 6 min', '15 min'),
    W('uobei-shibuya', 'shibuya-parco', 'Walk up Koen-dori', '10 min'),
    W('shibuya-parco', 'hachiko', 'Walk down to the station square', '10 min'),
    W('hachiko', 'shibuya-sky', 'Walk to Shibuya Scramble Square; a café break before the ticket time', '10 min'),
    T('shibuya-sky', 'isetan', 'JR Shonan-Shinjuku Line or Yamanote Line, Shibuya about 18:40 → Shinjuku 18:47; walk to Isetan (Shinjuku-sanchome) 12 min', '25 min'),
    T('isetan', 'tmg', 'Marunouchi Line, Shinjuku-sanchome about 19:52 → Nishi-Shinjuku 19:56 (eat the food at the hotel later); walk 8 min', '15 min'),
    T('tmg', 'golden-gai', 'Walk to Tochomae; Toei Oedo Line, Tochomae about 20:40 → Higashi-Shinjuku 20:45; walk 8 min', '20 min'),
    W('golden-gai', 'hotel-super-shinjuku', dur='6 min'),
]
d['titleJa'] = '明治神宮 → 竹下通り → 渋谷PARCO → ハチ公 → 渋谷スカイ → 都庁 → ゴールデン街'
d['romaji'] = 'Meiji Jingū → Takeshita-dōri → Shibuya Paruko → Hachikō → Shibuya Sukai → Tochō → Gōruden-gai'
d['summary'] = 'A late start: the forest shrine Meiji Jingu, crêpes on Takeshita Street, lunch and the Nintendo and Pokémon shops in Shibuya, Hachiko, and Shibuya Sky at sunset. Half-price food at Isetan, the free City Hall night view and one drink in Golden Gai.'
d['cost'] = '≈ ¥9,000 per person (trains ¥600, lunch, Shibuya Sky sunset ticket ≈ ¥3,000, Isetan dinner, one drink + cover)'

# ---------- Day 3: leave 11:00; no City Hall (now day 2)
d = D[3]
d['stops'] = [
    S('hotel-super-shinjuku', '10:15', BF),
    S('suga', '11:20', "Your Name stairs, 15 min (Aoki's pick)."),
    S('radio-kaikan', '12:05', '10 floors of figures and cards, 45 min; ZEST (Oshi no Ko) 3 min north.'),
    S('maidreamin-akiba', '12:55', "Lunch with the stage show, 55 min (Pegasis's pick)."),
] + [s for s in d['stops'] if s['place'] in ('ikebukuro', 'nakano', 'shimokita', 'mintei-shimokita', 'shelter')]
d['legs'] = [
    T('hotel-super-shinjuku', 'suga', 'Walk to Shinjuku-sanchome (10 min); Tokyo Metro Marunouchi Line, Shinjuku-sanchome about 11:06 → Yotsuya-sanchome 11:09; walk 8 min', '25 min'),
    T('suga', 'radio-kaikan', 'Walk to Yotsuya-sanchome (8 min); Marunouchi Line, Yotsuya-sanchome about 11:45 → Awajicho 11:55; walk 8 min to Akihabara', '30 min'),
] + [l for l in d['legs'] if l['from'] not in ('hotel-super-shinjuku', 'suga', 'tmg')]
d['summary'] = d['summary'].replace('City Hall view, then a full', 'a full') if 'City Hall' in d['summary'] else d['summary']
d['titleJa'] = d['titleJa'].replace('都庁 → ', '').replace(' → 都庁', '')
d['romaji'] = d['romaji'].replace('Tochō → ', '').replace(' → Tochō', '')

# ---------- Day 4: everything one hour later
d = D[4]
for s in d['stops']:
    s['time'] = sh(s['time'])
d['stops'][0]['note'] = BF + ' Hand both suitcases to the front for Yamato to Osaka.'
for s in d['stops']:
    if s['place'] == 'fukuwarai-yako': s['note'] = 'Lunch: local ramen by Yako Station, 35 min (it closes about 14:00: be there by 13:25).'
    if s['place'] == 'toyota-shinkawabashi': s['note'] = "Pick up the car (studless tyres, ETC). Walk past CLUB CITTA' on the way."
for l in d['legs']:
    l['label'] = shift_label(l['label'])
d['alerts'] = [a.replace('for the car at 16:45', 'for the car at 17:45').replace('At 18:00 check X', 'At 19:00 check X') for a in d['alerts']]
d['alerts'] = [a for a in d['alerts'] if not a.startswith('09:30')] + ['Before you leave: hand both suitcases to the hotel front for Yamato TA-Q-BIN to Dormy Inn PREMIUM Namba (arrives Fri 22).']
d['summary'] = d['summary'].replace('at 16:45', 'at 17:45')

# ---------- Day 8: one hour later
d = D[8]
for s in d['stops']:
    s['time'] = sh(s['time'])
for s in d['stops']:
    if s['place'] == 'todaiji': s['note'] = 'The Great Buddha hall and the deer around the gate, 1 h 15 (closes 17:00).'
for l in d['legs']: l['label'] = shift_label(l['label'])
d['stops'][-1]['time'] = '18:30'

# ---------- Day 10: one hour later
d = D[10]
for s in d['stops']:
    if s['place'] in ('kuromon', 'lb-drive-in', 'dormy-namba'): s['time'] = sh(s['time'])
for s in d['stops']:
    if s['place'] == 'lb-drive-in': s['note'] = 'Lunch first: Sanuki udon in the park (Wed 11:00–15:00, order by 14:30), then LB wide-body cars and goods, 2 h.'
for l in d['legs']:
    if l['to'] == 'lb-drive-in' or l['from'] == 'lb-drive-in': l['label'] = shift_label(l['label'])
es = [s for s in d['stops'] if s['place'] == 'ebisubashi']
if es: es[0]['time'] = '18:10'

# ---------- Day 12: one hour later
d = D[12]
for s in d['stops']:
    if s['time'] < '15:00': s['time'] = sh(s['time'])
for s in d['stops']:
    if s['place'] == 'niseko' and s['time'] >= '14:00': s['note'] = 'Afternoon runs together on the Ace Family area; gear in .Base storage by 15:50.'
d['alerts'] = [a.replace('09:40', '10:40') for a in d['alerts']]

# ---------- Day 13: shorter morning ski
d = D[13]
new = {'stay-resort-niseko': '09:30', 'powderhood-hirafu': '12:40'}
hb = [s for s in d['stops'] if s['place'] == 'hirafu-base']
for s in d['stops']:
    if s['place'] in new and s['time'] < '12:00' or s['place'] == 'powderhood-hirafu': s['time'] = new.get(s['place'], s['time'])
hb[0]['time'] = '10:45'; hb[1]['time'] = '12:25'
for s in d['stops']:
    if s['place'] == 'niseko': s['time'] = '11:00'; s['note'] = 'Ski together until 12:15 on the Ace Family area.'
    if s['place'] == 'powderhood-hirafu': s['note'] = 'Lunch: burgers at the gondola base, 35 min; leave at 13:20.'
d['alerts'] = [a.replace('Leave the hotel at 09:30', 'Leave the hotel at 10:30') for a in d['alerts']]

# bookings
p['bookFirst'] = json.loads(json.dumps(p['bookFirst'], ensure_ascii=False).replace('Jan 21 16:45 – Jan 23 11:40', 'Jan 21 17:45 – Jan 23 11:40'))
for x in p['places']:
    for i in x.get('info', []):
        if i['value'].startswith('Thu Jan 21 16:45'): i['value'] = i['value'].replace('16:45', '17:45')
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
for n in (2, 3, 4, 8, 10, 12, 13):
    print(n, [(s['time'], s['place']) for s in D[n]['stops']])
