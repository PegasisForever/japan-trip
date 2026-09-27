import { useEffect, useRef, useState } from 'react'
import { f7 } from 'framework7-react'
import type { Photo } from '../data/gallery'

function credit(p: Photo) {
  return p.credit ? `Photo: ${p.credit.author}, ${p.credit.license}` : ''
}

/**
 * Swipeable photo strip. Tap a photo to open it full screen
 * (Framework7 photo browser: pinch to zoom, swipe down to close).
 */
export default function Gallery({ photos, alt, className = '' }: { photos: Photo[]; alt: string; className?: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const pb = useRef<ReturnType<typeof f7.photoBrowser.create> | null>(null)

  useEffect(() => () => pb.current?.destroy(), [])

  const open = (k: number) => {
    pb.current?.destroy()
    pb.current = f7.photoBrowser.create({
      photos: photos.map((p) => ({ url: p.big, caption: credit(p) })),
      type: 'standalone',
      swipeToClose: true,
      exposition: false,
      toolbar: photos.length > 1,
      navbarShowCount: photos.length > 1,
      popupPush: false,
    })
    pb.current.open(k)
  }

  if (photos.length === 0) return null
  const p = photos[i] ?? photos[0]
  return (
    <figure className={`gallery ${className}`}>
      <div
        className="gallery-track"
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget
          setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
        }}
      >
        {photos.map((ph, k) => (
          <button key={ph.mid} className="gallery-slide" onClick={() => open(k)} aria-label={`Open photo ${k + 1} full screen`}>
            <img src={ph.mid} alt={alt} loading={k === 0 ? 'eager' : 'lazy'} draggable={false} />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <div className="gallery-dots" aria-hidden>
          {photos.map((_, k) => (
            <span key={k} className={k === i ? 'is-on' : ''} />
          ))}
        </div>
      )}
      {p.credit && (
        <figcaption>
          <a href={p.credit.url} target="_blank" rel="noreferrer">
            {p.credit.author}
          </a>
          , {p.credit.license}
        </figcaption>
      )}
    </figure>
  )
}
