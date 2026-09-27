import type { Day, Leg, Stop } from './types'

/** "2 h 30", "80 min", "3 h (winter)", "1 h" → minutes */
export function minutes(duration?: string): number {
  if (!duration) return 15
  const h = /(\d+(?:\.\d+)?)\s*h(?:\s*(\d+))?/.exec(duration)
  if (h) return Math.round(Number(h[1]) * 60 + Number(h[2] ?? 0))
  const m = /(\d+)\s*min/.exec(duration)
  return m ? Number(m[1]) : 15
}

function clock(t?: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t ?? '')
  return m ? Number(m[1]) * 60 + Number(m[2]) : null
}

export function fmtClock(min: number) {
  const h = Math.floor(min / 60) % 24
  return `${String(h).padStart(2, '0')}:${String(Math.round(min % 60)).padStart(2, '0')}`
}

export function fmtLength(min: number) {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return m ? `${h} h ${m}` : `${h} h`
}

export type Segment =
  | { kind: 'leg'; t0: number; t1: number; leg: Leg }
  | { kind: 'stop'; t0: number; t1: number; stop: Stop; index: number; open: boolean }

/** Groups the day's legs by the stop they lead to. */
export function legsBeforeStops(day: Day) {
  const before: Leg[][] = []
  let j = 0
  for (const s of day.stops) {
    // Already here (the day starts at this place, or the stop repeats the place): no travel before it.
    // Without this, a day that starts and ends at the hotel puts all of its travel before the first stop.
    if (day.legs[j]?.from === s.place) {
      before.push([])
      continue
    }
    const k = day.legs.findIndex((l, i) => i >= j && l.to === s.place)
    if (k === -1) before.push([])
    else {
      before.push(day.legs.slice(j, k + 1))
      j = k + 1
    }
  }
  return { before, after: day.legs.slice(j) }
}

const LAST_STAY = 120

/**
 * Turns a day into time segments: travel, then a stay, then travel...
 * A stay lasts from its arrival time until the travel to the next stop has to start.
 */
export function buildTimeline(day: Day): Segment[] {
  const { before, after } = legsBeforeStops(day)
  const travel = before.map((ls) => ls.reduce((a, l) => a + minutes(l.duration), 0))
  const arrive = day.stops.map((s) => clock(s.time))
  const segs: Segment[] = []
  let cursor: number | null = null

  day.stops.forEach((stop, k) => {
    // No clock time: you get there when the travel from the stop before ends
    const a = arrive[k] ?? (cursor != null ? cursor + travel[k] : 8 * 60)
    let t = a - travel[k]
    for (const leg of before[k]) {
      const d = minutes(leg.duration)
      segs.push({ kind: 'leg', t0: t, t1: t + d, leg })
      t += d
    }
    // Leave when the travel to the next stop has to start
    let leave: number
    let open = false
    const nextArrive = k + 1 < day.stops.length ? arrive[k + 1] : null
    if (nextArrive != null) leave = nextArrive - travel[k + 1]
    // The next stop has no time (tonight's hotel): leave after an hour
    else if (k + 1 < day.stops.length) leave = a + 60
    else {
      leave = a + LAST_STAY
      open = true
    }
    if (leave <= a) leave = a + 10
    segs.push({ kind: 'stop', t0: a, t1: leave, stop, index: k, open })
    cursor = leave
  })

  let t = cursor ?? 20 * 60
  for (const leg of after) {
    const d = minutes(leg.duration)
    segs.push({ kind: 'leg', t0: t, t1: t + d, leg })
    t += d
  }
  return segs
}

export type Meal = 'Breakfast' | 'Lunch' | 'Dinner'

/**
 * The meal a stop is for, read from its note ("Lunch: ...", "Pegasis: early dinner ...").
 * A meal that is only mentioned ("buy tomorrow's breakfast", "dinner is on the plane") does not count.
 */
