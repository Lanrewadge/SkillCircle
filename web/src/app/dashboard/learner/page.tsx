'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Search,
  Calendar,
  BookOpen,
  Users,
  Star,
  TrendingUp,
  Target,
  Clock,
  MessageCircle,
  PlayCircle,
  Award,
  MapPin,
  Filter
} from 'lucide-react'

interface LearningGoal {
  id: string
  skillName: string
  targetLevel: string
  progress: number
  deadline: Date
  teacherName?: string
  sessionsCompleted: number
  totalSessions: number
}

interface RecommendedTeacher {
  id: string
  name: string
  avatar: string
  skillName: string
  rating: number
  reviewCount: number
  hourlyRate: number
  distance: string
  isOnline: boolean
  nextAvailable: string
}

interface UpcomingSession {
  id: string
  skillName: string
  teacherName: string
  teacherAvatar: string
  date: Date
  duration: number
  type: 'online' | 'in-person'
  location: string
  status: 'confirmed' | 'pending'
}

export default function LearnerDashboard() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([])
  const [recommendedTeachers, setRecommendedTeachers] = useState<RecommendedTeacher[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])

  useEffect(() => {
    loadLearnerData()
  }, [])

  const loadLearnerData = () => {
    // Mock learning goals
    const mockGoals: LearningGoal[] = [
      {
        id: '1',
        skillName: 'Spanish Language',
        targetLevel: 'Conversational',
        progress: 65,
        deadline: new Date('2024-06-30'),
        teacherName: 'Maria Gonzalez',
        sessionsCompleted: 8,
        totalSessions: 12
      },
      {
        id: '2',
        skillName: 'Piano Playing',
        targetLevel: 'Intermediate',
        progress: 40,
        deadline: new Date('2024-12-31'),
        teacherName: 'David Kim',
        sessionsCompleted: 6,
        totalSessions: 15
      },
      {
        id: '3',
        skillName: 'React Development',
        targetLevel: 'Advanced',
        progress: 25,
        deadline: new Date('2024-08-15'),
        sessionsCompleted: 3,
        totalSessions: 20
      }
    ]

    // Mock recommended teachers
    const mockTeachers: RecommendedTeacher[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        skillName: 'Italian Cooking',
        rating: 4.9,
        reviewCount: 47,
        hourlyRate: 75,
        distance: '2.3 km away',
        isOnline: true,
        nextAvailable: 'Tomorrow 2:00 PM'
      },
      {
        id: '2',
        name: 'James Thompson',
        avatar: '/avatars/james.jpg',
        skillName: 'Guitar Playing',
        rating: 4.8,
        reviewCount: 32,
        hourlyRate: 60,
        distance: '1.8 km away',
        isOnline: false,
        nextAvailable: 'Today 6:00 PM'
      },
      {
        id: '3',
        name: 'Emma Wilson',
        avatar: '/avatars/emma.jpg',
        skillName: 'Yoga & Meditation',
        rating: 4.9,
        reviewCount: 65,
        hourlyRate: 55,
        distance: '3.1 km away',
        isOnline: true,
        nextAvailable: 'Tomorrow 8:00 AM'
      }
    ]

    // Mock upcoming sessions
    const mockSessions: UpcomingSession[] = [
      {
        id: '1',
        skillName: 'Spanish Conversation',
        teacherName: 'Maria Gonzalez',
        teacherAvatar: '/avatars/maria.jpg',
        date: new Date('2025-09-20T15:00:00'),
        duration: 60,
        type: 'online',
        location: 'Google Meet',
        status: 'confirmed'
      },
      {
        id: '2',
        skillName: 'Piano Fundamentals',
        teacherName: 'David Kim',
        teacherAvatar: '/avatars/david.jpg',
        date: new Date('2025-09-22T14:00:00'),
        duration: 90,
        type: 'in-person',
        location: 'Music Studio',
        status: 'confirmed'
      }
    ]

    setLearningGoals(mockGoals)
    setRecommendedTeachers(mockTeachers)
    setUpcomingSessions(mockSessions)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 25) return 'bg-yellow-500'
    return 'bg-gray-500'
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 🎓</h1>
        <p className="text-blue-100 mb-6">Ready to continue your learning journey?</p>

        {/* Quick Search */}
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for skills or teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Goals</p>
                <p className="text-2xl font-bold">{learningGoals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <PlayCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sessions This Month</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skills Learning</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">43%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Learning Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Learning Goals
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/skills">Manage Goals</Link>
                </Button>
              </div>
              <CardDescription>Track your progress on active learning goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learningGoals.map((goal) => (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{goal.skillName}</h3>
                      <p className="text-sm text-muted-foreground">Target: {goal.targetLevel}</p>
                      {goal.teacherName && (
                        <p className="text-sm text-muted-foreground">with {goal.teacherName}</p>
                      )}
                    </div>
                    <Badge variant="outline">
                      {goal.sessionsCompleted}/{goal.totalSessions} sessions
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {goal.targetLevel}</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                    <span>Due: {goal.deadline.toLocaleDateString()}</span>
                    <Button variant="ghost" size="sm">Continue Learning</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Teachers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Recommended for You
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/browse">View All</Link>
                </Button>
              </div>
              <CardDescription>Teachers who match your learning interests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {recommendedTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.avatar} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {teacher.isOnline && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{teacher.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{teacher.rating}</span>
                          <span className="text-xs text-muted-foreground">({teacher.reviewCount})</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{teacher.skillName}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {teacher.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {teacher.nextAvailable}
                        </span>
                        <span>${teacher.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/book?teacher=${teacher.id}&skill=${teacher.skillName}`}>
                          Book
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No upcoming sessions</p>
                  <Button size="sm" className="mt-2" asChild>
                    <Link href="/dashboard/browse">Book a Session</Link>
                  </Button>
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.teacherAvatar} />
                        <AvatarFallback>{session.teacherName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{session.skillName}</h4>
                        <p className="text-xs text-muted-foreground">with {session.teacherName}</p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {session.date.toLocaleDateString()} at {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/browse">
                  <Search className="h-4 w-4 mr-2" />
                  Find Teachers
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/skills">
                  <Target className="h-4 w-4 mr-2" />
                  Set Learning Goals
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Schedule
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}