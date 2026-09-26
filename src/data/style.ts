import type { Kind, Mode, Region } from './types'

export const MODE_COLOR: Record<Mode, string> = {
  drive: '#ff9a3c',
  shinkansen: '#35d08a',
  train: '#6fb7ff',
  bus: '#f5d547',
  flight: '#e8e4ff',
  walk: '#ffffff',
  ropeway: '#ff7fb0',
}

export const MODE_LABEL: Record<Mode, string> = {
  drive: 'Drive',
  shinkansen: 'Shinkansen',
  train: 'Train',
  bus: 'Bus',
  flight: 'Flight',
  walk: 'Walk',
  ropeway: 'Ropeway',
}

export const KIND_LABEL: Record<Kind, string> = {
  anime: 'Anime spot',
  car: 'Cars',
  ski: 'Ski',
  fuji: 'Mt Fuji',
  food: 'Food',
  sight: 'Sight',
  onsen: 'Onsen',
  hotel: 'Stay',
  station: 'Station',
  airport: 'Airport',
}

export const REGION: Record<Region, { en: string; ja: string; color: string }> = {
  tokyo: { en: 'Tokyo & Kawasaki', ja: '東京・川崎', color: '#e8538f' },
  fuji: { en: 'Hakone & Mt Fuji', ja: '箱根・富士山', color: '#4f8df5' },
  tohoku: { en: 'Tohoku', ja: '東北', color: '#2fbf7a' },
  hokkaido: { en: 'Hokkaido', ja: '北海道', color: '#27b5d6' },
}

export const CATEGORY: Record<string, { label: string; color: string }> = {
  anime: { label: 'Anime', color: '#e8538f' },
  cars: { label: 'Cars', color: '#ff9a3c' },
  snow: { label: 'Snow & ski', color: '#6fb7ff' },
  onsen: { label: 'Onsen', color: '#2fbfb0' },
  food: { label: 'Food', color: '#e0b43c' },
  scenery: { label: 'Scenery', color: '#7bc86c' },
  culture: { label: 'Culture', color: '#b58cf0' },
  city: { label: 'City', color: '#9aa8b8' },
  nature: { label: 'Nature', color: '#4fae6a' },
}

export const KIND_TEXT = {
  addon: 'Add to a day',
  swap: 'Replace days',
  plan: 'New route',
} as const

export const VERDICT = {
  yes: { label: 'Want', color: '#2fbf7a' },
  maybe: { label: 'Maybe', color: '#e0a82e' },
  no: { label: 'Not interested', color: '#8a96a3' },
} as const
