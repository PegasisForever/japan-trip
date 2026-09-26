import raw from './picks.json'

export type Pick = 'aoki' | 'pegasis' | 'both'

const PICKS = raw as Record<string, Record<string, Pick>>

/** Whose "Want" a place was (from the two choice lists), or null if neither picked it */
export function pickOf(planId: string, placeId: string): Pick | null {
  return PICKS[planId]?.[placeId] ?? null
}

export const PICK_LABEL: Record<Pick, string> = {
  aoki: "Aoki's pick",
  pegasis: "Pegasis's pick",
  both: 'Both picked',
}
