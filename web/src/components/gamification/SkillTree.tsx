'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Trophy,
  Star,
  Lock,
  CheckCircle,
  Zap,
  Target,
  Award,
  Crown,
  Gem,
  Shield,
  Flame,
  TreePine,
  Network
} from 'lucide-react'

interface SkillNode {
  id: string
  name: string
  description: string
  level: number
  prerequisites: string[]
  isUnlocked: boolean
  isCompleted: boolean
  progress: number
  xp: number
  maxXp: number
  icon: string
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY'
  position: { x: number; y: number }
  connections: string[]
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND'
  isUnlocked: boolean
  unlockedAt?: string
  progress: number
  maxProgress: number
  category: string
}

interface SkillTreeProps {
  skillId: string
  userId?: string
}

export default function SkillTree({ skillId, userId = '1' }: SkillTreeProps) {
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [totalXP, setTotalXP] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(1)
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const [viewMode, setViewMode] = useState<'tree' | 'achievements'>('tree')

  useEffect(() => {
    loadSkillTree()
    loadAchievements()
  }, [skillId, userId])

  const loadSkillTree = () => {
    // Mock skill tree data - in real app, this would come from API
    const mockSkillNodes: SkillNode[] = [
      {
        id: 'fundamentals',
        name: 'Fundamentals',
        description: 'Learn the basics and core concepts',
        level: 1,
        prerequisites: [],
        isUnlocked: true,
        isCompleted: true,
        progress: 100,
        xp: 100,
        maxXp: 100,
        icon: '🌱',
        rarity: 'COMMON',
        position: { x: 50, y: 80 },
        connections: ['intermediate']
      },
      {
        id: 'intermediate',
        name: 'Intermediate Skills',
        description: 'Build on the fundamentals with more complex concepts',
        level: 2,
        prerequisites: ['fundamentals'],
        isUnlocked: true,
        isCompleted: false,
        progress: 65,
        xp: 130,
        maxXp: 200,
        icon: '🚀',
        rarity: 'RARE',
        position: { x: 50, y: 60 },
        connections: ['advanced', 'specialization']
      },
      {
        id: 'advanced',
        name: 'Advanced Techniques',
        description: 'Master advanced concepts and best practices',
        level: 3,
        prerequisites: ['intermediate'],
        isUnlocked: true,
        isCompleted: false,
        progress: 20,
        xp: 40,
        maxXp: 300,
        icon: '⭐',
        rarity: 'EPIC',
        position: { x: 30, y: 40 },
        connections: ['expert']
      },
      {
        id: 'specialization',
        name: 'Specialization',
        description: 'Focus on specific areas of expertise',
        level: 3,
        prerequisites: ['intermediate'],
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        xp: 0,
        maxXp: 250,
        icon: '💎',
        rarity: 'EPIC',
        position: { x: 70, y: 40 },
        connections: ['expert']
      },
      {
        id: 'expert',
        name: 'Expert Level',
        description: 'Achieve mastery and become an expert',
        level: 4,
        prerequisites: ['advanced', 'specialization'],
        isUnlocked: false,
        isCompleted: false,
        progress: 0,
        xp: 0,
        maxXp: 500,
        icon: '👑',
        rarity: 'LEGENDARY',
        position: { x: 50, y: 20 },
        connections: []
      }
    ]

    setSkillNodes(mockSkillNodes)
    setTotalXP(270)
    setCurrentLevel(2)
  }

  const loadAchievements = () => {
    const mockAchievements: Achievement[] = [
      {
        id: 'first_lesson',
        title: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        rarity: 'BRONZE',
        isUnlocked: true,
        unlockedAt: '2025-09-15T10:30:00Z',
        progress: 1,
        maxProgress: 1,
        category: 'Learning'
      },
      {
        id: 'streak_week',
        title: 'Consistent Learner',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        rarity: 'SILVER',
        isUnlocked: true,
        unlockedAt: '2025-09-17T09:15:00Z',
        progress: 7,
        maxProgress: 7,
        category: 'Consistency'
      },
      {
        id: 'perfect_quiz',
        title: 'Quiz Master',
        description: 'Score 100% on 5 quizzes',
        icon: '🧠',
        rarity: 'GOLD',
        isUnlocked: false,
        progress: 3,
        maxProgress: 5,
        category: 'Knowledge'
      },
      {
        id: 'teaching_master',
        title: 'Knowledge Sharer',
        description: 'Help 10 other learners',
        icon: '🤝',
        rarity: 'PLATINUM',
        isUnlocked: false,
        progress: 4,
        maxProgress: 10,
        category: 'Community'
      },
      {
        id: 'skill_tree_master',
        title: 'Tree Climber',
        description: 'Complete an entire skill tree',
        icon: '🌳',
        rarity: 'DIAMOND',
        isUnlocked: false,
        progress: 2,
        maxProgress: 5,
        category: 'Mastery'
      }
    ]

    setAchievements(mockAchievements)
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      COMMON: 'border-gray-300 bg-gray-50 text-gray-700',
      RARE: 'border-blue-300 bg-blue-50 text-blue-700',
      EPIC: 'border-purple-300 bg-purple-50 text-purple-700',
      LEGENDARY: 'border-yellow-300 bg-yellow-50 text-yellow-700',
      BRONZE: 'border-orange-300 bg-orange-50 text-orange-700',
      SILVER: 'border-gray-400 bg-gray-100 text-gray-700',
      GOLD: 'border-yellow-400 bg-yellow-100 text-yellow-700',
      PLATINUM: 'border-blue-400 bg-blue-100 text-blue-700',
      DIAMOND: 'border-purple-400 bg-purple-100 text-purple-700'
    }
    return colors[rarity as keyof typeof colors] || colors.COMMON
  }

  const getLevelRequirement = (level: number) => {
    return level * 150 // 150 XP per level
  }

  const getProgressToNextLevel = () => {
    const currentLevelXP = getLevelRequirement(currentLevel - 1)
    const nextLevelXP = getLevelRequirement(currentLevel)
    const progressXP = totalXP - currentLevelXP
    const requiredXP = nextLevelXP - currentLevelXP

    return {
      current: Math.max(0, progressXP),
      required: requiredXP,
      percentage: Math.min(100, (progressXP / requiredXP) * 100)
    }
  }

  const canUnlockNode = (node: SkillNode) => {
    return node.prerequisites.every(prereq =>
      skillNodes.find(n => n.id === prereq)?.isCompleted
    )
  }

  const NodeComponent = ({ node }: { node: SkillNode }) => {
    const canUnlock = canUnlockNode(node)
    const isLocked = !node.isUnlocked && !canUnlock

    return (
      <div
        className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
          selectedNode?.id === node.id ? 'scale-110 z-10' : 'z-5'
        } transition-transform duration-200`}
        style={{ left: `${node.position.x}%`, top: `${node.position.y}%` }}
        onClick={() => setSelectedNode(node)}
      >
        <div
          className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl relative ${
            isLocked
              ? 'border-gray-300 bg-gray-100 opacity-50'
              : node.isCompleted
              ? 'border-green-500 bg-green-100'
              : node.isUnlocked
              ? getRarityColor(node.rarity)
              : 'border-yellow-400 bg-yellow-100'
          }`}
        >
          {isLocked ? (
            <Lock className="w-6 h-6 text-gray-500" />
          ) : node.isCompleted ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <span>{node.icon}</span>
          )}

          {/* Progress ring */}
          {!isLocked && !node.isCompleted && (
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${(node.progress / 100) * 226} 226`}
                className="text-blue-500"
              />
            </svg>
          )}

          {/* Level badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
            {node.level}
          </div>
        </div>

        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-foreground">{node.name}</div>
          {!isLocked && (
            <div className="text-xs text-muted-foreground">
              {node.isCompleted ? 'Completed' : `${node.progress}%`}
            </div>
          )}
        </div>
      </div>
    )
  }

  const ConnectionLine = ({ from, to }: { from: SkillNode; to: SkillNode }) => {
    const fromX = from.position.x
    const fromY = from.position.y
    const toX = to.position.x
    const toY = to.position.y

    return (
      <line
        x1={`${fromX}%`}
        y1={`${fromY}%`}
        x2={`${toX}%`}
        y2={`${toY}%`}
        stroke={from.isCompleted ? '#22C55E' : '#D1D5DB'}
        strokeWidth="3"
        strokeDasharray={from.isCompleted ? '0' : '10,5'}
        className="transition-all duration-300"
      />
    )
  }

  const progressToNext = getProgressToNextLevel()

  return (
    <div className="space-y-6">
      {/* Header with Level Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <TreePine className="h-5 w-5" />
              <span>Skill Mastery Tree</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'tree' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('tree')}
              >
                <Network className="h-4 w-4 mr-1" />
                Tree
              </Button>
              <Button
                variant={viewMode === 'achievements' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('achievements')}
              >
                <Trophy className="h-4 w-4 mr-1" />
                Achievements
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="text-lg font-bold">Level {currentLevel}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">{totalXP} XP</span>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              {achievements.filter(a => a.isUnlocked).length} / {achievements.length} Achievements
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{progressToNext.current} / {progressToNext.required} XP</span>
            </div>
            <Progress value={progressToNext.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === 'tree' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Skill Tree Visualization */}
          <div className="lg:col-span-2">
            <Card className="h-96">
              <CardContent className="p-0 relative h-full overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"></div>
                </div>

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {skillNodes.map(node =>
                    node.connections.map(connectionId => {
                      const connectedNode = skillNodes.find(n => n.id === connectionId)
                      return connectedNode ? (
                        <ConnectionLine
                          key={`${node.id}-${connectionId}`}
                          from={node}
                          to={connectedNode}
                        />
                      ) : null
                    })
                  )}
                </svg>

                {/* Skill nodes */}
                <div className="relative w-full h-full">
                  {skillNodes.map(node => (
                    <NodeComponent key={node.id} node={node} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Node Details */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedNode ? selectedNode.name : 'Select a Node'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl mb-2">{selectedNode.icon}</div>
                      <Badge className={getRarityColor(selectedNode.rarity)}>
                        {selectedNode.rarity}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {selectedNode.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{selectedNode.progress}%</span>
                      </div>
                      <Progress value={selectedNode.progress} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>XP</span>
                        <span>{selectedNode.xp} / {selectedNode.maxXp}</span>
                      </div>
                      <Progress value={(selectedNode.xp / selectedNode.maxXp) * 100} />
                    </div>

                    {selectedNode.prerequisites.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Prerequisites:</p>
                        <div className="space-y-1">
                          {selectedNode.prerequisites.map(prereq => {
                            const prereqNode = skillNodes.find(n => n.id === prereq)
                            return prereqNode ? (
                              <div key={prereq} className="flex items-center space-x-2 text-sm">
                                {prereqNode.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Lock className="h-4 w-4 text-gray-400" />
                                )}
                                <span className={prereqNode.isCompleted ? 'text-green-600' : 'text-muted-foreground'}>
                                  {prereqNode.name}
                                </span>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full"
                      disabled={!selectedNode.isUnlocked}
                    >
                      {selectedNode.isCompleted
                        ? 'Completed'
                        : selectedNode.isUnlocked
                        ? 'Continue Learning'
                        : 'Locked'
                      }
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Click on a node to see details
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Achievements View */
        <div className="grid gap-4">
          {achievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`${achievement.isUnlocked ? getRarityColor(achievement.rarity) : 'opacity-60'}`}
            >
              <CardContent className="flex items-center space-x-4 p-4">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium">{achievement.title}</h3>
                    <Badge variant="outline">{achievement.rarity}</Badge>
                    <Badge variant="secondary">{achievement.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  {!achievement.isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                    </div>
                  )}
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground">
                      Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {achievement.isUnlocked && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}