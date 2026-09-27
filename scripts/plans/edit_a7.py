"""Sep 26 2026 (7): whole trip one day earlier at both ends: arrive Mon Jan 18, fly home Mon Feb 1.
New day 2 (Tue Jan 19): Meiji Jingu, Harajuku, Shibuya shops, Girls Band Cry Hachiko, Shibuya Sky sunset, Isetan, Golden Gai.
Day 4 (Thu Jan 21): Yako added. Day 9 (Tue Jan 26): ryokan → Fushimi Inari → Kinkakuji → Otaroad. The calm Kyoto day goes."""
import json, copy
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
old = {d['n']: d for d in p['days']}
b = {x['id']: x for x in json.load(open('scripts/plans/final-b.json'))['places']}
prev = {x['id']: x for x in json.load(open('scripts/plans/final-a.before-later.json'))['places']}
def W(a, bb, label='Walk', dur='5 min'): return {'from': a, 'to': bb, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, bb, label, dur, mode='train'): return {'from': a, 'to': bb, 'mode': mode, 'label': label, 'duration': dur}
def S(place, time, note): return {'place': place, 'time': time, 'note': note}

for k in ['hachiko', 'shibuya-parco', 'yako-shinmei', 'fukuwarai-yako']:
    places[k] = b[k]
places['shibuya-parco']['ref'] = 'shibuya-harajuku-games-shops'
places['isetan'] = prev['isetan']
places['meiji-jingu'] = {'id': 'meiji-jingu', 'ref': 'shibuya-harajuku-games-shops', 'en': 'Meiji Jingu', 'ja': '明治神宮', 'romaji': 'Meiji Jingū',
    'lat': 35.67484, 'lon': 139.69963, 'kind': 'sight',
    'blurb': 'A big Shinto shrine in a forest in the middle of Tokyo, 1 min from Harajuku Station. A wide gravel path under tall trees to the main hall.',
    'info': [{'label': 'Hours', 'value': 'Sunrise to sunset (about 6:40–16:20 in January); free'}], 'tips': ['The walk from the gate to the main hall takes 10 min.']}
places['takeshita'] = {'id': 'takeshita', 'ref': 'shibuya-harajuku-games-shops', 'en': 'Takeshita Street, Harajuku', 'ja': '竹下通り', 'romaji': 'Takeshita-dōri',
    'lat': 35.67116, 'lon': 139.70496, 'kind': 'sight',
    'blurb': "Harajuku's narrow street of fashion shops, crêpes and sweets, full of young people. Cheap fun shops and street snacks.",
    'info': [{'label': 'Hours', 'value': 'Shops about 10:00/11:00–20:00'}], 'tips': ['On a Tuesday morning it is much quieter than at the weekend.']}
places['golden-gai'] = {'id': 'golden-gai', 'ref': 'shinjuku-golden-gai-yokocho', 'en': 'Golden Gai, Shinjuku', 'ja': '新宿ゴールデン街', 'romaji': 'Shinjuku Gōruden-gai',
    'lat': 35.69399, 'lon': 139.7047, 'kind': 'sight',
    'blurb': 'Six narrow lanes of about 200 tiny bars, each with 5–10 seats. One drink in a bar that welcomes visitors.',
    'info': [{'label': 'Hours', 'value': 'Evenings, about 19:00 until late'}, {'label': 'Cost', 'value': 'Cover charge often ¥500–1,000 + drinks'}],
    'tips': ['Look for signs "Welcome" or a posted cover charge at the door; some bars are for regulars only.']}

# --- Day 1 (Mon Jan 18)
d1 = copy.deepcopy(old[1]); d1['date'], d1['weekday'] = '2027-01-18', '月'
d1['notes'] = [n for n in d1['notes'] if 'TMG' not in n]
d1['alerts'] = [a for a in d1['alerts'] if 'TMG' not in a]
d1['notes'] = [n.replace('The Isetan half-price food is out: it closes at 20:00, before you reach Shinjuku.', 'The Isetan half-price food is tomorrow evening (it closes at 20:00).') for n in d1['notes']]

