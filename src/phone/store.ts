import { useSyncExternalStore } from 'react'

/** What the map shows, and the sheets on top. All pages read and change it. */
export interface PhoneState {
  /** Day on the map; null = the whole trip */
  mapDay: number | null
  /** Place picked on the map (by its card or its pin) */
  mapPlace: string | null
  /** A travel block to frame on the map (t makes the same one move again) */
  focusLeg: { key: string; t: number } | null
  /** Travel steps open in the sheet ("day-leg" key) */
  leg: string | null
  /** The list of days is open */
  picker: boolean
  /** Changed to frame the whole day again */
  refit: number
}

let state: PhoneState = { mapDay: null, mapPlace: null, focusLeg: null, leg: null, picker: false, refit: 0 }
const subs = new Set<() => void>()

export function getPhone() {
  return state
}

export function setPhone(patch: Partial<PhoneState>) {
  state = { ...state, ...patch }
  subs.forEach((f) => f())
}

/** Show a day on the map, from its start */
export function showDay(n: number | null) {
  if (n === state.mapDay) return
  setPhone({ mapDay: n, mapPlace: null, focusLeg: null })
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
