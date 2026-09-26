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
    const a = arrive[k] ?? cursor ?? 8 * 60
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
