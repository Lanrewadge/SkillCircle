'use client'

import { useEffect } from 'react'

export const ServiceWorkerRegistration = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW: Service Worker registered successfully:', registration.scope)

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  console.log('SW: New content is available, please refresh.')

                  // You could show a notification to the user here
                  if (window.confirm('New version available! Refresh to update?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('SW: Service Worker registration failed:', error)
        })

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('SW: Message from service worker:', event.data)
      })

      // Handle online/offline status
      const updateOnlineStatus = () => {
        if (navigator.onLine) {
          console.log('SW: App is online')
          // You could dispatch a Redux action or update state here
        } else {
          console.log('SW: App is offline')
          // You could show an offline banner here
        }
      }

      window.addEventListener('online', updateOnlineStatus)
      window.addEventListener('offline', updateOnlineStatus)

      // Initial status check
      updateOnlineStatus()

      return () => {
        window.removeEventListener('online', updateOnlineStatus)
        window.removeEventListener('offline', updateOnlineStatus)
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Hook for service worker functionality
export const useServiceWorker = () => {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        console.log('SW: Notification permission:', permission)
      })
    }

    // Handle push subscription
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.pushManager.getSubscription()
      }).then((subscription) => {
        if (!subscription) {
          // Subscribe user to push notifications
          // This would typically be done after user consent
          console.log('SW: No push subscription found')
        } else {
          console.log('SW: Push subscription active')
        }
      })
    }
  }, [])

  const sendMessageToSW = (message: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message)
    }
  }

  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.update()
        }
      })
    }
  }

  return { sendMessageToSW, updateServiceWorker }
}