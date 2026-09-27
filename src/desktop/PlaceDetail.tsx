import { List, ListItem, Block, Link, Button } from 'framework7-react'
import type { Day, Place } from '../data/types'
import { KIND_LABEL } from '../data/style'
import Gallery from '../shared/Gallery'
import PickTag from '../shared/PickTag'
import { pickOf } from '../data/picks'
import { photosFor } from '../data/gallery'
import { mealOf } from '../data/timeline'
import { mapLinks } from '../data/trip'

interface Props {
  place: Place
  day: Day | null
  onClose: () => void
}

/** Right panel for one place */
export default function PlaceDetail({ place, day, onClose }: Props) {
  const stop = day?.stops.find((s) => s.place === place.id)
  const meal = stop ? mealOf(stop) : null
  const photos = photosFor(place.galleryKey ?? place.id, place.photo, place.credit)
  const links = mapLinks(place)

  return (
    <article className="d-detail glass-panel" aria-label={place.en}>
      <Link className="d-close" iconF7="xmark" onClick={onClose} aria-label="Close details" />
      <div className="d-detail-scroll">
        <Gallery photos={photos} alt={place.en} />
        <Block className="d-place-head">
          <p className="d-kind">
            {meal ?? KIND_LABEL[place.kind]}
            {stop?.time && <span className="num"> · {stop.time}</span>}
            {stop?.who && <span> · {stop.who} only</span>}
          </p>
          <h2 lang="ja">{place.ja}</h2>
          {place.romaji && place.romaji.toLowerCase() !== place.en.toLowerCase() && <p className="d-romaji">{place.romaji}</p>}
          <p className="d-en">{place.en}</p>
          <PickTag pick={pickOf(place.id)} />
        </Block>

        {stop?.note && (
          <Block strong inset className="d-plan">
            <h3>Your plan</h3>
            <p>{stop.note}</p>
          </Block>
        )}

        {place.experience && (
          <Block className="d-do">
            <p className="hook">{place.experience.hook}</p>
            <ol>
              {place.experience.moments.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
            {place.experience.tip && <p className="tip">Tip: {place.experience.tip}</p>}
          </Block>
        )}

        {place.info && place.info.length > 0 && (
          <List inset strong dividers className="d-info">
            {place.info.map((r) => (
              <ListItem key={r.label} header={r.label} title={r.value} />
            ))}
          </List>
        )}

        {!place.experience && <Block className="d-blurb">{place.blurb}</Block>}

        <Block className="d-links">
          <Button tonal round small external target="_blank" href={links.google}>
            Google Maps
          </Button>
          <Button tonal round small external target="_blank" href={links.apple}>
            Apple Maps
          </Button>
          {place.links?.map((l) => (
            <Button key={l.url} tonal round small external target="_blank" href={l.url}>
              {l.label}
            </Button>
          ))}
        </Block>

        {(place.experience || place.anime || (place.tips && place.tips.length > 0)) && (
          <List inset strong accordionList className="side-more">
            <ListItem accordionItem title="More details">
              <div className="accordion-item-content">
                <Block>
                  {place.experience && <p>{place.blurb}</p>}
                  {place.anime && <p>{place.anime}</p>}
                  {place.tips && place.tips.length > 0 && (
                    <ul className="side-notes">
                      {place.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                </Block>
              </div>
            </ListItem>
          </List>
        )}
      </div>
    </article>
  )
}
