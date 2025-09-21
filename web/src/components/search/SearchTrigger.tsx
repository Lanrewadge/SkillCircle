'use client'

import React, { useEffect } from 'react'
import { Search, Command } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/contexts/SearchContext'
import { useTranslation } from '@/lib/i18n'

interface SearchTriggerProps {
  variant?: 'default' | 'compact' | 'icon-only'
  className?: string
  placeholder?: string
}

export function SearchTrigger({
  variant = 'default',
  className = '',
  placeholder
}: SearchTriggerProps) {
  const { setIsSearchOpen } = useSearch()
  const { t } = useTranslation()

  const defaultPlaceholder = placeholder || t('search.placeholder')

  // Global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setIsSearchOpen])

  if (variant === 'icon-only') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSearchOpen(true)}
        className={`p-2 ${className}`}
        title="Search (⌘K)"
      >
        <Search className="w-5 h-5" />
      </Button>
    )
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        onClick={() => setIsSearchOpen(true)}
        className={`h-9 px-3 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 ${className}`}
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Search...</span>
        <div className="hidden sm:flex items-center space-x-1 ml-auto">
          <kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">⌘</kbd>
          <kbd className="px-1 py-0.5 text-xs bg-gray-200 rounded">K</kbd>
        </div>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={() => setIsSearchOpen(true)}
      className={`relative w-full max-w-md justify-start text-gray-500 bg-gray-50 hover:bg-gray-100 ${className}`}
    >
      <Search className="w-4 h-4 mr-2" />
      <span className="text-sm truncate">{defaultPlaceholder}</span>
      <div className="absolute right-3 hidden sm:flex items-center space-x-1">
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded font-mono">⌘</kbd>
        <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded font-mono">K</kbd>
      </div>
    </Button>
  )
}

// Floating search button for mobile
export function FloatingSearchButton() {
  const { setIsSearchOpen } = useSearch()

  return (
    <Button
      onClick={() => setIsSearchOpen(true)}
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 z-40 md:hidden"
    >
      <Search className="w-6 h-6 text-white" />
    </Button>
  )
}

// Search stats component
export function SearchStats() {
  const { searchResults, searchQuery } = useSearch()

  if (!searchQuery) return null

  return (
    <div className="text-xs text-gray-500 px-3 py-2">
      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
    </div>
  )
}

// Quick search suggestions
export function QuickSearchSuggestions() {
  const { setSearchQuery, setIsSearchOpen } = useSearch()

  const suggestions = [
    'React development',
    'Digital marketing',
    'UI/UX design',
    'Python programming',
    'Data science',
    'JavaScript'
  ]

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion)
    setIsSearchOpen(true)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          onClick={() => handleSuggestionClick(suggestion)}
          className="text-xs h-7"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}