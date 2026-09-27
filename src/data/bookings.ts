import md from '../../BOOKINGS.md?raw'

export interface Booking {
  what: string
  why: string
  done: boolean
}

/** The checklist lives in BOOKINGS.md: "- [x] **what**" then the reason on the next line */
export const bookings: Booking[] = md
  .split(/\n(?=- \[)/)
  .map((block) => /^- \[([ xX])\] \*\*(.+?)\*\*\s*\n?([\s\S]*)$/.exec(block.trim()))
  .filter((m): m is RegExpExecArray => !!m)
  .map((m) => ({ done: m[1] !== ' ', what: m[2], why: m[3].replace(/\s+/g, ' ').trim() }))
