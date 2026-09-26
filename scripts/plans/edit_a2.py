"""Plan A, Sep 26 2026 (2): ski gear (buy gloves + goggles, rent the rest) and the pace fixes
(Kansai reorder: no Todaiji on day 5, Nara+Todaiji+Kasuga+Inari on day 7, Kinkakuji on day 8; no Osu on day 6)."""
import json
P = 'src/data/plans/a.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
day = {d['n']: d for d in p['days']}
bplaces = {x['id']: x for x in json.load(open('src/data/plans/b.json'))['places']}

def W(a, b, label='Walk', dur='5 min'):
    return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}

def T(a, b, label, dur, mode='train'):
    return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}

places['sports-takiguchi'] = {
    'id': 'sports-takiguchi', 'ref': None, 'en': 'Sports Takiguchi (ski shop, Kutchan)', 'ja': 'スポーツたきぐち', 'romaji': 'Supōtsu Takiguchi',
    'lat': 42.90129, 'lon': 140.75071, 'kind': 'shop',
    'blurb': 'A local ski and sports shop on the station street in Kutchan, 2 min from your hotel. Buy ski gloves and goggles here for all 3 ski days.',
    'info': [{'label': 'Hours', 'value': '10:00–18:00; weekdays to 19:00 in Dec–Feb (official site)'},
             {'label': 'Gloves', 'value': 'About ¥2,500–4,600 (online shop)'},
             {'label': 'Goggles', 'value': 'Price not published; expect about ¥3,000–8,000'}],
    'tips': ['Backup: Bigban Winter Sports in Kutchan (used gear, 10:00–19:00 every day).',
             'Buy a beanie too if you have no warm hat: the helmet goes over it.']}
places['yabaton-esca'] = {
    'id': 'yabaton-esca', 'ref': None, 'en': 'Yabaton, Nagoya Station ESCA', 'ja': '矢場とん 名古屋駅エスカ店', 'romaji': 'Yabaton Nagoya-eki Esuka-ten',
    'lat': 35.16988, 'lon': 136.88046, 'kind': 'food',
    'blurb': 'The Nagoya miso-katsu chain in the ESCA underground mall on the Shinkansen side of Nagoya Station: dinner 3 min from the platform.',
    'info': [{'label': 'Hours', 'value': '11:00–22:00 (L.O. 21:30) (official site, Sep 26, 2026)'},
             {'label': 'Cost', 'value': 'Waraji tonkatsu set about ¥2,000'}],
    'tips': ['Table bookings are possible: useful on a Sunday evening.']}
places['kushikatsu-daruma-dotonbori'] = bplaces['kushikatsu-daruma-dotonbori']

# ---------- Ski gear
h = places['hirafu-base']
h['blurb'] = 'The official rental shop at the Ace Gondola base. Rent skis, boots, poles, helmet and the ski jacket and pants here, and leave them in the daily storage overnight. Gloves and goggles you buy in Kutchan.'
h['info'] = [
    {'label': 'Hours', 'value': '08:00 until lifts close (Nov 28 – May 5)'},
    {'label': 'Skis + boots + poles', 'value': 'Standard ¥8,500 for 1 day, ¥15,300 for 2 days'},
    {'label': 'Ski wear', 'value': 'Jacket + pants ¥16,200 for 2 days (without goggles, gloves, beanie)'},
    {'label': 'Helmet', 'value': '¥5,400 for 2 days'},
    {'label': 'Your set, 2 days', 'value': '¥36,900 per person, ¥33,210 with the 10% early code (2026-27 price list)'},
]
h['tips'] = ['Reserve online before Oct 31, 2026 with code TGHRental109 (10% off, shown on en.grand-hirafu.jp/snow/rentals).',
             'Daily storage: leave the gear at the shop between the two ski days.']
