'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import InteractiveRoadmap from '@/components/roadmap/InteractiveRoadmap'
import { roadmapDatabase } from '@/data/roadmaps'
import { getSkillById } from '@/data/skills'
import { DocumentManager } from '@/components/skills/DocumentManager'
import {
  Star,
  Users,
  Clock,
  Calendar,
  Video,
  Globe,
  BookOpen,
  CheckCircle,
  Play,
  Download,
  Share2,
  Heart,
  MessageCircle,
  TrendingUp,
  Award,
  MapPin,
  DollarSign,
  Target,
  Lightbulb,
  Zap,
  ChevronRight,
  Plus,
  UserPlus
} from 'lucide-react'

// Mock skill data (in a real app, this would come from an API)
const skillData = {
  1: {
    id: 1,
    title: 'Complete React Developer Course',
    subtitle: 'Master React from Basics to Advanced with Real Projects',
    category: 'Technology & Programming',
    subcategory: 'Web Development',
    description: 'Learn React.js from scratch and build amazing web applications. This comprehensive course covers everything from basic concepts to advanced patterns, including hooks, context, testing, and deployment.',
    longDescription: `This is the most comprehensive React course available online. You'll start with the fundamentals and gradually build up to creating complex, real-world applications.

What makes this course special:
• Hands-on approach with 15+ real projects
• Latest React features including hooks and concurrent features
• Industry best practices and coding standards
• Performance optimization techniques
• Testing strategies with Jest and React Testing Library
• Deployment to production environments

By the end of this course, you'll have the skills and confidence to build professional React applications and land a job as a React developer.`,
    level: 'Beginner to Advanced',
    rating: 4.9,
    reviewCount: 2847,
    students: 12000,
    duration: '12 weeks',
    totalHours: 48,
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/instructors/sarah.jpg',
      title: 'Senior React Developer at Google',
      rating: 4.9,
      students: 25000,
      courses: 8,
      bio: 'Sarah is a Senior React Developer at Google with 8+ years of experience. She has taught over 25,000 students and is passionate about making complex concepts easy to understand.',
      experience: '8+ years',
      specialties: ['React', 'JavaScript', 'TypeScript', 'Node.js']
    },
    thumbnail: '/skills/react-course.jpg',
    trending: true,
    difficulty: 'Intermediate',
    language: 'English',
    lastUpdated: '2024-01-15',
    certificate: true,
    prerequisites: ['Basic HTML/CSS', 'JavaScript fundamentals'],
    tags: ['React', 'JavaScript', 'Frontend', 'Web Development', 'Hooks', 'Context API'],

    roadmap: [
      {
        id: 1,
        title: 'JavaScript ES6+ Fundamentals',
        description: 'Master modern JavaScript features essential for React',
        duration: '1 week',
        lessons: 8,
        completed: false,
        topics: ['Arrow Functions', 'Destructuring', 'Promises', 'Async/Await', 'Modules']
      },
      {
        id: 2,
        title: 'React Basics & JSX',
        description: 'Understanding React concepts and JSX syntax',
        duration: '1 week',
        lessons: 10,
        completed: false,
        topics: ['Components', 'JSX', 'Virtual DOM', 'Props', 'Rendering']
      },
      {
        id: 3,
        title: 'Components & Props',
        description: 'Building reusable components and passing data',
        duration: '1 week',
        lessons: 12,
        completed: false,
        topics: ['Functional Components', 'Class Components', 'Props', 'PropTypes', 'Children']
      },
      {
        id: 4,
        title: 'State & Event Handling',
        description: 'Managing component state and user interactions',
        duration: '1 week',
        lessons: 10,
        completed: false,
        topics: ['useState Hook', 'Event Handling', 'Forms', 'Controlled Components']
      },
      {
        id: 5,
        title: 'React Hooks Deep Dive',
        description: 'Master all React hooks and create custom ones',
        duration: '2 weeks',
        lessons: 15,
        completed: false,
        topics: ['useEffect', 'useContext', 'useReducer', 'useMemo', 'useCallback', 'Custom Hooks']
      },
      {
        id: 6,
        title: 'Context API & State Management',
        description: 'Global state management and data flow',
        duration: '1 week',
        lessons: 8,
        completed: false,
        topics: ['Context API', 'Provider Pattern', 'Global State', 'Redux Basics']
      },
      {
        id: 7,
        title: 'React Router & Navigation',
        description: 'Building single-page applications with routing',
        duration: '1 week',
        lessons: 10,
        completed: false,
        topics: ['React Router', 'Navigation', 'Route Parameters', 'Protected Routes']
      },
      {
        id: 8,
        title: 'Testing React Applications',
        description: 'Writing tests for components and user interactions',
        duration: '1 week',
        lessons: 12,
        completed: false,
        topics: ['Jest', 'React Testing Library', 'Unit Tests', 'Integration Tests']
      },
      {
        id: 9,
        title: 'Performance Optimization',
        description: 'Making React apps fast and efficient',
        duration: '1 week',
        lessons: 8,
        completed: false,
        topics: ['React.memo', 'Lazy Loading', 'Code Splitting', 'Performance Tools']
      },
      {
        id: 10,
        title: 'Real-world Projects',
        description: 'Build portfolio-worthy applications',
        duration: '2 weeks',
        lessons: 20,
        completed: false,
        topics: ['E-commerce App', 'Social Media Dashboard', 'Task Management Tool']
      }
    ],

    features: [
      '48 hours of on-demand video',
      '15+ hands-on projects',
      'Downloadable resources',
      'Certificate of completion',
      'Lifetime access',
      'Money-back guarantee',
      'Mobile access',
      'Community support'
    ],

    reviews: [
      {
        id: 1,
        user: 'Mike Chen',
        avatar: '/users/mike.jpg',
        rating: 5,
        date: '2024-01-10',
        comment: 'Absolutely fantastic course! Sarah explains everything so clearly and the projects are amazing. Landed a React job after completing this course.',
        helpful: 23
      },
      {
        id: 2,
        user: 'Lisa Rodriguez',
        avatar: '/users/lisa.jpg',
        rating: 5,
        date: '2024-01-08',
        comment: 'Best React course on the internet. The roadmap is perfect and the step-by-step approach made everything easy to follow.',
        helpful: 18
      },
      {
        id: 3,
        user: 'David Kim',
        avatar: '/users/david.jpg',
        rating: 4,
        date: '2024-01-05',
        comment: 'Great course overall. Very comprehensive and up-to-date. Would love to see more advanced patterns covered.',
        helpful: 12
      }
    ],

    upcomingMeetings: [
      {
        id: 1,
        title: 'React Hooks Study Group',
        instructor: 'Sarah Johnson',
        date: '2024-01-25',
        time: '7:00 PM EST',
        duration: '2 hours',
        participants: 45,
        maxParticipants: 50,
        type: 'Study Group',
        topics: ['useState', 'useEffect', 'Custom Hooks'],
        meetingLink: 'https://zoom.us/j/123456789'
      },
      {
        id: 2,
        title: 'Project Showcase & Q&A',
        instructor: 'Sarah Johnson',
        date: '2024-01-27',
        time: '3:00 PM EST',
        duration: '1.5 hours',
        participants: 32,
        maxParticipants: 40,
        type: 'Workshop',
        topics: ['Project Review', 'Best Practices', 'Q&A'],
        meetingLink: 'https://zoom.us/j/987654321'
      },
      {
        id: 3,
        title: 'Beginner-Friendly React Basics',
        instructor: 'Alex Chen',
        date: '2024-01-28',
        time: '6:00 PM EST',
        duration: '2 hours',
        participants: 28,
        maxParticipants: 35,
        type: 'Beginner Group',
        topics: ['Components', 'Props', 'Basic State'],
        meetingLink: 'https://zoom.us/j/456789123'
      }
    ]
  }
}

