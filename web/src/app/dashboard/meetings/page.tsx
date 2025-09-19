'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Plus,
  Search,
  Filter,
  Star,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  UserPlus,
  Settings,
  Globe,
  Lock,
  Zap,
  BookOpen,
  Target,
  Coffee,
  Lightbulb
} from 'lucide-react'

const meetingTypes = [
  {
    id: 'study-group',
    name: 'Study Group',
    icon: <Users className="w-5 h-5" />,
    description: 'Collaborative learning sessions',
    color: 'bg-blue-500'
  },
  {
    id: 'workshop',
    name: 'Workshop',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Hands-on skill building',
    color: 'bg-green-500'
  },
  {
    id: 'mentorship',
    name: 'Mentorship',
    icon: <Target className="w-5 h-5" />,
    description: '1-on-1 guidance sessions',
    color: 'bg-purple-500'
  },
  {
    id: 'project',
    name: 'Project Collaboration',
    icon: <Zap className="w-5 h-5" />,
    description: 'Build together',
    color: 'bg-orange-500'
  },
  {
    id: 'casual',
    name: 'Casual Meetup',
    icon: <Coffee className="w-5 h-5" />,
    description: 'Informal skill discussions',
    color: 'bg-pink-500'
  },
  {
    id: 'q-and-a',
    name: 'Q&A Session',
    icon: <Lightbulb className="w-5 h-5" />,
    description: 'Ask questions & get answers',
    color: 'bg-cyan-500'
  }
]

const upcomingMeetings = [
  {
    id: 1,
    title: 'React Hooks Deep Dive',
    skill: 'React Development',
    category: 'Technology',
    type: 'study-group',
    organizer: {
      name: 'Sarah Johnson',
      avatar: '/users/sarah.jpg',
      rating: 4.9,
      badge: 'Expert'
    },
    date: '2024-01-25',
    time: '7:00 PM EST',
    duration: 120,
    participants: 12,
    maxParticipants: 15,
    description: 'Deep dive into React hooks patterns and best practices. We\'ll cover useState, useEffect, custom hooks, and performance optimization.',
    topics: ['useState', 'useEffect', 'Custom Hooks', 'Performance'],
    level: 'Intermediate',
    format: 'online',
    meetingLink: 'https://zoom.us/j/123456789',
    isJoined: false,
    isOrganizer: false,
    location: 'Online',
    recurring: false,
    materials: ['Coding exercises', 'Reference docs', 'Sample projects']
  },
  {
    id: 2,
    title: 'Spanish Conversation Practice',
    skill: 'Spanish Language',
    category: 'Languages',
    type: 'casual',
    organizer: {
      name: 'Maria Rodriguez',
      avatar: '/users/maria.jpg',
      rating: 4.8,
      badge: 'Native Speaker'
    },
    date: '2024-01-26',
    time: '6:00 PM EST',
    duration: 90,
    participants: 8,
    maxParticipants: 10,
    description: 'Practice conversational Spanish in a relaxed environment. All levels welcome!',
    topics: ['Conversation', 'Pronunciation', 'Cultural Context'],
    level: 'All Levels',
    format: 'online',
    meetingLink: 'https://zoom.us/j/987654321',
    isJoined: true,
    isOrganizer: false,
    location: 'Online',
    recurring: true,
    materials: ['Conversation topics', 'Vocabulary lists']
  },
  {
    id: 3,
    title: 'UI/UX Design Workshop',
    skill: 'UI/UX Design',
    category: 'Design',
    type: 'workshop',
    organizer: {
      name: 'Alex Chen',
      avatar: '/users/alex.jpg',
      rating: 4.7,
      badge: 'Designer'
    },
    date: '2024-01-27',
    time: '2:00 PM EST',
    duration: 180,
    participants: 20,
    maxParticipants: 25,
    description: 'Hands-on workshop covering user research, wireframing, and prototyping techniques.',
    topics: ['User Research', 'Wireframing', 'Prototyping', 'Figma'],
    level: 'Beginner',
    format: 'hybrid',
    meetingLink: 'https://zoom.us/j/456789123',
    isJoined: false,
    isOrganizer: false,
    location: 'San Francisco, CA + Online',
    recurring: false,
    materials: ['Figma templates', 'Design brief', 'User personas']
  },
  {
    id: 4,
    title: 'Python Data Science Project',
    skill: 'Data Science',
    category: 'Technology',
    type: 'project',
    organizer: {
      name: 'David Kim',
      avatar: '/users/david.jpg',
      rating: 4.9,
      badge: 'Data Scientist'
    },
    date: '2024-01-28',
    time: '10:00 AM EST',
    duration: 240,
    participants: 6,
    maxParticipants: 8,
    description: 'Collaborative data analysis project using real-world datasets. Perfect for building portfolio pieces.',
    topics: ['Data Analysis', 'Machine Learning', 'Pandas', 'Visualization'],
    level: 'Intermediate',
    format: 'online',
    meetingLink: 'https://zoom.us/j/789123456',
    isJoined: true,
    isOrganizer: true,
    location: 'Online',
    recurring: false,
    materials: ['Dataset', 'Jupyter notebooks', 'Project requirements']
  }
]

