import { useCallback, useState } from 'react'
import type { Choice } from './types'

const KEY = 'yukimichi-choices'
type Choices = Record<string, Choice>

function load(): Choices {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

/** Picks and notes, stored only in this browser (localStorage) */
export function useChoices() {
  const [choices, setChoices] = useState<Choices>(load)
  const [stored, setStored] = useState(true)

  const update = useCallback((id: string, patch: Choice) => {
    setChoices((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...patch } }
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
        setStored(true)
      } catch {
        setStored(false)
      }
      return next
    })
  }, [])

  return { choices, update, stored }
}
