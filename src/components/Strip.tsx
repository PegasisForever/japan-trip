import { useEffect, useRef } from 'react'
import type { Day, Place } from '../data/types'
import { KIND_LABEL, MODE_COLOR, MODE_LABEL, REGION } from '../data/style'
import { photoUrl } from '../data/photos'
import { buildTimeline, fmtClock, fmtLength } from '../data/timeline'

interface Props {
  day: Day | null
  days: Day[]
  places: Record<string, Place>
  hovered: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onPickDay: (n: number) => void
}

/** Pixels per minute on the day timeline, and the smallest widths that stay readable */
const PX = 2.4
const MIN_STOP = 150
const MIN_LEG = 60

export default function Strip({ day, days, places, hovered, selected, onHover, onSelect, onPickDay }: Props) {
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    rail.current?.scrollTo({ left: 0 })
  }, [day])

  useEffect(() => {
    const id = hovered ?? selected
    if (!id) return
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
              className="card card-day"
              style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
              onClick={() => onPickDay(d.n)}
            >
              {p.photo && <img src={photoUrl(p.photo, 480)} alt="" loading="lazy" />}
              <span className="card-shade" />
              <span className="card-num">{d.n}</span>
              <span className="card-time">{d.temp}</span>
              <span className="card-body">
                <span className="card-when">
                  {d.date.slice(5).replace('-', '/')} <span lang="ja">{d.weekday}</span> · {d.short}
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

  // Lay the segments out left to right. Width follows duration, with a readable minimum.
  const ticks: { x: number; label: string }[] = []
  const laid: { seg: ReturnType<typeof buildTimeline>[number]; x0: number; w: number }[] = []
  let x = 0
  let lastT = -Infinity
  for (const seg of buildTimeline(day)) {
    const dur = seg.t1 - seg.t0
    const w = Math.max(seg.kind === 'stop' ? MIN_STOP : MIN_LEG, dur * PX)
    // Hour ticks are placed inside each segment, so they stay true even when a segment is widened
    if (seg.t0 >= lastT && dur > 0) {
      for (let h = Math.ceil(seg.t0 / 60); h * 60 < seg.t1; h++) {
        ticks.push({ x: x + ((h * 60 - seg.t0) / dur) * w, label: fmtClock(h * 60) })
      }
    }
    lastT = Math.max(lastT, seg.t1)
    laid.push({ seg, x0: x, w })
    x += w + 4
  }

  return (
    <nav className="strip strip-tl" ref={rail} aria-label="Timeline of the day">
      <div className="tl" style={{ width: x }}>
        <div className="tl-ruler" aria-hidden>
          {ticks.map((t, i) => (
            <span key={i} style={{ left: t.x }}>
              {t.label}
            </span>
          ))}
        </div>
        <div className="tl-row">
          {laid.map(({ seg, w }, i) => {
            if (seg.kind === 'leg') {
              const l = seg.leg
              return (
                <div
                  key={i}
                  className="tl-leg"
                  style={{ width: w, '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}
                  title={`${l.label}${l.duration ? ' · ' + l.duration : ''}`}
                >
                  <i className={l.mode === 'flight' || l.mode === 'walk' ? 'dash' : ''} />
                  <b>{MODE_LABEL[l.mode]}</b>
                  <span>{l.duration}</span>
                  {w > 170 && <small>{l.label}</small>}
                  {l.who && <small>{l.who} only</small>}
                </div>
              )
            }
            const st = seg.stop
            const p = places[st.place]
            const first = day.stops.findIndex((o) => o.place === st.place) === seg.index
            return (
              <button
                key={i}
                data-id={first ? st.place : undefined}
                style={{ width: w }}
                className={`card card-stop${hovered === st.place ? ' is-hot' : ''}${selected === st.place ? ' is-selected' : ''}${st.who ? ' is-solo' : ''}`}
                onMouseEnter={() => onHover(st.place)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(st.place)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(st.place)}
              >
                {p.photo && <img src={photoUrl(p.photo, 480)} alt="" loading="lazy" />}
                <span className="card-shade" />
                <span className="card-num">{order.get(st.place)}</span>
                <span className="card-time">
                  {st.time && /\d/.test(st.time) ? st.time : fmtClock(seg.t0)}
                  {!seg.open && ` – ${fmtClock(seg.t1)}`}
                </span>
                {st.who && <span className="card-who">{st.who} only</span>}
                <span className="card-body">
                  <span className="card-len">{seg.open ? 'evening' : fmtLength(seg.t1 - seg.t0)}</span>
                  <span className="card-kind">{KIND_LABEL[p.kind]}</span>
                  <span className="card-ja" lang="ja">{p.ja}</span>
                  <span className="card-en">{p.en}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
