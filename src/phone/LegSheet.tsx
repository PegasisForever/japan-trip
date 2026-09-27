import { Sheet, PageContent, BlockTitle, Block, Button, f7 } from 'framework7-react'
import { MODE_COLOR, MODE_LABEL } from '../data/style'
import { stepsOf } from '../data/timeline'
import { legByKey, places } from '../data/trip'
import { MODE_ICON } from '../shared/modeIcon'
import Icon from '../shared/Icon'
import { setPhone, usePhone } from './store'

/** The travel steps of one leg, from the bottom. Swipe down to close. */
export default function LegSheet() {
  const { leg: key } = usePhone()
  const found = key ? legByKey(key) : null

  const onMap = () => {
    if (!found || !key) return
    setPhone({ leg: null, mapDay: found.day.n, mapPlace: null, focusLeg: { key, t: Date.now() } })
    f7.tab.show('#view-map')
  }

  return (
    <Sheet
      className="leg-sheet"
      opened={!!found}
      onSheetClosed={() => setPhone({ leg: null })}
      swipeToClose
      backdrop
      push={false}
      style={{ height: 'auto' }}
    >
      <div className="swipe-handler" />
      {found && (
        <PageContent>
          <BlockTitle large className="leg-title" style={{ '--mc': MODE_COLOR[found.leg.mode] } as React.CSSProperties}>
            <span className="leg-ico big">
              <Icon name={MODE_ICON[found.leg.mode]} size={18} />
            </span>
            {MODE_LABEL[found.leg.mode]}
            {found.leg.duration && <small className="num">{found.leg.duration}</small>}
          </BlockTitle>
          <p className="leg-route">
            {places[found.leg.from]?.en} → {places[found.leg.to]?.en}
            {found.leg.who && <em> · {found.leg.who} only</em>}
          </p>
          <Block>
            <ol className="steps">
              {stepsOf(found.leg.label).map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </Block>
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
