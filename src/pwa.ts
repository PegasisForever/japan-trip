import { registerSW } from 'virtual:pwa-register'

/**
 * Update rules:
 * - With internet, each open loads the newest page and its code from the network, as one set.
 *   With no internet (or no answer in a few seconds), the last page that loaded opens, with its code.
 * - The page never loads itself again when a new worker arrives: the next open shows the new version.
 *   (A reload inside the installed iPhone app is where the white screens came from.)
 * - An app left open checks for a new worker when it comes back to the front.
 */
registerSW({
  immediate: true,
  onNeedReload: () => {},
  onRegisteredSW(_url, reg) {
    if (!reg) return
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.onLine) reg.update().catch(() => {})
    })
  },
})
