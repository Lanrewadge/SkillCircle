'use client'

import { cn } from '@/lib/utils'
import { Loader2, BookOpen } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  return (
    <Loader2
      className={cn('animate-spin text-muted-foreground', sizeClasses[size], className)}
    />
  )
}

interface LoadingPageProps {
  message?: string
  submessage?: string
}

export function LoadingPage({
  message = 'Loading...',
  submessage = 'Please wait while we prepare your content'
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Logo with animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 bg-blue-600 rounded-2xl animate-ping opacity-20"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{message}</h2>
          <p className="text-muted-foreground">{submessage}</p>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>

        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('bg-card border border-border rounded-lg p-6', className)}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
        <div className="h-10 bg-muted rounded w-1/3"></div>
      </div>
    </div>
  )
}

interface LoadingGridProps {
  count?: number
  className?: string
}

export function LoadingGrid({ count = 6, className }: LoadingGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

interface LoadingListProps {
  count?: number
  className?: string
}

export function LoadingList({ count = 5, className }: LoadingListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-card border border-border rounded-lg">
          <div className="w-12 h-12 bg-muted rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
          </div>
          <div className="w-20 h-8 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingTable({ rows = 5, columns = 4, className }: LoadingTableProps) {
  return (
    <div className={cn('overflow-hidden rounded-lg border border-border', className)}>
      <div className="bg-muted/50 p-4 border-b border-border">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-4 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default {
  Spinner: LoadingSpinner,
  Page: LoadingPage,
  Card: LoadingCard,
  Grid: LoadingGrid,
  List: LoadingList,
  Table: LoadingTable
}