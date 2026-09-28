import { useState } from 'react'
import SearchBox from '../shared/SearchBox'
import type { Found } from '../shared/search'
import type { Day } from '../data/types'
import { plan } from '../data/plan'

/** Search field at the top right. A pick clears the field; the place opens in the right panel. */
export default function DesktopSearch({ day, onFound, onPlace }: { day: Day | null; onFound: (f: Found) => void; onPlace: (id: string) => void }) {
  // A new key empties the field after a pick
  const [n, setN] = useState(0)
  const p = day ? plan.places[day.sleep ?? day.stops[0]?.place] : null
  return (
    <div className="d-search glass-panel">
      <SearchBox
        key={n}
        near={p ? [p.lon, p.lat] : [139.767, 35.681]}
        onFound={(f) => {
          onFound(f)
          setN(n + 1)
        }}
        onPlace={(id) => {
          onPlace(id)
          setN(n + 1)
        }}
      />
    </div>
  )
}
