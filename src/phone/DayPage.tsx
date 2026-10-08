import { Page, Navbar, List, ListItem, Block } from 'framework7-react'
import type { Router } from 'framework7/types'
import { useState } from 'react'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { photoUrl } from '../data/photos'
import { buildTimeline, dayStart, fmtClock, fmtLength, mainRide, mealOf } from '../data/timeline'
import { days, placesOf, dateLong, legKey } from '../data/trip'
import { pickOf, type Pick } from '../data/picks'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { setPhone, showDay } from './store'

/** Pixels per minute: 108 px for an hour */
const PX = 1.8
/** Space between two blocks, taken from the end of the first one */
const GAP = 2
/** The smallest block that still shows a name and a time; travel can be thinner */
const MIN_STOP = 44
const MIN_LEG = 24

const PICK_SHORT: Record<Pick, string> = { aoki: 'Aoki', pegasis: 'Pegasis', both: 'Both' }

/** "Aoki", "Pegasis" or "Both", in their colour */
function PickWord({ id }: { id: string }) {
  const p = pickOf(id)
  return p ? <span className={`pword pword-${p}`}>{PICK_SHORT[p]}</span> : null
}

/** Japanese phone numbers ("044-211-0100", "0136-46-3332") become links that call */
function withPhones(text: string) {
  return text.split(/(\b0\d{1,4}-\d{1,4}-\d{3,4}\b)/).map((part, i) =>
    i % 2 ? (
      <a key={i} className="external" href={`tel:+81${part.slice(1).replace(/-/g, '')}`}>
        {part}
      </a>
    ) : (
      part
    ),
  )
}

