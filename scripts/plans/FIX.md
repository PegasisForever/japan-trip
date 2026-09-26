# Brief: fix a final plan using the check reports

Plan file (edit it in place, keep the same format, see PLAN.md): given in your task. A backup is final-<x>.draft.json.
Check reports for this plan: check-<x>-1.json, check-<x>-2.json, check-<x>-3.json (in /home/rmng/japan-trip/scripts/plans/).
Apply EVERY "wrong" item and every "risky" item where the report gives a clear fix. For "unknown" items, add a short note in the day's
"notes" or "alerts" (e.g. "confirm on Dec 1 when the kart times come out") — do not invent an answer.

Decisions from the travellers and from the checks that apply to all plans:
- Aoki is male (he/him). Pegasis teaches Aoki to ski: remove every ski lesson for Aoki (and its cost); plan a beginner area and lift instead.
- Rusutsu snow drift: the 30-min self-drive course (¥31,000) runs only at 15:00; the pro ride is ¥17,000 per person; email Rusutsu about the
  1-year licence + IDP before booking (10% cancel fee from booking). Re-time the day so the drive back is before sunset (~16:40) or on a
  known road; if needed, move skiing to the morning.
- Suzuka EV kart: runs only about 12:00–13:15 on open weekdays/weekends in late January; times for 2027 come out on Dec 1, 2026. Plan for ~12:30.
- Toyota Rent a Car takes bookings 6 months ahead: the cars can be booked NOW. Put this first in "bookFirst", with studless tyres.
- Ski rental online discount (10%) only until Oct 31, 2026 (code shown on the Rhythm site). Put it in "bookFirst" with that date.
- Hotel Three M (Kutchan) has only smoking twins left: replace it with another Kutchan/Niseko hotel with non-smoking twins that shows rooms
  (check Jalan/Rakuten/official site with agent-browser), or keep it only if nothing else is reasonable and say so.
- GARAKU soup curry moved to Minami 3-jo Higashi 2-chome (fix the place coordinates and walk times).
- Pegasis: one backpack; the gear he needs for skiing must travel with him, not in a suitcase sent ahead.
- Update prices that the reports corrected, then update "cost" totals and "bookFirst" (order by urgency, each with a date).
Research new facts with agent-browser (session name given in your task) or WebFetch; never the desktop tools. No bookings.
Keep days realistic. Validate the JSON (places exist, legs connect, day 1 starts at Narita) when done.
Final reply: max 6 lines: what you changed, anything you could not fix.
