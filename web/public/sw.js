const CACHE_NAME = 'skillcircle-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/dashboard',
  '/dashboard/skills/browse',
  '/dashboard/messages',
  '/dashboard/profile',
  '/offline'
]

const API_CACHE_URLS = [
  '/api/v1/skills/categories',
  '/api/v1/skills'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        console.log('Service Worker: Installation complete')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Installation failed', error)
      })
  )
})

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activation complete')
        return self.clients.claim()
      })
  )
})

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response for caching
          const responseClone = response.clone()

          // Cache successful API responses
          if (response.ok) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone)
              })
          }

          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse
              }

              // Return offline page for API failures
              return new Response(
                JSON.stringify({
                  error: 'Offline',
                  message: 'You are currently offline. Please check your connection.'
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              )
            })
        })
    )
    return
  }

  // Handle static assets and pages with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response.ok) {
              return response
            }

            // Clone response for caching
            const responseClone = response.clone()

            // Cache the response
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseClone)
              })

            return response
          })
          .catch(() => {
            // Network failed, try to serve offline page
            if (request.mode === 'navigate') {
              return caches.match('/offline')
                .then((offlinePage) => {
                  return offlinePage || new Response(
                    `<!DOCTYPE html>
                    <html>
                      <head>
                        <title>SkillCircle - Offline</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                          body {
                            font-family: system-ui, sans-serif;
                            text-align: center;
                            padding: 2rem;
                            background: #f9fafb;
                          }
                          .container {
                            max-width: 400px;
                            margin: 0 auto;
                            background: white;
                            padding: 2rem;
                            border-radius: 8px;
                            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                          }
                          .icon { font-size: 3rem; margin-bottom: 1rem; }
                          h1 { color: #374151; margin-bottom: 1rem; }
                          p { color: #6b7280; margin-bottom: 2rem; }
                          button {
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 1rem;
                          }
                          button:hover { background: #2563eb; }
                        </style>
                      </head>
                      <body>
                        <div class="container">
                          <div class="icon">📱</div>
                          <h1>You're Offline</h1>
                          <p>SkillCircle is available offline with limited functionality. Connect to the internet to access all features.</p>
                          <button onclick="window.location.reload()">Try Again</button>
                        </div>
                      </body>
                    </html>`,
                    {
                      headers: { 'Content-Type': 'text/html' }
                    }
                  )
                })
            }

            // For other requests, return a generic offline response
            return new Response('Offline', { status: 503 })
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Implement background sync logic here
      // For example, sync offline messages, skill bookmarks, etc.
      console.log('Service Worker: Performing background sync')
    )
  }
})

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push received', event)

  const options = {
    body: event.data ? event.data.text() : 'New notification from SkillCircle',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open SkillCircle',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close notification',
        icon: '/icons/action-close.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('SkillCircle', options)
  )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event)

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data)

  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        self.skipWaiting()
        break
      case 'GET_VERSION':
        event.ports[0].postMessage({ version: CACHE_NAME })
        break
      default:
        console.log('Service Worker: Unknown message type', event.data.type)
    }
  }
})