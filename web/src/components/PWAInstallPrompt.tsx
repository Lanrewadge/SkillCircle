'use client'

import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }

      // Check for iOS standalone mode
      if ('standalone' in window.navigator && (window.navigator as any).standalone) {
        setIsInstalled(true)
        return
      }
    }

    checkIfInstalled()

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('PWA: beforeinstallprompt event fired')

      // Prevent the default install prompt
      e.preventDefault()

      // Store the event for later use
      setDeferredPrompt(e)

      // Check if user has previously dismissed the prompt
      const lastDismissed = localStorage.getItem('pwa-install-dismissed')
      const dismissedTime = lastDismissed ? parseInt(lastDismissed) : 0
      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)

      // Show prompt if never dismissed or dismissed more than a week ago
      if (!lastDismissed || dismissedTime < oneWeekAgo) {
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 3000) // Show after 3 seconds
      }
    }

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA: App was installed')
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for the user's response
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt')
      } else {
        console.log('PWA: User dismissed the install prompt')
      }

      // Clear the deferred prompt
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('PWA: Error during installation', error)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent

    if (/iPhone|iPad|iPod/.test(userAgent)) {
      return {
        platform: 'iOS',
        instructions: 'Tap the share button and select "Add to Home Screen"'
      }
    } else if (/Android/.test(userAgent)) {
      return {
        platform: 'Android',
        instructions: 'Tap the menu button and select "Add to Home Screen" or "Install App"'
      }
    } else {
      return {
        platform: 'Desktop',
        instructions: 'Look for the install icon in your browser\'s address bar'
      }
    }
  }

  // Don't show if already installed or no prompt available
  if (isInstalled || (!showInstallPrompt && !deferredPrompt)) {
    return null
  }

  const { platform, instructions } = getInstallInstructions()

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500 rounded-full">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-lg">Install SkillCircle</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription>
            Get the full app experience with offline access and notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Offline Access:</strong> Browse skills and view your profile without internet
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Push Notifications:</strong> Get instant alerts for new messages and sessions
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Quick Access:</strong> Launch directly from your home screen
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            {deferredPrompt ? (
              <Button onClick={handleInstallClick} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            ) : (
              <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  {platform} Instructions:
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {instructions}
                </p>
              </div>
            )}
            <Button variant="outline" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for PWA installation status
export const usePWAInstall = () => {
  const [isInstalled, setIsInstalled] = useState(false)
  const [canInstall, setCanInstall] = useState(false)

  useEffect(() => {
    // Check if app is installed
    const checkInstallStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && 'standalone' in window.navigator
      setIsInstalled(isStandalone || (isIOS && (window.navigator as any).standalone))
    }

    // Check if app can be installed
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
    }

    checkInstallStatus()

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  return { isInstalled, canInstall }
}