import { useEffect, useRef } from 'react'
import type { Day } from '../data/types'
import { REGION } from '../data/style'

interface Props {
  days: Day[]
  current: number | null
  onPick: (n: number | null) => void
}

export default function DayTabs({ days, current, onPick }: Props) {
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rail.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [current])

  return (
    <header className="dtop">
      <div className="dtabs" role="tablist" ref={rail}>
        <button
          role="tab"
          aria-selected={current === null}
          className="dtab dtab-trip"
          onClick={() => onPick(null)}
        >
          <span className="dtab-top">Whole trip</span>
          <span className="dtab-date" lang="ja">全行程</span>
        </button>
        {days.map((d) => {
          const [, m, dd] = d.date.split('-')
          return (
            <button
              key={d.n}
              role="tab"
              aria-selected={current === d.n}
              className="dtab"
              style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
              onClick={() => onPick(d.n)}
              title={`${d.title} · ${d.titleJa}`}
            >
              <span className="dtab-top">
                <span className="dtab-n">{d.n}</span> {d.short}
              </span>
              <span className="dtab-date">
                {Number(m)}/{Number(dd)} <span lang="ja">{d.weekday}</span>
              </span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
