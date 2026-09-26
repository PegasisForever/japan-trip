"""Plan A changes from Pegasis (Sep 26, 2026): Nara morning on day 7 instead of the Sabbat look-only stops,
the Osaka day split over days 8 and 9 instead of Kobe, and a Sapporo Teine ski day instead of Asahiyama Zoo."""
import json

P = 'src/data/plans/a.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
day = {d['n']: d for d in p['days']}
ganko = next(x for x in json.load(open('src/data/plans/c.json'))['places'] if x['id'] == 'ganko-nara')

def W(a, b, label='Walk', dur='5 min'):
    return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}

new_places = [
    {'id': 'nara-park', 'ref': 'nara-park-todaiji', 'en': 'Nara Park deer', 'ja': '奈良公園', 'romaji': 'Nara Kōen',
     'lat': 34.6851, 'lon': 135.8430, 'kind': 'sight',
     'blurb': 'About 1,300 free-roaming deer on open grass between Kofukuji and Kasuga Taisha. Buy crackers and the deer bow to you for them.',
     'info': [{'label': 'Hours', 'value': 'Open all the time, free'}, {'label': 'Deer crackers', 'value': 'About ¥200 a pack (shika senbei)'}],
     'tips': ['Show empty hands when the crackers are finished, or the deer keep pushing.', 'Deer bite paper: keep maps and tickets in a pocket.']},
    {'id': 'kasuga-taisha', 'ref': None, 'en': 'Kasuga Taisha', 'ja': '春日大社', 'romaji': 'Kasuga Taisha',
     'lat': 34.68146, 'lon': 135.84835, 'kind': 'sight',
     'blurb': 'A red shrine in the forest at the east end of Nara Park, with about 3,000 stone and bronze lanterns along its paths. Deer walk the approach with you.',
     'info': [{'label': 'Hours', 'value': 'Gates 6:00–18:00; main hall area 7:00–17:00 (Nov–Feb)'}, {'label': 'Price', 'value': 'Grounds free; inner area ¥700 (9:00–16:00)'}],
     'tips': ['The lantern path from the park is the best part: 20 min each way.']},
    ganko,
    {'id': 'teine', 'ref': 'hok-other-ski-areas', 'en': 'Sapporo Teine, Olympia zone', 'ja': 'サッポロテイネ オリンピアゾーン', 'romaji': 'Sapporo Teine Orinpia Zōn',
     'lat': 43.0905, 'lon': 141.2126, 'kind': 'ski',
     'blurb': 'The 1972 Olympic ski area 40 min from Sapporo, with sea views over Ishikari Bay. The lower Olympia zone has wide easy runs and a moving walkway for beginners.',
     'info': [{'label': 'Lift ticket', 'value': '1 day ¥5,700 online / ¥6,700 at the counter (2025-26 price)'},
              {'label': 'Rental', 'value': 'Ski set + ski wear, 1 day ≈ ¥16,500 (2025-26 price)'},
              {'label': 'Night ski', 'value': '16:00–20:00'}],
     'tips': ['2026-27 prices come out in autumn: check sapporo-teine.com.', 'Bring your own gloves and goggles from Niseko.']},
]
for x in new_places:
    places[x['id']] = x

# ---- Day 5: note only
day[5]['notes'] = [n for n in day[5]['notes']] + ['More time with the deer on Mon Jan 25 (day 7) in the morning.']