# --- Day 2 (Tue Jan 19): new
d2 = {
    'n': 2, 'date': '2027-01-19', 'weekday': '火', 'region': 'tokyo', 'short': 'Harajuku + Shibuya', 'cover': 'shibuya-sky',
    'title': 'Meiji Jingu, Harajuku, Nintendo and Pokémon, Shibuya Sky at sunset, Golden Gai',
    'titleJa': '明治神宮 → 竹下通り → 渋谷PARCO → ハチ公 → 渋谷スカイ → 新宿',
    'romaji': 'Meiji Jingū → Takeshita-dōri → Shibuya Paruko → Hachikō → Shibuya Sukai → Shinjuku',
    'summary': 'A slow first full day: the forest shrine Meiji Jingu, crêpes on Takeshita Street, lunch and the Nintendo and Pokémon shops in Shibuya, the Girls Band Cry meeting place at Hachiko, and Tokyo from Shibuya Sky at sunset. Half-price food at Isetan and one drink in Golden Gai.',
    'temp': '2 – 10 °C',
    'alerts': ['Shibuya Sky: buy the web ticket for about 16:00 (sunset about 16:55); sales open 4 weeks ahead.'],
    'stops': [
        S('hotel-super-shinjuku', '09:00', 'Breakfast: free hotel buffet (07:00–09:00), no rush.'),
        S('meiji-jingu', '10:15', 'The forest path to the main hall and back, 45 min.'),
        S('takeshita', '11:15', 'Crêpes, snacks and fun shops, 45 min.'),
        S('uobei-shibuya', '12:20', 'Lunch: touch-screen sushi (cooked plates for Aoki), 45 min.'),
        S('shibuya-parco', '13:20', "Nintendo TOKYO and Pokémon Center on 6F, 1 h 15 (Aoki's pick)."),
        S('hachiko', '14:50', "Girls Band Cry ep 3 meeting place, the Scramble crossing, 20 min (Aoki's pick)."),
        S('shibuya-sky', '15:55', "Rooftop at sunset (about 16:55) and the city lights, 1 h 20 (Aoki's pick)."),
        S('isetan', '19:10', "Dinner: half-price sushi and bento in the food hall before the 20:00 close; eat at the hotel (Pegasis's pick)."),
        S('golden-gai', '20:45', 'One drink in a tiny bar, 45 min (both of you wanted it).'),
    ],
    'legs': [
        T('hotel-super-shinjuku', 'meiji-jingu', 'Walk to JR Shinjuku (12 min); JR Yamanote Line, Shinjuku about 10:05 → Harajuku 10:09; walk 2 min', '20 min'),
        W('meiji-jingu', 'takeshita', 'Walk back past Harajuku Station', '10 min'),
        T('takeshita', 'uobei-shibuya', 'JR Yamanote Line, Harajuku about 12:05 → Shibuya 12:07; walk to Dogenzaka 6 min', '15 min'),
        W('uobei-shibuya', 'shibuya-parco', 'Walk up Koen-dori', '10 min'),
        W('shibuya-parco', 'hachiko', 'Walk down to the station square', '10 min'),
        W('hachiko', 'shibuya-sky', 'Walk to Shibuya Scramble Square; a café break before the ticket time', '10 min'),
        T('shibuya-sky', 'isetan', 'JR Shonan-Shinjuku Line or Yamanote Line, Shibuya about 18:40 → Shinjuku 18:47; walk to Isetan (Shinjuku-sanchome) 12 min', '25 min'),
        W('isetan', 'hotel-super-shinjuku', 'Walk to the hotel with the food', '12 min'),
        W('hotel-super-shinjuku', 'golden-gai', dur='6 min'),
        W('golden-gai', 'hotel-super-shinjuku', dur='6 min'),
    ],
    'sleep': 'hotel-super-shinjuku', 'sleepNote': 'Night 2 of 4.',
    'notes': ['A light day for jet lag: short walks, lots of indoor places.', 'Tax-free: from Nov 2026 you pay the tax in the shop and get it back at the airport customs desk.'],
    'cost': '≈ ¥9,000 per person (trains ¥400, lunch, Shibuya Sky sunset ticket ≈ ¥3,000, Isetan dinner, one drink + cover)',
}

