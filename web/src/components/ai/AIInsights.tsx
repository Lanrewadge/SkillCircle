'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  Target,
  Clock,
  TrendingUp,
  Users,
  BookOpen,
  Star,
  Zap,
  Award,
  Eye,
  Headphones,
  Hand,
  PenTool,
  Calendar,
  BarChart3
} from 'lucide-react'

interface AIInsightsProps {
  skillId: string
  userId?: string
}

interface PersonalizedInsights {
  learningStyle: string
  estimatedDuration: string
  successProbability: string
  optimalSchedule: {
    recommendedDuration: number
    optimalTimes: string[]
    frequency: string
    restDays: string[]
  }
  recommendedPhases: Array<{
    phase: number
    name: string
    difficulty: string
    estimatedWeeks: number
  }>
}

interface AIInsightsData {
  personalizedInsights: PersonalizedInsights
  adaptiveRecommendations: {
    primaryFormats: string[]
    supplementaryFormats: string[]
  }
  milestones: Array<{
    id: string
    title: string
    description: string
    points: number
    badge: {
      icon: string
      name: string
      rarity: string
    }
  }>
}

const learningStyleIcons = {
  VISUAL: Eye,
  AUDITORY: Headphones,
  KINESTHETIC: Hand,
  READING_WRITING: PenTool
}

const learningStyleColors = {
  VISUAL: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  AUDITORY: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  KINESTHETIC: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  READING_WRITING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
}

const rarityColors = {
  COMMON: 'border-gray-300 bg-gray-50',
  EPIC: 'border-purple-300 bg-purple-50',
  LEGENDARY: 'border-yellow-300 bg-yellow-50'
}

export default function AIInsights({ skillId, userId = '1' }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIInsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAssessment, setShowAssessment] = useState(false)

  useEffect(() => {
    fetchAIInsights()
  }, [skillId, userId])

  const fetchAIInsights = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/api/ai/insights/${skillId}?userId=${userId}`
      )
      const data = await response.json()

      if (data.success) {
        setInsights(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch AI insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLearningStyleDescription = (style: string) => {
    const descriptions = {
      VISUAL: 'You learn best through visual aids, diagrams, and seeing concepts in action',
      AUDITORY: 'You excel with audio content, discussions, and verbal explanations',
      KINESTHETIC: 'You prefer hands-on learning, practical exercises, and learning by doing',
      READING_WRITING: 'You thrive with written materials, note-taking, and text-based learning'
    }
    return descriptions[style as keyof typeof descriptions] || 'Personalized learning approach'
  }

  const getSuccessColor = (probability: string) => {
    const percent = parseInt(probability)
    if (percent >= 80) return 'text-green-600 dark:text-green-400'
    if (percent >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 animate-pulse" />
            <span>AI is analyzing your learning profile...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!insights) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Unable to load AI insights</p>
        </CardContent>
      </Card>
    )
  }

  const LearningStyleIcon = learningStyleIcons[insights.personalizedInsights.learningStyle as keyof typeof learningStyleIcons] || Eye

  return (
    <div className="space-y-6">
      {/* Main AI Insights Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">AI-Powered Learning Insights</CardTitle>
          </div>
          <CardDescription>
            Personalized recommendations based on your learning profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Learning Style */}
          <div className="flex items-start space-x-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
              <LearningStyleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-medium">Your Learning Style</h3>
                <Badge className={learningStyleColors[insights.personalizedInsights.learningStyle as keyof typeof learningStyleColors]}>
                  {insights.personalizedInsights.learningStyle.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getLearningStyleDescription(insights.personalizedInsights.learningStyle)}
              </p>
            </div>
          </div>

          {/* Success Probability */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Success Probability</p>
                <p className="text-sm text-muted-foreground">Based on your profile</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getSuccessColor(insights.personalizedInsights.successProbability)}`}>
                {insights.personalizedInsights.successProbability}
              </div>
              <Progress
                value={parseInt(insights.personalizedInsights.successProbability)}
                className="w-20 mt-1"
              />
            </div>
          </div>

          {/* Duration & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Estimated Duration</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {insights.personalizedInsights.estimatedDuration}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Optimal Times</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {insights.personalizedInsights.optimalSchedule.optimalTimes.map((time, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Path Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recommended Learning Path</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.personalizedInsights.recommendedPhases.map((phase, index) => (
              <div key={phase.phase} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {phase.phase}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{phase.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant={phase.difficulty === 'BEGINNER' ? 'secondary' : phase.difficulty === 'INTERMEDIATE' ? 'default' : 'destructive'}>
                      {phase.difficulty}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ~{phase.estimatedWeeks} weeks
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Adaptive Content Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Primary Formats (Best for you)</h4>
              <div className="flex flex-wrap gap-2">
                {insights.adaptiveRecommendations.primaryFormats.map((format, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Supplementary Formats</h4>
              <div className="flex flex-wrap gap-2">
                {insights.adaptiveRecommendations.supplementaryFormats.map((format, index) => (
                  <Badge key={index} variant="outline">
                    {format}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Upcoming Milestones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {insights.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`p-4 border-2 rounded-lg ${rarityColors[milestone.badge.rarity as keyof typeof rarityColors]}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{milestone.badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">
                        {milestone.points} points
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {milestone.badge.rarity} achievement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Take Assessment CTA */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardContent className="p-6 text-center">
          <Zap className="h-8 w-8 mx-auto mb-3 text-yellow-500" />
          <h3 className="font-bold mb-2">Want More Accurate Insights?</h3>
          <p className="text-muted-foreground mb-4">
            Take our AI-powered assessment to get even more personalized recommendations
          </p>
          <Button onClick={() => setShowAssessment(true)}>
            <Brain className="h-4 w-4 mr-2" />
            Take Smart Assessment
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}