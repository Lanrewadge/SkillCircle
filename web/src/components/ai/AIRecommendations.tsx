'use client'

import React, { useState, useEffect } from 'react'
import {
  Brain,
  Target,
  TrendingUp,
  Star,
  Clock,
  Users,
  Zap,
  BookOpen,
  Award,
  ChevronRight,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Calendar,
  MapPin,
  Lightbulb,
  Rocket,
  Search,
  Filter,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Recommendation {
  id: string
  type: 'course' | 'path' | 'skill' | 'mentor' | 'project'
  title: string
  description: string
  confidence: number
  reason: string
  tags: string[]
  instructor?: string
  duration?: number
  difficulty: string
  rating?: number
  students?: number
  price?: number
  thumbnail?: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

interface LearningGoal {
  id: string
  title: string
  category: string
  targetDate: string
  progress: number
  skills: string[]
  priority: string
}

interface SkillGap {
  skill: string
  currentLevel: number
  targetLevel: number
  importance: number
  recommendations: string[]
}

const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    type: 'course',
    title: 'Advanced React Patterns & Performance',
    description: 'Master advanced React concepts including render optimization, custom hooks, and state management patterns.',
    confidence: 95,
    reason: 'Based on your JavaScript proficiency and recent React projects',
    tags: ['React', 'Performance', 'Advanced'],
    instructor: 'Sarah Chen',
    duration: 24,
    difficulty: 'Advanced',
    rating: 4.8,
    students: 3200,
    price: 89.99,
    priority: 'high',
    category: 'Technology'
  },
  {
    id: '2',
    type: 'path',
    title: 'Full-Stack Developer Career Path',
    description: 'Complete roadmap from frontend to backend, including databases, APIs, and deployment.',
    confidence: 88,
    reason: 'Aligns with your career goal of becoming a full-stack developer',
    tags: ['Full-Stack', 'Career', 'Comprehensive'],
    duration: 120,
    difficulty: 'Intermediate',
    priority: 'high',
    category: 'Technology'
  },
  {
    id: '3',
    type: 'mentor',
    title: 'Weekly 1:1 with Senior Developer',
    description: 'Personalized mentoring sessions to accelerate your learning and career growth.',
    confidence: 92,
    reason: 'Recommended for rapid skill development and career guidance',
    tags: ['Mentoring', 'Career', 'Personalized'],
    instructor: 'Alex Rodriguez',
    difficulty: 'All Levels',
    price: 150,
    priority: 'medium',
    category: 'Career'
  }
]

const mockGoals: LearningGoal[] = [
  {
    id: '1',
    title: 'Become Full-Stack Developer',
    category: 'Technology',
    targetDate: '2024-12-31',
    progress: 65,
    skills: ['React', 'Node.js', 'MongoDB', 'DevOps'],
    priority: 'high'
  },
  {
    id: '2',
    title: 'Master UI/UX Design',
    category: 'Design',
    targetDate: '2024-08-15',
    progress: 40,
    skills: ['Figma', 'User Research', 'Prototyping'],
    priority: 'medium'
  }
]