t = places['teine']
t['info'] = [
    {'label': 'Lift ticket', 'value': '1 day ¥5,700 online / ¥6,700 at the counter (2025-26 price)'},
    {'label': 'Rental shop', 'value': 'HEAD Sports Station, Olympia Ski Center 3F, 08:30–20:00'},
    {'label': 'Rental', 'value': 'Skis + boots + poles + jacket and pants, 1 day ¥16,500; helmet ¥3,300 (2025-26 price)'},
    {'label': 'Night ski', 'value': '16:00–20:00'},
]
t['tips'] = ['Ask for "midski" (short skis, about 130 cm) for Aoki: easier to turn, same price.',
             'Online rental booking opens later (no discount, but QR self check-in); free cancel until 2 days before.',
             'Use the gloves and goggles you bought in Kutchan: Teine rents them only (¥1,700 each).']

d = day[10]
d['stops'].insert(6, {'place': 'sports-takiguchi', 'time': '16:40', 'note': 'Buy ski gloves and goggles for both (≈ ¥6,000–10,000 each), 30 min. Open to 19:00 on weekdays.'})
d['stops'] = sorted(d['stops'], key=lambda s: s['time'])
legs = d['legs']
i = next(k for k, l in enumerate(legs) if l['from'] == 'stay-resort-niseko' and l['to'] == 'nakama-ramen-kutchan')
legs[i:i + 1] = [W('stay-resort-niseko', 'sports-takiguchi', 'Walk along the station street', '2 min'),
                 W('sports-takiguchi', 'stay-resort-niseko', dur='2 min'),
                 W('stay-resort-niseko', 'nakama-ramen-kutchan', dur='2 min')]
d['cost'] = d['cost'].replace('meals)', 'meals); ski gloves and goggles ≈ ¥6,000–10,000 each')

d = day[11]
for s in d['stops']:
    if s['place'] == 'hirafu-base':
        s['note'] = 'Pick up the reserved rental: skis, boots, poles, helmet, jacket + pants. Buy lift tickets. Wear your own gloves and goggles.'
d['notes'] = [n.replace('Rental per person for both days: ¥42,900 with everything, ≈ ¥38,600 with the early code; about ¥36,900 before the code if you bring your own gloves and hat.',
                        'Rental per person for both days: ¥36,900 (skis, boots, poles, helmet, jacket and pants), ¥33,210 with the early code. Gloves and goggles are your own (bought in Kutchan yesterday).')
              for n in d['notes']]
d['alerts'] = ['Rental reserved online (with the 10% code); buy lift tickets online when sales open.', 'Take the gloves and goggles you bought yesterday.', 'Rusutsu drift (tomorrow 15:00) booked in advance after the licence email.']

d = day[14]
d['alerts'] = ['Leave the hotel at 07:35.', 'Take your own gloves and goggles.', 'Laundry night 4: clean clothes for the flights.']
for s in d['stops']:
    if s['place'] == 'teine' and s['time'] == '08:50':
        s['note'] = 'Rental at HEAD Sports Station (Olympia Ski Center 3F): skis, boots, poles, jacket + pants, helmet. Buy 1-day lift tickets. Aoki starts on the beginner area with the moving walkway.'
    if s['place'] == 'teine' and s['time'] == '13:00':
        s['note'] = 'Afternoon runs together; return the gear at the same shop by 15:30.'
d['notes'] = [n for n in d['notes'] if not n.startswith('Teine rents ski wear')] + [
    'Rental without booking is fine; online booking (QR self check-in, no discount) opens later. Prices are 2025-26; 2026-27 prices come out in autumn.']
d['cost'] = '≈ ¥30,000 per person (JR + bus ¥2,720, lift ¥5,700, rental ¥16,500 + helmet ¥3,300, meals)'

for x in p['bookFirst']:
    if 'Grand Hirafu .Base' in x['what']:
        x['what'] = 'Grand Hirafu .Base ski rental for both, Jan 29–30: skis, boots, poles, helmet, jacket + pants (no goggles, gloves, beanie)'
        x['why'] = 'book by Oct 31, 2026 with code TGHRental109 (10% off, shown on the Grand Hirafu rentals page): ¥33,210 instead of ¥36,900 each. Gloves and goggles: buy them in Kutchan on Jan 28.'
