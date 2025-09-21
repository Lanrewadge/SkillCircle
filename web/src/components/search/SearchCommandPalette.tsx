'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  ArrowRight,
  Book,
  Users,
  ShoppingBag,
  MessageCircle,
  Settings,
  User,
  Home,
  TrendingUp,
  Calendar,
  FileText,
  Star,
  Hash,
  MapPin,
  Clock,
  Command,
  X,
  ChevronRight,
  Globe,
  Bell,
  Shield,
  Upload,
  PlusCircle,
  Filter,
  Zap,
  BarChart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useSearch, SearchResult } from '@/contexts/SearchContext'
import { useTranslation } from '@/lib/i18n'

const iconMap: Record<string, React.ComponentType<any>> = {
  home: Home,
  book: Book,
  users: Users,
  'shopping-bag': ShoppingBag,
  'message-circle': MessageCircle,
  user: User,
  settings: Settings,
  search: Search,
  'trending-up': TrendingUp,
  calendar: Calendar,
  'file-text': FileText,
  star: Star,
  hash: Hash,
  'map-pin': MapPin,
  clock: Clock,
  globe: Globe,
  bell: Bell,
  shield: Shield,
  upload: Upload,
  'plus-circle': PlusCircle,
  filter: Filter,
  zap: Zap,
  'bar-chart': BarChart
}

