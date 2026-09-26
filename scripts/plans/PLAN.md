# Brief: plan one complete, concrete trip

## Travellers and hard facts
- **Pegasis** (Toronto) and **Aoki** (Shanghai), friends, travelling together.
- Trip: Pegasis leaves Toronto Mon Jan 18, 2027 and lands in Tokyo on Tue Jan 19. Aoki lands in Tokyo on Tue Jan 19.
  Both leave Japan on **Tue Feb 2, 2027**. Aoki's visa: max 15 days (Jan 19 = day 1, Feb 2 = day 15). Pegasis may stay 1–2 days longer if it helps.
- Flights are NOT booked yet, so the entry and exit airports can change:
  - Pegasis: WestJet Toronto↔Narita round trip CA$1,039 (via Calgary), or open-jaw Toronto→Narita + Sapporo(CTS)→Vancouver/Toronto (Air Canada, about CA$1,247). Air Canada has a new nonstop CTS→Vancouver (Tue/Fri/Sun).
  - Aoki: Spring Airlines or Air China Shanghai→Narita (about CA$300), and Sapporo(CTS)→Shanghai nonstop (Spring Airlines) or via Narita.
- **The route is decided:** land in Tokyo → some days in Tokyo / Kawasaki → travel WEST to Osaka, playing along the way →
  **fly Osaka (Itami or Kansai) → Hokkaido** → Hokkaido → fly home (from Sapporo or via Tokyo).
- Driving: Aoki has a licence Japan accepts. Pegasis has 1 year of licence + IDP: normal rental cars are fine (Times Car Rental has
  no minimum years), but most JDM sports-car shops need 3+ years, so JDM driving is by guided tour or on a course (Rusutsu drift course,
  Suzuka EV kart need no special licence). Winter: studless tyres; Hokkaido rental cars have them by default.
- Budget: reasonable (normal jobs). Mostly business hotels, plus at least one onsen ryokan night.
- One traveller has ADHD: fewer hotel changes are welcome, and each day should have a clear shape.

## Their choices
Read both files fully: `/home/rmng/japan-trip/aoki-choices.txt` and `/home/rmng/japan-trip/pega-choices.txt`
(WANT / MAYBE / NOT INTERESTED, with ids and notes). Rules from the travellers:
- An idea that one person did not rate counts as **MAYBE** for that person.
- Nothing is absolute: one can go to a place the other marked not interested if the other really wants it; an interesting place
  can be skipped if it is too far or does not fit. Where they conflict, find a fair solution (for example a split half day, or doing
  one person's must-do on one day and the other's on another).
- Some chosen ideas were made for the old route (Tohoku) or are day-specific ("Day 3" etc. refers to the OLD plan): re-place them freely.
Details of every idea (title, Japanese name, coordinates, prices, winter notes, what to do) are in
`/home/rmng/japan-trip/src/data/ideas.json` (by id; ids starting "plan-" are places of the old plan and are in
`/home/rmng/japan-trip/scripts/ideas/planned-places.json`; ideas removed from the list are in `/home/rmng/japan-trip/src/data/removed.json`).
The research summary of the route west is in `/home/rmng/japan-trip/scripts/ideas/route-west-SUMMARY.md` (dates, trade-offs, flights).

## Fixed dates to respect (2027)
Nara Wakakusa hill burning Sat Jan 23 (18:15 fireworks, 18:30 fire) · Shirakawa-go light-up Sun Jan 24 (reservation only) ·
Suzuka Circuit open only Jan 22–25 · Ghibli Park closed Tuesdays · Sumo January tournament in Tokyo until Sun Jan 24 ·
Asahiyama Zoo penguin walk 11:00 and 14:30 · Sapporo Snow Festival Feb 4–11 (after the trip) · Lake Shikotsu ice festival from Jan 30 ·
Sounkyo ice waterfall festival from Jan 23 · Daikoku PA: police often close it Fri/Sat nights, weekdays are best · Sapporo Beer Museum
closed Mondays · Cafe Mai:lish closed Wednesdays · Sunset in late January about 16:50 (Tokyo) / 16:40 (Sapporo), sunrise about 06:45.