# ---- Day 7: Nara morning, Fushimi Inari, Kinkakuji
d = day[7]
d.update({
    'short': 'Nara + Kyoto', 'cover': 'nara-park',
    'title': 'Nara deer in the morning, then Fushimi Inari and Kinkakuji',
    'titleJa': '奈良公園 → 春日大社 → 伏見稲荷大社 → 金閣寺',
    'romaji': 'Nara Kōen → Kasuga Taisha → Fushimi Inari → Kinkakuji',
    'summary': 'A full morning with the deer in Nara Park and the lantern paths of Kasuga Taisha, lunch in Nara, then one direct JR train to Fushimi Inari. Kinkakuji before it closes, and back in Namba for izakaya dinner.',
    'alerts': ['Leave the hotel at 08:15.', 'JR Nara 12:37 is the train to catch (Miyakoji Rapid, no change).', 'Laundry night 2 at the hotel.'],
    'stops': [
        {'place': 'matsuya-nipponbashi', 'time': '07:45', 'note': 'Breakfast: gyudon or a breakfast set, 20 min.'},
        {'place': 'nara-park', 'time': '09:20', 'note': 'Deer and crackers in the open park, 1 h (both of you wanted the deer).'},
        {'place': 'kasuga-taisha', 'time': '10:30', 'note': 'The lantern paths and the red shrine, deer on the way, 1 h.'},
        {'place': 'ganko-nara', 'time': '11:45', 'note': 'Lunch: tonkatsu set, 35 min. Leave at 12:20.'},
        {'place': 'fushimi-inari', 'time': '13:25', 'note': 'Torii tunnels, 1 h: go up to the first viewpoint and back.'},
        {'place': 'kinkakuji', 'time': '15:15', 'note': 'Gold pavilion, 40 min (last entry 16:30).'},
        {'place': 'dormy-namba', 'time': '17:50', 'note': 'Rest and laundry.'},
        {'place': 'hitomebore-uranamba', 'time': '18:45', 'note': 'Dinner: skewers and cheap drinks.'},
    ],
    'legs': [
        W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
        {'from': 'matsuya-nipponbashi', 'to': 'nara-park', 'mode': 'train',
         'label': 'Walk to Kintetsu-Nippombashi (5 min); Kintetsu Nara Line Rapid Express, Kintetsu-Nippombashi 08:36 → Kintetsu-Nara 09:11 (¥680); walk 8 min',
         'duration': '50 min'},
        W('nara-park', 'kasuga-taisha', 'Walk east on the lantern path', '20 min'),
        W('kasuga-taisha', 'ganko-nara', 'Walk back west to Higashimuki', '25 min'),
        {'from': 'ganko-nara', 'to': 'fushimi-inari', 'mode': 'train',
         'label': 'Walk to JR Nara (15 min); JR Nara Line Miyakoji Rapid, Nara 12:37 → Inari 13:19 (no change, ¥680)',
         'duration': '1 h'},
        {'from': 'fushimi-inari', 'to': 'kinkakuji', 'mode': 'bus',
         'label': 'JR Nara Line, Inari about 14:30 → Kyoto 14:35; JR Sagano Line, Kyoto about 14:43 → Emmachi 14:50; Kyoto City Bus 205, Nishinokyo-Emmachi about 14:57 → Kinkakuji-michi 15:06; walk 5 min',
         'duration': '45 min'},
        {'from': 'kinkakuji', 'to': 'dormy-namba', 'mode': 'train',
         'label': 'Kyoto City Bus 205, Kinkakuji-michi about 16:00 → Kyoto Station 16:40; JR Kyoto Line Special Rapid, Kyoto about 16:50 → Osaka 17:19; Midosuji Line, Umeda about 17:25 → Namba 17:34; walk 10 min',
         'duration': '1 h 45'},
        W('dormy-namba', 'hitomebore-uranamba', dur='8 min'),
        W('hitomebore-uranamba', 'dormy-namba', dur='8 min'),
    ],
    'notes': [
        'The Sabbat of the Witch places in Kyoto (concert hall, Sanjo arcade, station stairs) are out: they are only for looking.',
        'Fushimi Inari is open all the time, so the afternoon is fine; Kinkakuji closes at 17:00.',
        'Kyoto bus times are from the current timetable; check them on Jorudan the day before.',
    ],
    'cost': '≈ ¥8,000 per person (trains and buses about ¥2,800, deer crackers ¥200, Kinkakuji ¥500, meals)',
})

