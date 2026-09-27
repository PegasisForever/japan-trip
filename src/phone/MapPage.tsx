import { Page, Link } from 'framework7-react'
import type { Router } from 'framework7/types'
import { useEffect, useMemo, useRef, useState } from 'react'
import MapView, { type Pad } from '../shared/MapView'
import { plan } from '../data/plan'
import { days, places, dateShort } from '../data/trip'
import { photoUrl } from '../data/photos'
import { mealOf } from '../data/timeline'
import { KIND_LABEL } from '../data/style'
import type { Day, Place, Stop } from '../data/types'
import { getPhone, setPhone, showDay, usePhone } from './store'

type Card =
  | { kind: 'day'; day: Day }
  | { kind: 'place'; place: Place; stop: Stop; n: number }
  | { kind: 'trip-day'; day: Day }

/** Room taken by the glass controls on top of the map: the day switch above, the cards below */
function frame(): Pad {
  const cs = getComputedStyle(document.documentElement)
  const top = parseFloat(cs.getPropertyValue('--f7-safe-area-top')) || 0
  const bottom = parseFloat(cs.getPropertyValue('--f7-safe-area-bottom')) || 0
  return { top: top + 96, bottom: bottom + 150, left: 36, right: 36 }
}

/** The cards of a day: the day itself first, then each place once, numbered like its pin */
function cardsOf(day: Day | null): Card[] {
  if (!day) return days.map((d) => ({ kind: 'trip-day', day: d }))
  const out: Card[] = [{ kind: 'day', day }]
  const seen = new Set<string>()
  for (const st of day.stops) {
    if (seen.has(st.place) || !places[st.place]) continue
    seen.add(st.place)
    out.push({ kind: 'place', place: places[st.place], stop: st, n: seen.size })
  }
  return out
}

function Thumb({ p }: { p?: Place }) {
  return (
    <span className="deck-img">
      {p?.photo ? <img src={photoUrl(p.photo, 480)} alt="" loading="lazy" /> : <i className="f7-icons">placemark</i>}
    </span>
  )
}

/**
 * The phone app's only screen: the map.
 * Swipe the cards at the bottom to go from place to place; the map flies to each one.
 */
