import type { Place } from './types'
import { days, rawPlaces } from './trip'
import credits from './photos.json'

const photoMeta = credits as Record<string, { author: string; license: string; url: string }>

export const places: Record<string, Place> = Object.fromEntries(
  rawPlaces.map((p) => {
    const c = photoMeta[p.id]
    return [p.id, c ? { ...p, photo: `${p.id}.jpg`, credit: { author: c.author, license: c.license, url: c.url } } : p]
  }),
)

export { days }
export { trip } from './trip'
