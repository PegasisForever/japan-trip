import { Page, Link, f7 } from 'framework7-react'
import type { Router, Actions } from 'framework7/types'
import { useCallback } from 'react'
import MapView, { type Pad } from '../shared/MapView'
import { plan } from '../data/plan'
import { days, places, dateShort } from '../data/trip'
import { photoUrl } from '../data/photos'
import { mealOf } from '../data/timeline'
import { KIND_LABEL } from '../data/style'
import { setPhone, usePhone } from './store'

/** Room taken by the glass bars on top of the map: the day switch above, the tab bar (and a place card) below */
function frame(card: boolean): Pad {
  const cs = getComputedStyle(document.documentElement)
  const top = parseFloat(cs.getPropertyValue('--f7-safe-area-top')) || 0
  const bottom = parseFloat(cs.getPropertyValue('--f7-safe-area-bottom')) || 0
  return { top: top + 90, bottom: bottom + (card ? 210 : 110), left: 30, right: 30 }
}

/** Map tab: the whole trip or one day. Tap a pin for its card, a line for its travel steps. */
export default function MapPage({ f7router }: { f7router: Router.Router }) {
  const { mapDay, mapPlace, focusLeg } = usePhone()
  const day = days.find((d) => d.n === mapDay) ?? null
  const place = mapPlace ? places[mapPlace] : null
  const stop = place && day ? day.stops.find((s) => s.place === place.id) : undefined

  const pickDay = useCallback((n: number | null) => setPhone({ mapDay: n, mapPlace: null, focusLeg: null }), [])
  const step = (d: number) => {
    const n = (mapDay ?? 0) + d
    pickDay(n < 1 ? null : Math.min(days.length, n))
  }

  const chooseDay = () => {
    const list: Actions.Button[] = [{ text: 'Whole trip', strong: mapDay === null, onClick: () => pickDay(null) }]
    for (const d of days) list.push({ text: `${d.n} · ${d.short}`, strong: d.n === mapDay, onClick: () => pickDay(d.n) })
    const cancel: Actions.Button[] = [{ text: 'Cancel', strong: true }]
    f7.actions.create({ buttons: [list, cancel] }).open()
  }

  return (
    <Page className="map-page" pageContent={false}>
      <MapView
        days={days}
        places={places}
        routes={plan.routes}
        day={day}
        hovered={null}
        selected={mapPlace}
        hotLeg={focusLeg?.key ?? null}
        focusLeg={focusLeg}
        lit={null}
        onSelect={(id) => setPhone({ mapPlace: id })}
        onPickDay={(n) => pickDay(n)}
        onLeg={(key) => setPhone({ leg: key })}
        frame={() => frame(!!mapPlace)}
        placeOffset={() => [0, -60]}
      />

      <div className="map-switch">
        <Link iconF7="chevron_left" onClick={() => step(-1)} className={mapDay === null ? 'disabled' : ''} aria-label="Previous day" />
        <button className="map-switch-label" onClick={chooseDay}>
          {day ? (
            <>
              <small className="num">Day {day.n} · {dateShort(day)}</small>
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

      {place && (
        <div className="map-card" role="dialog" aria-label={place.en}>
          <button className="map-card-main" onClick={() => f7router.navigate(`/place/${place.id}/${day ? `?day=${day.n}` : ''}`)}>
            {place.photo && <img src={photoUrl(place.photo, 480)} alt="" />}
            <span className="map-card-text">
              <small>
                {stop?.time && /\d/.test(stop.time) ? <span className="num">{stop.time} · </span> : null}
                {(stop && mealOf(stop)) ?? KIND_LABEL[place.kind]}
              </small>
              <b>{place.en}</b>
              <span lang="ja">{place.ja}</span>
            </span>
            <i className="f7-icons chev">chevron_right</i>
          </button>
          <Link className="map-card-close" iconF7="xmark" onClick={() => setPhone({ mapPlace: null })} aria-label="Close" />
        </div>
      )}
    </Page>
  )
}
