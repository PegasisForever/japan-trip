import { Page, Navbar, List, ListItem, BlockTitle, Block, f7 } from 'framework7-react'
import { useState } from 'react'
import { plan } from '../data/plan'
import { days, loadDone, saveDone, stays, tripRange, daysToGo, dateShort } from '../data/trip'

/** "book now (by Sep 30, 2026): ..." → "By Sep 30"; "Booked (Sep 26 ...)" → "Booked" */
function deadline(why: string) {
  if (/^booked\b/i.test(why)) return 'Booked'
  const m = /\bby ((?:early |mid |late )?[A-Z][a-z]{2,8}(?: \d{1,2})?)/.exec(why)
  return m ? `By ${m[1]}` : ''
}

/** Trip tab: what to book, where you sleep, flights and money. */
export default function TripPage() {
  const [done, setDone] = useState<number[]>(loadDone)
  const book = plan.bookFirst ?? []
  const toGo = daysToGo()

  const toggle = (i: number) => {
    const next = done.includes(i) ? done.filter((x) => x !== i) : [...done, i]
    setDone(next)
    saveDone(next)
  }
  const why = (i: number) => f7.dialog.alert(book[i].why, book[i].what.split(/[,:(]/)[0])

  // "≈ ¥409,000 Pegasis / ¥389,000 Aoki, plus meals ..." → the two amounts
  const [peg, aoki] = plan.cost.total.match(/¥[\d,]+/g) ?? []

  return (
    <Page className="trip-page">
      <Navbar large title="Trip" />

      <div className="trip-hero">
        <p className="num">
          <b>{toGo > 0 ? toGo : days.length}</b>
          <span>{toGo > 0 ? 'days to go' : 'days'}</span>
        </p>
        <p>
          {tripRange()}
          <br />
          Tokyo → Osaka → Hokkaido
        </p>
      </div>

      <BlockTitle>
        Book before you go <span className="count num">{done.length} / {book.length}</span>
      </BlockTitle>
      <List inset strong dividers className="book-list">
        {book.map((b, i) => (
          <ListItem key={i} checkbox checked={done.includes(i)} onChange={() => toggle(i)} className={done.includes(i) ? 'is-done' : ''}>
            <span slot="title" className="book-what">{b.what}</span>
            {deadline(b.why) && (
              <span slot="footer" className={deadline(b.why) === 'Booked' ? 'ok' : 'due'}>
                {deadline(b.why)}
              </span>
            )}
            <span slot="after">
              <a
                className="link why-link"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  why(i)
                }}
                aria-label="Why"
              >
                <i className="f7-icons">info_circle</i>
              </a>
            </span>
          </ListItem>
        ))}
      </List>

      <BlockTitle>Where you sleep</BlockTitle>
      <List inset strong dividers mediaList={false}>
        {stays().map((s) => (
          <ListItem
            key={`${s.place.id}-${s.from.n}`}
            link={`/place/${s.place.id}/?day=${s.from.n}`}
            title={s.place.en}
            footer={`${dateShort(s.from)} · ${s.nights} ${s.nights > 1 ? 'nights' : 'night'}`}
          />
        ))}
      </List>

      <BlockTitle>Cost per person</BlockTitle>
      <List inset strong dividers accordionList>
        <ListItem title="Pegasis" after={peg} />
        <ListItem title="Aoki" after={aoki} />
        <ListItem accordionItem title="Details">
          <div className="accordion-item-content">
            <Block className="cost-detail">
              <p><b>Transport</b> {plan.cost.transport}</p>
              <p><b>Hotels</b> {plan.cost.hotels}</p>
              <p><b>Activities</b> {plan.cost.activities}</p>
              <p><b>Total</b> {plan.cost.total}</p>
            </Block>
          </div>
        </ListItem>
      </List>
      <Block className="fine">Without international flights and meals (meals about ¥4,000–6,000 a day).</Block>

      <BlockTitle>Flights</BlockTitle>
      <List inset strong dividers className="flight-list">
        {plan.flights.map((f, i) => (
          // The fare notes in brackets stay in the full plan
          <ListItem key={i} text={f.replace(/ \([^)]*\)\.?$/, '.').replace(/\.\.$/, '.')} />
        ))}
      </List>
    </Page>
  )
}
