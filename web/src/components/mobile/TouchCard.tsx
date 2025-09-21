'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface TouchCardProps {
  children: React.ReactNode
  className?: string
  onTap?: () => void
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  swipeThreshold?: number
  longPressDelay?: number
  hapticFeedback?: boolean
}

interface TouchState {
  startX: number
  startY: number
  startTime: number
  isPressed: boolean
  hasMoved: boolean
}

export function TouchCard({
  children,
  className = '',
  onTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 50,
  longPressDelay = 500,
  hapticFeedback = false
}: TouchCardProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPressed, setIsLongPressed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isPressed: false,
    hasMoved: false
  })
  const longPressTimer = useRef<NodeJS.Timeout>()

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (hapticFeedback && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isPressed: true,
      hasMoved: false
    }

    setIsPressed(true)

    // Start long press timer
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (touchState.current.isPressed && !touchState.current.hasMoved) {
          setIsLongPressed(true)
          triggerHaptic('medium')
          onLongPress()
        }
      }, longPressDelay)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchState.current.isPressed) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchState.current.startX)
    const deltaY = Math.abs(touch.clientY - touchState.current.startY)

    // Mark as moved if threshold is exceeded
    if (deltaX > 10 || deltaY > 10) {
      touchState.current.hasMoved = true
      setIsPressed(false)
      setIsLongPressed(false)

      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.current.isPressed) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchState.current.startX
    const deltaY = touch.clientY - touchState.current.startY
    const deltaTime = Date.now() - touchState.current.startTime

    // Clear timers
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    // Reset states
    setIsPressed(false)
    setIsLongPressed(false)
    touchState.current.isPressed = false

    // Handle different gestures
    if (!touchState.current.hasMoved && !isLongPressed) {
      // Quick tap
      if (deltaTime < 200 && onTap) {
        triggerHaptic('light')
        onTap()
      }
    } else if (touchState.current.hasMoved) {
      // Swipe gestures
      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      if (absDeltaX > absDeltaY && absDeltaX > swipeThreshold) {
        if (deltaX > 0 && onSwipeRight) {
          triggerHaptic('light')
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          triggerHaptic('light')
          onSwipeLeft()
        }
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    // Handle mouse events for desktop testing
    const mouseEvent = e as any
    touchState.current = {
      startX: mouseEvent.clientX,
      startY: mouseEvent.clientY,
      startTime: Date.now(),
      isPressed: true,
      hasMoved: false
    }

    setIsPressed(true)

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (touchState.current.isPressed && !touchState.current.hasMoved) {
          setIsLongPressed(true)
          onLongPress()
        }
      }, longPressDelay)
    }
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchState.current.isPressed) return

    const deltaTime = Date.now() - touchState.current.startTime

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    setIsPressed(false)
    setIsLongPressed(false)
    touchState.current.isPressed = false

    if (!touchState.current.hasMoved && !isLongPressed && deltaTime < 200 && onTap) {
      onTap()
    }
  }

  const handleMouseLeave = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
    setIsPressed(false)
    setIsLongPressed(false)
    touchState.current.isPressed = false
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  return (
    <Card
      ref={cardRef}
      className={`
        touch-manipulation
        transition-all duration-150 ease-out
        ${isPressed ? 'scale-95 shadow-sm' : 'scale-100 shadow-md'}
        ${isLongPressed ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${className}
      `}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        WebkitTapHighlightColor: 'transparent',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <CardContent className="p-0">
        {children}
      </CardContent>
    </Card>
  )
}

// Higher-order component for making any component touch-friendly
export function withTouchGestures<P extends object>(
  Component: React.ComponentType<P>,
  touchOptions?: Partial<TouchCardProps>
) {
  return React.forwardRef<any, P & Partial<TouchCardProps>>((props, ref) => {
    const {
      onTap,
      onLongPress,
      onSwipeLeft,
      onSwipeRight,
      ...componentProps
    } = props

    return (
      <TouchCard
        onTap={onTap}
        onLongPress={onLongPress}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        {...touchOptions}
      >
        <Component {...(componentProps as P)} ref={ref} />
      </TouchCard>
    )
  })
}

// Utility hook for touch gestures
export function useTouchGestures({
  onTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 50,
  longPressDelay = 500
}: Partial<TouchCardProps> = {}) {
  const [isPressed, setIsPressed] = useState(false)
  const touchState = useRef<TouchState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isPressed: false,
    hasMoved: false
  })
  const longPressTimer = useRef<NodeJS.Timeout>()

  const touchHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0]
      touchState.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        isPressed: true,
        hasMoved: false
      }

      setIsPressed(true)

      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          if (touchState.current.isPressed && !touchState.current.hasMoved) {
            onLongPress()
          }
        }, longPressDelay)
      }
    },

    onTouchMove: (e: React.TouchEvent) => {
      if (!touchState.current.isPressed) return

      const touch = e.touches[0]
      const deltaX = Math.abs(touch.clientX - touchState.current.startX)
      const deltaY = Math.abs(touch.clientY - touchState.current.startY)

      if (deltaX > 10 || deltaY > 10) {
        touchState.current.hasMoved = true
        setIsPressed(false)

        if (longPressTimer.current) {
          clearTimeout(longPressTimer.current)
        }
      }
    },

    onTouchEnd: (e: React.TouchEvent) => {
      if (!touchState.current.isPressed) return

      const touch = e.changedTouches[0]
      const deltaX = touch.clientX - touchState.current.startX
      const deltaTime = Date.now() - touchState.current.startTime

      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }

      setIsPressed(false)
      touchState.current.isPressed = false

      if (!touchState.current.hasMoved) {
        if (deltaTime < 200 && onTap) {
          onTap()
        }
      } else {
        const absDeltaX = Math.abs(deltaX)
        if (absDeltaX > swipeThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (deltaX < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
      }
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  return { touchHandlers, isPressed }
}