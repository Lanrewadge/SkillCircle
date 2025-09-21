'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n'

interface LocalizedNumberProps {
  value: number
  style?: 'decimal' | 'currency' | 'percent'
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  className?: string
}

export function LocalizedNumber({
  value,
  style = 'decimal',
  currency = 'USD',
  minimumFractionDigits,
  maximumFractionDigits,
  className
}: LocalizedNumberProps) {
  const { formatNumber, formatCurrency } = useTranslation()

  const formattedValue = React.useMemo(() => {
    if (style === 'currency') {
      return formatCurrency(value, currency)
    }

    const options: Intl.NumberFormatOptions = {
      style,
      minimumFractionDigits,
      maximumFractionDigits
    }

    return formatNumber(value, options)
  }, [value, style, currency, minimumFractionDigits, maximumFractionDigits, formatNumber, formatCurrency])

  return <span className={className}>{formattedValue}</span>
}

interface LocalizedDateProps {
  date: Date | string | number
  format?: 'short' | 'medium' | 'long' | 'full' | 'relative'
  timeStyle?: 'short' | 'medium' | 'long'
  dateStyle?: 'short' | 'medium' | 'long' | 'full'
  className?: string
}

export function LocalizedDate({
  date,
  format = 'medium',
  timeStyle,
  dateStyle,
  className
}: LocalizedDateProps) {
  const { formatDate, formatRelativeTime } = useTranslation()

  const formattedDate = React.useMemo(() => {
    const dateObj = new Date(date)

    if (format === 'relative') {
      const now = new Date()
      const diffInMs = dateObj.getTime() - now.getTime()
      const diffInMinutes = Math.round(diffInMs / (1000 * 60))

      if (Math.abs(diffInMinutes) < 1) {
        return 'Just now'
      } else if (Math.abs(diffInMinutes) < 60) {
        return formatRelativeTime(diffInMinutes, 'minute')
      } else if (Math.abs(diffInMinutes) < 1440) {
        return formatRelativeTime(Math.round(diffInMinutes / 60), 'hour')
      } else if (Math.abs(diffInMinutes) < 43200) {
        return formatRelativeTime(Math.round(diffInMinutes / 1440), 'day')
      } else {
        return formatDate(dateObj, { dateStyle: 'medium' })
      }
    }

    const options: Intl.DateTimeFormatOptions = {}

    if (dateStyle) {
      options.dateStyle = dateStyle
    } else {
      switch (format) {
        case 'short':
          options.year = 'numeric'
          options.month = 'short'
          options.day = 'numeric'
          break
        case 'medium':
          options.year = 'numeric'
          options.month = 'long'
          options.day = 'numeric'
          break
        case 'long':
          options.weekday = 'long'
          options.year = 'numeric'
          options.month = 'long'
          options.day = 'numeric'
          break
        case 'full':
          options.weekday = 'long'
          options.year = 'numeric'
          options.month = 'long'
          options.day = 'numeric'
          options.hour = 'numeric'
          options.minute = 'numeric'
          break
      }
    }

    if (timeStyle) {
      options.timeStyle = timeStyle
    }

    return formatDate(dateObj, options)
  }, [date, format, timeStyle, dateStyle, formatDate, formatRelativeTime])

  return <span className={className}>{formattedDate}</span>
}

interface LocalizedTextProps {
  tKey: string
  variables?: Record<string, string | number>
  fallback?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function LocalizedText({
  tKey,
  variables,
  fallback,
  className,
  as: Component = 'span'
}: LocalizedTextProps) {
  const { t } = useTranslation()

  const text = React.useMemo(() => {
    try {
      return t(tKey, variables)
    } catch (error) {
      console.warn(`Translation error for key "${tKey}":`, error)
      return fallback || tKey
    }
  }, [tKey, variables, fallback, t])

  return <Component className={className}>{text}</Component>
}

interface LocalizedPluralProps {
  tKey: string
  count: number
  variables?: Record<string, string | number>
  fallback?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function LocalizedPlural({
  tKey,
  count,
  variables,
  fallback,
  className,
  as: Component = 'span'
}: LocalizedPluralProps) {
  const { plural } = useTranslation()

  const text = React.useMemo(() => {
    try {
      return plural(tKey, count, variables)
    } catch (error) {
      console.warn(`Plural translation error for key "${tKey}":`, error)
      return fallback || `${count} ${tKey}`
    }
  }, [tKey, count, variables, fallback, plural])

  return <Component className={className}>{text}</Component>
}

// Higher-order component for automatic localization
export function withLocalization<P extends object>(
  Component: React.ComponentType<P>,
  localizationMap: Record<string, string>
) {
  return React.forwardRef<any, P>((props, ref) => {
    const { t } = useTranslation()

    const localizedProps = React.useMemo(() => {
      const newProps = { ...props }

      Object.entries(localizationMap).forEach(([propKey, translationKey]) => {
        if (propKey in newProps) {
          ;(newProps as any)[propKey] = t(translationKey)
        }
      })

      return newProps
    }, [props, t])

    return <Component {...localizedProps} ref={ref} />
  })
}

// Hook for getting localized options for select components
export function useLocalizedOptions(optionsConfig: {
  tKeyPrefix: string
  values: string[]
}) {
  const { t } = useTranslation()

  return React.useMemo(() => {
    return optionsConfig.values.map(value => ({
      value,
      label: t(`${optionsConfig.tKeyPrefix}.${value}`)
    }))
  }, [optionsConfig, t])
}

// Component for localized skill levels
export function SkillLevelSelector({ value, onChange, className }: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  const options = useLocalizedOptions({
    tKeyPrefix: 'skills.levels',
    values: ['beginner', 'intermediate', 'advanced', 'expert']
  })

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// Component for localized categories
export function CategorySelector({ value, onChange, className }: {
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  const options = useLocalizedOptions({
    tKeyPrefix: 'skills.categories',
    values: [
      'technology',
      'business',
      'creative',
      'academic',
      'language',
      'health',
      'lifestyle',
      'music',
      'cooking'
    ]
  })

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

// RTL-aware layout component
export function RTLAwareContainer({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  const { getCurrentLocaleInfo } = useTranslation()
  const isRTL = getCurrentLocaleInfo().rtl

  return (
    <div
      className={`${className} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </div>
  )
}