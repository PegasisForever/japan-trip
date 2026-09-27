"""Sep 26 2026 (5): later mornings. Leave the hotel at about 10:00 on most days; Chureito and the day 8 kushikatsu go."""
import json
P = 'src/data/plan.json'
p = json.load(open(P))
places = {x['id']: x for x in p['places']}
D = {d['n']: d for d in p['days']}
def W(a, b, label='Walk', dur='5 min'): return {'from': a, 'to': b, 'mode': 'walk', 'label': label, 'duration': dur}
def T(a, b, label, dur, mode='train'): return {'from': a, 'to': b, 'mode': mode, 'label': label, 'duration': dur}
def S(place, time, note): return {'place': place, 'time': time, 'note': note}
def setstop(d, place, time=None, note=None, nth=0):
    k = [s for s in d['stops'] if s['place'] == place][nth]
    if time: k['time'] = time
    if note: k['note'] = note

places['ramen-koji'] = {'id': 'ramen-koji', 'ref': None, 'en': 'Kyoto Ramen Koji, Kyoto Station', 'ja': '京都拉麺小路', 'romaji': 'Kyōto Rāmen Kōji',
    'lat': 34.98530, 'lon': 135.75860, 'kind': 'food',
    'blurb': 'A floor of ramen shops from all over Japan on the 10th floor of the Kyoto Station building. Buy a ticket at the machine, sit, eat.',
    'info': [{'label': 'Hours', 'value': 'About 11:00–22:00 (shops vary)'}, {'label': 'Cost', 'value': 'About ¥1,000–1,500'}],
    'tips': ['Take the escalators on the west side of the Station building up to 10F.']}

# ---------- Day 2: start 10:00
d = D[2]
d['stops'] = [
    S('hotel-super-shinjuku', '09:00', 'Breakfast: free hotel buffet (07:00–09:00), no rush.'),
    S('suga', '10:20', "Your Name stairs, 15 min (Aoki's pick)."),
    S('tmg', '11:00', 'Free 45th-floor view; Mt Fuji if it is clear, 30 min (both of you wanted it).'),
    S('radio-kaikan', '12:05', '10 floors of figures and cards, 45 min; ZEST (Oshi no Ko) 3 min north.'),
    S('maidreamin-akiba', '12:55', "Lunch with the stage show, 55 min (Pegasis's pick)."),
    S('ikebukuro', '14:20', 'Animate main store, Surugaya, K-BOOKS, Lashinbang (used goods), 55 min.'),
    S('nakano', '15:40', 'Mandarake and used goods, 1 h 10.'),
    S('shimokita', '17:20', 'Bocchi places in the dark streets, 15 min.'),
    S('mintei-shimokita', '17:35', 'Dinner: pink fried rice or ramen + fried rice set, 40 min.'),
    S('shelter', '18:30', 'Real live show, standing. Recent shows: OPEN 18:15–19:00, START 18:45–19:30.'),
]
d['legs'] = [
    T('hotel-super-shinjuku', 'suga', 'Walk to Shinjuku-sanchome (10 min); Tokyo Metro Marunouchi Line, Shinjuku-sanchome about 10:06 → Yotsuya-sanchome 10:09; walk 8 min', '25 min'),
    T('suga', 'tmg', 'Walk to Yotsuya-sanchome (8 min); Marunouchi Line, Yotsuya-sanchome about 10:45 → Nishi-Shinjuku 10:52; walk 8 min', '25 min'),
    T('tmg', 'radio-kaikan', 'Toei Oedo Line, Tochomae about 11:35 → Ueno-okachimachi 11:54; JR Yamanote Line, Okachimachi → Akihabara 12:00', '35 min'),
    W('radio-kaikan', 'maidreamin-akiba', 'Walk along Chuo-dori'),
    T('maidreamin-akiba', 'ikebukuro', 'JR Yamanote Line, Akihabara about 13:55 → Ikebukuro 14:15 (east exit)', '25 min'),
    T('ikebukuro', 'nakano', 'JR Saikyo Line, Ikebukuro about 15:20 → Shinjuku 15:26; JR Chuo Line Special Rapid, Shinjuku 15:30 → Nakano 15:35 (north exit)', '20 min'),
    T('nakano', 'shimokita', 'JR Chuo Line Rapid, Nakano about 17:00 → Shinjuku 17:05; Odakyu Line Rapid Express, Shinjuku 17:10 → Shimokitazawa 17:18', '20 min'),
    W('shimokita', 'mintei-shimokita', dur='3 min'), W('mintei-shimokita', 'shelter', dur='3 min'),
    T('shelter', 'hotel-super-shinjuku', 'Odakyu Line Rapid Express, Shimokitazawa 21:30 → Shinjuku 21:38 (every 10 min); walk 12 min', '25 min'),
]