# --- Day 3 (Wed Jan 20): old day 2
d3 = copy.deepcopy(old[2]); d3['n'] = 3
d3['sleepNote'] = 'Night 3 of 4.'
# --- Day 4 (Thu Jan 21): old day 3 without Shibuya, with Yako
d4 = copy.deepcopy(old[3]); d4['n'] = 4
d4['stops'] = [
    S('hotel-super-shinjuku', '09:00', 'Breakfast: free hotel buffet. 09:30: hand both suitcases to the front for Yamato to Osaka.'),
    S('nissan-crossing', '10:30', "Free Nissan showroom in Ginza, 20 min (Aoki's pick)."),
    S('yako-shinmei', '11:40', "Girls Band Cry: Nina's home streets and the shrine from ep 12–13, 30 min (Aoki's pick)."),
    S('fukuwarai-yako', '12:20', 'Lunch: local ramen by Yako Station, 35 min (closes about 14:00).'),
    S('gbc-lazona', '13:20', 'Buy the GBC stamp book; Rufa Square stage.'),
    S('gbc-miharashi', '14:05', 'The river steps from ep 2, in afternoon sun.'),
    S('gbc-marufuku', '15:00', 'Hotcake and coffee (afternoon snack), 45 min; East Exit plaza stamp above.'),
    S('toyota-shinkawabashi', '16:45', "Pick up the car (studless tyres, ETC). Walk past CLUB CITTA' on the way."),
] + [s for s in old[3]['stops'] if s['place'] in ('hotenkaku', 'daikoku', 'tatsumi')]
d4['legs'] = [
    T('hotel-super-shinjuku', 'nissan-crossing', 'Walk to Shinjuku-sanchome (10 min); Tokyo Metro Marunouchi Line, Shinjuku-sanchome about 10:05 → Ginza 10:22 (exit A4)', '25 min'),
    T('nissan-crossing', 'yako-shinmei', 'Walk to JR Shimbashi (10 min); JR Tokaido Line, Shimbashi about 11:02 → Kawasaki 11:16; JR Nambu Line, Kawasaki about 11:24 → Yako 11:30; walk 10 min', '50 min'),
    W('yako-shinmei', 'fukuwarai-yako', 'Walk back towards Yako Station', '12 min'),
    T('fukuwarai-yako', 'gbc-lazona', 'JR Nambu Line, Yako about 13:00 → Kawasaki 13:06; walk to Lazona (west exit)', '15 min'),
] + [l for l in old[3]['legs'] if l['from'] in ('gbc-lazona', 'gbc-miharashi', 'gbc-marufuku', 'toyota-shinkawabashi', 'hotenkaku', 'daikoku', 'tatsumi')]
d4['title'] = 'Nissan Crossing, Girls Band Cry in Yako and Kawasaki, Yokohama Chinatown, then Daikoku by your own car'
d4['titleJa'] = '銀座 → 矢向 → 川崎 → 横浜中華街 → 大黒PA → 辰巳PA'
d4['romaji'] = 'Ginza → Yakō → Kawasaki → Yokohama Chūkagai → Daikoku PA → Tatsumi PA'
d4['summary'] = "Nissan Crossing in Ginza, then Nina's home streets in Yako and the Girls Band Cry walk in Kawasaki. Pegasis picks up the car at 16:45 and drives you to Yokohama Chinatown for dinner, then Daikoku and Tatsumi at night."
d4['sleepNote'] = 'Night 4 of 4.'
d4['cost'] = '≈ ¥13,000 per person (trains, courier, ramen, dinner, tolls and parking split); car on day 5'
# --- Days 5–9 keep their dates
d5 = copy.deepcopy(old[4]); d5['n'] = 5
d6 = copy.deepcopy(old[5]); d6['n'] = 6
d7 = copy.deepcopy(old[6]); d7['n'] = 7
d8 = copy.deepcopy(old[7]); d8['n'] = 8
# --- Day 9 (Tue Jan 26): ryokan → Fushimi Inari → Kinkakuji → Otaroad
d9 = copy.deepcopy(old[8]); d9['n'] = 9
d9.update({
    'short': 'Inari + Kinkakuji', 'cover': 'fushimi-inari',
    'title': 'Ryokan breakfast, Fushimi Inari, Kyoto ramen, Kinkakuji, Den Den Town',
    'titleJa': '江戸三 → 伏見稲荷大社 → 京都駅 → 金閣寺 → 日本橋オタロード',
    'romaji': 'Edosan → Fushimi Inari → Kyōto-eki → Kinkakuji → Nipponbashi',
    'summary': 'A slow ryokan breakfast and a 10:00 check-out, then one direct JR train to Fushimi Inari. Ramen at Kyoto Station, Kinkakuji in the afternoon, back to Osaka for the anime shops on Otaroad and kushikatsu.',
    'stops': [
        S('edosan', '08:30', 'Breakfast in your room; check out at 10:00.'),
        S('fushimi-inari', '11:20', "Torii tunnels, 1 h 10: up to the first viewpoint and back (Aoki's pick)."),
        S('ramen-koji', '12:50', 'Lunch: choose a ramen shop on the Kyoto Station 10F floor, 45 min.'),
        S('kinkakuji', '14:25', "Gold pavilion, 45 min (Aoki's pick)."),
        S('dormy-namba', '17:00', 'Check in again (suitcases are at the front); drop the bags.'),
        S('otaroad', '17:30', "Figures, retro games, Animate, Melonbooks, 1 h 30 (Aoki's pick)."),
        S('kushikatsu-daruma-dotonbori', '19:20', 'Dinner: kushikatsu (fried skewers), no second dip in the sauce.'),
    ],
    'legs': [
        T('edosan', 'fushimi-inari', 'Walk to JR Nara (20 min); JR Nara Line Miyakoji Rapid, Nara about 10:37 → Inari 11:19 (no change, ¥680)', '1 h'),
        T('fushimi-inari', 'ramen-koji', 'JR Nara Line, Inari about 12:35 → Kyoto 12:40; up to Station building 10F', '15 min'),
        T('ramen-koji', 'kinkakuji', 'Kyoto City Bus 205, Kyoto Station about 13:45 → Kinkakuji-michi 14:20; walk 5 min', '40 min', 'bus'),
        T('kinkakuji', 'dormy-namba', 'Kyoto City Bus 205, Kinkakuji-michi about 15:15 → Kyoto Station 15:55; JR Kyoto Line Special Rapid, Kyoto about 16:05 → Osaka 16:34; Midosuji Line, Umeda about 16:40 → Namba 16:48; walk 10 min', '1 h 50'),
        W('dormy-namba', 'otaroad', 'Walk south-east', '12 min'),
        W('otaroad', 'kushikatsu-daruma-dotonbori', 'Walk north-west to Dotonbori', '15 min'),
        W('kushikatsu-daruma-dotonbori', 'dormy-namba', dur='10 min'),
    ],
    'alerts': ['Phone LB DRIVE-IN today to confirm Wednesday hours and ask about a taxi from Izumi-Sunagawa.'],
    'notes': ['Fushimi Inari and Kinkakuji are Aoki\'s wants; Den Den Town too.', 'Kyoto bus 205 can be slow and full: a taxi from Kyoto Station takes about 25 min (≈ ¥3,000).', 'Train times are from the current timetable; check them on Jorudan the day before.'],
    'cost': '≈ ¥8,000 per person (JR and bus about ¥2,300, Kinkakuji ¥500, ramen, kushikatsu); goods extra',
    'sleepNote': 'Dormy Inn, 2 more nights.',
})
# --- Day 10 (Wed Jan 27): old day 9 + packing
d10 = copy.deepcopy(old[9]); d10['n'] = 10
d10['alerts'] = d10['alerts'] + ['Pack tonight: tomorrow the bus to Itami leaves Namba at 09:00.']
d10['notes'] = d10['notes'] + ["JAL includes a 20 kg checked bag each: Pegasis's suitcase flies free tomorrow."]
d10['sleepNote'] = 'Dormy Inn, last night in Osaka.'
# --- Days 11–15: one day earlier
dates = {11: ('2027-01-28', '木'), 12: ('2027-01-29', '金'), 13: ('2027-01-30', '土'), 14: ('2027-01-31', '日'), 15: ('2027-02-01', '月')}
rest = []
for n in range(11, 16):
    d = copy.deepcopy(old[n]); d['date'], d['weekday'] = dates[n]; rest.append(d)
