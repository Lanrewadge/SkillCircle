'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CheckCircle,
  Circle,
  Lock,
  Star,
  Trophy,
  Zap,
  Target,
  Rocket
} from 'lucide-react'

interface SkillNode {
  id: string
  name: string
  level: number
  prerequisites: string[]
  completed: boolean
  locked: boolean
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  xp: number
  description: string
}

const skillTreeData: SkillNode[] = [
  // Level 1 - Foundation
  {
    id: 'html-basics',
    name: 'HTML Basics',
    level: 1,
    prerequisites: [],
    completed: true,
    locked: false,
    difficulty: 'Beginner',
    xp: 100,
    description: 'Learn the fundamentals of HTML structure and semantics'
  },
  {
    id: 'css-basics',
    name: 'CSS Basics',
    level: 1,
    prerequisites: [],
    completed: true,
    locked: false,
    difficulty: 'Beginner',
    xp: 100,
    description: 'Master styling with CSS properties and selectors'
  },
  {
    id: 'js-fundamentals',
    name: 'JavaScript Fundamentals',
    level: 1,
    prerequisites: [],
    completed: false,
    locked: false,
    difficulty: 'Beginner',
    xp: 150,
    description: 'Core JavaScript concepts, variables, and functions'
  },

  // Level 2 - Intermediate
  {
    id: 'responsive-design',
    name: 'Responsive Design',
    level: 2,
    prerequisites: ['html-basics', 'css-basics'],
    completed: false,
    locked: false,
    difficulty: 'Intermediate',
    xp: 200,
    description: 'Create designs that work across all devices'
  },
  {
    id: 'dom-manipulation',
    name: 'DOM Manipulation',
    level: 2,
    prerequisites: ['js-fundamentals'],
    completed: false,
    locked: false,
    difficulty: 'Intermediate',
    xp: 200,
    description: 'Dynamically interact with HTML elements using JavaScript'
  },

  // Level 3 - Advanced
  {
    id: 'react-basics',
    name: 'React Basics',
    level: 3,
    prerequisites: ['js-fundamentals', 'dom-manipulation'],
    completed: false,
    locked: true,
    difficulty: 'Intermediate',
    xp: 300,
    description: 'Component-based development with React'
  },
  {
    id: 'css-animations',
    name: 'CSS Animations',
    level: 3,
    prerequisites: ['css-basics', 'responsive-design'],
    completed: false,
    locked: true,
    difficulty: 'Advanced',
    xp: 250,
    description: 'Create smooth animations and transitions'
  },

  // Level 4 - Expert
  {
    id: 'react-advanced',
    name: 'Advanced React',
    level: 4,
    prerequisites: ['react-basics'],
    completed: false,
    locked: true,
    difficulty: 'Advanced',
    xp: 400,
    description: 'Hooks, Context, Performance optimization'
  },
  {
    id: 'fullstack-apps',
    name: 'Full-Stack Applications',
    level: 4,
    prerequisites: ['react-advanced', 'dom-manipulation'],
    completed: false,
    locked: true,
    difficulty: 'Advanced',
    xp: 500,
    description: 'Build complete web applications with backend integration'
  }
]

