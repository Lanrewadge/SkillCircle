'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VideoCallModal from '@/components/video/VideoCallModal'
import {
  Video,
  VideoOff,
  Calendar,
  Clock,
  Users,
  Phone,
  Monitor,
  Settings,
  Search,
  Play,
  Pause,
  RotateCcw,
  Star,
  Download,
  Share2,
  Plus
} from 'lucide-react'

const upcomingSessions = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    participant: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '👩‍🏫',
      role: 'tutor' as const
    },
    scheduledTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    duration: 60,
    status: 'scheduled',
    sessionType: 'lesson'
  },
  {
    id: '2',
    title: 'React Hooks Deep Dive',
    participant: {
      id: '3',
      name: 'Michael Chen',
      avatar: '👨‍💻',
      role: 'learner' as const
    },
    scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    duration: 90,
    status: 'scheduled',
    sessionType: 'practice'
  }
]

const recentSessions = [
  {
    id: '3',
    title: 'Python Data Analysis',
    participant: {
      id: '4',
      name: 'Emma Wilson',
      avatar: '👩‍🎨',
      role: 'tutor' as const
    },
    completedTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
    duration: 75,
    rating: 5,
    hasRecording: true,
    sessionType: 'lesson'
  },
  {
    id: '4',
    title: 'UI/UX Design Principles',
    participant: {
      id: '5',
      name: 'David Park',
      avatar: '👨‍🚀',
      role: 'learner' as const
    },
    completedTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    duration: 60,
    rating: 4,
    hasRecording: true,
    sessionType: 'consultation'
  }
]

const quickStats = [
  {
    label: 'Sessions This Week',
    value: '8',
    change: '+2 from last week',
    icon: Video,
    color: 'text-blue-600'
  },
  {
    label: 'Total Hours',
    value: '24.5',
    change: '+3.2 this week',
    icon: Clock,
    color: 'text-green-600'
  },
  {
    label: 'Average Rating',
    value: '4.9',
    change: '+0.1 this month',
    icon: Star,
    color: 'text-yellow-600'
  },
  {
    label: 'Connection Quality',
    value: '98%',
    change: 'Excellent',
    icon: Monitor,
    color: 'text-purple-600'
  }
]

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedSession, setSelectedSession] = useState<any>(null)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const startVideoCall = (session: any) => {
    setSelectedSession(session)
    setShowVideoModal(true)
  }

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.replace('-', ' ')}
      </Badge>
    )
  }

  const getSessionTypeColor = (type: string) => {
    const colors = {
      lesson: 'text-blue-600',
      practice: 'text-green-600',
      consultation: 'text-purple-600',
      review: 'text-orange-600'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600'
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Video Sessions</h1>
          <p className="text-gray-600">Manage your video calls and recorded sessions</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Call Settings
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
                <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
              </TabsList>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingSessions.map((session) => {
                const { date, time } = formatDateTime(session.scheduledTime)
                return (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{session.participant.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{session.title}</h3>
                              {getStatusBadge(session.status)}
                              <Badge variant="outline" className={getSessionTypeColor(session.sessionType)}>
                                {session.sessionType}
                              </Badge>
                            </div>
                            <p className="text-gray-600">with {session.participant.name}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {date} at {time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.duration} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => startVideoCall(session)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              {recentSessions.map((session) => {
                const { date, time } = formatDateTime(session.completedTime)
                return (
                  <Card key={session.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{session.participant.avatar}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{session.title}</h3>
                              <Badge variant="outline" className={getSessionTypeColor(session.sessionType)}>
                                {session.sessionType}
                              </Badge>
                              {session.hasRecording && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  <Play className="h-3 w-3 mr-1" />
                                  Recorded
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600">with {session.participant.name}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {date} at {time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.duration} min
                              </span>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < session.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.hasRecording && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Watch
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>

            <TabsContent value="recordings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Session Recordings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recordings found</h3>
                    <p className="text-gray-600 mb-4">Your recorded sessions will appear here</p>
                    <Button variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Enable Recording
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-green-600 hover:bg-green-700">
                <Video className="h-4 w-4 mr-2" />
                Start Instant Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Join by Room ID
              </Button>
            </CardContent>
          </Card>

          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Device Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Camera</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Microphone</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Ready</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Connection</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Excellent</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Test Devices
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p>Completed session with Sarah Johnson</p>
                    <p className="text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p>Scheduled session for tomorrow</p>
                    <p className="text-gray-500">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p>Updated call preferences</p>
                    <p className="text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Video Call Modal */}
      {selectedSession && (
        <VideoCallModal
          isOpen={showVideoModal}
          onClose={() => {
            setShowVideoModal(false)
            setSelectedSession(null)
          }}
          participant={selectedSession.participant}
          session={{
            id: selectedSession.id,
            title: selectedSession.title,
            duration: selectedSession.duration,
            startTime: selectedSession.scheduledTime || new Date()
          }}
        />
      )}
    </div>
  )
}