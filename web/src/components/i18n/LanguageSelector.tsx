'use client'

import React, { useState } from 'react'
import { ChevronDown, Globe, Check } from 'lucide-react'
import { useTranslation, supportedLocales, Locale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'mobile'
  showFlag?: boolean
  showNativeName?: boolean
  className?: string
}

export function LanguageSelector({
  variant = 'default',
  showFlag = true,
  showNativeName = true,
  className = ''
}: LanguageSelectorProps) {
  const { locale, setLocale, getCurrentLocaleInfo } = useTranslation()
  const [isChanging, setIsChanging] = useState(false)
  const currentLocale = getCurrentLocaleInfo()

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale) return

    setIsChanging(true)
    try {
      await setLocale(newLocale)
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  const getLocaleDisplay = (localeInfo: Locale, showBoth: boolean = false) => {
    const parts = []

    if (showFlag) {
      parts.push(localeInfo.flag)
    }

    if (variant === 'compact') {
      parts.push(localeInfo.code.toUpperCase())
    } else if (showBoth || !showNativeName) {
      parts.push(localeInfo.name)
    } else {
      parts.push(localeInfo.nativeName)
    }

    return parts.join(' ')
  }

  if (variant === 'mobile') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <Globe className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900">Language / Idioma</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {supportedLocales.map((localeInfo) => (
            <Button
              key={localeInfo.code}
              variant={locale === localeInfo.code ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange(localeInfo.code)}
              disabled={isChanging}
              className="justify-start text-left h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <div className="flex items-center space-x-2">
                  <span>{localeInfo.flag}</span>
                  <span className="font-medium">{localeInfo.name}</span>
                  {locale === localeInfo.code && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <span className="text-xs text-gray-600 mt-1">
                  {localeInfo.nativeName}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant === 'compact' ? 'ghost' : 'outline'}
          size={variant === 'compact' ? 'sm' : 'default'}
          className={`${variant === 'compact' ? 'h-8 px-2' : ''} ${className}`}
          disabled={isChanging}
        >
          <div className="flex items-center space-x-1">
            {variant !== 'compact' && <Globe className="w-4 h-4" />}
            <span>{getLocaleDisplay(currentLocale)}</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2 border-b border-gray-200">
          <p className="text-sm font-medium text-gray-900">Select Language</p>
          <p className="text-xs text-gray-600">Choose your preferred language</p>
        </div>

        {supportedLocales.map((localeInfo) => (
          <DropdownMenuItem
            key={localeInfo.code}
            onClick={() => handleLanguageChange(localeInfo.code)}
            className="flex items-center justify-between py-2"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{localeInfo.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{localeInfo.name}</span>
                <span className="text-xs text-gray-600">
                  {localeInfo.nativeName}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {localeInfo.rtl && (
                <Badge variant="outline" className="text-xs">
                  RTL
                </Badge>
              )}
              {locale === localeInfo.code && (
                <Check className="w-4 h-4 text-green-600" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Compact language switcher for headers/navbars
export function CompactLanguageSelector(props: Omit<LanguageSelectorProps, 'variant'>) {
  return <LanguageSelector {...props} variant="compact" />
}

// Mobile-friendly language selector for settings pages
export function MobileLanguageSelector(props: Omit<LanguageSelectorProps, 'variant'>) {
  return <LanguageSelector {...props} variant="mobile" />
}

// Language detection and suggestion component
export function LanguageDetectionBanner() {
  const { locale, setLocale } = useTranslation()
  const [dismissed, setDismissed] = useState(false)
  const [suggestedLocale, setSuggestedLocale] = useState<string | null>(null)

  React.useEffect(() => {
    // Check if we should suggest a different language
    const browserLang = navigator.language.split('-')[0]
    const supportedLang = supportedLocales.find(l => l.code === browserLang)

    if (supportedLang && supportedLang.code !== locale && !dismissed) {
      setSuggestedLocale(supportedLang.code)
    }
  }, [locale, dismissed])

  if (!suggestedLocale || dismissed) {
    return null
  }

  const suggestedLocaleInfo = supportedLocales.find(l => l.code === suggestedLocale)!

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Switch to {suggestedLocaleInfo.nativeName}?
            </p>
            <p className="text-xs text-blue-700">
              We detected your browser language preference
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setDismissed(true)}
          >
            No, thanks
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setLocale(suggestedLocale)
              setDismissed(true)
            }}
          >
            {suggestedLocaleInfo.flag} Switch
          </Button>
        </div>
      </div>
    </div>
  )
}