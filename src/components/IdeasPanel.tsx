import type { Choice, Idea, Verdict } from '../data/types'
import { CATEGORY, KIND_TEXT, VERDICT } from '../data/style'
import VerdictButtons from './VerdictButtons'
import CopyChoices from './CopyChoices'
import { daysText, shortCost, shortDuration } from '../data/ideaText'
import { photoUrl } from '../data/photos'
import Icon from './Icon'

export interface IdeaFilter {
  status: 'todo' | 'yes' | 'maybe' | 'no' | 'all'
  category: string | null
  kind: string | null
  day: number | null
}

interface Props {
  ideas: Idea[]
  shown: Idea[]
  choices: Record<string, Choice>
  filter: IdeaFilter
  setFilter: (f: IdeaFilter) => void
  hovered: string | null
  selected: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
  onVerdict: (id: string, v: Verdict | undefined) => void
  onReview: () => void
  stored: boolean
  allIdeas: Idea[]
}

export default function IdeasPanel(props: Props) {
  const { ideas, shown, choices, filter, setFilter, hovered, selected, onHover, onSelect, onVerdict, onReview, stored, allIdeas } = props
  const count = (v: Verdict) => ideas.filter((i) => choices[i.id]?.verdict === v).length
  const decided = ideas.filter((i) => choices[i.id]?.verdict).length
  const cats = Object.keys(CATEGORY).filter((c) => ideas.some((i) => i.category === c))

  const statusChips: { key: IdeaFilter['status']; label: string; n: number }[] = [
    { key: 'todo', label: 'To decide', n: ideas.length - decided },
    { key: 'yes', label: 'Want', n: count('yes') },
    { key: 'maybe', label: 'Maybe', n: count('maybe') },
    { key: 'no', label: 'Not interested', n: count('no') },
    { key: 'all', label: 'All', n: ideas.length },
  ]

  return (
    <aside className="ideas">
      <header className="ideas-head">
        <div className="ideas-progress">
          <p>
            <b>{decided}</b> of {ideas.length} ideas decided
          </p>
          <div className="bar" aria-hidden>
            <span style={{ width: `${(count('yes') / ideas.length) * 100}%`, background: VERDICT.yes.color }} />
            <span style={{ width: `${(count('maybe') / ideas.length) * 100}%`, background: VERDICT.maybe.color }} />
            <span style={{ width: `${(count('no') / ideas.length) * 100}%`, background: VERDICT.no.color }} />
          </div>
          <p className={`save${stored ? '' : ' save-offline'}`}>
            {stored ? 'Choices save in this browser.' : 'This browser blocks saving. Copy your choices before you close the page.'}
          </p>
        </div>
        <div className="head-btns">
          <button className="btn review-btn" onClick={onReview} disabled={decided === ideas.length}>
            Review one at a time
          </button>
          <CopyChoices ideas={allIdeas} choices={choices} />
        </div>
      </header>

      <div className="filters">
        <div className="seg" role="group" aria-label="Show">
          {statusChips.map((c) => (
            <button
              key={c.key}
              className="seg-btn"
              aria-pressed={filter.status === c.key}
              onClick={() => setFilter({ ...filter, status: c.key })}
            >
              {c.label} <small>{c.n}</small>
            </button>
          ))}
        </div>
        <div className="chip-row" role="group" aria-label="Type">
          <span className="chip-label">Type</span>
          <div className="chips">
            <button className="chip" aria-pressed={!filter.category} onClick={() => setFilter({ ...filter, category: null })}>
              Any
            </button>
            {cats.map((c) => (
              <button
                key={c}
                className="chip"
                aria-pressed={filter.category === c}
                style={{ '--cc': CATEGORY[c].color } as React.CSSProperties}
                onClick={() => setFilter({ ...filter, category: filter.category === c ? null : c })}
              >
                <i />
                {CATEGORY[c].label}
              </button>
            ))}
          </div>
        </div>
        <div className="chip-row" role="group" aria-label="Size">
          <span className="chip-label">Size</span>
          <div className="chips">
            <button className="chip" aria-pressed={!filter.kind} onClick={() => setFilter({ ...filter, kind: null })}>
              Any
            </button>
            {(Object.keys(KIND_TEXT) as (keyof typeof KIND_TEXT)[]).map((k) => (
              <button
                key={k}
                className="chip"
                aria-pressed={filter.kind === k}
                onClick={() => setFilter({ ...filter, kind: filter.kind === k ? null : k })}
              >
                {KIND_TEXT[k]}
              </button>
            ))}
          </div>
        </div>
        {filter.day && (
          <div className="chip-row">
            <span className="chip-label">Day</span>
            <div className="chips">
              <button
                className="chip chip-remove"
                aria-pressed
                aria-label={`Remove the day ${filter.day} filter`}
                onClick={() => setFilter({ ...filter, day: null })}
              >
                Day {filter.day}
                <Icon name="close" size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <ul className="idea-list">
        {shown.length === 0 && (
          <li className="empty">
            <p>No ideas match these filters.</p>
            <button
              className="btn btn-ghost"
              onClick={() => setFilter({ status: 'all', category: null, kind: null, day: null })}
            >
              Show all ideas
            </button>
          </li>
        )}
        {shown.map((idea) => {
          const c = choices[idea.id]
          return (
            <li
              key={idea.id}
              data-id={idea.id}
              className={`idea-card${hovered === idea.id ? ' is-hot' : ''}${selected === idea.id ? ' is-selected' : ''}${c?.verdict ? ' v-' + c.verdict : ''}`}
              onMouseEnter={() => onHover(idea.id)}
              onMouseLeave={() => onHover(null)}
            >
              <button className="idea-open" onClick={() => onSelect(idea.id)} aria-label={`Open ${idea.title}`}>
                <span className="idea-thumb">
                  {idea.photo ? <img src={photoUrl(idea.photo, 200)} alt="" loading="lazy" /> : <span className="noimg" />}
                </span>
                <span className="idea-text">
                  <span className="idea-title">{idea.title}</span>
                  <span className="idea-ja" lang="ja">{idea.titleJa}</span>
                  <span className="idea-meta">
                    <span>
                      <i style={{ background: CATEGORY[idea.category]?.color }} />
                      {CATEGORY[idea.category]?.label}
                    </span>
                    <span>{daysText(idea)}</span>
                  </span>
                  <span className="idea-meta idea-facts">
                    <span>{shortDuration(idea.duration)}</span>
                    {/\d|free/i.test(idea.cost) && <span>{shortCost(idea.cost)}</span>}
                  </span>
                  {idea.winter !== 'ok' && (
                    <span className={`winter w-${idea.winter}`}>
                      <Icon name="alert" size={14} />
                      {idea.winter === 'no' ? 'Closed in winter' : 'Check winter dates'}
                    </span>
                  )}
                  <span className="idea-sum">{idea.experience?.hook ?? idea.why ?? idea.summary}</span>
                  {c?.note && (
                    <span className="idea-note">
                      <b>Note:</b> {c.note}
                    </span>
                  )}
                </span>
              </button>
              <VerdictButtons value={c?.verdict} onChange={(v) => onVerdict(idea.id, v)} planned={idea.kind === 'planned'} />
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
