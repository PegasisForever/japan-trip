import type { Day, Place } from '../data/types'
import { KIND_LABEL } from '../data/style'
import { photoUrl } from '../data/photos'

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
      <button className="detail-close" onClick={onClose} aria-label="Close">
        ×
      </button>
      {place.photo && (
        <figure className="detail-photo">
          <img src={photoUrl(place.photo, 1280)} alt={place.en} />
          {place.credit && (
            <figcaption>
              Photo: <a href={place.credit.url} target="_blank" rel="noreferrer">{place.credit.author}</a>, {place.credit.license}
            </figcaption>
          )}
        </figure>
      )}
      <div className="detail-body">
        <p className="detail-kind">
          {KIND_LABEL[place.kind]}
          {stop?.time && <span> · {stop.time}</span>}
          {stop?.who && <span> · {stop.who} only</span>}
        </p>
        <h2 className="detail-ja" lang="ja">{place.ja}</h2>
        {place.romaji && <p className="detail-romaji">{place.romaji}</p>}
        <p className="detail-en">{place.en}</p>
        {place.anime && <p className="detail-anime">{place.anime}</p>}
        {stop?.note && <p className="detail-plan"><b>Your plan:</b> {stop.note}</p>}

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

        <p className="detail-blurb">{place.blurb}</p>

        {place.tips && place.tips.length > 0 && (
          <section className="detail-tips">
            <h3>Tips</h3>
            <ul>
              {place.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="detail-links">
          <a href={gmaps} target="_blank" rel="noreferrer" className="btn">
            Open in Google Maps
          </a>
          {place.links?.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="btn btn-ghost">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  )
}
