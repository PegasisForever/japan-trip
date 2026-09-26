"""Sep 26 2026 (3): no Teine ski day (slow Sapporo day with Maruyama Zoo), a ryokan night at Edosan in Nara Park on Jan 25,
Matsusaka beef yakiniku dinner in Namba on Jan 27."""
import json
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
day = {d['n']: d for d in p['days']}
cpl = {x['id']: x for x in json.load(open('scripts/plans/final-c.json'))['places']}

def W(a, b, label='Walk', dur='5 min'):
    return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, b, label, dur, mode='train'):
    return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}

new = [
    {'id': 'edosan', 'ref': None, 'en': 'Edosan ryokan, Nara Park', 'ja': '江戸三', 'romaji': 'Edosan',
     'lat': 34.68150, 'lon': 135.83584, 'kind': 'hotel',
     'blurb': 'A ryokan of small separate cottages inside Nara Park, opened in 1907. Deer walk past your door. Tatami room, yukata, and dinner served in your room.',
     'info': [{'label': 'Night', 'value': 'Mon Jan 25 (1 room was left on Sep 26, 2026)'},
              {'label': 'Price', 'value': '"Wakakusa nabe" hot-pot plan, fully cooked: ¥61,600 for 2 with dinner and breakfast (kaiseki plan ¥57,200 has sashimi) (Rakuten, Sep 26, 2026)'},
              {'label': 'Review', 'value': '4.75 (Rakuten)'},
              {'label': 'Access', 'value': 'Kintetsu-Nara 15 min on foot; Osaka-Namba about 40 min by Kintetsu'}],
     'tips': ['Book the hot-pot plan and write "no raw fish, cooked food only" in the booking note.',
              'Leave the suitcases at Dormy Inn Namba; bring one small bag each.']},
    {'id': 'matsusaka-m', 'ref': None, 'en': 'Matsusaka beef yakiniku "M", Hozenji Yokocho', 'ja': '松阪牛焼肉M 法善寺横丁店', 'romaji': 'Matsusakagyū Yakiniku Emu Hōzenji Yokochō',
     'lat': 34.66818, 'lon': 135.50267, 'kind': 'food',
     'blurb': 'Top Matsusaka beef grilled at your table, in the old stone lane of Hozenji Yokocho next to Dotonbori. The special dinner of the trip.',
     'info': [{'label': 'Price', 'value': '6-cut platter ¥11,880 per person (official menu)'},
              {'label': 'Hours', 'value': 'Lunch 12:00–15:00, dinner 17:00–23:00'},
              {'label': 'Booking', 'value': 'TableCheck (online)'}],
     'tips': ['Book a table for 18:30 on Wed Jan 27.', 'Everything is cooked on the grill: fine for Aoki.']},
    {'id': 'maruyama-zoo', 'ref': None, 'en': 'Sapporo Maruyama Zoo', 'ja': '札幌市円山動物園', 'romaji': 'Sapporo-shi Maruyama Dōbutsuen',
     'lat': 43.04876, 'lon': 141.30613, 'kind': 'sight',
     'blurb': "Sapporo's own zoo, 20 min from the hotel: polar bears seen from an underwater tunnel, seals, and penguins in the waterbird house. Snow everywhere.",
     'info': [{'label': 'Hours', 'value': 'Winter 9:30–16:00, last entry 15:30; closed 2nd and 4th Wednesdays'},
              {'label': 'Price', 'value': '¥800'}],
     'tips': ['The Polar Bear House and the waterbird house are indoors: good in the cold.']},
    cpl['yoshiyama-tanukikoji'], cpl['tanukikoji'],
]
for x in new:
    places[x['id']] = x

