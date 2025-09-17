'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Calendar,
  DollarSign,
  Users,
  Star,
  TrendingUp,
  Clock,
  MessageCircle,
  BookOpen,
  Award,
  Target,
  Bell,
  Plus,
  Eye,
  CheckCircle,
  AlertCircle,
  TimerIcon
} from 'lucide-react'
import { format, addDays, isToday, isTomorrow } from 'date-fns'

interface TeachingSkill {
  id: string
  skillName: string
  category: string
  level: string
  hourlyRate: number
  studentsCount: number
  avgRating: number
  totalEarnings: number
  completedSessions: number
  isActive: boolean
}

interface StudentRequest {
  id: string
  studentName: string
  studentAvatar: string
  skillName: string
  preferredDate: Date
  preferredTime: string
  duration: number
  message: string
  budget: number
  status: 'pending' | 'accepted' | 'declined'
}

interface UpcomingSession {
  id: string
  studentName: string
  studentAvatar: string
  skillName: string
  date: Date
  duration: number
  type: 'online' | 'in-person'
  location: string
  status: 'confirmed' | 'pending'
  earnings: number
}

interface Review {
  id: string
  studentName: string
  studentAvatar: string
  skillName: string
  rating: number
  comment: string
  date: Date
}

export default function TutorDashboard() {
  const { user } = useAuthStore()
  const [teachingSkills, setTeachingSkills] = useState<TeachingSkill[]>([])
  const [studentRequests, setStudentRequests] = useState<StudentRequest[]>([])
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([])
  const [recentReviews, setRecentReviews] = useState<Review[]>([])

  useEffect(() => {
    loadTutorData()
  }, [])

  const loadTutorData = () => {
    // Mock teaching skills
    const mockSkills: TeachingSkill[] = [
      {
        id: '1',
        skillName: 'React Development',
        category: 'Technology',
        level: 'Expert',
        hourlyRate: 85,
        studentsCount: 47,
        avgRating: 4.9,
        totalEarnings: 12750,
        completedSessions: 156,
        isActive: true
      },
      {
        id: '2',
        skillName: 'Italian Cooking',
        category: 'Cooking',
        level: 'Advanced',
        hourlyRate: 75,
        studentsCount: 32,
        avgRating: 4.8,
        totalEarnings: 8900,
        completedSessions: 89,
        isActive: true
      },
      {
        id: '3',
        skillName: 'Spanish Language',
        category: 'Languages',
        level: 'Expert',
        hourlyRate: 45,
        studentsCount: 28,
        avgRating: 4.7,
        totalEarnings: 3200,
        completedSessions: 64,
        isActive: false
      }
    ]

    // Mock student requests
    const mockRequests: StudentRequest[] = [
      {
        id: '1',
        studentName: 'Alice Johnson',
        studentAvatar: '/avatars/alice.jpg',
        skillName: 'React Development',
        preferredDate: addDays(new Date(), 2),
        preferredTime: '14:00',
        duration: 90,
        message: 'I want to learn React hooks and state management. I have basic JavaScript knowledge.',
        budget: 85,
        status: 'pending'
      },
      {
        id: '2',
        studentName: 'Bob Wilson',
        studentAvatar: '/avatars/bob.jpg',
        skillName: 'Italian Cooking',
        preferredDate: addDays(new Date(), 1),
        preferredTime: '16:00',
        duration: 120,
        message: 'Interested in learning pasta making techniques. Complete beginner.',
        budget: 75,
        status: 'pending'
      },
      {
        id: '3',
        studentName: 'Carol Davis',
        studentAvatar: '/avatars/carol.jpg',
        skillName: 'React Development',
        preferredDate: addDays(new Date(), 3),
        preferredTime: '10:00',
        duration: 60,
        message: 'Need help with React testing and Jest.',
        budget: 85,
        status: 'accepted'
      }
    ]

    // Mock upcoming sessions
    const mockSessions: UpcomingSession[] = [
      {
        id: '1',
        studentName: 'David Park',
        studentAvatar: '/avatars/david.jpg',
        skillName: 'React Development',
        date: new Date('2025-09-20T14:00:00'),
        duration: 90,
        type: 'online',
        location: 'Zoom Meeting',
        status: 'confirmed',
        earnings: 127.50
      },
      {
        id: '2',
        studentName: 'Emma Chen',
        studentAvatar: '/avatars/emma.jpg',
        skillName: 'Italian Cooking',
        date: new Date('2025-09-21T16:00:00'),
        duration: 120,
        type: 'in-person',
        location: 'Kitchen Studio',
        status: 'confirmed',
        earnings: 150.00
      }
    ]

    // Mock recent reviews
    const mockReviews: Review[] = [
      {
        id: '1',
        studentName: 'Sarah Kim',
        studentAvatar: '/avatars/sarah.jpg',
        skillName: 'React Development',
        rating: 5,
        comment: 'Excellent teacher! Very patient and knowledgeable. Helped me understand hooks perfectly.',
        date: new Date('2025-09-15')
      },
      {
        id: '2',
        studentName: 'Mike Johnson',
        studentAvatar: '/avatars/mike.jpg',
        skillName: 'Italian Cooking',
        rating: 5,
        comment: 'Amazing cooking session! Learned to make authentic carbonara. Highly recommend!',
        date: new Date('2025-09-14')
      }
    ]

    setTeachingSkills(mockSkills)
    setStudentRequests(mockRequests)
    setUpcomingSessions(mockSessions)
    setRecentReviews(mockReviews)
  }

  const getTotalEarnings = () => {
    return teachingSkills.reduce((sum, skill) => sum + skill.totalEarnings, 0)
  }

  const getTotalStudents = () => {
    return teachingSkills.reduce((sum, skill) => sum + skill.studentsCount, 0)
  }

  const getAverageRating = () => {
    const total = teachingSkills.reduce((sum, skill) => sum + skill.avgRating * skill.studentsCount, 0)
    const totalStudents = getTotalStudents()
    return totalStudents > 0 ? (total / totalStudents).toFixed(1) : '0.0'
  }

  const getPendingRequests = () => {
    return studentRequests.filter(req => req.status === 'pending').length
  }

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    setStudentRequests(requests =>
      requests.map(req =>
        req.id === requestId ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' } : req
      )
    )
  }

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👨‍🏫</h1>
        <p className="text-green-100 mb-6">Ready to inspire and teach today?</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">${getTotalEarnings().toLocaleString()}</div>
            <div className="text-green-100 text-sm">Total Earnings</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{getTotalStudents()}</div>
            <div className="text-green-100 text-sm">Total Students</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{getAverageRating()}</div>
            <div className="text-green-100 text-sm">Avg Rating</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4">
            <div className="text-2xl font-bold">{getPendingRequests()}</div>
            <div className="text-green-100 text-sm">New Requests</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Student Requests */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Student Requests
                  {getPendingRequests() > 0 && (
                    <Badge className="bg-red-500">{getPendingRequests()}</Badge>
                  )}
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/calendar">View Calendar</Link>
                </Button>
              </div>
              <CardDescription>Review and respond to student booking requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentRequests.filter(req => req.status === 'pending').map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.studentAvatar} />
                      <AvatarFallback>{request.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{request.studentName}</h3>
                        <Badge variant="outline">{request.skillName}</Badge>
                      </div>

                      <div className="text-sm text-muted-foreground mb-3 grid grid-cols-2 gap-4">
                        <div>
                          <strong>Preferred Time:</strong><br />
                          {getDateLabel(request.preferredDate)} at {request.preferredTime}
                        </div>
                        <div>
                          <strong>Duration:</strong><br />
                          {request.duration} minutes
                        </div>
                        <div>
                          <strong>Budget:</strong><br />
                          ${request.budget}
                        </div>
                        <div>
                          <strong>Level:</strong><br />
                          Beginner
                        </div>
                      </div>

                      <p className="text-sm bg-gray-50 p-3 rounded border-l-4 border-blue-500 mb-3">
                        "{request.message}"
                      </p>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleRequestAction(request.id, 'accept')}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleRequestAction(request.id, 'decline')}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {studentRequests.filter(req => req.status === 'pending').length === 0 && (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No pending requests at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Teaching Skills Performance */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Teaching Skills
                </CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/skills">Manage Skills</Link>
                </Button>
              </div>
              <CardDescription>Performance overview of your teaching skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {teachingSkills.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold">{skill.skillName}</h3>
                        <p className="text-sm text-muted-foreground">{skill.category} • {skill.level}</p>
                      </div>
                      <Badge variant={skill.isActive ? 'default' : 'secondary'}>
                        {skill.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${skill.hourlyRate}/hr</div>
                      <div className="text-sm text-muted-foreground">${skill.totalEarnings} earned</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-lg font-bold">{skill.studentsCount}</div>
                      <div className="text-muted-foreground">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold flex items-center justify-center gap-1">
                        {skill.avgRating.toFixed(1)} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{skill.completedSessions}</div>
                      <div className="text-muted-foreground">Sessions</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingSessions.filter(session => isToday(session.date)).length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No sessions today</p>
                </div>
              ) : (
                upcomingSessions.filter(session => isToday(session.date)).map((session) => (
                  <div key={session.id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.studentAvatar} />
                        <AvatarFallback>{session.studentName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{session.skillName}</h4>
                        <p className="text-xs text-muted-foreground">with {session.studentName}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">${session.earnings}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration} min)
                      </div>
                      <div className="flex items-center gap-1">
                        <TimerIcon className="h-3 w-3" />
                        {session.location}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Join Session
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

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Recent Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={review.studentAvatar} />
                      <AvatarFallback>{review.studentName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{review.studentName}</h4>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(review.date, 'MMM d')}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{review.skillName}</p>
                  <p className="text-sm mt-2">"{review.comment}"</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/skills/manage">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Skill
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/payments">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Earnings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/dashboard/reviews">
                  <Star className="h-4 w-4 mr-2" />
                  All Reviews
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}