# ---------- Day 3: breakfast later, leave 09:45
setstop(D[3], 'hotel-super-shinjuku', '08:45', 'Breakfast: free hotel buffet. 09:30: hand both suitcases to the front for Yamato to Osaka.')

# ---------- Day 4: leave 09:30; Lake Kawaguchi moves to day 5 morning
d = D[4]
d['stops'] = [
    S('hotel-super-shinjuku', '08:30', 'Breakfast: hotel buffet, 30 min.'),
    S('enoshima', '11:00', "Aoki's pick, 1 h: park near Enoden Enoshima Station, see the island from the bridge, then Enoden 2 stops to the Slam Dunk crossing and back."),
    S('taikanzan', '13:20', "Up the Turnpike (Pegasis drives, his pick): Fuji behind Lake Ashi (Evangelion's Tokyo-3, Aoki's pick)."),
    S('taikanzan-sky-lounge', '13:25', 'Lunch: ramen or soba with the view, 40 min.'),
    S('otome', '14:45', 'Fuji view from the pass rest stop, 10 min.'),
    S('gotemba', '15:10', "Outlets with Fuji behind, 45 min (Pegasis's pick)."),
    S('fuji-motorsports', '16:10', "Race-car museum until it closes at 17:00, 50 min (Aoki's pick)."),
    S('hanz', '17:45', 'Check in (late check-in agreed by phone).'),
    S('hanz', '18:30', 'Dinner: BBQ course on the villa terrace (or the no-grill dining course).'),
]
d['legs'] = [
    T('hotel-super-shinjuku', 'enoshima', 'Drive, Shuto Route 3 → Tomei → Route 467 to a coin car park near Enoden Enoshima Station (leave 09:30)', '1 h 30', 'drive'),
    T('enoshima', 'taikanzan', 'Drive, Route 134 west → Seisho Bypass → Hakone Turnpike (toll) to Taikanzan', '1 h 20', 'drive'),
    W('taikanzan', 'taikanzan-sky-lounge', 'Walk across the car park', '2 min'),
    T('taikanzan-sky-lounge', 'otome', 'Drive down to Lake Ashi (Moto-Hakone), Route 1 → Sengokuhara → Route 138', '40 min', 'drive'),
    T('otome', 'gotemba', 'Drive down Route 138 to the outlets', '15 min', 'drive'),
    T('gotemba', 'fuji-motorsports', 'Drive, Route 401 → Oyama to Fuji Speedway', '15 min', 'drive'),
    T('fuji-motorsports', 'hanz', 'Drive, Route 138 over Kagosaka Pass → Higashi-Fuji-goko Road → Katsuyama (dark from 17:15: drive slowly)', '45 min', 'drive'),
]
d['alerts'] = ['Leave Shinjuku at 09:30.', 'Studless tyres: Turnpike, Otome and Kagosaka Pass can be icy.',
               'Phone Hanz (0555-72-8282) when you book: tell them you arrive about 17:45 (some sites say last check-in 17:00).']
d['notes'] = [n for n in d['notes'] if not n.startswith('One plan for both')] + [
    "Lake Kawaguchi is tomorrow morning (Fuji is clearest then); tonight you see Fuji from the villa.",
    "Enoshima, the museum and Lake Kawaguchi are Aoki's wants; the Turnpike, Taikanzan, Otome and the outlets are Pegasis's."]
