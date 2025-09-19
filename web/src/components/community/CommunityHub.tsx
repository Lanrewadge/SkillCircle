'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  MessageCircle,
  Heart,
  Share,
  Pin,
  Star,
  Award,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Rocket,
  Trophy,
  Target,
  Calendar,
  MapPin,
  Globe,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  MessageSquare,
  User,
  Crown,
  Shield
} from 'lucide-react'

interface CommunityPost {
  id: string
  authorId: string
  authorName: string
  authorAvatar: string
  authorBadges: string[]
  title: string
  content: string
  category: 'QUESTION' | 'SHOWCASE' | 'DISCUSSION' | 'ANNOUNCEMENT' | 'RESOURCE'
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  comments: number
  views: number
  isPinned: boolean
  isSolved?: boolean
  bestAnswer?: string
}

interface CommunityMember {
  id: string
  name: string
  avatar: string
  title: string
  location: string
  skills: string[]
  badges: string[]
  reputation: number
  contributions: number
  joined: string
  status: 'ONLINE' | 'AWAY' | 'OFFLINE'
  isVerified: boolean
  isMentor: boolean
}

interface MentorshipOpportunity {
  id: string
  mentorId: string
  mentorName: string
  mentorAvatar: string
  mentorRating: number
  skillArea: string
  description: string
  format: 'ONE_ON_ONE' | 'GROUP' | 'WORKSHOP' | 'PROJECT'
  duration: string
  price?: number
  availability: string[]
  maxMentees: number
  currentMentees: number
}

