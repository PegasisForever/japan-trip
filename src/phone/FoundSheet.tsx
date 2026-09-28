import { Sheet, PageContent } from 'framework7-react'
import FoundView from '../shared/FoundView'
import { getPhone, setPhone, usePhone } from './store'

/** A searched place: its details from the bottom, its pin on the map above. Swipe down or tap the map to close. */
export default function FoundSheet() {
  const { found } = usePhone()
  return (
    <Sheet
      className="found-sheet leg-sheet"
      opened={!!found}
      // Closed: the pin goes, and the map shows the day again
      onSheetClosed={() => setPhone({ found: null, refit: getPhone().refit + 1 })}
      swipeToClose
      backdrop={false}
      closeByOutsideClick
      push={false}
      style={{ height: 'auto' }}
    >
      <div className="grabber" />
      {found && (
        <PageContent>
          <FoundView key={found.key} found={found} />
        </PageContent>
      )}
    </Sheet>
  )
}