d['title'] = 'Enoshima, Hakone Turnpike, Otome Pass, outlets and car museum, Fuji-view villa'
d['titleJa'] = '江の島 → 大観山 → 乙女峠 → 御殿場 → 富士モータースポーツミュージアム → 河口湖'
d['romaji'] = 'Enoshima → Taikanzan → Otome-tōge → Gotenba → Oyama → Kawaguchiko'
d['summary'] = 'A late start and a coast-to-Fuji drive: Enoshima for Aoki, the Turnpike and the passes for Pegasis, the outlets and the race-car museum. A BBQ dinner at the Fuji-view villa.'

# ---------- Day 5: no Chureito; Lake Kawaguchi and Koan; Kodama about 11:54
d = D[5]
d['stops'] = [
    S('hanz', '08:00', 'Breakfast: the skillet set, cooked at the villa.'),
    S('lake-kawaguchi', '09:15', "Fuji across the lake in the clear morning, 25 min (Aoki's pick)."),
    S('koan', '10:00', "Yuru Camp ep 1 view of Fuji (the ¥1,000 note), 15 min (Aoki's pick)."),
    S('toyota-mishima', '11:35', 'Return the car with a full tank.'),
    S('tochuken-mishima', '11:45', 'Lunch: buy the Ashitaka beef sukiyaki bento on the platform; eat it on the train.'),
    S('dormy-namba', '15:15', 'Your suitcases are here. Check in and rest until 16:00.'),
    S('sukiya-kintetsu-nara', '16:50', 'Early dinner: a quick hot beef bowl before the cold wait.'),
    S('tobihino', '17:45', 'Stand in the field: fireworks 18:15, hill fire 18:30.'),
]
L = [l for l in d['legs'] if l['from'] not in ('hanz', 'chureito', 'koan', 'tochuken-mishima')]
d['legs'] = [
    T('hanz', 'lake-kawaguchi', 'Drive, Route 139 → lake shore road to the north shore (Oishi Park), leave 09:00', '15 min', 'drive'),
    T('lake-kawaguchi', 'koan', 'Drive, Route 139 west past Aokigahara to Lake Motosu', '35 min', 'drive'),
    T('koan', 'toyota-mishima', 'Drive, Route 139 → Fujinomiya → Nishi-Fuji Road → Shin-Tomei (Shin-Fuji IC → Nagaizumi-Numazu IC) → Mishima; fill the tank near the station', '1 h 20', 'drive'),
    W('toyota-mishima', 'tochuken-mishima', 'Walk into Mishima Station, up to the Shinkansen platform', '8 min'),
    T('tochuken-mishima', 'dormy-namba', 'Tokaido Shinkansen Kodama, Mishima about 11:54 → Shin-Osaka about 14:51 (direct, reserved seats); Midosuji Line, Shin-Osaka about 14:57 → Namba 15:12; walk 10 min', '3 h 30', 'shinkansen'),
] + L
d['alerts'] = ['Leave the villa at 09:00; car back at Mishima by 11:40.', 'Wakakusa Yamayaki: fireworks 18:15, fire 18:30 (cancelled only in bad weather).']
d['notes'] = ['Chureito Pagoda is out: neither of you marked it a want, and it needs an early start.',
              'If you miss the Kodama, the next one is about 1 h later; you then go from Namba straight to Nara.',
              'Train times are from the current timetable; check again in December.',
              'Koan campsite lists ¥600 per car; keep ¥600–1,000 cash.',
              'Todaiji and the deer are on day 7, in daylight: today is only the fire.']
d['title'] = 'Lake Kawaguchi and the Yuru Camp lake, Kodama west, Nara hill fire'
d['titleJa'] = '河口湖 → 本栖湖 → 三島 → なんば → 奈良・若草山焼き'
d['romaji'] = 'Kawaguchiko → Motosuko → Mishima → Namba → Nara'
d['summary'] = 'Fuji across Lake Kawaguchi and at the Yuru Camp lake in the clear morning, the car back at Mishima, then one Kodama to Osaka with a sukiyaki bento. A short rest at the hotel, then the Nara hill fire in the evening.'

