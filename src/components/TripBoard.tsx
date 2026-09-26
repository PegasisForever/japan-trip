import { useState } from 'react'
import type { Day, Place } from '../data/types'
import { REGION } from '../data/style'
import type { LoadedPlan } from '../data/plans'
import Icon from './Icon'

interface Props {
  plan: LoadedPlan
  letter: string
}

/** Consecutive nights at the same hotel, e.g. "Shinjuku 4 nights" */
function bases(days: Day[], places: Record<string, Place>) {
  const out: { place: Place; nights: number; from: number }[] = []
  for (const d of days) {
    if (!d.sleep || !places[d.sleep]) continue
    const last = out[out.length - 1]
    if (last && last.place.id === d.sleep) last.nights += 1
    else out.push({ place: places[d.sleep], nights: 1, from: d.n })
  }
  return out
}

function loadDone(key: string): number[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

export default function TripBoard({ plan, letter }: Props) {
  const key = `yukimichi-booked-${plan.id}`
  const [done, setDone] = useState<number[]>(() => loadDone(key))
  const regions = (Object.keys(REGION) as (keyof typeof REGION)[])
    .map((r) => ({ key: r, ...REGION[r], count: plan.days.filter((d) => d.region === r).length }))
    .filter((r) => r.count > 0)

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    setDone(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
    } catch {
      /* storage blocked: the ticks just do not persist */
    }
  }

  return (
    <aside className="board board-trip">
      <div className="ekimei">
        <div className="ekimei-meta">
          <span>Plan {letter}</span>
          <span>
            {plan.days.length} days, Jan 19 to Feb 2, 2027
          </span>
        </div>
        <h1 className="ekimei-ja">{plan.name}</h1>
        <p className="ekimei-romaji">{plan.tagline}</p>
        <div className="region-bar" aria-label="Days per region">
          {regions.map((r) => (
            <span key={r.key} style={{ flex: r.count, background: r.color }} title={`${r.en}: ${r.count} days`} />
          ))}
        </div>
        <div className="region-legend">
          {regions.map((r) => (
            <span key={r.key}>
              <i style={{ background: r.color }} />
              {r.en} <small>{r.count} days</small>
            </span>
          ))}
        </div>
      </div>

      <div className="board-body">
        <p className="board-summary">{plan.summary}</p>

        <section className="bases">
          <h3>Where you sleep</h3>
          <ol>
            {bases(plan.days, plan.places).map((b) => (
              <li key={`${b.place.id}-${b.from}`}>
                <span className="bases-n">{b.nights}</span>
                <span>
                  <b lang="ja">{b.place.ja}</b>
                  <small>
                    {b.place.en}, from day {b.from}
                  </small>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <dl className="facts">
          <div>
            <dt>Total per person</dt>
            <dd>{plan.cost.total}</dd>
          </div>
          <div>
            <dt>Transport</dt>
            <dd>{plan.cost.transport}</dd>
          </div>
          <div>
            <dt>Hotels</dt>
            <dd>{plan.cost.hotels}</dd>
          </div>
        </dl>

        {plan.bookFirst && plan.bookFirst.length > 0 && (
          <section className="alerts alerts-todo">
            <h3>
              Book before you go{' '}
              <span>
                {done.length} of {plan.bookFirst.length} done
              </span>
            </h3>
            <ul className="todo">
              {plan.bookFirst.map((b, i) => (
                <li key={i} className={done.includes(i) ? 'is-done' : ''}>
                  <label>
                    <input id={`book-${plan.id}-${i}`} type="checkbox" checked={done.includes(i)} onChange={() => toggle(i)} />
                    <span>
                      <b>{b.what}</b>
                      <small>{b.why}</small>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        )}

        <details className="fold">
          <summary>
            Pegasis and Aoki <Icon name="down" />
          </summary>
          <ul className="people">
            <li>
              <b>Pegasis</b>
              <span>{plan.who.pegasis}</span>
            </li>
            <li>
              <b>Aoki</b>
              <span>{plan.who.aoki}</span>
            </li>
          </ul>
        </details>

        <details className="fold">
          <summary>
            Flights <Icon name="down" />
          </summary>
          <ul className="notes">
            {plan.flights.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </details>

        <details className="fold">
          <summary>
            Cost details <Icon name="down" />
          </summary>
          <table className="budget">
            <tbody>
              <tr>
                <th>Transport</th>
                <td>{plan.cost.transport}</td>
              </tr>
              <tr>
                <th>Hotels</th>
                <td>{plan.cost.hotels}</td>
              </tr>
              <tr>
                <th>Activities</th>
                <td>{plan.cost.activities}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td>{plan.cost.total}</td>
              </tr>
            </tbody>
          </table>
          <p className="fine">Per person, without international flights.</p>
        </details>
      </div>
    </aside>
  )
}
