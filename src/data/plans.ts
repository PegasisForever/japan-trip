import type { Credit, Place, Plan } from './types'
import oldPhotos from './photos.json'
import ideaPhotos from './ideaPhotos.json'
import ideaList from './ideas.json'
import plannedExp from './plannedExperience.json'
import { firstPhoto } from './gallery'

type Meta = Record<string, Credit>
const OLD = oldPhotos as Meta
const IDEA = ideaPhotos as Meta

const planFiles = import.meta.glob('./plans/*.json', { eager: true, import: 'default' }) as Record<string, Plan>
const routeFiles = import.meta.glob('./routes/*.json', { eager: true, import: 'default' }) as Record<
  string,
  Record<string, [number, number][]>
>

type Exp = Place['experience']
const EXP: Record<string, Exp> = {
  ...Object.fromEntries((ideaList as { id: string; experience?: Exp }[]).map((i) => [i.id, i.experience])),
  ...Object.fromEntries(Object.entries(plannedExp as Record<string, Exp>).map(([k, v]) => [k.replace(/^plan-/, ''), v])),
}

/** Photo of a plan place: reuse the photo of the place or idea it refers to */
function withPhoto(raw: Plan['places'][number]): Place {
  const p = { ...raw, experience: raw.experience ?? (raw.ref ? EXP[raw.ref] ?? EXP[raw.ref.replace(/^plan-/, '')] : undefined) }
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

export const plans: LoadedPlan[] = Object.entries(planFiles)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([file, plan]) => {
    const name = file.split('/').pop()!.replace('.json', '')
    return {
      ...plan,
      places: Object.fromEntries(plan.places.map((p) => [p.id, withPhoto(p)])),
      routes: routeFiles[`./routes/${name}.json`] ?? {},
    }
  })
