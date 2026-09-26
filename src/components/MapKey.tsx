import type { Day, Mode } from '../data/types'
import { MODE_COLOR, MODE_LABEL } from '../data/style'

const ORDER: Mode[] = ['drive', 'shinkansen', 'train', 'bus', 'ropeway', 'walk', 'flight']

/** Always-visible legend. It lists only the kinds of travel drawn on the map right now. */
export default function MapKey({ day, days }: { day: Day | null; days: Day[] }) {
  const used = new Set((day ? [day] : days).flatMap((d) => d.legs.map((l) => l.mode)))
  return (
    <div className="mapkey" aria-label="Map key">
      {ORDER.filter((m) => used.has(m)).map((m) => (
        <span key={m}>
          <i style={{ '--mc': MODE_COLOR[m] } as React.CSSProperties} className={m === 'flight' || m === 'walk' ? 'dash' : ''} />
          {MODE_LABEL[m]}
        </span>
      ))}
    </div>
  )
}
