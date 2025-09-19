import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`

  return date.toLocaleDateString()
}

// Format duration in minutes to human readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) return `${hours}h`
  return `${hours}h ${remainingMinutes}m`
}

// Generate avatar fallback from name
export function getAvatarFallback(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), wait)
    }
  }
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Truncate text with ellipsis
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Format file size
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'

  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate color from string (for avatars)
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  const hue = hash % 360
  return `hsl(${hue}, 70%, 50%)`
}

// Sleep function for async/await
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    return true
  }
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// Get skill level color
export function getSkillLevelColor(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
    case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
    case 'advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
    case 'expert': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900'
    default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
  }
}

// Get status color
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'active': case 'online': case 'available': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900'
    case 'pending': case 'waiting': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900'
    case 'busy': case 'occupied': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900'
    case 'offline': case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900'
    case 'error': case 'failed': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900'
    default: return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900'
  }
}