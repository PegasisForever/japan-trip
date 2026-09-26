import { PICK_LABEL, type Pick } from '../data/picks'

/** The PickTag as an HTML string, for the map pins that MapLibre builds outside React */
export function pickHtml(pick: Pick | null) {
  return pick ? `<span class="pick pick-${pick}"><i aria-hidden="true"></i>${PICK_LABEL[pick]}</span>` : ''
}
