import { Page, Link } from 'framework7-react'
import type { Router } from 'framework7/types'
import { useEffect, useMemo, useRef } from 'react'
import MapView, { type Pad } from '../shared/MapView'
import { plan } from '../data/plan'
import { days, places, dateShort, stopOrder } from '../data/trip'
import { photoUrl } from '../data/photos'
import { buildTimeline, legsBeforeStops, mainRide, mealOf, minutes, fmtClock, fmtLength } from '../data/timeline'
import { KIND_LABEL, MODE_COLOR } from '../data/style'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import type { Day, Leg, Place, Stop } from '../data/types'
import { getPhone, setPhone, showDay, usePhone } from './store'

/** A place card, with the travel from the place before it ("4-1,4-2" for the sheet) */
type Card = { place: Place; stop: Stop; n: number; legs: Leg[]; legKeys: string; stay: string; arrive: string }


/** Room taken by the glass controls on top of the map: the day bar above, the cards below */
function frame(): Pad {
  const cs = getComputedStyle(document.documentElement)
  const top = parseFloat(cs.getPropertyValue('--f7-safe-area-top')) || 0
  const bottom = parseFloat(cs.getPropertyValue('--f7-safe-area-bottom')) || 0
  // An open travel sheet covers the lower part: keep the route above it
  const sheet = getPhone().leg ? document.querySelector<HTMLElement>('.leg-sheet') : null
  const low = sheet ? sheet.offsetHeight + 24 : bottom + 200
  // Sides: room for half a pin and its number, so no pin is cut at the screen edge
  return { top: top + 110, bottom: low, left: 52, right: 52 }
}

/** Each place of the day once, in visiting order, numbered like its pin */
function cardsOf(day: Day): Card[] {
  const out: Card[] = []
  const seen = new Set<string>()
  const order = stopOrder(day)
  const { before } = legsBeforeStops(day)
  // How long you stay: from the arrival until the travel to the next place starts
  const stays = new Map<number, string>()
  const arrive = new Map<number, string>()
  for (const seg of buildTimeline(day))
    if (seg.kind === 'stop') {
      stays.set(seg.index, seg.open ? 'evening' : fmtLength(seg.t1 - seg.t0))
      arrive.set(seg.index, seg.guess ? '' : fmtClock(seg.t0))
    }
  day.stops.forEach((st, k) => {
    // Each place once, but tonight's hotel always closes the day (also when the day started there)
    if ((seen.has(st.place) && st.end !== 'night') || !places[st.place]) return
    seen.add(st.place)
    // The first place of the day: the travel before it leaves last night's hotel; leave it out
    const legs = k === 0 ? [] : before[k]
    out.push({ place: places[st.place], stop: st, n: order.get(st.place)!, legs, legKeys: legs.map((l) => `${day.n}-${day.legs.indexOf(l)}`).join(','), stay: stays.get(k) ?? '', arrive: arrive.get(k) ?? '' })
  })
  return out
}

/** The travel before a place, in one short line: icons and times; the sheet has every step */
function Travel({ legs, onOpen }: { legs: Leg[]; onOpen: () => void }) {
  if (legs.length === 0) return <span className="deck-travel is-empty" aria-hidden />
  const total = legs.reduce((a, l) => a + minutes(l.duration), 0)
  const ride = legs.map((l) => (l.mode === 'walk' ? null : mainRide(l.label, l.mode))).find((r) => r?.dep)
  // Walks under 10 min are left out of the line when there is other travel
  const shown = legs.length > 1 ? legs.filter((l) => l.mode !== 'walk' || minutes(l.duration) >= 10) : legs
  return (
    <button className="deck-travel" onClick={onOpen} aria-label={`Travel, ${fmtLength(total)}. Open the steps.`}>
      {(shown.length ? shown : legs).map((l, i) => (
        <span key={i} className="dt-leg" style={{ '--mc': MODE_COLOR[l.mode] } as React.CSSProperties}>
          <span className={`leg-ico mode-${l.mode}`}>
            <Icon name={MODE_ICON[l.mode]} size={12} />
          </span>
          {legs.length === 1 || l.mode !== 'walk' ? <span className="num">{l.duration}</span> : null}
        </span>
      ))}
      {ride?.dep && <span className="dt-dep num">{ride.dep}</span>}
      <i className="f7-icons" aria-hidden>chevron_up</i>
    </button>
  )
}

/** The item nearest the middle of a horizontal snap row */
function middleIndex(el: HTMLElement) {
  const mid = el.scrollLeft + el.clientWidth / 2
  let i = 0
  Array.from(el.children).forEach((c, k) => {
    if ((c as HTMLElement).offsetLeft <= mid) i = k
  })
  return i
}

/**
 * The phone app's only screen: the map of one day.
 * Swipe the day title to change the day; swipe the cards at the bottom to go from place to place.
 */
