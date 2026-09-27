import { registerSW } from 'virtual:pwa-register'

/**
 * Update rules:
 * - Opening the app with internet always loads the newest page and code: the worker asks the network first
 *   and uses its stored copy only with no internet (or no answer in 4 s).
 * - An app left open (an iPhone keeps it in the background for days) checks for a new version each time
 *   it comes back to the front, and every 30 min.
 * - When a new version is found, the page loads again only at a safe moment: in the background, or just after
 *   the app came back to the front. It never changes under a finger in the middle of use.
 */
let backAt = performance.now()
let pending = false

function reloadIfSafe() {
  // A page that just loaded came from the network: it is already the newest
  if (performance.now() < 20_000) return
  if (document.visibilityState === 'hidden' || performance.now() - backAt < 8_000) window.location.reload()
  else pending = true
}

registerSW({
  immediate: true,
  onNeedReload: reloadIfSafe,
  onRegisteredSW(_url, reg) {
    if (!reg) return
    const check = () => navigator.onLine && reg.update().catch(() => {})
    setInterval(check, 30 * 60 * 1000)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return
      backAt = performance.now()
      if (pending) window.location.reload()
      else check()
    })
  },
})