c = p['cost']
c['activities'] = c['activities'].replace('ski rental 2 days ≈ ¥38,600 each with the 10% early code', 'Hirafu rental 2 days ¥33,210 each with the 10% early code; own gloves and goggles ≈ ¥6,000–10,000 each') \
    .replace('Teine day ≈ ¥22,200 each (lift ¥5,700 + rental with wear ≈ ¥16,500)', 'Teine day ≈ ¥25,500 each (lift ¥5,700 + rental with wear ¥16,500 + helmet ¥3,300)')
p['summary'] = p['summary'].replace('ski wear is rented at Hirafu.', 'ski wear is rented at Hirafu and Teine; gloves and goggles are bought in Kutchan.')

# ---------- Day 5: no Todaiji, rest before the fire
d = day[5]
d['stops'] = [s for s in d['stops'] if s['place'] != 'todaiji']
for s in d['stops']:
    if s['place'] == 'dormy-namba':
        s['note'] = 'Your suitcases are here. Check in at 15:00 and rest until 16:00.'
    if s['place'] == 'sukiya-kintetsu-nara':
        s['time'] = '16:50'
d['legs'] = [l for l in d['legs'] if not (l['to'] == 'todaiji' or l['from'] == 'todaiji')]
i = next(k for k, l in enumerate(d['legs']) if l['to'] == 'dormy-namba') + 1
d['legs'].insert(i, T('dormy-namba', 'sukiya-kintetsu-nara',
                      'Walk to Kintetsu-Nippombashi (5 min); Kintetsu Nara Line Rapid Express, Kintetsu-Nippombashi about 16:06 → Kintetsu-Nara 16:41; walk 3 min', '45 min'))
d['summary'] = 'Chureito Pagoda and the Yuru Camp view of Fuji in the morning, the car back at Mishima, then one Kodama to Osaka with a sukiyaki bento. A rest at the hotel, then the Nara hill fire in the evening.'
d['title'] = 'Chureito and the Yuru Camp lake, Kodama west, rest, Nara hill fire'
d['titleJa'] = d['titleJa'].replace('東大寺 → ', '') if 'titleJa' in d else d.get('titleJa')
d['notes'] = [n for n in d['notes'] if not n.startswith('More time with the deer')]
d['notes'] = [n.replace('Nara still works (Todaiji closes 17:00).', 'the hill fire still works: you only lose the rest at the hotel.') for n in d['notes']]
d['notes'].append('Todaiji and the deer are on day 7, in daylight: today is only the fire.')
d['cost'] = d['cost'].replace('Todaiji ¥800, ', '')

# ---------- Day 6: no Osu, dinner at Nagoya Station
d = day[6]
d['stops'] = [s for s in d['stops'] if s['place'] not in ('osu', 'yabaton-honten')]
for s in d['stops']:
    if s['place'] == 'toyota-museum':
        s['note'] = 'Looms to cars, robot demos, 1 h 45 (Aoki\'s pick). Last entry 16:30.'
d['stops'].append({'place': 'yabaton-esca', 'time': '17:15', 'note': 'Dinner: miso katsu in the station mall, 45 min.'})
d['legs'] = [l for l in d['legs'] if l['from'] not in ('toyota-museum', 'osu', 'yabaton-honten')]
d['legs'] += [
    T('toyota-museum', 'yabaton-esca', 'Meitetsu Nagoya Line, Sako about 16:45 → Meitetsu-Nagoya 16:47; walk through the station to ESCA (Shinkansen side), 12 min', '25 min'),
    T('yabaton-esca', 'dormy-namba', 'Walk to the Shinkansen gates (5 min); Tokaido Shinkansen Nozomi, Nagoya about 18:10 → Shin-Osaka 18:59; Midosuji Line, Shin-Osaka about 19:05 → Namba 19:20; walk 10 min', '1 h 25', 'shinkansen'),
]
d['notes'] = [n for n in d['notes'] if not n.startswith('One plan for both: the museum')] + ['Osu is out (only a maybe): you are back in Namba about 19:30 instead of 20:45.']
d['title'] = 'Suzuka F1 track kart, Toyota museum, miso katsu at Nagoya Station'
d['summary'] = 'The EV kart on the Suzuka F1 track at midday, the Toyota museum in the afternoon, miso katsu in Nagoya Station and a Nozomi back to Osaka by 19:30.'
d['titleJa'] = '鈴鹿サーキット → トヨタ産業技術記念館 → 名古屋駅'
d['romaji'] = 'Suzuka Sākitto → Toyota Sangyō Gijutsu Kinenkan → Nagoya-eki'

