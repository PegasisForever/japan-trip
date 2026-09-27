import { App, Views, View, Toolbar, ToolbarPane, Link, f7ready, f7 } from 'framework7-react'
import { useEffect } from 'react'
import DaysPage from './DaysPage'
import DayPage from './DayPage'
import PlacePage from './PlacePage'
import MapPage from './MapPage'
import TripPage from './TripPage'
import LegSheet from './LegSheet'
import { today } from '../data/trip'
import './phone.css'

const routes = [
  { path: '/', component: DaysPage },
  { path: '/day/:n/', component: DayPage },
  { path: '/place/:id/', component: PlacePage },
  { path: '/map/', component: MapPage },
  { path: '/trip/', component: TripPage },
]

/** Phone: a tab bar with three stacks. Each stack pushes pages and goes back with a swipe from the left edge. */
export default function PhoneApp() {
  useEffect(() => {
    // During the trip, open on today's day
    f7ready(() => {
      const t = today()
      if (t) f7.views.get('#view-days')?.router.navigate(`/day/${t.n}/`, { animate: false })
    })
  }, [])

  return (
    <App theme="ios" darkMode="auto" routes={routes} colors={{ primary: '#2f7cf6' }} touch={{ tapHold: true }}>
      <Views tabs className="safe-areas">
        <Toolbar tabbar icons bottom>
          <ToolbarPane>
            <Link tabLink="#view-days" tabLinkActive iconF7="calendar" text="Days" />
            <Link tabLink="#view-map" iconF7="map" text="Map" />
            <Link tabLink="#view-trip" iconF7="checkmark_seal" text="Trip" />
          </ToolbarPane>
        </Toolbar>
        <View id="view-days" name="days" main tab tabActive url="/" iosSwipeBack />
        <View id="view-map" name="map" tab url="/map/" iosSwipeBack />
        <View id="view-trip" name="trip" tab url="/trip/" iosSwipeBack />
      </Views>
      <LegSheet />
    </App>
  )
}
