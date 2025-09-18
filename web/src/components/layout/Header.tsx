'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/authStore'
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

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SkillCircle</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 sm:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search skills, teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </form>
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

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
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
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/payments"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <CreditCard className="w-4 h-4 mr-3" />
                  Payments & Billing
                </Link>
                <Link
                  href="/dashboard/learning"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <BookOpen className="w-4 h-4 mr-3" />
                  Learning Dashboard
                </Link>
                <Link
                  href="/dashboard/notifications"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}