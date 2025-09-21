'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export interface SearchResult {
  id: string
  title: string
  description?: string
  category: 'page' | 'skill' | 'course' | 'user' | 'community' | 'marketplace' | 'action' | 'setting'
  url: string
  icon: string
  metadata?: {
    rating?: number
    price?: number
    members?: number
    date?: string
    instructor?: string
    tags?: string[]
  }
  keywords: string[]
  priority: number
  section?: string
}

interface SearchContextType {
  isSearchOpen: boolean
  setIsSearchOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  recentSearches: string[]
  popularSearches: string[]
  performSearch: (query: string) => Promise<SearchResult[]>
  navigateToResult: (result: SearchResult) => void
  addToRecentSearches: (query: string) => void
  clearRecentSearches: () => void
  registerSearchableContent: (content: SearchResult[]) => void
  getSearchSuggestions: (query: string) => string[]
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState<string[]>([
    'React development',
    'Digital marketing',
    'UI/UX design',
    'JavaScript',
    'Python programming',
    'Data science',
    'Machine learning',
    'Web development'
  ])
  const [searchableContent, setSearchableContent] = useState<SearchResult[]>([])
  const router = useRouter()

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

  // Register searchable content from different parts of the app
  const registerSearchableContent = useCallback((content: SearchResult[]) => {
    setSearchableContent(prev => {
      const existing = new Set(prev.map(item => item.id))
      const newContent = content.filter(item => !existing.has(item.id))
      return [...prev, ...newContent]
    })
  }, [])

  // Initialize default searchable content
  useEffect(() => {
    const defaultContent: SearchResult[] = [
      // Main Pages
      {
        id: 'home',
        title: 'Home',
        description: 'Main dashboard and overview',
        category: 'page',
        url: '/',
        icon: 'home',
        keywords: ['home', 'dashboard', 'main', 'overview', 'start'],
        priority: 10,
        section: 'Navigation'
      },
      {
        id: 'skills-browse',
        title: 'Browse Skills',
        description: 'Explore available skills and courses',
        category: 'page',
        url: '/dashboard/skills/browse',
        icon: 'book',
        keywords: ['skills', 'browse', 'courses', 'learn', 'education', 'explore'],
        priority: 9,
        section: 'Learning'
      },
      {
        id: 'community',
        title: 'Community',
        description: 'Connect with learners and share knowledge',
        category: 'page',
        url: '/community',
        icon: 'users',
        keywords: ['community', 'social', 'groups', 'discussions', 'posts', 'network'],
        priority: 8,
        section: 'Social'
      },
      {
        id: 'marketplace',
        title: 'Marketplace',
        description: 'Browse and purchase courses and materials',
        category: 'page',
        url: '/marketplace',
        icon: 'shopping-bag',
        keywords: ['marketplace', 'shop', 'buy', 'courses', 'ebooks', 'templates', 'store'],
        priority: 8,
        section: 'Shopping'
      },
      {
        id: 'search',
        title: 'Advanced Search',
        description: 'Find anything on the platform',
        category: 'page',
        url: '/search',
        icon: 'search',
        keywords: ['search', 'find', 'filter', 'advanced', 'lookup'],
        priority: 7,
        section: 'Tools'
      },
      {
        id: 'messages',
        title: 'Messages',
        description: 'View and manage your conversations',
        category: 'page',
        url: '/dashboard/messages',
        icon: 'message-circle',
        keywords: ['messages', 'chat', 'conversations', 'inbox', 'communication'],
        priority: 7,
        section: 'Communication'
      },
      {
        id: 'profile',
        title: 'My Profile',
        description: 'View and edit your profile',
        category: 'page',
        url: '/dashboard/profile',
        icon: 'user',
        keywords: ['profile', 'account', 'bio', 'personal', 'me'],
        priority: 6,
        section: 'Account'
      },
      {
        id: 'settings',
        title: 'Settings',
        description: 'Manage your account preferences',
        category: 'page',
        url: '/dashboard/settings',
        icon: 'settings',
        keywords: ['settings', 'preferences', 'configuration', 'account', 'options'],
        priority: 6,
        section: 'Account'
      },

      // Quick Actions
      {
        id: 'create-skill',
        title: 'Create New Skill',
        description: 'Start teaching a new skill',
        category: 'action',
        url: '/dashboard/skills/create',
        icon: 'plus-circle',
        keywords: ['create', 'skill', 'teach', 'new', 'instructor', 'add'],
        priority: 5,
        section: 'Actions'
      },
      {
        id: 'join-community',
        title: 'Join Study Group',
        description: 'Find and join study groups',
        category: 'action',
        url: '/community/groups',
        icon: 'users',
        keywords: ['join', 'group', 'study', 'community', 'collaborate'],
        priority: 4,
        section: 'Actions'
      },
      {
        id: 'upload-content',
        title: 'Upload Content',
        description: 'Upload courses, ebooks, or templates to marketplace',
        category: 'action',
        url: '/marketplace/upload',
        icon: 'upload',
        keywords: ['upload', 'content', 'course', 'ebook', 'template', 'sell'],
        priority: 4,
        section: 'Actions'
      },

      // Settings & Features
      {
        id: 'language-settings',
        title: 'Language Settings',
        description: 'Change your language preferences',
        category: 'setting',
        url: '/dashboard/settings?tab=language',
        icon: 'globe',
        keywords: ['language', 'locale', 'translation', 'international', 'multilingual'],
        priority: 3,
        section: 'Settings'
      },
      {
        id: 'notification-settings',
        title: 'Notification Settings',
        description: 'Manage your notification preferences',
        category: 'setting',
        url: '/dashboard/settings?tab=notifications',
        icon: 'bell',
        keywords: ['notifications', 'alerts', 'email', 'push', 'preferences'],
        priority: 3,
        section: 'Settings'
      },
      {
        id: 'privacy-settings',
        title: 'Privacy Settings',
        description: 'Control your privacy and data settings',
        category: 'setting',
        url: '/dashboard/settings?tab=privacy',
        icon: 'shield',
        keywords: ['privacy', 'security', 'data', 'protection', 'visibility'],
        priority: 3,
        section: 'Settings'
      }
    ]

    registerSearchableContent(defaultContent)
  }, [registerSearchableContent])

