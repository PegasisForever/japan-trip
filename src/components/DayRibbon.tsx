import type { Choice, Day, Idea } from '../data/types'
import { REGION } from '../data/style'

interface Props {
  days: Day[]
  ideas: Idea[]
  choices: Record<string, Choice>
  day: number | null
  onDay: (n: number | null) => void
}

/** Bottom row in Ideas mode: how many ideas fit each day, and how many you want */
export default function DayRibbon({ days, ideas, choices, day, onDay }: Props) {
  const stat = (list: Idea[]) => ({
    n: list.length,
    yes: list.filter((i) => choices[i.id]?.verdict === 'yes').length,
    open: list.filter((i) => !choices[i.id]?.verdict).length,
  })
  return (
    <nav className="ribbon" aria-label="Ideas per day">
      {days.map((d) => {
        const s = stat(ideas.filter((i) => i.days.includes(d.n)))
        return (
          <button
            key={d.n}
            className={`rib${day === d.n ? ' is-on' : ''}`}
            style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
            aria-pressed={day === d.n}
            onClick={() => onDay(day === d.n ? null : d.n)}
          >
            <span className="rib-top">
              <span className="tab-n">{d.n}</span> {d.short}
            </span>
            <span className="rib-n">
              <b>{s.n}</b> {s.n === 1 ? 'idea' : 'ideas'}
            </span>
            <span className="rib-sub">
              {s.yes > 0 && (
                <em className="rib-yes">
                  {s.yes} want
                </em>
              )}
              {s.open > 0 ? <em>{s.open} to decide</em> : <em>all decided</em>}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