## What to produce
A complete day-by-day plan from Tue Jan 19 to Tue Feb 2 (15 days; add a day 16 only for a Pegasis-only extra day).
Be concrete: every stop has a time, every move between stops has a mode, a duration and a label naming the line/road
(e.g. "Tokaido Shinkansen Hikari, Tokyo → Nagoya", "Drive, Route 138"), every night has a named hotel (prefer good-value hotels
from the bargains in ideas.json, or well-known chains), every flight has airline and times. Check that times add up
(travel time + time at each stop), that places are open at that time in winter, and that driving is in daylight on snowy roads.
Keep it realistic: no more than about 5–7 stops per day, and leave some slack.

Write ONE JSON file (valid JSON) to the output path in your task, with this structure:
{
  "id": "<short-id>",
  "name": "short plan name (2–4 words)",
  "tagline": "one sentence: what makes this plan different",
  "summary": "3–5 short sentences",
  "who": {"pegasis": "which of Pegasis's wants are in / out and why", "aoki": "same for Aoki"},
  "cost": {"transport": "¥ per person", "hotels": "¥ per person", "activities": "¥ per person", "total": "¥ per person (excl. international flights)"},
  "flights": ["Pegasis: ...", "Aoki: ...", "Osaka → Hokkaido: ..."],
  "places": [   // every place used in stops or legs (hotels, stations, airports too)
    {"id": "kebab-id", "ref": "id in ideas.json or planned-places (without plan- prefix: e.g. 'nakano') if it is that place, else null",
     "en": "English name", "ja": "Japanese name as on signs", "romaji": "reading", "lat": 0.0, "lon": 0.0,
     "kind": "anime|car|ski|fuji|food|sight|onsen|hotel|station|airport",
     "blurb": "2 short sentences", "info": [{"label": "...", "value": "..."}], "tips": ["..."]}
  ],
  "days": [
    {"n": 1, "date": "2027-01-19", "weekday": "火", "region": "tokyo|fuji|chubu|kansai|hokkaido",
     "short": "1–2 words for a tab", "title": "English title", "titleJa": "Japanese title with →", "romaji": "...",
     "summary": "2 sentences", "temp": "low – high °C",
     "alerts": ["1–3 things not to forget"], "split": "only if they are apart this day",
     "stops": [{"place": "<place id>", "time": "HH:MM", "note": "what to do there (short)", "who": "Pegasis|Aoki (only if one person)"}],
     "legs": [{"from": "<place id>", "to": "<place id>", "mode": "drive|shinkansen|train|bus|flight|walk|ropeway",
               "label": "line/road name", "duration": "e.g. 1 h 30 or 25 min", "who": "optional"}],
     "sleep": "<hotel place id>", "sleepNote": "short", "notes": ["2–4 practical notes"], "cost": "≈ ¥ per person"}
  ]
}
Legs must connect in order: the first leg of a day starts at the previous night's hotel (or the airport on day 1), each leg's
"to" is the next stop. Coordinates: reuse them from ideas.json / planned-places.json; for new places use OpenStreetMap or Wikipedia
(no guessing; if unsure, pick the nearest known point such as the station). Japanese names must be the real names on signs.

Research: WebSearch may be out of quota; use WebFetch on official sites/Wikipedia and the headless browser CLI `agent-browser`
with your own session (`--session <your-plan-id>`) if you need to check a timetable or opening time. NEVER use the desktop tools.
No booking, no log-ins.
Final reply: max 8 lines: plan name, the route in one line, nights per base, the 3 strongest points, the 2 weakest points.

## Update from the travellers
- You may add new spots, hotels and places to eat that are not in ideas.json, and rearrange days and order for efficiency.
- A "NOT INTERESTED" on a place with hot-spring bathing (onsen, sento, ryokan bath, footbath) means only: not interested in the
  BATHING. If the place has other interesting things (views, food, streets, snow, festivals, shopping), treat it as MAYBE.
  Do not plan onsen bathing as an activity for someone who said no to it; a hotel with a bath is fine.
