import type { Choice, Idea, Verdict } from '../data/types'
import { CATEGORY, KIND_TEXT } from '../data/style'
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
  const winterText = idea.winter === 'ok' ? 'Open in late January' : idea.winter === 'no' ? 'Not possible in winter' : 'Depends on dates'
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
        <p className="detail-kind">
          <i className="dot" style={{ background: CATEGORY[idea.category]?.color }} />
          {CATEGORY[idea.category]?.label}
          <span className="sep">·</span>
          {KIND_TEXT[idea.kind]}
          <span className="sep">·</span>
          {daysText(idea)}
        </p>
        <h2 className="detail-ja" lang="ja">{idea.titleJa}</h2>
        <p className="detail-en">{idea.title}</p>
        {idea.anime && <p className="detail-anime">{idea.anime}</p>}

        {idea.experience && (
          <section className="todo-there">
            <p className="hook">{idea.experience.hook}</p>
            <h3>What to do</h3>
            <ol>
              {idea.experience.moments.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ol>
            {idea.experience.tip && (
              <p className="insider">
                <b>Tip:</b> {idea.experience.tip}
              </p>
            )}
          </section>
        )}

        <VerdictButtons value={choice?.verdict} onChange={onVerdict} big={review} />
        <label className="note">
          <span>Note to self</span>
          <textarea
            id={`note-${idea.id}`}
            rows={2}
            placeholder="Anything you want to remember, e.g. “only if we skip Zao”"
            value={choice?.note ?? ''}
            onChange={(e) => onNote(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </label>

        {idea.why && (
          <div className="detail-plan">
            <h3>Why it fits you</h3>
            <p>{idea.why}</p>
          </div>
        )}

        <dl className="detail-info">
          <div>
            <dt>Time needed</dt>
            <dd>{shortDuration(idea.duration)}</dd>
          </div>
          <div>
            <dt>Cost per person</dt>
            <dd>{shortCost(idea.cost)}</dd>
          </div>
          <div className={`w-${idea.winter}`}>
            <dt>Winter</dt>
            <dd>{winterText}</dd>
          </div>
          <div>
            <dt>Fits</dt>
            <dd>{daysText(idea)}</dd>
          </div>
        </dl>

        {/D\d/.test(idea.summary) && idea.summary.includes(' · ') ? (
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
        ) : (
          <p className="detail-blurb">{idea.summary}</p>
        )}
        {idea.winterNote && (
          <p className="fine">
            <b>Winter:</b> {idea.winterNote}
          </p>
        )}
        {(idea.cost.length > 24 || idea.duration !== shortDuration(idea.duration)) && (
          <p className="fine">
            <b>Cost details:</b> {idea.cost}
            {idea.duration !== shortDuration(idea.duration) && (
              <>
                {' '}
                <b>Time:</b> {idea.duration}
              </>
            )}
          </p>
        )}

        {idea.places && idea.places.length > 0 && (
          <section className="detail-tips">
            <h3>Places</h3>
            <ul>
              {idea.places.map((p) => (
                <li key={p.en}>
                  <span lang="ja">{p.ja}</span> · {p.en}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="detail-links">
          <a className="btn" href={`https://www.google.com/maps/search/?api=1&query=${idea.lat},${idea.lon}`} target="_blank" rel="noreferrer">
            <Icon name="pin" />
            Open in Google Maps
          </a>
          {idea.sources.slice(0, 3).map((u) => (
            <a key={u} className="btn btn-ghost" href={u} target="_blank" rel="noreferrer" title={u}>
              {host(u)}
              <Icon name="external" size={14} />
            </a>
          ))}
        </div>
      </div>
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