days = [d1, d2, d3, d4, d5, d6, d7, d8, d9, d10] + rest

pairs = [
    ('Sunday ski traffic: park at Hirafu lot 1 early', 'Saturday ski traffic: park at Hirafu lot 1 early'),
    ('Leave the hotel at 09:30 (Sunday: park at Hirafu lot 1).', 'Leave the hotel at 09:30 (Saturday: park at Hirafu lot 1).'),
    ('Be in the queue by 11:20 on Monday.', 'Expect a queue on Sunday.'),
    ('buy them in Kutchan on Jan 29', 'buy them in Kutchan on Jan 28'),
    ('"Jan 29, 30, 31"', '"Jan 28, 29, 30"'),
    ('"Feb 1"', '"Jan 31"'),
    ('Twin with breakfast ¥19,800 per room (Rakuten, Feb 1, Sep 26, 2026)', 'Twin with breakfast ¥16,500 per room (Rakuten, Jan 31, Sep 26, 2026)'),
    ('Fri Jan 29 13:40 → Mon Feb 1 about 14:15', 'Thu Jan 28 13:40 → Sun Jan 31 about 14:15'),
    ('Open to 19:00 on weekdays.', 'Open to 19:00 on weekdays (Thursday).'),
    ("day 15 of 15 on Aoki's visa", "day 15 of 15 on Aoki's visa (Feb 1)"),
]
def fix(o):
    s = json.dumps(o, ensure_ascii=False)
    for a, bb in pairs: s = s.replace(a, bb)
    return json.loads(s)
