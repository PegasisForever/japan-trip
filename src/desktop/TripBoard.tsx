import { List, ListItem, Block, BlockTitle } from 'framework7-react'
import { REGION } from '../data/style'
import { plan } from '../data/plan'
import { days, stays, tripRange } from '../data/trip'
import { bookings, tripPage } from '../data/bookings'

/** Left panel for the whole trip: where you sleep, what to book (in Notion) */
export default function TripBoard({ onSelect }: { onSelect: (id: string) => void }) {
  const regions = (Object.keys(REGION) as (keyof typeof REGION)[])
    .map((r) => ({ key: r, ...REGION[r], count: days.filter((d) => d.region === r).length }))
    .filter((r) => r.count > 0)

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

      <BlockTitle>Book before you go</BlockTitle>
      {/* The list and the "Booked" ticks are in Notion, with the budget, the flights and who wanted what; each row opens its Notion page */}
      <List inset strong dividers className="side-book">
        <ListItem link={tripPage} external target="_blank" title="Bookings, budget, flights, day notes" footer="Notion">
          <i slot="media" className="f7-icons">square_pencil</i>
        </ListItem>
        {bookings.map((b) => (
          <ListItem key={b.id} link={b.notion} external target="_blank" title={b.name}>
            <i slot="media" className="f7-icons">ticket</i>
          </ListItem>
        ))}
      </List>

      <Block className="side-fine">{plan.summary}</Block>
    </>
  )
}
