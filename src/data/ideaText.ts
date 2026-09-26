import type { Choice, Idea, Verdict } from './types'

/** "Day 4", "Days 6–8" or "Changes the route" */
export function daysText(idea: Idea) {
  if (idea.days.length === 0) return 'Changes the route'
  const d = [...idea.days].sort((a, b) => a - b)
  const range = d.length > 2 && d[d.length - 1] - d[0] === d.length - 1 ? `${d[0]}–${d[d.length - 1]}` : d.join(', ')
  return `${idea.kind === 'addon' ? 'Day' : 'Days'} ${range}`
}


/** First yen amount or range in a free-text cost, e.g. "¥35,000–55,000" */
export function shortCost(cost: string) {
  const m =
    /¥\s?[\d,.]+(?:\s?[kK万])?(?:\s?[–~-]\s?¥?\s?[\d,.]+(?:\s?[kK万])?)?/.exec(cost) ??
    /[\d,.]+(?:\s?[–~-]\s?[\d,.]+)?\s?(?:JPY|yen|円)/i.exec(cost)
  if (!m) return cost.length > 24 ? 'See details' : cost
  const t = m[0].replace(/\s?(JPY|yen|円)/i, '').trim()
  // Several amounts in the text: show the first one and mark that there is more
  const more = (cost.match(/\d[\d,]{2,}/g) ?? []).length > (t.match(/\d[\d,]{2,}/g) ?? []).length ? ' +more' : ''
  return (t.startsWith('¥') ? t : `¥${t}`) + more
}

/** Duration text without the explanation in brackets */
export function shortDuration(d: string) {
  return d.split(/[(,;]/)[0].trim()
}

/** Plain text of every choice and note, for pasting into a chat */
export function choicesText(ideas: Idea[], choices: Record<string, Choice>) {
  const line = (i: Idea) => {
    const note = choices[i.id]?.note?.trim()
    return `- ${i.title} (${i.titleJa}) [${i.id}] · ${daysText(i)}${note ? `\n  Note: ${note.replace(/\n/g, ' ')}` : ''}`
  }
  const group = (v: Verdict, head: string) => {
    const list = ideas.filter((i) => choices[i.id]?.verdict === v)
    return list.length ? `${head} (${list.length})\n${list.map(line).join('\n')}` : ''
  }
  const noteOnly = ideas.filter((i) => !choices[i.id]?.verdict && choices[i.id]?.note?.trim())
  const open = ideas.filter((i) => !choices[i.id]?.verdict).length
  return [
    'My Yukimichi trip choices',
    group('yes', 'WANT'),
    group('maybe', 'MAYBE'),
    group('no', 'NOT INTERESTED'),
    noteOnly.length ? `NOTES ON UNDECIDED IDEAS (${noteOnly.length})\n${noteOnly.map(line).join('\n')}` : '',
    `Not decided yet: ${open} of ${ideas.length} ideas`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

