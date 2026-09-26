import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Photo } from '../data/gallery'
import Icon from './Icon'

function Credit({ p }: { p: Photo }) {
  if (!p.credit) return null
  return (
    <>
      Photo:{' '}
      <a href={p.credit.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
        {p.credit.author}
      </a>
      , {p.credit.license}
    </>
  )
}

/** Full-screen view. Arrow keys or swipe to move, Esc or click outside to close. */
function Lightbox({ photos, start, alt, onClose }: { photos: Photo[]; start: number; alt: string; onClose: () => void }) {
  const [i, setI] = useState(start)
  const touch = useRef<number | null>(null)
  const go = (d: number) => setI((n) => (n + d + photos.length) % photos.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') setI((n) => (n + 1) % photos.length)
      else if (e.key === 'ArrowLeft') setI((n) => (n - 1 + photos.length) % photos.length)
      else return
      // Keep these keys away from the day tabs behind the photo
      e.preventDefault()
      e.stopImmediatePropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [photos.length, onClose])

  const p = photos[i]
  return createPortal(
    <div
      className="lightbox"
      role="dialog"
      aria-label={`${alt}, photo ${i + 1} of ${photos.length}`}
      onClick={onClose}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <img src={p.big} alt={alt} onClick={(e) => e.stopPropagation()} />
      <button className="lb-close" onClick={onClose} aria-label="Close photo">
        <Icon name="close" size={20} />
      </button>
      {photos.length > 1 && (
        <>
          <button className="lb-nav lb-prev" onClick={(e) => (e.stopPropagation(), go(-1))} aria-label="Previous photo">
            <Icon name="left" size={24} />
          </button>
          <button className="lb-nav lb-next" onClick={(e) => (e.stopPropagation(), go(1))} aria-label="Next photo">
            <Icon name="right" size={24} />
          </button>
        </>
      )}
      <p className="lb-caption" onClick={(e) => e.stopPropagation()}>
        <span>
          {i + 1} / {photos.length}
        </span>
        <span>
          <Credit p={p} />
        </span>
      </p>
    </div>,
    document.body,
  )
}

/** Swipeable photo strip for a panel. Click a photo to open it large. */
export default function Gallery({ photos, alt }: { photos: Photo[]; alt: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  const scrollTo = (n: number) => {
    const el = track.current
    if (!el) return
    el.scrollTo({ left: n * el.clientWidth, behavior: 'smooth' })
  }

  if (photos.length === 0) return null
  const p = photos[i] ?? photos[0]
  return (
    <figure className="gallery">
      <div
        className="gallery-track"
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget
          setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
        }}
      >
        {photos.map((ph, k) => (
          <button key={ph.mid} className="gallery-slide" onClick={() => setOpen(k)} aria-label={`Open photo ${k + 1} large`}>
            <img src={ph.mid} alt={alt} loading={k === 0 ? 'eager' : 'lazy'} draggable={false} />
          </button>
        ))}
      </div>
      {photos.length > 1 && (
        <>
          <button className="gallery-nav gallery-prev" onClick={() => scrollTo(Math.max(0, i - 1))} disabled={i === 0} aria-label="Previous photo">
            <Icon name="left" size={18} />
          </button>
          <button
            className="gallery-nav gallery-next"
            onClick={() => scrollTo(Math.min(photos.length - 1, i + 1))}
            disabled={i === photos.length - 1}
            aria-label="Next photo"
          >
            <Icon name="right" size={18} />
          </button>
          <div className="gallery-dots" aria-hidden>
            {photos.map((_, k) => (
              <span key={k} className={k === i ? 'is-on' : ''} />
            ))}
          </div>
        </>
      )}
      <figcaption>
        <Credit p={p} />
      </figcaption>
      {open !== null && <Lightbox photos={photos} start={open} alt={alt} onClose={() => setOpen(null)} />}
    </figure>
  )
}
