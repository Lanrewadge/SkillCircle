'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Star,
  Sparkles,
  Award,
  Crown,
  Zap,
  Heart,
  Gift
} from 'lucide-react'

interface CelebrationProps {
  isVisible: boolean
  type: 'course_complete' | 'skill_unlock' | 'streak' | 'milestone' | 'achievement'
  title: string
  subtitle?: string
  onComplete?: () => void
}

interface Confetti {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  color: string
  shape: 'circle' | 'square' | 'triangle'
}

const celebrationColors = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3'
]

const celebrationConfig = {
  course_complete: {
    icon: <Trophy className="w-16 h-16" />,
    gradient: 'from-yellow-400 via-orange-500 to-red-500',
    particleCount: 50,
    fireworkCount: 3
  },
  skill_unlock: {
    icon: <Star className="w-16 h-16" />,
    gradient: 'from-purple-400 via-pink-500 to-red-500',
    particleCount: 40,
    fireworkCount: 2
  },
  streak: {
    icon: <Zap className="w-16 h-16" />,
    gradient: 'from-orange-400 via-red-500 to-pink-500',
    particleCount: 35,
    fireworkCount: 2
  },
  milestone: {
    icon: <Award className="w-16 h-16" />,
    gradient: 'from-green-400 via-blue-500 to-purple-500',
    particleCount: 45,
    fireworkCount: 3
  },
  achievement: {
    icon: <Crown className="w-16 h-16" />,
    gradient: 'from-yellow-300 via-yellow-500 to-orange-500',
    particleCount: 60,
    fireworkCount: 4
  }
}

export default function CelebrationEffects({
  isVisible,
  type,
  title,
  subtitle,
  onComplete
}: CelebrationProps) {
  const [confetti, setConfetti] = useState<Confetti[]>([])
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number }[]>([])
  const [showContent, setShowContent] = useState(false)

  const config = celebrationConfig[type]

  useEffect(() => {
    if (isVisible) {
      // Generate confetti
      const newConfetti: Confetti[] = Array.from({ length: config.particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -50,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5,
        color: celebrationColors[Math.floor(Math.random() * celebrationColors.length)],
        shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
      }))
      setConfetti(newConfetti)

      // Generate fireworks
      const newFireworks = Array.from({ length: config.fireworkCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.6) + window.innerHeight * 0.2
      }))
      setFireworks(newFireworks)

      // Show content after initial effect
      setTimeout(() => setShowContent(true), 500)

      // Auto-complete after animation
      setTimeout(() => {
        onComplete?.()
      }, 4000)
    } else {
      setShowContent(false)
      setConfetti([])
      setFireworks([])
    }
  }, [isVisible, config.particleCount, config.fireworkCount, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Background overlay */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute pointer-events-none"
            initial={{
              x: piece.x,
              y: piece.y,
              rotate: piece.rotation,
              scale: 0
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: piece.rotation + 720,
              scale: piece.scale,
              x: piece.x + (Math.random() - 0.5) * 200
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              ease: "easeOut"
            }}
            exit={{ opacity: 0 }}
          >
            <div
              className={`w-3 h-3 ${
                piece.shape === 'circle' ? 'rounded-full' :
                piece.shape === 'triangle' ? 'triangle' : ''
              }`}
              style={{
                backgroundColor: piece.color,
                clipPath: piece.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Fireworks */}
      <AnimatePresence>
        {fireworks.map((firework) => (
          <motion.div
            key={firework.id}
            className="absolute pointer-events-none"
            style={{ left: firework.x, top: firework.y }}
          >
            {/* Firework burst */}
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  backgroundColor: celebrationColors[Math.floor(Math.random() * celebrationColors.length)]
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30) * Math.PI / 180) * 100,
                  y: Math.sin((i * 30) * Math.PI / 180) * 100,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                  delay: Math.random() * 0.5
                }}
              />
            ))}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main celebration content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence>
          {showContent && (
            <motion.div
              className="text-center text-white pointer-events-auto"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {/* Icon with pulse effect */}
              <motion.div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${config.gradient} mb-6 shadow-2xl`}
                animate={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(255, 255, 255, 0.7)",
                    "0 0 0 20px rgba(255, 255, 255, 0)",
                    "0 0 0 0 rgba(255, 255, 255, 0)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
                >
                  {config.icon}
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                {title}
              </motion.h1>

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  className="text-xl md:text-2xl text-gray-200 mb-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {subtitle}
                </motion.p>
              )}

              {/* Decorative elements */}
              <div className="relative">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${50 + Math.cos((i * 60) * Math.PI / 180) * 120}%`,
                      top: `${50 + Math.sin((i * 60) * Math.PI / 180) * 120}%`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                  </motion.div>
                ))}
              </div>

              {/* Success message */}
              <motion.div
                className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 200 }}
              >
                <p className="text-lg font-medium">
                  🎉 Amazing work! Keep learning! 🎉
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Close button */}
      <motion.button
        className="absolute top-8 right-8 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors pointer-events-auto"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onComplete}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ×
      </motion.button>
    </div>
  )
}

// Hook for triggering celebrations
export function useCelebration() {
  const [celebration, setCelebration] = useState<{
    isVisible: boolean
    type: CelebrationProps['type']
    title: string
    subtitle?: string
  }>({
    isVisible: false,
    type: 'achievement',
    title: '',
    subtitle: ''
  })

  const celebrate = (
    type: CelebrationProps['type'],
    title: string,
    subtitle?: string
  ) => {
    setCelebration({
      isVisible: true,
      type,
      title,
      subtitle
    })
  }

  const hideCelebration = () => {
    setCelebration(prev => ({ ...prev, isVisible: false }))
  }

  return {
    celebration,
    celebrate,
    hideCelebration
  }
}