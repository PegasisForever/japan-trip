import { useEffect, useState } from 'react'
import { Block, Button, List, ListItem, Preloader } from 'framework7-react'
import { detailsOf, foundLinks, type Found, type FoundDetails } from './search'

/** "Mo-Fr 10:00-20:00; Sa,Su 10:00-18:00" → one line per part */
const hoursLines = (h: string) => h.split(/;\s*/).filter(Boolean)

/**
 * A searched place, not from the plan: name, kind and area at once, then the OpenStreetMap details
 * (hours, phone, website) and a Wikipedia summary when they load. Directions open Apple or Google Maps.
 */
export default function FoundView({ found }: { found: Found }) {
  const [d, setD] = useState<FoundDetails | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    // A new place mounts a new view (key), so the state starts empty
    const ac = new AbortController()
    detailsOf(found, ac.signal)
      .then(setD)
      .catch((e) => !ac.signal.aborted && (console.warn(e), setFailed(true)))
    return () => ac.abort()
  }, [found])

  const links = foundLinks(found)
  const ja = d?.nameJa && d.nameJa !== found.name ? d.nameJa : null
  const en = d?.nameEn && d.nameEn !== found.name ? d.nameEn : null

  return (
    <div className="found">
      {d?.wiki?.image && <img className="found-img" src={d.wiki.image} alt="" />}
      <Block className="found-head">
        <p className="found-kind">
          {found.kind}
          {found.area && ` · ${found.area}`}
        </p>
        <h2>{found.name}</h2>
        {(ja || en) && <p className="found-alt">{[en, ja].filter(Boolean).join(' · ')}</p>}
        <p className="found-note">From OpenStreetMap: not a place in your plan.</p>
      </Block>

      <Block className="found-actions">
        <Button fill round external target="_blank" href={links.apple}>
          <i className="f7-icons">arrow_up_right_diamond_fill</i> Apple Maps
        </Button>
        <Button tonal round external target="_blank" href={links.google}>
          Google Maps
        </Button>
      </Block>

      {!d && !failed && (
        <Block className="found-loading">
          <Preloader size={20} /> Loading details…
        </Block>
      )}
      {failed && <Block className="found-note">Details could not be loaded. Check the internet connection.</Block>}

      {d && (d.hours || d.phone || d.website || d.cuisine || d.address) && (
        <List inset strong dividers className="found-info">
          {d.hours && (
            <ListItem header="Hours (OpenStreetMap)">
              <div slot="title" className="found-hours">
                {hoursLines(d.hours).map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </ListItem>
          )}
          {d.cuisine && <ListItem header="Food" title={d.cuisine} />}
          {d.phone && <ListItem header="Phone" title={d.phone} link={`tel:${d.phone.replace(/[^\d+]/g, '')}`} external />}
          {d.website && <ListItem header="Website" title={d.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')} link={d.website} external target="_blank" />}
          {d.address && <ListItem header="Address" title={d.address} />}
        </List>
      )}

      {d?.wiki && (
        <Block className="found-wiki">
          <p>{d.wiki.text}</p>
          {d.wiki.url && (
            <a className="external" href={d.wiki.url} target="_blank" rel="noreferrer">
              Wikipedia: {d.wiki.title}
            </a>
          )}
        </Block>
      )}
      {d && !d.hours && !d.wiki && <Block className="found-note">OpenStreetMap has no hours or description for this place.</Block>}

      <Block className="found-note">
        <a className="external" href={links.osm} target="_blank" rel="noreferrer">
          Open in OpenStreetMap
        </a>
      </Block>
    </div>
  )
}
