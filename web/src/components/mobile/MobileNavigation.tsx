'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  Users,
  ShoppingBag,
  MessageCircle,
  User,
  Menu,
  X,
  BookOpen,
  Brain,
  TrendingUp,
  Star
} from 'lucide-react'

interface MobileNavigationProps {
  user?: {
    name: string
    avatar?: string
    notifications?: number
  }
}

export function MobileNavigation({ user }: MobileNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const mainNavItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/community', icon: Users, label: 'Community' },
    { href: '/marketplace', icon: ShoppingBag, label: 'Shop' },
    { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages', badge: user?.notifications }
  ]

  const menuItems = [
    { href: '/dashboard', icon: User, label: 'Dashboard' },
    { href: '/dashboard/skills/browse', icon: BookOpen, label: 'Browse Skills' },
    { href: '/dashboard/ai-recommendations', icon: Brain, label: 'AI Recommendations' },
    { href: '/dashboard/analytics', icon: TrendingUp, label: 'Analytics' },
    { href: '/dashboard/achievements', icon: Star, label: 'Achievements' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex items-center justify-around h-16">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full relative ${
                isActive(item.href)
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <div className="absolute top-1 right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-white p-3 rounded-full shadow-lg border border-gray-200"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Side Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl">
            <div className="p-6 border-b border-gray-200">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
                    ) : (
                      <User className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">Welcome back!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    className="block w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/dashboard/skills/create"
                  className="p-3 bg-green-50 rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <span className="text-xs text-green-700 font-medium">Teach Skill</span>
                </Link>
                <Link
                  href="/marketplace/upload"
                  className="p-3 bg-purple-50 rounded-lg text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-purple-700 font-medium">Sell Content</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for bottom navigation */}
      <div className="h-16 md:hidden" />
    </>
  )
}