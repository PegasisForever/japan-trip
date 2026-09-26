# Bargain hunt brief

Trip: 2 adults (Pegasis from Toronto, Aoki from Shanghai), Japan, Tue Jan 19 – Tue Feb 2, 2027. Budget: reasonable.
Read /home/rmng/japan-trip/scripts/ideas/SCHEMA.md for the baseline day plan. Current hotels (twin room for 2 unless noted):
  Jan 19, 20, 21, 23: Hotel Gracery Shinjuku (~¥26,000/night) · Jan 22: Hotel Route-Inn Kawaguchiko (~¥16,000–22,000)
  Jan 24: onsen ryokan in Zao Onsen, 2 meals (~¥20,000–30,000 per person) · Jan 25: Dormy Inn Sendai Ekimae (~¥14,000–20,000)
  Jan 26: La Vista Hakodate Bay (~¥20,000–28,000) · Jan 27, 28: Hotel 3M Kutchan (~¥8,500 pp) · Jan 29: Dormy Inn Asahikawa
  Jan 30: Natulux Hotel Furano · Jan 31: Dormy Inn Premium Sapporo (both), Feb 1: Sapporo (Aoki, single) + Toyoko Inn Narita Airport (Pegasis, single)
Transport now: N'EX, Tsubasa Tokyo→Yamagata ¥11,670, Hayabusa Sendai→Shin-Hakodate ¥18,500, rental cars (Tokyo 2 days, Hokkaido 5 days one-way Hakodate→Sapporo), ski lifts Zao and Niseko.

Goal: find REAL, CURRENT bargains that save money or give more for the same money on this trip. Dig deep:
compare several sources, look for member prices, direct-booking discounts, bundles, foreigner-only passes/fares,
coupons, lunch sets, time-based discounts, free things. For each bargain say the normal price vs the deal price.

RULES
- Read only. Never log in, create accounts, enter personal or payment data, or book/reserve anything.
- Never use the desktop / Firefox unless your task says you are the desktop agent.
- For web pages use WebFetch, and the headless browser CLI `agent-browser` (e.g. `agent-browser open <url>`,
  `agent-browser snapshot`, `agent-browser get text body`, `agent-browser screenshot <path>`); WebSearch may be out of quota.
  Use your own agent-browser session name: add `--session <your-area>` to every agent-browser command.
- Research in English, Japanese and Chinese sources.
- Prices for Jan 2027 may not be published; then use the current price for the same season/weekday and say so.

OUTPUT: a JSON array in the SCHEMA.md format, written to /home/rmng/japan-trip/scripts/ideas/deals-<your-area>.json, with:
  "category": "deal", "kind": "addon" (or "swap" if it replaces a hotel/transport in the plan),
  "days": baseline days it applies to, "cost": "deal price vs normal price", "why": "how much you save and how",
  "winterNote": "conditions: book by when, where, limits",
  "sources": [booking/info URLs], plus an "experience" field: {"hook": one line, "moments": 3–5 concrete steps to get the deal, "tip": one line}.
  Aim for 8–15 strong bargains. Valid JSON. Final reply: 3 lines.
