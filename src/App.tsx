import { useCallback, useEffect, useState } from 'react'
import MapView from './components/MapView'
import TopBar from './components/TopBar'
import DayBoard from './components/DayBoard'
import TripBoard from './components/TripBoard'
import Strip from './components/Strip'
import PlaceDetail from './components/PlaceDetail'
import MapKey from './components/MapKey'
import { plan } from './data/plan'

const { days, places } = plan

/** "#day-4" → day 4; no hash → the whole trip */
function readHash(): number | null {
  const m = /^#day-(\d+)$/.exec(window.location.hash)
  return m ? Number(m[1]) : null
}

export default function App() {
  const [dayN, setDayN] = useState<number | null>(readHash)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const day = days.find((d) => d.n === dayN) ?? null
  // A link to a day that does not exist (#day-99) shows the whole trip, with its tab selected
  const curN = day?.n ?? null

  const pickDay = useCallback((n: number | null) => {
    setDayN(n)
    setSelected(null)
    setHovered(null)
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
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') pickDay(Math.min(days.length, (curN ?? 0) + 1))
      if (e.key === 'ArrowLeft') pickDay(curN && curN > 1 ? curN - 1 : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [curN, pickDay])

  return (
    <div className="app">
      <MapView
        days={days}
        places={places}
        routes={plan.routes}
        day={day}
        hovered={hovered}
        selected={selected}
        onHover={setHovered}
        onSelect={setSelected}
        onPickDay={pickDay}
      />
      <TopBar days={days} current={curN} onPick={pickDay} />
      {day ? (
        <DayBoard key={day.n} day={day} days={days} places={places} onPick={pickDay} onSelect={setSelected} />
      ) : (
        <TripBoard plan={plan} />
      )}
      <MapKey day={day} days={days} />
      <Strip
        day={day}
        days={days}
        places={places}
        hovered={hovered}
        selected={selected}
        onHover={setHovered}
        onSelect={setSelected}
        onPickDay={pickDay}
      />
      {selected && places[selected] && (
        <PlaceDetail key={selected} place={places[selected]} day={day} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
