'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Trophy,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Book,
  BarChart3,
  User,
  Download,
  RefreshCw,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react'
import { format } from 'date-fns'

interface AssessmentRecord {
  id: string
  skillName: string
  skillId: string
  type: 'level-test' | 'full-assessment' | 'practice-test'
  score: number
  maxScore: number
  percentage: number
  level: string
  completedAt: string
  timeSpent: number
  certificateUrl?: string
}

interface SkillProgress {
  skillName: string
  skillId: string
  currentLevel: string
  currentScore: number
  assessments: number
  lastAssessment: string
  improvement: number
  nextGoal: string
}

interface AssessmentDashboardProps {
  userId: string
}

const mockAssessments: AssessmentRecord[] = [
  {
    id: 'assess_001',
    skillName: 'React Development',
    skillId: 'react',
    type: 'full-assessment',
    score: 85,
    maxScore: 100,
    percentage: 85,
    level: 'Advanced',
    completedAt: '2025-09-18T14:30:00Z',
    timeSpent: 1800,
    certificateUrl: '/certificates/react_advanced.pdf'
  },
  {
    id: 'assess_002',
    skillName: 'JavaScript ES6+',
    skillId: 'javascript',
    type: 'level-test',
    score: 72,
    maxScore: 100,
    percentage: 72,
    level: 'Intermediate',
    completedAt: '2025-09-17T10:15:00Z',
    timeSpent: 900
  },
  {
    id: 'assess_003',
    skillName: 'TypeScript',
    skillId: 'typescript',
    type: 'practice-test',
    score: 68,
    maxScore: 80,
    percentage: 85,
    level: 'Intermediate',
    completedAt: '2025-09-16T16:45:00Z',
    timeSpent: 1200
  },
  {
    id: 'assess_004',
    skillName: 'Node.js',
    skillId: 'nodejs',
    type: 'full-assessment',
    score: 45,
    maxScore: 100,
    percentage: 45,
    level: 'Beginner',
    completedAt: '2025-09-15T11:20:00Z',
    timeSpent: 2100
  }
]

const mockSkillProgress: SkillProgress[] = [
  {
    skillName: 'React Development',
    skillId: 'react',
    currentLevel: 'Advanced',
    currentScore: 85,
    assessments: 3,
    lastAssessment: '2025-09-18T14:30:00Z',
    improvement: 15,
    nextGoal: 'Expert Level (90+)'
  },
  {
    skillName: 'JavaScript ES6+',
    skillId: 'javascript',
    currentLevel: 'Intermediate',
    currentScore: 72,
    assessments: 2,
    lastAssessment: '2025-09-17T10:15:00Z',
    improvement: 8,
    nextGoal: 'Advanced Level (80+)'
  },
  {
    skillName: 'TypeScript',
    skillId: 'typescript',
    currentLevel: 'Intermediate',
    currentScore: 85,
    assessments: 1,
    lastAssessment: '2025-09-16T16:45:00Z',
    improvement: 0,
    nextGoal: 'Advanced Level (80+)'
  }
]

export const AssessmentDashboard: React.FC<AssessmentDashboardProps> = ({ userId }) => {
  const [assessments] = useState<AssessmentRecord[]>(mockAssessments)
  const [skillProgress] = useState<SkillProgress[]>(mockSkillProgress)
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d')

  // Calculate statistics
  const totalAssessments = assessments.length
  const averageScore = Math.round(
    assessments.reduce((sum, a) => sum + a.percentage, 0) / assessments.length
  )
  const certificatesEarned = assessments.filter(a => a.certificateUrl).length
  const skillsAssessed = new Set(assessments.map(a => a.skillId)).size

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'text-purple-600 bg-purple-100'
      case 'advanced': return 'text-orange-600 bg-orange-100'
      case 'intermediate': return 'text-green-600 bg-green-100'
      case 'beginner': return 'text-blue-600 bg-blue-100'
      case 'novice': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full-assessment': return <Trophy className="w-4 h-4" />
      case 'level-test': return <Target className="w-4 h-4" />
      case 'practice-test': return <Book className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Assessment Dashboard</h1>
        <p className="text-gray-600">
          Track your skill assessments, progress, and achievements
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-2xl font-bold text-blue-600">{totalAssessments}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold text-green-600">{averageScore}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
                <p className="text-2xl font-bold text-purple-600">{certificatesEarned}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skills Assessed</p>
                <p className="text-2xl font-bold text-orange-600">{skillsAssessed}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recent">Recent Assessments</TabsTrigger>
          <TabsTrigger value="progress">Skill Progress</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        {/* Recent Assessments */}
        <TabsContent value="recent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Assessment Results</CardTitle>
              <CardDescription>
                Your latest skill assessments and scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <Card key={assessment.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold">{assessment.skillName}</h4>
                            <Badge className={getLevelColor(assessment.level)}>
                              {assessment.level}
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              {getTypeIcon(assessment.type)}
                              <span className="capitalize">{assessment.type.replace('-', ' ')}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Trophy className="w-3 h-3" />
                              <span>{assessment.score}/{assessment.maxScore} points</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(assessment.completedAt), 'MMM d, yyyy')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(assessment.timeSpent)}</span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Score</span>
                              <span className="font-medium">{assessment.percentage}%</span>
                            </div>
                            <Progress value={assessment.percentage} className="h-2" />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {assessment.certificateUrl && (
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Certificate
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Retake
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skill Progress */}
        <TabsContent value="progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skill Development Progress</CardTitle>
              <CardDescription>
                Track your improvement across different skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillProgress.map((skill) => (
                  <div key={skill.skillId} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{skill.skillName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{skill.assessments} assessments taken</span>
                          <span>Last: {format(new Date(skill.lastAssessment), 'MMM d')}</span>
                          {skill.improvement > 0 && (
                            <span className="text-green-600 flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>+{skill.improvement}% improvement</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge className={getLevelColor(skill.currentLevel)}>
                        {skill.currentLevel}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Level</span>
                        <span className="font-medium">{skill.currentScore}%</span>
                      </div>
                      <Progress value={skill.currentScore} className="h-3" />
                      <div className="text-xs text-gray-600">
                        Next goal: {skill.nextGoal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certificates */}
        <TabsContent value="certificates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Earned Certificates</CardTitle>
              <CardDescription>
                Download and share your skill certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {certificatesEarned === 0 ? (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No certificates yet</h3>
                  <p className="text-gray-600 mb-4">
                    Complete assessments with 70% or higher to earn certificates
                  </p>
                  <Button>Take an Assessment</Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {assessments
                    .filter(a => a.certificateUrl)
                    .map((assessment) => (
                      <Card key={assessment.id} className="border-2 border-yellow-200">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <Award className="w-5 h-5 text-yellow-600" />
                              <h4 className="font-semibold">{assessment.skillName}</h4>
                            </div>
                            <Badge className={getLevelColor(assessment.level)}>
                              {assessment.level}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div>Score: {assessment.percentage}%</div>
                            <div>Earned: {format(new Date(assessment.completedAt), 'MMM d, yyyy')}</div>
                          </div>

                          <div className="flex space-x-2 mt-4">
                            <Button size="sm" className="flex-1">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                            <Button variant="outline" size="sm">
                              Share
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}