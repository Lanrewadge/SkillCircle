'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface FloatingOrb {
  id: number
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
  opacity: number
}

interface BackgroundProps {
  variant?: 'default' | 'technology' | 'business' | 'creative' | 'academic'
  intensity?: 'low' | 'medium' | 'high'
}

const colorSchemes = {
  default: [
    'rgba(59, 130, 246, 0.1)',  // Blue
    'rgba(147, 51, 234, 0.1)',  // Purple
    'rgba(236, 72, 153, 0.1)',  // Pink
    'rgba(34, 197, 94, 0.1)',   // Green
  ],
  technology: [
    'rgba(6, 182, 212, 0.15)',  // Cyan
    'rgba(59, 130, 246, 0.15)', // Blue
    'rgba(147, 51, 234, 0.15)', // Purple
    'rgba(16, 185, 129, 0.15)', // Emerald
  ],
  business: [
    'rgba(245, 158, 11, 0.15)', // Amber
    'rgba(34, 197, 94, 0.15)',  // Green
    'rgba(59, 130, 246, 0.15)', // Blue
    'rgba(99, 102, 241, 0.15)', // Indigo
  ],
  creative: [
    'rgba(236, 72, 153, 0.15)', // Pink
    'rgba(168, 85, 247, 0.15)', // Purple
    'rgba(251, 146, 60, 0.15)', // Orange
    'rgba(244, 63, 94, 0.15)',  // Rose
  ],
  academic: [
    'rgba(99, 102, 241, 0.15)', // Indigo
    'rgba(59, 130, 246, 0.15)', // Blue
    'rgba(34, 197, 94, 0.15)',  // Green
    'rgba(16, 185, 129, 0.15)', // Emerald
  ]
}

export default function ImmersiveBackground({ variant = 'default', intensity = 'medium' }: BackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [orbs, setOrbs] = useState<FloatingOrb[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const orbCount = intensity === 'low' ? 15 : intensity === 'medium' ? 25 : 40
  const colors = colorSchemes[variant]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Initialize orbs
    const initialOrbs: FloatingOrb[] = Array.from({ length: orbCount }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3
    }))
    setOrbs(initialOrbs)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)')
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.95)')
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw orbs
      setOrbs(currentOrbs =>
        currentOrbs.map(orb => {
          // Update position
          let newX = orb.x + orb.speedX
          let newY = orb.y + orb.speedY

          // Bounce off edges
          if (newX <= 0 || newX >= canvas.width) orb.speedX *= -1
          if (newY <= 0 || newY >= canvas.height) orb.speedY *= -1

          newX = Math.max(0, Math.min(canvas.width, newX))
          newY = Math.max(0, Math.min(canvas.height, newY))

          // Mouse interaction
          const dx = mousePosition.x - newX
          const dy = mousePosition.y - newY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            newX -= (dx / distance) * force * 2
            newY -= (dy / distance) * force * 2
          }

          // Draw orb
          const orbGradient = ctx.createRadialGradient(newX, newY, 0, newX, newY, orb.size)
          orbGradient.addColorStop(0, orb.color)
          orbGradient.addColorStop(1, 'transparent')

          ctx.fillStyle = orbGradient
          ctx.beginPath()
          ctx.arc(newX, newY, orb.size, 0, Math.PI * 2)
          ctx.fill()

          return { ...orb, x: newX, y: newY }
        })
      )

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [orbCount, colors, mousePosition])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <>
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Additional gradient overlays */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top gradient */}
        <motion.div
          className="absolute top-0 left-0 w-full h-96 opacity-30"
          style={{
            background: `radial-gradient(ellipse at top, ${colors[0]}, transparent 70%)`
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Bottom gradient */}
        <motion.div
          className="absolute bottom-0 right-0 w-full h-96 opacity-30"
          style={{
            background: `radial-gradient(ellipse at bottom right, ${colors[1]}, transparent 70%)`
          }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Side gradients */}
        <motion.div
          className="absolute left-0 top-1/2 w-96 h-96 opacity-20"
          style={{
            background: `radial-gradient(circle, ${colors[2]}, transparent 70%)`,
            transform: 'translateY(-50%)'
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [-50, 0, -50]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        <motion.div
          className="absolute right-0 top-1/3 w-96 h-96 opacity-20"
          style={{
            background: `radial-gradient(circle, ${colors[3]}, transparent 70%)`
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            x: [50, 0, 50]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6
          }}
        />
      </div>

      {/* Animated grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-5">
        <motion.div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50
            }}
            animate={{
              y: -50,
              x: Math.random() * window.innerWidth
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </>
  )
}