'use client'

import React, { useState, useEffect } from 'react'
import { X, Download, Smartphone, Zap, Wifi, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
    setIsInstalled('standalone' in window.navigator || window.navigator.standalone === true)

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)

      // Show install prompt after a short delay
      setTimeout(() => {
        if (!isInstalled && !isStandalone) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled, isStandalone])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        console.log('PWA install accepted')
      } else {
        console.log('PWA install dismissed')
      }
    } catch (error) {
      console.error('Error during PWA install:', error)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  // Don't show if already installed, in standalone mode, or previously dismissed
  if (isInstalled ||
      isStandalone ||
      !showPrompt ||
      !deferredPrompt ||
      sessionStorage.getItem('pwa-install-dismissed')) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white rounded-t-2xl animate-in slide-in-from-bottom duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Install SkillCircle</h3>
                <p className="text-sm text-gray-600">Get the app experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-600">Faster Access</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Wifi className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-600">Works Offline</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-600">Better Experience</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">App Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Full-screen experience without browser UI</li>
                <li>• Faster loading and smoother performance</li>
                <li>• Works offline with cached content</li>
                <li>• Push notifications for new messages</li>
                <li>• Quick access from home screen</li>
              </ul>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="px-6"
            >
              Not Now
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Free to install • No app store required • Instant updates
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook for PWA install functionality
export function usePWAInstall() {
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const install = async () => {
    if (!deferredPrompt) return false

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      setCanInstall(false)
      return outcome === 'accepted'
    } catch (error) {
      console.error('Error during PWA install:', error)
      return false
    }
  }

  return { canInstall, install }
}