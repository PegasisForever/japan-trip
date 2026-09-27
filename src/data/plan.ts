import type { Credit, Day, Kind, Place, Plan } from './types'
import oldPhotos from './photos.json'
import ideaPhotos from './ideaPhotos.json'
import ideaList from './ideas.json'
import plannedExp from './plannedExperience.json'
import { firstPhoto } from './gallery'
import planJson from './plan.json'
import planRoutes from './planRoutes.json'

type Meta = Record<string, Credit>
const OLD = oldPhotos as Meta
const IDEA = ideaPhotos as Meta

type Exp = Place['experience']
const EXP: Record<string, Exp> = {
  ...Object.fromEntries((ideaList as { id: string; experience?: Exp }[]).map((i) => [i.id, i.experience])),
  ...Object.fromEntries(Object.entries(plannedExp as Record<string, Exp>).map(([k, v]) => [k.replace(/^plan-/, ''), v])),
}

/** Photo of a place: reuse the photo of the place or idea it refers to */
function withPhoto(raw: Plan['places'][number], sharedRef: boolean): Place {
  const p = { ...raw, experience: raw.experience ?? (raw.ref ? EXP[raw.ref] ?? EXP[raw.ref.replace(/^plan-/, '')] : undefined) }
  // Several places made from one idea (Meiji Jingu, Takeshita, PARCO): each shows its own photos, not the idea's one photo
  const own = sharedRef ? firstPhoto(p.id) : undefined
  if (own) return { ...p, photo: own.src, credit: own.credit, galleryKey: p.id } as Place
  for (const key of [p.ref, p.id].filter(Boolean) as string[]) {
    const k = key.replace(/^plan-/, '')
    if (OLD[k]) return { ...p, photo: `${k}.jpg`, credit: OLD[k], id: p.id, galleryKey: k } as Place
    if (IDEA[key]) return { ...p, photo: `ideas/${key}.jpg`, credit: IDEA[key], id: p.id, galleryKey: key } as Place
  }
  const key = p.ref ?? p.id
  const first = firstPhoto(key) ?? firstPhoto(p.id)
  return { ...p, galleryKey: firstPhoto(key) ? key : p.id, ...(first ? { photo: first.src, credit: first.credit } : {}) } as Place
}

export interface LoadedPlan extends Omit<Plan, 'places'> {
  places: Record<string, Place>
  routes: Record<string, [number, number][]>
}

/** Photo for the day card: the given cover, else the first real sight of the day that has a photo */
function coverOf(day: Day, places: Record<string, Place>): string {
  if (day.cover && places[day.cover]) return day.cover
  const plain: Kind[] = ['hotel', 'station', 'airport']
  const withPic = day.stops.map((s) => places[s.place]).filter((p) => p?.photo)
  return (withPic.find((p) => !plain.includes(p.kind)) ?? withPic[0] ?? places[day.stops[0].place]).id
}

const raw = planJson as unknown as Plan
const refCount: Record<string, number> = {}
for (const p of raw.places) if (p.ref) refCount[p.ref] = (refCount[p.ref] ?? 0) + 1
const places = Object.fromEntries(raw.places.map((p) => [p.id, withPhoto(p, !!p.ref && refCount[p.ref] > 1)]))

export const plan: LoadedPlan = {
  ...raw,
  days: raw.days.map((d) => ({ ...d, cover: coverOf(d, places) })),
  places,
  routes: planRoutes as unknown as Record<string, [number, number][]>,
}
