import { useState } from 'react'
import { List, ListItem, Block, BlockTitle } from 'framework7-react'
import { REGION } from '../data/style'
import { plan } from '../data/plan'
import { days, headline, loadDone, saveDone, stays, tripRange } from '../data/trip'

/** Left panel for the whole trip: where you sleep, money, what to book */
export default function TripBoard({ onSelect }: { onSelect: (id: string) => void }) {
  const [done, setDone] = useState<number[]>(loadDone)
  const book = plan.bookFirst ?? []
  const regions = (Object.keys(REGION) as (keyof typeof REGION)[])
    .map((r) => ({ key: r, ...REGION[r], count: days.filter((d) => d.region === r).length }))
    .filter((r) => r.count > 0)

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    setDone(next)
    saveDone(next)
  }

  return (
    <>
      <header className="side-head">
        <span className="side-kicker num">
          Whole trip · {days.length} days · {tripRange()}
        </span>
        <h1>{plan.name}</h1>
        <p className="side-sub">{plan.tagline}</p>
        <div className="region-bar" aria-label="Days per region">
          {regions.map((r) => (
            <span key={r.key} style={{ flex: r.count, background: r.color }} title={`${r.en}: ${r.count} days`} />
          ))}
        </div>
        <div className="region-legend">
          {regions.map((r) => (
            <span key={r.key}>
              <i style={{ background: r.color }} />
              {r.en} <small>{r.count}</small>
            </span>
          ))}
        </div>
      </header>

      <BlockTitle>Where you sleep</BlockTitle>
      <List inset strong dividers className="side-stays">
        {stays().map((s) => (
          <ListItem
            key={`${s.place.id}-${s.from.n}`}
            link="#"
            onClick={() => onSelect(s.place.id)}
            title={s.place.en}
            footer={`From day ${s.from.n}`}
            after={`${s.nights} ${s.nights > 1 ? 'nights' : 'night'}`}
          />
        ))}
      </List>

      <BlockTitle>Per person, without flights</BlockTitle>
      <List inset strong dividers className="side-money">
        <ListItem title="Total" after={headline(plan.cost.total)} />
        <ListItem title="Transport" after={headline(plan.cost.transport)} />
        <ListItem title="Hotels" after={headline(plan.cost.hotels)} />
      </List>

      {book.length > 0 && (
        <>
          <BlockTitle>
            Book before you go <span className="side-count num">{done.length} of {book.length} done</span>
          </BlockTitle>
          <List inset strong dividers mediaList className="side-book">
            {book.map((b, i) => (
              <ListItem key={i} checkbox checked={done.includes(i)} onChange={() => toggle(i)} className={done.includes(i) ? 'is-done' : ''} title={b.what} text={b.why} />
            ))}
          </List>
        </>
      )}

      <List inset strong accordionList dividers className="side-more">
        <ListItem accordionItem title="Pegasis and Aoki">
          <div className="accordion-item-content">
            <Block>
              <p>
                <b>Pegasis.</b> {plan.who.pegasis}
              </p>
              <p>
                <b>Aoki.</b> {plan.who.aoki}
              </p>
            </Block>
          </div>
        </ListItem>
        <ListItem accordionItem title="Flights">
          <div className="accordion-item-content">
            <Block>
              <ul className="side-notes">
                {plan.flights.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </Block>
          </div>
        </ListItem>
        <ListItem accordionItem title="Cost details">
          <div className="accordion-item-content">
            <Block>
              <p><b>Transport.</b> {plan.cost.transport}</p>
              <p><b>Hotels.</b> {plan.cost.hotels}</p>
              <p><b>Activities.</b> {plan.cost.activities}</p>
              <p><b>Total.</b> {plan.cost.total}</p>
            </Block>
          </div>
        </ListItem>
      </List>
      <Block className="side-fine">{plan.summary}</Block>
    </>
  )
}
