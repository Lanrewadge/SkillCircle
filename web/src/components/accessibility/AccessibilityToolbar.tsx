'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Accessibility,
  Eye,
  EyeOff,
  Type,
  Palette,
  Volume2,
  VolumeX,
  MousePointer,
  Keyboard,
  Mic,
  MicOff,
  Settings,
  RotateCcw,
  Moon,
  Sun,
  ZoomIn,
  ZoomOut,
  Focus,
  Contrast
} from 'lucide-react'

interface AccessibilitySettings {
  highContrast: boolean
  largeText: boolean
  fontSize: number
  darkMode: boolean
  reducedMotion: boolean
  screenReader: boolean
  voiceNavigation: boolean
  keyboardNavigation: boolean
  focusVisible: boolean
  colorBlindFriendly: boolean
  audioDescriptions: boolean
  captionsEnabled: boolean
  magnification: number
}

export default function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    fontSize: 16,
    darkMode: false,
    reducedMotion: false,
    screenReader: false,
    voiceNavigation: false,
    keyboardNavigation: true,
    focusVisible: true,
    colorBlindFriendly: false,
    audioDescriptions: false,
    captionsEnabled: false,
    magnification: 100
  })

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Save settings to localStorage and apply them
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))
    applyAccessibilitySettings(settings)
  }, [settings])

  const applyAccessibilitySettings = (settings: AccessibilitySettings) => {
    const root = document.documentElement

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text')
    } else {
      root.classList.remove('large-text')
    }

    // Font size
    root.style.fontSize = `${settings.fontSize}px`

    // Reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }

    // Focus visible
    if (settings.focusVisible) {
      root.classList.add('focus-visible')
    } else {
      root.classList.remove('focus-visible')
    }

    // Color blind friendly
    if (settings.colorBlindFriendly) {
      root.classList.add('colorblind-friendly')
    } else {
      root.classList.remove('colorblind-friendly')
    }

    // Magnification
    if (settings.magnification !== 100) {
      root.style.transform = `scale(${settings.magnification / 100})`
      root.style.transformOrigin = 'top left'
    } else {
      root.style.transform = ''
      root.style.transformOrigin = ''
    }
  }

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const updateFontSize = (change: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(12, Math.min(24, prev.fontSize + change))
    }))
  }

  const updateMagnification = (change: number) => {
    setSettings(prev => ({
      ...prev,
      magnification: Math.max(50, Math.min(200, prev.magnification + change))
    }))
  }

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      largeText: false,
      fontSize: 16,
      darkMode: false,
      reducedMotion: false,
      screenReader: false,
      voiceNavigation: false,
      keyboardNavigation: true,
      focusVisible: true,
      colorBlindFriendly: false,
      audioDescriptions: false,
      captionsEnabled: false,
      magnification: 100
    })
  }

  const announceChange = (message: string) => {
    // Create an aria-live region for screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    announcement.textContent = message

    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }

  const handleToggleWithAnnouncement = (key: keyof AccessibilitySettings, enabledMessage: string, disabledMessage: string) => {
    const newValue = !settings[key]
    toggleSetting(key)
    announceChange(newValue ? enabledMessage : disabledMessage)
  }

  return (
    <>
      {/* Floating Accessibility Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              size="lg"
              className="rounded-full w-14 h-14 shadow-lg"
              aria-label="Accessibility options"
            >
              <Accessibility className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Quick Actions */}
            <div className="p-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleWithAnnouncement(
                    'highContrast',
                    'High contrast enabled',
                    'High contrast disabled'
                  )}
                  className="justify-start"
                >
                  <Contrast className="h-4 w-4 mr-2" />
                  High Contrast
                </Button>

                <Button
                  variant={settings.darkMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleWithAnnouncement(
                    'darkMode',
                    'Dark mode enabled',
                    'Dark mode disabled'
                  )}
                  className="justify-start"
                >
                  {settings.darkMode ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                  {settings.darkMode ? 'Dark' : 'Light'}
                </Button>

                <Button
                  variant={settings.largeText ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleWithAnnouncement(
                    'largeText',
                    'Large text enabled',
                    'Large text disabled'
                  )}
                  className="justify-start"
                >
                  <Type className="h-4 w-4 mr-2" />
                  Large Text
                </Button>

                <Button
                  variant={settings.voiceNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggleWithAnnouncement(
                    'voiceNavigation',
                    'Voice navigation enabled',
                    'Voice navigation disabled'
                  )}
                  className="justify-start"
                >
                  {settings.voiceNavigation ? <Mic className="h-4 w-4 mr-2" /> : <MicOff className="h-4 w-4 mr-2" />}
                  Voice Nav
                </Button>
              </div>

              {/* Font Size Controls */}
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm font-medium">Font Size</span>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFontSize(-2)}
                    disabled={settings.fontSize <= 12}
                    aria-label="Decrease font size"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-sm min-w-[3ch] text-center">{settings.fontSize}px</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateFontSize(2)}
                    disabled={settings.fontSize >= 24}
                    aria-label="Increase font size"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Magnification Controls */}
              <div className="flex items-center justify-between p-2 bg-muted rounded">
                <span className="text-sm font-medium">Zoom</span>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMagnification(-25)}
                    disabled={settings.magnification <= 50}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-sm min-w-[4ch] text-center">{settings.magnification}%</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateMagnification(25)}
                    disabled={settings.magnification >= 200}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              More Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={resetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Detailed Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Accessibility Settings</DialogTitle>
            <DialogDescription>
              Customize SkillCircle to meet your accessibility needs
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Visual Settings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Eye className="h-4 w-4 mr-2" />
                  Visual Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast" className="text-sm font-medium">
                      High Contrast Mode
                    </label>
                    <Button
                      id="high-contrast"
                      variant={settings.highContrast ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('highContrast')}
                    >
                      <Contrast className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="dark-mode" className="text-sm font-medium">
                      Dark Mode
                    </label>
                    <Button
                      id="dark-mode"
                      variant={settings.darkMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('darkMode')}
                    >
                      {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="colorblind-friendly" className="text-sm font-medium">
                      Color Blind Friendly
                    </label>
                    <Button
                      id="colorblind-friendly"
                      variant={settings.colorBlindFriendly ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('colorBlindFriendly')}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="reduced-motion" className="text-sm font-medium">
                      Reduce Motion
                    </label>
                    <Button
                      id="reduced-motion"
                      variant={settings.reducedMotion ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('reducedMotion')}
                    >
                      <MousePointer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audio Settings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2" />
                  Audio Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="screen-reader" className="text-sm font-medium">
                      Screen Reader Support
                    </label>
                    <Button
                      id="screen-reader"
                      variant={settings.screenReader ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('screenReader')}
                    >
                      {settings.screenReader ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="audio-descriptions" className="text-sm font-medium">
                      Audio Descriptions
                    </label>
                    <Button
                      id="audio-descriptions"
                      variant={settings.audioDescriptions ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('audioDescriptions')}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="captions" className="text-sm font-medium">
                      Captions Enabled
                    </label>
                    <Button
                      id="captions"
                      variant={settings.captionsEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('captionsEnabled')}
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Settings */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Keyboard className="h-4 w-4 mr-2" />
                  Navigation Settings
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="keyboard-nav" className="text-sm font-medium">
                      Keyboard Navigation
                    </label>
                    <Button
                      id="keyboard-nav"
                      variant={settings.keyboardNavigation ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('keyboardNavigation')}
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="focus-visible" className="text-sm font-medium">
                      Enhanced Focus Indicators
                    </label>
                    <Button
                      id="focus-visible"
                      variant={settings.focusVisible ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('focusVisible')}
                    >
                      <Focus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="voice-nav" className="text-sm font-medium">
                      Voice Navigation
                    </label>
                    <Button
                      id="voice-nav"
                      variant={settings.voiceNavigation ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSetting('voiceNavigation')}
                    >
                      {settings.voiceNavigation ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reset Button */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetSettings}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset All Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* CSS Injection for Accessibility Styles */}
      <style jsx global>{`
        .high-contrast {
          filter: contrast(200%) saturate(0%);
        }

        .large-text {
          font-size: 1.2em !important;
        }

        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .focus-visible *:focus {
          outline: 3px solid #0066cc !important;
          outline-offset: 2px !important;
        }

        .colorblind-friendly {
          --primary: #0066cc;
          --secondary: #6b7280;
          --success: #059669;
          --warning: #d97706;
          --error: #dc2626;
        }
      `}</style>
    </>
  )
}