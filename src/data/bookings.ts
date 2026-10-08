import notion from './notion.json'

/**
 * The trip notes live in Notion: one page per day, and a table of what to book (each row is a page).
 * The app only links there; Notion has the details and the "Booked" ticks.
 */
export interface Booking {
  id: string
  /** Short name for the app; the Notion row has the full title */
  name: string
  notion: string
  /** The places it is for, on each day: [day, place id] */
  at: [number, string][]
  /** Days it is for without a place of its own (a train between two places) */
  days?: number[]
}

export const bookings = notion.bookings as Booking[]

/** The Notion page that holds the bookings table and the day pages */
export const tripPage = notion.trip

/** The day's Notion page: notes before the day, money spent on it */
export function dayPage(n: number): string | undefined {
  return (notion.days as Record<string, string>)[n]
}

/** What to book for this day */
export function bookingsOfDay(n: number) {
  return bookings.filter((b) => b.at.some(([d]) => d === n) || b.days?.includes(n))
}

/** What to book for this place: on that day, or on any day when there is no day */
export function bookingsOfPlace(id: string, day: number | null) {
  return bookings.filter((b) => b.at.some(([d, p]) => p === id && (day == null || d === day)))
}

/**
 * A link into the app from Notion: "#day-4" is day 4, "#day-4/edosan" is a place on day 4.
 * The same link works on the phone and the desktop.
 */
export function readLink(hash: string): { day: number; place: string | null } | null {
  const m = /^#day-(\d+)(?:\/([\w-]+))?$/.exec(hash)
  return m ? { day: Number(m[1]), place: m[2] ?? null } : null
}
