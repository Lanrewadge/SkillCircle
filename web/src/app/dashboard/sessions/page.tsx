'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  DollarSign,
  Star,
  MessageCircle,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function SessionsPage() {
  const [selectedTab, setSelectedTab] = useState('upcoming')

  // Mock session data
  const mockSessions = {
    upcoming: [
      {
        id: 1,
        title: 'React Hooks Deep Dive',
        skill: 'React Development',
        student: {
          id: 1,
          name: 'John Smith',
          avatar: null,
          rating: 4.8
        },
        teacher: {
          id: 2,
          name: 'Alice Johnson',
          avatar: null,
          rating: 4.9
        },
        scheduledAt: '2024-01-20T14:00:00Z',
        duration: 60,
        price: 75,
        currency: 'USD',
        meetingType: 'online',
        status: 'confirmed',
        location: null,
        meetingUrl: 'https://meet.google.com/abc-defg-hij'
      },
      {
        id: 2,
        title: 'Italian Pasta Making',
        skill: 'Italian Cooking',
        student: {
          id: 3,
          name: 'Sarah Johnson',
          avatar: null,
          rating: 4.6
        },
        teacher: {
          id: 4,
          name: 'Bob Smith',
          avatar: null,
          rating: 4.9
        },
        scheduledAt: '2024-01-21T16:00:00Z',
        duration: 120,
        price: 85,
        currency: 'USD',
        meetingType: 'in-person',
        status: 'pending',
        location: {
          address: '123 Culinary Street, New York, NY'
        }
      }
    ],
    completed: [
      {
        id: 3,
        title: 'Python Basics',
        skill: 'Python Programming',
        student: {
          id: 5,
          name: 'Mike Davis',
          avatar: null,
          rating: 4.7
        },
        teacher: {
          id: 2,
          name: 'Alice Johnson',
          avatar: null,
          rating: 4.9
        },
        scheduledAt: '2024-01-15T10:00:00Z',
        duration: 90,
        price: 65,
        currency: 'USD',
        meetingType: 'online',
        status: 'completed',
        rating: 5,
        review: 'Excellent session! Alice explained everything clearly.'
      }
    ],
    cancelled: [
      {
        id: 4,
        title: 'Guitar Fundamentals',
        skill: 'Guitar Lessons',
        student: {
          id: 6,
          name: 'Lisa Chen',
          avatar: null,
          rating: 4.5
        },
        teacher: {
          id: 7,
          name: 'Carlos Rodriguez',
          avatar: null,
          rating: 4.8
        },
        scheduledAt: '2024-01-18T15:00:00Z',
        duration: 60,
        price: 60,
        currency: 'USD',
        meetingType: 'in-person',
        status: 'cancelled',
        cancelledAt: '2024-01-17T10:00:00Z',
        cancelReason: 'Student scheduling conflict'
      }
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const SessionCard = ({ session, showActions = false }: { session: any, showActions?: boolean }) => (
    <Card key={session.id}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={session.teacher?.avatar || session.student?.avatar} />
              <AvatarFallback>
                {(session.teacher?.name || session.student?.name)?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{session.title}</CardTitle>
              <p className="text-sm text-gray-600">
                with {session.teacher?.name || session.student?.name}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{session.skill}</Badge>
                <Badge className={getStatusColor(session.status)}>
                  {getStatusIcon(session.status)}
                  <span className="ml-1 capitalize">{session.status}</span>
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="font-semibold">${session.price}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm">{session.teacher?.rating || session.student?.rating}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm">
                {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })} ({session.duration} minutes)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {session.meetingType === 'online' ? (
                <Video className="w-4 h-4 text-gray-500" />
              ) : (
                <MapPin className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm">
                {session.meetingType === 'online'
                  ? 'Online meeting'
                  : session.location?.address || 'In-person meeting'
                }
              </span>
            </div>
          </div>

          {session.status === 'completed' && session.review && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Review</h4>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < session.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">{session.review}</p>
            </div>
          )}

          {session.status === 'cancelled' && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 text-red-800">Cancelled</h4>
              <p className="text-sm text-red-600 mb-1">
                {formatDistanceToNow(new Date(session.cancelledAt), { addSuffix: true })}
              </p>
              <p className="text-sm text-red-600">{session.cancelReason}</p>
            </div>
          )}
        </div>

        {showActions && session.status === 'confirmed' && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
              {session.meetingType === 'online' && (
                <Button size="sm" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Join Meeting
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
              <Button size="sm" variant="destructive">
                Cancel
              </Button>
            </div>
          </div>
        )}

        {showActions && session.status === 'pending' && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex space-x-2">
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
            <Button size="sm" variant="destructive">
              Decline
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
        <p className="text-gray-600 mt-2">
          Manage your teaching and learning sessions
        </p>
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{mockSessions.upcoming.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{mockSessions.completed.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">$150</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({mockSessions.upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({mockSessions.completed.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({mockSessions.cancelled.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {mockSessions.upcoming.length > 0 ? (
            mockSessions.upcoming.map((session) => (
              <SessionCard key={session.id} session={session} showActions={true} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming sessions
                </h3>
                <p className="text-gray-600 mb-6">
                  Book a session with a teacher or wait for student bookings
                </p>
                <Button>Browse Teachers</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {mockSessions.completed.length > 0 ? (
            mockSessions.completed.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No completed sessions yet
                </h3>
                <p className="text-gray-600">
                  Your completed sessions will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {mockSessions.cancelled.length > 0 ? (
            mockSessions.cancelled.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <XCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No cancelled sessions
                </h3>
                <p className="text-gray-600">
                  Cancelled sessions will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}