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
