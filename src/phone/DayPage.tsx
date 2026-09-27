import { Page, Navbar, List, ListItem, Block, BlockTitle } from 'framework7-react'
import type { Router } from 'framework7/types'
import { useState } from 'react'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { photoUrl } from '../data/photos'
import { buildTimeline, dayStart, mainRide, mealOf } from '../data/timeline'
import { days, places, dateLong, dateShort, legKey } from '../data/trip'
import { pickOf, type Pick } from '../data/picks'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { setPhone, showDay } from './store'

const PICK_SHORT: Record<Pick, string> = { aoki: 'Aoki', pegasis: 'Pegasis', both: 'Both' }

/** "Aoki", "Pegasis" or "Both", in their colour */
function PickWord({ id }: { id: string }) {
  const p = pickOf(id)
  return p ? <span className={`pword pword-${p}`}>{PICK_SHORT[p]}</span> : null
}

/** The first words of a stop note, to tell apart two visits to one place: "Bag storage" */
function gist(note?: string) {
  const first = (note ?? '').split(/[.:;(]/)[0].trim()
  return first.length > 42 ? first.slice(0, 40) + '…' : first
}

/**
 * The day's schedule: places and the travel between them, in order.
 * A row shows only the time and the name; the place page and the travel sheet have the rest.
 */
export default function DayPage({ f7route }: { f7route: Router.Route }) {
  const n = Number(f7route.params.n)
  const day = days.find((d) => d.n === n)
  const [allAlerts, setAllAlerts] = useState(false)
  if (!day) return <Page><Navbar title="Day" backLink /></Page>

  // The first travel row has no place before it (it leaves the hotel of the night before): leave it out
  const segs = buildTimeline(day).filter((s, i) => !(i === 0 && s.kind === 'leg'))
  const sleep = day.sleep ? places[day.sleep] : null
  const prev = days.find((d) => d.n === n - 1)
  const next = days.find((d) => d.n === n + 1)
  const morning = next ? dayStart(next) : null
  const repeated = new Set(day.stops.map((s) => s.place).filter((p, i, a) => a.indexOf(p) !== i))
  const alerts = allAlerts ? day.alerts : day.alerts.slice(0, 1)

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
              <span>{a}</span>
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

      <List mediaList inset strong dividers className="plan-list">
        {segs.map((seg, i) => {
          if (seg.kind === 'leg') {
            const l = seg.leg
            const ride = l.mode === 'walk' ? null : mainRide(l.label, l.mode)
            const key = legKey(day, day.legs.indexOf(l))
            return (
              <ListItem
                key={i}
                link="#"
                className={`leg-row mode-${l.mode}`}
                onClick={() => setPhone({ leg: key })}
                title={`${MODE_LABEL[l.mode]}${l.duration ? ` · ${l.duration}` : ''}${l.who ? ` · ${l.who} only` : ''}`}
                after={ride?.dep ?? ''}
                style={{ '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}
              >
                <span slot="media" className="leg-ico">
                  <Icon name={MODE_ICON[l.mode]} size={15} />
                </span>
              </ListItem>
            )
          }
          const st = seg.stop
          const p = places[st.place]
          const meal = mealOf(st)
          const time = st.time && /\d/.test(st.time) ? st.time : ''
          return (
            <ListItem
              key={i}
              link={`/place/${p.id}/?day=${day.n}&stop=${seg.index}`}
              className="stop-row"
              title={p.en}
              footer={repeated.has(p.id) ? gist(st.note) : undefined}
            >
              <div slot="media" className="thumb">
                {p.photo ? <img src={photoUrl(p.photo, 160)} alt="" loading="lazy" /> : <i className="f7-icons">placemark</i>}
              </div>
              <span slot="header" className="num stop-time">
                {time}
                {meal && <b> · {meal}</b>}
                {st.who && <em> · {st.who} only</em>}
                <PickWord id={p.id} />
              </span>
            </ListItem>
          )
        })}
        {sleep && (
          <ListItem link={`/place/${sleep.id}/?day=${day.n}`} className="stop-row night-row" title={sleep.en}>
            <div slot="media" className="thumb night">
              <i className="f7-icons">moon_fill</i>
            </div>
            <span slot="header">Night</span>
            {morning && (
              <span slot="footer" className="num">
                Tomorrow from {morning.time ?? 'morning'}
              </span>
            )}
          </ListItem>
        )}
      </List>

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

      <BlockTitle>Other days</BlockTitle>
      <List inset strong dividers className="day-nav">
        {prev && <ListItem link={`/day/${prev.n}/`} reloadCurrent transition="f7-dive" title={`← ${prev.short}`} footer={`Day ${prev.n} · ${dateShort(prev)}`} />}
        {next && <ListItem link={`/day/${next.n}/`} reloadCurrent title={`${next.short} →`} footer={`Day ${next.n} · ${dateShort(next)}`} />}
      </List>
    </Page>
  )
}
