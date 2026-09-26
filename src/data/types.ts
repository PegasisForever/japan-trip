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

export type Region = 'tokyo' | 'fuji' | 'tohoku' | 'hokkaido'

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
  cover: string
}

export type IdeaKind = 'addon' | 'swap' | 'plan'
export type IdeaCategory = 'anime' | 'cars' | 'snow' | 'onsen' | 'food' | 'scenery' | 'culture' | 'city' | 'nature'

/** A suggestion the travellers can accept or reject before detailed planning */
export interface Idea {
  id: string
  kind: IdeaKind
  category: IdeaCategory
  title: string
  titleJa: string
  summary: string
  why: string
  days: number[]
  duration: string
  cost: string
  winter: 'ok' | 'check' | 'no'
  winterNote: string
  lat: number
  lon: number
  route?: [number, number][]
  places?: { en: string; ja: string; lat: number; lon: number }[]
  anime?: string
  photoQuery?: string
  sources: string[]
  /** What you will do there: a hook line, concrete moments, one insider tip */
  experience?: { hook: string; moments: string[]; tip?: string }
  /** Which research area it came from */
  area: string
  photo?: string
  credit?: Credit
}

export type Verdict = 'yes' | 'maybe' | 'no'
export interface Choice {
  verdict?: Verdict
  note?: string
}