p['days'] = fix(days)
p['places'] = fix(list(places.values()))

# Todaiji correction
for x in p['places']:
    if x['id'] == 'todaiji':
        x['info'] = [{'label': 'Ticket', 'value': '¥1,200 (official site, Sep 26, 2026)'}, {'label': 'Hours', 'value': 'Winter 8:00–17:00'}, {'label': 'Deer crackers', 'value': '¥200'}]
s = json.dumps(p['days'], ensure_ascii=False).replace('Todaiji ¥800', 'Todaiji ¥1,200').replace('winter closing about 16:30', 'winter closing 17:00').replace('Todaiji hall: winter hours about 8:00–16:30.', 'Todaiji hall: winter hours 8:00–17:00.')
p['days'] = json.loads(s)

# flights, bookFirst, top level
p['flights'] = [
    'Pegasis: WestJet round trip, Toronto 09:35 Sun Jan 17 → Calgary → Narita T1 16:30 Mon Jan 18; home WS81 Narita T1 18:30 Mon Feb 1 → Calgary → Toronto 22:10 (CA$1,039 with a checked bag on an Econo fare, Google Flights, Sep 26, 2026).',
    'Aoki (booked, dates changed): Air China CA919 Shanghai Pudong T2 14:25 → Narita T1 18:10, Mon Jan 18; home CA920 Narita T1 19:30 → Pudong T2 22:15, Mon Feb 1. Feb 1 = visa day 15.',
    'Osaka → Hokkaido: JAL (J-Air) Itami 10:50 → New Chitose 12:35, Thu Jan 28, ¥16,330 with a 20 kg bag (Google Flights, Sep 26, 2026).',
    'Sapporo → Tokyo, both: Peach MM576 New Chitose 12:00 → Narita T1 13:50, Mon Feb 1 (about ¥10,890 each + checked bag).',
]
B = []
for x in p['bookFirst']:
    w = x['what']
    if w.startswith('Edosan'): pass
    elif w.startswith('Toyota'):
        x['what'] = w.replace('Jan 29 13:50 – Feb 1 14:15', 'Jan 28 13:50 – Jan 31 14:15')
    elif w.startswith('STAY RESORT'):
        x['what'] = 'STAY RESORT NISEKO (Kutchan): move the booking to Jan 28–31 (3 nights)'
        x['why'] = 'Rakuten cannot change dates: book Jan 28–31 first (a twin was free on Sep 26, same price ¥81,360), then cancel the Jan 29 – Feb 1 booking (free until Jan 14, 2027).'
    elif w.startswith('Dormy'):
        x['what'] = 'Dormy Inn PREMIUM Namba, twin: Jan 23–25 (2 nights) and Jan 26–28 (2 nights)'
    elif w.startswith('Super Hotel'):
        x['what'] = 'Super Hotel Shinjuku Kabukicho, twin, Jan 18–22 (4 nights, breakfast included)'
        x['why'] = 'book by mid-October 2026 on the official site (member price): about ¥66,100 for 4 nights on Sep 26.'
    elif w.startswith('Hotel Route-Inn'):
        x['what'] = 'Hotel Route-Inn Sapporo Chuo, twin, Sun Jan 31 (1 night, breakfast included)'
        x['why'] = 'book by mid-October 2026: ¥16,500 per room on Rakuten on Sep 26, 2026.'
    elif w.startswith('Flights'):
        x['what'] = "Flights: Aoki changes CA919/CA920 to Jan 18 and Feb 1 (read 退改规则 in the app first); Pegasis books WestJet Toronto ⇄ Narita (in Jan 18 16:30, out WS81 Feb 1 18:30, Econo fare with 1 bag); both: Peach MM576 New Chitose → Narita, Feb 1 12:00, with checked bags"
        x['why'] = 'do it now: the cheap seats on the new dates can sell out; fares rise before Chinese New Year.'
    elif w.startswith('JAL'):
        x['what'] = 'JAL Itami 10:50 → New Chitose 12:35, Thu Jan 28, 2 people (20 kg bag each included)'
    elif w.startswith('Grand Hirafu'):
        x['what'] = w.replace('Jan 30–31', 'Jan 29–30'); x['why'] = x['why'].replace('Kutchan on Jan 29', 'Kutchan on Jan 28')
    elif w.startswith('Rusutsu'):
        x['what'] = w.replace('Sun Jan 31', 'Sat Jan 30'); x['why'] = x['why'].replace('(ask for Sun Jan 31)', '(ask for Sat Jan 30)')
    elif w.startswith('Shinkansen'):
        x['what'] = 'Shinkansen seats: Kodama Mishima → Shin-Osaka (Sat Jan 23, about 11:54), Nozomi Nagoya → Shin-Osaka (Sun Jan 24)'
        x['why'] = 'reserve on smartEX from 1 month ahead (Dec 23 and 24, 2026); unreserved seats are also possible.'
    elif w.startswith('SHELTER'):
        x['what'] = 'SHELTER live ticket for Wed Jan 20; Shibuya Sky web ticket for Tue Jan 19 about 16:00 (sunset)'
        x['why'] = 'SHELTER: buy when the January list comes out (December 2026). Shibuya Sky: sales open 4 weeks ahead (about Dec 22, 2026); sunset slots sell out first.'
    B.append(x)
