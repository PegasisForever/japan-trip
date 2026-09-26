import type { Verdict } from '../data/types'
import { VERDICT } from '../data/style'
import Icon from './Icon'

export default function VerdictButtons({
  value,
  onChange,
  big,
}: {
  value?: Verdict
  onChange: (v: Verdict | undefined) => void
  big?: boolean
}) {
  return (
    <div className={`verdicts${big ? ' verdicts-big' : ''}`} role="group" aria-label="Your choice">
      {(Object.keys(VERDICT) as Verdict[]).map((v) => (
        <button
          key={v}
          className={`verdict v-${v}${value === v ? ' is-on' : ''}`}
          aria-pressed={value === v}
          onClick={(e) => {
            e.stopPropagation()
            onChange(value === v ? undefined : v)
          }}
        >
          <Icon name={v === 'yes' ? 'check' : v === 'no' ? 'cross' : 'maybe'} />
          {VERDICT[v].label}
          {big && <kbd>{v === 'yes' ? '1' : v === 'maybe' ? '2' : '3'}</kbd>}
        </button>
      ))}
    </div>
  )
}

