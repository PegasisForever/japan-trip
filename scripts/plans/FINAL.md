# Brief: build one FINAL plan by combining the best parts of 5 draft plans

Read first: `/home/rmng/japan-trip/scripts/plans/PLAN.md` (travellers, rules, JSON format — follow the same format),
and the 5 draft plans `/home/rmng/japan-trip/scripts/plans/plan-1.json` … `plan-5.json`
(1 balanced "Fair Share Tokaido", 2 "Snow First", 3 "Driver's Road West", 4 "Anime Pilgrimage Road", 5 "Four Calm Bases").
Reuse their researched places, hotels, times, prices, coordinates and texts wherever they fit (copy the place objects, keep "ref").
Use they/them for Aoki (gender not stated).

## Decisions that apply to every final plan
- Daikoku PA on the evening of **Thu Jan 21**, Pegasis drives a normal rental car himself (no guide); add Tatsumi PA / Umihotaru if it fits.
- **Rental car pickup must be a real shop that exists.** Finding from plan 3: Times Car Rental has NO shop in central Tokyo any more
  (Haneda only) and none in Nara. Check the rental company's own shop list with agent-browser
  (Times, Toyota Rent a Car, Nippon Rent-A-Car, Orix, Nissan) and pick a real shop near the route (e.g. Kawasaki, Shinjuku, Haneda) and a real
  drop-off shop for one-way returns (e.g. Mishima, Shizuoka, Kyoto). The licence rule for Pegasis (1 year + IDP) must be accepted by
  that company (Times: no minimum years; check others on their site). Winter/studless tyres for Hakone/Fuji roads.
- Nara hill burning **Sat Jan 23** evening. Suzuka EV kart on a day when the circuit is open (Jan 22–25; check the official calendar).
- One Kansai base hotel where possible. Fly Osaka (Itami or Kansai) → New Chitose with a real flight and time.
- Hokkaido: Niseko skiing with Aoki's beginner lesson (Annupuri/Hirafu), the Rusutsu snow drift course (Pegasis drives), Sapporo food
  (Daruma, soup curry), Mt Moiwa night view, Asahiyama Zoo penguin walk if it fits.
- Nobody is planned to bathe in an onsen (both said no to bathing); a hotel with a bath is fine. One ryokan-style or special night is welcome
  (e.g. the Hanz Fuji-view villa or a Niseko onsen hotel for its food and snow views).
- Both fly home Tue Feb 2 (from New Chitose unless your plan says otherwise, with real flights).
- Add a top-level "bookFirst": [{"what": "...", "why": "book by <date>, because ..."}] with the 6–10 most time-critical bookings,
  and "who": {"pegasis","aoki"} explaining which of each person's WANTs are in, and which are out and why.
- Keep days realistic (5–7 stops), daylight driving on snowy roads, and use Japanese names as on signs.

## The three final plans (each must stay clearly different)
### final-a  "Best of Both" — the balanced main plan
Base: plan 1 (Fair Share) and plan 5 (Four Calm Bases). Take plan 4's car idea: pick up in Kawasaki (or the nearest real shop),
one-way along Enoshima (short) → Hakone Turnpike/Taikanzan/Otome → Fuji (Kawaguchiko, Oishi Park, Chureito at sunrise) → drop at Mishima,
then Shinkansen west. Tokyo 3–4 nights incl. a real anime day and a Kawasaki GBC day, Fuji 1 night, one Kansai base 4–5 nights
(Nara Sat 23, Suzuka by train on the best open day, Kyoto/Uji Sabbat spots, Kobe, Liberty Walk), Hokkaido 5 nights
(Niseko/Kutchan 3 incl. drift + ski, Sapporo 2 with Asahiyama). About 5 hotels. Calm mornings where possible.
Output: /home/rmng/japan-trip/scripts/plans/final-a.json, "id": "best-of-both".