export default function CommunityHub() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [mentorships, setMentorships] = useState<MentorshipOpportunity[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'mentorship'>('posts')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewPostDialog, setShowNewPostDialog] = useState(false)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'DISCUSSION' as const,
    tags: ''
  })

  useEffect(() => {
    fetchCommunityData()
  }, [])

  const fetchCommunityData = async () => {
    try {
      // Mock data for demonstration
      const mockPosts: CommunityPost[] = [
        {
          id: 'post_1',
          authorId: '2',
          authorName: 'Sarah Chen',
          authorAvatar: '/avatars/sarah.jpg',
          authorBadges: ['React Expert', 'Top Contributor'],
          title: 'Best practices for React state management in 2024?',
          content: 'I\'ve been working with React for a while, but I\'m still unsure about the best approaches for complex state management. Should I stick with useState and useContext, or is it time to adopt Zustand or Redux Toolkit? What are your experiences with different state management solutions?',
          category: 'QUESTION',
          tags: ['React', 'State Management', 'JavaScript'],
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          likes: 24,
          comments: 18,
          views: 156,
          isPinned: false,
          isSolved: false
        },
        {
          id: 'post_2',
          authorId: '3',
          authorName: 'Dr. Michael Rodriguez',
          authorAvatar: '/avatars/michael.jpg',
          authorBadges: ['ML Expert', 'Verified Mentor', 'Top Researcher'],
          title: '🚀 New Machine Learning Course Series - Free for Community!',
          content: 'Excited to announce a new comprehensive ML course series! We\'ll cover everything from basics to advanced topics like transformers and reinforcement learning. The course is completely free for SkillCircle community members. Registration starts next week!',
          category: 'ANNOUNCEMENT',
          tags: ['Machine Learning', 'Course', 'Free', 'Education'],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          likes: 127,
          comments: 43,
          views: 892,
          isPinned: true
        },
        {
          id: 'post_3',
          authorId: '4',
          authorName: 'Alex Kim',
          authorAvatar: '/avatars/alex.jpg',
          authorBadges: ['Design Pro'],
          title: 'Check out my latest UI design system!',
          content: 'I\'ve been working on this design system for the past 3 months. It includes 50+ components, design tokens, and comprehensive documentation. Built with Figma and implemented in React. Would love to get feedback from the community!',
          category: 'SHOWCASE',
          tags: ['UI Design', 'Design System', 'Figma', 'React'],
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          likes: 89,
          comments: 32,
          views: 245,
          isPinned: false
        },
        {
          id: 'post_4',
          authorId: '5',
          authorName: 'Emma Watson',
          authorAvatar: '/avatars/emma.jpg',
          authorBadges: ['Python Expert'],
          title: 'How to transition from junior to senior developer?',
          content: 'I\'ve been a junior developer for 2 years now and I\'m looking to make the jump to senior level. What skills should I focus on beyond coding? How important is system design knowledge? Any recommendations for learning resources?',
          category: 'DISCUSSION',
          tags: ['Career', 'Senior Developer', 'Growth', 'Advice'],
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          likes: 67,
          comments: 28,
          views: 198,
          isPinned: false
        }
      ]

      const mockMembers: CommunityMember[] = [
        {
          id: '2',
          name: 'Sarah Chen',
          avatar: '/avatars/sarah.jpg',
          title: 'Senior React Developer',
          location: 'San Francisco, CA',
          skills: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
          badges: ['React Expert', 'Top Contributor', 'Mentor'],
          reputation: 2480,
          contributions: 156,
          joined: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'ONLINE',
          isVerified: true,
          isMentor: true
        },
        {
          id: '3',
          name: 'Dr. Michael Rodriguez',
          avatar: '/avatars/michael.jpg',
          title: 'AI Research Scientist',
          location: 'Boston, MA',
          skills: ['Machine Learning', 'Python', 'TensorFlow', 'Research'],
          badges: ['ML Expert', 'Verified Mentor', 'Top Researcher', 'PhD'],
          reputation: 3920,
          contributions: 289,
          joined: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'ONLINE',
          isVerified: true,
          isMentor: true
        },
        {
          id: '4',
          name: 'Alex Kim',
          avatar: '/avatars/alex.jpg',
          title: 'UX/UI Designer',
          location: 'Seoul, South Korea',
          skills: ['UI Design', 'UX Research', 'Figma', 'Prototyping'],
          badges: ['Design Pro', 'Creative'],
          reputation: 1650,
          contributions: 98,
          joined: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'AWAY',
          isVerified: true,
          isMentor: false
        },
        {
          id: '5',
          name: 'Emma Watson',
          avatar: '/avatars/emma.jpg',
          title: 'Full Stack Developer',
          location: 'London, UK',
          skills: ['Python', 'Django', 'React', 'PostgreSQL'],
          badges: ['Python Expert', 'Rising Star'],
          reputation: 890,
          contributions: 45,
          joined: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'ONLINE',
          isVerified: false,
          isMentor: false
        }
      ]

      const mockMentorships: MentorshipOpportunity[] = [
        {
          id: 'mentor_1',
          mentorId: '3',
          mentorName: 'Dr. Michael Rodriguez',
          mentorAvatar: '/avatars/michael.jpg',
          mentorRating: 4.9,
          skillArea: 'Machine Learning & AI',
          description: 'Comprehensive ML mentorship covering fundamentals to advanced topics. Includes hands-on projects, paper reviews, and career guidance in AI research.',
          format: 'ONE_ON_ONE',
          duration: '3 months',
          price: 150,
          availability: ['Mon 6-8 PM EST', 'Wed 6-8 PM EST', 'Sat 10-12 PM EST'],
          maxMentees: 3,
          currentMentees: 1
        },
        {
          id: 'mentor_2',
          mentorId: '2',
          mentorName: 'Sarah Chen',
          mentorAvatar: '/avatars/sarah.jpg',
          mentorRating: 4.8,
          skillArea: 'React & Frontend Development',
          description: 'Learn modern React development, best practices, testing, and performance optimization. Perfect for junior to mid-level developers.',
          format: 'GROUP',
          duration: '6 weeks',
          price: 80,
          availability: ['Tue 7-9 PM PST', 'Thu 7-9 PM PST'],
          maxMentees: 8,
          currentMentees: 5
        },
        {
          id: 'mentor_3',
          mentorId: '6',
          mentorName: 'David Wilson',
          mentorAvatar: '/avatars/david.jpg',
          mentorRating: 4.7,
          skillArea: 'System Design & Architecture',
          description: 'Master large-scale system design, microservices, database design, and scalability patterns. Includes real-world case studies.',
          format: 'WORKSHOP',
          duration: '4 weeks',
          availability: ['Sat 2-4 PM UTC'],
          maxMentees: 15,
          currentMentees: 12
        }
      ]

      setPosts(mockPosts)
      setMembers(mockMembers)
      setMentorships(mockMentorships)
    } catch (error) {
      console.error('Failed to fetch community data:', error)
    }
  }

  const createPost = () => {
    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: '1',
      authorName: 'You',
      authorAvatar: '/avatars/you.jpg',
      authorBadges: ['Active Member'],
      title: newPost.title,
      content: newPost.content,
      category: newPost.category,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 1,
      isPinned: false
    }

    setPosts(prev => [post, ...prev])
    setShowNewPostDialog(false)
    setNewPost({ title: '', content: '', category: 'DISCUSSION', tags: '' })
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'QUESTION': return <HelpCircle className="h-4 w-4" />
      case 'SHOWCASE': return <Star className="h-4 w-4" />
      case 'DISCUSSION': return <MessageCircle className="h-4 w-4" />
      case 'ANNOUNCEMENT': return <Rocket className="h-4 w-4" />
      case 'RESOURCE': return <BookOpen className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'QUESTION': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'SHOWCASE': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'DISCUSSION': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'ANNOUNCEMENT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'RESOURCE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'AWAY': return 'bg-yellow-500'
      case 'OFFLINE': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  const filteredMembers = members.filter(member =>
    searchTerm === '' ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredMentorships = mentorships.filter(mentorship =>
    searchTerm === '' ||
    mentorship.skillArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentorship.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Community Hub
          </h1>
          <p className="text-muted-foreground">Connect, learn, and grow with fellow learners</p>
        </div>

        <Dialog open={showNewPostDialog} onOpenChange={setShowNewPostDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Share knowledge, ask questions, or showcase your work</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              />
              <Select value={newPost.category} onValueChange={(value: any) => setNewPost(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUESTION">Question - Ask for help</SelectItem>
                  <SelectItem value="DISCUSSION">Discussion - Start a conversation</SelectItem>
                  <SelectItem value="SHOWCASE">Showcase - Share your work</SelectItem>
                  <SelectItem value="RESOURCE">Resource - Share useful content</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Write your post content..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={newPost.tags}
                onChange={(e) => setNewPost(prev => ({ ...prev, tags: e.target.value }))}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewPostDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createPost} disabled={!newPost.title || !newPost.content}>
                  Create Post
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'posts', label: 'Posts', count: posts.length },
          { key: 'members', label: 'Members', count: members.length },
          { key: 'mentorship', label: 'Mentorship', count: mentorships.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {activeTab === 'posts' && (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="QUESTION">Questions</SelectItem>
              <SelectItem value="DISCUSSION">Discussions</SelectItem>
              <SelectItem value="SHOWCASE">Showcases</SelectItem>
              <SelectItem value="ANNOUNCEMENT">Announcements</SelectItem>
              <SelectItem value="RESOURCE">Resources</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <Card key={post.id} className={`hover:shadow-md transition-shadow ${post.isPinned ? 'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20' : ''}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {post.isPinned && <Pin className="h-4 w-4 text-orange-600" />}
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{post.authorName}</span>
                          {post.authorBadges.map(badge => (
                            <Badge key={badge} variant="outline" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          <span>•</span>
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">{post.category}</span>
                      </Badge>
                      {post.isSolved && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Solved
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground">{post.content}</p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Comment
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map(member => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold truncate">{member.name}</h3>
                        {member.isVerified && <Shield className="h-4 w-4 text-blue-600" />}
                        {member.isMentor && <Crown className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{member.title}</p>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{member.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.badges.slice(0, 3).map(badge => (
                      <Badge key={badge} variant="outline" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                    {member.badges.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.badges.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{member.skills.length - 4}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <div className="font-medium">{member.reputation.toLocaleString()}</div>
                      <div className="text-muted-foreground">Reputation</div>
                    </div>
                    <div>
                      <div className="font-medium">{member.contributions}</div>
                      <div className="text-muted-foreground">Contributions</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                    {member.isMentor && (
                      <Button size="sm" className="flex-1">
                        <Star className="h-4 w-4 mr-1" />
                        Mentor
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'mentorship' && (
        <div className="space-y-4">
          {filteredMentorships.map(mentorship => (
            <Card key={mentorship.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={mentorship.mentorAvatar} />
                        <AvatarFallback>{mentorship.mentorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{mentorship.skillArea}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>by {mentorship.mentorName}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{mentorship.mentorRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      {mentorship.price ? (
                        <div className="text-2xl font-bold">${mentorship.price}</div>
                      ) : (
                        <Badge variant="secondary">Free</Badge>
                      )}
                      <div className="text-sm text-muted-foreground">
                        {mentorship.currentMentees}/{mentorship.maxMentees} spots
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{mentorship.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-medium">Format</div>
                      <div className="text-muted-foreground">{mentorship.format.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="font-medium">Duration</div>
                      <div className="text-muted-foreground">{mentorship.duration}</div>
                    </div>
                    <div>
                      <div className="font-medium">Availability</div>
                      <div className="text-muted-foreground">{mentorship.availability.length} slots</div>
                    </div>
                    <div>
                      <div className="font-medium">Spots Left</div>
                      <div className="text-muted-foreground">
                        {mentorship.maxMentees - mentorship.currentMentees}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {mentorship.availability.slice(0, 2).map((slot, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {slot}
                        </Badge>
                      ))}
                      {mentorship.availability.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{mentorship.availability.length - 2} more
                        </Badge>
                      )}
                    </div>
                    <Button disabled={mentorship.currentMentees >= mentorship.maxMentees}>
                      {mentorship.currentMentees >= mentorship.maxMentees ? 'Full' : 'Apply for Mentorship'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}