import { useRef, useState } from 'react'
import type { Choice, Idea } from '../data/types'
import { choicesText } from '../data/ideaText'
import Icon from './Icon'

export default function CopyChoices({ ideas, choices }: { ideas: Idea[]; choices: Record<string, Choice> }) {
  const [state, setState] = useState<'idle' | 'copied' | 'manual'>('idle')
  const box = useRef<HTMLTextAreaElement>(null)
  const text = choicesText(ideas, choices)

  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setState('copied')
        window.setTimeout(() => setState('idle'), 2500)
      })
      .catch(() => {
        // Clipboard blocked: show the text so it can be copied by hand
        setState('manual')
        window.setTimeout(() => box.current?.select(), 50)
      })
  }

  return (
    <>
      <button className="btn btn-ghost copy-btn" onClick={copy} aria-live="polite">
        <Icon name={state === 'copied' ? 'check' : 'copy'} />
        {state === 'copied' ? 'Copied' : 'Copy my choices'}
      </button>
      {state === 'manual' && (
        <div className="copy-manual">
          <p>This browser blocked copying. The text is selected: press Ctrl+C (Cmd+C on a Mac).</p>
          <textarea id="copy-text" ref={box} readOnly value={text} rows={8} />
          <button className="btn btn-ghost" onClick={() => setState('idle')}>
            Close
          </button>
        </div>
      )}
    </>
  )
}
