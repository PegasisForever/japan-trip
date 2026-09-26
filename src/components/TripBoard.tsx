import { useState } from 'react'
import type { Day } from '../data/types'
import { REGION } from '../data/style'
import { trip } from '../data'

interface Props {
  days: Day[]
}

const KEY = 'yukimichi-booked'

function loadDone(): number[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

export default function TripBoard({ days }: Props) {
  const [done, setDone] = useState<number[]>(loadDone)
  const regions = Object.entries(REGION).map(([key, r]) => ({
    key,
    ...r,
    count: days.filter((d) => d.region === key).length,
  }))

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    setDone(next)
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      /* storage blocked: the ticks just do not persist */
    }
  }

  return (
    <aside className="board board-trip">
      <div className="ekimei">
        <div className="ekimei-meta">
          <span>15 days · 2 travellers</span>
          <span>Jan 19 – Feb 2, 2027</span>
        </div>
        <h1 className="ekimei-ja" lang="ja">東京 → 札幌</h1>
        <p className="ekimei-romaji">Tōkyō → Sapporo</p>
        <div className="region-bar" aria-label="Days per region">
          {regions.map((r) => (
            <span key={r.key} style={{ flex: r.count, background: r.color }} title={`${r.en}: ${r.count} days`} />
          ))}
        </div>
        <div className="region-legend">
          {regions.map((r) => (
            <span key={r.key}>
              <i style={{ background: r.color }} />
              {r.en} {r.count}d
            </span>
          ))}
        </div>
      </div>

      <div className="board-body">
        <dl className="facts">
          {trip.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>

        <section className="alerts alerts-todo">
          <h3>
            Book these <span>{done.length} / {trip.bookFirst.length} done</span>
          </h3>
          <ul className="todo">
            {trip.bookFirst.map((b, i) => (
              <li key={i} className={done.includes(i) ? 'is-done' : ''}>
                <label>
                  <input id={`book-${i}`} type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
                  <span>
                    <b>{b.what}</b>
                    <small>{b.why}</small>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <details className="fold">
          <summary>Who travels when</summary>
          <ul className="people">
            {trip.people.map((p) => (
              <li key={p.name}>
                <b>{p.name}</b>
                <span>{p.line}</span>
              </li>
            ))}
          </ul>
        </details>

        <details className="fold">
          <summary>
            Budget per person <b>{trip.budget[trip.budget.length - 1].value}</b>
          </summary>
          <table className="budget">
            <tbody>
              {trip.budget.map((b) => (
                <tr key={b.item}>
                  <th>{b.item}</th>
                  <td>{b.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fine">{trip.budgetNote}</p>
        </details>

        <details className="fold">
          <summary>Driving rules</summary>
          <ul className="notes">
            {trip.driving.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </details>
      </div>
    </aside>
  )
}