/** The first words of a stop note, to tell apart two visits to one place: "Bag storage" */
function gist(note?: string) {
  // Split at the first full stop, colon, semicolon or bracket, but not inside a clock time (18:10)
  const first = (note ?? '').split(/[.;(]|:(?!\d\d)/)[0].trim()
  return first.length > 42 ? first.slice(0, 40) + '…' : first
}

/**
 * The day's schedule: places and the travel between them, in order.
 * A row shows only the time and the name; the place page and the travel sheet have the rest.
 */
export default function DayPage({ f7route, f7router }: { f7route: Router.Route; f7router: Router.Router }) {
  const n = Number(f7route.params.n)
  const day = days.find((d) => d.n === n)
  const [allAlerts, setAllAlerts] = useState(false)
  if (!day) return <Page><Navbar title="Day" backLink /></Page>

  // The first travel row has no place before it (it leaves the hotel of the night before): leave it out
  const segs = buildTimeline(day).filter((s, i) => !(i === 0 && s.kind === 'leg'))
  const next = days.find((d) => d.n === n + 1)
  const morning = next ? dayStart(next) : null
  const repeated = new Set(day.stops.map((s) => s.place).filter((p, i, a) => a.indexOf(p) !== i))
  const alerts = allAlerts ? day.alerts : day.alerts.slice(0, 1)
  // Lay the blocks out in time order. Each is as tall as it is long, but never shorter than it needs to be
  // readable; the hour marks move with the blocks, so a mark is always at the right point of the block it falls in.
  const laid: { seg: (typeof segs)[number]; top: number; h: number }[] = []
  let y = 0
  let last = segs.length ? segs[0].t0 : 0
  for (const seg of segs) {
    y += Math.max(0, seg.t0 - last) * PX
    // Tonight's hotel closes the day: one short block, not the whole night
    const night = seg.kind === 'stop' && seg.stop.end === 'night'
    const h = night ? 64 : Math.max(seg.kind === 'stop' ? MIN_STOP : MIN_LEG, (seg.t1 - seg.t0) * PX - GAP)
    laid.push({ seg, top: y, h })
    y += h + GAP
    last = seg.t1
  }
  const height = y
  /** Where a clock time falls on the page */
  const yAt = (t: number) => {
    for (const b of laid) if (t >= b.seg.t0 && t <= b.seg.t1) return b.top + ((t - b.seg.t0) / Math.max(1, b.seg.t1 - b.seg.t0)) * (b.h + GAP)
    const after = laid.find((b) => b.seg.t0 > t)
    return after ? after.top - (after.seg.t0 - t) * PX : height
  }
  const ticks: number[] = []
  if (laid.length) for (let hr = Math.ceil(laid[0].seg.t0 / 60); hr * 60 <= last; hr++) ticks.push(hr)

  return (
    // The map behind this page follows the day shown here
    <Page className="day-page" onPageBeforeIn={() => showDay(n)}>
      <Navbar large title={day.short} backLink />

      <p className="day-sub num">
        Day {day.n} · {dateLong(day)} · {day.temp}
      </p>

      {day.alerts.length > 0 && (
        <div className="reminders">
          {alerts.map((a, i) => (
            <p key={i}>
              <i className="f7-icons">exclamationmark_triangle_fill</i>
              <span>{withPhones(a)}</span>
            </p>
          ))}
          {day.alerts.length > 1 && (
            <button className="reminders-more" onClick={() => setAllAlerts((v) => !v)}>
              {allAlerts ? 'Show less' : `${day.alerts.length - 1} more to remember`}
            </button>
          )}
        </div>
      )}

      {day.split && <Block className="split-note">{day.split}</Block>}

      {/* The day on one time scale: each place and each travel is as tall as it is long */}
      <div className="tscale" style={{ height: height + 8 }}>
        {ticks.map((h) => (
          <div key={h} className="ts-tick num" style={{ top: yAt(h * 60) }}>
            <span>{fmtClock(h * 60)}</span>
          </div>
        ))}
        {laid.map(({ seg, top, h }, i) => {
          const size = h < 30 ? ' is-tiny' : h < 58 ? ' is-short' : h >= 200 && seg.kind === 'stop' ? ' is-tall' : ''
          if (seg.kind === 'leg') {
            const l = seg.leg
            const ride = l.mode === 'walk' ? null : mainRide(l.label, l.mode)
            const key = legKey(day, day.legs.indexOf(l))
            return (
              <button
                key={i}
                className={`ts-leg mode-${l.mode}${size}`}
                style={{ top, height: h, '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}
                onClick={() => setPhone({ leg: key })}
                aria-label={`${MODE_LABEL[l.mode]}, ${l.duration ?? ''}. Open the steps.`}
              >
                <span className="leg-ico">
                  <Icon name={MODE_ICON[l.mode]} size={12} />
                </span>
                <span className="ts-leg-text">
                  {MODE_LABEL[l.mode]} {l.duration}
                  {ride?.dep && <span className="num"> · {ride.dep}</span>}
                  {l.who && <em> · {l.who} only</em>}
                </span>
              </button>
            )
          }
          const st = seg.stop
          const p = placesOf(day)[st.place]
          const meal = mealOf(st)
          const from = st.time && /\d/.test(st.time) ? st.time : fmtClock(seg.t0)
          if (st.end === 'night')
            return (
              <button
                key={i}
                className="ts-stop is-night"
                style={{ top, height: h }}
                onClick={() => f7router.navigate(`/place/${p.id}/?day=${day.n}&stop=${seg.index}`)}
              >
                <span className="ts-moon">
                  <i className="f7-icons">moon_fill</i>
                </span>
                <span className="ts-stop-text">
                  <b>{p.en}</b>
                  <small className="num">
                    {seg.guess ? 'Night' : `Night from ${from}`}
                    {morning && ` · tomorrow from ${morning.time ?? 'morning'}`}
                  </small>
                </span>
              </button>
            )
          return (
            <button
              key={i}
              className={`ts-stop${size}`}
              style={{ top, height: h }}
              onClick={() => f7router.navigate(`/place/${p.id}/?day=${day.n}&stop=${seg.index}`)}
            >
              {p.photo && <img src={photoUrl(p.photo, h >= 200 ? 480 : 160)} alt="" loading="lazy" />}
              <span className="ts-stop-text">
                <b>{p.en}</b>
                <small className="num">
                  {st.end === 'start' && 'Start · '}
                  {from}
                  {seg.open ? '' : `–${fmtClock(seg.t1)}`} · {seg.open ? 'evening' : fmtLength(seg.t1 - seg.t0)}
                  {meal && <em> · {meal}</em>}
                  {st.who && <em> · {st.who} only</em>}
                  <PickWord id={p.id} />
                </small>
                {repeated.has(p.id) && h >= 58 && h < 90 && <span className="ts-gist">{gist(st.note)}</span>}
                {/* A longer stay has room for the plan itself */}
                {h >= 90 && st.note && <span className="ts-note">{st.note}</span>}
              </span>
            </button>
          )
        })}
      </div>

      {day.notes && day.notes.length > 0 && (
        <List inset strong accordionList className="notes-acc">
          <ListItem accordionItem title={`${day.notes.length} tips for the day`}>
            <div className="accordion-item-content">
              <Block>
                <ul className="note-list">
                  {day.notes.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </Block>
            </div>
          </ListItem>
        </List>
      )}

    </Page>
  )
}
