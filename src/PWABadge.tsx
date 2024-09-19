import { useRegisterSW } from 'virtual:pwa-register/react'

export function PWABadge() {
  // check for updates every hour
  const period = 10000

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === 'activated') registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  function close() {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  if (offlineReady || needRefresh) {
    return (
      <div
        className="fixed bottom-4 right-4 rounded-md border-2 border-sky-600 bg-sky-900 p-4 shadow-lg"
        role="alert"
        aria-labelledby="toast-message"
      >
        {(offlineReady || needRefresh) && (
          <div className="flex flex-col gap-4">
            <div className="text-white">
              {offlineReady ? (
                <span id="toast-message">App ready to work offline</span>
              ) : (
                <span id="toast-message">
                  New content available, click on reload button to update.
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {needRefresh && (
                <button
                  className="h-10 rounded-md bg-sky-600 px-4 py-1 text-white transition-colors hover:bg-sky-500"
                  onClick={() => updateServiceWorker(true)}
                >
                  Reload
                </button>
              )}
              <button
                className="h-10 rounded-md bg-sky-600 px-4 py-1 text-white transition-colors hover:bg-sky-500"
                onClick={() => close()}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    )
  } else {
    return null
  }
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    })

    if (resp?.status === 200) await r.update()
  }, period)
}