export function mealOf(stop: { note?: string }): Meal | null {
  const m = /(?<!tomorrow's )\b(breakfast|lunch|dinner)\b(?! (?:is|are) (?:on|the meals))/i.exec(stop.note ?? '')
  if (!m) return null
  const w = m[1].toLowerCase()
  return w === 'breakfast' ? 'Breakfast' : w === 'lunch' ? 'Lunch' : 'Dinner'
}

export interface Ride {
  /** Name of the train, bus or flight, e.g. "Tokaido Shinkansen Kodama 815" */
  service: string
  dep?: string
  arr?: string
}

const SERVICE_WORD =
  /\b(Shinkansen|Line|Liner|Rapi:t|Rapid|rapid|Express|express|Limited|bus|Bus|Limousine|Tram|Streetcar|Enoden|Loop|loop|shuttle|JAL|Skymark|Jetstar|ANA|Air)\b/

/** Split on ", " (or "; ") but not inside brackets: "Bus (A, B), Stop 10:00" → ["Bus (A, B)", "Stop 10:00"] */
function splitCommas(text: string, sep = ','): string[] {
  const parts: string[] = []
  let depth = 0
  let cur = ''
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (c === '(') depth++
    if (c === ')') depth = Math.max(0, depth - 1)
    if (c === sep && depth === 0 && text[i + 1] === ' ') {
      parts.push(cur.trim())
      cur = ''
      i++
    } else cur += c
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

/** Clean the service name in front of "Station 10:54 → ...": drop the station and the "(for X)" part */
function serviceName(before: string): string {
  const parts = splitCommas(before)
    .map((p) => p.replace(/\((?:for|via|stop|no|every) [^)]*\)/g, '').replace(/\s+/g, ' ').trim())
    .filter((p) => p && !/^(walk|then|taxi)\b/i.test(p))
  // Long notes in brackets ("(inner loop, via Ueno)") are left for the full steps; short ones ("(outer)") stay
  const bare = (t: string) => t.replace(/\s*\([^)]*\s[^)]*\)/g, '').trim()
  let last = bare(parts.pop() ?? '')
  if (!SERVICE_WORD.test(last) && parts.length) return bare(parts.pop()!)
  // "JR Saikyo Line Ikebukuro" → "JR Saikyo Line"; keep numbers and names like "Kodama 815", "Lilac 11", "α 5"
  const words = last.split(' ')
  let end = -1
  words.forEach((w, i) => {
    if (SERVICE_WORD.test(w)) end = i
  })
  if (end >= 0) {
    while (end + 1 < words.length && (/^\d+$|^\([^)]*\)$/.test(words[end + 1]) || /^\d+$/.test(words[end + 2] ?? ''))) {
      end += /^\d+$/.test(words[end + 1]) || /^\(/.test(words[end + 1]) ? 1 : 2
    }
    last = words.slice(0, end + 1).join(' ')
  }
  return last
}

/** Every ride in a travel label that has a departure time ("... Mishima 10:54 → Shin-Osaka 13:51") */
export function ridesOf(label: string): Ride[] {
  const rides: Ride[] = []
  const re = /(\d{1,2}:\d{2})\s*→\s*(?:[^,;()]|\([^)]*\))*?(?:\s(?:about\s)?(\d{1,2}:\d{2})|(?=[,;]|$))/g
  let from = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(label))) {
    const before = label.slice(from, m.index)
    const start = Math.max(before.lastIndexOf(';') + 1, 0)
    rides.push({ service: serviceName(before.slice(start)), dep: m[1], arr: m[2] })
    from = m.index + m[0].length
  }
  return rides.filter((r) => r.service)
}

/** The ride that matters most in a leg: the longest one, or the first named service when no times are given */
export function mainRide(label: string, mode?: string): Ride | null {
  const all = ridesOf(label)
  // On a bus leg the bus is the main ride, even when a train is longer
  const byMode = mode === 'bus' ? all.filter((r) => /bus|limousine|shuttle/i.test(r.service)) : []
  const rides = byMode.length ? byMode : all
  if (rides.length) {
    const len = (r: Ride) => {
      const a = clock(r.dep)
      const b = clock(r.arr)
      return a != null && b != null ? (b - a + 1440) % 1440 : 0
    }
    return rides.reduce((best, r) => (len(r) > len(best) ? r : best), rides[0])
  }
  const first = label
    .split(/;\s*/)
    .flatMap((p) => splitCommas(p))
    .map((p) => p.replace(/\((?:for|via) [^)]*\)/g, '').trim())
    .find((p) => p && !/^(walk|then|taxi|drive)\b/i.test(p))
  return first ? { service: first } : null
}

/**
 * A travel label cut into steps a person follows one by one:
 * "Walk to X (5 min); JR Line, A 10:00 → B 10:20, walk 5 min" → ["Walk to X (5 min)", "JR Line, A 10:00 → B 10:20", "walk 5 min"]
 */
export function stepsOf(label: string): string[] {
  const out: string[] = []
  for (const clause of splitCommas(label, ';')) {
    const parts = splitCommas(clause)
    let step = ''
    for (const p of parts) {
      const startsNew =
        step !== '' &&
        (/^(walk|then|taxi|free|ropeway)\b/i.test(p) || (/\d:\d\d\s*→/.test(p) && /\d:\d\d\s*→/.test(step)) || (/^walk\b/i.test(step) && !/→/.test(step)))
      if (startsNew) {
        out.push(step)
        step = p
      } else step = step ? `${step}, ${p}` : p
    }
    if (step) out.push(step)
  }
  return out.map((s) => s.replace(/^then /i, '')).map((s) => s.charAt(0).toUpperCase() + s.slice(1))
}

/** When and where the day starts for both travellers: the first stop with a clock time that is not a solo stop */
export function dayStart(day: Day): { time?: string; stop: Stop } {
  const stop = day.stops.find((s) => s.time && /\d/.test(s.time) && !s.who) ?? day.stops[0]
  return { time: stop.time && /\d/.test(stop.time) ? stop.time : undefined, stop }
}
