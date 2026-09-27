"""Sep 26 2026 (6): no Toyota Automobile Museum. Day 10 = calm Kyoto day (Fushimi Inari, Kinkakuji);
day 7 = Nara only; day 8 = back to Osaka, maid café lunch, Otaroad, kushikatsu."""
import json
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
D = {d['n']: d for d in p['days']}
old = {x['id']: x for x in json.load(open('scripts/plans/final-a.before-ryokan.json'))['places']}
bpl = {x['id']: x for x in json.load(open('scripts/plans/final-b.json'))['places']}
places['mizuno-dotonbori'] = old['mizuno-dotonbori']
places['kushikatsu-daruma-dotonbori'] = bpl['kushikatsu-daruma-dotonbori']
def W(a, b, label='Walk', dur='5 min'): return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, b, label, dur, mode='train'): return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}
def S(place, time, note): return {'place': place, 'time': time, 'note': note}

# ---------- Day 7: Nara only
d = D[7]
d.update({
    'short': 'Nara ryokan', 'cover': 'edosan',
    'title': 'A slow day in Nara: deer, the Great Buddha and a ryokan night in Nara Park',
    'titleJa': '奈良公園 → 東大寺 → 江戸三',
    'romaji': 'Nara Kōen → Tōdaiji → Edosan',
    'summary': 'A slow morning in Osaka, one Kintetsu train to Nara, lunch, then a long afternoon with the deer and the Great Buddha. Your ryokan is inside Nara Park: tatami room, yukata and a hot-pot dinner in your room.',
    'alerts': ['Leave the suitcases at the Dormy Inn front (you are back tomorrow); take one small bag each.',
               'Ryokan: booked the fully cooked hot-pot plan, with "no raw fish" in the note.'],
    'stops': [
        S('matsuya-nipponbashi', '10:00', 'Breakfast: gyudon or a breakfast set, 20 min.'),
        S('ganko-nara', '11:45', 'Lunch: tonkatsu set, 45 min.'),
        S('nara-park', '12:45', 'Deer and crackers in the open park, 1 h 30 (both of you wanted the deer).'),
        S('todaiji', '14:25', 'The Great Buddha hall and the deer around the gate, 1 h 15 (winter closing about 16:30).'),
        S('edosan', '16:00', 'Check in; tea, yukata, a rest. Deer outside the door at dusk.'),
        S('edosan', '18:00', 'Dinner: Wakakusa hot-pot course, served in your room.'),
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        T('matsuya-nipponbashi', 'ganko-nara', 'Walk to Kintetsu-Nippombashi (5 min); Kintetsu Nara Line Rapid Express, Kintetsu-Nippombashi about 10:36 → Kintetsu-Nara 11:11 (¥680); walk 8 min to Higashimuki', '50 min'),
        W('ganko-nara', 'nara-park', 'Walk east into the park', '12 min'),
        W('nara-park', 'todaiji', 'Walk north through the park', '10 min'),
        W('todaiji', 'edosan', 'Walk south through the park to the Sagiike pond', '20 min'),
    ],
    'notes': ['Fushimi Inari moved to day 10, the Kyoto day: today is only Nara.',
              'Todaiji hall: winter hours about 8:00–16:30.'],
    'cost': '≈ ¥33,000 per person (ryokan ¥30,800 with dinner and breakfast, Kintetsu ¥680, Todaiji ¥800, deer crackers ¥200, lunch)',
})

# ---------- Day 8: ryokan, back to Osaka
d = D[8]
d.update({
    'short': 'Ryokan + goods', 'cover': 'otaroad',
    'title': 'Ryokan breakfast, maid café lunch, Den Den Town, kushikatsu',
    'titleJa': '江戸三 → めいどりーみん → 日本橋オタロード → 道頓堀',
    'romaji': 'Edosan → Meidorīmin → Nipponbashi → Dōtonbori',
    'summary': 'A slow ryokan breakfast and a 10:00 check-out, one train back to Namba, a maid café lunch with the stage show and the anime shops on Otaroad. A rest, then kushikatsu near the hotel.',
    'alerts': ['Phone LB DRIVE-IN today to confirm Wednesday hours and ask about a taxi from Izumi-Sunagawa.'],
    'stops': [
        S('edosan', '08:30', 'Breakfast in your room; check out at 10:00.'),
        S('dormy-namba', '11:15', 'Check in again or leave the small bags at the front.'),
        S('maidreamin-nipponbashi', '12:15', "Lunch in the maid café with the stage show, 1 h (Pegasis's pick)."),
        S('otaroad', '13:20', "Figures, retro games, Animate, Melonbooks, 2 h (Aoki's pick)."),
        S('dormy-namba', '15:30', 'Rest; laundry.'),
        S('kushikatsu-daruma-dotonbori', '18:30', 'Dinner: kushikatsu (fried skewers), no second dip in the sauce.'),
    ],
    'legs': [
        T('edosan', 'dormy-namba', 'Walk to Kintetsu-Nara (15 min); Kintetsu Nara Line Rapid Express, Kintetsu-Nara about 10:20 → Kintetsu-Nippombashi 10:55; walk 5 min', '55 min'),
        W('dormy-namba', 'maidreamin-nipponbashi', dur='12 min'),
        W('maidreamin-nipponbashi', 'otaroad', dur='2 min'),
        W('otaroad', 'dormy-namba', 'Walk north-west', '12 min'),
        W('dormy-namba', 'kushikatsu-daruma-dotonbori', dur='10 min'),
        W('kushikatsu-daruma-dotonbori', 'dormy-namba', dur='10 min'),
    ],
    'notes': ["Den Den Town is Aoki's want; the maid café is Pegasis's.", 'Kinkakuji moved to day 10, the Kyoto day.'],
    'cost': '≈ ¥7,000 per person (Kintetsu ¥680, maid café, dinner); goods extra',
    'sleepNote': 'Dormy Inn again, 3 more nights. Laundry night 2.',
})

