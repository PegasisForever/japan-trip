import { App, View } from 'framework7-react'
import DayPage from './DayPage'
import PlacePage from './PlacePage'
import MapPage from './MapPage'
import LegSheet from './LegSheet'
import DayPicker from './DayPicker'
import { today } from '../data/trip'
import { setPhone } from './store'
import './phone.css'

const routes = [
  // keepAlive: the map page and its map stay alive under the schedule and place pages
  { path: '/', component: MapPage, keepAlive: true },
  { path: '/day/:n/', component: DayPage },
  { path: '/place/:id/', component: PlacePage },
]

// In Safari (not the installed app) the browser's own back gesture must go back a page, not leave the app.
// The installed app has no browser back, so there Framework7's edge swipe does it.
const installed =
  window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone === true

// During the trip, the map opens on today
const t = today()
if (t) setPhone({ mapDay: t.n })

/**
 * Phone: one screen, the map. The day's places are cards at the bottom (swipe for the next one).
 * The schedule and the places are pages pushed on top; swipe from the left edge to go back.
 */
export default function PhoneApp() {
  return (
    <App theme="ios" darkMode="auto" routes={routes} colors={{ primary: '#2f7cf6' }}>
      <View
        main
        url="/"
        className="safe-areas"
        browserHistory={!installed}
        browserHistorySeparator="#!"
        browserHistoryAnimateOnLoad={false}
        iosSwipeBack={installed}
      />
      <LegSheet />
      <DayPicker />
    </App>
  )
}
