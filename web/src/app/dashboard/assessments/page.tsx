'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SkillAssessment } from '@/components/assessment/SkillAssessment'
import { SkillLevelTest } from '@/components/assessment/SkillLevelTest'
import { AssessmentDashboard } from '@/components/assessment/AssessmentDashboard'
import {
  Brain,
  Trophy,
  Target,
  Search,
  Filter,
  Clock,
  Star,
  Users,
  TrendingUp,
  Award,
  PlayCircle,
  BookOpen
} from 'lucide-react'

interface AvailableAssessment {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  questions: number
  attempts: number
  avgScore: number
  participants: number
  certificateAvailable: boolean
  tags: string[]
}

interface AssessmentResult {
  skillId: string
  score: number
  maxScore: number
  percentage: number
  level: string
  timeSpent: number
  answers: Record<string, any>
  feedback: string
  recommendations: string[]
  certificate?: {
    id: string
    url: string
  }
}

interface SkillLevel {
  level: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  score: number
  description: string
  nextSteps: string[]
}

const availableAssessments: AvailableAssessment[] = [
  {
    id: 'react',
    name: 'React Development',
    description: 'Comprehensive assessment covering React fundamentals, hooks, state management, and best practices.',
    category: 'Frontend',
    difficulty: 'intermediate',
    duration: 45,
    questions: 25,
    attempts: 1247,
    avgScore: 73,
    participants: 856,
    certificateAvailable: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Components']
  },
  {
    id: 'javascript',
    name: 'JavaScript ES6+',
    description: 'Test your knowledge of modern JavaScript including ES6+ features, async programming, and design patterns.',
    category: 'Programming',
    difficulty: 'intermediate',
    duration: 40,
    questions: 30,
    attempts: 2156,
    avgScore: 68,
    participants: 1423,
    certificateAvailable: true,
    tags: ['JavaScript', 'ES6', 'Async', 'Programming']
  },
  {
    id: 'typescript',
    name: 'TypeScript Fundamentals',
    description: 'Evaluate your TypeScript skills including type system, interfaces, generics, and advanced patterns.',
    category: 'Programming',
    difficulty: 'intermediate',
    duration: 35,
    questions: 20,
    attempts: 892,
    avgScore: 71,
    participants: 634,
    certificateAvailable: true,
    tags: ['TypeScript', 'Types', 'JavaScript', 'Programming']
  },
  {
    id: 'nodejs',
    name: 'Node.js Backend Development',
    description: 'Assessment of Node.js server development, APIs, databases, and backend architecture.',
    category: 'Backend',
    difficulty: 'advanced',
    duration: 60,
    questions: 35,
    attempts: 743,
    avgScore: 64,
    participants: 521,
    certificateAvailable: true,
    tags: ['Node.js', 'Backend', 'API', 'Server']
  },
  {
    id: 'python',
    name: 'Python Programming',
    description: 'Complete Python assessment covering syntax, data structures, OOP, and popular libraries.',
    category: 'Programming',
    difficulty: 'beginner',
    duration: 50,
    questions: 40,
    attempts: 1834,
    avgScore: 76,
    participants: 1256,
    certificateAvailable: true,
    tags: ['Python', 'Programming', 'Data Structures', 'OOP']
  },
  {
    id: 'sql',
    name: 'SQL & Database Design',
    description: 'Test your database knowledge including SQL queries, joins, indexing, and database design principles.',
    category: 'Database',
    difficulty: 'intermediate',
    duration: 30,
    questions: 25,
    attempts: 1123,
    avgScore: 69,
    participants: 789,
    certificateAvailable: false,
    tags: ['SQL', 'Database', 'Queries', 'Design']
  }
]

export default function AssessmentsPage() {
  const [activeView, setActiveView] = useState<'browse' | 'assessment' | 'level-test' | 'dashboard'>('browse')
  const [selectedAssessment, setSelectedAssessment] = useState<AvailableAssessment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')

  // Filter assessments
  const filteredAssessments = availableAssessments.filter(assessment => {
    const matchesSearch = assessment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assessment.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || assessment.category.toLowerCase() === categoryFilter
    const matchesDifficulty = difficultyFilter === 'all' || assessment.difficulty === difficultyFilter

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const categories = Array.from(new Set(availableAssessments.map(a => a.category)))

  const handleStartAssessment = (assessment: AvailableAssessment, type: 'full' | 'level-test') => {
    setSelectedAssessment(assessment)
    setActiveView(type === 'full' ? 'assessment' : 'level-test')
  }

  const handleAssessmentComplete = (result: AssessmentResult) => {
    console.log('Assessment completed:', result)
    setActiveView('dashboard')
    setSelectedAssessment(null)
  }

  const handleLevelTestComplete = (level: SkillLevel) => {
    console.log('Level test completed:', level)
    setActiveView('browse')
    setSelectedAssessment(null)
  }

  const handleCancel = () => {
    setActiveView('browse')
    setSelectedAssessment(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Render based on active view
  if (activeView === 'assessment' && selectedAssessment) {
    return (
      <SkillAssessment
        skillId={selectedAssessment.id}
        skillName={selectedAssessment.name}
        level={selectedAssessment.difficulty}
        onComplete={handleAssessmentComplete}
        onCancel={handleCancel}
      />
    )
  }

  if (activeView === 'level-test' && selectedAssessment) {
    return (
      <SkillLevelTest
        skillName={selectedAssessment.name}
        onComplete={handleLevelTestComplete}
        onCancel={handleCancel}
      />
    )
  }

  if (activeView === 'dashboard') {
    return <AssessmentDashboard userId="current-user" />
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Skill Assessments</h1>
        <p className="text-gray-600">
          Test your skills, earn certificates, and track your learning progress
        </p>
      </div>

      <Tabs defaultValue="browse" value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Assessments</TabsTrigger>
          <TabsTrigger value="dashboard">My Results</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Tests</p>
                    <p className="text-2xl font-bold text-blue-600">{availableAssessments.length}</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Participants</p>
                    <p className="text-2xl font-bold text-green-600">
                      {availableAssessments.reduce((sum, a) => sum + a.participants, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(availableAssessments.reduce((sum, a) => sum + a.avgScore, 0) / availableAssessments.length)}%
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {availableAssessments.filter(a => a.certificateAvailable).length}
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search assessments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((assessment) => (
              <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{assessment.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {assessment.description}
                      </CardDescription>
                    </div>
                    {assessment.certificateAvailable && (
                      <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(assessment.difficulty)}>
                      {assessment.difficulty}
                    </Badge>
                    <Badge variant="outline">{assessment.category}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{assessment.duration}min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="w-3 h-3" />
                      <span>{assessment.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{assessment.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{assessment.avgScore}% avg</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleStartAssessment(assessment, 'level-test')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Quick Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleStartAssessment(assessment, 'full')}
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Full Assessment
                    </Button>
                  </div>

                  {assessment.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {assessment.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAssessments.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No assessments found</h3>
                <p className="text-gray-600 text-center">
                  Try adjusting your search terms or filters to find assessments
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="dashboard">
          <AssessmentDashboard userId="current-user" />
        </TabsContent>
      </Tabs>
    </div>
  )
}