# ---------- Day 7: Inari first, Nara in the afternoon, ryokan night
d = day[7]
d.update({
    'short': 'Inari + Nara ryokan', 'cover': 'edosan',
    'title': 'Fushimi Inari in the morning, Nara deer and the Great Buddha, a ryokan night in Nara Park',
    'titleJa': '伏見稲荷大社 → 奈良公園 → 東大寺 → 江戸三',
    'romaji': 'Fushimi Inari → Nara Kōen → Tōdaiji → Edosan',
    'summary': 'Fushimi Inari early, before the crowds, then one direct JR train to Nara. Lunch, the deer and the Great Buddha in the afternoon, then your ryokan inside Nara Park: tatami room, yukata and a hot-pot dinner in your room.',
    'alerts': ['Leave the suitcases at the Dormy Inn front (you are back tomorrow); take one small bag each.',
               'Ryokan: booked the fully cooked hot-pot plan, with "no raw fish" in the note.'],
    'stops': [
        {'place': 'matsuya-nipponbashi', 'time': '07:30', 'note': 'Breakfast: gyudon or a breakfast set, 20 min.'},
        {'place': 'fushimi-inari', 'time': '08:45', 'note': 'Torii tunnels with few people, 1 h 10: up to the first viewpoint and back.'},
        {'place': 'ganko-nara', 'time': '11:15', 'note': 'Lunch: tonkatsu set, 40 min.'},
        {'place': 'nara-park', 'time': '12:10', 'note': 'Deer and crackers in the open park, 1 h 15 (both of you wanted the deer).'},
        {'place': 'todaiji', 'time': '13:35', 'note': 'The Great Buddha hall and the deer around the gate, 1 h 10.'},
        {'place': 'edosan', 'time': '15:15', 'note': 'Check in; tea, yukata, a rest. Deer outside the door at dusk.'},
        {'place': 'edosan', 'time': '18:00', 'note': 'Dinner: Wakakusa hot-pot course, served in your room.'},
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        T('matsuya-nipponbashi', 'fushimi-inari', 'Walk to Nagahoribashi (8 min); Osaka Metro Sakaisuji Line, Nagahoribashi 07:53 → Kitahama 07:56; Keihan Limited Express, Kitahama about 08:04 → Tambabashi 08:39; Keihan local, Tambabashi about 08:41 → Fushimi-Inari 08:45', '1 h 5'),
        T('fushimi-inari', 'ganko-nara', 'Walk to JR Inari (3 min); JR Nara Line Miyakoji Rapid, Inari about 10:07 → Nara 10:49 (no change, ¥680); walk 15 min to Higashimuki', '1 h 10'),
        W('ganko-nara', 'nara-park', 'Walk east into the park', '12 min'),
        W('nara-park', 'todaiji', 'Walk north through the park', '10 min'),
        W('todaiji', 'edosan', 'Walk south through the park to the Sagiike pond', '20 min'),
    ],
    'sleep': 'edosan',
    'sleepNote': 'Ryokan night: tatami room, dinner and breakfast in your room.',
    'notes': [
        'Fushimi Inari is best early: few people before 09:30.',
        'Todaiji hall: winter hours about 8:00–16:30.',
        'Keihan and JR times are from the current timetable; check them on Jorudan the day before.',
    ],
    'cost': '≈ ¥33,500 per person (ryokan ¥30,800 with dinner and breakfast, trains about ¥1,400, Todaiji ¥800, deer crackers ¥200, lunch)',
})

# ---------- Day 8: ryokan breakfast, Kinkakuji from Nara, back to Osaka
d = day[8]
d['summary'] = 'Breakfast at the ryokan, then Kintetsu to Kyoto and Kinkakuji (snow on the roof if lucky). Back in Osaka for a late maid café lunch with a stage show and the anime shops on Otaroad, then kushikatsu near the hotel.'
d['title'] = 'Ryokan breakfast, Kinkakuji, maid café, Den Den Town'
d['titleJa'] = '江戸三 → 金閣寺 → めいどりーみん → 日本橋オタロード'
d['romaji'] = 'Edosan → Kinkakuji → Meidorīmin → Nipponbashi'
d['stops'] = [
    {'place': 'edosan', 'time': '07:30', 'note': 'Breakfast in your room; check out at 09:00.'},
    {'place': 'kinkakuji', 'time': '11:05', 'note': "Gold pavilion, 40 min; snow on the roof if lucky (Aoki's pick)."},
    {'place': 'maidreamin-nipponbashi', 'time': '13:50', 'note': "Late lunch in the maid café, 55 min (Pegasis's pick)."},
    {'place': 'otaroad', 'time': '14:50', 'note': 'Figures, retro games, Animate, Melonbooks, 1 h 30.'},
    {'place': 'dormy-namba', 'time': '16:30', 'note': 'Check in again (suitcases are at the front), rest.'},
    {'place': 'kushikatsu-daruma-dotonbori', 'time': '18:30', 'note': 'Dinner: kushikatsu (fried skewers), no second dip in the sauce.'},
]
d['legs'] = [
    T('edosan', 'kinkakuji', 'Walk to Kintetsu-Nara (15 min); Kintetsu Kyoto Line Limited Express, Kintetsu-Nara about 09:25 → Kyoto 10:00; Kyoto City Bus 205, Kyoto Station about 10:15 → Kinkakuji-michi 10:55; walk 5 min', '1 h 50', 'bus'),
    T('kinkakuji', 'maidreamin-nipponbashi', 'Kyoto City Bus 205, Kinkakuji-michi about 11:50 → Kyoto Station 12:30; JR Kyoto Line Special Rapid, Kyoto about 12:45 → Osaka 13:14; Midosuji Line, Umeda about 13:20 → Namba 13:28; walk 12 min', '1 h 50'),
    W('maidreamin-nipponbashi', 'otaroad', dur='2 min'),
    W('otaroad', 'dormy-namba', 'Walk north-west', '12 min'),
    W('dormy-namba', 'kushikatsu-daruma-dotonbori', dur='10 min'),
    W('kushikatsu-daruma-dotonbori', 'dormy-namba', dur='10 min'),
]
d['notes'] = ["Kinkakuji is Aoki's want, Den Den Town too; the maid café is Pegasis's.",
              'Kyoto bus 205 can be slow and full: a taxi from Kyoto Station takes about 25 min (≈ ¥3,000).',
              'Buy an onigiri at Kyoto Station if you are hungry before the late lunch.']
