import { Sheet, PageContent } from 'framework7-react'
import { useRef } from 'react'
import { days, placesOf, dateLong, today, tripRange } from '../data/trip'
import { photoUrl } from '../data/photos'
import { REGION } from '../data/style'
import type { Day } from '../data/types'
import { setPhone, showDay, usePhone } from './store'

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

/** Every day as a photo card, by region. Tap one to show it on the map. Swipe down to close. */
export default function DayPicker() {
  const { picker, mapDay } = usePhone()
  const now = today()
  const body = useRef<HTMLDivElement>(null)

  const pick = (n: number) => {
    showDay(n)
    setPhone({ picker: false })
  }

  return (
    <Sheet
      className="day-picker"
      opened={picker}
      // Show the current day in the middle of the list. Set the list's own scroll only:
      // scrollIntoView also moves the sheet itself while it slides in, and the animation jumps.
      onSheetOpen={() => {
        const list = body.current?.closest('.page-content') as HTMLElement | null
        const cur = body.current?.querySelector<HTMLElement>('.is-current')
        if (list && cur) list.scrollTop = Math.max(0, cur.offsetTop - list.clientHeight / 2 + cur.offsetHeight / 2)
      }}
      onSheetClosed={() => setPhone({ picker: false })}
      // Swipe down anywhere on the sheet to close it (from the list, when it is scrolled to the top)
      swipeToClose
      backdrop
    >
      <div className="picker-head">
        <div className="grabber" />
        <h2>Jump to a day</h2>
        <p className="num">{tripRange()}</p>
      </div>
      <PageContent>
        <div ref={body} className="picker-body">
          {runs().map((run) => (
            <section key={run[0].n}>
              <h3 style={{ '--rc': REGION[run[0].region].color } as React.CSSProperties}>{REGION[run[0].region].en}</h3>
              <div className="picker-grid">
                {run.map((d) => {
                  const c = placesOf(d)[d.cover]
                  const sleep = d.sleep ? placesOf(d)[d.sleep] : null
                  return (
                    <button
                      key={d.n}
                      className={`pday${d.n === mapDay ? ' is-current' : ''}`}
                      style={{ '--rc': REGION[d.region].color } as React.CSSProperties}
                      onClick={() => pick(d.n)}
                    >
                      {c?.photo && <img src={photoUrl(c.photo, 480)} alt="" loading="lazy" />}
                      <span className="pday-shade" />
                      <span className="pday-n num">{d.n}</span>
                      {now?.n === d.n && <span className="pday-today">Today</span>}
                      <span className="pday-text">
                        <small className="num">
                          {dateLong(d)} · {d.temp}
                        </small>
                        <b>{d.short}</b>
                        <span>{sleep ? `Night: ${sleep.en}` : 'Fly home'}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </PageContent>
    </Sheet>
  )
}