export default function MapPage({ f7router }: { f7router: Router.Router }) {
  const { mapDay, mapPlace, focusLeg, refit } = usePhone()
  const day = days.find((d) => d.n === mapDay) ?? null
  const cards = useMemo(() => cardsOf(day), [day])
  const deck = useRef<HTMLDivElement>(null)
  const shown = useRef(0)
  const settle = useRef<number | undefined>(undefined)
  // Whole trip: the day under the cards lights up its hotel pin
  const [litDay, setLitDay] = useState<number | null>(null)

  // A new day starts at its first card
  useEffect(() => {
    deck.current?.scrollTo({ left: 0 })
    shown.current = 0
    setLitDay(null)
  }, [day])

  // A pin was tapped: bring its card into view
  useEffect(() => {
    if (!mapPlace || !deck.current) return
    const i = cards.findIndex((c) => c.kind === 'place' && c.place.id === mapPlace)
    if (i < 0 || i === shown.current) return
    shown.current = i
    const el = deck.current.children[i] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [mapPlace, cards])

  /** The card in the middle when the swipe stops */
  const onScroll = () => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      const el = deck.current
      if (!el) return
      const mid = el.scrollLeft + el.clientWidth / 2
      let i = 0
      Array.from(el.children).forEach((c, k) => {
        if ((c as HTMLElement).offsetLeft <= mid) i = k
      })
      if (i === shown.current) return
      shown.current = i
      const c = cards[i]
      if (c.kind === 'place') setPhone({ mapPlace: c.place.id, focusLeg: null })
      else if (c.kind === 'day') setPhone({ mapPlace: null, focusLeg: null, refit: getPhone().refit + 1 })
      else setLitDay(c.day.n)
    }, 90)
  }

  const open = (c: Card) => {
    if (c.kind === 'trip-day') showDay(c.day.n)
    else if (c.kind === 'day') f7router.navigate(`/day/${c.day.n}/`)
    else f7router.navigate(`/place/${c.place.id}/?day=${day!.n}&stop=${day!.stops.indexOf(c.stop)}`)
  }

  // While a page covers the map, the map is hidden and cannot frame anything; frame it again when it shows
  const away = useRef<{ day: number | null; leg: number | undefined } | null>(null)
  const onOut = () => (away.current = { day: getPhone().mapDay, leg: getPhone().focusLeg?.t })
  const onIn = () => {
    const was = away.current
    away.current = null
    if (!was) return
    const now = getPhone()
    if (now.focusLeg && now.focusLeg.t !== was.leg) setPhone({ focusLeg: { ...now.focusLeg, t: Date.now() } })
    else if (now.mapDay !== was.day) setPhone({ refit: now.refit + 1 })
  }

  const step = (d: number) => {
    const n = (mapDay ?? 0) + d
    showDay(n < 1 ? null : Math.min(days.length, n))
  }

  const litPlace = !day && litDay ? (days.find((d) => d.n === litDay)?.sleep ?? null) : null

  return (
    <Page className="map-page" pageContent={false} onPageBeforeOut={onOut} onPageAfterIn={onIn}>
      <MapView
        days={days}
        places={places}
        routes={plan.routes}
        day={day}
        hovered={null}
        selected={mapPlace}
        hotLeg={focusLeg?.key ?? null}
        focusLeg={focusLeg}
        lit={litPlace}
        refit={refit}
        onSelect={(id) => setPhone({ mapPlace: id, focusLeg: null })}
        onPickDay={(n) => showDay(n)}
        onLeg={(key) => setPhone({ leg: key })}
        frame={frame}
        placeOffset={() => [0, -50]}
      />

      <div className="map-top">
        <div className="map-switch">
          <Link iconF7="chevron_left" onClick={() => step(-1)} className={mapDay === null ? 'disabled' : ''} aria-label="Previous day" />
          <button className="map-switch-label" onClick={() => setPhone({ picker: true })}>
            {day ? (
              <>
                <small className="num">
                  Day {day.n} · {dateShort(day)}
                </small>
                <b>{day.short}</b>
              </>
            ) : (
              <>
                <small>{days.length} days</small>
                <b>Whole trip</b>
              </>
            )}
          </button>
          <Link iconF7="chevron_right" onClick={() => step(1)} className={mapDay === days.length ? 'disabled' : ''} aria-label="Next day" />
        </div>
        {day && <Link className="map-round" iconF7="list_bullet" href={`/day/${day.n}/`} aria-label="Schedule of the day" />}
      </div>

      <div className="deck" ref={deck} onScroll={onScroll} key={mapDay ?? 0}>
        {cards.map((c) => {
          if (c.kind === 'day')
            return (
              <button key="day" className="deck-card deck-day" onClick={() => open(c)}>
                <span className="deck-img deck-sched">
                  <i className="f7-icons">list_bullet</i>
                </span>
                <span className="deck-text">
                  <small className="num">
                    {c.day.temp} · {cards.length - 1} places
                  </small>
                  <b>Schedule</b>
                  <span>Swipe for the places →</span>
                </span>
                <i className="f7-icons deck-go">chevron_right</i>
              </button>
            )
          if (c.kind === 'trip-day') {
            return (
              <button key={c.day.n} className="deck-card" onClick={() => open(c)}>
                <Thumb p={places[c.day.cover]} />
                <span className="deck-text">
                  <small className="num">
                    Day {c.day.n} · {dateShort(c.day)}
                  </small>
                  <b>{c.day.short}</b>
                  <span>{c.day.sleep ? places[c.day.sleep]?.en : 'Fly home'}</span>
                </span>
                <i className="f7-icons deck-go">chevron_right</i>
              </button>
            )
          }
          const time = c.stop.time && /\d/.test(c.stop.time) ? c.stop.time : null
          return (
            <button key={c.place.id} className="deck-card" onClick={() => open(c)}>
              <Thumb p={c.place} />
              <span className="deck-n num">{c.n}</span>
              <span className="deck-text">
                <small className="num">
                  {time && `${time} · `}
                  {mealOf(c.stop) ?? KIND_LABEL[c.place.kind]}
                </small>
                <b>{c.place.en}</b>
                <span lang="ja">{c.place.ja}</span>
              </span>
              <i className="f7-icons deck-go">chevron_right</i>
            </button>
          )
        })}
      </div>
    </Page>
  )
}
