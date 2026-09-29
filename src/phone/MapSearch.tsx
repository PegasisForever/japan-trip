import { Searchbar, f7 } from 'framework7-react'
import { useEffect, useState } from 'react'
import { SearchResults } from '../shared/SearchBox'
import { days, places } from '../data/trip'
import { getPhone, setPhone, usePhone } from './store'

/** Where the search looks first: tonight's bed, else the first place of the day on the map */
function nearOf(): [number, number] | null {
  const d = days.find((x) => x.n === getPhone().mapDay)
  const p = d ? places[d.sleep ?? d.stops[0]?.place] : null
  return p ? [p.lon, p.lat] : null
}

const close = () => f7.searchbar.disable('.map-searchbar')

/**
 * Framework7's iOS 26 expandable searchbar over the top row of the map: the search button in that row
 * opens it (glass field + round close button), the results float under it in one glass card.
 */
export default function MapSearch() {
  const { search } = usePhone()
  const [q, setQ] = useState('')

  // While searching, keep the page still under the keyboard: iOS scrolls the whole page to show the field,
  // and then the page and the result list both scroll. Follow the visible height and put the page back.
  useEffect(() => {
    const vv = window.visualViewport
    if (!search || !vv) return
    const fit = () => {
      document.documentElement.style.setProperty('--vv-height', `${vv.height}px`)
      if (window.scrollY || document.scrollingElement?.scrollTop) window.scrollTo(0, 0)
    }
    fit()
    vv.addEventListener('resize', fit)
    vv.addEventListener('scroll', fit)
    return () => {
      vv.removeEventListener('resize', fit)
      vv.removeEventListener('scroll', fit)
      document.documentElement.style.removeProperty('--vv-height')
    }
  }, [search])

  return (
    <>
      <div className="map-search-bar">
        <Searchbar
          className="map-searchbar"
          expandable
          customSearch
          form={false}
          clearButton
          disableButton
          backdrop={false}
          placeholder="Search any place in Japan"
          onSearchbarSearch={(_sb, query) => setQ(String(query ?? ''))}
          onSearchbarClear={() => setQ('')}
          onSearchbarEnable={() => setPhone({ search: true })}
          onSearchbarDisable={() => {
            setPhone({ search: false })
            setQ('')
          }}
        />
      </div>
      {/* Dims the map while searching; a tap closes the search */}
      <div className={`map-search-backdrop${search ? ' is-in' : ''}`} onClick={close} />
      {search && (
        // Scrolling the results hides the keyboard, as in Apple Maps: then there is only one thing to scroll
        <div className="map-search-results" onTouchMove={() => (document.activeElement as HTMLElement | null)?.blur()}>
          <SearchResults
            q={q}
            near={nearOf()}
            onFound={(f) => {
              close()
              setPhone({ found: f, mapPlace: null, focusLeg: null })
            }}
            onPlace={(id) => {
              close()
              f7.views.main?.router.navigate(`/place/${id}/`)
            }}
          />
        </div>
      )}
    </>
  )
}