# ---------- Day 10: a calm Kyoto day
d = D[10]
d.update({
    'short': 'Kyoto', 'cover': 'fushimi-inari', 'region': 'kansai',
    'title': 'A calm Kyoto day: Fushimi Inari, Kyoto ramen, Kinkakuji, okonomiyaki',
    'titleJa': '伏見稲荷大社 → 京都駅 → 金閣寺 → 道頓堀',
    'romaji': 'Fushimi Inari → Kyōto-eki → Kinkakuji → Dōtonbori',
    'summary': 'A late start: the torii tunnels of Fushimi Inari, ramen at Kyoto Station, then Kinkakuji in the afternoon light. Back in Osaka for okonomiyaki on Dotonbori, and pack for the flight north.',
    'temp': '1 – 8 °C',
    'alerts': ['Pack tonight: tomorrow the bus to Itami leaves Namba at 09:00.'],
    'stops': [
        S('matsuya-nipponbashi', '09:15', 'Breakfast: gyudon or a breakfast set, 20 min.'),
        S('fushimi-inari', '11:00', "Torii tunnels, 1 h 15: up to the first viewpoint and back (Aoki's pick)."),
        S('ramen-koji', '12:35', 'Lunch: choose a ramen shop on the Kyoto Station 10F floor, 45 min.'),
        S('kinkakuji', '14:05', "Gold pavilion, 45 min (Aoki's pick)."),
        S('dormy-namba', '16:45', 'Rest; pack.'),
        S('mizuno-dotonbori', '18:30', 'Dinner: okonomiyaki cooked in front of you.'),
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        T('matsuya-nipponbashi', 'fushimi-inari', 'Walk to Nagahoribashi (8 min); Osaka Metro Sakaisuji Line, Nagahoribashi about 10:05 → Kitahama 10:08; Keihan Limited Express, Kitahama about 10:15 → Tambabashi 10:50; Keihan local, Tambabashi → Fushimi-Inari 10:57', '1 h 5'),
        T('fushimi-inari', 'ramen-koji', 'Walk to JR Inari (3 min); JR Nara Line, Inari about 12:20 → Kyoto 12:25; up to Station building 10F', '15 min'),
        T('ramen-koji', 'kinkakuji', 'Kyoto City Bus 205, Kyoto Station about 13:25 → Kinkakuji-michi 14:00; walk 5 min', '40 min', 'bus'),
        T('kinkakuji', 'dormy-namba', 'Kyoto City Bus 205, Kinkakuji-michi about 14:55 → Kyoto Station 15:35; JR Kyoto Line Special Rapid, Kyoto about 15:45 → Osaka 16:14; Midosuji Line, Umeda about 16:20 → Namba 16:28; walk 10 min', '1 h 50'),
        W('dormy-namba', 'mizuno-dotonbori', dur='10 min'),
        W('mizuno-dotonbori', 'dormy-namba', dur='10 min'),
    ],
    'sleep': 'dormy-namba', 'sleepNote': 'Dormy Inn, last night in Osaka.',
    'notes': ['Fushimi Inari is open all the time; late morning is busier than dawn but fine.',
              'Kyoto bus 205 can be slow and full: a taxi from Kyoto Station takes about 25 min (≈ ¥3,000).',
              "JAL includes a 20 kg checked bag each: Pegasis's suitcase flies free tomorrow.",
              'Train times are from the current timetable; check them on Jorudan the day before.'],
    'cost': '≈ ¥8,000 per person (trains and buses about ¥2,300, Kinkakuji ¥500, ramen, okonomiyaki)',
})

# ---------- top level
p['summary'] = p['summary'].replace('Den Den Town, Liberty Walk and the Toyota Automobile Museum,', 'Den Den Town and Liberty Walk,')
w = p['who']
w['aoki'] = w['aoki'].replace('Toyota museum, and your maybe the Toyota Automobile Museum (an extra day from Osaka),', 'Toyota museum,')
c = p['cost']
c['transport'] = c['transport'].replace('Nagoya museum day ≈ ¥14,800; ', '')
c['activities'] = c['activities'].replace(', Toyota Automobile Museum ≈ ¥1,200', '')
c['total'] = c['total'].replace('≈ ¥426,000 Pegasis / ¥406,000 Aoki', '≈ ¥411,000 Pegasis / ¥391,000 Aoki')

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
order = [x['id'] for x in p['places']] + [k for k in places if k not in [x['id'] for x in p['places']]]
print('dropped:', [i for i in order if i not in used])
p['places'] = [places[i] for i in order if i in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
