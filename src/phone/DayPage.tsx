import { Page, Navbar, NavRight, Link, List, ListItem, Block, BlockTitle, f7 } from 'framework7-react'
import type { Router } from 'framework7/types'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { photoUrl } from '../data/photos'
import { buildTimeline, dayStart, mainRide, mealOf } from '../data/timeline'
import { days, places, dateLong, legKey } from '../data/trip'
import { pickOf } from '../data/picks'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { setPhone } from './store'

function PickDot({ id }: { id: string }) {
  const p = pickOf(id)
  return p ? <i className={`pdot pdot-${p}`} aria-label={p === 'both' ? 'Both picked' : `${p === 'aoki' ? 'Aoki' : 'Pegasis'}'s pick`} /> : null
}

/**
 * One day on the phone: the reminders, then the day as one list of places and the travel between them.
 * Only the time and the name show here; the place page and the travel sheet have the rest.
 */
export default function DayPage({ f7route }: { f7route: Router.Route }) {
  const n = Number(f7route.params.n)
  const day = days.find((d) => d.n === n)
  if (!day) return <Page><Navbar title="Day" backLink /></Page>

  const segs = buildTimeline(day)
  const sleep = day.sleep ? places[day.sleep] : null
  const next = days.find((d) => d.n === n + 1)
  const morning = next ? dayStart(next) : null

  const showMap = () => {
    setPhone({ mapDay: n, mapPlace: null, focusLeg: null })
    f7.tab.show('#view-map')
  }

  return (
    <Page className="day-page">
      <Navbar large title={day.short} backLink>
        <NavRight>
          <Link iconF7="map" onClick={showMap} aria-label="Show this day on the map" />
        </NavRight>
      </Navbar>

      <p className="day-sub">
        Day {day.n} · {dateLong(day)} · {day.temp}
      </p>

      {day.alerts.length > 0 && (
        <div className="reminders">
          {day.alerts.map((a, i) => (
            <p key={i}>
              <i className="f7-icons">exclamationmark_triangle_fill</i>
              <span>{a}</span>
            </p>
          ))}
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
                noChevron
                className="leg-row"
                onClick={() => setPhone({ leg: key })}
                style={{ '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}
              >
                <span slot="media" className="leg-ico">
                  <Icon name={MODE_ICON[l.mode]} size={15} />
                </span>
                <span slot="title" className="leg-text">
                  {MODE_LABEL[l.mode]}
                  {l.duration && <span className="num"> · {l.duration}</span>}
                  {ride && <span className="leg-svc"> · {ride.service}{ride.dep ? ` ${ride.dep}` : ''}</span>}
                  {l.who && <em> · {l.who} only</em>}
                </span>
              </ListItem>
            )
          }
          const st = seg.stop
          const p = places[st.place]
          const meal = mealOf(st)
          const time = st.time && /\d/.test(st.time) ? st.time : ''
          return (
            <ListItem key={i} link={`/place/${p.id}/?day=${day.n}`} className="stop-row" title={p.en}>
              <div slot="media" className="thumb">
                {p.photo ? <img src={photoUrl(p.photo, 160)} alt="" loading="lazy" /> : <i className="f7-icons">placemark</i>}
              </div>
              <span slot="header" className="num stop-time">
                {time}
                {meal && <b> · {meal}</b>}
                {st.who && <em> · {st.who} only</em>}
              </span>
              <span slot="after-title">
                <PickDot id={p.id} />
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

      {(day.notes?.length || day.cost) && (
        <List inset strong accordionList className="notes-acc">
          <ListItem accordionItem title="Notes and cost">
            <div className="accordion-item-content">
              <Block>
                {day.notes && (
                  <ul className="note-list">
                    {day.notes.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                )}
                {day.cost && <p className="cost-line">{day.cost}</p>}
              </Block>
            </div>
          </ListItem>
        </List>
      )}

      {next && (
        <>
          <BlockTitle>Next</BlockTitle>
          <List inset strong dividers>
            <ListItem link={`/day/${next.n}/`} reloadCurrent title={next.short} header={`Day ${next.n} · ${dateLong(next)}`} />
          </List>
        </>
      )}
    </Page>
  )
}
