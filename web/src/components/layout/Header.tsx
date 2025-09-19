'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import SearchModal from '@/components/search/SearchModal'
import {
  Search,
  MessageCircle,
  Calendar,
  User,
  Settings,
  LogOut,
  BookOpen,
  CreditCard
} from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchModalOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillCircle</span>
            </Link>
          </div>

          {/* Search Button */}
          <div className="flex-1 max-w-lg mx-4 sm:mx-8">
            <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Search skills, teachers...</span>
              <span className="sm:hidden">Search...</span>
              <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/browse" className="flex items-center space-x-1">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Browse</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/learning" className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Learning</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/messages" className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden md:inline">Messages</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/calendar" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline">Calendar</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
              <Link href="/dashboard/payments" className="flex items-center space-x-1">
                <CreditCard className="w-4 h-4" />
                <span className="hidden lg:inline">Payments</span>
              </Link>
            </Button>

            {/* Theme Toggle */}
            <SimpleThemeToggle />

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-sm font-medium">
                  {user?.name?.split(' ')[0]}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-popover rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-border">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/payments"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payments & Billing
                </Link>
                <Link
                  href="/dashboard/learning"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Learning Dashboard
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  )
}