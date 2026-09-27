import { Page, Navbar, List, ListItem, BlockTitle, BlockFooter } from 'framework7-react'
import { REGION } from '../data/style'
import { photoUrl } from '../data/photos'
import { days, places, dateShort, today, daysToGo, tripRange } from '../data/trip'
import type { Day } from '../data/types'

/** Runs of days in the same region: "Tokyo & Kawasaki", then "Hakone & Mt Fuji"... */
function runs() {
  const out: Day[][] = []
  for (const d of days) {
    const last = out[out.length - 1]
    if (last && last[0].region === d.region) last.push(d)
    else out.push([d])
  }
  return out
}

/** Days tab: one row per day. The day page has the rest. */
export default function DaysPage() {
  const now = today()
  const toGo = daysToGo()
  return (
    <Page className="days-page">
      <Navbar large title="Days" />
      <p className="days-when">
        {tripRange()}
        {toGo > 0 && <span> · in {toGo} days</span>}
      </p>
      {runs().map((run) => (
        <div key={run[0].n}>
          <BlockTitle>{REGION[run[0].region].en}</BlockTitle>
          <List mediaList inset strong dividers className="days-list">
            {run.map((d) => {
              const cover = places[d.cover]
              return (
                <ListItem
                  key={d.n}
                  link={`/day/${d.n}/`}
                  title={d.short}
                  header={`Day ${d.n} · ${dateShort(d)}`}
                  badge={now?.n === d.n ? 'Today' : undefined}
                  badgeColor="primary"
                  style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
                >
                  <div slot="media" className="thumb">
                    {cover?.photo && <img src={photoUrl(cover.photo, 160)} alt="" loading="lazy" />}
                  </div>
                </ListItem>
              )
            })}
          </List>
        </div>
      ))}
      <BlockFooter className="days-foot">Pegasis and Aoki · Yukimichi 雪道</BlockFooter>
    </Page>
  )
}
