# Photo gallery brief

Goal: for every item in your part file, pick 4 to 6 EXTRA real photos (the item already has one main photo),
so the traveller can swipe through them and see what the place is really like.

Tool (run from /home/rmng/japan-trip/scripts):
  python3 gallery.py search <id> "<query>" ["<query2>" ...]
      Collects up to 15 Wikimedia Commons candidates and makes a contact sheet image (path is printed).
      Try "Category:<Commons category name>" first when the place has one (e.g. "Category:Nakano Broadway"),
      then plain words (English, and Japanese names often work too, e.g. "中野ブロードウェイ").
  Look at the contact sheet with the Read tool, then:
  python3 gallery.py pick <id> <index> <index> ...     (best first; 4–6 photos)

How to choose:
- The photo must clearly show THIS place (or for an anime spot, the real location; for a food place, the food or the shop).
- Prefer variety: outside view, inside, the key view/detail, food/exhibit, winter or night if available.
- Prefer sharp, well-lit, landscape photos; skip maps, logos, documents, blurry, people-portrait-focused, duplicates.
- For multi-day plans / routes: pick one strong photo per main stop of the route.
- For hotels/stations/airports: 3–4 photos is enough (building, room or lobby, view).
- If no good candidates after 3 different searches, pick what is good (even 1–2) or skip and say so.
Do not edit any other files. Wikimedia may rate-limit: the tool waits and retries by itself; do not run searches in parallel.
Final reply: 3 lines: how many items got photos, which items have fewer than 3, any problem.