const mockSkillGaps: SkillGap[] = [
  {
    skill: 'TypeScript',
    currentLevel: 3,
    targetLevel: 8,
    importance: 9,
    recommendations: ['TypeScript Fundamentals', 'Advanced TypeScript Patterns']
  },
  {
    skill: 'System Design',
    currentLevel: 2,
    targetLevel: 7,
    importance: 8,
    recommendations: ['System Design Principles', 'Scalable Architecture']
  }
]

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations)
  const [goals, setGoals] = useState<LearningGoal[]>(mockGoals)
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>(mockSkillGaps)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('recommendations')

  const handleRefreshRecommendations = async () => {
    setIsRefreshing(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsRefreshing(false)
  }

  const handleFeedback = (id: string, liked: boolean) => {
    // Handle recommendation feedback
    console.log(`Feedback for ${id}: ${liked ? 'liked' : 'disliked'}`)
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100'
    if (confidence >= 70) return 'text-blue-600 bg-blue-100'
    if (confidence >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const RecommendationCard = ({ recommendation }: { recommendation: Recommendation }) => (
    <Card className={`border-l-4 ${getPriorityColor(recommendation.priority)} hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                {recommendation.type === 'course' && <BookOpen className="w-5 h-5 text-blue-600" />}
                {recommendation.type === 'path' && <Target className="w-5 h-5 text-blue-600" />}
                {recommendation.type === 'mentor' && <Users className="w-5 h-5 text-blue-600" />}
                {recommendation.type === 'project' && <Rocket className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                <Badge variant="outline" className="text-xs capitalize mt-1">
                  {recommendation.type}
                </Badge>
              </div>
            </div>
            <Badge className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
              {recommendation.confidence}% match
            </Badge>
          </div>

          {/* Description */}
          <p className="text-gray-700">{recommendation.description}</p>

          {/* AI Reason */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">AI Insight</span>
            </div>
            <p className="text-sm text-purple-700">{recommendation.reason}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {recommendation.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
            {recommendation.duration && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{recommendation.duration}h</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Target className="w-4 h-4" />
              <span>{recommendation.difficulty}</span>
            </div>
            {recommendation.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{recommendation.rating}</span>
              </div>
            )}
            {recommendation.price && (
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-green-600">${recommendation.price}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(recommendation.id, true)}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(recommendation.id, false)}
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button size="sm">
                Start Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const GoalCard = ({ goal }: { goal: LearningGoal }) => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{goal.title}</h3>
              <p className="text-sm text-gray-600">Target: {new Date(goal.targetDate).toLocaleDateString()}</p>
            </div>
            <Badge variant={goal.priority === 'high' ? 'default' : 'secondary'} className="text-xs">
              {goal.priority} priority
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{goal.progress}%</span>
            </div>
            <Progress value={goal.progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Skills</span>
            <div className="flex flex-wrap gap-2">
              {goal.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <Target className="w-4 h-4 mr-2" />
            View Roadmap
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const SkillGapCard = ({ skillGap }: { skillGap: SkillGap }) => (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{skillGap.skill}</h3>
            <Badge variant="outline" className="text-xs">
              Priority: {skillGap.importance}/10
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Current Level</span>
              <span>{skillGap.currentLevel}/10</span>
            </div>
            <Progress value={skillGap.currentLevel * 10} className="h-2" />

            <div className="flex items-center justify-between text-sm">
              <span>Target Level</span>
              <span>{skillGap.targetLevel}/10</span>
            </div>
            <Progress value={skillGap.targetLevel * 10} className="h-2" />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Recommended Learning</span>
            <div className="space-y-1">
              {skillGap.recommendations.map((rec, index) => (
                <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                  • {rec}
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full">
            <BookOpen className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Brain className="w-8 h-8 mr-3 text-purple-600" />
              AI Learning Assistant
            </h1>
            <p className="text-gray-600">Personalized recommendations powered by machine learning</p>
          </div>
          <Button
            onClick={handleRefreshRecommendations}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-1">AI Accuracy</h3>
            <p className="text-2xl font-bold text-purple-600">94.2%</p>
            <p className="text-sm text-gray-600">Recommendation precision</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-1">Learning Progress</h3>
            <p className="text-2xl font-bold text-blue-600">+127%</p>
            <p className="text-sm text-gray-600">Faster skill acquisition</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-1">Goal Achievement</h3>
            <p className="text-2xl font-bold text-green-600">89%</p>
            <p className="text-sm text-gray-600">Success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            <Lightbulb className="w-4 h-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="goals">
            <Target className="w-4 h-4 mr-2" />
            Learning Goals
          </TabsTrigger>
          <TabsTrigger value="gaps">
            <TrendingUp className="w-4 h-4 mr-2" />
            Skill Gaps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personalized Recommendations</h2>
            <Badge variant="secondary">
              {recommendations.length} suggestions
            </Badge>
          </div>

          <div className="space-y-6">
            {recommendations.map((recommendation) => (
              <RecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learning Goals</h2>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Add Goal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Skill Gap Analysis</h2>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Analyze Skills
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillGaps.map((skillGap, index) => (
              <SkillGapCard key={index} skillGap={skillGap} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}