# ---------- Day 6: leave 09:15 (the kart runs only about 12:00–13:15)
d = D[6]
d['stops'] = [s for s in d['stops'] if not (s['place'] == 'suzuka' and s['time'] == '10:30')]
setstop(d, 'matsuya-nipponbashi', '08:45', 'Breakfast: gyudon or a breakfast set, 20 min.')
setstop(d, 'suzuka-advenchina', '11:35', 'Lunch: miso ramen or curry in the park, 40 min.')
setstop(d, 'suzuka', '12:20', 'EV kart on the East Course at about 12:30 (Pegasis\'s pick), then the grandstand and pit side; leave 13:30.')
for l in d['legs']:
    if l['to'] == 'suzuka' and l['from'] == 'matsuya-nipponbashi':
        l['to'] = 'suzuka-advenchina'
        l['label'] = 'Walk to Osaka-Namba (Kintetsu, 10 min); Kintetsu limited express, Osaka-Namba about 09:30 → Shiroko about 11:05 (change as Jorudan shows); taxi from Shiroko Station east exit to the circuit (about 10 min, ≈ ¥2,000 per car)'
d['legs'] = [l for l in d['legs'] if not (l['from'] == 'suzuka' and l['to'] == 'suzuka-advenchina')]
d['alerts'] = ['Leave the hotel at 09:15: the kart runs only about 12:00–13:15.'] + d['alerts']

# ---------- Day 7: leave 10:00
d = D[7]
d['stops'] = [
    S('matsuya-nipponbashi', '09:30', 'Breakfast: gyudon or a breakfast set, 20 min.'),
    S('fushimi-inari', '11:00', "Torii tunnels, 1 h 10: up to the first viewpoint and back (Aoki's pick)."),
    S('ganko-nara', '13:20', 'Lunch: tonkatsu set, 40 min.'),
    S('nara-park', '14:15', 'Deer and crackers in the open park, 1 h (both of you wanted the deer).'),
    S('todaiji', '15:25', 'The Great Buddha hall (winter closing about 16:30) and the deer around the gate, 55 min.'),
    S('edosan', '16:45', 'Check in; tea, yukata, a rest. Deer outside the door at dusk.'),
    S('edosan', '18:00', 'Dinner: Wakakusa hot-pot course, served in your room.'),
]
d['legs'] = [
    W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
    T('matsuya-nipponbashi', 'fushimi-inari', 'Walk to Nagahoribashi (8 min); Osaka Metro Sakaisuji Line, Nagahoribashi about 10:05 → Kitahama 10:08; Keihan Limited Express, Kitahama about 10:15 → Tambabashi 10:50; Keihan local, Tambabashi → Fushimi-Inari 10:57', '1 h 5'),
    T('fushimi-inari', 'ganko-nara', 'Walk to JR Inari (3 min); JR Nara Line Miyakoji Rapid, Inari about 12:20 → Nara 13:02 (no change, ¥680); walk 15 min to Higashimuki', '1 h 10'),
    W('ganko-nara', 'nara-park', 'Walk east into the park', '12 min'),
    W('nara-park', 'todaiji', 'Walk north through the park', '10 min'),
    W('todaiji', 'edosan', 'Walk south through the park to the Sagiike pond', '20 min'),
]
d['alerts'] = ['Leave the hotel at 09:30; leave the suitcases at the Dormy Inn front (you are back tomorrow); take one small bag each.',
               'Ryokan: booked the fully cooked hot-pot plan, with "no raw fish" in the note.']
d['summary'] = 'A late start: Fushimi Inari before lunch, then one direct JR train to Nara. Lunch, the deer and the Great Buddha in the afternoon, then your ryokan inside Nara Park: tatami room, yukata and a hot-pot dinner in your room.'

