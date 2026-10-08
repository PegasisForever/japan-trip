import { App, View } from 'framework7-react'
import DayPage from './DayPage'
import PlacePage from './PlacePage'
import MapPage from './MapPage'
import LegSheet from './LegSheet'
import DayPicker from './DayPicker'
import FoundSheet from './FoundSheet'
import { days, today } from '../data/trip'
import { readLink } from '../data/bookings'
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

// A link from Notion: "#day-4" opens the map on day 4, "#day-4/edosan" also opens Edosan's page on top.
// Read it before the router starts, then clear it, so the router (and a reload) starts from the map.
const link = readLink(window.location.hash)
const linked = link && days.some((d) => d.n === link.day) ? link : null
if (linked) {
  setPhone({ mapDay: linked.day, mapPlace: linked.place })
  history.replaceState(null, '', window.location.pathname + window.location.search)
}
// A link from Notion while the app is open (the installed app on Android or a computer gets it in the same window):
// load again, and the lines above open it
window.addEventListener('hashchange', () => readLink(window.location.hash) && window.location.reload())

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
        // The site folder ("/japan-trip/" on GitHub Pages): without it the router reads the folder as a page and shows nothing
        browserHistoryRoot={import.meta.env.BASE_URL}
        browserHistoryAnimateOnLoad={false}
        iosSwipeBack={installed}
        onViewInit={(view) => {
          if (linked?.place) view?.router.navigate(`/place/${linked.place}/?day=${linked.day}`, { animate: false })
        }}
      />
      <LegSheet />
      <DayPicker />
      <FoundSheet />
    </App>
  )
}
