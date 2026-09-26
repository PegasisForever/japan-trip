# Idea option format (write a JSON array to your output file)

Context: 2 travellers (Pegasis from Toronto, Aoki from Shanghai), Japan, Tue Jan 19 – Tue Feb 2, 2027 (winter).
Aoki's visa: max 15 days. Budget: reasonable, normal jobs. Interests: anime pilgrimage, JDM cars and driving
(Aoki has a licence Japan accepts; Pegasis has only 1 year of licence, so most JDM rental shops need 3+ years — guided tours OK),
skiing (Pegasis good, Aoki beginner), Mt Fuji, onsen. Mostly business hotels. Flights are NOT booked yet, so the end
city can change. They are open to ideas outside these interests.

Current baseline plan (day: place):
1 Jan19 Narita→Shinjuku | 2 Jan20 Tokyo anime (Suga shrine, Shimokitazawa, Nakano, Akihabara, Kinshicho) |
3 Jan21 Kawasaki Girls Band Cry + Daikoku PA night | 4 Jan22 Hakone Turnpike + guided JDM drive + Kawaguchiko |
5 Jan23 Chureito sunrise, back to Tokyo, Shibuya Sky | 6 Jan24 Shinkansen to Zao Onsen, ski, snow monsters, ryokan |
7 Jan25 ski morning, Sendai gyutan | 8 Jan26 Hayabusa to Hakodate | 9 Jan27 Hakodate→Onuma→Niseko by car |
10 Jan28 Niseko ski | 11 Jan29 Otaru→Asahikawa | 12 Jan30 Asahiyama zoo, Biei Blue Pond | 13 Jan31 Furano→Sapporo |
14 Feb1 Sapporo, Pegasis flies to Narita | 15 Feb2 flights home.

Each option object:
{
  "id": "kebab-case-unique",
  "kind": "addon" | "swap" | "plan",      // addon = fits inside an existing day; swap = replaces 1–3 baseline days; plan = a different multi-day route (3+ days)
  "category": "anime" | "cars" | "snow" | "onsen" | "food" | "scenery" | "culture" | "city" | "nature",
  "title": "short English title (max 6 words)",
  "titleJa": "Japanese name exactly as on signs in Japan",
  "summary": "2 short sentences: what it is, what you do. Plain simple English.",
  "why": "1 sentence: why these two travellers would like it",
  "days": [numbers of baseline days it fits or replaces],   // [] for plan if it restructures the trip
  "duration": "e.g. 2 h, half day, 1 day, 3 days",
  "cost": "per person, JPY, approx",
  "winter": "ok" | "check" | "no",        // does it work in late Jan 2027? "check" = depends on dates/weather
  "winterNote": "short note on dates/closures in late Jan (e.g. festival dates 2027 or last year's)",
  "lat": 0.0, "lon": 0.0,                 // main point, verified (OpenStreetMap/Wikipedia), 5 decimals
  "route": [[lon,lat], ...],              // only for "plan"/"swap": main waypoints in order (3–8 points), else omit
  "places": [{"en": "...", "ja": "...", "lat": 0.0, "lon": 0.0}],  // optional, key sub-places (max 5)
  "anime": "title of the anime and scene, only for anime options",
  "photoQuery": "search words for a matching photo on Wikimedia Commons (English, place name)",
  "sources": ["url", ...]                 // at least 1, prefer official / Japanese sources
}

Rules: research in English, Japanese AND Chinese sources (e.g. Japanese official sites, Hatena/note blogs, 聖地巡礼 sites,
Xiaohongshu/Zhihu/Bilibili/Mafengwo). Do not invent facts or coordinates; if unsure, say so in winterNote.
Aim for 8–14 good options. Write the JSON array to your output file with the Write tool, valid JSON only.
Final reply: 3–5 lines summary only (the file holds the details).
