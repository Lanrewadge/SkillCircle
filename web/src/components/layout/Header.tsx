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
  CreditCard,
  Menu,
  X,
  Home,
  Users,
  Star,
  TrendingUp
} from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/browse" className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Browse Skills</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/learning" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>My Learning</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/teachers" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Find Teachers</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/messages" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/progress" className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Progress</span>
              </Link>
            </Button>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <SimpleThemeToggle />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* User Menu - Desktop */}
            <div className="hidden lg:block relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">
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
                  href="/dashboard/calendar"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Calendar
                </Link>
                <Link
                  href="/dashboard/reviews"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <Star className="w-4 h-4 mr-3" />
                  Reviews
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <hr className="my-1 border-border" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-2 space-y-1">
            {/* User Info - Mobile */}
            <div className="flex items-center space-x-3 py-3 border-b border-border">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Links - Mobile */}
            <div className="space-y-1 py-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/dashboard/browse"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Search className="w-5 h-5" />
                <span>Browse Skills</span>
              </Link>

              <Link
                href="/dashboard/learning"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BookOpen className="w-5 h-5" />
                <span>My Learning</span>
              </Link>

              <Link
                href="/dashboard/teachers"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                <span>Find Teachers</span>
              </Link>

              <Link
                href="/dashboard/messages"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </Link>

              <Link
                href="/dashboard/progress"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="w-5 h-5" />
                <span>Progress</span>
              </Link>
            </div>

            {/* Account Actions - Mobile */}
            <div className="space-y-1 py-2 border-t border-border">
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>

              <Link
                href="/dashboard/payments"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-5 h-5" />
                <span>Payments</span>
              </Link>

              <Link
                href="/dashboard/calendar"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-5 h-5" />
                <span>Calendar</span>
              </Link>

              <Link
                href="/dashboard/reviews"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="w-5 h-5" />
                <span>Reviews</span>
              </Link>

              <Link
                href="/dashboard/notifications"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  )
}