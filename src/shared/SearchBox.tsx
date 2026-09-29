import { useEffect, useMemo, useState } from 'react'
import { Searchbar } from 'framework7-react'
import { plan } from '../data/plan'
import { searchPlaces, type Found } from './search'

interface ResultsProps {
  /** Results near this point come first ([lon, lat]) */
  near: [number, number] | null
  onFound: (f: Found) => void
  /** A place from the plan was picked */
  onPlace: (id: string) => void
}

/** Plan places whose English, Japanese or romaji name contains the text */
function planMatches(q: string) {
  const t = q.trim().toLowerCase()
  if (t.length < 2) return []
  return Object.values(plan.places)
    .filter((p) => plan.days.some((d) => d.stops.some((s) => s.place === p.id) || d.sleep === p.id))
    .filter((p) => [p.en, p.ja, p.romaji].some((n) => n?.toLowerCase().includes(t)))
    .slice(0, 4)
}

/** Places from your plan first, then any place in Japan from OpenStreetMap. The search starts after a short pause in the typing. */
export function SearchResults({ q, near, onFound, onPlace }: ResultsProps & { q: string }) {
  const [results, setResults] = useState<Found[]>([])
  const [state, setState] = useState<'idle' | 'busy' | 'error'>('idle')
  const mine = useMemo(() => planMatches(q), [q])

  useEffect(() => {
    const text = q.trim()
    if (text.length < 2) {
      setResults([])
      setState('idle')
      return
    }
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      setState('busy')
      searchPlaces(text, near, ac.signal)
        .then((r) => {
          setResults(r)
          setState('idle')
        })
        .catch(() => !ac.signal.aborted && setState('error'))
    }, 350)
    return () => {
      window.clearTimeout(t)
      ac.abort()
    }
    // "near" only changes the order: a new search is not needed for it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const empty = q.trim().length >= 2 && state === 'idle' && !results.length && !mine.length
  if (!mine.length && !results.length && state === 'idle' && !empty) return null

  return (
    <div className="search-results-box">
      <ul className="search-results" role="listbox">
        {mine.map((p) => (
          <li key={p.id}>
            <button type="button" onClick={() => onPlace(p.id)}>
              <i className="f7-icons search-ico is-plan" aria-hidden>
                star_fill
              </i>
              <span>
                <b>{p.en}</b>
                <small>In your plan · {p.ja}</small>
              </span>
            </button>
          </li>
        ))}
        {results.map((f) => (
          <li key={f.key}>
            <button type="button" onClick={() => onFound(f)}>
              <i className="f7-icons search-ico" aria-hidden>
                placemark
              </i>
              <span>
                <b>{f.name}</b>
                <small>
                  {f.kind}
                  {f.area && ` · ${f.area}`}
                </small>
              </span>
            </button>
          </li>
        ))}
        {state === 'busy' && <li className="search-msg">Searching…</li>}
        {state === 'error' && <li className="search-msg">The search did not work. Check the internet connection.</li>}
        {empty && <li className="search-msg">Nothing found. Try the Japanese name, or a shorter name.</li>}
      </ul>
      {results.length > 0 && <p className="search-credit">Search data © OpenStreetMap contributors</p>}
    </div>
  )
}

/** Desktop: Framework7's iOS 26 glass searchbar, with the results under it */
export default function SearchBox({ near, onFound, onPlace }: ResultsProps) {
  const [q, setQ] = useState('')
  return (
    <div className="search-box">
      <Searchbar
        inline
        customSearch
        form={false}
        clearButton
        placeholder="Search any place in Japan"
        onSearchbarSearch={(_sb, query) => setQ(String(query ?? ''))}
        onSearchbarClear={() => setQ('')}
      />
      <SearchResults q={q} near={near} onFound={onFound} onPlace={onPlace} />
    </div>
  )
}
