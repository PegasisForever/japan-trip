import { useState } from 'react'
import type { Day, Place } from '../data/types'
import { REGION } from '../data/style'
import Icon from './Icon'

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
          <span>Day {day.n} of {days.length}</span>
          <span>{dateEn} <span lang="ja">{day.weekday}曜日</span></span>
        </div>
        <h1 className="ekimei-ja" lang="ja">{day.titleJa}</h1>
        <p className="ekimei-romaji">{day.romaji}</p>
        <div className="ekimei-band">
          <button
            className="ekimei-nav"
            onClick={() => onPick(prev ? prev.n : null)}
            aria-label={prev ? `Previous day: ${prev.title}` : 'Whole trip'}
          >
            <Icon name="left" />
            <span lang="ja">{prev ? prev.titleJa : '全行程'}</span>
          </button>
          <span className="ekimei-region" lang="ja">{region.ja}</span>
          {next ? (
            <button className="ekimei-nav ekimei-next" onClick={() => onPick(next.n)} aria-label={`Next day: ${next.title}`}>
              <span lang="ja">{next.titleJa}</span>
              <Icon name="right" />
            </button>
          ) : (
            <span className="ekimei-nav ekimei-next ekimei-end">Last day</span>
          )}
        </div>
      </div>

      {/* Phone only: one line with the key facts; tap to open the rest */}
      <button className="glance-mini" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span><Icon name="clock" /> {start ?? 'n/a'}</span>
        <span><Icon name="temp" /> {day.temp}</span>
        {day.alerts.length > 0 && (
          <span className="glance-mini-alert">
            <Icon name="alert" /> {day.alerts.length}
          </span>
        )}
        <span className="glance-mini-open">
          {open ? 'Hide' : 'Details'}
          <Icon name={open ? 'up' : 'down'} />
        </span>
      </button>

      <div className="board-body">
        <h2 className="board-title">{day.title}</h2>

        <dl className="glance">
          <div>
            <dt>Start</dt>
            <dd>{start ?? 'n/a'}</dd>
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

        <section className="alerts">
          <h3>
            <Icon name="alert" />
            Don’t forget
          </h3>
          <ul>
            {day.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </section>


        <button className="more" onClick={() => setMore((m) => !m)} aria-expanded={more}>
          {more ? 'Hide day notes' : `Day notes${day.notes?.length ? ` and ${day.notes.length} tips` : ''}`}
          <Icon name={more ? 'up' : 'down'} />
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
                <span>Cost for the day, per person</span>
                <b>{day.cost}</b>
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
