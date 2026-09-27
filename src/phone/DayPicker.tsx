import { Sheet, PageContent, List, ListItem, BlockTitle } from 'framework7-react'
import { days, dateShort } from '../data/trip'
import { photoUrl } from '../data/photos'
import { places } from '../data/trip'
import { setPhone, showDay, usePhone } from './store'

/** All days in a sheet from the bottom. Swipe down to close. */
export default function DayPicker() {
  const { picker, mapDay } = usePhone()
  const pick = (n: number | null) => {
    showDay(n)
    setPhone({ picker: false })
  }
  return (
    <Sheet
      className="day-picker"
      opened={picker}
      onSheetClosed={() => setPhone({ picker: false })}
      swipeToClose
      swipeHandler=".day-picker .grabber"
      backdrop
    >
      <div className="grabber" />
      <PageContent>
        <BlockTitle large>Days</BlockTitle>
        <List inset strong dividers mediaList className="picker-list">
          <ListItem link="#" noChevron title="Whole trip" header={`${days.length} days`} onClick={() => pick(null)} selected={mapDay === null}>
            <div slot="media" className="thumb trip">
              <i className="f7-icons">map_fill</i>
            </div>
          </ListItem>
          {days.map((d) => {
            const c = places[d.cover]
            return (
              <ListItem
                key={d.n}
                link="#"
                noChevron
                title={d.short}
                header={`Day ${d.n} · ${dateShort(d)}`}
                onClick={() => pick(d.n)}
                selected={mapDay === d.n}
              >
                <div slot="media" className="thumb">
                  {c?.photo && <img src={photoUrl(c.photo, 160)} alt="" loading="lazy" />}
                </div>
              </ListItem>
            )
          })}
        </List>
      </PageContent>
    </Sheet>
  )
}
