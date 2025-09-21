'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: 'page' | 'skill' | 'course' | 'user' | 'community' | 'marketplace' | 'action'
  url: string
  icon: React.ComponentType<any>
  metadata?: {
    rating?: number
    price?: number
    members?: number
    date?: string
    instructor?: string
  }
  keywords: string[]
  priority: number
}

const searchableContent: SearchResult[] = [
  // Pages & Navigation
  {
    id: 'home',
    title: 'Home',
    description: 'Main dashboard and overview',
    category: 'page',
    url: '/',
    icon: Home,
    keywords: ['home', 'dashboard', 'main', 'overview'],
    priority: 10
  },
  {
    id: 'skills-browse',
    title: 'Browse Skills',
    description: 'Explore available skills and courses',
    category: 'page',
    url: '/dashboard/skills/browse',
    icon: Book,
    keywords: ['skills', 'browse', 'courses', 'learn', 'education'],
    priority: 9
  },
  {
    id: 'community',
    title: 'Community',
    description: 'Connect with learners and share knowledge',
    category: 'page',
    url: '/community',
    icon: Users,
    keywords: ['community', 'social', 'groups', 'discussions', 'posts'],
    priority: 8
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    description: 'Browse and purchase courses and materials',
    category: 'page',
    url: '/marketplace',
    icon: ShoppingBag,
    keywords: ['marketplace', 'shop', 'buy', 'courses', 'ebooks', 'templates'],
    priority: 8
  },
  {
    id: 'search',
    title: 'Advanced Search',
    description: 'Find anything on the platform',
    category: 'page',
    url: '/search',
    icon: Search,
    keywords: ['search', 'find', 'filter', 'advanced'],
    priority: 7
  },
  {
    id: 'messages',
    title: 'Messages',
    description: 'View and manage your conversations',
    category: 'page',
    url: '/dashboard/messages',
    icon: MessageCircle,
    keywords: ['messages', 'chat', 'conversations', 'inbox'],
    priority: 7
  },
  {
    id: 'profile',
    title: 'My Profile',
    description: 'View and edit your profile',
    category: 'page',
    url: '/dashboard/profile',
    icon: User,
    keywords: ['profile', 'account', 'settings', 'bio'],
    priority: 6
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Manage your account preferences',
    category: 'page',
    url: '/dashboard/settings',
    icon: Settings,
    keywords: ['settings', 'preferences', 'configuration', 'account'],
    priority: 6
  },

  // Skills & Courses (Sample Data)
  {
    id: 'react-course',
    title: 'Complete React Development',
    description: 'Master React from basics to advanced concepts',
    category: 'course',
    url: '/skills/react-development',
    icon: Book,
    metadata: { rating: 4.8, price: 89.99, instructor: 'Sarah Johnson' },
    keywords: ['react', 'javascript', 'frontend', 'web development', 'components'],
    priority: 8
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Learn SEO, social media, and content strategy',
    category: 'course',
    url: '/skills/digital-marketing',
    icon: TrendingUp,
    metadata: { rating: 4.6, price: 79.99, instructor: 'Michael Chen' },
    keywords: ['marketing', 'seo', 'social media', 'advertising', 'strategy'],
    priority: 7
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design Fundamentals',
    description: 'Design beautiful user interfaces with Figma',
    category: 'course',
    url: '/skills/ui-ux-design',
    icon: FileText,
    metadata: { rating: 4.7, price: 69.99, instructor: 'Emily Rodriguez' },
    keywords: ['design', 'ui', 'ux', 'figma', 'interface', 'user experience'],
    priority: 7
  },

  // Community Content
  {
    id: 'react-study-group',
    title: 'React Developers Study Group',
    description: 'Weekly meetups for React enthusiasts',
    category: 'community',
    url: '/community/groups/react-developers',
    icon: Users,
    metadata: { members: 245 },
    keywords: ['react', 'study group', 'developers', 'meetup', 'community'],
    priority: 6
  },
  {
    id: 'design-showcase',
    title: 'Design Showcase Event',
    description: 'Monthly event to share design work',
    category: 'community',
    url: '/community/events/design-showcase',
    icon: Calendar,
    metadata: { date: '2024-02-15' },
    keywords: ['design', 'showcase', 'event', 'portfolio', 'share'],
    priority: 6
  },

  // Marketplace Items
  {
    id: 'figma-templates',
    title: 'Professional Figma Templates',
    description: 'Ready-to-use design templates for web and mobile',
    category: 'marketplace',
    url: '/marketplace/items/figma-templates',
    icon: FileText,
    metadata: { price: 29.99, rating: 4.9 },
    keywords: ['figma', 'templates', 'design', 'ui kit', 'mockups'],
    priority: 5
  },
  {
    id: 'coding-ebook',
    title: 'Advanced JavaScript Patterns',
    description: 'E-book covering advanced JS concepts and patterns',
    category: 'marketplace',
    url: '/marketplace/items/js-patterns-ebook',
    icon: Book,
    metadata: { price: 19.99, rating: 4.5 },
    keywords: ['javascript', 'ebook', 'patterns', 'advanced', 'programming'],
    priority: 5
  },

  // Quick Actions
  {
    id: 'create-skill',
    title: 'Create New Skill',
    description: 'Start teaching a new skill',
    category: 'action',
    url: '/dashboard/skills/create',
    icon: Star,
    keywords: ['create', 'skill', 'teach', 'new', 'instructor'],
    priority: 5
  },
  {
    id: 'join-community',
    title: 'Join Study Group',
    description: 'Find and join study groups',
    category: 'action',
    url: '/community/groups',
    icon: Users,
    keywords: ['join', 'group', 'study', 'community', 'collaborate'],
    priority: 4
  }
]

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { t } = useTranslation()

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('skillcircle-recent-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.warn('Failed to load recent searches:', error)
      }
    }
  }, [])

  // Search function
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const lowerQuery = searchQuery.toLowerCase()
    const searchResults = searchableContent
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery)
        const descMatch = item.description?.toLowerCase().includes(lowerQuery)
        const keywordMatch = item.keywords.some(keyword => keyword.includes(lowerQuery))
        const metadataMatch = item.metadata?.instructor?.toLowerCase().includes(lowerQuery)

        return titleMatch || descMatch || keywordMatch || metadataMatch
      })
      .sort((a, b) => {
        // Prioritize exact title matches
        const aExactTitle = a.title.toLowerCase() === lowerQuery
        const bExactTitle = b.title.toLowerCase() === lowerQuery
        if (aExactTitle && !bExactTitle) return -1
        if (!aExactTitle && bExactTitle) return 1

        // Then by title starts with query
        const aTitleStarts = a.title.toLowerCase().startsWith(lowerQuery)
        const bTitleStarts = b.title.toLowerCase().startsWith(lowerQuery)
        if (aTitleStarts && !bTitleStarts) return -1
        if (!aTitleStarts && bTitleStarts) return 1

        // Finally by priority
        return b.priority - a.priority
      })
      .slice(0, 8) // Limit results

    setResults(searchResults)
    setSelectedIndex(0)
  }, [])

  // Handle input change
  useEffect(() => {
    performSearch(query)
  }, [query, performSearch])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }

      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          setIsOpen(false)
          setQuery('')
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % results.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
          break
        case 'Enter':
          e.preventDefault()
          if (results[selectedIndex]) {
            navigateToResult(results[selectedIndex])
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const navigateToResult = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [result.title, ...recentSearches.filter(s => s !== result.title)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('skillcircle-recent-searches', JSON.stringify(newRecentSearches))

    // Navigate
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('skillcircle-recent-searches')
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
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative w-64 justify-start text-gray-500 bg-gray-50 hover:bg-gray-100"
      >
        <Search className="w-4 h-4 mr-2" />
        <span className="text-sm">Search anything...</span>
        <div className="absolute right-2 flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded">⌘</kbd>
          <kbd className="px-1.5 py-0.5 text-xs bg-gray-200 rounded">K</kbd>
        </div>
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 p-4">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills, courses, pages, or anything..."
            className="flex-1 border-0 focus:ring-0 text-lg"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="ml-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto">
          {query && results.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2 mb-2">
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </div>
              {results.map((result, index) => {
                const IconComponent = result.icon
                const CategoryIcon = getCategoryIcon(result.category)

                return (
                  <div
                    key={result.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => navigateToResult(result)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${getCategoryColor(result.category)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900 truncate">
                          {result.title}
                        </h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {result.category}
                        </Badge>
                      </div>
                      {result.description && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {result.description}
                        </p>
                      )}
                      {result.metadata && (
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          {result.metadata.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>{result.metadata.rating}</span>
                            </div>
                          )}
                          {result.metadata.price && (
                            <div className="flex items-center space-x-1">
                              <span>${result.metadata.price}</span>
                            </div>
                          )}
                          {result.metadata.instructor && (
                            <div className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{result.metadata.instructor}</span>
                            </div>
                          )}
                          {result.metadata.members && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{result.metadata.members} members</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                )
              })}
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500"
                >
                  Clear
                </Button>
              </div>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer"
                    onClick={() => setQuery(search)}
                  >
                    <Clock className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-700">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching for skills, courses, community groups, or pages
              </p>
            </div>
          )}

          {/* Tips */}
          {!query && recentSearches.length === 0 && (
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Tips</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Command className="w-3 h-3" />
                  <span>Use ⌘K to open search from anywhere</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="w-3 h-3" />
                  <span>Search for skills, courses, people, or pages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ArrowRight className="w-3 h-3" />
                  <span>Use arrow keys to navigate results</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white rounded border">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <span>Powered by SkillCircle Search</span>
          </div>
        </div>
      </div>
    </div>
  )
}