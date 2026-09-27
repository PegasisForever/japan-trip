import type { Day, Place } from './types'
import { plan } from './plan'

export const { days, places } = plan

const at = (iso: string) => new Date(iso + 'T12:00:00')

/** "Thu, Jan 21" */
export function dateLong(day: Day) {
  return at(day.date).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
}

/** "Jan 21" */
export function dateShort(day: Day) {
  return at(day.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

/** "Jan 18 – Feb 1, 2027", from the plan itself */
export function tripRange() {
  const a = at(days[0].date)
  const b = at(days[days.length - 1].date)
  const md = (d: Date) => d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
  return `${md(a)} – ${md(b)}, ${b.getFullYear()}`
}

function todayIso() {
  const t = new Date()
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

/** The day of the trip that is today, if the trip is on now */
export function today(): Day | null {
  return days.find((d) => d.date === todayIso()) ?? null
}

/** Days until the first day; 0 or less when the trip has started */
export function daysToGo() {
  return Math.round((at(days[0].date).getTime() - at(todayIso()).getTime()) / 86400000)
}

/** Consecutive nights at the same hotel */
export function stays() {
  const out: { place: Place; nights: number; from: Day }[] = []
  for (const d of days) {
    if (!d.sleep || !places[d.sleep]) continue
    const last = out[out.length - 1]
    if (last && last.place.id === d.sleep) last.nights += 1
    else out.push({ place: places[d.sleep], nights: 1, from: d })
  }
  return out
}

/** The amount at the start of a cost text, without the breakdown: "≈ ¥126,000 per person (...)" → "≈ ¥126,000" */
export function headline(text: string) {
  return text
    .split(' · ')
    .map((part) => part.split(/ \(|\. |, plus | \+ |; /)[0].replace(/ per person$/, '').trim())
    .join(' · ')
}

/** Numbered places of a day, in the order they are first visited */
export function stopOrder(day: Day) {
  const order = new Map<string, number>()
  for (const st of day.stops) if (!order.has(st.place)) order.set(st.place, order.size + 1)
  return order
}

export const legKey = (day: Day, i: number) => `${day.n}-${i}`

export function legByKey(key: string) {
  const [n, i] = key.split('-').map(Number)
  const day = days.find((d) => d.n === n)
  const leg = day?.legs[i]
  return day && leg ? { day, leg } : null
}

/** Directions links: Apple Maps on iPhone, Google Maps everywhere */
export function mapLinks(p: Place) {
  const q = encodeURIComponent(p.ja || p.en)
  return {
    apple: `https://maps.apple.com/?q=${q}&ll=${p.lat},${p.lon}`,
    google: `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`,
  }
}