export function SearchCommandPalette() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    popularSearches,
    navigateToResult,
    clearRecentSearches,
    getSearchSuggestions
  } = useSearch()

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [currentMode, setCurrentMode] = useState<'search' | 'browse' | 'recent'>('search')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  // Update suggestions when query changes
  useEffect(() => {
    setSuggestions(getSearchSuggestions(searchQuery))
  }, [searchQuery, getSearchSuggestions])

  // Reset state when opening/closing
  useEffect(() => {
    if (isSearchOpen) {
      setSelectedIndex(0)
      setCurrentMode(searchQuery ? 'search' : recentSearches.length > 0 ? 'recent' : 'browse')
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setSearchQuery('')
      setSelectedIndex(0)
    }
  }, [isSearchOpen, searchQuery, recentSearches.length, setSearchQuery])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isSearchOpen) return

      const currentItems = getCurrentItems()
      const maxIndex = currentItems.length - 1

      switch (e.key) {
        case 'Escape':
          setIsSearchOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, maxIndex))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          handleSelectItem(currentItems[selectedIndex])
          break
        case 'Tab':
          e.preventDefault()
          if (e.shiftKey) {
            // Cycle modes backwards
            if (currentMode === 'search') setCurrentMode('browse')
            else if (currentMode === 'browse') setCurrentMode('recent')
            else setCurrentMode('search')
          } else {
            // Cycle modes forwards
            if (currentMode === 'search') setCurrentMode('recent')
            else if (currentMode === 'recent') setCurrentMode('browse')
            else setCurrentMode('search')
          }
          setSelectedIndex(0)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, selectedIndex, currentMode])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [selectedIndex])

  const getCurrentItems = () => {
    switch (currentMode) {
      case 'search':
        return searchQuery ? searchResults : suggestions.map(s => ({ id: s, title: s, type: 'suggestion' }))
      case 'recent':
        return recentSearches.map(s => ({ id: s, title: s, type: 'recent' }))
      case 'browse':
        return getQuickActions()
      default:
        return []
    }
  }

  const getQuickActions = () => [
    {
      id: 'browse-skills',
      title: 'Browse Skills',
      description: 'Explore available skills and courses',
      category: 'page',
      url: '/dashboard/skills/browse',
      icon: 'book',
      section: 'Learning'
    },
    {
      id: 'join-community',
      title: 'Community',
      description: 'Connect with other learners',
      category: 'page',
      url: '/community',
      icon: 'users',
      section: 'Social'
    },
    {
      id: 'marketplace',
      title: 'Marketplace',
      description: 'Shop for courses and content',
      category: 'page',
      url: '/marketplace',
      icon: 'shopping-bag',
      section: 'Shopping'
    },
    {
      id: 'create-skill',
      title: 'Create New Skill',
      description: 'Start teaching something new',
      category: 'action',
      url: '/dashboard/skills/create',
      icon: 'plus-circle',
      section: 'Actions'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: 'Check your conversations',
      category: 'page',
      url: '/dashboard/messages',
      icon: 'message-circle',
      section: 'Communication'
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Manage your preferences',
      category: 'page',
      url: '/dashboard/settings',
      icon: 'settings',
      section: 'Account'
    }
  ]

  const handleSelectItem = (item: any) => {
    if (item.type === 'suggestion' || item.type === 'recent') {
      setSearchQuery(item.title)
      setCurrentMode('search')
      setSelectedIndex(0)
    } else if (item.url) {
      navigateToResult(item as SearchResult)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'page': return Home
      case 'skill': return Book
      case 'course': return Book
      case 'user': return User
      case 'community': return Users
      case 'marketplace': return ShoppingBag
      case 'action': return Star
      case 'setting': return Settings
      default: return Search
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'page': return 'bg-blue-100 text-blue-600'
      case 'skill': return 'bg-green-100 text-green-600'
      case 'course': return 'bg-purple-100 text-purple-600'
      case 'user': return 'bg-yellow-100 text-yellow-600'
      case 'community': return 'bg-pink-100 text-pink-600'
      case 'marketplace': return 'bg-orange-100 text-orange-600'
      case 'action': return 'bg-indigo-100 text-indigo-600'
      case 'setting': return 'bg-gray-100 text-gray-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Search
  }

  if (!isSearchOpen) return null

  const currentItems = getCurrentItems()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] overflow-hidden border">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <div className="flex items-center flex-1">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, courses, pages, or type a command..."
              className="flex-1 border-0 focus:ring-0 text-lg bg-transparent"
              autoFocus
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSearchOpen(false)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {[
            { mode: 'search', label: 'Search', icon: Search },
            { mode: 'recent', label: 'Recent', icon: Clock },
            { mode: 'browse', label: 'Browse', icon: Zap }
          ].map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => {
                setCurrentMode(mode as any)
                setSelectedIndex(0)
              }}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                currentMode === mode
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {mode === 'recent' && recentSearches.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {recentSearches.length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {currentItems.length > 0 ? (
            <div className="p-2">
              {currentMode === 'search' && searchQuery && (
                <div className="text-xs text-gray-500 px-3 py-2 mb-2">
                  {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                </div>
              )}

              {currentItems.map((item: any, index) => {
                const isSelected = index === selectedIndex

                if (item.type === 'suggestion') {
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                        <Hash className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )
                }

                if (item.type === 'recent') {
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">{item.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  )
                }

                // Regular search result
                const IconComponent = item.icon ? getIcon(item.icon) : getCategoryIcon(item.category)

                return (
                  <div
                    key={item.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectItem(item)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getCategoryColor(item.category)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {item.title}
                        </h3>
                        {item.category && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {item.category}
                          </Badge>
                        )}
                        {item.section && (
                          <Badge variant="secondary" className="text-xs">
                            {item.section}
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {item.description}
                        </p>
                      )}
                      {item.metadata && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          {item.metadata.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{item.metadata.rating}</span>
                            </div>
                          )}
                          {item.metadata.price && (
                            <span>${item.metadata.price}</span>
                          )}
                          {item.metadata.instructor && (
                            <span>by {item.metadata.instructor}</span>
                          )}
                          {item.metadata.members && (
                            <span>{item.metadata.members} members</span>
                          )}
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              {currentMode === 'search' && searchQuery ? (
                <>
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try searching for skills, courses, or pages
                  </p>
                </>
              ) : currentMode === 'recent' ? (
                <>
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent searches</h3>
                  <p className="text-gray-600">
                    Your recent searches will appear here
                  </p>
                </>
              ) : (
                <>
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
                  <p className="text-gray-600">
                    Common tasks and navigation shortcuts
                  </p>
                </>
              )}
            </div>
          )}

          {/* Recent Searches Actions */}
          {currentMode === 'recent' && recentSearches.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear all recent searches
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border font-mono">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border font-mono">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border font-mono">Tab</kbd>
                <span>Switch Mode</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border font-mono">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <span>⌘K to open</span>
          </div>
        </div>
      </div>
    </div>
  )
}