import { f7 } from 'framework7-react'
import type { Mode, Place } from '../data/types'

/** How the maps apps should route: public transport, car or on foot */
function travel(mode?: Mode) {
  if (mode === 'drive') return { apple: 'd', google: 'driving' }
  if (mode === 'walk') return { apple: 'w', google: 'walking' }
  return { apple: 'r', google: 'transit' }
}

/** Action sheet: directions to a place in Apple Maps or Google Maps */
export function openDirections(p: Place, mode?: Mode) {
  const t = travel(mode)
  const name = encodeURIComponent(p.en)
  const apple = `https://maps.apple.com/?daddr=${p.lat},${p.lon}&q=${name}${mode ? `&dirflg=${t.apple}` : ''}`
  const google = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}${mode ? `&travelmode=${t.google}` : ''}`
  f7.actions
    .create({
      buttons: [
        [
          { text: `Directions to ${p.en}`, label: true },
          { text: 'Apple Maps', onClick: () => window.open(apple, '_blank') },
          { text: 'Google Maps', onClick: () => window.open(google, '_blank') },
        ],
        [{ text: 'Cancel', strong: true }],
      ],
    })
    .open()
}
