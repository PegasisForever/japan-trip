import { Sheet, PageContent, Block, Button, f7 } from 'framework7-react'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { minutes, fmtLength, stepsOf } from '../data/timeline'
import { legByKey, places } from '../data/trip'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { setPhone, usePhone } from './store'

/**
 * The travel steps from one place to the next, from the bottom. Swipe down to close.
 * It can hold several travel parts in a row ("walk, then train, then walk"): the key is "4-1,4-2".
 */
export default function LegSheet() {
  const { leg: key } = usePhone()
  const found = (key ?? '')
    .split(',')
    .filter(Boolean)
    .map((k) => ({ k, ...legByKey(k)! }))
    .filter((x) => x.leg)
  const first = found[0]
  const last = found[found.length - 1]
  const total = found.reduce((a, x) => a + minutes(x.leg.duration), 0)

  const onMap = () => {
    if (!first || !key) return
    setPhone({ leg: null, mapDay: first.day.n, mapPlace: null, focusLeg: { key, t: Date.now() } })
    // Back to the map (the sheet opens from the map or from the schedule page just above it)
    const router = f7.views.main?.router
    if (router && router.history.length > 1) router.back()
  }

  return (
    <Sheet
      className="leg-sheet"
      opened={found.length > 0}
      onSheetClosed={() => setPhone({ leg: null })}
      swipeToClose
      swipeHandler=".leg-sheet .grabber"
      backdrop
      push={false}
      style={{ height: 'auto' }}
    >
      <div className="grabber" />
      {first && (
        <PageContent>
          <div className="leg-head">
            <h2>
              {places[first.leg.from]?.en} → {places[last.leg.to]?.en}
            </h2>
            <p className="num">{fmtLength(total)} in all</p>
          </div>
          {found.map(({ k, leg }) => (
            <div key={k} className={`leg-part mode-${leg.mode}`} style={{ '--mc': MODE_COLOR[leg.mode] } as React.CSSProperties}>
              <p className="leg-part-head">
                <span className="leg-ico">
                  <Icon name={MODE_ICON[leg.mode]} size={15} />
                </span>
                <b>{MODE_LABEL[leg.mode]}</b>
                {leg.duration && <span className="num">{leg.duration}</span>}
                {leg.who && <em>{leg.who} only</em>}
              </p>
              <ol className="steps">
                {stepsOf(leg.label).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
          <Block className="leg-actions">
            <Button tonal large round onClick={onMap}>
              <i className="f7-icons">map</i> Show on map
            </Button>
          </Block>
        </PageContent>
      )}
    </Sheet>
  )
}
