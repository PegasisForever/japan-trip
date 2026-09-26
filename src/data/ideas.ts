import type { Idea } from './types'
import raw from './ideas.json'
import credits from './ideaPhotos.json'

const photoMeta = credits as Record<string, { author: string; license: string; url: string }>

/** Suggestions from the research helpers, with a photo where one was found */
export const ideas: Idea[] = (raw as Idea[]).map((i) => {
  const c = photoMeta[i.id]
  return c ? { ...i, photo: `ideas/${i.id}.jpg`, credit: c } : i
})
