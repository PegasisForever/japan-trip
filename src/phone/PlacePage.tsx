import { Page, Navbar, Block, BlockTitle, List, ListItem, Button } from 'framework7-react'
import type { Router } from 'framework7/types'
import { KIND_LABEL } from '../data/style'
import { photosFor } from '../data/gallery'
import { mealOf } from '../data/timeline'
import { days, places, placesOf } from '../data/trip'
import { openDirections } from './directions'
import { pickOf } from '../data/picks'
import Gallery from '../shared/Gallery'
import PickTag from '../shared/PickTag'

/**
 * A place: photos, the name to show a taxi driver, what you planned there and what to do.
 * The long background text, tips and links are folded away.
 */
export default function PlacePage({ f7route }: { f7route: Router.Route }) {
  const day = days.find((d) => d.n === Number(f7route.query.day)) ?? null
  // The place as it is on that day: the airport on the way in and on the way home tell different things
  const place = placesOf(day)[f7route.params.id ?? ''] ?? places[f7route.params.id ?? '']
  if (!place) return <Page><Navbar title="Place" backLink /></Page>
  // A place visited twice in a day (an airport) shows the plan of the visit that was tapped
  const stop = day?.stops[Number(f7route.query.stop)]?.place === place.id ? day.stops[Number(f7route.query.stop)] : day?.stops.find((s) => s.place === place.id)
  const meal = stop ? mealOf(stop) : null
  const photos = photosFor(place.galleryKey ?? place.id, place.photo, place.credit)
  const time = stop?.time && /\d/.test(stop.time) ? stop.time : null

  const directions = () => openDirections(place)

  const hasMore = !!(place.experience || place.anime || place.tips?.length || place.links?.length)

  return (
    <Page className="place-page">
      <Navbar title={place.en} backLink transparent />
      {photos.length > 0 ? <Gallery photos={photos} alt={place.en} className="place-hero" credit={false} /> : <div className="place-hero-empty" />}

      <Block className="place-head">
        <p className="place-kind">
          {meal ?? KIND_LABEL[place.kind]}
          {time && <span className="num"> · {time}</span>}
          {day && <span> · Day {day.n}</span>}
        </p>
        <h1>{place.en}</h1>
        <p className="place-ja" lang="ja">{place.ja}</p>
        <div className="place-tags">
          <PickTag pick={pickOf(place.id)} />
          {stop?.who && <span className="solo">{stop.who} only</span>}
        </div>
        <Button fill large round className="dir-btn" onClick={directions}>
          <i className="f7-icons">arrow_up_right_diamond_fill</i>
          Directions
        </Button>
      </Block>

      {stop?.note && (
        <>
          <BlockTitle>Your plan</BlockTitle>
          <Block strong inset className="place-plan">
            {stop.note}
          </Block>
        </>
      )}

      {place.experience ? (
        <>
          <BlockTitle>What to do</BlockTitle>
          <Block strong inset className="place-do">
            <p className="hook">{place.experience.hook}</p>
            <ol>
              {place.experience.moments.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
            {place.experience.tip && <p className="tip">Tip: {place.experience.tip}</p>}
          </Block>
        </>
      ) : (
        <Block strong inset className="place-do">
          <p>{place.blurb}</p>
        </Block>
      )}

      {place.info && place.info.length > 0 && (
        <List inset strong dividers className="info-list">
          {place.info.map((r) => (
            <ListItem key={r.label} header={r.label} title={r.value} />
          ))}
        </List>
      )}

      {hasMore && (
        <List inset strong accordionList dividers className="place-more">
          {(place.experience || place.anime || place.tips?.length) && (
            <ListItem accordionItem title="About this place">
              <div className="accordion-item-content">
                <Block>
                  {place.experience && <p>{place.blurb}</p>}
                  {place.anime && <p>{place.anime}</p>}
                  {place.tips && place.tips.length > 0 && (
                    <ul>
                      {place.tips.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  )}
                </Block>
              </div>
            </ListItem>
          )}
          {place.links?.map((l) => (
            <ListItem key={l.url} link={l.url} external target="_blank" title={l.label} />
          ))}
        </List>
      )}
    </Page>
  )
}
