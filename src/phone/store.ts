import { useSyncExternalStore } from 'react'

/** What the Map tab shows, and the travel steps sheet. Pages in all tabs read and change it. */
export interface PhoneState {
  /** Day on the map; null = the whole trip */
  mapDay: number | null
  /** Place tapped on the map: its small card shows at the bottom */
  mapPlace: string | null
  /** A travel block to frame on the map (t makes the same one move again) */
  focusLeg: { key: string; t: number } | null
  /** Travel steps open in the sheet ("day-leg" key) */
  leg: string | null
}

let state: PhoneState = { mapDay: null, mapPlace: null, focusLeg: null, leg: null }
const subs = new Set<() => void>()

export function setPhone(patch: Partial<PhoneState>) {
  state = { ...state, ...patch }
  subs.forEach((f) => f())
}

export function usePhone() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f)
      return () => subs.delete(f)
    },
    () => state,
  )
}
