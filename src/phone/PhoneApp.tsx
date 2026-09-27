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
  { path: '/', component: MapPage },
  { path: '/day/:n/', component: DayPage },
  { path: '/place/:id/', component: PlacePage },
]

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
      <View main url="/" className="safe-areas" iosSwipeBack />
      <LegSheet />
      <DayPicker />
    </App>
  )
}
