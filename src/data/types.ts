export type Kind =
  | 'anime'
  | 'car'
  | 'ski'
  | 'fuji'
  | 'food'
  | 'sight'
  | 'onsen'
  | 'hotel'
  | 'station'
  | 'airport'

export type Mode = 'drive' | 'shinkansen' | 'train' | 'bus' | 'flight' | 'walk' | 'ropeway'

export interface Credit {
  author: string
  license: string
  url: string
}

export interface Place {
  id: string
  en: string
  /** Name as written on signs in Japan */
  ja: string
  /** Reading in romaji, shown under the Japanese name */
  romaji?: string
  lat: number
  lon: number
  kind: Kind
  blurb: string
  anime?: string
  tips?: string[]
  info?: { label: string; value: string }[]
  links?: { label: string; url: string }[]
  photo?: string
  credit?: Credit
  /** What to do there: hook line, steps, tip (from the research) */
  experience?: { hook: string; moments: string[]; tip?: string }
  /** Key of the extra photo gallery (defaults to id) */
  galleryKey?: string
}

export interface Stop {
  place: string
  time?: string
  note?: string
  /** Only one of the two travellers does this stop */
  who?: 'Pegasis' | 'Aoki'
}

export interface Leg {
  from: string
  to: string
  mode: Mode
  label: string
  duration?: string
  who?: 'Pegasis' | 'Aoki'
  /** Points the line must pass through, [lon, lat] (for example a transfer station) */
  via?: [number, number][]
}

export type Region = 'tokyo' | 'fuji' | 'chubu' | 'kansai' | 'tohoku' | 'hokkaido'

export interface Day {
  n: number
  /** One or two words for the tab */
  short: string
  /** Typical low – high temperature for the place */
  temp: string
  /** The few things that must not be forgotten today */
  alerts: string[]
  /** Set on days when the two travellers are in different places */
  split?: string
  date: string
  weekday: string
  region: Region
  title: string
  titleJa: string
  romaji: string
  summary: string
  stops: Stop[]
  legs: Leg[]
  sleep?: string
  sleepNote?: string
  notes?: string[]
  cost?: string
  /** Place whose photo is the day card. Plans without it get one when they load (plans.ts). */
  cover: string
}

/** One complete trip option */
export interface Plan {
  id: string
  name: string
  tagline: string
  summary: string
  who: { pegasis: string; aoki: string }
  cost: { transport: string; hotels: string; activities: string; total: string }
  flights: string[]
  /** Where each place comes from, to reuse its photos */
  places: (Place & { ref?: string | null })[]
  days: Day[]
}
