import { lazy, Suspense, useEffect } from 'react'

const PhoneApp = lazy(() => import('./phone/PhoneApp'))
const DesktopApp = lazy(() => import('./desktop/DesktopApp'))

/** A phone: narrow, or a phone on its side (short and touch-only) */
const PHONE = '(max-width: 767px), (max-height: 500px) and (pointer: coarse)'
const phone = window.matchMedia(PHONE).matches

/**
 * Two separate apps: the phone app and the desktop app. They share small parts (map, photos, data), not pages.
 * Framework7 starts once per page, so when the window crosses the limit, the page loads again with the other app.
 */
export default function Root() {
  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const onChange = () => mq.matches !== phone && window.location.reload()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return <Suspense fallback={null}>{phone ? <PhoneApp /> : <DesktopApp />}</Suspense>
}
