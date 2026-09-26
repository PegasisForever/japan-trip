import { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import TopBar from './components/TopBar'
import DayBoard from './components/DayBoard'
import TripBoard from './components/TripBoard'
import Strip from './components/Strip'
import PlaceDetail from './components/PlaceDetail'
import MapKey from './components/MapKey'
import { plans } from './data/plans'

const PLAN_KEY = 'yukimichi-plan'

/** "#drive/day-4" → plan "drive", day 4; "#drive" → whole trip of plan "drive" */
function readHash(): { planId: string | null; day: number | null } {
  const m = /^#([\w-]+)(?:\/day-(\d+))?$/.exec(window.location.hash)
  if (!m || !plans.some((p) => p.id === m[1])) return { planId: null, day: null }
  return { planId: m[1], day: m[2] ? Number(m[2]) : null }
}

function firstPlan() {
  const fromHash = readHash().planId
  if (fromHash) return fromHash
  try {
    const saved = localStorage.getItem(PLAN_KEY)
    if (saved && plans.some((p) => p.id === saved)) return saved
  } catch {
    /* storage blocked */
  }
  return plans[0]?.id ?? ''
}

export default function App() {
  const [planId, setPlanId] = useState<string>(firstPlan)
  const [dayN, setDayN] = useState<number | null>(() => readHash().day)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const planIndex = Math.max(0, plans.findIndex((p) => p.id === planId))
  const plan = plans[planIndex]
  const days = useMemo(() => plan?.days ?? [], [plan])
  const day = useMemo(() => days.find((d) => d.n === dayN) ?? null, [days, dayN])

  const go = useCallback((id: string, n: number | null) => {
    setPlanId(id)
    setDayN(n)
    setSelected(null)
    setHovered(null)
    history.replaceState(null, '', n ? `#${id}/day-${n}` : `#${id}`)
    try {
      localStorage.setItem(PLAN_KEY, id)
    } catch {
      /* storage blocked */
    }
  }, [])
  const pickDay = useCallback((n: number | null) => go(planId, n), [go, planId])

  useEffect(() => {
    const onHash = () => {
      const h = readHash()
      if (h.planId) {
        setPlanId(h.planId)
        setDayN(h.day)
        setSelected(null)
      }
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') pickDay(Math.min(days.length, (dayN ?? 0) + 1))
      if (e.key === 'ArrowLeft') pickDay(dayN && dayN > 1 ? dayN - 1 : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dayN, days.length, pickDay])

  if (!plan) return <p className="empty">No plans yet.</p>
  const places = plan.places

  return (
    <div className="app">
      <MapView
        key={`map-${plan.id}`}
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
      <TopBar
        plans={plans}
        planId={plan.id}
        onPlan={(id) => go(id, dayN)}
        days={days}
        current={dayN}
        onPick={pickDay}
      />
      {day ? (
        <DayBoard key={`${plan.id}-${day.n}`} day={day} days={days} places={places} onPick={pickDay} onSelect={setSelected} />
      ) : (
        <TripBoard key={`trip-${plan.id}`} plan={plan} letter={String.fromCharCode(65 + planIndex)} />
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
