'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  showButton?: boolean
}

export function SearchBar({
  placeholder = "Search skills, teachers, or topics...",
  onSearch,
  className = "",
  showButton = true
}: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query)
    } else {
      // Default behavior - redirect to search page
      const searchParams = new URLSearchParams({ q: query })
      window.location.href = `/search?${searchParams.toString()}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {showButton && (
        <Button
          onClick={handleSearch}
          className="ml-2"
          disabled={!query.trim()}
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      )}
    </div>
  )
}