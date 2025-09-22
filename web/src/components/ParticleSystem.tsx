'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  char: string
  color: string
}

const codeChars = [
  '</', '/>', '{}', '[]', '()', '=>', '&&', '||', '==', '!=', '++', '--',
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'React', 'Vue', 'Angular', 'Node', 'Python', 'JS', 'TS', 'CSS', 'HTML',
  '♦', '◆', '●', '▲', '■', '★', '♠', '♣', '♥'
]

export default function ParticleSystem({
  particleCount = 50,
  subcategory = 'web-development'
}: {
  particleCount?: number
  subcategory?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

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

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          id: i,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.3 + 0.1,
          char: codeChars[Math.floor(Math.random() * codeChars.length)],
          color: getParticleColor(subcategory)
        })
      }
    }

    // Get color based on subcategory
    function getParticleColor(subcategory: string): string {
      const colors = {
        'web-development': '#3b82f6',
        'mobile-development': '#10b981',
        'data-science-ai': '#8b5cf6',
        'cloud-computing': '#06b6d4',
        'cybersecurity': '#ef4444',
        'devops': '#f59e0b',
        'game-development': '#ec4899',
        'blockchain': '#eab308'
      }
      return colors[subcategory as keyof typeof colors] || '#3b82f6'
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Keep particles in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        // Pulse opacity
        particle.opacity = 0.1 + Math.sin(Date.now() * 0.001 + particle.id) * 0.2

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.font = `${particle.size * 8}px "JetBrains Mono", monospace`
        ctx.textAlign = 'center'
        ctx.fillText(particle.char, particle.x, particle.y)
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, subcategory])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}