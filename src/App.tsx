import { useCallback, useEffect, useMemo, useState } from 'react'
import MapView from './components/MapView'
import TopBar from './components/TopBar'
import DayBoard from './components/DayBoard'
import TripBoard from './components/TripBoard'
import Strip from './components/Strip'
import PlaceDetail from './components/PlaceDetail'
import MapKey from './components/MapKey'
import IdeasPanel, { type IdeaFilter } from './components/IdeasPanel'
import IdeaDetail from './components/IdeaDetail'
import ReviewMode from './components/ReviewMode'
import DayRibbon from './components/DayRibbon'
import { ideas } from './data/ideas'
import { useChoices } from './data/useChoices'
import { days, places } from './data'
import routes from './data/routes.json'

const isIdeasHash = () => window.location.hash === '#ideas'

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
  const [ideasMode, setIdeasMode] = useState(isIdeasHash)
  const [reviewing, setReviewing] = useState(false)
  const [filter, setFilter] = useState<IdeaFilter>({ status: 'todo', category: null, kind: null, day: null })
  const { choices, update, stored } = useChoices()

  // The map shows every idea that matches type/size/day; the list also filters by your choice
  const onMap = useMemo(
    () =>
      ideas.filter(
        (i) =>
          (!filter.category || i.category === filter.category) &&
          (!filter.kind || i.kind === filter.kind) &&
          (!filter.day || i.days.includes(filter.day)),
      ),
    [filter.category, filter.kind, filter.day],
  )
  const shown = useMemo(
    () =>
      onMap.filter((i) => {
        const v = choices[i.id]?.verdict
        return filter.status === 'all' || (filter.status === 'todo' ? !v : v === filter.status)
      }),
    [onMap, choices, filter.status],
  )
  const openIdeas = useCallback((on: boolean) => {
    setIdeasMode(on)
    setSelected(null)
    setHovered(null)
    history.replaceState(null, '', on ? '#ideas' : '#trip')
  }, [])

  const pickDay = useCallback((n: number | null) => {
    setIdeasMode(false)
    setDayN(n)
    setSelected(null)
    setHovered(null)
    history.replaceState(null, '', n ? `#day-${n}` : '#trip')
  }, [])

  useEffect(() => {
    const onHash = () => {
      setIdeasMode(isIdeasHash())
      setDayN(readHash())
      setSelected(null)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || ideasMode) {
        if (e.key === 'Escape') setSelected(null)
        return
      }
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'ArrowRight') pickDay(Math.min(days.length, (dayN ?? 0) + 1))
      if (e.key === 'ArrowLeft') pickDay(dayN && dayN > 1 ? dayN - 1 : null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dayN, pickDay, ideasMode])

  const selectedIdea = ideasMode ? ideas.find((i) => i.id === selected) : undefined

  return (
    <div className={`app${ideasMode ? ' mode-ideas' : ''}`}>
      <MapView
        days={days}
        places={places}
        routes={routes as unknown as Record<string, [number, number][]>}
        day={ideasMode ? null : day}
        hovered={hovered}
        selected={selected}
        onHover={setHovered}
        onSelect={setSelected}
        onPickDay={pickDay}
        ideas={ideasMode ? onMap : null}
        choices={choices}
      />
      <TopBar
        days={days}
        current={ideasMode ? -1 : dayN}
        onPick={pickDay}
        ideasOpen={ideasMode}
        onIdeas={() => openIdeas(true)}
        ideasLeft={ideas.filter((i) => !choices[i.id]?.verdict).length}
      />
      {ideasMode ? (
        <>
          {!reviewing && <IdeasPanel
            ideas={onMap}
            shown={shown}
            choices={choices}
            filter={filter}
            setFilter={setFilter}
            hovered={hovered}
            selected={selected}
            onHover={setHovered}
            onSelect={setSelected}
            onVerdict={(id, v) => update(id, { verdict: v })}
            onReview={() => setReviewing(true)}
            stored={stored}
            allIdeas={ideas}
          />}
          <DayRibbon days={days} ideas={ideas} choices={choices} day={filter.day} onDay={(n) => setFilter({ ...filter, day: n })} />
          <div className="mapkey ideas-key" aria-label="Map key">
            <span><i className="ring v-yes" />Want</span>
            <span><i className="ring v-maybe" />Maybe</span>
            <span><i className="ring" />To decide</span>
            <span><i className="dash" style={{ '--mc': '#fff' } as React.CSSProperties} />Multi-day route</span>
          </div>
          {selectedIdea && !reviewing && (
            <IdeaDetail
              key={selectedIdea.id}
              idea={selectedIdea}
              choice={choices[selectedIdea.id]}
              onVerdict={(v) => update(selectedIdea.id, { verdict: v })}
              onNote={(n) => update(selectedIdea.id, { note: n })}
              onClose={() => setSelected(null)}
            />
          )}
          {reviewing && (
            <ReviewMode
              queue={shown.filter((i) => !choices[i.id]?.verdict).length ? shown.filter((i) => !choices[i.id]?.verdict) : shown}
              choices={choices}
              onVerdict={(id, v) => update(id, { verdict: v })}
              onNote={(id, n) => update(id, { note: n })}
              onFocus={setSelected}
              onClose={() => {
                setReviewing(false)
                setSelected(null)
              }}
            />
          )}
        </>
      ) : (
        <>
          {day ? (
            <DayBoard
              key={day.n}
              day={day}
              days={days}
              places={places}
              onPick={pickDay}
              onSelect={setSelected}
              ideaCount={ideas.filter((i) => i.kind !== 'planned' && i.days.includes(day.n)).length}
              onIdeas={() => {
                setFilter({ status: 'all', category: null, kind: null, day: day.n })
                openIdeas(true)
              }}
            />
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
            <PlaceDetail key={selected} place={places[selected]} day={day} onClose={() => setSelected(null)} />
          )}
        </>
      )}
    </div>
  )
}
