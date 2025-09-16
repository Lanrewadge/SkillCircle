'use client'

import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Users,
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
  MapPin,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-blue-100 text-lg">
          You have 2 upcoming sessions and 3 new messages waiting for you.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
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
            <CardTitle className="text-sm font-medium">Skills Taught</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Across 3 categories
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
              +20% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Your Skills</span>
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
              Add New Skill
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Upcoming Sessions</span>
            </CardTitle>
            <CardDescription>
              Your scheduled learning sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{session.skill}</h3>
                  <p className="text-sm text-gray-600">with {session.student}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{session.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{session.date}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Sessions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Recent Messages</span>
          </CardTitle>
          <CardDescription>
            Latest messages from your students
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockMessages.map((message) => (
            <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {message.from.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{message.from}</h4>
                  <span className="text-sm text-gray-500">{message.time}</span>
                </div>
                <p className="text-gray-600 mt-1">{message.message}</p>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">
            View All Messages
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}