import { useCallback, useEffect, useState } from 'react'
import { App } from 'framework7-react'
import MapView, { type Pad } from '../shared/MapView'
import DayTabs from './DayTabs'
import DayBoard from './DayBoard'
import TripBoard from './TripBoard'
import Strip from './Strip'
import PlaceDetail from './PlaceDetail'
import MapKey from './MapKey'
import { plan } from '../data/plan'
import './strip.css'
import './desktop.css'

const { days, places } = plan

/** "#day-4" → day 4; no hash → the whole trip */
function readHash(): number | null {
  const m = /^#day-(\d+)$/.exec(window.location.hash)
  return m ? Number(m[1]) : null
}

/** Keep what the map shows clear of the side panel, the day tabs and the timeline */
function frame(): Pad {
  const side = document.querySelector('.d-side')?.getBoundingClientRect()
  const strip = document.querySelector('.strip')?.getBoundingClientRect()
  const detail = document.querySelector('.d-detail')?.getBoundingClientRect()
  return {
    top: 110,
    // Room for the map key above the strip
    bottom: strip ? window.innerHeight - strip.top + 56 : 280,
    left: (side?.right ?? 420) + 50,
    right: detail ? window.innerWidth - detail.left + 40 : 80,
  }
}

/**
 * Desktop: the map fills the window. Glass panels float on it: day tabs at the top, the day on the left,
 * a place on the right, and the day's timeline at the bottom. Hover shows, click opens.
 */
export default function DesktopApp() {
  const [dayN, setDayN] = useState<number | null>(readHash)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [hotLeg, setHotLeg] = useState<string | null>(null)
  // A place under the mouse in the timeline: its map pin lights up, without the pin's popup card
  const [lit, setLit] = useState<string | null>(null)
  const [focusLeg, setFocusLeg] = useState<{ key: string; t: number } | null>(null)
  const showLeg = useCallback((key: string) => {
    setSelected(null)
    setFocusLeg({ key, t: Date.now() })
  }, [])

  const day = days.find((d) => d.n === dayN) ?? null
  // A link to a day that does not exist (#day-99) shows the whole trip, with its tab selected
  const curN = day?.n ?? null

  const pickDay = useCallback((n: number | null) => {
    setDayN(n)
    setSelected(null)
    setHovered(null)
    setHotLeg(null)
    setLit(null)
    history.replaceState(null, '', n ? `#day-${n}` : window.location.pathname)
  }, [])

  useEffect(() => {
    const onHash = () => {
      setDayN(readHash())
      setSelected(null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      // Alt+Left is "back" in the browser; leave shortcuts with modifier keys alone
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      // The full-screen photo view uses the arrow keys itself
      if (document.querySelector('.photo-browser')) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') pickDay(Math.min(days.length, (curN ?? 0) + 1))
      if (e.key === 'ArrowLeft') pickDay(curN && curN > 1 ? curN - 1 : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [curN, pickDay])

  return (
    <App theme="ios" darkMode="auto" colors={{ primary: '#2f7cf6' }} className="desktop">
      <div className="d-app">
        <MapView
          days={days}
          places={places}
          routes={plan.routes}
          day={day}
          hovered={hovered}
          selected={selected}
          hotLeg={hotLeg}
          focusLeg={focusLeg}
          lit={lit}
          onHover={setHovered}
          onSelect={setSelected}
          onPickDay={pickDay}
          onLeg={showLeg}
          frame={frame}
          placeOffset={() => [(440 - 460) / 2, (80 - 220) / 2]}
          hoverTips
        />
        <DayTabs days={days} current={curN} onPick={pickDay} />
        <aside className="d-side glass-panel" key={curN ?? 0}>
          {day ? <DayBoard day={day} onPick={pickDay} onSelect={setSelected} /> : <TripBoard onSelect={setSelected} />}
        </aside>
        <MapKey day={day} days={days} />
        <Strip
          day={day}
          days={days}
          places={places}
          hovered={hovered}
          selected={selected}
          onHover={setLit}
          onSelect={setSelected}
          onPickDay={pickDay}
          onHotLeg={setHotLeg}
          onFocusLeg={showLeg}
        />
        {selected && places[selected] && (
          <PlaceDetail key={selected} place={places[selected]} day={day} onClose={() => setSelected(null)} />
        )}
      </div>
    </App>
  )
}