export default function SkillDetailPage() {
  const params = useParams()
  const skillId = params.id as string
  const skill = getSkillById(skillId)
  const [activeTab, setActiveTab] = useState('overview')
  const [isEnrolled, setIsEnrolled] = useState(false)

  // Fallback to hardcoded data if skill not found in database
  const fallbackSkill = !skill && skillId === '1' ? skillData[1] : null

  if (!skill && !fallbackSkill) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Skill not found</h1>
          <p className="text-muted-foreground mb-4">
            The skill you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/explore">
            <Button>Back to Explore</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Use either the database skill or fallback skill
  const currentSkill = skill || fallbackSkill

  // Normalize skill data to work with both structures
  const normalizedSkill = {
    id: currentSkill?.id || skillId,
    title: skill?.name || currentSkill?.title || 'Unknown Skill',
    subtitle: skill?.description || currentSkill?.subtitle || '',
    category: skill?.category?.name || currentSkill?.category || 'General',
    subcategory: currentSkill?.subcategory || 'General',
    description: skill?.description || currentSkill?.description || '',
    longDescription: currentSkill?.longDescription || skill?.description || '',
    level: currentSkill?.level || (skill?.levels?.[0]?.level || 'Beginner'),
    rating: currentSkill?.rating || 4.5,
    reviewCount: currentSkill?.reviewCount || 0,
    students: currentSkill?.students || 0,
    duration: currentSkill?.duration || 'Self-paced',
    totalHours: currentSkill?.totalHours || 40,
    trending: currentSkill?.trending || false,
    difficulty: currentSkill?.difficulty || 'Intermediate',
    language: currentSkill?.language || 'English',
    lastUpdated: currentSkill?.lastUpdated || '2024-01-15',
    certificate: currentSkill?.certificate || true,
    prerequisites: skill?.prerequisites || currentSkill?.prerequisites || [],
    tags: currentSkill?.tags || [],
    features: currentSkill?.features || [
      'Self-paced learning',
      'Practical exercises',
      'Certificate of completion',
      'Community support'
    ],
    roadmap: currentSkill?.roadmap || skill?.roadmap || [],
    reviews: currentSkill?.reviews || [],
    upcomingMeetings: currentSkill?.upcomingMeetings || [],
    instructor: currentSkill?.instructor || {
      name: 'Expert Instructor',
      avatar: '/instructors/default.jpg',
      title: 'Professional Instructor',
      rating: 4.8,
      students: 1000,
      courses: 5,
      bio: 'Experienced professional with expertise in this field.',
      experience: '5+ years',
      specialties: ['Teaching', 'Professional Development']
    }
  }

  const handleEnroll = () => {
    setIsEnrolled(true)
    // Here you would typically make an API call to enroll the user
  }

  const handleJoinMeeting = (meetingId: number) => {
    // Handle joining a study group meeting
    console.log(`Joining meeting ${meetingId}`)
  }

  const handleCreateMeeting = () => {
    // Handle creating a new study group meeting
    console.log('Creating new meeting')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                <Link href="/explore" className="hover:text-foreground">Explore</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/explore/technology" className="hover:text-foreground">{normalizedSkill.category}</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground">{normalizedSkill.title}</span>
              </nav>

              {/* Title & Meta */}
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                    {normalizedSkill.subcategory}
                  </Badge>
                  {normalizedSkill.trending && (
                    <Badge className="bg-red-500 text-white">
                      🔥 Trending
                    </Badge>
                  )}
                  <Badge variant="outline">{normalizedSkill.level}</Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {normalizedSkill.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  {normalizedSkill.subtitle}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{normalizedSkill.rating}</span>
                    <span className="text-muted-foreground">({normalizedSkill.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{normalizedSkill.students.toLocaleString()} students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{normalizedSkill.totalHours} hours</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Updated {normalizedSkill.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Instructor */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Your Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={normalizedSkill.instructor.avatar} />
                      <AvatarFallback>{normalizedSkill.instructor.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{normalizedSkill.instructor.name}</h3>
                      <p className="text-muted-foreground mb-2">{normalizedSkill.instructor.title}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{normalizedSkill.instructor.rating} rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{normalizedSkill.instructor.students.toLocaleString()} students</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{normalizedSkill.instructor.courses} courses</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{normalizedSkill.instructor.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {normalizedSkill.instructor.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="meetings">Study Groups</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-gray dark:prose-invert max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line">
                          {normalizedSkill.longDescription}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>What You'll Learn</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {normalizedSkill.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Prerequisites</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {normalizedSkill.prerequisites.map((prereq, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">{prereq}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Roadmap Tab */}
                <TabsContent value="roadmap" className="space-y-6">
                  {(() => {
                    // Map skillId to roadmap type
                    let roadmapType = 'devops'
                    if (skillId === '1' || skillId === 'react-development') roadmapType = 'react'
                    else if (normalizedSkill.subcategory === 'Web Development') roadmapType = 'react'
                    else if (normalizedSkill.category.includes('Medical')) roadmapType = 'nursing'
                    else if (normalizedSkill.category.includes('Engineering')) roadmapType = 'mechanical-engineering'
                    else if (normalizedSkill.category.includes('Fashion')) roadmapType = 'fashion-design'

                    const roadmapData = roadmapDatabase[roadmapType as keyof typeof roadmapDatabase]

                    if (roadmapData) {
                      return (
                        <InteractiveRoadmap
                          roadmapId={roadmapType}
                          roadmapData={roadmapData}
                        />
                      )
                    } else {
                      return (
                        <Card>
                          <CardContent className="p-8 text-center">
                            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">Interactive Roadmap Coming Soon</h3>
                            <p className="text-muted-foreground">
                              We're working on creating an interactive roadmap for this normalizedSkill. Check back soon!
                            </p>
                          </CardContent>
                        </Card>
                      )
                    }
                  })()}
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-6">
                  <DocumentManager
                    skillId={skillId}
                    userRole="student" // This would come from user context
                    userId="current-user-id" // This would come from user context
                  />
                </TabsContent>

                {/* Study Groups Tab */}
                <TabsContent value="meetings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            Study Groups & Meetings
                          </CardTitle>
                          <CardDescription>
                            Join or organize study sessions with fellow learners
                          </CardDescription>
                        </div>
                        <Button onClick={handleCreateMeeting} className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Create Meeting
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {normalizedSkill.upcomingMeetings.map((meeting) => (
                          <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{meeting.title}</h3>
                                  <p className="text-muted-foreground text-sm mb-2">
                                    Led by {meeting.instructor}
                                  </p>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>{meeting.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{meeting.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      <span>{meeting.participants}/{meeting.maxParticipants}</span>
                                    </div>
                                  </div>
                                </div>
                                <Badge
                                  variant={meeting.type === 'Study Group' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {meeting.type}
                                </Badge>
                              </div>

                              <div className="mb-4">
                                <h4 className="font-medium text-sm mb-2">Topics to cover:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {meeting.topics.map((topic, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {topic}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                  Duration: {meeting.duration}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleJoinMeeting(meeting.id)}
                                  className="flex items-center gap-2"
                                >
                                  <UserPlus className="w-4 h-4" />
                                  Join Meeting
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        {normalizedSkill.upcomingMeetings.length === 0 && (
                          <div className="text-center py-8">
                            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-medium text-lg mb-2">No upcoming meetings</h3>
                            <p className="text-muted-foreground mb-4">
                              Be the first to organize a study group for this skill!
                            </p>
                            <Button onClick={handleCreateMeeting}>
                              Create Study Group
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Reviews</CardTitle>
                      <CardDescription>
                        What students are saying about this course
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {normalizedSkill.reviews.map((review) => (
                          <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarImage src={review.avatar} />
                                <AvatarFallback>{review.user[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="font-medium">{review.user}</span>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: review.rating }).map((_, idx) => (
                                      <Star key={idx} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                  </div>
                                  <span className="text-sm text-muted-foreground">{review.date}</span>
                                </div>
                                <p className="text-muted-foreground mb-3">{review.comment}</p>
                                <div className="flex items-center gap-4">
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <Heart className="w-4 h-4 mr-1" />
                                    Helpful ({review.helpful})
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 px-2">
                                    <MessageCircle className="w-4 h-4 mr-1" />
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                {/* Enrollment Card */}
                <Card className="mb-6">
                  <CardContent className="p-6">

                    {isEnrolled ? (
                      <div className="space-y-3">
                        <Button className="w-full" size="lg">
                          <Play className="w-4 h-4 mr-2" />
                          Continue Learning
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download Resources
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button onClick={handleEnroll} className="w-full" size="lg">
                          Enroll Now
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Video className="w-4 h-4 mr-2" />
                          Preview Course
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Course Features */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg">This course includes:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {normalizedSkill.features.slice(0, 6).map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills you'll gain:</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {normalizedSkill.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}