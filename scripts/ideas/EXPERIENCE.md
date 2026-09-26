# "What you will do there" — writing brief

Travellers: two friends in their 20s–30s (from Toronto and Shanghai), Japan trip Jan 19 – Feb 2, 2027 (deep winter).
They love anime pilgrimage, JDM cars / driving, skiing (one good skier, one beginner), onsen, Mt Fuji, good food.
One of them has ADHD: long text is hard. Make every line concrete and vivid.

For EACH idea of your area in /home/rmng/japan-trip/src/data/ideas.json (field "area"), research the real place
(English, Japanese AND Chinese sources: official sites, Japanese blogs, 小红书/知乎/马蜂窝, YouTube descriptions, reviews)
and write:

{
  "<idea id>": {
    "hook": "One exciting line, max 14 words. What makes this special. No hype words like 'amazing', 'breathtaking', 'must-see'.",
    "moments": [
      "3 to 5 concrete things you will do / see / eat / feel there, in the order you would do them.",
      "Each max 22 words, start with a verb (Walk..., Eat..., Stand..., Drive..., Soak...).",
      "Use real specifics: names of dishes, rooms, exhibits, views, sounds, temperatures, which scene of the anime.",
      "Winter-specific when it matters (snow, lights, ice, warm food)."
    ],
    "tip": "One insider tip that makes it better (timing, where to stand, what to order, how to skip a queue). Max 25 words."
  }
}

For multi-day plans ("kind": "plan"), moments = the 4–5 best highlights across the days, each naming the place.
Plain, simple English. Short sentences. No invented facts: if you are unsure about a detail, leave it out.
Write the JSON object to /home/rmng/japan-trip/scripts/ideas/experience-<area>.json (valid JSON, all ids of your area).
Final reply: 2 lines only.