const myMeetings = [
  {
    id: 5,
    title: 'Guitar Beginner Circle',
    skill: 'Guitar Playing',
    category: 'Music',
    type: 'study-group',
    date: '2024-01-30',
    time: '7:30 PM EST',
    duration: 90,
    participants: 5,
    maxParticipants: 8,
    isOrganizer: true,
    status: 'upcoming'
  },
  {
    id: 6,
    title: 'Italian Cooking Session',
    skill: 'Cooking',
    category: 'Culinary',
    type: 'workshop',
    date: '2024-01-20',
    time: '5:00 PM EST',
    duration: 120,
    participants: 12,
    maxParticipants: 12,
    isOrganizer: false,
    status: 'completed'
  }
]

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('browse')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const filteredMeetings = upcomingMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || meeting.category.toLowerCase() === selectedCategory.toLowerCase()
    const matchesType = selectedType === 'all' || meeting.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const handleJoinMeeting = (meetingId: number) => {
    console.log(`Joining meeting ${meetingId}`)
    // Handle joining meeting logic
  }

  const handleLeaveMeeting = (meetingId: number) => {
    console.log(`Leaving meeting ${meetingId}`)
    // Handle leaving meeting logic
  }

  const handleCreateMeeting = () => {
    setShowCreateForm(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Study Groups & Meetings
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Connect with fellow learners and organize collaborative learning sessions
          </p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleCreateMeeting} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Meeting
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              My Calendar
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Meeting Settings
            </Button>
          </div>
        </div>

        {/* Meeting Types Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Meeting Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {meetingTypes.map((type) => (
              <Card key={type.id} className="hover:shadow-md transition-all duration-200 cursor-pointer group">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center text-white mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                    {type.icon}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{type.name}</h3>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="browse">Browse Meetings</TabsTrigger>
            <TabsTrigger value="my-meetings">My Meetings</TabsTrigger>
            <TabsTrigger value="create">Create Meeting</TabsTrigger>
          </TabsList>

          {/* Browse Meetings Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search meetings, skills, or topics..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="all">All Categories</option>
                    <option value="technology">Technology</option>
                    <option value="languages">Languages</option>
                    <option value="design">Design</option>
                    <option value="music">Music</option>
                    <option value="cooking">Cooking</option>
                    <option value="fitness">Fitness</option>
                  </select>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="all">All Types</option>
                    {meetingTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Meetings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${meetingTypes.find(t => t.id === meeting.type)?.color} text-white`}
                        >
                          {meetingTypes.find(t => t.id === meeting.type)?.name}
                        </Badge>
                        <Badge variant="outline">{meeting.level}</Badge>
                        {meeting.recurring && (
                          <Badge variant="secondary" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {meeting.format === 'online' ? (
                          <Video className="w-4 h-4 text-blue-500" />
                        ) : meeting.format === 'hybrid' ? (
                          <Globe className="w-4 h-4 text-purple-500" />
                        ) : (
                          <MapPin className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                    </div>

                    <CardTitle className="text-xl mb-2">{meeting.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="text-blue-600 font-medium">{meeting.skill}</span>
                      <span>•</span>
                      <span>{meeting.category}</span>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {meeting.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Organizer */}
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={meeting.organizer.avatar} />
                        <AvatarFallback>{meeting.organizer.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{meeting.organizer.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {meeting.organizer.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{meeting.organizer.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{meeting.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{meeting.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{meeting.participants}/{meeting.maxParticipants}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{meeting.duration} min</span>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Topics:</h4>
                      <div className="flex flex-wrap gap-1">
                        {meeting.topics.map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Materials */}
                    {meeting.materials && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Materials included:</h4>
                        <div className="text-xs text-muted-foreground">
                          {meeting.materials.join(' • ')}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Share2 className="w-4 h-4 mr-1" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Discuss
                        </Button>
                      </div>

                      {meeting.isJoined ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleLeaveMeeting(meeting.id)}>
                            Leave
                          </Button>
                          <Button size="sm">
                            <Video className="w-4 h-4 mr-1" />
                            Join Now
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => handleJoinMeeting(meeting.id)}>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMeetings.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or create a new meeting
                </p>
                <Button onClick={handleCreateMeeting}>
                  Create Meeting
                </Button>
              </div>
            )}
          </TabsContent>

          {/* My Meetings Tab */}
          <TabsContent value="my-meetings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myMeetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <CardDescription>
                          {meeting.skill} • {meeting.category}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {meeting.isOrganizer && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Date & Time:</span>
                        <span>{meeting.date} at {meeting.time}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Participants:</span>
                        <span>{meeting.participants}/{meeting.maxParticipants}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Role:</span>
                        <Badge variant={meeting.isOrganizer ? "default" : "secondary"}>
                          {meeting.isOrganizer ? "Organizer" : "Participant"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={meeting.status === 'completed' ? "secondary" : "default"}>
                          {meeting.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {myMeetings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No meetings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Join existing meetings or create your own
                </p>
                <Button onClick={() => setActiveTab('browse')}>
                  Browse Meetings
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Create Meeting Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create a New Meeting</CardTitle>
                <CardDescription>
                  Organize a study group, workshop, or collaborative session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Meeting Title</label>
                      <Input placeholder="e.g., React Hooks Study Group" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Skill/Topic</label>
                      <Input placeholder="e.g., React Development" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Meeting Type</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                        {meetingTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Level</label>
                      <select className="w-full px-3 py-2 rounded-lg border border-border bg-background">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="all">All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Date</label>
                      <Input type="date" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time</label>
                      <Input type="time" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration (minutes)</label>
                      <Input type="number" placeholder="90" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Max Participants</label>
                      <Input type="number" placeholder="15" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background min-h-[100px]"
                    placeholder="Describe what the meeting will cover, what participants can expect, and any prerequisites..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Topics to Cover</label>
                  <Input placeholder="e.g., useState, useEffect, custom hooks (comma separated)" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="online" className="rounded" />
                    <label htmlFor="online" className="text-sm">Online Meeting</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="recurring" className="rounded" />
                    <label htmlFor="recurring" className="text-sm">Recurring Meeting</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="materials" className="rounded" />
                    <label htmlFor="materials" className="text-sm">Provide Materials</label>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Meeting</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}