# ---------- Day 7: Nara (deer, Todaiji, Kasuga), then Fushimi Inari, back early
d = day[7]
d.update({
    'short': 'Nara + Inari',
    'title': 'Nara deer, the Great Buddha and Kasuga Taisha, then Fushimi Inari',
    'titleJa': '奈良公園 → 東大寺 → 春日大社 → 伏見稲荷大社',
    'romaji': 'Nara Kōen → Tōdaiji → Kasuga Taisha → Fushimi Inari',
    'summary': 'A full morning in Nara: the deer, the Great Buddha at Todaiji and the lantern paths of Kasuga Taisha, lunch in Nara, then one direct JR train to Fushimi Inari. Back in Namba about 16:10 to rest, then izakaya dinner.',
    'alerts': ['Leave the hotel at 08:15.', 'JR Nara 13:07 is the train to catch (Miyakoji Rapid, no change).', 'Laundry night 2 at the hotel.'],
    'stops': [
        {'place': 'matsuya-nipponbashi', 'time': '07:45', 'note': 'Breakfast: gyudon or a breakfast set, 20 min.'},
        {'place': 'nara-park', 'time': '09:20', 'note': 'Deer and crackers in the open park, 40 min (both of you wanted the deer).'},
        {'place': 'todaiji', 'time': '10:05', 'note': 'The Great Buddha hall, 45 min, deer all around.'},
        {'place': 'kasuga-taisha', 'time': '11:10', 'note': 'The lantern paths and the red shrine, 45 min.'},
        {'place': 'ganko-nara', 'time': '12:15', 'note': 'Lunch: tonkatsu set, 35 min. Leave at 12:50.'},
        {'place': 'fushimi-inari', 'time': '13:50', 'note': 'Torii tunnels, 1 h 10: go up to the first viewpoint and back.'},
        {'place': 'dormy-namba', 'time': '16:10', 'note': 'Rest and laundry.'},
        {'place': 'hitomebore-uranamba', 'time': '18:30', 'note': 'Dinner: skewers and cheap drinks.'},
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        T('matsuya-nipponbashi', 'nara-park', 'Walk to Kintetsu-Nippombashi (5 min); Kintetsu Nara Line Rapid Express, Kintetsu-Nippombashi 08:36 → Kintetsu-Nara 09:11 (¥680); walk 8 min', '50 min'),
        W('nara-park', 'todaiji', 'Walk north through the park', '10 min'),
        W('todaiji', 'kasuga-taisha', 'Walk south-east on the lantern path', '20 min'),
        W('kasuga-taisha', 'ganko-nara', 'Walk back west to Higashimuki', '25 min'),
        T('ganko-nara', 'fushimi-inari', 'Walk to JR Nara (15 min); JR Nara Line Miyakoji Rapid, Nara 13:07 → Inari 13:49 (no change, ¥680)', '1 h'),
        T('fushimi-inari', 'dormy-namba', 'Walk to Keihan Fushimi-Inari (5 min); Keihan Main Line, Fushimi-Inari about 15:05 → Yodoyabashi 15:50 (change at Tambabashi to the express); Midosuji Line, Yodoyabashi about 15:55 → Namba 16:02; walk 10 min', '1 h 5'),
        W('dormy-namba', 'hitomebore-uranamba', dur='8 min'),
        W('hitomebore-uranamba', 'dormy-namba', dur='8 min'),
    ],
    'notes': [
        'The Sabbat of the Witch places in Kyoto (concert hall, Sanjo arcade, station stairs) are out: they are only for looking.',
        'Kinkakuji moved to tomorrow morning: a second chance for snow on the roof, and today ends early.',
        'Fushimi Inari is open all the time, so the afternoon is fine.',
        'Train times are from the current timetable; check them on Jorudan the day before.',
    ],
    'cost': '≈ ¥8,500 per person (trains about ¥2,200, deer crackers ¥200, Todaiji ¥800, meals)',
})

