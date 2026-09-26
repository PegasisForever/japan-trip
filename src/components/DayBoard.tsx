import { useState } from 'react'
import type { Day, Place } from '../data/types'
import { REGION } from '../data/style'

interface Props {
  day: Day
  days: Day[]
  places: Record<string, Place>
  onPick: (n: number | null) => void
  onSelect: (id: string) => void
}

export default function DayBoard({ day, days, places, onPick, onSelect }: Props) {
  const [more, setMore] = useState(false)
  const [open, setOpen] = useState(false)
  const prev = days.find((d) => d.n === day.n - 1)
  const next = days.find((d) => d.n === day.n + 1)
  const region = REGION[day.region]
  const date = new Date(day.date + 'T12:00:00')
  const dateEn = date.toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
  const sleep = day.sleep ? places[day.sleep] : null
  const start = day.stops.find((s) => s.time && /\d/.test(s.time) && !s.who)?.time ?? day.stops[0].time

  return (
    <aside className={`board${open ? ' is-open' : ''}`} style={{ '--rc': region.color } as React.CSSProperties}>
      {/* Header drawn like a JR station name board (駅名標) */}
      <div className="ekimei">
        <div className="ekimei-meta">
          <span>Day {day.n} / {days.length}</span>
          <span>{dateEn} · <span lang="ja">{day.weekday}曜日</span></span>
        </div>
        <h1 className="ekimei-ja" lang="ja">{day.titleJa}</h1>
        <p className="ekimei-romaji">{day.romaji}</p>
        <div className="ekimei-band">
          <button className="ekimei-nav" onClick={() => onPick(prev ? prev.n : null)}>
            <span aria-hidden>◀</span>
            <span lang="ja">{prev ? prev.titleJa : '全行程'}</span>
          </button>
          <span className="ekimei-region" lang="ja">{region.ja}</span>
          <button className="ekimei-nav ekimei-next" disabled={!next} onClick={() => next && onPick(next.n)}>
            <span lang="ja">{next ? next.titleJa : ''}</span>
            <span aria-hidden>▶</span>
          </button>
        </div>
      </div>

      {/* Phone only: one line with the key facts; tap to open the rest */}
      <button className="glance-mini" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span><small>Start</small> {start ?? '—'}</span>
        <span><small>Temp</small> {day.temp}</span>
        <span className="glance-mini-alert">! {day.alerts.length}</span>
        <span className="glance-mini-open">{open ? 'Close' : 'Open'}</span>
      </button>

      <div className="board-body">
        <h2 className="board-title">{day.title}</h2>

        <dl className="glance">
          <div>
            <dt>Start</dt>
            <dd>{start ?? '—'}</dd>
          </div>
          <div>
            <dt>Weather</dt>
            <dd>{day.temp}</dd>
          </div>
          <div className="glance-wide">
            <dt>Sleep</dt>
            <dd>
              {sleep ? (
                <button className="linkish" onClick={() => onSelect(sleep.id)}>
                  <span lang="ja">{sleep.ja}</span>
                  <small>{sleep.en}</small>
                </button>
              ) : (
                'Flight home'
              )}
            </dd>
          </div>
        </dl>

        {day.split && (
          <p className="split">
            <b>Split day.</b> {day.split}
          </p>
        )}

        <section className="alerts" aria-label="Do not forget">
          <h3>Don’t forget</h3>
          <ul>
            {day.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>

        <button className="more" onClick={() => setMore((m) => !m)} aria-expanded={more}>
          {more ? 'Less' : `More about this day${day.notes?.length ? ` · ${day.notes.length} tips` : ''}`}
        </button>

        {more && (
          <div className="more-body">
            <p className="board-summary">{day.summary}</p>
            {day.notes && (
              <ul className="notes">
                {day.notes.map((n, i) => (
                  <li key={i}>{n}</li>
                ))}
              </ul>
            )}
            {day.sleepNote && <p className="fine">Sleep: {day.sleepNote}</p>}
            {day.cost && (
              <p className="board-cost">
                <span>Day cost, per person</span>
                <b>{day.cost}</b>
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