# ---- Day 8: first calm Osaka day (Otaroad, maid café, Umeda)
d = day[8]
d.update({
    'short': 'Osaka goods', 'cover': 'otaroad',
    'title': 'Slow morning, Den Den Town and a maid café, Pokémon and Nintendo in Umeda',
    'titleJa': '日本橋オタロード → めいどりーみん → 梅田（大丸・グランフロント）',
    'romaji': 'Nipponbashi → Meidorīmin → Umeda',
    'summary': 'A slow start with the hotel buffet. Anime and game shops on Otaroad, a maid café lunch with a stage show, a rest at the hotel, then Pokémon Center and Nintendo OSAKA in Umeda and standing kushikatsu.',
    'alerts': ['Phone LB DRIVE-IN today to confirm Wednesday hours and ask about a taxi from Izumi-Sunagawa.'],
    'stops': [
        {'place': 'dormy-namba', 'time': '08:30', 'note': 'Breakfast: the hotel buffet once (¥2,500, crab chirashi), a slow morning.'},
        {'place': 'otaroad', 'time': '11:00', 'note': 'Figures, retro games, Animate, Melonbooks.'},
        {'place': 'maidreamin-nipponbashi', 'time': '12:30', 'note': 'Lunch in the maid café, 55 min.'},
        {'place': 'dormy-namba', 'time': '14:00', 'note': 'Drop the goods, rest.'},
        {'place': 'grand-front', 'time': '16:00', 'note': 'Pokémon Center and Nintendo OSAKA (Daimaru Umeda 13F, close 20:00), then Grand Front shops.'},
        {'place': 'matsuba-umeda', 'time': '18:30', 'note': 'Dinner: standing kushikatsu, 45 min.'},
    ],
    'legs': [
        W('dormy-namba', 'otaroad', 'Walk south-east', '12 min'),
        W('otaroad', 'maidreamin-nipponbashi', dur='2 min'),
        W('maidreamin-nipponbashi', 'dormy-namba', dur='12 min'),
        {'from': 'dormy-namba', 'to': 'grand-front', 'mode': 'train',
         'label': 'Walk to Namba (10 min); Midosuji Line, Namba about 15:40 → Umeda 15:48; walk 5 min', 'duration': '25 min'},
        W('grand-front', 'matsuba-umeda', 'Walk under the JR tracks to Shin-Umeda Shokudogai', '8 min'),
        {'from': 'matsuba-umeda', 'to': 'dormy-namba', 'mode': 'train',
         'label': 'Midosuji Line, Umeda about 19:30 → Namba 19:38; walk 10 min', 'duration': '25 min'},
    ],
    'notes': ['Den Den Town is Aoki\'s want; the maid café is Pegasis\'s.', 'Kobe is out: nobody picked it.'],
    'cost': '≈ ¥9,000 per person (subway ¥580, hotel breakfast ¥2,500, maid café, dinner); goods extra',
})