# ---------- Day 8: Kinkakuji in the morning, maid café, Den Den Town, kushikatsu in Namba
d = day[8]
d.update({
    'short': 'Kinkakuji + goods', 'cover': 'kinkakuji',
    'title': 'Kinkakuji in the morning, maid café lunch, Den Den Town',
    'titleJa': '金閣寺 → めいどりーみん → 日本橋オタロード → 道頓堀',
    'romaji': 'Kinkakuji → Meidorīmin → Nipponbashi → Dōtonbori',
    'summary': 'An easy train and bus to Kinkakuji in the morning light (snow on the roof if lucky), back to Osaka for a maid café lunch with a stage show and the anime shops on Otaroad. A rest, then kushikatsu near the hotel.',
    'alerts': ['Phone LB DRIVE-IN today to confirm Wednesday hours and ask about a taxi from Izumi-Sunagawa.'],
    'stops': [
        {'place': 'dormy-namba', 'time': '07:30', 'note': 'Breakfast: the hotel buffet once (¥2,500, crab chirashi).'},
        {'place': 'kinkakuji', 'time': '10:20', 'note': 'Gold pavilion, 40 min; snow on the roof if lucky (Aoki\'s pick).'},
        {'place': 'maidreamin-nipponbashi', 'time': '13:00', 'note': 'Lunch in the maid café, 55 min (Pegasis\'s pick).'},
        {'place': 'otaroad', 'time': '14:00', 'note': 'Figures, retro games, Animate, Melonbooks, 1 h 45.'},
        {'place': 'dormy-namba', 'time': '16:00', 'note': 'Drop the goods, rest.'},
        {'place': 'kushikatsu-daruma-dotonbori', 'time': '18:30', 'note': 'Dinner: kushikatsu (fried skewers), no second dip in the sauce.'},
    ],
    'legs': [
        T('dormy-namba', 'kinkakuji', 'Walk to Namba (10 min); Midosuji Line, Namba about 08:35 → Umeda 08:43; JR Kyoto Line Special Rapid, Osaka about 08:55 → Kyoto 09:24; Kyoto City Bus 205, Kyoto Station about 09:35 → Kinkakuji-michi 10:15; walk 5 min', '1 h 50', 'bus'),
        T('kinkakuji', 'maidreamin-nipponbashi', 'Kyoto City Bus 205, Kinkakuji-michi about 11:05 → Kyoto Station 11:45; JR Kyoto Line Special Rapid, Kyoto about 11:55 → Osaka 12:24; Midosuji Line, Umeda about 12:30 → Namba 12:38; walk 12 min', '1 h 50'),
        W('maidreamin-nipponbashi', 'otaroad', dur='2 min'),
        W('otaroad', 'dormy-namba', 'Walk north-west', '12 min'),
        W('dormy-namba', 'kushikatsu-daruma-dotonbori', dur='10 min'),
        W('kushikatsu-daruma-dotonbori', 'dormy-namba', dur='10 min'),
    ],
    'notes': ['Kinkakuji is Aoki\'s want, Den Den Town too; the maid café is Pegasis\'s.',
              'Umeda (Pokémon and Nintendo) is out: you see the same shops in Shibuya on day 3.',
              'Kyoto bus 205 can be slow and full: a taxi from Kyoto Station takes about 25 min (≈ ¥3,000).'],
    'cost': '≈ ¥10,000 per person (trains and buses about ¥2,300, hotel breakfast ¥2,500, Kinkakuji ¥500, maid café, dinner); goods extra',
})

p['who']['pegasis'] = p['who']['pegasis'].replace(', Osu,', ',').replace('Osu, ', '')

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
order = [x['id'] for x in p['places']] + [k for k in places if k not in [x['id'] for x in p['places']]]
print('dropped:', [i for i in order if i not in used])
p['places'] = [places[i] for i in order if i in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
