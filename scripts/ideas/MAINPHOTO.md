# Main photo picking brief

Each idea needs ONE main photo (the card thumbnail and first gallery photo). Candidates (up to 5 per idea) are already downloaded.
Your ids are in the part file given in your task (one id per line). Idea details (title, summary) are in /home/rmng/japan-trip/src/data/ideas.json.

From /home/rmng/japan-trip/scripts, make contact sheets of 8 ids at a time:
  python3 idea_photos.py sheet /tmp/claude-1000/-home-rmng-japan-trip/6dca0d6b-e9ae-4d2b-abbf-b88742096826/scratchpad/mp-<part>-<n>.jpg <id> <id> ...
Look at each sheet with the Read tool. For each id pick the index (0–4) of the photo that best shows what the idea is
(the hotel/shop/place itself; for food deals the dish or the shop; for passes/money tips a relevant place, e.g. the station or airport;
for multi-day plans the most iconic stop). If none fits, use null.
Write your picks as a JSON object {"<id>": <index or null>, ...} to /home/rmng/japan-trip/scripts/ideas/photo-picks-<part>.json
(write it after each sheet, so nothing is lost). Do not edit other files. Final reply: 2 lines (how many picked, how many null).