export default function MapPage({ f7router }: { f7router: Router.Router }) {
  const { mapDay, mapPlace, focusLeg, refit, hot } = usePhone()
  const day = days.find((d) => d.n === mapDay) ?? days[0]
  const cards = useMemo(() => cardsOf(day), [day])
  const deck = useRef<HTMLDivElement>(null)
  const pager = useRef<HTMLDivElement>(null)
  const shown = useRef(-1)
  const firstDay = useRef(true)
  const deckTimer = useRef<number | undefined>(undefined)
  const pagerTimer = useRef<number | undefined>(undefined)

  // A new day: the cards start at the first place (none picked yet), the title row shows the day
  useEffect(() => {
    deck.current?.scrollTo({ left: 0 })
    shown.current = -1
    const el = pager.current
    // Straight to the day on the first load (it can be today, in the middle of the trip)
    if (el && middleIndex(el) !== day.n - 1) el.scrollTo({ left: (day.n - 1) * el.clientWidth, behavior: firstDay.current ? 'instant' : 'smooth' })
    firstDay.current = false
  }, [day])

  // A pin was tapped: bring its card into view
  useEffect(() => {
    if (!mapPlace || !deck.current) return
    const i = cards.findIndex((c) => c.place.id === mapPlace)
    if (i < 0 || i === shown.current) return
    shown.current = i
    ;(deck.current.children[i] as HTMLElement | undefined)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [mapPlace, cards])

  /** The card in the middle when the swipe stops: the map flies there */
  const onDeckScroll = () => {
    window.clearTimeout(deckTimer.current)
    deckTimer.current = window.setTimeout(() => {
      if (!deck.current) return
      const i = middleIndex(deck.current)
      // The first card at rest before any swipe: keep the whole day in view
      if (i === shown.current || (i === 0 && shown.current === -1)) return
      shown.current = i
      setPhone({ mapPlace: cards[i].place.id, focusLeg: null })
    }, 90)
  }

  /** The day title in the middle when the swipe stops: show that day */
  const onPagerScroll = () => {
    window.clearTimeout(pagerTimer.current)
    pagerTimer.current = window.setTimeout(() => {
      if (!pager.current) return
      const n = middleIndex(pager.current) + 1
      if (n !== getPhone().mapDay) showDay(n)
    }, 90)
  }

  const open = (c: Card) => f7router.navigate(`/place/${c.place.id}/?day=${day.n}&stop=${day.stops.indexOf(c.stop)}`)

  // While a page covers the map, the map is hidden and cannot frame anything; frame it again when it shows
  const away = useRef<{ day: number; leg: number | undefined } | null>(null)
  const onOut = () => (away.current = { day: getPhone().mapDay, leg: getPhone().focusLeg?.t })
  const onIn = () => {
    const was = away.current
    away.current = null
    // First show: the map measured itself before the page had its final size
    if (!was) return setPhone({ refit: getPhone().refit + 1 })
    const now = getPhone()
    if (now.focusLeg && now.focusLeg.t !== was.leg) setPhone({ focusLeg: { ...now.focusLeg, t: Date.now() } })
    else if (now.mapDay !== was.day) setPhone({ refit: now.refit + 1 })
  }

  return (
    <Page className="map-page" pageContent={false} onPageBeforeOut={onOut} onPageAfterIn={onIn}>
      <MapView
        days={days}
        places={places}
        routes={plan.routes}
        day={day}
        hovered={null}
        selected={mapPlace}
        hotLeg={hot ?? focusLeg?.key ?? null}
        focusLeg={focusLeg}
        lit={null}
        refit={refit}
        onSelect={(id) => setPhone({ mapPlace: id, focusLeg: null })}
        onPickDay={(n) => showDay(n)}
        onLeg={(key) => setPhone({ leg: key })}
        frame={frame}
        placeOffset={() => [0, -50]}
      />

      <div className="map-top">
        <Link className="map-round" iconF7="square_grid_2x2" onClick={() => setPhone({ picker: true })} aria-label="All days" />
        {/* Swipe left or right for the next or previous day; tap to see the whole day again */}
        <div className="day-pager" ref={pager} onScroll={onPagerScroll}>
          {days.map((d) => (
            <button
              key={d.n}
              className="day-page-title"
              onClick={() => setPhone({ mapPlace: null, focusLeg: null, refit: getPhone().refit + 1 })}
              aria-label={`Day ${d.n}, ${d.short}. Swipe for other days.`}
            >
              <small className="num">
                Day {d.n} · {dateShort(d)}
              </small>
              <b>{d.short}</b>
            </button>
          ))}
        </div>
        <Link className="map-round" iconF7="list_bullet" href={`/day/${day.n}/`} aria-label="Schedule of the day" />
      </div>

      <div className="deck" ref={deck} onScroll={onDeckScroll} key={day.n}>
        {cards.map((c) => {
          const time = c.stop.time && /\d/.test(c.stop.time) ? c.stop.time : null
          return (
            <div key={`${c.place.id}-${c.stop.end ?? ''}`} className="deck-item">
              <Travel legs={c.legs} onOpen={() => setPhone({ leg: c.legKeys })} />
              <button className="deck-card" onClick={() => open(c)}>
                <span className="deck-img">
                  {c.place.photo ? <img src={photoUrl(c.place.photo, 480)} alt="" loading="lazy" /> : <i className="f7-icons">placemark</i>}
                </span>
                <span className="deck-n num">{c.n}</span>
                <span className="deck-text">
                  <small className="num">
                    {c.stop.end === 'night' ? (
                      `Night${time ? ` from ${time}` : c.arrive ? ` from ${c.arrive}` : ''}`
                    ) : (
                      <>
                        {c.stop.end === 'start' && 'Start · '}
                        {time && `${time} · `}
                        {c.stay && <span className="deck-stay">{c.stay} · </span>}
                        {mealOf(c.stop) ?? KIND_LABEL[c.place.kind] ?? ''}
                      </>
                    )}
                  </small>
                  <b>{c.place.en}</b>
                  <span lang="ja">{c.place.ja}</span>
                </span>
                <i className="f7-icons deck-go" aria-hidden>chevron_right</i>
              </button>
            </div>
          )
        })}
      </div>
    </Page>
  )
}