# ---- Day 9: Kuromon, Liberty Walk with the udon lunch, Dotonbori
d = day[9]
d.update({
    'short': 'Liberty Walk',
    'title': 'Kuromon breakfast, Liberty Walk JDM park, okonomiyaki in Dotonbori',
    'titleJa': '黒門市場 → LB DRIVE-IN（泉南）→ 道頓堀',
    'romaji': 'Kuromon → Sennan → Dōtonbori',
    'summary': 'Kuromon Market as breakfast, then the Liberty Walk JDM park in Sennan with an udon lunch there. Back early to pack, then the Glico sign and okonomiyaki on Dotonbori.',
    'stops': [
        {'place': 'kuromon', 'time': '09:30', 'note': 'Breakfast by grazing: grilled scallops, wagyu skewers, fruit.'},
        {'place': 'lb-drive-in', 'time': '12:00', 'note': 'Lunch: Sanuki udon in the park (Wed 11:00–15:00), then LB wide-body cars and goods, 2 h.'},
        {'place': 'dormy-namba', 'time': '15:45', 'note': 'Rest and pack for the flight.'},
        {'place': 'ebisubashi', 'time': '17:50', 'note': 'Glico sign and the canal at night.'},
        {'place': 'mizuno-dotonbori', 'time': '18:15', 'note': 'Dinner: okonomiyaki cooked in front of you.'},
    ],
    'legs': [
        W('dormy-namba', 'kuromon', dur='5 min'),
        {'from': 'kuromon', 'to': 'lb-drive-in', 'mode': 'train',
         'label': 'Walk to Ebisucho (12 min); Sakaisuji Line, Ebisucho about 10:45 → Dobutsuen-mae 10:46; JR Hanwa Line Kishuji Rapid, Shin-Imamiya about 10:52 → Hineno, local train on to Izumi-Sunagawa about 11:45; taxi 5 min',
         'duration': '1 h 10'},
        {'from': 'lb-drive-in', 'to': 'dormy-namba', 'mode': 'train',
         'label': 'Taxi (ask the shop to call one) or walk 22 min to Izumi-Sunagawa; JR Hanwa Line Kishuji Rapid, Izumi-Sunagawa about 14:20 → Shin-Imamiya 15:12; JR Yamatoji Line, Shin-Imamiya 15:15 → JR Namba 15:19; walk 12 min',
         'duration': '1 h 30'},
        W('dormy-namba', 'ebisubashi', dur='10 min'),
        W('ebisubashi', 'mizuno-dotonbori', dur='3 min'),
        W('mizuno-dotonbori', 'dormy-namba', dur='10 min'),
    ],
    'notes': [
        'Kuromon and Liberty Walk are Aoki\'s wants.',
        'The udon shop at LB DRIVE-IN is open only 11:00–15:00; the park is closed on Thursday.',
        'JR Hanwa Line times are from the current timetable; check them on Jorudan the day before.',
        'JAL includes a 20 kg checked bag each: Pegasis\'s suitcase flies free tomorrow.',
    ],
    'cost': '≈ ¥8,000 per person (JR + taxi about ¥2,500, market food, udon, dinner)',
})

