'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  Target,
  TrendingUp,
  Award,
  PlayCircle,
  Pause,
  SkipForward,
  Calendar,
  Users,
  Brain,
  Lightbulb,
  Zap,
  Trophy,
  ChevronRight,
  Plus,
  Filter,
  Search,
  BarChart3,
  Timer,
  Video,
  FileText,
  Code,
  Headphones,
  Download,
  Share2
} from 'lucide-react'
import { Input } from '@/components/ui/input'

interface LearningPath {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  duration: string
  progress: number
  totalModules: number
  completedModules: number
  instructor: {
    name: string
    avatar: string
    rating: number
  }
  skills: string[]
  nextSession?: Date
  estimatedCompletion: string
  certificate: boolean
  enrolled: boolean
}

interface LearningModule {
  id: string
  title: string
  type: 'video' | 'reading' | 'quiz' | 'project' | 'live-session'
  duration: number
  completed: boolean
  progress: number
  dueDate?: Date
  resources: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  points: number
  category: string
}

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Complete React Development',
    description: 'Master React from basics to advanced concepts including hooks, context, and state management.',
    category: 'Web Development',
    difficulty: 'Intermediate',
    duration: '8 weeks',
    progress: 65,
    totalModules: 12,
    completedModules: 8,
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      rating: 4.9
    },
    skills: ['React', 'JavaScript', 'JSX', 'Hooks', 'State Management'],
    nextSession: new Date(Date.now() + 24 * 60 * 60 * 1000),
    estimatedCompletion: '3 weeks',
    certificate: true,
    enrolled: true
  },
  {
    id: '2',
    title: 'Python for Data Science',
    description: 'Learn Python programming with focus on data analysis, visualization, and machine learning.',
    category: 'Data Science',
    difficulty: 'Beginner',
    duration: '10 weeks',
    progress: 30,
    totalModules: 15,
    completedModules: 4,
    instructor: {
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg',
      rating: 4.8
    },
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn'],
    nextSession: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    estimatedCompletion: '7 weeks',
    certificate: true,
    enrolled: true
  },
  {
    id: '3',
    title: 'Full Stack JavaScript',
    description: 'Complete full-stack development with Node.js, Express, MongoDB, and React.',
    category: 'Full Stack',
    difficulty: 'Advanced',
    duration: '12 weeks',
    progress: 0,
    totalModules: 18,
    completedModules: 0,
    instructor: {
      name: 'Alex Rodriguez',
      avatar: '/avatars/alex.jpg',
      rating: 4.7
    },
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'JavaScript'],
    estimatedCompletion: '12 weeks',
    certificate: true,
    enrolled: false
  }
]

const mockCurrentModules: LearningModule[] = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    type: 'video',
    duration: 45,
    completed: false,
    progress: 60,
    resources: 3
  },
  {
    id: '2',
    title: 'State Management with Context',
    type: 'live-session',
    duration: 90,
    completed: false,
    progress: 0,
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    resources: 5
  },
  {
    id: '3',
    title: 'Building a Todo App',
    type: 'project',
    duration: 120,
    completed: true,
    progress: 100,
    resources: 8
  },
  {
    id: '4',
    title: 'React Performance Quiz',
    type: 'quiz',
    duration: 15,
    completed: true,
    progress: 100,
    resources: 1
  }
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Completed your first learning module',
    icon: '🎯',
    unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    points: 50,
    category: 'Progress'
  },
  {
    id: '2',
    title: 'Speed Learner',
    description: 'Completed 5 modules in one week',
    icon: '⚡',
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    points: 100,
    category: 'Speed'
  },
  {
    id: '3',
    title: 'Quiz Master',
    description: 'Scored 100% on 10 quizzes',
    icon: '🧠',
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    points: 200,
    category: 'Knowledge'
  }
]

const learningStats = [
  {
    label: 'Learning Streak',
    value: '12',
    unit: 'days',
    change: '+3 this week',
    icon: Zap,
    color: 'text-orange-600'
  },
  {
    label: 'Hours This Week',
    value: '8.5',
    unit: 'hours',
    change: '+2.1 from last week',
    icon: Clock,
    color: 'text-blue-600'
  },
  {
    label: 'Modules Completed',
    value: '24',
    unit: 'modules',
    change: '+6 this month',
    icon: CheckCircle2,
    color: 'text-green-600'
  },
  {
    label: 'Achievement Points',
    value: '1,250',
    unit: 'points',
    change: '+350 this month',
    icon: Trophy,
    color: 'text-purple-600'
  }
]

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState('paths')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const getModuleIcon = (type: string) => {
    const icons = {
      video: Video,
      reading: FileText,
      quiz: Brain,
      project: Code,
      'live-session': Users
    }
    return icons[type as keyof typeof icons] || BookOpen
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: 'bg-green-100 text-green-800',
      Intermediate: 'bg-yellow-100 text-yellow-800',
      Advanced: 'bg-orange-100 text-orange-800',
      Expert: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors]
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-gray-600">Track your progress and continue your learning journey</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Browse Courses
          </Button>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {learningStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.unit}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="current">Current Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="paths" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search learning paths..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Learning Paths Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{path.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                      </div>
                      {path.enrolled && (
                        <Badge className="bg-blue-100 text-blue-800">Enrolled</Badge>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {path.duration}
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {path.category}
                      </div>
                    </div>

                    {/* Progress */}
                    {path.enrolled && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-gray-600">
                            {path.completedModules}/{path.totalModules} modules
                          </span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          {path.estimatedCompletion} remaining
                        </p>
                      </div>
                    )}

                    {/* Instructor */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={path.instructor.avatar} />
                        <AvatarFallback>{path.instructor.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{path.instructor.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{path.instructor.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {path.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      {path.enrolled ? (
                        <>
                          <Button className="flex-1">
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Learning
                          </Button>
                          {path.nextSession && (
                            <Button variant="outline" size="sm">
                              <Calendar className="h-4 w-4 mr-2" />
                              Next Session
                            </Button>
                          )}
                        </>
                      ) : (
                        <>
                          <Button className="flex-1">
                            <Plus className="h-4 w-4 mr-2" />
                            Enroll Now
                          </Button>
                          <Button variant="outline" size="sm">
                            Preview
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Learning Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCurrentModules.map((module) => {
                  const ModuleIcon = getModuleIcon(module.type)
                  return (
                    <div
                      key={module.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        module.completed ? 'bg-green-50 border-green-200' : 'bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        module.completed ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {module.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <ModuleIcon className="h-5 w-5 text-blue-600" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${
                            module.completed ? 'text-green-800' : 'text-gray-900'
                          }`}>
                            {module.title}
                          </h3>
                          <Badge variant="outline" className="text-xs capitalize">
                            {module.type.replace('-', ' ')}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatDuration(module.duration)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {module.resources} resources
                          </span>
                          {module.dueDate && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <Calendar className="h-3 w-3" />
                              Due {module.dueDate.toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        {!module.completed && module.progress > 0 && (
                          <div className="mt-2">
                            <Progress value={module.progress} className="h-1" />
                            <p className="text-xs text-gray-500 mt-1">{module.progress}% complete</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {module.completed ? (
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Resources
                          </Button>
                        ) : (
                          <Button size="sm">
                            {module.progress > 0 ? (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Continue
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{achievement.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{achievement.points} pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Unlocked {achievement.unlockedAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  We're working on a comprehensive scheduling system for your learning sessions
                </p>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Study Reminders
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}