'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  BookOpen,
  Users,
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Settings,
  ArrowRight
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!user) return

    // Redirect users with single roles to their specific dashboards
    if (user.isLearner && !user.isTeacher) {
      router.push('/dashboard/learner')
      return
    }

    if (user.isTeacher && !user.isLearner) {
      router.push('/dashboard/tutor')
      return
    }
  }, [user, router])

  const mockSkills = [
    { id: 1, name: 'React Development', category: 'Technology', students: 12, rating: 4.8 },
    { id: 2, name: 'Italian Cooking', category: 'Cooking', students: 8, rating: 4.9 },
    { id: 3, name: 'Guitar Lessons', category: 'Music', students: 15, rating: 4.7 }
  ]

  const mockSessions = [
    { id: 1, skill: 'React Development', student: 'Alice Johnson', time: '2:00 PM', date: 'Today' },
    { id: 2, skill: 'Italian Cooking', student: 'Bob Smith', time: '4:00 PM', date: 'Tomorrow' }
  ]

  const mockMessages = [
    { id: 1, from: 'Alice Johnson', message: 'Hi! Ready for our React session?', time: '10 min ago' },
    { id: 2, from: 'Bob Smith', message: 'Can we reschedule tomorrows lesson?', time: '1 hour ago' }
  ]

  // Only show this dashboard for users with both roles
  if (!user || (!user.isLearner || !user.isTeacher)) {
    return null // Component will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100 text-lg mb-4">
          You're both a learner and tutor on SkillCircle! Manage both of your experiences here.
        </p>

        {/* Quick Access Buttons */}
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/learner')}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Switch to Learner View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={() => router.push('/dashboard/tutor')}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Switch to Tutor View
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Combined Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">35</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Goals</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              3 in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">
              From 47 reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240</div>
            <p className="text-xs text-muted-foreground">
              Earned as tutor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Role Switcher */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Mode
          </CardTitle>
          <CardDescription>
            Choose which role-specific dashboard to view, or stay here for the combined view
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/learner')}
              className="h-20 flex-col gap-2"
            >
              <BookOpen className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Learner Dashboard</div>
                <div className="text-xs text-muted-foreground">View learning goals & sessions</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/tutor')}
              className="h-20 flex-col gap-2"
            >
              <Users className="h-6 w-6" />
              <div className="text-center">
                <div className="font-medium">Tutor Dashboard</div>
                <div className="text-xs text-muted-foreground">Manage students & earnings</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Teaching Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Teaching Skills</span>
            </CardTitle>
            <CardDescription>
              Skills you&apos;re currently teaching
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSkills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{skill.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{skill.category}</Badge>
                    <span className="text-sm text-gray-600">
                      {skill.students} students
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{skill.rating}</span>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Manage Teaching Skills
            </Button>
          </CardContent>
        </Card>

        {/* Learning Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Learning Progress</span>
            </CardTitle>
            <CardDescription>
              Your active learning goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">Spanish Language</h3>
                  <p className="text-sm text-gray-600">Conversational Level</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">65%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">Piano Playing</h3>
                  <p className="text-sm text-gray-600">Intermediate Level</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">40%</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              View All Learning Goals
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Combined Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Today&apos;s Schedule</span>
          </CardTitle>
          <CardDescription>
            Your teaching and learning sessions for today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg border-l-4 border-l-blue-500">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-blue-600 border-blue-200">Teaching</Badge>
                  <h3 className="font-medium">React Development</h3>
                </div>
                <p className="text-sm text-gray-600">with Alice Johnson</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>2:00 PM</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg border-l-4 border-l-green-500">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-green-600 border-green-200">Learning</Badge>
                  <h3 className="font-medium">Spanish Conversation</h3>
                </div>
                <p className="text-sm text-gray-600">with Maria Gonzalez</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>4:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline" className="w-full">
            View Full Calendar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}