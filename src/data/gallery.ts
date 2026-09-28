import type { Credit } from './types'
import raw from './gallery.json'
import { photoUrl } from './photos'

export interface Photo {
  /** Size for the panel (about 960 px wide) */
  mid: string
  /** Size for the full-screen view */
  big: string
  credit?: Credit
}

const extra = raw as Record<string, { big: string; mid: string; url: string; author: string; license: string }[]>

/** Main photo first, then the extra photos found for this place or idea */
export function photosFor(id: string, main?: string, credit?: Credit): Photo[] {
  const list: Photo[] = []
  if (main) list.push({ mid: photoUrl(main, 1280), big: photoUrl(main, 1280), credit })
  // A planned place in the Ideas list uses the gallery of the place itself
  const key = extra[id] ? id : id.replace(/^plan-/, '')
  for (const p of extra[key] ?? []) {
    if (main && (p.mid === main || p.big === main)) continue
    // Gallery photos are copies on our own host ("g/<file>.jpg"), in the same sizes as the main photos
    list.push({ mid: photoUrl(p.mid, 1280), big: photoUrl(p.big, 1280), credit: { author: p.author, license: p.license, url: p.url } })
  }
  return list
}

/** First extra photo of a place, used as its main photo when it has no photo of its own */
export function firstPhoto(key: string): { src: string; credit: Credit } | null {
  const p = extra[key]?.[0]
  return p ? { src: p.mid, credit: { author: p.author, license: p.license, url: p.url } } : null
}
