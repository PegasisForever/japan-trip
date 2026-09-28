import { Sheet, PageContent, f7 } from 'framework7-react'
import { useRef } from 'react'
import SearchBox from '../shared/SearchBox'
import { days, places } from '../data/trip'
import { getPhone, setPhone, usePhone } from './store'

/** Where the search looks first: tonight's bed, else the first place of the day on the map */
function nearOf(): [number, number] | null {
  const d = days.find((x) => x.n === getPhone().mapDay)
  const p = d ? places[d.sleep ?? d.stops[0]?.place] : null
  return p ? [p.lon, p.lat] : null
}

/** Search any place: a sheet from the bottom with the field at the top. Swipe down to close. */
export default function SearchSheet() {
  const { search } = usePhone()
  const input = useRef<HTMLInputElement>(null)
  return (
    <Sheet
      className="search-sheet"
      opened={search}
      onSheetClosed={() => {
        setPhone({ search: false })
        input.current?.blur()
      }}
      swipeToClose
      backdrop
    >
      <div className="picker-head">
        <div className="grabber" />
        <h2>Search</h2>
      </div>
      <PageContent>
        <SearchBox
          ref={input}
          className="search-in-sheet"
          near={nearOf()}
          onFound={(f) => {
            input.current?.blur()
            setPhone({ search: false, found: f, mapPlace: null, focusLeg: null })
          }}
          onPlace={(id) => {
            input.current?.blur()
            setPhone({ search: false, found: null })
            f7.views.main?.router.navigate(`/place/${id}/`)
          }}
        />
      </PageContent>
    </Sheet>
  )
}

/** Open the search and bring up the keyboard. The focus must happen in the tap itself, or iOS shows no keyboard. */
export function openSearch() {
  setPhone({ search: true })
  document.querySelector<HTMLInputElement>('.search-sheet input')?.focus({ preventScroll: true })
}
