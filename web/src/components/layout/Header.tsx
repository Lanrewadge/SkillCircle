'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/AuthContext'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import SearchModal from '@/components/search/SearchModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  TrendingUp,
  ChevronDown,
  Bell,
  HelpCircle,
  Shield,
  GraduationCap,
  Briefcase,
  BarChart3,
  Globe
} from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
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
          <nav className="hidden lg:flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            </Button>

            {/* Skills Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <Search className="w-4 h-4" />
                  <span>Skills</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Explore Skills</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/browse" className="flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Browse All Skills
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/skills/programming" className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    Programming & Tech
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/skills/business" className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Business & Marketing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/skills/creative" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Creative Arts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/skills/academic" className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Academic Subjects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/skills/categories" className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    All Categories
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Learning Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Learning</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Learning</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/learning" className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Current Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/progress" className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Progress Tracking
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/certificates" className="flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Certificates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/goals" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Learning Goals
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/history" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Learning History
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/teachers" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Teachers</span>
              </Link>
            </Button>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/messages" className="flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Messages</span>
              </Link>
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message from Sarah</p>
                      <p className="text-xs text-muted-foreground">About your JavaScript lesson tomorrow</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Lesson reminder</p>
                      <p className="text-xs text-muted-foreground">Python basics starts in 1 hour</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-start space-x-3 p-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Achievement unlocked!</p>
                      <p className="text-xs text-muted-foreground">Completed 5 JavaScript lessons</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/notifications" className="w-full text-center">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden lg:block">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 hidden lg:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        user?.role === 'teacher'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/calendar" className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Calendar
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/reviews" className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Reviews & Ratings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/payments" className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payments & Billing
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-4 py-2 space-y-1 max-h-screen overflow-y-auto">
            {/* User Info - Mobile */}
            <div className="flex items-center space-x-3 py-3 border-b border-border">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profilePicture} alt={user?.name} />
                <AvatarFallback>
                  {user?.name ? getInitials(user.name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                  user?.role === 'teacher'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
              </div>
            </div>

            {/* Main Navigation - Mobile */}
            <div className="space-y-1 py-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-3 rounded-md text-sm hover:bg-accent transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              {/* Skills Section */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Skills & Learning
                </div>
                <Link
                  href="/dashboard/browse"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  <span>Browse All Skills</span>
                </Link>
                <Link
                  href="/dashboard/skills/programming"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Globe className="w-4 h-4" />
                  <span>Programming & Tech</span>
                </Link>
                <Link
                  href="/dashboard/skills/business"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Business & Marketing</span>
                </Link>
                <Link
                  href="/dashboard/learning"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Learning</span>
                </Link>
                <Link
                  href="/dashboard/progress"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Progress Tracking</span>
                </Link>
              </div>

              {/* Communication */}
              <div className="space-y-1 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Communication
                </div>
                <Link
                  href="/dashboard/teachers"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4" />
                  <span>Find Teachers</span>
                </Link>
                <Link
                  href="/dashboard/messages"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </Link>
              </div>
            </div>

            {/* Account Section - Mobile */}
            <div className="space-y-1 py-2 border-t border-border">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Account
              </div>
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/dashboard/calendar"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </Link>

              <Link
                href="/dashboard/payments"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <CreditCard className="w-4 h-4" />
                <span>Payments & Billing</span>
              </Link>

              <Link
                href="/dashboard/reviews"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Star className="w-4 h-4" />
                <span>Reviews & Ratings</span>
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </Link>

              <Link
                href="/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent ml-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help & Support</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent w-full text-left ml-2 text-red-600"
              >
                <LogOut className="w-4 h-4" />
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