'use client'

import React from 'react'
import { GlobalSearchApp, SearchTrigger, usePageSearchContent } from './GlobalSearchApp'

// Example integration for the main layout
export function MainLayoutWithSearch({ children }: { children: React.ReactNode }) {
  return (
    <GlobalSearchApp>
      <div className="min-h-screen bg-gray-50">
        {/* Header with search */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">SkillCircle</h1>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-lg mx-8">
                <SearchTrigger
                  variant="default"
                  placeholder="Search skills, courses, or navigate anywhere..."
                />
              </div>

              {/* User menu */}
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700">
                  Notifications
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>
      </div>
    </GlobalSearchApp>
  )
}

// Example for skills page integration
export function SkillsPageWithSearch({ skills }: { skills: any[] }) {
  // Register skills as searchable content
  usePageSearchContent(
    skills.map(skill => ({
      id: `skill-${skill.id}`,
      title: skill.title,
      description: skill.description,
      category: 'skill' as const,
      url: `/skills/${skill.slug}`,
      icon: 'book',
      metadata: {
        rating: skill.rating,
        instructor: skill.instructor,
        tags: skill.tags
      },
      keywords: [skill.title, skill.category, ...skill.tags, skill.instructor],
      priority: skill.featured ? 8 : 6
    }))
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Browse Skills</h1>
        <SearchTrigger variant="compact" />
      </div>

      {/* Skills grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map(skill => (
          <div key={skill.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold">{skill.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// Example for community page integration
export function CommunityPageWithSearch({ groups, events }: { groups: any[], events: any[] }) {
  // Register community content as searchable
  usePageSearchContent([
    ...groups.map(group => ({
      id: `group-${group.id}`,
      title: group.name,
      description: group.description,
      category: 'community' as const,
      url: `/community/groups/${group.slug}`,
      icon: 'users',
      metadata: {
        members: group.memberCount,
        tags: group.tags
      },
      keywords: [group.name, 'group', 'community', ...group.tags],
      priority: 6
    })),
    ...events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      description: event.description,
      category: 'community' as const,
      url: `/community/events/${event.slug}`,
      icon: 'calendar',
      metadata: {
        date: event.date,
        tags: event.tags
      },
      keywords: [event.title, 'event', 'community', ...event.tags],
      priority: 5
    }))
  ])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Community</h1>
        <SearchTrigger variant="compact" />
      </div>

      {/* Community content */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Study Groups</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groups.map(group => (
              <div key={group.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium">{group.name}</h3>
                <p className="text-gray-600 text-sm">{group.memberCount} members</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-4">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow p-4">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-gray-600 text-sm">{event.date}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

// Usage instructions component
export function SearchUsageGuide() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 m-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">
        🔍 Global Search Features
      </h3>

      <div className="space-y-4 text-sm text-blue-800">
        <div>
          <h4 className="font-medium">Quick Access</h4>
          <p>Press <kbd className="px-2 py-1 bg-white rounded border">⌘K</kbd> (Mac) or <kbd className="px-2 py-1 bg-white rounded border">Ctrl+K</kbd> (Windows) to open search from anywhere</p>
        </div>

        <div>
          <h4 className="font-medium">Navigation</h4>
          <p>Search for any page, feature, or setting and navigate instantly. Try "settings", "community", or "create skill"</p>
        </div>

        <div>
          <h4 className="font-medium">Content Discovery</h4>
          <p>Find skills, courses, community groups, marketplace items, and more across the entire platform</p>
        </div>

        <div>
          <h4 className="font-medium">Smart Suggestions</h4>
          <p>Get personalized suggestions based on your search history and popular content</p>
        </div>

        <div>
          <h4 className="font-medium">Keyboard Navigation</h4>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><kbd className="px-1 py-0.5 bg-white rounded text-xs">↑↓</kbd> Navigate results</li>
            <li><kbd className="px-1 py-0.5 bg-white rounded text-xs">Enter</kbd> Select result</li>
            <li><kbd className="px-1 py-0.5 bg-white rounded text-xs">Tab</kbd> Switch between Search/Recent/Browse modes</li>
            <li><kbd className="px-1 py-0.5 bg-white rounded text-xs">Esc</kbd> Close search</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium">Search Categories</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <span className="bg-blue-100 px-2 py-1 rounded text-xs">Pages & Navigation</span>
            <span className="bg-green-100 px-2 py-1 rounded text-xs">Skills & Courses</span>
            <span className="bg-purple-100 px-2 py-1 rounded text-xs">Community</span>
            <span className="bg-orange-100 px-2 py-1 rounded text-xs">Marketplace</span>
            <span className="bg-indigo-100 px-2 py-1 rounded text-xs">Quick Actions</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">Settings</span>
          </div>
        </div>
      </div>
    </div>
  )
}