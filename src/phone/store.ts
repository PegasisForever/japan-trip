import { useSyncExternalStore } from 'react'
import type { Found } from '../shared/search'

/** What the map shows, and the sheets on top. All pages read and change it. */
export interface PhoneState {
  /** Day on the map */
  mapDay: number
  /** Place picked on the map (by its card or its pin) */
  mapPlace: string | null
  /** A travel block to frame on the map (t makes the same one move again) */
  focusLeg: { key: string; t: number } | null
  /** Route drawn bright on the map ("4-1,4-2") */
  hot: string | null
  /** Travel steps open in the sheet ("day-leg" key) */
  leg: string | null
  /** The list of days is open */
  picker: boolean
  /** Changed to frame the whole day again */
  refit: number
  /** Changed to fly to the picked place again */
  reselect: number
  /** The search sheet is open */
  search: boolean
  /** A searched place (not in the plan) shown on the map, with its details sheet */
  found: Found | null
}

let state: PhoneState = { mapDay: 1, mapPlace: null, focusLeg: null, hot: null, leg: null, picker: false, refit: 0, reselect: 0, search: false, found: null }
const subs = new Set<() => void>()

export function getPhone() {
  return state
}

export function setPhone(patch: Partial<PhoneState>) {
  state = { ...state, ...patch }
  subs.forEach((f) => f())
}

/** Show a day on the map, from its start */
export function showDay(n: number) {
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
