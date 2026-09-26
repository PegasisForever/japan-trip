/** One small icon set, drawn on a 20px grid with a 1.75 stroke, so every icon has the same weight. */
export const ICON_PATHS = {
  check: 'M4.5 10.5l3.5 3.5 7.5-8',
  maybe: 'M7.4 7.6a2.7 2.7 0 1 1 3.7 2.5c-.7.3-1.1.9-1.1 1.6v.6M10 15.2v.1',
  cross: 'M5.5 5.5l9 9M14.5 5.5l-9 9',
  close: 'M5.5 5.5l9 9M14.5 5.5l-9 9',
  left: 'M12 4.5L6.5 10l5.5 5.5',
  right: 'M8 4.5l5.5 5.5L8 15.5',
  down: 'M4.5 8l5.5 5.5L15.5 8',
  up: 'M4.5 12.5L10 7l5.5 5.5',
  arrow: 'M3.5 10h13M12 5.5l4.5 4.5-4.5 4.5',
  alert: 'M10 3.2l7.4 13H2.6L10 3.2zM10 8.2v3.6M10 14.1v.1',
  copy: 'M7 7h9v9H7zM4 13V4h9',
  external: 'M11 4h5v5M16 4l-7 7M14 11.5V16H4V6h4.5',
  pin: 'M10 17.5s5.5-5 5.5-9a5.5 5.5 0 0 0-11 0c0 4 5.5 9 5.5 9zM10 10.2a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z',
  cards: 'M3.5 5h13M3.5 10h13M3.5 15h8',
  bed: 'M2.5 15.5V5M2.5 12h15v3.5M17.5 12V9.5a2 2 0 0 0-2-2H9V12M5.5 10.2a1.2 1.2 0 1 0 0-.1',
  clock: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 6v4l2.5 1.5',
  temp: 'M8 11.8V4.5a2 2 0 1 1 4 0v7.3a3.5 3.5 0 1 1-4 0zM10 8.5v5',
  info: 'M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM10 9v4.5M10 6.5v.1',
  meal: 'M6.5 3v4.5a1.5 1.5 0 0 0 3 0V3M8 3v14M14.5 17V3c-1.8.8-2.8 3-2.8 5.6 0 1.4.9 2.4 2.8 2.4',
  moon: 'M16 12.5A6.5 6.5 0 0 1 7.5 4a6.5 6.5 0 1 0 8.5 8.5z',
  sun: 'M10 13.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM10 2.5V4M10 16v1.5M2.5 10H4M16 10h1.5M4.7 4.7l1.1 1.1M14.2 14.2l1.1 1.1M4.7 15.3l1.1-1.1M14.2 5.8l1.1-1.1',
} as const

export type IconName = keyof typeof ICON_PATHS

/** Same icon as an HTML string, for markers that MapLibre builds outside React */
export function iconHtml(name: IconName, size = 12) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICON_PATHS[name]}"/></svg>`
}
