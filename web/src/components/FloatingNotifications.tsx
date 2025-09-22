'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy,
  Star,
  Zap,
  Target,
  BookOpen,
  Users,
  TrendingUp,
  Award,
  Rocket,
  Sparkles
} from 'lucide-react'

interface Notification {
  id: string
  type: 'achievement' | 'tip' | 'milestone' | 'social' | 'progress'
  title: string
  message: string
  icon: React.ReactNode
  color: string
  duration: number
}

const notificationTemplates = [
  {
    type: 'achievement' as const,
    title: 'Skill Unlocked!',
    message: 'You\'ve mastered JavaScript fundamentals',
    icon: <Trophy className="w-5 h-5" />,
    color: 'from-yellow-400 to-orange-500',
    duration: 4000
  },
  {
    type: 'tip' as const,
    title: 'Pro Tip',
    message: 'Practice coding daily for better retention',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-purple-400 to-pink-500',
    duration: 6000
  },
  {
    type: 'milestone' as const,
    title: 'Milestone Reached',
    message: '500+ students completed this course',
    icon: <Target className="w-5 h-5" />,
    color: 'from-green-400 to-blue-500',
    duration: 5000
  },
  {
    type: 'social' as const,
    title: 'Community Update',
    message: 'John just completed React Advanced',
    icon: <Users className="w-5 h-5" />,
    color: 'from-blue-400 to-indigo-500',
    duration: 4000
  },
  {
    type: 'progress' as const,
    title: 'Learning Streak',
    message: 'You\'re on a 7-day learning streak! 🔥',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-red-400 to-orange-500',
    duration: 5000
  },
  {
    type: 'achievement' as const,
    title: 'Course Completed',
    message: 'Congratulations on finishing Web Development',
    icon: <Award className="w-5 h-5" />,
    color: 'from-emerald-400 to-teal-500',
    duration: 6000
  },
  {
    type: 'tip' as const,
    title: 'Study Tip',
    message: 'Build projects to solidify your learning',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-indigo-400 to-purple-500',
    duration: 5000
  },
  {
    type: 'milestone' as const,
    title: 'New Feature',
    message: 'Interactive skill tree now available!',
    icon: <Rocket className="w-5 h-5" />,
    color: 'from-cyan-400 to-blue-500',
    duration: 7000
  }
]

export default function FloatingNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const showRandomNotification = () => {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)]
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        ...template
      }

      setNotifications(prev => [...prev, notification])

      // Auto remove notification after duration
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id))
      }, notification.duration)
    }

    // Show first notification after 3 seconds
    const initialTimer = setTimeout(showRandomNotification, 3000)

    // Then show notifications every 10-15 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to show notification
        showRandomNotification()
      }
    }, 12000)

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            className="pointer-events-auto"
          >
            <motion.div
              className={`relative bg-gradient-to-r ${notification.color} p-4 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20 max-w-sm`}
              whileHover={{ scale: 1.02, y: -2 }}
              layout
            >
              {/* Animated background particles */}
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    initial={{
                      x: Math.random() * 300,
                      y: Math.random() * 80,
                      opacity: 0
                    }}
                    animate={{
                      x: Math.random() * 300,
                      y: Math.random() * 80,
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>

              {/* Close button */}
              <button
                onClick={() => removeNotification(notification.id)}
                className="absolute top-2 right-2 text-white/70 hover:text-white transition-colors"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.div>
              </button>

              {/* Content */}
              <div className="flex items-start gap-3 pr-6">
                <motion.div
                  className="flex-shrink-0 p-2 bg-white/20 rounded-lg"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="text-white">
                    {notification.icon}
                  </div>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <motion.h4
                    className="font-semibold text-white text-sm mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {notification.title}
                  </motion.h4>
                  <motion.p
                    className="text-white/90 text-xs leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {notification.message}
                  </motion.p>
                </div>
              </div>

              {/* Progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: notification.duration / 1000, ease: "linear" }}
              />

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Notification toggle */}
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-20 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full text-white border border-white/20 hover:bg-black/70 transition-colors pointer-events-auto"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-magnetic
      >
        <Star className="w-5 h-5" />
      </motion.button>
    </div>
  )
}