import type { Idea, IdeaCategory, Kind, Place } from './types'
import raw from './ideas.json'
import credits from './ideaPhotos.json'
import plannedExp from './plannedExperience.json'
import removed from './removed.json'
import { days, places } from './index'
import { buildTimeline, fmtLength } from './timeline'

const photoMeta = credits as Record<string, { author: string; license: string; url: string }>
const expOf = plannedExp as Record<string, Idea['experience']>

/** Suggestions from the research helpers, with a photo where one was found */
const researched: Idea[] = (raw as Idea[]).map((i) => {
  const c = photoMeta[i.id]
  return c ? { ...i, photo: `ideas/${i.id}.jpg`, credit: c } : i
})

const CATEGORY_OF: Partial<Record<Kind, IdeaCategory>> = {
  anime: 'anime',
  car: 'cars',
  ski: 'snow',
  fuji: 'scenery',
  food: 'food',
  sight: 'culture',
  onsen: 'onsen',
}

/** Price-like facts from a place's info rows, e.g. "Entry: ¥1,000" */
function costOf(p: Place) {
  const rows = (p.info ?? []).filter((r) => /cost|price|entry|ticket|toll|fare|pass|set|bowl|lunch|ropeway/i.test(r.label) && /¥|free/i.test(r.value))
  return rows.map((r) => `${r.label}: ${r.value}`).join('; ')
}

/**
 * Places already in the day plan, so they can be kept or removed like any idea.
 * Hotels, stations, airports and car pickups are left out: they are logistics, not choices.
 */
const planned: Idea[] = Object.values(places)
  .filter((p) => CATEGORY_OF[p.kind] && !p.id.startsWith('rental-'))
  .map((p) => {
    const onDays = days.filter((d) => d.stops.some((s) => s.place === p.id))
    let stay = 0
    for (const d of onDays)
      for (const seg of buildTimeline(d)) if (seg.kind === 'stop' && seg.stop.place === p.id && !seg.open) stay += seg.t1 - seg.t0
    const note = onDays.flatMap((d) => d.stops.filter((s) => s.place === p.id && s.note).map((s) => s.note as string))[0]
    return {
      id: `plan-${p.id}`,
      kind: 'planned',
      category: CATEGORY_OF[p.kind] as IdeaCategory,
      title: p.en,
      titleJa: p.ja,
      summary: p.blurb,
      why: note ? `In the plan: ${note}` : '',
      days: onDays.map((d) => d.n),
      duration: stay ? fmtLength(stay) : 'Evening',
      cost: costOf(p),
      winter: 'ok',
      winterNote: '',
      lat: p.lat,
      lon: p.lon,
      anime: p.anime,
      sources: (p.links ?? []).map((l) => l.url),
      tips: p.tips,
      experience: expOf[`plan-${p.id}`],
      area: 'plan',
      photo: p.photo,
      credit: p.credit,
    } satisfies Idea
  })
  .filter((i) => i.days.length > 0 && !(i.id in removed))

export const ideas: Idea[] = [...planned, ...researched]
