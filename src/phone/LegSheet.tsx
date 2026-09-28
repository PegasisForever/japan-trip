import { Sheet, PageContent, Block, Button } from 'framework7-react'
import { openDirections } from './directions'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { minutes, fmtLength, stepsOf } from '../data/timeline'
import { legByKey, places } from '../data/trip'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { getPhone, setPhone, usePhone } from './store'

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

  // The main way of travel, for the maps app: the first part that is not a walk
  const mainMode = found.find((x) => x.leg.mode !== 'walk')?.leg.mode ?? 'walk'
  const dest = last ? places[last.leg.to] : null

  return (
    <Sheet
      className="leg-sheet"
      opened={found.length > 0}
      // Open: the map shows and highlights the route (above the sheet). Closed: the highlight goes.
      onSheetOpen={() => key && setPhone({ hot: key })}
      // Move the map once the sheet has its full height, so the route lands above it.
      // Keep the picked place on the same day: clearing it moves the cards back to the first one.
      onSheetOpened={() => {
        if (!key || !first) return
        if (first.day.n !== getPhone().mapDay) setPhone({ mapDay: first.day.n, mapPlace: null })
        setPhone({ focusLeg: { key, t: Date.now() } })
      }}
      // Closed: the map goes back to the picked place, or to the whole day
      onSheetClosed={() => {
        const s = getPhone()
        setPhone({ leg: null, hot: null, focusLeg: null, ...(s.mapPlace ? { reselect: s.reselect + 1 } : { refit: s.refit + 1 }) })
      }}
      // Swipe down anywhere on the sheet to close it
      swipeToClose
      // No dark layer: the highlighted route must stay visible. A tap on the map closes the sheet.
      backdrop={false}
      closeByOutsideClick
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
          {dest && (
            <Block className="leg-actions">
              <Button fill large round onClick={() => openDirections(dest, mainMode)}>
                <i className="f7-icons">arrow_up_right_diamond_fill</i> Directions
              </Button>
            </Block>
          )}
        </PageContent>
      )}
    </Sheet>
  )
}