# ---------- Day 8: check out 10:00, Kinkakuji, ramen lunch in Kyoto, Otaroad, maid café dinner
d = D[8]
d['stops'] = [
    S('edosan', '08:30', 'Breakfast in your room; check out at 10:00.'),
    S('kinkakuji', '11:45', "Gold pavilion, 40 min; snow on the roof if lucky (Aoki's pick)."),
    S('ramen-koji', '13:20', 'Lunch: choose a ramen shop on the Kyoto Station 10F floor, 40 min.'),
    S('otaroad', '15:15', "Figures, retro games, Animate, Melonbooks, 1 h 30 (Aoki's pick)."),
    S('dormy-namba', '17:00', 'Check in again (suitcases are at the front), rest.'),
    S('maidreamin-nipponbashi', '18:30', "Dinner in the maid café with the stage show, 1 h (Pegasis's pick)."),
]
d['legs'] = [
    T('edosan', 'kinkakuji', 'Walk to Kintetsu-Nara (15 min); Kintetsu Kyoto Line Limited Express, Kintetsu-Nara about 10:20 → Kyoto 10:55; Kyoto City Bus 205, Kyoto Station about 11:05 → Kinkakuji-michi 11:40; walk 5 min', '1 h 45', 'bus'),
    T('kinkakuji', 'ramen-koji', 'Kyoto City Bus 205, Kinkakuji-michi about 12:30 → Kyoto Station 13:10; up to 10F', '45 min', 'bus'),
    T('ramen-koji', 'otaroad', 'JR Kyoto Line Special Rapid, Kyoto about 14:15 → Osaka 14:44; Midosuji Line, Umeda about 14:50 → Namba 14:58; walk 12 min', '1 h'),
    W('otaroad', 'dormy-namba', 'Walk north-west', '12 min'),
    W('dormy-namba', 'maidreamin-nipponbashi', dur='12 min'),
    W('maidreamin-nipponbashi', 'dormy-namba', dur='12 min'),
]
d['title'] = 'Ryokan breakfast, Kinkakuji, Kyoto ramen, Den Den Town, maid café dinner'
d['titleJa'] = '江戸三 → 金閣寺 → 京都駅 → 日本橋オタロード → めいどりーみん'
d['romaji'] = 'Edosan → Kinkakuji → Kyōto-eki → Nipponbashi → Meidorīmin'
d['summary'] = 'A slow ryokan breakfast and a 10:00 check-out, then Kinkakuji and ramen at Kyoto Station. The anime shops on Otaroad in the afternoon, and dinner with the stage show at the maid café.'
d['cost'] = '≈ ¥8,000 per person (Kintetsu limited express ¥1,280, bus and JR about ¥1,200, Kinkakuji ¥500, ramen, maid café dinner); goods extra'

# ---------- Day 9: Kuromon at 10:00, Liberty Walk 30 min later
d = D[9]
setstop(d, 'kuromon', '10:00', 'Breakfast by grazing: grilled scallops, wagyu skewers, fruit.')
setstop(d, 'lb-drive-in', '12:15', 'Lunch: Sanuki udon in the park (Wed 11:00–15:00), then LB wide-body cars and goods, 2 h.')
setstop(d, 'dormy-namba', '16:15', 'Rest.')
for l in d['legs']:
    if l['to'] == 'lb-drive-in':
        l['label'] = 'Walk to Ebisucho (12 min); Sakaisuji Line, Ebisucho about 11:00 → Dobutsuen-mae 11:01; JR Hanwa Line Kishuji Rapid, Shin-Imamiya about 11:07 → Hineno about 11:45; JR Hanwa Line local, Hineno about 11:50 → Izumi-Sunagawa 12:00; taxi 5 min'
    if l['from'] == 'lb-drive-in':
        l['label'] = 'Taxi (ask the shop to call one) or walk 22 min to Izumi-Sunagawa; JR Hanwa Line Kishuji Rapid, Izumi-Sunagawa about 14:50 → Shin-Imamiya 15:42; JR Yamatoji Line, Shin-Imamiya 15:45 → JR Namba 15:49; walk 12 min'

