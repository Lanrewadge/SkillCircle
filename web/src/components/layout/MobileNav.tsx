'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Search,
  MessageCircle,
  Calendar,
  User,
  Home,
  CreditCard,
  BookOpen
} from 'lucide-react'

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/dashboard/browse', icon: Search, label: 'Browse' },
    { href: '/dashboard/learning', icon: BookOpen, label: 'Learning' },
    { href: '/dashboard/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
  ]

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 sm:hidden">
      <div className="grid grid-cols-6 py-2">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
              isActive(href)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Icon className={`h-5 w-5 mb-1 ${isActive(href) ? 'text-blue-600' : ''}`} />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}