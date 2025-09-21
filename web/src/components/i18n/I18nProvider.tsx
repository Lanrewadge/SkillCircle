'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { i18n, useTranslation } from '@/lib/i18n'

interface I18nContextType {
  isLoading: boolean
  error: string | null
  reload: () => Promise<void>
}

const I18nContext = createContext<I18nContextType>({
  isLoading: true,
  error: null,
  reload: async () => {}
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await i18n.loadTranslations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load translations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading translations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-red-600 mb-4">Failed to load translations</p>
          <button
            onClick={reload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <I18nContext.Provider value={{ isLoading, error, reload }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18nContext() {
  return useContext(I18nContext)
}

// Translation loading indicator
export function TranslationLoader() {
  const { isLoading } = useI18nContext()

  if (!isLoading) return null

  return (
    <div className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-3 z-50 border">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Loading translations...</span>
      </div>
    </div>
  )
}

// Language switch confirmation modal
export function LanguageSwitchModal({
  isOpen,
  onClose,
  onConfirm,
  targetLanguage
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  targetLanguage: string
}) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {t('settings.changeLanguage')}
        </h3>
        <p className="text-gray-600 mb-6">
          Switching to {targetLanguage} will reload the page. Continue?
        </p>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}