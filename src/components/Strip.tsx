import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Day, Leg, Place } from '../data/types'
import { KIND_ICON, KIND_LABEL, MODE_COLOR, MODE_LABEL, REGION } from '../data/style'
import { photoUrl } from '../data/photos'
import { buildTimeline, dayStart, fmtClock, fmtLength, mainRide, mealOf, stepsOf } from '../data/timeline'
import Icon from './Icon'
import PickTag from './PickTag'
import { pickOf } from '../data/picks'

interface Props {
  day: Day | null
  days: Day[]
  places: Record<string, Place>
  hovered: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onPickDay: (n: number) => void
  /** The travel block under the mouse, as "day-leg" ("4-2"), so the map can show its route */
  onHotLeg: (key: string | null) => void
}

/** Pixels per minute: the whole day uses one scale, so every hour has the same width */
const PX = 3.2
/** Space between two blocks, taken from the end of the first one so the start times stay exact */
const GAP = 3
/** Below these widths a block shows less text; the full text is in the hover tip */
const TINY = 72
const NARROW = 150
const RIDE_FULL = 124
/** From this width a travel block lists every step, not only the main ride */
const ALL_STEPS = 230

/** Photo of a place, or its kind icon when there is no photo, so the card does not look broken */
function Cover({ place, size }: { place: Place; size: number }) {
  if (place.photo) return <img src={photoUrl(place.photo, size)} alt="" loading="lazy" />
  return (
    <span className="card-ph" aria-hidden>
      <Icon name={KIND_ICON[place.kind]} size={40} />
    </span>
  )
}

