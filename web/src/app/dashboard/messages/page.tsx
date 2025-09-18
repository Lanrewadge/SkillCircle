'use client'

import { useState } from 'react'
import MessageCenter from '@/components/messaging/MessageCenter'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  MessageCircle,
  Phone,
  Video,
  Calendar,
  Settings,
  Bell,
  Archive,
  Star,
  Users
} from 'lucide-react'

const quickStats = [
  {
    label: 'Active Conversations',
    value: '12',
    change: '+3 from last week',
    icon: MessageCircle,
    color: 'text-blue-600'
  },
  {
    label: 'Scheduled Sessions',
    value: '5',
    change: '2 upcoming today',
    icon: Calendar,
    color: 'text-green-600'
  },
  {
    label: 'Video Calls',
    value: '8',
    change: 'This week',
    icon: Video,
    color: 'text-purple-600'
  },
  {
    label: 'Response Rate',
    value: '98%',
    change: 'Average 2min',
    icon: Star,
    color: 'text-yellow-600'
  }
]

const recentActivity = [
  {
    id: '1',
    type: 'message',
    user: 'Sarah Johnson',
    action: 'sent you a message',
    time: '2 minutes ago',
    avatar: '👩‍🏫'
  },
  {
    id: '2',
    type: 'call',
    user: 'Michael Chen',
    action: 'started a video call',
    time: '15 minutes ago',
    avatar: '👨‍💻'
  },
  {
    id: '3',
    type: 'booking',
    user: 'Emma Wilson',
    action: 'booked a session',
    time: '1 hour ago',
    avatar: '👩‍🎨'
  },
  {
    id: '4',
    type: 'review',
    user: 'David Park',
    action: 'left a 5-star review',
    time: '3 hours ago',
    avatar: '👨‍🚀'
  }
]

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState('messages')

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-4 w-4 text-blue-600" />
      case 'call':
        return <Video className="h-4 w-4 text-green-600" />
      case 'booking':
        return <Calendar className="h-4 w-4 text-purple-600" />
      case 'review':
        return <Star className="h-4 w-4 text-yellow-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Messages & Communication</h1>
          <p className="text-gray-600">Stay connected with your learning community</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <Archive className="h-4 w-4 mr-2" />
            Archive
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
            <TabsList className="mb-4">
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="calls" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Video Calls
              </TabsTrigger>
              <TabsTrigger value="groups" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Groups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="messages">
              <MessageCenter />
            </TabsContent>

            <TabsContent value="calls">
              <Card>
                <CardHeader>
                  <CardTitle>Video Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Video className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Video Call Center</h3>
                    <p className="text-gray-600 mb-4">Start or join video calls with your tutors and learners</p>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Video className="h-4 w-4 mr-2" />
                      Start New Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="groups">
              <Card>
                <CardHeader>
                  <CardTitle>Study Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Study Groups</h3>
                    <p className="text-gray-600 mb-4">Join or create study groups with other learners</p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Users className="h-4 w-4 mr-2" />
                      Create Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="text-lg">{activity.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        {getActivityIcon(activity.type)}
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>
                          <span className="text-gray-600"> {activity.action}</span>
                        </p>
                      </div>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                New Message
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Video className="h-4 w-4 mr-2" />
                Start Video Call
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </CardContent>
          </Card>

          {/* Communication Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">💡 Communication Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Respond to messages within 24 hours to maintain good ratings</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use video calls for complex explanations and demonstrations</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Set clear expectations before each session</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}