  // Perform search
  const performSearch = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) {
      setSearchResults([])
      return []
    }

    const lowerQuery = query.toLowerCase()
    const results = searchableContent
      .filter(item => {
        const titleMatch = item.title.toLowerCase().includes(lowerQuery)
        const descMatch = item.description?.toLowerCase().includes(lowerQuery)
        const keywordMatch = item.keywords.some(keyword => keyword.includes(lowerQuery))
        const metadataMatch = item.metadata?.instructor?.toLowerCase().includes(lowerQuery)
        const tagMatch = item.metadata?.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))

        return titleMatch || descMatch || keywordMatch || metadataMatch || tagMatch
      })
      .sort((a, b) => {
        // Exact title matches first
        const aExactTitle = a.title.toLowerCase() === lowerQuery
        const bExactTitle = b.title.toLowerCase() === lowerQuery
        if (aExactTitle && !bExactTitle) return -1
        if (!aExactTitle && bExactTitle) return 1

        // Title starts with query
        const aTitleStarts = a.title.toLowerCase().startsWith(lowerQuery)
        const bTitleStarts = b.title.toLowerCase().startsWith(lowerQuery)
        if (aTitleStarts && !bTitleStarts) return -1
        if (!aTitleStarts && bTitleStarts) return 1

        // Category priority (pages > courses > actions > settings)
        const categoryPriority = { page: 4, course: 3, action: 2, setting: 1 }
        const aCatPriority = categoryPriority[a.category] || 0
        const bCatPriority = categoryPriority[b.category] || 0
        if (aCatPriority !== bCatPriority) return bCatPriority - aCatPriority

        // Finally by item priority
        return b.priority - a.priority
      })
      .slice(0, 12) // Limit results

    setSearchResults(results)
    return results
  }, [searchableContent])

  // Navigate to search result
  const navigateToResult = useCallback((result: SearchResult) => {
    addToRecentSearches(result.title)
    router.push(result.url)
    setIsSearchOpen(false)
    setSearchQuery('')
  }, [router])

  // Add to recent searches
  const addToRecentSearches = useCallback((query: string) => {
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 8)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('skillcircle-recent-searches', JSON.stringify(newRecentSearches))
  }, [recentSearches])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem('skillcircle-recent-searches')
  }, [])

  // Get search suggestions
  const getSearchSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) return popularSearches.slice(0, 5)

    const lowerQuery = query.toLowerCase()
    const suggestions = new Set<string>()

    // Add matching popular searches
    popularSearches.forEach(search => {
      if (search.toLowerCase().includes(lowerQuery)) {
        suggestions.add(search)
      }
    })

    // Add matching titles and keywords from searchable content
    searchableContent.forEach(item => {
      if (item.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(item.title)
      }
      item.keywords.forEach(keyword => {
        if (keyword.includes(lowerQuery) && keyword !== lowerQuery) {
          suggestions.add(keyword)
        }
      })
    })

    return Array.from(suggestions).slice(0, 8)
  }, [popularSearches, searchableContent])

  // Update search query and perform search
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, performSearch])

  const value: SearchContextType = {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    searchResults,
    recentSearches,
    popularSearches,
    performSearch,
    navigateToResult,
    addToRecentSearches,
    clearRecentSearches,
    registerSearchableContent,
    getSearchSuggestions
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

// Hook for registering searchable content in components
export function useRegisterSearchContent(content: SearchResult[]) {
  const { registerSearchableContent } = useSearch()

  useEffect(() => {
    registerSearchableContent(content)
  }, [content, registerSearchableContent])
}