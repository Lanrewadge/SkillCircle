import { useCallback, useEffect, useState } from 'react'
import { useSearch } from '@/contexts/SearchContext'

interface SearchAnalytics {
  totalSearches: number
  uniqueQueries: number
  averageQueryLength: number
  topQueries: Array<{ query: string; count: number }>
  noResultQueries: string[]
  popularCategories: Array<{ category: string; count: number }>
  clickThroughRate: number
  searchSessions: SearchSession[]
}

interface SearchSession {
  id: string
  queries: string[]
  results: number[]
  selections: string[]
  timestamp: Date
  duration: number
}

const STORAGE_KEY = 'skillcircle-search-analytics'
const SESSION_TIMEOUT = 30 * 60 * 1000 // 30 minutes

export function useSearchAnalytics() {
  const { searchQuery, searchResults } = useSearch()
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    uniqueQueries: 0,
    averageQueryLength: 0,
    topQueries: [],
    noResultQueries: [],
    popularCategories: [],
    clickThroughRate: 0,
    searchSessions: []
  })
  const [currentSession, setCurrentSession] = useState<SearchSession | null>(null)

  // Load analytics from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setAnalytics({
          ...data,
          searchSessions: data.searchSessions.map((s: any) => ({
            ...s,
            timestamp: new Date(s.timestamp)
          }))
        })
      } catch (error) {
        console.warn('Failed to load search analytics:', error)
      }
    }
  }, [])

  // Save analytics to localStorage
  const saveAnalytics = useCallback((newAnalytics: SearchAnalytics) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAnalytics))
      setAnalytics(newAnalytics)
    } catch (error) {
      console.warn('Failed to save search analytics:', error)
    }
  }, [])

  // Start new search session
  const startSession = useCallback(() => {
    const session: SearchSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      queries: [],
      results: [],
      selections: [],
      timestamp: new Date(),
      duration: 0
    }
    setCurrentSession(session)
    return session
  }, [])

  // End current search session
  const endSession = useCallback(() => {
    if (currentSession) {
      const duration = Date.now() - currentSession.timestamp.getTime()
      const completedSession = { ...currentSession, duration }

      setAnalytics(prev => {
        const newAnalytics = {
          ...prev,
          searchSessions: [...prev.searchSessions, completedSession]
        }
        saveAnalytics(newAnalytics)
        return newAnalytics
      })

      setCurrentSession(null)
    }
  }, [currentSession, saveAnalytics])

  // Track search query
  const trackSearch = useCallback((query: string, resultCount: number) => {
    if (!query.trim()) return

    // Update current session
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        queries: [...prev.queries, query],
        results: [...prev.results, resultCount]
      } : null)
    } else {
      startSession()
    }

    // Update analytics
    setAnalytics(prev => {
      const newAnalytics = { ...prev }

      // Increment total searches
      newAnalytics.totalSearches += 1

      // Update unique queries
      const queryLower = query.toLowerCase()
      const existingQuery = newAnalytics.topQueries.find(q => q.query === queryLower)
      if (existingQuery) {
        existingQuery.count += 1
      } else {
        newAnalytics.topQueries.push({ query: queryLower, count: 1 })
        newAnalytics.uniqueQueries += 1
      }

      // Sort top queries
      newAnalytics.topQueries.sort((a, b) => b.count - a.count)
      newAnalytics.topQueries = newAnalytics.topQueries.slice(0, 20)

      // Track no-result queries
      if (resultCount === 0 && !newAnalytics.noResultQueries.includes(queryLower)) {
        newAnalytics.noResultQueries.push(queryLower)
        newAnalytics.noResultQueries = newAnalytics.noResultQueries.slice(-50) // Keep last 50
      }

      // Calculate average query length
      const totalLength = newAnalytics.topQueries.reduce((sum, q) => sum + (q.query.length * q.count), 0)
      newAnalytics.averageQueryLength = totalLength / newAnalytics.totalSearches

      saveAnalytics(newAnalytics)
      return newAnalytics
    })
  }, [currentSession, startSession, saveAnalytics])

  // Track result selection
  const trackSelection = useCallback((resultId: string, category: string) => {
    // Update current session
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        selections: [...prev.selections, resultId]
      } : null)
    }

    // Update analytics
    setAnalytics(prev => {
      const newAnalytics = { ...prev }

      // Update popular categories
      const existingCategory = newAnalytics.popularCategories.find(c => c.category === category)
      if (existingCategory) {
        existingCategory.count += 1
      } else {
        newAnalytics.popularCategories.push({ category, count: 1 })
      }

      // Sort popular categories
      newAnalytics.popularCategories.sort((a, b) => b.count - a.count)
      newAnalytics.popularCategories = newAnalytics.popularCategories.slice(0, 10)

      // Calculate click-through rate
      const totalSelections = newAnalytics.searchSessions.reduce(
        (sum, session) => sum + session.selections.length, 0
      ) + 1 // +1 for current selection
      newAnalytics.clickThroughRate = (totalSelections / newAnalytics.totalSearches) * 100

      saveAnalytics(newAnalytics)
      return newAnalytics
    })
  }, [currentSession, saveAnalytics])

  // Get search suggestions based on analytics
  const getSmartSuggestions = useCallback((query: string): string[] => {
    if (!query.trim()) {
      return analytics.topQueries.slice(0, 5).map(q => q.query)
    }

    const queryLower = query.toLowerCase()
    return analytics.topQueries
      .filter(q => q.query.includes(queryLower) && q.query !== queryLower)
      .slice(0, 8)
      .map(q => q.query)
  }, [analytics.topQueries])

  // Get trending searches
  const getTrendingSearches = useCallback((timeframe: 'hour' | 'day' | 'week' = 'day') => {
    const now = Date.now()
    const timeframes = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000
    }

    const cutoff = now - timeframes[timeframe]
    const recentSessions = analytics.searchSessions.filter(
      session => session.timestamp.getTime() > cutoff
    )

    const queryCount: Record<string, number> = {}
    recentSessions.forEach(session => {
      session.queries.forEach(query => {
        const queryLower = query.toLowerCase()
        queryCount[queryLower] = (queryCount[queryLower] || 0) + 1
      })
    })

    return Object.entries(queryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }))
  }, [analytics.searchSessions])

  // Clean old data
  const cleanOldData = useCallback(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)

    setAnalytics(prev => {
      const newAnalytics = {
        ...prev,
        searchSessions: prev.searchSessions.filter(
          session => session.timestamp.getTime() > thirtyDaysAgo
        )
      }
      saveAnalytics(newAnalytics)
      return newAnalytics
    })
  }, [saveAnalytics])

  // Auto-track search queries
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        trackSearch(searchQuery, searchResults.length)
      }, 500) // Debounce search tracking

      return () => clearTimeout(timeoutId)
    }
  }, [searchQuery, searchResults.length, trackSearch])

  // Auto-end session on inactivity
  useEffect(() => {
    if (currentSession) {
      const timeoutId = setTimeout(() => {
        endSession()
      }, SESSION_TIMEOUT)

      return () => clearTimeout(timeoutId)
    }
  }, [currentSession, endSession])

  // Clean old data periodically
  useEffect(() => {
    const interval = setInterval(cleanOldData, 24 * 60 * 60 * 1000) // Daily
    return () => clearInterval(interval)
  }, [cleanOldData])

  return {
    analytics,
    trackSearch,
    trackSelection,
    getSmartSuggestions,
    getTrendingSearches,
    startSession,
    endSession,
    currentSession,
    cleanOldData
  }
}

// Hook for search performance monitoring
export function useSearchPerformance() {
  const [metrics, setMetrics] = useState({
    averageSearchTime: 0,
    slowQueries: [] as Array<{ query: string; time: number }>,
    errorRate: 0,
    totalErrors: 0
  })

  const trackSearchPerformance = useCallback((query: string, startTime: number, endTime: number, hasError: boolean = false) => {
    const searchTime = endTime - startTime

    setMetrics(prev => {
      const newMetrics = { ...prev }

      // Update average search time
      newMetrics.averageSearchTime = (newMetrics.averageSearchTime + searchTime) / 2

      // Track slow queries (>1 second)
      if (searchTime > 1000) {
        newMetrics.slowQueries.push({ query, time: searchTime })
        newMetrics.slowQueries = newMetrics.slowQueries.slice(-20) // Keep last 20
      }

      // Track errors
      if (hasError) {
        newMetrics.totalErrors += 1
      }

      return newMetrics
    })
  }, [])

  return {
    metrics,
    trackSearchPerformance
  }
}