d['cost'] = '≈ ¥8,000 per person (Kintetsu limited express ¥1,280, bus and JR about ¥1,200, Kinkakuji ¥500, maid café, dinner); goods extra'
d['sleepNote'] = 'Dormy Inn again, 2 more nights.'

# ---------- Day 9: Matsusaka beef dinner
d = day[9]
for s in d['stops']:
    if s['place'] == 'mizuno-dotonbori':
        s['place'] = 'matsusaka-m'
        s['time'] = '18:30'
        s['note'] = 'Dinner: top Matsusaka beef grilled at your table, the special meal of the trip (booked on TableCheck).'
for l in d['legs']:
    if l['to'] == 'mizuno-dotonbori': l['to'] = 'matsusaka-m'; l['label'] = 'Walk to Hozenji Yokocho'; l['duration'] = '5 min'
    if l['from'] == 'mizuno-dotonbori': l['from'] = 'matsusaka-m'
d['summary'] = d['summary'].replace('okonomiyaki on Dotonbori', 'Matsusaka beef yakiniku in Hozenji Yokocho')
d['title'] = 'Kuromon breakfast, Liberty Walk JDM park, Matsusaka beef dinner'
d['titleJa'] = d['titleJa'].replace('道頓堀', '法善寺横丁')
d['cost'] = '≈ ¥20,000 per person (JR + taxi about ¥2,500, market food, udon, Matsusaka beef ¥11,880 + drinks)'

# ---------- Day 14: slow Sapporo day
d = day[14]
d.update({
    'short': 'Slow Sapporo', 'cover': 'maruyama-zoo',
    'title': 'A slow day: Maruyama Zoo, miso ramen, Tanukikoji goods, last shopping',
    'titleJa': '円山動物園 → 狸小路 → すすきの',
    'romaji': 'Maruyama Dōbutsuen → Tanukikōji → Susukino',
    'summary': 'A late breakfast, then polar bears and penguins at Sapporo\'s own zoo, 20 min away. Miso ramen, the anime shops in the covered Tanukikoji arcade, a rest, soup curry number two and the last tax-free shopping.',
    'temp': '−8 – −2 °C',
    'alerts': ['Laundry night 4: clean clothes for the flights.'],
    'stops': [
        {'place': 'route-inn-sapporo', 'time': '08:30', 'note': 'Breakfast: free hotel buffet (06:30–09:30), a slow morning.'},
        {'place': 'maruyama-zoo', 'time': '10:15', 'note': 'Polar Bear House (underwater view), seals, penguins in the waterbird house, 2 h (Pegasis wanted the penguins).'},
        {'place': 'yoshiyama-tanukikoji', 'time': '12:45', 'note': 'Lunch: roasted-sesame miso ramen, 40 min.'},
        {'place': 'tanukikoji', 'time': '13:30', 'note': 'Mandarake and the anime goods shops in the covered arcade, 1 h 30.'},
        {'place': 'route-inn-sapporo', 'time': '15:15', 'note': 'Rest; laundry.'},
        {'place': 'sho-rin', 'time': '18:30', 'note': 'Dinner: soup curry number two, to compare.'},
        {'place': 'mega-donki-sapporo', 'time': '19:45', 'note': 'Last tax-free shopping; Pegasis fills and weighs the suitcase.'},
    ],
    'legs': [
        T('route-inn-sapporo', 'maruyama-zoo', 'Walk to Susukino (3 min); Namboku Line, Susukino about 09:45 → Odori; Tozai Line, Odori about 09:52 → Maruyama-koen 09:57; JR bus 円15 or walk 15 min', '30 min'),
        T('maruyama-zoo', 'yoshiyama-tanukikoji', 'Walk or bus to Maruyama-koen; Tozai Line, Maruyama-koen about 12:25 → Odori 12:30; walk south to Tanukikoji 5-chome', '30 min'),
        W('yoshiyama-tanukikoji', 'tanukikoji', dur='2 min'),
        W('tanukikoji', 'route-inn-sapporo', dur='10 min'),
        W('route-inn-sapporo', 'sho-rin', dur='5 min'),
        W('sho-rin', 'mega-donki-sapporo', 'Walk north to Tanukikoji', '8 min'),
        W('mega-donki-sapporo', 'route-inn-sapporo', dur='10 min'),
    ],
    'notes': [
        'The Teine ski day is out: this is the rest day of the trip before the flights.',
        'Maruyama Zoo is open on Monday Feb 1 (closed only 2nd and 4th Wednesdays).',
        'SHO-RIN is open on Monday (Tabelog, official site); irregular closed days: backup Soup Curry Suage+ (Minami 4-jo Nishi 5).',
        'Tax-free: from Nov 2026 you pay tax in the shop and get it back at the airport customs desk: keep goods and receipts together.',
    ],
    'cost': '≈ ¥6,500 per person (subway ¥500, zoo ¥800, meals); goods extra',
})

