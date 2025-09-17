'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, MessageSquare, Calendar, Star, UserPlus, DollarSign, BookOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDistanceToNow } from 'date-fns'

interface Notification {
  id: string
  type: 'message' | 'match' | 'session' | 'review' | 'payment' | 'reminder'
  title: string
  body: string
  read: boolean
  createdAt: Date
  data?: any
  avatar?: string
  actionUrl?: string
}

const NotificationIcon = ({ type }: { type: string }) => {
  const iconProps = { className: "h-4 w-4" }

  switch (type) {
    case 'message':
      return <MessageSquare {...iconProps} className="h-4 w-4 text-blue-500" />
    case 'match':
      return <UserPlus {...iconProps} className="h-4 w-4 text-green-500" />
    case 'session':
      return <Calendar {...iconProps} className="h-4 w-4 text-purple-500" />
    case 'review':
      return <Star {...iconProps} className="h-4 w-4 text-yellow-500" />
    case 'payment':
      return <DollarSign {...iconProps} className="h-4 w-4 text-green-600" />
    case 'reminder':
      return <Bell {...iconProps} className="h-4 w-4 text-orange-500" />
    default:
      return <Bell {...iconProps} />
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)

      // Mock notifications data
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'message',
          title: 'New message from Sarah Chen',
          body: 'Hi! I see you\'re interested in learning Italian cooking. I\'d love to help you get started!',
          read: false,
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          avatar: '/avatars/sarah.jpg',
          actionUrl: '/dashboard/messages'
        },
        {
          id: '2',
          type: 'session',
          title: 'Session reminder',
          body: 'Your React Development session with Alex Rodriguez starts in 1 hour',
          read: false,
          createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          avatar: '/avatars/alex.jpg',
          actionUrl: '/dashboard/sessions'
        },
        {
          id: '3',
          type: 'match',
          title: 'New teacher match found!',
          body: 'Maria Gonzalez is available to teach Spanish Language in your area',
          read: true,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          avatar: '/avatars/maria.jpg',
          actionUrl: '/dashboard/skills/browse'
        },
        {
          id: '4',
          type: 'review',
          title: 'New review received',
          body: 'James Thompson left you a 5-star review for your Guitar lesson!',
          read: true,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          avatar: '/avatars/james.jpg',
          actionUrl: '/dashboard/profile'
        },
        {
          id: '5',
          type: 'payment',
          title: 'Payment received',
          body: 'You received $85.00 for your React Development session',
          read: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          actionUrl: '/dashboard/earnings'
        },
        {
          id: '6',
          type: 'reminder',
          title: 'Complete your profile',
          body: 'Add more skills to your profile to get better matches!',
          read: false,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          actionUrl: '/dashboard/profile'
        },
        {
          id: '7',
          type: 'session',
          title: 'Session completed',
          body: 'Your Italian Cooking session with Sarah Chen has been marked as completed',
          read: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          avatar: '/avatars/sarah.jpg',
          actionUrl: '/dashboard/sessions'
        }
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ))
      // TODO: Call API to mark notification as read
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      setNotifications(notifications.map(notification => ({ ...notification, read: true })))
      // TODO: Call API to mark all notifications as read
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      setNotifications(notifications.filter(notification => notification.id !== notificationId))
      // TODO: Call API to delete notification
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const getFilteredNotifications = () => {
    switch (activeTab) {
      case 'unread':
        return notifications.filter(n => !n.read)
      case 'messages':
        return notifications.filter(n => n.type === 'message')
      case 'sessions':
        return notifications.filter(n => n.type === 'session' || n.type === 'reminder')
      case 'matches':
        return notifications.filter(n => n.type === 'match' || n.type === 'review')
      default:
        return notifications
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with messages, sessions, and matches
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notification Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="messages">
            Messages ({notifications.filter(n => n.type === 'message').length})
          </TabsTrigger>
          <TabsTrigger value="sessions">
            Sessions ({notifications.filter(n => n.type === 'session' || n.type === 'reminder').length})
          </TabsTrigger>
          <TabsTrigger value="matches">
            Matches ({notifications.filter(n => n.type === 'match' || n.type === 'review').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {getFilteredNotifications().length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'unread'
                      ? "You're all caught up! No unread notifications."
                      : "No notifications in this category yet."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              getFilteredNotifications().map((notification) => (
                <Card
                  key={notification.id}
                  className={`transition-all hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback>
                              <NotificationIcon type={notification.type} />
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <NotificationIcon type={notification.type} />
                          </div>
                        )}
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className={`font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.body}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Action Button */}
                        {notification.actionUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-3"
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id)
                              }
                              // TODO: Navigate to actionUrl
                              console.log('Navigate to:', notification.actionUrl)
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}