/** Full travel steps, shown next to a travel block on hover or focus */
function LegTip({ leg, rect }: { leg: Leg; rect: DOMRect }) {
  const left = Math.max(8, Math.min(rect.left, window.innerWidth - 348))
  return createPortal(
    <div className="leg-tip" role="tooltip" style={{ left, bottom: window.innerHeight - rect.top + 10 }}>
      <p className="leg-tip-head">
        {/* White dashes of walks and flights would not show on the light panel */}
        <i
          style={{ '--mc': leg.mode === 'flight' || leg.mode === 'walk' ? 'var(--ink-2)' : MODE_COLOR[leg.mode] } as React.CSSProperties}
          className={leg.mode === 'flight' || leg.mode === 'walk' ? 'dash' : ''}
        />
        <b>{MODE_LABEL[leg.mode]}</b>
        {leg.duration && <span>{leg.duration}</span>}
        {leg.who && <em>{leg.who} only</em>}
      </p>
      <ol>
        {stepsOf(leg.label).map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </div>,
    document.body,
  )
}

export default function Strip({ day, days, places, hovered, selected, onHover, onSelect, onPickDay, onHotLeg }: Props) {
  const rail = useRef<HTMLDivElement>(null)
  // The travel steps shown next to a travel block; it belongs to one day only
  const [tip, setTip] = useState<{ leg: Leg; rect: DOMRect; n: number } | null>(null)

  useEffect(() => {
    rail.current?.scrollTo({ left: 0 })
  }, [day])

  // Hover and click that start in the timeline itself must not scroll it: only the map does.
  // (A place can have 2 cards, e.g. the hotel at the start and end of the day, so scrolling would jump.)
  const ownHover = useRef<string | null>(null)
  const ownSelect = useRef<string | null>(null)
  const hoverHere = (id: string | null) => {
    ownHover.current = id
    onHover(id)
  }
  const selectHere = (id: string) => {
    ownSelect.current = id
    onSelect(id)
  }

  useEffect(() => {
    const id = hovered ?? selected
    if (!id || id === (hovered ? ownHover.current : ownSelect.current)) return
    rail.current
      ?.querySelector<HTMLElement>(`[data-id="${id}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [hovered, selected])

  if (!day) {
    return (
      <nav className="strip" ref={rail} aria-label="Days">
        {days.map((d) => {
          const p = places[d.cover]
          return (
            <button
              key={d.n}
              className={`card card-day${p?.photo ? '' : ' no-photo'}`}
              style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
              onClick={() => onPickDay(d.n)}
            >
              {p && <Cover place={p} size={480} />}
              <span className="card-shade" />
              <span className="card-top">
                <span className="card-num">{d.n}</span>
                <span className="card-time" title={d.temp}>{d.temp}</span>
              </span>
              <span className="card-body">
                <span className="card-when">
                  {Number(d.date.slice(5, 7))}/{Number(d.date.slice(8))} <span lang="ja">{d.weekday}</span> · {d.short}
                </span>
                <span className="card-ja" lang="ja">{d.titleJa}</span>
                <span className="card-en">{d.title}</span>
              </span>
            </button>
          )
        })}
      </nav>
    )
  }

  // Number each place once, in the order it is first visited
  const order = new Map<string, number>()
  for (const st of day.stops) if (!order.has(st.place)) order.set(st.place, order.size + 1)

  // One time scale for the whole day: a block starts at its clock time and is as wide as it is long
  const segs = buildTimeline(day)
  const start = segs.length ? Math.min(...segs.map((s) => s.t0)) : 0
  const end = segs.length ? Math.max(...segs.map((s) => s.t1)) : 0
  const at = (t: number) => (t - start) * PX
  const laid = segs.map((seg) => ({ seg, x: at(seg.t0), w: Math.max(3, (seg.t1 - seg.t0) * PX - GAP) }))
  const ticks: { x: number; label: string }[] = []
  for (let h = Math.ceil(start / 60); h * 60 <= end; h++) ticks.push({ x: at(h * 60), label: fmtClock(h * 60) })
  const x = at(end) + 8

  // The night and the next morning close the day
  const sleep = day.sleep ? places[day.sleep] : null
  const next = days.find((d) => d.n === day.n + 1)
  const morning = next ? dayStart(next) : null
  const morningPlace = morning ? places[morning.stop.place] : null
  const morningMeal = morning ? mealOf(morning.stop) : null
  const NIGHT_W = 210

  return (
    <nav className="strip strip-tl" ref={rail} aria-label="Timeline of the day" onScroll={() => setTip(null)}>
      <div className="tl" style={{ width: x + (sleep ? NIGHT_W : 0) }}>
        <div className="tl-ruler" aria-hidden>
          {ticks.map((t, i) => (
            <span key={i} style={{ left: t.x }}>
              {t.label}
            </span>
          ))}
        </div>
        <div className="tl-row">
          {laid.map(({ seg, x: left, w }, i) => {
            if (seg.kind === 'leg') {
              const l = seg.leg
              const ride = l.mode === 'walk' ? null : mainRide(l.label, l.mode)
              const steps = stepsOf(l.label)
              const rides = steps.filter((s) => /\d:\d\d\s*→/.test(s)).length
              const key = `${day.n}-${day.legs.indexOf(l)}`
              const show = (el: HTMLElement) => {
                setTip({ leg: l, rect: el.getBoundingClientRect(), n: day.n })
                onHotLeg(key)
              }
              const hide = () => {
                setTip(null)
                onHotLeg(null)
              }
              return (
                <button
                  key={i}
                  type="button"
                  className={`tl-leg${w >= ALL_STEPS ? ' is-wide' : ''}${w < TINY ? ' is-tiny' : w < RIDE_FULL ? ' is-narrow' : ''}`}
                  style={{ left, width: w, '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}
                  aria-label={`${MODE_LABEL[l.mode]}${l.duration ? ', ' + l.duration : ''}: ${l.label}`}
                  onMouseEnter={(e) => show(e.currentTarget)}
                  onMouseLeave={hide}
                  onFocus={(e) => show(e.currentTarget)}
                  onBlur={hide}
                >
                  <i className={l.mode === 'flight' || l.mode === 'walk' ? 'dash' : ''} />
                  <span className="tl-leg-head">
                    <b>{MODE_LABEL[l.mode]}</b>
                    <span>{l.duration}</span>
                  </span>
                  {l.who && <em className="tl-leg-who">{l.who} only</em>}
                  {w >= ALL_STEPS ? (
                    <ol className="tl-leg-steps">
                      {steps.map((s, k) => (
                        <li key={k}>{s}</li>
                      ))}
                    </ol>
                  ) : (
                    ride && (
                      <>
                        <span className="tl-leg-svc">{ride.service}</span>
                        {ride.dep && (
                          <span className="tl-leg-time">
                            {ride.dep}
                            {ride.arr && ` → ${ride.arr}`}
                          </span>
                        )}
                        {rides > 1 && (
                          <small>
                            {rides} rides
                          </small>
                        )}
                      </>
                    )
                  )}
                </button>
              )
            }
            const st = seg.stop
            const p = places[st.place]
            const meal = mealOf(st)
            const first = day.stops.findIndex((o) => o.place === st.place) === seg.index
            return (
              <button
                key={i}
                data-id={first ? st.place : undefined}
                style={{ left, width: w }}
                title={w < NARROW ? `${st.time ?? fmtClock(seg.t0)} · ${p.en}` : undefined}
                className={`card card-stop${w < TINY ? ' is-tiny' : w < NARROW ? ' is-narrow' : ''}${p.photo ? '' : ' no-photo'}${meal ? ' is-meal' : ''}${hovered === st.place ? ' is-hot' : ''}${selected === st.place ? ' is-selected' : ''}${st.who ? ' is-solo' : ''}`}
                onMouseEnter={() => hoverHere(st.place)}
                onMouseLeave={() => hoverHere(null)}
                onFocus={() => hoverHere(st.place)}
                onBlur={() => hoverHere(null)}
                onClick={() => selectHere(st.place)}
              >
                <Cover place={p} size={480} />
                <span className="card-shade" />
                <span className="card-top">
                  <span className="card-num">{order.get(st.place)}</span>
                  {w < TINY && <PickTag pick={pickOf(st.place)} dot />}
                  <span className="card-time">
                    {st.time && /\d/.test(st.time) ? st.time : fmtClock(seg.t0)}
                    {!seg.open && <span className="card-time-end">–{fmtClock(seg.t1)}</span>}
                  </span>
                </span>
                {st.who && <span className="card-who">{st.who} only</span>}
                <span className="card-body">
                  <PickTag pick={pickOf(st.place)} />
                  {meal ? (
                    <span className="card-kind card-meal">
                      <Icon name="meal" size={14} />
                      {meal} · {seg.open ? 'evening' : fmtLength(seg.t1 - seg.t0)}
                    </span>
                  ) : (
                    <span className="card-kind">
                      {KIND_LABEL[p.kind]} · {seg.open ? 'evening' : fmtLength(seg.t1 - seg.t0)}
                    </span>
                  )}
                  <span className="card-ja" lang="ja">{p.ja}</span>
                  <span className="card-en">{p.en}</span>
                </span>
              </button>
            )
          })}
          {sleep && (
            <button
              className="card card-night"
              style={{ left: x, width: NIGHT_W - 4 }}
              onClick={() => selectHere(sleep.id)}
              onMouseEnter={() => hoverHere(sleep.id)}
              onMouseLeave={() => hoverHere(null)}
              aria-label={`Night at ${sleep.en}. Open the hotel.`}
            >
              <span className="card-top">
                <span className="card-night-tag">
                  <Icon name="moon" size={14} />
                  Night
                </span>
                <span className="card-time">from {fmtClock(end)}</span>
              </span>
              <span className="card-body">
                <span className="card-kind">
                  <Icon name="bed" size={14} /> Sleep
                </span>
                <span className="card-ja" lang="ja">{sleep.ja}</span>
                <span className="card-en">{sleep.en}</span>
                {morning && (
                  <span className="card-morning">
                    <Icon name="sun" size={14} />
                    Day {next!.n}: {morning.time ?? 'start'}
                    {morningMeal ? ` ${morningMeal.toLowerCase()}` : ''}
                    {morningPlace && morningPlace.id !== sleep.id ? ` · ${morningPlace.en}` : morningMeal ? ' here' : ' from here'}
                  </span>
                )}
              </span>
            </button>
          )}
        </div>
      </div>
      {tip && tip.n === day.n && <LegTip leg={tip.leg} rect={tip.rect} />}
    </nav>
  )
}
