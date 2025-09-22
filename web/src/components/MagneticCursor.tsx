'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function MagneticCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState('default')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      })
      setIsVisible(true)
    }

    const mouseLeave = () => {
      setIsVisible(false)
    }

    const mouseEnterInteractive = () => {
      setCursorVariant('interactive')
    }

    const mouseLeaveInteractive = () => {
      setCursorVariant('default')
    }

    // Add event listeners
    window.addEventListener('mousemove', mouseMove)
    window.addEventListener('mouseleave', mouseLeave)

    // Add listeners for interactive elements
    const interactiveElements = document.querySelectorAll('button, a, [data-magnetic]')
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', mouseEnterInteractive)
      el.addEventListener('mouseleave', mouseLeaveInteractive)
    })

    return () => {
      window.removeEventListener('mousemove', mouseMove)
      window.removeEventListener('mouseleave', mouseLeave)
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', mouseEnterInteractive)
        el.removeEventListener('mouseleave', mouseLeaveInteractive)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
      backgroundColor: 'rgba(59, 130, 246, 0.3)',
      border: '2px solid rgba(59, 130, 246, 0.6)'
    },
    interactive: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      backgroundColor: 'rgba(147, 51, 234, 0.3)',
      border: '2px solid rgba(147, 51, 234, 0.8)'
    }
  }

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full mix-blend-difference"
        animate={variants[cursorVariant as keyof typeof variants]}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5
        }}
        style={{
          width: 32,
          height: 32,
          opacity: isVisible ? 1 : 0
        }}
      />

      {/* Trailing effect */}
      <motion.div
        className="fixed pointer-events-none z-40 rounded-full"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          opacity: isVisible ? 1 : 0
        }}
      />
    </>
  )
}