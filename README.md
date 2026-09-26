# Yukimichi 雪道

An interactive map of a 15-day winter trip, Tokyo → Sapporo, 19 Jan – 2 Feb 2027.
Satellite map, real driving routes, real Shinkansen track lines, photos and details for every stop.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/
```

## Where things are

| What | File |
|---|---|
| Day-by-day plan | `src/data/days.ts` |
| Places (names in Japanese as on signs, coordinates, tips) | `src/data/trip.ts`, `src/data/anime.ts` |
| Trip summary, budget, booking list | `trip` in `src/data/trip.ts` |
| Route lines (generated) | `src/data/routes.json` |
| Photo credits (generated) | `src/data/photos.json`, photos in `public/photos/` |

## Update routes or photos

```sh
cd scripts
python3 routes.py            # after you change legs in days.ts (uses OSRM + OpenStreetMap)
python3 cands.py <place-id>  # find photo candidates on Wikimedia Commons
python3 sheet.py out.jpg <place-id>...   # contact sheet to choose from
# set the chosen index in picks.json, then:
python3 fetch_picks.py
```

## Credits

- Satellite imagery: Esri World Imagery. Terrain: Mapzen / AWS Open Data.
- Roads: OSRM on OpenStreetMap data. Rail lines: OpenStreetMap (ODbL).
- Photos: Wikimedia Commons. Each photo shows its author and licence in the place panel.