### final-b  "Road Trip West" — the car plan
Base: plan 3 (Driver's Road West) + plan 4's anime stops on the drive (Enoshima/Slam Dunk crossing, Evangelion Lake Ashi, Yuru Camp Motosu,
Numazu if it fits). One car from the Tokyo area (real shop) via Hakone and Fuji, then west to Suzuka (the EV kart) and a one-way drop in
the Kansai (real shop, check opening hours and the one-way fee). Split the long Jan 23 into something humane (e.g. stay one night near Hamamatsu/Nagoya
or Suzuka, or move Suzuka to Jan 24/25 from the Kansai base). Hokkaido 5 nights with a rental car (Niseko, Rusutsu, Otaru, Sapporo).
Return: compare ending in Sapporo vs Tokyo (plan 3 ended in Tokyo for cheaper flights) and choose; say why.
Output: /home/rmng/japan-trip/scripts/plans/final-b.json, "id": "road-trip".

### final-c  "Snow and Stories" — longer Hokkaido
Base: plan 2 (Snow First) + plan 4's anime days in Tokyo/Kawasaki (Bocchi, GBC, SHELTER live show, maid café, goods route).
Tokyo 4 nights (one car day for Daikoku + Turnpike/Fuji, back to Tokyo), a fast Kansai part (Nara Sat 23, Kyoto/Uji Sabbat, Suzuka) with one base,
fly north on Jan 26, then 7 nights in Hokkaido with 3–4 ski/snow days (Niseko, Rusutsu drift, maybe Otaru, Sapporo, Asahiyama).
Fix plan 2's weak point: Kanronomori was nearly full — use a Niseko/Kutchan hotel that you can confirm has rooms for Jan 26–30,
and avoid a lonely 1-night Otaru stop unless it clearly helps.
Output: /home/rmng/japan-trip/scripts/plans/final-c.json, "id": "snow-stories".

Research: use agent-browser (your own `--session <plan id>`) and WebFetch on official sites; WebSearch may be out of quota. NEVER use the
desktop tools. No booking, no log-ins. Validate your JSON (places referenced by stops/legs exist; legs connect; day 1 starts at Narita).
Final reply: max 8 lines: route in one line, nights per base, which draft parts you used, what you changed, open risks.

## Update from Pegasis: one backpack only
Pegasis travels with ONE backpack and no suitcase. Plan where he gets everything he needs, as stops in the days:
- Winter clothes early (day 1–2 in Tokyo): warm jacket/down, thermal base layers (Uniqlo HEATTECH), gloves, hat, neck warmer,
  snow-safe boots or shoe spikes (滑り止め), heat packs (カイロ). Name real shops near the route (e.g. Uniqlo/GU Shinjuku, Workman, Don Quijote,
  Montbell, Xebio/Alpen for snow gear) with rough prices.
- Ski/snowboard gear: rent everything at the ski area (skis/board, boots, poles, helmet, AND ski wear jacket+pants, goggles, gloves) —
  name the rental shop (e.g. at Niseko Annupuri/Hirafu, Rusutsu) with prices and whether to reserve.
- Laundry: coin laundry or hotel washer (Dormy Inn / Route Inn have them) every 3–4 days; mark the nights.
- Anything else a light traveller needs (SIM/eSIM if not an ad, adapter, toiletries at konbini/drugstore) as short notes.
- Keep "bookFirst" updated if a rental needs a reservation. Aoki's luggage: assume a normal suitcase unless you see a reason; if the plan moves
  a lot, suggest sending it ahead with a luggage service.
Add these as real stops/notes in the days (short visits, e.g. "Uniqlo Shinjuku, 30 min") and as places with coordinates.
- Pegasis may go home WITH a suitcase: he can buy one in Japan (e.g. Don Quijote, Loft, Bic Camera, ~¥5,000–15,000) and fill it with
  what he bought. Plan when to buy it (late in the trip, before the last moves, or early and send it ahead with a luggage service), and
  keep the checked-bag allowance of his flight home in mind (WestJet cheapest fare may not include a bag; add the bag cost).
- Skiing: Pegasis will teach Aoki himself, so NO ski lesson for Aoki. Plan a gentle beginner area (easy lift, green runs) for the first
  hours, and rental for both.
