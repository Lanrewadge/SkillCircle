'use client'

import React, { useState } from 'react'
import {
  Users,
  MessageSquare,
  Heart,
  Share2,
  BookOpen,
  Trophy,
  Star,
  Clock,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Send,
  Image,
  Video,
  Link,
  MoreHorizontal,
  UserPlus,
  Bell,
  Calendar,
  MapPin,
  Globe,
  Award,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Post {
  id: string
  author: {
    name: string
    avatar: string
    title: string
    verified: boolean
  }
  content: string
  type: 'text' | 'achievement' | 'question' | 'resource'
  timestamp: string
  likes: number
  comments: number
  shares: number
  tags: string[]
  media?: {
    type: 'image' | 'video' | 'link'
    url: string
    thumbnail?: string
  }
  achievement?: {
    skill: string
    level: string
    certificate: string
  }
}

interface StudyGroup {
  id: string
  name: string
  description: string
  members: number
  category: string
  privacy: 'public' | 'private'
  nextSession: string
  avatar: string
  tags: string[]
  joined: boolean
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  type: 'workshop' | 'webinar' | 'study-session' | 'networking'
  host: string
  attendees: number
  maxAttendees: number
  price: number
  category: string
  difficulty: string
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Alex Chen',
      avatar: '/avatars/alex.jpg',
      title: 'Full Stack Developer',
      verified: true
    },
    content: 'Just completed the Advanced React course! The hooks deep-dive was incredible. Anyone else struggling with useCallback optimization? Would love to discuss best practices.',
    type: 'achievement',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 8,
    shares: 3,
    tags: ['React', 'JavaScript', 'Hooks'],
    achievement: {
      skill: 'React Development',
      level: 'Advanced',
      certificate: 'react-advanced-cert.pdf'
    }
  },
  {
    id: '2',
    author: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      title: 'UX Designer',
      verified: false
    },
    content: 'Quick question for the UI/UX community: What\'s your go-to tool for user journey mapping? I\'ve been using Figma but wondering if there are better alternatives for complex flows.',
    type: 'question',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 12,
    shares: 2,
    tags: ['UX', 'Design', 'Tools'],
    media: {
      type: 'image',
      url: '/posts/journey-map.jpg',
      thumbnail: '/posts/journey-map-thumb.jpg'
    }
  }
]

const mockStudyGroups: StudyGroup[] = [
  {
    id: '1',
    name: 'React Developers Unite',
    description: 'Weekly discussions on React best practices, new features, and project reviews.',
    members: 1247,
    category: 'Technology',
    privacy: 'public',
    nextSession: '2024-01-20T18:00:00Z',
    avatar: '/groups/react-group.jpg',
    tags: ['React', 'JavaScript', 'Frontend'],
    joined: true
  },
  {
    id: '2',
    name: 'Digital Marketing Masterclass',
    description: 'Share strategies, case studies, and get feedback on your marketing campaigns.',
    members: 892,
    category: 'Marketing',
    privacy: 'public',
    nextSession: '2024-01-22T15:00:00Z',
    avatar: '/groups/marketing-group.jpg',
    tags: ['Marketing', 'SEO', 'Social Media'],
    joined: false
  }
]

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Advanced React Patterns Workshop',
    description: 'Deep dive into render props, HOCs, and compound components',
    date: '2024-01-25',
    time: '14:00 UTC',
    type: 'workshop',
    host: 'React Masters',
    attendees: 45,
    maxAttendees: 100,
    price: 0,
    category: 'Technology',
    difficulty: 'Advanced'
  },
  {
    id: '2',
    title: 'Freelancer Networking Meetup',
    description: 'Connect with fellow freelancers and share experiences',
    date: '2024-01-27',
    time: '19:00 UTC',
    type: 'networking',
    host: 'Freelance Community',
    attendees: 78,
    maxAttendees: 150,
    price: 15,
    category: 'Business',
    difficulty: 'All Levels'
  }
]

export const CommunityHub = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(mockStudyGroups)
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [newPost, setNewPost] = useState('')
  const [activeTab, setActiveTab] = useState('feed')

  const handleLike = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const handleJoinGroup = (groupId: string) => {
    setStudyGroups(studyGroups.map(group =>
      group.id === groupId
        ? { ...group, joined: !group.joined, members: group.joined ? group.members - 1 : group.members + 1 }
        : group
    ))
  }

  const PostCard = ({ post }: { post: Post }) => (
    <Card className="mb-6">
      <CardContent className="p-6">
        {/* Author Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-semibold">{post.author.name}</h4>
                {post.author.verified && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{post.author.title} • {post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Achievement Banner */}
        {post.type === 'achievement' && post.achievement && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-full p-2">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-green-800">Achievement Unlocked!</h5>
                <p className="text-sm text-green-600">
                  Completed {post.achievement.skill} - {post.achievement.level} Level
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <p className="text-gray-800 mb-4">{post.content}</p>

        {/* Media */}
        {post.media && (
          <div className="mb-4">
            {post.media.type === 'image' && (
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(post.id)}
              className="flex items-center space-x-2"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{post.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>{post.shares}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const StudyGroupCard = ({ group }: { group: StudyGroup }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback>{group.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{group.name}</h4>
              <p className="text-sm text-gray-600">{group.members.toLocaleString()} members</p>
            </div>
          </div>
          <Badge variant={group.privacy === 'public' ? 'secondary' : 'outline'}>
            {group.privacy}
          </Badge>
        </div>

        <p className="text-gray-700 text-sm mb-4">{group.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {group.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Next: Jan 20</span>
            </div>
          </div>
          <Button
            variant={group.joined ? 'outline' : 'default'}
            size="sm"
            onClick={() => handleJoinGroup(group.id)}
          >
            {group.joined ? (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Joined
              </>
            ) : (
              'Join Group'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const EventCard = ({ event }: { event: Event }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="font-semibold mb-1">{event.title}</h4>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {event.type}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{event.attendees}/{event.maxAttendees} attending</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Globe className="w-4 h-4" />
            <span>Hosted by {event.host}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-lg font-semibold text-green-600">
            {event.price === 0 ? 'Free' : `$${event.price}`}
          </div>
          <Button size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Attend
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Community Hub</h1>
        <p className="text-gray-600">Connect, learn, and grow with fellow learners worldwide</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">
            <MessageSquare className="w-4 h-4 mr-2" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="w-4 h-4 mr-2" />
            Study Groups
          </TabsTrigger>
          <TabsTrigger value="events">
            <Calendar className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="achievements">
            <Trophy className="w-4 h-4 mr-2" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Create Post */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>You</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Share your learning journey, ask questions, or celebrate achievements..."
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        className="border-none resize-none"
                        rows={3}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Image className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Link className="w-4 h-4" />
                          </Button>
                        </div>
                        <Button disabled={!newPost.trim()}>
                          <Send className="w-4 h-4 mr-2" />
                          Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts Feed */}
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Trending Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['#ReactHooks', '#MachineLearning', '#UXDesign', '#DigitalMarketing', '#Python'].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-blue-600 hover:underline cursor-pointer">{topic}</span>
                        <span className="text-xs text-gray-500">{Math.floor(Math.random() * 1000)}+ posts</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Find Study Partners
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Study Groups</h2>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studyGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Achievement Showcase</h3>
            <p className="text-gray-600 mb-6">View and share learning milestones with the community</p>
            <Button>
              <Award className="w-4 h-4 mr-2" />
              View My Achievements
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}