'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  X,
  User,
  BookOpen,
  Play,
  Star,
  MapPin,
  Clock,
  Filter,
  TrendingUp
} from 'lucide-react'

interface SearchResult {
  id: string
  name?: string
  title?: string
  description: string
  type: 'skill' | 'teacher' | 'content'
  category?: string
  rating?: number
  location?: string
  hourlyRate?: number
  level?: string
  duration?: number
  tags?: string
  popularity?: number
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const resultTypeColors = {
  skill: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  teacher: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  content: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}

const resultTypeIcons = {
  skill: BookOpen,
  teacher: User,
  content: Play
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    skills: SearchResult[]
    teachers: SearchResult[]
    content: SearchResult[]
    total: number
  }>({ skills: [], teachers: [], content: [], total: 0 })
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'skill' | 'teacher' | 'content'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.length < 2) {
      setResults({ skills: [], teachers: [], content: [], total: 0 })
      setSuggestions([])
      return
    }

    const debounceTimer = setTimeout(() => {
      performSearch()
      getSuggestions()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, selectedFilter])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `http://localhost:3002/api/search?q=${encodeURIComponent(query)}&type=${selectedFilter}&limit=20`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const data = await response.json()

      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSuggestions = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/search/suggestions?q=${encodeURIComponent(query)}`
      )
      const data = await response.json()

      if (data.success) {
        setSuggestions(data.data)
      }
    } catch (error) {
      console.error('Suggestions error:', error)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
  }

  const renderResultItem = (result: SearchResult) => {
    const Icon = resultTypeIcons[result.type]
    const displayName = result.name || result.title || 'Untitled'

    return (
      <div key={`${result.type}-${result.id}`} className="p-4 hover:bg-accent rounded-lg cursor-pointer transition-colors">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-foreground truncate">
                {displayName}
              </h3>
              <Badge className={`text-xs ${resultTypeColors[result.type]}`}>
                {result.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {result.description}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              {result.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>{result.rating}</span>
                </div>
              )}
              {result.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{result.location}</span>
                </div>
              )}
              {result.hourlyRate && (
                <div className="flex items-center space-x-1">
                  <span>${result.hourlyRate}/hr</span>
                </div>
              )}
              {result.level && (
                <Badge variant="outline" className="text-xs">
                  {result.level}
                </Badge>
              )}
              {result.duration && (
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{result.duration} min</span>
                </div>
              )}
              {result.popularity && (
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{result.popularity}%</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const allResults = [
    ...results.skills,
    ...results.teachers,
    ...results.content
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search skills, teachers, content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg"
            />
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Filters */}
          <div className="px-6 py-3 border-b">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex space-x-1">
                {(['all', 'skill', 'teacher', 'content'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={selectedFilter === filter ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter)}
                    className="capitalize"
                  >
                    {filter}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-96">
            {isLoading ? (
              <div className="px-6 py-8 text-center text-muted-foreground">
                Searching...
              </div>
            ) : query.length < 2 ? (
              <div className="px-6 py-8">
                <div className="text-center text-muted-foreground mb-4">
                  Start typing to search for skills, teachers, and content
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {['React Development', 'Python Programming', 'UI/UX Design', 'Spanish Conversation'].map((popular) => (
                      <Badge
                        key={popular}
                        variant="secondary"
                        className="cursor-pointer hover:bg-accent"
                        onClick={() => setQuery(popular)}
                      >
                        {popular}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : results.total === 0 ? (
              <div className="px-6 py-8 text-center">
                <div className="text-muted-foreground mb-4">
                  No results found for "{query}"
                </div>
                {suggestions.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Did you mean:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion) => (
                        <Badge
                          key={suggestion}
                          variant="secondary"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {selectedFilter === 'all' ? (
                  <>
                    {results.skills.length > 0 && (
                      <>
                        <div className="px-6 py-2 text-sm font-medium text-muted-foreground border-b">
                          Skills ({results.skills.length})
                        </div>
                        {results.skills.map(renderResultItem)}
                      </>
                    )}
                    {results.teachers.length > 0 && (
                      <>
                        <div className="px-6 py-2 text-sm font-medium text-muted-foreground border-b">
                          Teachers ({results.teachers.length})
                        </div>
                        {results.teachers.map(renderResultItem)}
                      </>
                    )}
                    {results.content.length > 0 && (
                      <>
                        <div className="px-6 py-2 text-sm font-medium text-muted-foreground border-b">
                          Content ({results.content.length})
                        </div>
                        {results.content.map(renderResultItem)}
                      </>
                    )}
                  </>
                ) : (
                  allResults
                    .filter(result => selectedFilter === 'all' || result.type === selectedFilter)
                    .map(renderResultItem)
                )}
              </div>
            )}
          </div>
        </div>

        {results.total > 0 && (
          <div className="px-6 py-3 border-t text-sm text-muted-foreground">
            Showing {Math.min(20, results.total)} of {results.total} results
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}