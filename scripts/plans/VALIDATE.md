# Brief: check that a plan is feasible

You check one part of a final trip plan (JSON, format described in /home/rmng/japan-trip/scripts/plans/PLAN.md).
For EVERY item in your days, check it against the real, current source — go to the official website with the
headless browser CLI `agent-browser` (use your own session: `--session <your-id>`; e.g. `agent-browser --session v1 open <url>`,
`agent-browser --session v1 get text body`, `agent-browser --session v1 snapshot`) or WebFetch. WebSearch may be out of quota.
NEVER use the desktop tools. No booking, no log-ins, no personal data.

Check for each day:
- Places: open on that date and at that time in late January 2027 (closed days, winter hours, seasonal closures, holidays), entry price.
- Events with dates (Nara hill burning, Suzuka open days, penguin walk, festivals, SHELTER shows): date and time.
- Transport: the train/bus/flight exists and runs at that time on that weekday (or a very close one), duration and fare
  (use timetable sites: JR, Kintetsu, Jorudan/Navitime/ekitan, airline sites). Driving times are realistic in winter, driving in daylight.
- Rental cars: the shop exists at that address, opening hours cover pickup/drop, one-way return allowed, licence rules (1-year licence + IDP), winter tyres.
- Hotels: the hotel exists, has twin rooms, rough price for that night (Jalan/Rakuten/official site or Google Hotels), laundry if the plan says so.
- Shops for gear/clothes and ski rental: exist, open, rough prices, reservation needs.
- Times add up: travel + stay fit, no impossible transfers, the last train/ropeway/bus is not missed.
- Also check the plan's "bookFirst" items that concern your days (booking open dates).

Write your report as JSON to the output path in your task:
{"part": "...", "checked": <number of items>, "issues": [
   {"day": 3, "item": "short name", "status": "wrong|risky|unknown",
    "problem": "what is wrong (1 sentence)", "evidence": "URL(s) you checked", "fix": "concrete change (1–2 sentences)"}
 ], "ok": ["short list of important items you confirmed, with URL"]}
Only list real issues (wrong, risky or impossible to confirm). Be concrete and short. Do not edit the plan file.
Final reply: 3 lines: items checked, number of issues by status, the worst issue.