export default function SkillTree({ subcategory = 'web-development' }: { subcategory?: string }) {
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  const getSkillIcon = (skill: SkillNode) => {
    if (skill.completed) return <CheckCircle className="w-6 h-6 text-green-400" />
    if (skill.locked) return <Lock className="w-6 h-6 text-gray-500" />
    return <Circle className="w-6 h-6 text-blue-400" />
  }

  const getSkillColor = (skill: SkillNode) => {
    if (skill.completed) return 'from-green-500 to-emerald-500'
    if (skill.locked) return 'from-gray-500 to-gray-600'
    return 'from-blue-500 to-purple-500'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400'
      case 'Intermediate': return 'text-yellow-400'
      case 'Advanced': return 'text-red-400'
      default: return 'text-blue-400'
    }
  }

  const getPositionForLevel = (level: number, index: number, total: number) => {
    const spacing = 200
    const offset = (total - 1) * spacing / 2
    return {
      x: index * spacing - offset,
      y: (level - 1) * 150
    }
  }

  const skillsByLevel = skillTreeData.reduce((acc, skill) => {
    if (!acc[skill.level]) acc[skill.level] = []
    acc[skill.level].push(skill)
    return acc
  }, {} as Record<number, SkillNode[]>)

  return (
    <div className="relative w-full h-[600px] bg-black/20 rounded-xl overflow-hidden p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Skill Learning Path</h3>
        <p className="text-gray-300">Progress through structured learning modules</p>
      </div>

      {/* Skill Tree Canvas */}
      <div className="relative w-full h-full flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Connection Lines */}
          {skillTreeData.map((skill) =>
            skill.prerequisites.map((prereq) => {
              const prereqSkill = skillTreeData.find(s => s.id === prereq)
              if (!prereqSkill) return null

              const prereqIndex = skillsByLevel[prereqSkill.level].indexOf(prereqSkill)
              const skillIndex = skillsByLevel[skill.level].indexOf(skill)

              const startPos = getPositionForLevel(prereqSkill.level, prereqIndex, skillsByLevel[prereqSkill.level].length)
              const endPos = getPositionForLevel(skill.level, skillIndex, skillsByLevel[skill.level].length)

              return (
                <motion.line
                  key={`${prereq}-${skill.id}`}
                  x1={startPos.x + 300}
                  y1={startPos.y + 100}
                  x2={endPos.x + 300}
                  y2={endPos.y + 100}
                  stroke={skill.completed ? '#10b981' : skill.locked ? '#6b7280' : '#3b82f6'}
                  strokeWidth="2"
                  strokeDasharray={skill.locked ? "5,5" : "none"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: prereqSkill.level * 0.2 }}
                />
              )
            })
          )}
        </svg>

        {/* Skill Nodes */}
        {Object.entries(skillsByLevel).map(([level, skills]) =>
          skills.map((skill, index) => {
            const position = getPositionForLevel(parseInt(level), index, skills.length)

            return (
              <motion.div
                key={skill.id}
                className="absolute"
                style={{
                  left: position.x + 300,
                  top: position.y + 80,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: parseInt(level) * 0.2 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredSkill(skill.id)}
                onHoverEnd={() => setHoveredSkill(null)}
                onClick={() => setSelectedSkill(skill)}
              >
                <motion.div
                  className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getSkillColor(skill)} flex items-center justify-center cursor-pointer shadow-lg border-2 border-white/20`}
                  whileHover={{
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(255, 255, 255, 0.4)'
                  }}
                >
                  {getSkillIcon(skill)}

                  {/* XP Badge */}
                  <motion.div
                    className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: parseInt(level) * 0.2 + index * 0.1 + 0.3 }}
                  >
                    {skill.xp}
                  </motion.div>

                  {/* Hover Tooltip */}
                  <AnimatePresence>
                    {hoveredSkill === skill.id && (
                      <motion.div
                        className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        <div className="font-medium">{skill.name}</div>
                        <div className={`text-xs ${getDifficultyColor(skill.difficulty)}`}>
                          {skill.difficulty} • {skill.xp} XP
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Skill Name */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-white text-sm font-medium whitespace-nowrap">{skill.name}</div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Skill Details Panel */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="absolute top-4 right-4 w-80 bg-black/80 backdrop-blur-sm rounded-xl p-6 text-white border border-white/20"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{selectedSkill.name}</h3>
              <button
                onClick={() => setSelectedSkill(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <p className="text-gray-300 text-sm mb-4">{selectedSkill.description}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Difficulty: </span>
                <Badge variant="secondary" className={getDifficultyColor(selectedSkill.difficulty)}>
                  {selectedSkill.difficulty}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Reward: {selectedSkill.xp} XP</span>
              </div>

              {selectedSkill.prerequisites.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Prerequisites:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSkill.prerequisites.map((prereq) => {
                      const prereqSkill = skillTreeData.find(s => s.id === prereq)
                      return prereqSkill ? (
                        <Badge key={prereq} variant="outline" className="text-xs">
                          {prereqSkill.name}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              <Button
                className="w-full mt-4"
                disabled={selectedSkill.locked}
                data-magnetic
              >
                {selectedSkill.completed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completed
                  </>
                ) : selectedSkill.locked ? (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Locked
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4 mr-2" />
                    Start Learning
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Summary */}
      <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {skillTreeData.filter(s => s.completed).length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {skillTreeData.filter(s => !s.locked && !s.completed).length}
            </div>
            <div className="text-xs text-gray-400">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {skillTreeData.reduce((sum, s) => s.completed ? sum + s.xp : sum, 0)}
            </div>
            <div className="text-xs text-gray-400">Total XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}