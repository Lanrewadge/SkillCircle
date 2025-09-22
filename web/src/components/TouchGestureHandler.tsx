'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

interface TouchGestureProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onDoubleTap?: () => void
  onLongPress?: () => void
  className?: string
  enablePullToRefresh?: boolean
  onPullToRefresh?: () => void
}

export default function TouchGestureHandler({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  className = '',
  enablePullToRefresh = false,
  onPullToRefresh
}: TouchGestureProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [lastTap, setLastTap] = useState(0)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const pullProgress = useTransform(y, [0, 100], [0, 1])
  const pullOpacity = useTransform(y, [0, 100], [0, 1])

  const handlePanStart = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    // Start long press timer
    const timer = setTimeout(() => {
      onLongPress?.()
      // Provide haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
    }, 500)
    setLongPressTimer(timer)
  }

  const handlePan = (event: any, info: PanInfo) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    x.set(info.offset.x)
    y.set(info.offset.y)

    // Pull to refresh logic
    if (enablePullToRefresh && info.offset.y > 0 && window.scrollY === 0) {
      setIsPulling(true)
    }
  }

  const handlePanEnd = (event: any, info: PanInfo) => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }

    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 500

    // Reset position
    x.set(0)
    y.set(0)

    // Pull to refresh
    if (enablePullToRefresh && isPulling && offset.y > 80) {
      setIsRefreshing(true)
      onPullToRefresh?.()
      setTimeout(() => {
        setIsRefreshing(false)
        setIsPulling(false)
      }, 2000)
      return
    }
    setIsPulling(false)

    // Determine swipe direction
    if (Math.abs(offset.x) > Math.abs(offset.y)) {
      // Horizontal swipe
      if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
        if (offset.x > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > velocityThreshold) {
        if (offset.y > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
  }

  const handleTap = () => {
    const now = Date.now()
    const timeDiff = now - lastTap

    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      onDoubleTap?.()
      setLastTap(0)
    } else {
      setLastTap(now)
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [longPressTimer])

  return (
    <div className={`relative ${className}`}>
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <motion.div
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-blue-600/20 backdrop-blur-sm"
          style={{
            opacity: pullOpacity,
            y: useTransform(y, [0, 100], [-60, 0])
          }}
        >
          <motion.div
            className="flex items-center gap-2 text-white"
            animate={isRefreshing ? { rotate: 360 } : {}}
            transition={isRefreshing ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
          >
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
            <span className="text-sm font-medium">
              {isRefreshing ? 'Refreshing...' : isPulling ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </motion.div>
        </motion.div>
      )}

      {/* Gesture handler */}
      <motion.div
        className="w-full h-full"
        style={{ x, y }}
        onPanStart={handlePanStart}
        onPan={handlePan}
        onPanEnd={handlePanEnd}
        onTap={handleTap}
        drag={true}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.2}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// Mobile-specific responsive utilities
export function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
      setOrientation(height > width ? 'portrait' : 'landscape')
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    window.addEventListener('orientationchange', checkDevice)

    return () => {
      window.removeEventListener('resize', checkDevice)
      window.removeEventListener('orientationchange', checkDevice)
    }
  }, [])

  return { isMobile, isTablet, orientation }
}

// Haptic feedback utility
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }
  }

  return { triggerHaptic }
}

// Mobile-optimized card component
interface MobileCardProps {
  children: React.ReactNode
  onTap?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
}

export function MobileCard({ children, onTap, onSwipeLeft, onSwipeRight, className = '' }: MobileCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const { triggerHaptic } = useHapticFeedback()

  return (
    <TouchGestureHandler
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      onDoubleTap={() => {
        triggerHaptic('medium')
        onTap?.()
      }}
      className={className}
    >
      <motion.div
        className="w-full h-full"
        whileTap={{ scale: 0.98 }}
        onTapStart={() => {
          setIsPressed(true)
          triggerHaptic('light')
        }}
        onTap={() => {
          setIsPressed(false)
          onTap?.()
        }}
        onTapCancel={() => setIsPressed(false)}
        style={{
          filter: isPressed ? 'brightness(0.9)' : 'brightness(1)'
        }}
      >
        {children}
      </motion.div>
    </TouchGestureHandler>
  )
}

// Mobile navigation swipe handler
interface SwipeNavigationProps {
  children: React.ReactNode
  onNavigateBack?: () => void
  onNavigateForward?: () => void
  className?: string
}

export function SwipeNavigation({ children, onNavigateBack, onNavigateForward, className = '' }: SwipeNavigationProps) {
  const { isMobile } = useMobileDetection()
  const [swipeIndicator, setSwipeIndicator] = useState<'left' | 'right' | null>(null)

  if (!isMobile) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={`relative ${className}`}>
      {/* Swipe indicators */}
      {swipeIndicator && (
        <motion.div
          className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ${
            swipeIndicator === 'left' ? 'left-4' : 'right-4'
          }`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <div className={`w-6 h-6 text-white ${swipeIndicator === 'left' ? 'rotate-180' : ''}`}>
            →
          </div>
        </motion.div>
      )}

      <TouchGestureHandler
        onSwipeLeft={() => {
          setSwipeIndicator('left')
          setTimeout(() => setSwipeIndicator(null), 500)
          onNavigateForward?.()
        }}
        onSwipeRight={() => {
          setSwipeIndicator('right')
          setTimeout(() => setSwipeIndicator(null), 500)
          onNavigateBack?.()
        }}
        className="w-full h-full"
      >
        {children}
      </TouchGestureHandler>
    </div>
  )
}