p['bookFirst'] = B

p['tagline'] = 'Always together: 4 nights in Tokyo, one short Hakone–Fuji car trip, an Osaka hotel with a ryokan night in Nara Park, and 4 nights in Hokkaido.'
p['summary'] = ('4 nights in Shinjuku with a slow Harajuku and Shibuya day, a full anime day and a Girls Band Cry day in Yako and Kawasaki, where Pegasis picks up a car for Yokohama Chinatown, Daikoku, the Turnpike and Fuji. '
                'One Fuji-view villa night, then the car goes back at Mishima and a direct Kodama takes you to Osaka for the Nara hill fire, Suzuka, Kyoto, Den Den Town and Liberty Walk, '
                'with one ryokan night inside Nara Park and a Matsusaka beef dinner. A JAL flight to Hokkaido: 3 nights in Kutchan for skiing (Pegasis teaches Aoki) and the Rusutsu drift course, '
                '1 night in Sapporo, and a Peach flight to Narita for both flights home. You do everything together, every meal has a named place, and every train and bus has its departure time.')
w = p['who']
w['aoki'] = w['aoki'].replace('Shibuya Sky before 15:00 + Nintendo/Pokémon', 'Shibuya Sky at sunset + Nintendo/Pokémon + Harajuku').replace('GBC Yako stamps, ', '')
w['pegasis'] = w['pegasis'].replace('Radio Kaikan,', 'Isetan half-price food, Radio Kaikan,', 1)
c = p['cost']
c['hotels'] = (c['hotels'].replace('Super Hotel 3 nights ¥25,700', 'Super Hotel 4 nights ≈ ¥33,000')
               .replace('Dormy Inn PREMIUM Namba 5 nights ≈ ¥50,000 not checked', 'Dormy Inn PREMIUM Namba 4 nights ≈ ¥40,000 not checked')
               .replace('Route Inn 1 night ≈ ¥9,900', 'Route Inn 1 night ≈ ¥8,250'))
c['transport'] = c['transport'].replace('Peach New Chitose → Narita ≈ ¥10,500 with bag', 'Peach New Chitose → Narita ≈ ¥13,500 with bag')
c['total'] = c['total'].replace('≈ ¥411,000 Pegasis / ¥391,000 Aoki', '≈ ¥409,000 Pegasis / ¥389,000 Aoki') + ' Aoki: Air China change fee about 500–1,000 yuan.'

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
print('dropped:', [x['id'] for x in p['places'] if x['id'] not in used])
p['places'] = [x for x in p['places'] if x['id'] in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
for dd in p['days']: print(dd['n'], dd['date'], dd['weekday'], dd['short'], dd.get('sleep'))
