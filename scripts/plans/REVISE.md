# Brief: revise a final plan with new rules from the travellers

Plan file: given in your task (edit in place; same JSON format as PLAN.md; a backup is final-<x>.fixed1.json).
Aoki is male (he/him). Keep everything that is good; change only what these rules need.

1. **Pegasis already brings thick winter clothes** (Canadian winter). Remove all winter-clothes shopping (Uniqlo/Workman/Montbell/outlet
   jacket stops, their costs and bookFirst items). Keep ski rental (incl. ski wear if useful), goggles/gloves only if the rental shop does not
   rent them, and the suitcase he buys for the way home (keep it simple). Gotemba outlets may stay only as a plain shopping want.
2. **They travel together: no split routes.** Remove every "who" on stops and legs and every "split" field. Where the two wanted different
   things at the same time, pick ONE plan for both (the one that fits the day best, or do both one after the other if time allows), and
   say in the day's notes whose want it serves. Update "who" at the top of the plan (what is in / out for each person).
3. **Every night:** "sleep" names the hotel (already there — keep it right).
4. **Every meal is a stop:** breakfast, lunch and dinner each day, as stops with a time and a real place (kind "food", or the hotel for a hotel
   breakfast/dinner; a konbini or ekiben is fine when it is realistic, name it). Prefer good-value places from the bargains in
   /home/rmng/japan-trip/src/data/ideas.json (category "deal"/"food") and places the travellers wanted (Daruma, GARAKU, Omoide Yokocho, etc.).
   Check each new restaurant with agent-browser (open, that weekday, hours, rough price per person) and give its real coordinates and Japanese name.
   Keep meals near the route: do not add travel just for a meal.
5. **Every train and bus leg names the exact service** in "label": line + train name/number or bus route number and departure time,
   e.g. "Nozomi 215, Tokyo 09:21 → Shin-Osaka 11:48", "Kintetsu Nara Line rapid express, Osaka-Namba 16:40 → Kintetsu-Nara 17:18",
   "Keikyu airport bus / Airport Limousine 'TYO-NRT' 17:40", "Kyoto City Bus 205, Kitaoji BT 11:05 → Kyoto Station".
   Look the services up (JR Central/JR East/JR Hokkaido, Kintetsu, Hankyu, Toei, city bus timetables, Navitime/Jorudan/ekitan) with agent-browser;
   use the January (or current) weekday/weekend timetable for that date. Flights: airline + flight number + times.
   Times of stops and legs must match these services.
6. Keep days realistic (meals make the timeline longer — drop a weak sight rather than cramming), and keep daylight driving on snowy roads.
7. Update "cost" and "bookFirst" if they change. Validate the JSON (places exist, legs connect in order, day 1 starts at Narita, no "who"/"split").
Research with agent-browser (session name in your task) or WebFetch; never the desktop tools; no bookings.
Final reply: max 6 lines: what changed, what you could not confirm.