# ---------- Day 10: leave 10:00
d = D[10]
d['stops'] = [
    S('matsuya-nipponbashi', '09:15', 'Breakfast: gyudon or a breakfast set, 20 min.'),
    S('toyota-auto-museum', '12:15', 'Lunch first: AVIEW museum restaurant, 45 min.'),
    S('toyota-auto-museum', '13:00', "The car hall (world cars 2F, Japanese cars 3F), then the culture hall, until 16:45 (Aoki's maybe)."),
    S('bincho-esca', '18:00', 'Dinner: hitsumabushi (grilled eel on rice), 1 h.'),
    S('dormy-namba', '20:20', 'Last night in Osaka; pack.'),
]
d['legs'] = [
    W('dormy-namba', 'matsuya-nipponbashi', dur='3 min'),
    T('matsuya-nipponbashi', 'toyota-auto-museum', 'Walk to Namba (10 min); Midosuji Line, Namba about 10:00 → Shin-Osaka 10:15; Tokaido Shinkansen Nozomi, Shin-Osaka about 10:30 → Nagoya 11:20; Higashiyama Line, Nagoya about 11:25 → Fujigaoka 11:52; Linimo, Fujigaoka about 11:57 → Geidai-dori 12:07; walk 5 min', '2 h 15', 'shinkansen'),
    T('toyota-auto-museum', 'bincho-esca', 'Walk to Geidai-dori (5 min); Linimo, Geidai-dori about 16:55 → Fujigaoka 17:05; Higashiyama Line, Fujigaoka about 17:10 → Nagoya 17:37; walk to ESCA (Shinkansen side), 10 min', '1 h 5'),
    T('bincho-esca', 'dormy-namba', 'Walk to the Shinkansen gates (3 min); Tokaido Shinkansen Nozomi, Nagoya about 19:10 → Shin-Osaka 20:00; Midosuji Line, Shin-Osaka about 20:05 → Namba 20:20; walk 10 min', '1 h 15', 'shinkansen'),
]
d['summary'] = 'A late start, one Nozomi to Nagoya and the Linimo line to the Toyota Automobile Museum: lunch in the museum, then 140 cars from all over the world until closing. Grilled eel (hitsumabushi) at Nagoya Station, and back in Osaka for the night.'

# ---------- Day 11: the one early morning left (flight 10:50)
d = D[11]
d['alerts'] = ['One of the few early mornings: the bus to Itami leaves Namba at 09:00 (the flight is 10:50, so you drive to Kutchan in daylight).'] + [a for a in d['alerts'] if 'Bus to Itami' not in a]

# ---------- Day 12: ski from about 10:30
d = D[12]
setstop(d, 'stay-resort-niseko', '08:45', 'Breakfast in the room (Seicomart food from last night), no rush.')
setstop(d, 'hirafu-base', '10:00', 'Pick up the reserved rental: skis, boots, poles, helmet, jacket + pants. Buy lift tickets. Wear your own gloves and goggles.')
setstop(d, 'niseko', '10:45', 'Pegasis teaches Aoki on the Ace Family area: walking on skis, snowplough, stopping, then the Ace Family lift.')
setstop(d, 'boyoso-hirafu', '12:30', 'Lunch: katsu curry or ramen in the old lodge, 50 min.')
setstop(d, 'niseko', '13:30', 'Afternoon runs together on the Ace Family area; gear in .Base storage by 15:45.', nth=1)
d['alerts'] = [a for a in d['alerts'] if 'Take the gloves' not in a] + ['Leave the hotel at 09:40; take your gloves and goggles.']

# ---------- Day 13: ski 10:00–12:10, then Rusutsu
d = D[13]
setstop(d, 'stay-resort-niseko', '08:30', 'Breakfast in the room (Seicomart food).')
setstop(d, 'hirafu-base', '09:45', 'Take the gear out of storage; buy lift tickets.')
setstop(d, 'niseko', '10:00', 'Ski together until 12:00 on the Ace Family area.')
d['alerts'] = d['alerts'] + ['Leave the hotel at 09:30 (Sunday: park at Hirafu lot 1).']

# ---------- Day 14: leave Kutchan at 10:00
d = D[14]
setstop(d, 'stay-resort-niseko', '09:00', 'Breakfast in the room; check out at 10:00.')
setstop(d, 'garaku', '12:45', "Lunch: soup curry (Minami 3-jo Higashi 2, B1F, near Nijo Market); expect a short queue (Pegasis's pick).")
setstop(d, 'toyota-sapporo', '14:15', 'Return the car with a full tank.')
setstop(d, 'route-inn-sapporo', '14:45', 'Check in, rest.')
for l in d['legs']:
    if l['from'] == 'stay-resort-niseko': l['label'] = l['label'].replace('(leave by 09:00)', '(leave at 10:00, daylight all the way)')
    if l['from'] == 'toyota-sapporo': l['label'] = 'Walk to Sapporo Station (5 min); Namboku Line, Sapporo about 14:30 → Susukino 14:33; walk 5 min'
d['alerts'] = ['Leave Kutchan at 10:00: Nakayama Pass in daylight.', 'GARAKU: lunch time queue; a table often frees in 20–30 min.', 'Laundry night 4: clean clothes for the flights.']

