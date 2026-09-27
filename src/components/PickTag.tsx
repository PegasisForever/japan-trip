import { PICK_LABEL, type Pick } from '../data/picks'

const PICK_SHORT: Record<Pick, string> = { aoki: 'Aoki', pegasis: 'Pegasis', both: 'Both' }

/**
 * Whose pick a place is. Text label first; the colour only helps.
 * Aoki = blue, Pegasis = orange (a pair that colour-blind people can tell apart), both = neutral with both dots.
 * The short word shows on narrow timeline cards; `dot` is for the narrowest ones (the full label is in the tooltip).
 */
export default function PickTag({ pick, dot = false }: { pick: Pick | null; dot?: boolean }) {
  if (!pick) return null
  return (
    <span className={`pick pick-${pick}${dot ? ' pick-dot' : ''}`} title={dot ? PICK_LABEL[pick] : undefined}>
      <i aria-hidden />
      {!dot && <span className="pick-long">{PICK_LABEL[pick]}</span>}
      {!dot && <span className="pick-short">{PICK_SHORT[pick]}</span>}
      {dot && <span className="sr-only">{PICK_LABEL[pick]}</span>}
    </span>
  )
}