# ---------- Sleep notes for the split Dormy stay
day[5]['sleepNote'] = 'Dormy Inn night 1 of 2 (then the ryokan, then 2 more nights).'
day[6]['sleepNote'] = 'Dormy Inn night 2 of 2 before the ryokan.'
day[9]['sleepNote'] = 'Dormy Inn, last night in Osaka.'

# ---------- Top level
p['tagline'] = 'Always together: one short Hakone–Fuji car trip from Kawasaki to Mishima, an Osaka hotel with a ryokan night in Nara Park, and 5 nights in Hokkaido.'
p['summary'] = ('3 nights in Shinjuku with a full anime day and a Girls Band Cry day in Kawasaki, where Pegasis picks up a car for Yokohama Chinatown, Daikoku, the Turnpike and Fuji. '
                'One Fuji-view villa night, then the car goes back at Mishima and a direct Kodama takes you to Osaka for Nara, Suzuka, Kyoto, Den Den Town and Liberty Walk, '
                'with one ryokan night inside Nara Park and a Matsusaka beef dinner. A JAL flight to Hokkaido: 3 nights in Kutchan for skiing (Pegasis teaches Aoki) and the Rusutsu drift course, '
                '2 nights in Sapporo with a slow last day. You do everything together, every meal has a named place, and every train and bus has its departure time. '
                'Pegasis brings his own winter clothes; ski wear is rented at Hirafu; gloves and goggles are bought in Kutchan.')
w = p['who']
w['aoki'] = w['aoki'].replace('two and a half ski days (a full and a half day at Niseko, a full day at Teine)', 'one and a half ski days at Niseko')
w['pegasis'] = w['pegasis'].replace('(5 h of travel; a Teine ski day instead)', '(5 h of travel; Maruyama Zoo in Sapporo has penguins too)')
c = p['cost']
c['hotels'] = c['hotels'].replace('≈ ¥154,500 per person', '≈ ¥175,000 per person').replace('Dormy Inn PREMIUM Namba 5 nights ≈ ¥50,000 not checked', 'Dormy Inn PREMIUM Namba 4 nights ≈ ¥40,000 not checked; Edosan ryokan hot-pot plan ¥30,800')
c['transport'] = c['transport'].replace('Teine JR + bus ¥2,720', 'Nara and Kyoto trains for the ryokan night ≈ ¥1,500')
c['activities'] = c['activities'].replace('Teine day ≈ ¥25,500 each (lift ¥5,700 + rental with wear ¥16,500 + helmet ¥3,300); ', '').replace('≈ ¥115,000 Pegasis / ¥95,000 Aoki', '≈ ¥90,000 Pegasis / ¥70,000 Aoki').replace(', Moiwa', ', Moiwa, Maruyama Zoo ¥800')
c['total'] = c['total'].replace('≈ ¥395,000 Pegasis / ¥375,000 Aoki', '≈ ¥399,000 Pegasis / ¥379,000 Aoki').replace('(≈ ¥75,000;', '(≈ ¥75,000, plus the Matsusaka beef dinner ≈ ¥12,000;')

bf = p['bookFirst']
for x in bf:
    if x['what'].startswith('Dormy Inn PREMIUM Namba'):
        x['what'] = 'Dormy Inn PREMIUM Namba, twin: Jan 23–25 (2 nights) and Jan 26–28 (2 nights)'
        x['why'] = x['why'] + ' Ask them to keep your suitcases on Jan 25 while you sleep at the ryokan.'
bf.insert(0, {'what': 'Edosan ryokan, Nara Park, Mon Jan 25, 2 people, "Wakakusa nabe" hot-pot plan (¥61,600 with dinner and breakfast)',
              'why': 'book now: only 1 room was left on Rakuten on Sep 26, 2026. Write "no raw fish, cooked food only" in the note.'})
bf.append({'what': 'Matsusaka beef yakiniku "M" Hozenji Yokocho, Wed Jan 27, 18:30, 2 people', 'why': 'book on TableCheck when January opens (usually 1–2 months ahead).'})

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
order = [x['id'] for x in p['places']] + [k for k in places if k not in [x['id'] for x in p['places']]]
print('dropped:', [i for i in order if i not in used])
p['places'] = [places[i] for i in order if i in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