# ---- Day 14: Teine ski day
d = day[14]
d.update({
    'short': 'Teine ski', 'cover': 'teine',
    'title': 'Ski day at Sapporo Teine, last shopping',
    'titleJa': 'サッポロテイネ → すすきの',
    'romaji': 'Sapporo Teine → Susukino',
    'summary': 'A third ski day for Aoki, 1 hour from the hotel by JR and bus: the easy Olympia runs with a sea view. Back in Sapporo by 17:00 for soup curry number two, the last tax-free shopping and the last laundry.',
    'alerts': ['Leave the hotel at 07:35.', 'Take your gloves and goggles from Niseko.', 'Laundry night 4: clean clothes for the flights.'],
    'stops': [
        {'place': 'route-inn-sapporo', 'time': '07:00', 'note': 'Breakfast: free hotel buffet (06:30–09:30).'},
        {'place': 'teine', 'time': '08:50', 'note': 'Rent skis, boots and ski wear for both; buy 1-day lift tickets. Aoki starts on the beginner area with the moving walkway.'},
        {'place': 'teine', 'time': '12:00', 'note': 'Lunch: the base lodge restaurant in the Olympia zone, 50 min.'},
        {'place': 'teine', 'time': '13:00', 'note': 'Afternoon runs together; return the gear by 15:30.'},
        {'place': 'route-inn-sapporo', 'time': '17:00', 'note': 'Rest; laundry.'},
        {'place': 'sho-rin', 'time': '18:30', 'note': 'Dinner: soup curry number two, to compare.'},
        {'place': 'mega-donki-sapporo', 'time': '19:45', 'note': 'Last tax-free shopping; Pegasis fills and weighs the suitcase.'},
    ],
    'legs': [
        {'from': 'route-inn-sapporo', 'to': 'teine', 'mode': 'bus',
         'label': 'Walk to Susukino (3 min); Namboku Line, Susukino about 07:40 → Sapporo 07:44; JR Hakodate Line, Sapporo about 07:58 → Teine 08:09 (¥360); JR Hokkaido Bus, Teine Station about 08:20 → Sapporo Teine Olympia 08:36 (¥1,000)',
         'duration': '1 h'},
        {'from': 'teine', 'to': 'route-inn-sapporo', 'mode': 'bus',
         'label': 'JR Hokkaido Bus, Sapporo Teine about 15:50 → Teine Station 16:06; JR Hakodate Line, Teine about 16:15 → Sapporo 16:26; Namboku Line, Sapporo → Susukino; walk 3 min',
         'duration': '1 h'},
        W('route-inn-sapporo', 'sho-rin', dur='5 min'),
        W('sho-rin', 'mega-donki-sapporo', 'Walk north to Tanukikoji', '8 min'),
        W('mega-donki-sapporo', 'route-inn-sapporo', dur='10 min'),
    ],
    'notes': [
        'Asahiyama Zoo is out: about 5 h on trains and buses for one penguin walk.',
        'Teine rents ski wear too, so you need no own ski clothes. Prices on this page are 2025-26; 2026-27 prices come out in autumn.',
        'Bus times are from the current timetable; the winter bus timetable comes out in November.',
        'SHO-RIN is open on Monday (Tabelog, official site); irregular closed days: backup Soup Curry Suage+ (Minami 4-jo Nishi 5).',
        'Tax-free: from Nov 2026 you pay tax in the shop and get it back at the airport customs desk: keep goods and receipts together.',
    ],
    'cost': '≈ ¥30,000 per person (JR + bus ¥2,720, lift ¥5,700, rental with wear ≈ ¥16,500, meals)',
})

# ---- Top level texts
p['tagline'] = p['tagline']
p['summary'] = p['summary'].replace('for Nara, Suzuka, Kyoto, Kobe and Liberty Walk', 'for Nara, Suzuka, Kyoto, Den Den Town and Liberty Walk') \
    .replace('2 nights in Sapporo with the Asahiyama penguins', '2 nights in Sapporo with a third ski day at Teine')
w = p['who']
w['pegasis'] = w['pegasis'].replace('Asahiyama penguins, ', '').replace('Out: Onuma', 'Out: Asahiyama penguins (5 h of travel; a Teine ski day instead), Onuma') \
    .replace('Kobe beef, ', '')
w['aoki'] = w['aoki'].replace('Sabbat places (Kyoto, Osaka, Kobe)', 'the Sabbat date mall in Umeda (the Kyoto and Kobe Sabbat places are only for looking, so they are out)') \
    .replace('two Niseko ski days', 'three ski days (two at Niseko, one at Teine)') \
    .replace("Kobe's Nankinmachi instead", 'no Chinatown now')
c = p['cost']
c['transport'] = c['transport'].replace('Asahikawa JR ¥10,880 + zoo buses ¥1,340', 'Teine JR + bus ¥2,720')
c['activities'] = c['activities'].replace('lift tickets peak season 1 day ¥11,800 × 2 each', 'lift tickets peak season 1 day ¥11,800 × 2 each; Teine day ≈ ¥22,200 each (lift ¥5,700 + rental with wear ≈ ¥16,500)') \
    .replace('Port Tower ¥1,200, ', '').replace(', zoo', '')
for x in p['bookFirst']:
    x['what'] = x['what']
p['bookFirst'] = [x for x in p['bookFirst'] if 'Port Tower' not in x['what']]

# ---- places: drop the ones no day uses
used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
order = [x['id'] for x in p['places']] + [x['id'] for x in new_places if x['id'] not in [y['id'] for y in p['places']]]
dropped = [i for i in order if i not in used]
p['places'] = [places[i] for i in order if i in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
print('dropped places:', dropped)
