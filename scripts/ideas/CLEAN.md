# Ideas clean-up brief

The travellers have decided the general direction of the trip (Jan 19 – Feb 2, 2027):
  land in Tokyo → a few days in Tokyo / Kawasaki → travel WEST to Osaka, playing along the way
  (Hakone/Fuji/Izu, Shizuoka/Numazu, Nagoya, the Alps/Hokuriku side: Matsumoto/Takayama/Shirakawa-go/Kanazawa,
  Kyoto/Uji/Nara/Kobe/Himeji/Kansai onsen) → Osaka → FLY to Hokkaido → Hokkaido (anywhere in Hokkaido, incl. Hakodate) → fly home.
The idea list is too long. Your job: decide REMOVE or KEEP for each id in your bucket file.

All ideas (with titles, summaries, prices, locations) are in /home/rmng/japan-trip/scripts/ideas/all-ideas.json
(read it with python/jq; ids starting with "plan-" are places in the old day plan). Look at ideas OUTSIDE your bucket too
when judging duplicates and "strictly worse".

REMOVE when:
1. Off route: not reasonably on the way from Tokyo west to Osaka, and not in Hokkaido. Examples: Tohoku (Yamagata, Zao, Sendai,
   Matsushima, Aomori, Akita, Iwate, Fukushima, Niigata ski), Kyushu/Goto, Okinawa, Chiba/Ibaraki far trips, Nikko/Gunma unless
   it is a genuine day trip from Tokyo worth it, flights/rail/passes only for the Tohoku route (Tsubasa, Hayabusa, Sendai→Hakodate,
   Hakodate→Sapporo one-way car if the Hokkaido entry is by air), hotels in off-route towns. Whole-trip plans that do not follow
   Tokyo → west → Osaka → fly to Hokkaido.
2. Strictly worse or redundant: another existing idea gives the same thing better (same place/experience, cheaper, closer, fits the
   route better), or it duplicates another idea. Keep the better one and name it in the reason.
3. Ads / promotions: ideas whose point is a brand, app, payment method, card, SIM/eSIM vendor, booking platform coupon/sale,
   membership or marketing campaign (e.g. "Alipay and UnionPay discounts", eSIM vs roaming, credit card tips, Jalan/Rakuten/Expedia
   sales pages, tour-seller listings that just resell something bookable directly), or that read like a paid post. Keep concrete
   bargains that are a real place/meal/ticket/hotel on the route with a real saving.
4. Stale: the thing is closed/finished/not possible in late Jan 2027 (winter "no") with no alternative.
KEEP everything else. When unsure, KEEP. Do not remove Hokkaido ideas just because the old plan's Hokkaido order changes.

Output JSON to the file named in your task:
  {"remove": {"<id>": "short reason (≤15 words, name the better idea if rule 2)"}, "keep": ["<id>", ...]}
Every id in your bucket must appear exactly once (in remove or keep). Valid JSON. Do not edit other files. No web research needed.
Final reply: 2 lines (kept N, removed M).
