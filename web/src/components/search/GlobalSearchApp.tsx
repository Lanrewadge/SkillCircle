'use client'

import React, { useEffect } from 'react'
import { SearchProvider, useRegisterSearchContent, useSearch } from '@/contexts/SearchContext'
import { SearchCommandPalette } from './SearchCommandPalette'
import { SearchTrigger, FloatingSearchButton } from './SearchTrigger'
import { useSearchAnalytics } from '@/hooks/useSearchAnalytics'

// Main search app component that wraps everything
export function GlobalSearchApp({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <SearchContent>{children}</SearchContent>
    </SearchProvider>
  )
}

// Internal component that has access to search context
function SearchContent({ children }: { children: React.ReactNode }) {
  const { trackSelection } = useSearchAnalytics()

  // Register dynamic content from different parts of the app
  useRegisterSearchContent([
    // Skills and courses would be dynamically loaded here
    {
      id: 'react-course-dynamic',
      title: 'React Hooks Mastery',
      description: 'Deep dive into React Hooks and state management',
      category: 'course',
      url: '/skills/react-hooks',
      icon: 'book',
      metadata: {
        rating: 4.9,
        price: 99.99,
        instructor: 'Alex Thompson',
        tags: ['react', 'hooks', 'state-management', 'frontend']
      },
      keywords: ['react', 'hooks', 'state', 'management', 'frontend', 'components'],
      priority: 8
    },
    {
      id: 'design-system-course',
      title: 'Building Design Systems',
      description: 'Create scalable design systems with Figma and code',
      category: 'course',
      url: '/skills/design-systems',
      icon: 'file-text',
      metadata: {
        rating: 4.7,
        price: 129.99,
        instructor: 'Sarah Design',
        tags: ['design-system', 'figma', 'components', 'ui']
      },
      keywords: ['design', 'system', 'figma', 'components', 'ui', 'library'],
      priority: 7
    },
    {
      id: 'machine-learning-fundamentals',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to ML algorithms and practical applications',
      category: 'course',
      url: '/skills/ml-fundamentals',
      icon: 'trending-up',
      metadata: {
        rating: 4.6,
        price: 149.99,
        instructor: 'Dr. AI Researcher',
        tags: ['machine-learning', 'ai', 'algorithms', 'python']
      },
      keywords: ['machine', 'learning', 'ai', 'algorithms', 'python', 'data'],
      priority: 8
    },
    // Community groups
    {
      id: 'javascript-developers',
      title: 'JavaScript Developers Community',
      description: 'Connect with JS developers worldwide',
      category: 'community',
      url: '/community/groups/javascript-developers',
      icon: 'users',
      metadata: { members: 1250 },
      keywords: ['javascript', 'developers', 'community', 'networking', 'js'],
      priority: 6
    },
    {
      id: 'ux-designers-group',
      title: 'UX Designers Network',
      description: 'Share designs and get feedback from UX professionals',
      category: 'community',
      url: '/community/groups/ux-designers',
      icon: 'users',
      metadata: { members: 890 },
      keywords: ['ux', 'design', 'user', 'experience', 'feedback', 'portfolio'],
      priority: 6
    },
    // Marketplace items
    {
      id: 'figma-ui-kit',
      title: 'Complete Mobile UI Kit',
      description: '200+ mobile screens and components for iOS and Android',
      category: 'marketplace',
      url: '/marketplace/items/mobile-ui-kit',
      icon: 'shopping-bag',
      metadata: {
        price: 49.99,
        rating: 4.8,
        tags: ['figma', 'mobile', 'ui-kit', 'ios', 'android']
      },
      keywords: ['mobile', 'ui', 'kit', 'figma', 'ios', 'android', 'screens'],
      priority: 5
    },
    {
      id: 'react-templates',
      title: 'Professional React Templates',
      description: 'Production-ready React templates for SaaS and e-commerce',
      category: 'marketplace',
      url: '/marketplace/items/react-templates',
      icon: 'file-text',
      metadata: {
        price: 79.99,
        rating: 4.9,
        tags: ['react', 'templates', 'saas', 'ecommerce']
      },
      keywords: ['react', 'templates', 'saas', 'ecommerce', 'nextjs', 'tailwind'],
      priority: 5
    },
    // More actions
    {
      id: 'schedule-session',
      title: 'Schedule Learning Session',
      description: 'Book a 1-on-1 session with an expert',
      category: 'action',
      url: '/dashboard/sessions/schedule',
      icon: 'calendar',
      keywords: ['schedule', 'session', 'learning', '1-on-1', 'expert', 'mentor'],
      priority: 4
    },
    {
      id: 'join-webinar',
      title: 'Join Live Webinar',
      description: 'Participate in live learning sessions',
      category: 'action',
      url: '/community/webinars',
      icon: 'users',
      keywords: ['webinar', 'live', 'session', 'learning', 'participate'],
      priority: 4
    }
  ])

  return (
    <>
      {children}
      <SearchCommandPalette />
      <FloatingSearchButton />
    </>
  )
}

// Search integration for specific pages
export function usePageSearchContent(pageContent: any[]) {
  useRegisterSearchContent(pageContent)
}

// Search trigger components for different contexts
export { SearchTrigger, FloatingSearchButton }

// Hook to programmatically open search
export function useGlobalSearch() {
  const { setIsSearchOpen, setSearchQuery } = useSearch()

  const openSearch = (initialQuery?: string) => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
    }
    setIsSearchOpen(true)
  }

  return { openSearch }
}

// Search results preview component
export function SearchResultsPreview() {
  const { searchResults, searchQuery, setIsSearchOpen } = useSearch()

  if (!searchQuery || searchResults.length === 0) return null

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      {searchResults.slice(0, 5).map((result) => (
        <div
          key={result.id}
          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          onClick={() => {
            // Handle result selection
            window.location.href = result.url
          }}
        >
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <span className="text-blue-600 text-sm">📄</span>
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm">{result.title}</h4>
            {result.description && (
              <p className="text-xs text-gray-600 truncate">{result.description}</p>
            )}
          </div>
        </div>
      ))}

      {searchResults.length > 5 && (
        <div className="p-3 text-center border-t border-gray-100">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="text-blue-600 text-sm hover:text-blue-700"
          >
            View all {searchResults.length} results
          </button>
        </div>
      )}
    </div>
  )
}

// Export search context for direct access
export { useSearch } from '@/contexts/SearchContext'