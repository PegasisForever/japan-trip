import type { Day, Place } from '../data/types'
import { KIND_LABEL } from '../data/style'
import Icon from './Icon'
import Gallery from './Gallery'
import { photosFor } from '../data/gallery'

interface Props {
  place: Place
  day: Day | null
  onClose: () => void
}

export default function PlaceDetail({ place, day, onClose }: Props) {
  const stop = day?.stops.find((s) => s.place === place.id)
  const gmaps = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lon}`

  return (
    <article className="detail" aria-label={place.en}>
      <button className="detail-close" onClick={onClose} aria-label="Close details">
        <Icon name="close" size={18} />
      </button>
      <Gallery photos={photosFor(place.galleryKey ?? place.id, place.photo, place.credit)} alt={place.en} />
      <div className="detail-body">
        <p className="detail-kind">
          {KIND_LABEL[place.kind]}
          {stop?.time && <span> · {stop.time}</span>}
          {stop?.who && <span> · {stop.who} only</span>}
        </p>
        <h2 className="detail-ja" lang="ja">{place.ja}</h2>
        {place.romaji && <p className="detail-romaji">{place.romaji}</p>}
        <p className="detail-en">{place.en}</p>
        {stop?.note && (
          <div className="detail-plan">
            <h3>Your plan</h3>
            <p>{stop.note}</p>
          </div>
        )}

        {place.experience && (
          <section className="todo-there">
            <p className="hook">{place.experience.hook}</p>
            <ol>
              {place.experience.moments.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
            {place.experience.tip && <p className="insider">Tip: {place.experience.tip}</p>}
          </section>
        )}

        {place.info && place.info.length > 0 && (
          <dl className="detail-info">
            {place.info.map((r) => (
              <div key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {!place.experience && <p className="detail-blurb">{place.blurb}</p>}

        <details className="fold">
          <summary>
            More details <Icon name="down" />
          </summary>
          <div className="more-details">
            {place.experience && <p>{place.blurb}</p>}
            {place.anime && <p>{place.anime}</p>}
            {place.tips && place.tips.length > 0 && (
              <ul className="notes">
                {place.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
            <div className="detail-links">
              <a href={gmaps} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <Icon name="pin" />
                Google Maps
              </a>
              {place.links?.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn btn-ghost">
                  {l.label}
                  <Icon name="external" size={14} />
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>
    </article>
  )
}
