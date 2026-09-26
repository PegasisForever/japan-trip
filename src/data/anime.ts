import type { Place } from './types.ts'

/* Anime pilgrimage (聖地巡礼) spots. Sources: official Girls Band Cry stamp tour,
   Japanese fan guides (negitap.hateblo.jp, mgs-1113.hatenablog.com), animepilgrimage.com,
   aurakaze.blog (Chinese). Coordinates checked against OpenStreetMap. */

const GBC = 'Girls Band Cry ガールズバンドクライ'

export const animePlaces: Place[] = [
  // ---------- Kawasaki: Girls Band Cry ----------
  {
    id: 'gbc-miharashi',
    en: 'Tamagawa Miharashi Park',
    ja: '多摩川見晴らし公園',
    romaji: 'Tamagawa Miharashi Kōen',
    lat: 35.53784,
    lon: 139.6995,
    kind: 'anime',
    anime: `${GBC} · Ep 2, 8, 9`,
    blurb:
      'The wide concrete steps on the bank of the Tama River. In episode 2, Momoka plays guitar here at night and talks with Nina. It is also on the key art. Across the river you see Tokyo.',
    info: [
      { label: 'From station', value: 'Kawasaki West Exit, 1 km' },
      { label: 'Stamp tour', value: 'Yes' },
    ],
    tips: ['It is windy and cold by the river in January. Come back at sunset (16:50) if you want the night-scene light.'],
  },
  {
    id: 'gbc-minamikawara',
    en: 'Minamikawara Park and Miyakocho Footbridge',
    ja: '南河原公園・都町歩道橋',
    romaji: 'Minamikawara Kōen, Miyakochō Hodōkyō',
    lat: 35.53577,
    lon: 139.68761,
    kind: 'anime',
    anime: `${GBC} · Ep 1, 8, 9 · Opening`,
    blurb:
      'The neighbourhood near Nina’s apartment. The footbridge over the main road is in the opening animation, and the small park appears in many scenes. Japanese guides call it a must-see.',
    info: [
      { label: 'From station', value: 'Kawasaki West Exit, 1.2 km' },
      { label: 'Stamp tour', value: 'Yes (2 stamps)' },
      { label: 'Time needed', value: '20–30 min' },
    ],
    tips: [
      'This is a residential area. Keep your voice down and do not block the bridge stairs.',
      'Rent a HELLO CYCLING bike at Lazona to save about 1.5 hours of walking.',
    ],
  },
  {
    id: 'gbc-muza',
    en: 'MUZA Kawasaki Symphony Hall',
    ja: 'ミューザ川崎シンフォニーホール',
    romaji: 'Myūza Kawasaki Shinfonī Hōru',
    lat: 35.53096,
    lon: 139.69541,
    kind: 'anime',
    anime: `${GBC} · Ep 1, 13 · "爆ぜて咲く" MV`,
    blurb:
      'On the 2F walkway Nina trips and Momoka’s guitar falls in episode 1. The public upright piano on 1F is in the music video. Animate Kawasaki (anime goods) is on 2F.',
    info: [
      { label: 'Piano', value: 'Free to play, 10:00–20:00' },
      { label: 'Animate', value: '2F' },
      { label: 'Stamp tour', value: 'Yes' },
    ],
  },
  {
    id: 'gbc-lazona',
    en: 'Lazona Kawasaki Plaza, Rufa Square',
    ja: 'ラゾーナ川崎プラザ ルーファ広場',
    romaji: 'Razōna Kawasaki Puraza, Rūfa Hiroba',
    lat: 35.53229,
    lon: 139.69587,
    kind: 'anime',
    anime: `${GBC} · Ep 3, 5`,
    blurb:
      'The open-air stage inside the big shopping mall west of the station. Nina, Momoka and Subaru play "声なき魚" here in episode 3. You get the anime angle from the 4F and 5F walkways. HMV on 4F sells collaboration goods.',
    info: [
      { label: 'Hours', value: '10:00–21:00' },
      { label: 'Lunch', value: 'Food court and restaurants' },
    ],
    tips: ['Signs say no photos of the stage area during events. Obey the signs.', 'Good place for lunch.'],
    links: [{ label: 'Stamp tour at Lazona', url: 'https://mitsui-shopping-park.com/lazona-kawasaki/event/3106830.html' }],
  },
  {
    id: 'gbc-east-plaza',
    en: 'Kawasaki Station East Exit Plaza',
    ja: '川崎駅東口 駅前広場',
    romaji: 'Kawasaki Eki Higashiguchi Ekimae Hiroba',
    lat: 35.53066,
    lon: 139.69807,
    kind: 'anime',
    anime: `${GBC} · Ep 1, 9, 10, 13`,
    blurb:
      'The most important Girls Band Cry spot. In episode 1 Nina hears Momoka playing on the street here, and the reunion and final scenes come back to this plaza. Street musicians still play here in the evening.',
    info: [
      { label: 'Station', value: '川崎駅 東口' },
      { label: 'Stamp book', value: '¥500, stamps free' },
    ],
    tips: [
      'Buy the official stamp tour book (¥500). There are 25 stamp points around Kawasaki, and the stamps have no end date.',
      'The road in front became pedestrian-only in Feb 2026, so a few crossings from the anime look different now.',
      'Take photos in daylight. At night it is crowded.',
    ],
    links: [{ label: 'Official stamp tour', url: 'https://girlsbandcrystamptour.com/' }],
  },
  {
    id: 'gbc-marufuku',
    en: 'Marufuku Coffee, Kawasaki Azalea',
    ja: '丸福珈琲店 川崎アゼリア店',
    romaji: 'Marufuku Kōhīten, Kawasaki Azeria',
    lat: 35.53036,
    lon: 139.69856,
    kind: 'anime',
    anime: `${GBC} · Ep 1, 6, 9, 12`,
    blurb:
      'The retro coffee shop where the band meets. It is on B1F of the Azalea underground mall, below the East Exit plaza. It has stamp number 1 of the stamp tour, and the official GBC stamp gallery is also in Azalea.',
    info: [
      { label: 'Floor', value: 'Kawasaki Azalea B1F' },
      { label: 'Try', value: 'Hotcake and coffee' },
    ],
    tips: [
      'In episode 1 they sit at the window. In episodes 6 and 12 they use the 4-person table on the left.',
      'Ask staff before you take photos inside.',
    ],
  },
  {
    id: 'gbc-citta',
    en: "CLUB CITTA' and La Cittadella",
    ja: 'クラブチッタ（ラ チッタデッラ）',
    romaji: 'Kurabu Chitta, Ra Chittaderra',
    lat: 35.52803,
    lon: 139.69735,
    kind: 'anime',
    anime: `${GBC} · Ep 3, 13 (final live)`,
    blurb:
      'The live house where the band plays its final show in episode 13, inside an Italian-style shopping street. The real band TOGENASHI TOGEARI has played here. Tower Records and Village Vanguard nearby sell GBC goods.',
    info: [
      { label: 'Inside', value: 'Ticket holders only' },
      { label: 'Lit up', value: 'After dark' },
    ],
    tips: ['Check clubcitta.co.jp: if a show is on Jan 21, you could go in.'],
    links: [{ label: "CLUB CITTA' schedule", url: 'https://clubcitta.co.jp/' }],
  },

  // ---------- Tokyo ----------
  {
    id: 'suga',
    en: 'Suga Shrine stairs',
    ja: '須賀神社（男坂）',
    romaji: 'Suga Jinja, Otokozaka',
    lat: 35.68508,
    lon: 139.72336,
    kind: 'anime',
    anime: 'Your Name. 君の名は。 · Final scene',
    blurb:
      'The red-railed stairs where Taki and Mitsuha pass each other and turn around at the end of the film. It is the image on the poster, and one of the most photographed anime spots in Tokyo.',
    info: [
      { label: 'Station', value: '四谷三丁目駅, 7 min walk' },
      { label: 'Best time', value: 'Before 09:00' },
    ],
    tips: [
      'People live here. Do not sit on or block the stairs, and give way to residents.',
      'Go early. By 10:00 there can be a line of people taking the same photo.',
    ],
  },
  {
    id: 'shimokita',
    en: 'Shimokitazawa',
    ja: '下北沢',
    romaji: 'Shimokitazawa',
    lat: 35.66157,
    lon: 139.66759,
    kind: 'anime',
    anime: 'Bocchi the Rock! ぼっち・ざ・ろっく！',
    blurb:
      'The home of Kessoku Band. A neighbourhood of small live houses, used-clothing shops and record stores. The Senrogai open space (Ep 5) is on the old railway line above the station.',
    info: [
      { label: 'Station', value: '下北沢駅 (Odakyu, Keio)' },
      { label: 'Shops open', value: '11:00–12:00' },
    ],
    tips: ['Look for Bocchi collaboration posters in the station and shops.'],
  },
  {
    id: 'shelter',
    en: 'Shimokitazawa SHELTER',
    ja: '下北沢SHELTER',
    romaji: 'Shimokitazawa Sherutā',
    lat: 35.66155,
    lon: 139.66956,
    kind: 'anime',
    anime: 'Bocchi the Rock! · Model for STARRY',
    blurb:
      'The basement live house that is the model for STARRY, where Bocchi’s band plays and works. Fans photograph the stairs going down from the street.',
    tips: ['Only open on show nights. Take photos quietly from the street.'],
  },
  {
    id: 'nakano',
    en: 'Nakano Broadway',
    ja: '中野ブロードウェイ',
    romaji: 'Nakano Burōdowei',
    lat: 35.70919,
    lon: 139.66574,
    kind: 'anime',
    anime: 'Otaku shopping',
    blurb:
      'A 1960s shopping building. Floors 2 to 4 are full of shops for used figures, manga, trading cards and old toys, including many Mandarake shops. Less crowded and often cheaper than Akihabara.',
    info: [
      { label: 'Station', value: '中野駅 North Exit' },
      { label: 'Hours', value: 'About 12:00–20:00' },
    ],
    tips: ['Many shops do not allow photos. Look for the sign.'],
  },
  {
    id: 'zest',
    en: 'Akihabara ZEST',
    ja: '秋葉原ZEST',
    romaji: 'Akihabara Zesuto',
    lat: 35.70036,
    lon: 139.76982,
    kind: 'anime',
    anime: 'Oshi no Ko 【推しの子】 · Ep 1',
    blurb:
      'A small live venue in Akihabara. It is the model for "BEAST", where Ai performs and baby Aqua and Ruby dance with glow sticks in episode 1. The front of the building matches the anime.',
    tips: ['It is a working venue. Photograph the outside only, and not when a queue is forming.'],
  },
  {
    id: 'radio-kaikan',
    en: 'Akihabara Radio Kaikan',
    ja: '秋葉原ラジオ会館',
    romaji: 'Akihabara Rajio Kaikan',
    lat: 35.69788,
    lon: 139.77195,
    kind: 'anime',
    anime: 'Steins;Gate and many more',
    blurb:
      'The most famous building in Akihabara: 10 floors of figures, trading cards, model kits and anime goods, opposite the station. In Steins;Gate a satellite crashes into its roof.',
    info: [
      { label: 'Station', value: '秋葉原駅 電気街口' },
      { label: 'Hours', value: '10:00–20:00' },
    ],
  },
  {
    id: 'kinshi',
    en: 'Kinshi Park',
    ja: '錦糸公園',
    romaji: 'Kinshi Kōen',
    lat: 35.69902,
    lon: 139.81532,
    kind: 'anime',
    anime: 'Lycoris Recoil リコリス・リコイル · Ep 1',
    blurb:
      'The park in Sumida where Chisato and Takina talk in episode 1. There is a Lycoris Recoil manhole cover in front of the Olinas mall next to it, and Tokyo Skytree stands just behind.',
    info: [{ label: 'Station', value: '錦糸町駅 North Exit' }],
    tips: ['End the day here: the Skytree is lit after 17:00.'],
  },
]
