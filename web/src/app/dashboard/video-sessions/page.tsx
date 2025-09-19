'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VideoCallManager } from '@/components/video/VideoCallManager'
import {
  Video,
  Calendar,
  Clock,
  User,
  Filter,
  Plus,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react'

interface VideoSession {
  id: string
  skillName: string
  teacherName: string
  studentName: string
  sessionDate: string
  duration: number
  status: 'scheduled' | 'active' | 'completed' | 'cancelled'
  price: number
  teacherId: string
  studentId: string
}

const mockSessions: VideoSession[] = [
  {
    id: 'session_001',
    skillName: 'React Development Fundamentals',
    teacherName: 'Sarah Chen',
    studentName: 'John Doe',
    sessionDate: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes from now
    duration: 60,
    status: 'scheduled',
    price: 85,
    teacherId: 'teacher_001',
    studentId: 'student_001'
  },
  {
    id: 'session_002',
    skillName: 'Python Data Analysis',
    teacherName: 'James Wilson',
    studentName: 'Jane Smith',
    sessionDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    duration: 90,
    status: 'scheduled',
    price: 120,
    teacherId: 'teacher_002',
    studentId: 'student_002'
  },
  {
    id: 'session_003',
    skillName: 'JavaScript ES6+ Features',
    teacherName: 'Alex Rodriguez',
    studentName: 'Mike Johnson',
    sessionDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    duration: 45,
    status: 'completed',
    price: 60,
    teacherId: 'teacher_003',
    studentId: 'student_003'
  },
  {
    id: 'session_004',
    skillName: 'Advanced TypeScript',
    teacherName: 'Emma Davis',
    studentName: 'Lisa Wang',
    sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    duration: 75,
    status: 'scheduled',
    price: 95,
    teacherId: 'teacher_004',
    studentId: 'student_004'
  }
]

export default function VideoSessionsPage() {
  const [sessions, setSessions] = useState<VideoSession[]>(mockSessions)
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [currentUser] = useState({
    id: 'student_001',
    name: 'John Doe',
    role: 'student' as 'teacher' | 'student'
  })

  // Filter sessions based on current user and status
  const filteredSessions = sessions.filter(session => {
    const isUserInvolved = currentUser.role === 'teacher'
      ? session.teacherId === currentUser.id
      : session.studentId === currentUser.id

    if (!isUserInvolved) return false

    if (filterStatus === 'all') return true
    return session.status === filterStatus
  })

  // Group sessions by status
  const groupedSessions = {
    upcoming: filteredSessions.filter(s => s.status === 'scheduled'),
    active: filteredSessions.filter(s => s.status === 'active'),
    completed: filteredSessions.filter(s => s.status === 'completed'),
    cancelled: filteredSessions.filter(s => s.status === 'cancelled')
  }

  const handleJoinSession = (session: VideoSession) => {
    setActiveSession(session)
  }

  const handleSessionUpdate = (updatedSession: VideoSession) => {
    setSessions(prev =>
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    )
  }

  const handleBackToSessions = () => {
    setActiveSession(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />
      case 'active':
        return <PlayCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatSessionTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 0) {
      return `${Math.abs(diffMins)} minutes ago`
    } else if (diffMins < 60) {
      return `In ${diffMins} minutes`
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60)
      return `In ${hours} hour${hours === 1 ? '' : 's'}`
    } else {
      return date.toLocaleDateString()
    }
  }

  // If there's an active session, show the video call manager
  if (activeSession) {
    return (
      <div className="min-h-screen">
        <div className="p-4 bg-white dark:bg-gray-900 border-b">
          <Button
            variant="outline"
            onClick={handleBackToSessions}
            className="mb-4"
          >
            ← Back to Sessions
          </Button>
        </div>
        <VideoCallManager
          sessionId={activeSession.id}
          sessionInfo={activeSession}
          currentUser={currentUser}
          onSessionUpdate={handleSessionUpdate}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Video Sessions</h1>
        <p className="text-gray-600">
          Manage your upcoming and past skill learning sessions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {groupedSessions.upcoming.length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold text-green-600">
                  {groupedSessions.active.length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-gray-600">
                  {groupedSessions.completed.length}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(groupedSessions.completed.reduce((total, session) => total + session.duration, 0) / 60)}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Upcoming</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value={filterStatus} className="space-y-6">
          {filteredSessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sessions found</h3>
                <p className="text-gray-600 text-center mb-4">
                  {filterStatus === 'all'
                    ? "You don't have any video sessions yet."
                    : `No ${filterStatus} sessions found.`
                  }
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Book a Session
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold">{session.skillName}</h3>
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusIcon(session.status)}
                            <span className="ml-1 capitalize">{session.status}</span>
                          </Badge>
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>
                              {currentUser.role === 'teacher'
                                ? `Student: ${session.studentName}`
                                : `Teacher: ${session.teacherName}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} minutes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatSessionTime(session.sessionDate)}</span>
                          </div>
                        </div>

                        <div className="text-sm text-gray-500">
                          {new Date(session.sessionDate).toLocaleDateString()} at {' '}
                          {new Date(session.sessionDate).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-semibold">${session.price}</div>
                          <div className="text-xs text-gray-500">Session fee</div>
                        </div>

                        <div className="flex space-x-2">
                          {session.status === 'scheduled' && (
                            <Button
                              onClick={() => handleJoinSession(session)}
                              disabled={new Date(session.sessionDate).getTime() - Date.now() > 5 * 60 * 1000}
                            >
                              <Video className="w-4 h-4 mr-2" />
                              {currentUser.role === 'teacher' ? 'Start' : 'Join'}
                            </Button>
                          )}

                          {session.status === 'active' && (
                            <Button
                              onClick={() => handleJoinSession(session)}
                              variant="default"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Rejoin
                            </Button>
                          )}

                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}