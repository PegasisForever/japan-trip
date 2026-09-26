import { PICK_LABEL, type Pick } from '../data/picks'

/**
 * Whose pick a place is. Text label first; the colour only helps.
 * Aoki = blue, Pegasis = orange (a pair that colour-blind people can tell apart), both = neutral with both dots.
 */
export default function PickTag({ pick }: { pick: Pick | null }) {
  if (!pick) return null
  return (
    <span className={`pick pick-${pick}`}>
      <i aria-hidden />
      {PICK_LABEL[pick]}
    </span>
  )
}
