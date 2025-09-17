'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, Clock, MapPin, User, Star, MessageCircle, Video, DollarSign, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/authStore'
import { sessionsApi } from '@/lib/api'
import { formatDistanceToNow, format, addDays, startOfWeek, endOfWeek, isSameDay, isToday, startOfMonth, endOfMonth, getDaysInMonth, getDay } from 'date-fns'

interface Session {
  id: string
  title: string
  teacherId: string
  teacherName: string
  teacherAvatar: string
  learnerId: string
  learnerName: string
  learnerAvatar: string
  skillId: string
  skillName: string
  skillIcon: string
  scheduledAt: Date
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  meetingType: 'in-person' | 'online'
  location: string
  price: number
  currency: string
  notes?: string
}

export default function CalendarPage() {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setLoading(true)

      // Mock sessions data
      const mockSessions: Session[] = [
        {
          id: '1',
          title: 'Italian Pasta Making Basics',
          teacherId: '1',
          teacherName: 'Sarah Chen',
          teacherAvatar: '/avatars/sarah.jpg',
          learnerId: '6',
          learnerName: 'David Park',
          learnerAvatar: '/avatars/david.jpg',
          skillId: '1',
          skillName: 'Italian Cooking',
          skillIcon: '🍝',
          scheduledAt: new Date('2025-09-20T14:00:00'),
          duration: 120,
          status: 'confirmed',
          meetingType: 'in-person',
          location: 'Sarah\'s Kitchen Studio',
          price: 75,
          currency: 'USD',
          notes: 'Bring apron and notebook for recipes'
        },
        {
          id: '2',
          title: 'React Hooks Deep Dive',
          teacherId: '2',
          teacherName: 'Alex Rodriguez',
          teacherAvatar: '/avatars/alex.jpg',
          learnerId: '6',
          learnerName: 'David Park',
          learnerAvatar: '/avatars/david.jpg',
          skillId: '2',
          skillName: 'React Development',
          skillIcon: '⚛️',
          scheduledAt: new Date('2025-09-18T16:00:00'),
          duration: 90,
          status: 'confirmed',
          meetingType: 'online',
          location: 'Zoom Meeting',
          price: 85,
          currency: 'USD',
          notes: 'Please have VS Code and Node.js installed'
        },
        {
          id: '3',
          title: 'Guitar Fundamentals',
          teacherId: '4',
          teacherName: 'James Thompson',
          teacherAvatar: '/avatars/james.jpg',
          learnerId: '6',
          learnerName: 'David Park',
          learnerAvatar: '/avatars/david.jpg',
          skillId: '4',
          skillName: 'Guitar Playing',
          skillIcon: '🎸',
          scheduledAt: new Date('2025-09-15T10:00:00'),
          duration: 60,
          status: 'completed',
          meetingType: 'in-person',
          location: 'Music Studio Downtown',
          price: 60,
          currency: 'USD'
        },
        {
          id: '4',
          title: 'Spanish Conversation Practice',
          teacherId: '3',
          teacherName: 'Maria Gonzalez',
          teacherAvatar: '/avatars/maria.jpg',
          learnerId: '6',
          learnerName: 'David Park',
          learnerAvatar: '/avatars/david.jpg',
          skillId: '3',
          skillName: 'Spanish Language',
          skillIcon: '🇪🇸',
          scheduledAt: new Date('2025-09-22T11:00:00'),
          duration: 60,
          status: 'scheduled',
          meetingType: 'online',
          location: 'Google Meet',
          price: 45,
          currency: 'USD'
        },
        {
          id: '5',
          title: 'Yoga Basics',
          teacherId: '5',
          teacherName: 'Emma Wilson',
          teacherAvatar: '/avatars/emma.jpg',
          learnerId: '6',
          learnerName: 'David Park',
          learnerAvatar: '/avatars/david.jpg',
          skillId: '5',
          skillName: 'Yoga & Meditation',
          skillIcon: '🧘',
          scheduledAt: new Date('2025-09-19T08:00:00'),
          duration: 75,
          status: 'confirmed',
          meetingType: 'in-person',
          location: 'Wellness Center',
          price: 55,
          currency: 'USD'
        }
      ]

      setSessions(mockSessions)
    } catch (error) {
      console.error('Failed to load sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500'
      case 'confirmed':
        return 'bg-green-500'
      case 'in_progress':
        return 'bg-purple-500'
      case 'completed':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'no_show':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'month') {
      setCurrentDate(prev => {
        const newDate = new Date(prev)
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1))
        return newDate
      })
    } else if (viewMode === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7))
    } else {
      setCurrentDate(prev => addDays(prev, direction === 'next' ? 1 : -1))
    }
  }

  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => isSameDay(session.scheduledAt, date))
  }

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const weeks = []
    let currentWeekStart = startDate

    while (currentWeekStart <= endDate) {
      const week = []
      for (let i = 0; i < 7; i++) {
        const day = addDays(currentWeekStart, i)
        const daySessions = getSessionsForDate(day)
        const isCurrentMonth = day.getMonth() === currentDate.getMonth()
        const isCurrentDay = isToday(day)

        week.push(
          <div
            key={day.toISOString()}
            className={`min-h-[120px] border border-gray-200 p-2 ${
              isCurrentMonth ? 'bg-white' : 'bg-gray-50'
            } ${isCurrentDay ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className={`text-sm font-medium mb-1 ${
              isCurrentDay ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
            }`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {daySessions.map(session => (
                <div
                  key={session.id}
                  className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 text-white ${getStatusColor(session.status)}`}
                  onClick={() => {
                    setSelectedSession(session)
                    setIsDetailsOpen(true)
                  }}
                >
                  <div className="font-medium truncate">{format(session.scheduledAt, 'HH:mm')}</div>
                  <div className="truncate">{session.title}</div>
                </div>
              ))}
            </div>
          </div>
        )
      }
      weeks.push(
        <div key={currentWeekStart.toISOString()} className="grid grid-cols-7">
          {week}
        </div>
      )
      currentWeekStart = addDays(currentWeekStart, 7)
    }

    return (
      <div className="space-y-0">
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-100">
              {day}
            </div>
          ))}
        </div>
        {weeks}
      </div>
    )
  }

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate)
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const daySessions = getSessionsForDate(day)
            const isCurrentDay = isToday(day)

            return (
              <div key={day.toISOString()} className={`border rounded-lg p-3 min-h-[300px] ${
                isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
              }`}>
                <div className={`font-semibold text-center mb-3 ${
                  isCurrentDay ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'EEE d')}
                </div>
                <div className="space-y-2">
                  {daySessions.map(session => (
                    <div
                      key={session.id}
                      className={`text-xs p-2 rounded cursor-pointer hover:opacity-80 text-white ${getStatusColor(session.status)}`}
                      onClick={() => {
                        setSelectedSession(session)
                        setIsDetailsOpen(true)
                      }}
                    >
                      <div className="font-medium">{format(session.scheduledAt, 'HH:mm')}</div>
                      <div className="truncate">{session.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span>{session.skillIcon}</span>
                        <span className="truncate">{session.teacherName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const daySessions = getSessionsForDate(currentDate).sort((a, b) =>
      a.scheduledAt.getTime() - b.scheduledAt.getTime()
    )

    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-2xl font-bold">{format(currentDate, 'EEEE')}</h3>
          <p className="text-gray-600">{format(currentDate, 'MMMM d, yyyy')}</p>
        </div>

        {daySessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No sessions today</h3>
              <p className="text-gray-600">Your schedule is clear for today.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {daySessions.map(session => (
              <Card key={session.id} className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedSession(session)
                  setIsDetailsOpen(true)
                }}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-12 rounded ${getStatusColor(session.status)}`} />
                    <div className="text-2xl">{session.skillIcon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{session.title}</h3>
                      <p className="text-sm text-gray-600">with {session.teacherName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>{format(session.scheduledAt, 'HH:mm')} - {format(addDays(session.scheduledAt, 0), 'HH:mm')}</span>
                        <span>{session.location}</span>
                        <span>${session.price}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} text-white`}>
                      {session.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your session schedule
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
            {viewMode === 'week' && `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`}
            {viewMode === 'day' && format(currentDate, 'MMMM d, yyyy')}
          </h2>

          <Button variant="outline" onClick={() => navigateDate('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>

          <Select value={viewMode} onValueChange={(value: 'month' | 'week' | 'day') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Calendar View */}
      <Card>
        <CardContent className="p-0">
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && <div className="p-4">{renderWeekView()}</div>}
          {viewMode === 'day' && <div className="p-4">{renderDayView()}</div>}
        </CardContent>
      </Card>

      {/* Session Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSession.skillIcon}</span>
                  {selectedSession.title}
                </DialogTitle>
                <DialogDescription>
                  Session details and information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Teacher</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedSession.teacherAvatar} />
                        <AvatarFallback>{selectedSession.teacherName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{selectedSession.teacherName}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedSession.status)} text-white`}>
                        {selectedSession.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Date & Time</Label>
                    <p className="mt-1">{format(selectedSession.scheduledAt, 'EEEE, MMMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(selectedSession.scheduledAt, 'HH:mm')} ({selectedSession.duration} minutes)
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="mt-1">{selectedSession.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedSession.meetingType === 'online' ? 'Online Session' : 'In-Person Meeting'}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <p className="mt-1 text-lg font-semibold">${selectedSession.price}</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Skill</Label>
                    <p className="mt-1">{selectedSession.skillName}</p>
                  </div>
                </div>

                {selectedSession.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedSession.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
                  Close
                </Button>
                {selectedSession.status === 'confirmed' && (
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Teacher
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}