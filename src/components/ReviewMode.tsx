import { useEffect, useState } from 'react'
import type { Choice, Idea, Verdict } from '../data/types'
import { IdeaBody } from './IdeaDetail'
import Icon from './Icon'

interface Props {
  queue: Idea[]
  choices: Record<string, Choice>
  onVerdict: (id: string, v: Verdict | undefined) => void
  onNote: (id: string, note: string) => void
  onFocus: (id: string) => void
  onClose: () => void
}

/** One idea at a time, big buttons, keys 1/2/3. Moves on by itself after each choice. */
export default function ReviewMode({ queue, choices, onVerdict, onNote, onFocus, onClose }: Props) {
  // The queue is fixed when review starts, so choices do not reshuffle it
  const [list] = useState(queue)
  const [i, setI] = useState(0)
  const idea = list[i]

  useEffect(() => {
    if (idea) onFocus(idea.id)
  }, [idea, onFocus])

  useEffect(() => {
    const pick = (v: Verdict) => {
      if (!idea) return
      onVerdict(idea.id, v)
      window.setTimeout(() => setI((n) => n + 1), 220)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '1') pick('yes')
      else if (e.key === '2') pick('maybe')
      else if (e.key === '3') pick('no')
      else if (e.key === 'ArrowRight') setI((n) => Math.min(list.length, n + 1))
      else if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1))
      else if (e.key === 'Escape') onClose()
      else return
      e.preventDefault()
      e.stopPropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [idea, list.length, onVerdict, onClose])

  return (
    <div className="review" role="dialog" aria-label="Review ideas">
      <div className="review-top">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          aria-label="Previous idea"
          title="Previous (←)"
        >
          <Icon name="left" />
        </button>
        <div className="review-count">
          <span>
            <b>{Math.min(i + 1, list.length)}</b> of {list.length}
          </span>
          <div className="bar" aria-hidden>
            <span className="bar-done" style={{ width: `${(i / Math.max(1, list.length)) * 100}%` }} />
          </div>
        </div>
        <button className="btn btn-ghost" onClick={() => setI((n) => n + 1)} disabled={i >= list.length} title="Skip (→)">
          Skip
          <Icon name="right" />
        </button>
        <button className="btn" onClick={onClose} title="Close (Esc)">
          Close
        </button>
      </div>
      {idea ? (
        <article className="review-card">
          <IdeaBody
            idea={idea}
            choice={choices[idea.id]}
            review
            onVerdict={(v) => {
              onVerdict(idea.id, v)
              if (v) window.setTimeout(() => setI((n) => n + 1), 220)
            }}
            onNote={(n) => onNote(idea.id, n)}
          />
        </article>
      ) : (
        <article className="review-card review-end">
          <h2>End of the list</h2>
          <p>You saw every idea in this list. Your picks are under the Want filter.</p>
          <button className="btn" onClick={onClose}>
            Back to the list
          </button>
        </article>
      )}
    </div>
  )
}
