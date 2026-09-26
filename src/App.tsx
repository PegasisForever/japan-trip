import { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import TopBar from './components/TopBar'
import DayBoard from './components/DayBoard'
import TripBoard from './components/TripBoard'
import Strip from './components/Strip'
import PlaceDetail from './components/PlaceDetail'
import MapKey from './components/MapKey'
import { days, places } from './data'
import routes from './data/routes.json'

function readHash(): number | null {
  const m = /^#day-(\d+)$/.exec(window.location.hash)
  if (!m) return null
  const n = Number(m[1])
  return days.some((d) => d.n === n) ? n : null
}

export default function App() {
  const [dayN, setDayN] = useState<number | null>(readHash)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const day = useMemo(() => days.find((d) => d.n === dayN) ?? null, [dayN])

  const pickDay = useCallback((n: number | null) => {
    setDayN(n)
    setSelected(null)
    setHovered(null)
    history.replaceState(null, '', n ? `#day-${n}` : '#trip')
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
      if (e.target instanceof HTMLInputElement) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') pickDay(Math.min(days.length, (dayN ?? 0) + 1))
      if (e.key === 'ArrowLeft') pickDay(dayN && dayN > 1 ? dayN - 1 : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dayN, pickDay])

  return (
    <div className="app">
      <MapView
        days={days}
        places={places}
        routes={routes as unknown as Record<string, [number, number][]>}
        day={day}
        hovered={hovered}
        selected={selected}
        onHover={setHovered}
        onSelect={setSelected}
        onPickDay={pickDay}
      />
      <TopBar days={days} current={dayN} onPick={pickDay} />
      {day ? (
        <DayBoard key={day.n} day={day} days={days} places={places} onPick={pickDay} onSelect={setSelected} />
      ) : (
        <TripBoard days={days} />
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
        <PlaceDetail
          key={selected}
          place={places[selected]}
          day={day}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
