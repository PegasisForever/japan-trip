import { useState } from 'react'
import type { Choice, Idea, Verdict } from '../data/types'
import { photoUrl } from '../data/photos'
import VerdictButtons from './VerdictButtons'
import { daysText, shortCost, shortDuration } from '../data/ideaText'
import Icon from './Icon'

/** "anitabi.cn" from a full link, so each source says where it goes */
function host(u: string) {
  try {
    return new URL(u).hostname.replace(/^www\./, '')
  } catch {
    return 'Source'
  }
}

interface Props {
  idea: Idea
  choice?: Choice
  onVerdict: (v: Verdict | undefined) => void
  onNote: (note: string) => void
  onClose?: () => void
  /** Review mode shows keyboard hints and a bigger layout */
  review?: boolean
}

export function IdeaBody({ idea, choice, onVerdict, onNote, review }: Props) {
  const [noteOpen, setNoteOpen] = useState(Boolean(choice?.note))
  const isOutline = /D\d/.test(idea.summary) && idea.summary.includes(' · ')
  const exp = idea.experience
  return (
    <>
      {idea.photo && (
        <figure className="detail-photo">
          <img src={photoUrl(idea.photo, 1280)} alt={idea.title} />
          {idea.credit && (
            <figcaption>
              Photo: <a href={idea.credit.url} target="_blank" rel="noreferrer">{idea.credit.author}</a>, {idea.credit.license}
            </figcaption>
          )}
        </figure>
      )}
      <div className="detail-body">
        <header className="idea-head">
          <h2 className="detail-ja" lang="ja">{idea.titleJa}</h2>
          <p className="detail-en">{idea.title}</p>
        </header>

        {/* The four facts needed to decide, on one line */}
        <ul className="idea-facts-row">
          <li>
            <Icon name="clock" size={15} />
            {shortDuration(idea.duration)}
          </li>
          {/\d|free/i.test(idea.cost) && <li>¥ {shortCost(idea.cost).replace(/^¥\s?/, '').replace(' +more', '+')}</li>}
          <li>{daysText(idea)}</li>
          {idea.winter !== 'ok' && (
            <li className={`warn w-${idea.winter}`}>
              <Icon name="alert" size={15} />
              {idea.winter === 'no' ? 'Closed in winter' : 'Check dates'}
            </li>
          )}
        </ul>

        {exp ? (
          <section className="todo-there">
            <p className="hook">{exp.hook}</p>
            <ol>
              {exp.moments.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
            {exp.tip && <p className="insider">Tip: {exp.tip}</p>}
          </section>
        ) : (
          <p className="detail-blurb">{idea.summary}</p>
        )}

        {isOutline && (
          <details className="fold">
            <summary>
              Day by day <Icon name="down" />
            </summary>
            <ol className="outline">
              {idea.summary.split(' · ').map((part, i) => {
                const m = /^(D\d+(?:\s*[–-]\s*D?\d+)?)\s*[:.]?\s*(.*)$/.exec(part.trim())
                return (
                  <li key={i}>
                    {m ? <b>{m[1].replace('D', 'Day ')}</b> : null}
                    <span>{m ? m[2] : part}</span>
                  </li>
                )
              })}
            </ol>
          </details>
        )}

        <details className="fold">
          <summary>
            More details <Icon name="down" />
          </summary>
          <div className="more-details">
            {exp && !isOutline && <p>{idea.summary}</p>}
            {idea.why && <p>{idea.why}</p>}
            {idea.tips && idea.tips.length > 0 && (
              <ul className="notes">
                {idea.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
            {idea.winterNote && (
              <p>
                <b>Winter:</b> {idea.winterNote}
              </p>
            )}
            <p>
              <b>Cost:</b> {idea.cost || 'Not listed'}
              {idea.duration !== shortDuration(idea.duration) && (
                <>
                  {' '}
                  <b>Time:</b> {idea.duration}
                </>
              )}
            </p>
            {idea.places && idea.places.length > 0 && (
              <p>
                <b>Places:</b>{' '}
                {idea.places.map((p, i) => (
                  <span key={p.en}>
                    {i > 0 && ', '}
                    <span lang="ja">{p.ja}</span> ({p.en})
                  </span>
                ))}
              </p>
            )}
            <div className="detail-links">
              <a className="btn btn-ghost" href={`https://www.google.com/maps/search/?api=1&query=${idea.lat},${idea.lon}`} target="_blank" rel="noreferrer">
                <Icon name="pin" />
                Google Maps
              </a>
              {idea.sources.slice(0, 3).map((u) => (
                <a key={u} className="btn btn-ghost" href={u} target="_blank" rel="noreferrer" title={u}>
                  {host(u)}
                  <Icon name="external" size={14} />
                </a>
              ))}
            </div>
          </div>
        </details>
      </div>

      {/* Decision bar stays at the bottom of the panel */}
      <footer className="decide">
        <VerdictButtons value={choice?.verdict} onChange={onVerdict} big={review} planned={idea.kind === 'planned'} />
        {noteOpen ? (
          <textarea
            id={`note-${idea.id}`}
            className="note-box"
            rows={2}
            autoFocus={!choice?.note}
            aria-label="Your note"
            placeholder="Your note"
            value={choice?.note ?? ''}
            onChange={(e) => onNote(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        ) : (
          <button className="add-note" onClick={() => setNoteOpen(true)}>
            + Add a note
          </button>
        )}
      </footer>
    </>
  )
}

export default function IdeaDetail(props: Props) {
  return (
    <article className="detail" aria-label={props.idea.title}>
      <button className="detail-close" onClick={props.onClose} aria-label="Close details">
        <Icon name="close" size={18} />
      </button>
      <IdeaBody {...props} />
    </article>
  )
}