# ---------- Day 15: leave 10:00, Peach 12:00
d = D[15]
d['stops'] = [
    S('route-inn-sapporo', '08:45', 'Breakfast: free hotel buffet (06:30–09:30); check out 10:00.'),
    S('cts', '11:15', 'Peach counter (domestic terminal): bag drop. Lunch: buy a Hokkaido ekiben (boxed lunch) to eat on the plane.'),
    S('narita', '13:50', 'Land at Terminal 1 (Peach MM576). Bag storage for the suitcases.'),
    S('narita', '14:10', 'Last shopping in T1: souvenirs, snacks, Japan-only goods; Pegasis weighs the suitcase.'),
    S('narita', '15:15', 'Pegasis checks in for WestJet WS81 18:30 (with the suitcase).'),
    S('narita', '15:45', 'Dinner together: T1 restaurant floor (Central Building 4F–5F), 45 min.'),
    S('narita', '16:30', 'Aoki checks in for Air China CA920 19:30. Say goodbye about 17:00.'),
]
d['legs'] = [
    T('route-inn-sapporo', 'cts', 'Walk to Susukino (3 min); Namboku Line, Susukino about 10:05 → Sapporo 10:09; JR Rapid Airport, Sapporo about 10:30 → New Chitose Airport 11:07 (¥1,230)', '1 h 5'),
    {'from': 'cts', 'to': 'narita', 'mode': 'flight', 'label': 'Peach MM576, New Chitose 12:00 → Narita Terminal 1 13:50', 'duration': '1 h 50'},
]
d['alerts'] = ["Check out at 10:00 with all bags; day 15 of 15 on Aoki's visa.", 'Peach: add the checked bags when you book (not at the airport: more expensive).', 'Tax-free refund check at customs before bag drop at Narita.']
d['notes'] = [n.replace('Backup: Peach MM574 11:10 → 13:00, or Jetstar GK108 12:00 → 13:50', 'Backup: Peach MM574 11:10 → 13:00 (leave 09:15), or Jetstar GK110 12:45 → 14:30') for n in d['notes']]
d['summary'] = 'A 10:00 check-out, the JR train to New Chitose and one Peach flight to Narita Terminal 1, the terminal of both flights home. Last shopping and an early dinner together at Narita, then Pegasis flies at 18:30 and Aoki at 19:30.'
p['flights'] = [f.replace('Peach MM572 New Chitose 10:30 → Narita T1 12:20', 'Peach MM576 New Chitose 12:00 → Narita T1 13:50') for f in p['flights']]
p['bookFirst'] = json.loads(json.dumps(p['bookFirst'], ensure_ascii=False)
    .replace('Peach MM572 New Chitose → Narita, Feb 2 10:30', 'Peach MM576 New Chitose → Narita, Feb 2 12:00')
    .replace('Jan 21 16:45 – Jan 23 10:35', 'Jan 21 16:45 – Jan 23 11:40')
    .replace('Jan 29 13:50 – Feb 1', 'Jan 29 13:50 – Feb 1 14:15'))
for x in places.values():
    for i in x.get('info', []):
        if i['value'] == 'Thu Jan 21 16:45 → Sat Jan 23 10:35 at Mishima': i['value'] = 'Thu Jan 21 16:45 → Sat Jan 23 11:40 at Mishima'
        if i['value'] == 'Fri Jan 29 13:40 → Mon Feb 1 about 12:45': i['value'] = 'Fri Jan 29 13:40 → Mon Feb 1 about 14:15'
        if i['value'].startswith('Kodama 815 10:54'): i['value'] = 'Kodama about 11:54 → Shin-Osaka about 14:51, direct (current timetable)'

used = set()
for dd in p['days']:
    used |= {s['place'] for s in dd['stops']} | {l['from'] for l in dd['legs']} | {l['to'] for l in dd['legs']} | {dd.get('sleep'), dd.get('cover')}
order = [x['id'] for x in p['places']] + [k for k in places if k not in [x['id'] for x in p['places']]]
print('dropped:', [i for i in order if i not in used])
p['places'] = [places[i] for i in order if i in used]
json.dump(p, open(P, 'w'), ensure_ascii=False, indent=2)
