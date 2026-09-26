import { useEffect, useRef } from 'react'
import type { Day } from '../data/types'
import { REGION } from '../data/style'

interface Props {
  days: Day[]
  current: number | null
  onPick: (n: number | null) => void
  ideasOpen: boolean
  onIdeas: () => void
  ideasLeft: number
}

export default function TopBar({ days, current, onPick, ideasOpen, onIdeas, ideasLeft }: Props) {
  const rail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rail.current?.querySelector<HTMLElement>('[aria-selected="true"]')
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [current])

  return (
    <header className="topbar">
      <button className="brand" onClick={() => onPick(null)} aria-label="Whole trip">
        <span className="brand-ja" lang="ja">雪道</span>
        <span className="brand-en">
          <b>Yukimichi</b>
          <small>Tokyo to Sapporo, Jan 2027</small>
        </span>
      </button>
      <button className="ideas-btn" aria-pressed={ideasOpen} onClick={onIdeas}>
        <span>Ideas</span>
        <span className="ideas-btn-n" aria-label={ideasLeft > 0 ? `${ideasLeft} to decide` : 'All decided'}>
          {ideasLeft > 0 ? ideasLeft : 'Done'}
        </span>
      </button>
      <div className="tabs" role="tablist" ref={rail}>
        <button
          role="tab"
          aria-selected={current === null}
          className="tab tab-trip"
          onClick={() => onPick(null)}
        >
          <span className="tab-top">Whole trip</span>
          <span className="tab-date" lang="ja">全行程</span>
        </button>
        {days.map((d) => {
          const [, m, dd] = d.date.split('-')
          return (
            <button
              key={d.n}
              role="tab"
              aria-selected={current === d.n}
              className="tab"
              style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
              onClick={() => onPick(d.n)}
              title={`${d.title} · ${d.titleJa}`}
            >
              <span className="tab-top">
                <span className="tab-n">{d.n}</span> {d.short}
              </span>
              <span className="tab-date">
                {Number(m)}/{Number(dd)} <span lang="ja">{d.weekday}</span>
              </span>
            </button>
          )
        })}
      </div>
    </header>
  )
}
