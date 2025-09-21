import React from 'react'

export interface Translation {
  [key: string]: string | Translation
}

export interface Locale {
  code: string
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

export const supportedLocales: Locale[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
]

export const defaultLocale = 'en'

class I18nManager {
  private currentLocale: string = defaultLocale
  private translations: Record<string, Translation> = {}
  private fallbackTranslations: Translation = {}

  constructor() {
    this.loadTranslations()
  }

  async loadTranslations() {
    // Load default (English) translations
    try {
      const defaultTranslations = await import('../locales/en.json')
      this.fallbackTranslations = defaultTranslations.default
      this.translations['en'] = defaultTranslations.default
    } catch (error) {
      console.warn('Could not load default translations:', error)
    }

    // Try to load user's preferred locale from localStorage
    const savedLocale = localStorage.getItem('skillcircle-locale')
    if (savedLocale && this.isValidLocale(savedLocale)) {
      await this.setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLocale = this.detectBrowserLocale()
      if (browserLocale !== this.currentLocale) {
        await this.setLocale(browserLocale)
      }
    }
  }

  private detectBrowserLocale(): string {
    const browserLang = navigator.language || (navigator as any).userLanguage
    const langCode = browserLang.split('-')[0]

    return supportedLocales.find(locale => locale.code === langCode)?.code || defaultLocale
  }

  private isValidLocale(locale: string): boolean {
    return supportedLocales.some(l => l.code === locale)
  }

  async setLocale(locale: string) {
    if (!this.isValidLocale(locale)) {
      console.warn(`Unsupported locale: ${locale}`)
      return
    }

    this.currentLocale = locale
    localStorage.setItem('skillcircle-locale', locale)

    // Load translations if not already loaded
    if (!this.translations[locale] && locale !== 'en') {
      try {
        const translations = await import(`../locales/${locale}.json`)
        this.translations[locale] = translations.default
      } catch (error) {
        console.warn(`Could not load translations for ${locale}:`, error)
      }
    }

    // Update document direction for RTL languages
    const isRTL = supportedLocales.find(l => l.code === locale)?.rtl || false
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }

  getLocale(): string {
    return this.currentLocale
  }

  getCurrentLocaleInfo(): Locale {
    return supportedLocales.find(l => l.code === this.currentLocale) || supportedLocales[0]
  }

  t(key: string, variables?: Record<string, string | number>): string {
    const translation = this.getNestedTranslation(key)

    if (!translation) {
      console.warn(`Translation missing for key: ${key}`)
      return key
    }

    // Replace variables in translation
    if (variables) {
      return this.interpolate(translation, variables)
    }

    return translation
  }

  private getNestedTranslation(key: string): string | null {
    const keys = key.split('.')

    // Try current locale first
    let translation = this.getTranslationFromObject(keys, this.translations[this.currentLocale])

    // Fall back to English if not found
    if (!translation && this.currentLocale !== 'en') {
      translation = this.getTranslationFromObject(keys, this.fallbackTranslations)
    }

    return translation
  }

  private getTranslationFromObject(keys: string[], obj: Translation): string | null {
    if (!obj) return null

    let current: any = obj
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key]
      } else {
        return null
      }
    }

    return typeof current === 'string' ? current : null
  }

  private interpolate(template: string, variables: Record<string, string | number>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key]?.toString() || match
    })
  }

  // Pluralization support
  plural(key: string, count: number, variables?: Record<string, string | number>): string {
    const pluralRules = new Intl.PluralRule(this.currentLocale)
    const rule = pluralRules.select(count)

    const pluralKey = `${key}.${rule}`
    const translation = this.getNestedTranslation(pluralKey)

    if (translation) {
      return this.interpolate(translation, { ...variables, count })
    }

    // Fallback to singular form
    return this.t(key, { ...variables, count })
  }

  // Number formatting
  formatNumber(number: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(this.currentLocale, options).format(number)
  }

  // Currency formatting
  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat(this.currentLocale, {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  // Date formatting
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    return new Intl.DateTimeFormat(this.currentLocale, options).format(date)
  }

  // Relative time formatting
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string {
    const rtf = new Intl.RelativeTimeFormat(this.currentLocale, { numeric: 'auto' })
    return rtf.format(value, unit)
  }
}

export const i18n = new I18nManager()

// React hook for using i18n in components
export function useTranslation() {
  const [locale, setLocaleState] = React.useState(i18n.getLocale())

  const setLocale = async (newLocale: string) => {
    await i18n.setLocale(newLocale)
    setLocaleState(newLocale)
  }

  const t = (key: string, variables?: Record<string, string | number>) => {
    return i18n.t(key, variables)
  }

  const plural = (key: string, count: number, variables?: Record<string, string | number>) => {
    return i18n.plural(key, count, variables)
  }

  return {
    locale,
    setLocale,
    t,
    plural,
    formatNumber: i18n.formatNumber.bind(i18n),
    formatCurrency: i18n.formatCurrency.bind(i18n),
    formatDate: i18n.formatDate.bind(i18n),
    formatRelativeTime: i18n.formatRelativeTime.bind(i18n),
    supportedLocales,
    getCurrentLocaleInfo: i18n.getCurrentLocaleInfo.bind(i18n)
  }
}

// Type-safe translation function
export function t(key: string, variables?: Record<string, string | number>): string {
  return i18n.t(key, variables)
}