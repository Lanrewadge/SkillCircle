'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Users,
  Plus,
  Clock,
  Globe,
  Lock,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  BookOpen,
  Target,
  Calendar,
  Search,
  Filter,
  Star,
  Crown,
  Shield
} from 'lucide-react'

interface StudyRoom {
  id: string
  name: string
  description: string
  subject: string
  hostId: string
  hostName: string
  hostAvatar: string
  participants: Participant[]
  maxParticipants: number
  isPrivate: boolean
  hasPassword: boolean
  status: 'WAITING' | 'ACTIVE' | 'ENDED'
  startTime: string
  estimatedDuration: number
  studyGoals: string[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags: string[]
  features: {
    hasWhiteboard: boolean
    hasScreenShare: boolean
    hasBreakoutRooms: boolean
    hasTimer: boolean
  }
}

interface Participant {
  id: string
  name: string
  avatar: string
  role: 'HOST' | 'MODERATOR' | 'PARTICIPANT'
  status: 'ONLINE' | 'AWAY' | 'BUSY'
  joinedAt: string
  isMuted: boolean
  hasVideo: boolean
  studyStreak: number
  reputation: number
}

export default function StudyRooms() {
  const [rooms, setRooms] = useState<StudyRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    subject: '',
    maxParticipants: 6,
    isPrivate: false,
    password: '',
    estimatedDuration: 60,
    studyGoals: [''],
    difficulty: 'INTERMEDIATE' as const,
    features: {
      hasWhiteboard: true,
      hasScreenShare: false,
      hasBreakoutRooms: false,
      hasTimer: true
    }
  })

  const subjects = [
    'Mathematics', 'Programming', 'Languages', 'Science', 'Business',
    'Design', 'Music', 'Art', 'Literature', 'History'
  ]

  useEffect(() => {
    fetchStudyRooms()
  }, [])

  const fetchStudyRooms = async () => {
    try {
      // Mock data for demonstration
      const mockRooms: StudyRoom[] = [
        {
          id: 'room_1',
          name: 'React Fundamentals Study Group',
          description: 'Learning React hooks, components, and state management together',
          subject: 'Programming',
          hostId: '1',
          hostName: 'Sarah Chen',
          hostAvatar: '/avatars/sarah.jpg',
          participants: [
            {
              id: '1',
              name: 'Sarah Chen',
              avatar: '/avatars/sarah.jpg',
              role: 'HOST',
              status: 'ONLINE',
              joinedAt: new Date(Date.now() - 30 * 60000).toISOString(),
              isMuted: false,
              hasVideo: true,
              studyStreak: 15,
              reputation: 850
            },
            {
              id: '2',
              name: 'Mike Johnson',
              avatar: '/avatars/mike.jpg',
              role: 'PARTICIPANT',
              status: 'ONLINE',
              joinedAt: new Date(Date.now() - 20 * 60000).toISOString(),
              isMuted: false,
              hasVideo: false,
              studyStreak: 7,
              reputation: 620
            },
            {
              id: '3',
              name: 'Alex Kim',
              avatar: '/avatars/alex.jpg',
              role: 'MODERATOR',
              status: 'AWAY',
              joinedAt: new Date(Date.now() - 10 * 60000).toISOString(),
              isMuted: true,
              hasVideo: true,
              studyStreak: 23,
              reputation: 1200
            }
          ],
          maxParticipants: 8,
          isPrivate: false,
          hasPassword: false,
          status: 'ACTIVE',
          startTime: new Date(Date.now() - 45 * 60000).toISOString(),
          estimatedDuration: 120,
          studyGoals: ['Master React Hooks', 'Build a Todo App', 'Understand State Management'],
          difficulty: 'INTERMEDIATE',
          tags: ['React', 'JavaScript', 'Frontend', 'Hands-on'],
          features: {
            hasWhiteboard: true,
            hasScreenShare: true,
            hasBreakoutRooms: false,
            hasTimer: true
          }
        },
        {
          id: 'room_2',
          name: 'Calculus Problem Solving',
          description: 'Working through challenging calculus problems step by step',
          subject: 'Mathematics',
          hostId: '4',
          hostName: 'Dr. Maria Rodriguez',
          hostAvatar: '/avatars/maria.jpg',
          participants: [
            {
              id: '4',
              name: 'Dr. Maria Rodriguez',
              avatar: '/avatars/maria.jpg',
              role: 'HOST',
              status: 'ONLINE',
              joinedAt: new Date(Date.now() - 60 * 60000).toISOString(),
              isMuted: false,
              hasVideo: true,
              studyStreak: 45,
              reputation: 2100
            },
            {
              id: '5',
              name: 'Emma Watson',
              avatar: '/avatars/emma.jpg',
              role: 'PARTICIPANT',
              status: 'ONLINE',
              joinedAt: new Date(Date.now() - 40 * 60000).toISOString(),
              isMuted: true,
              hasVideo: false,
              studyStreak: 12,
              reputation: 780
            }
          ],
          maxParticipants: 6,
          isPrivate: false,
          hasPassword: false,
          status: 'ACTIVE',
          startTime: new Date(Date.now() - 75 * 60000).toISOString(),
          estimatedDuration: 90,
          studyGoals: ['Derivatives Mastery', 'Integration Techniques', 'Real-world Applications'],
          difficulty: 'ADVANCED',
          tags: ['Calculus', 'Problem Solving', 'Math', 'University'],
          features: {
            hasWhiteboard: true,
            hasScreenShare: false,
            hasBreakoutRooms: true,
            hasTimer: false
          }
        },
        {
          id: 'room_3',
          name: 'Spanish Conversation Practice',
          description: 'Practice conversational Spanish in a supportive environment',
          subject: 'Languages',
          hostId: '6',
          hostName: 'Carlos Mendez',
          hostAvatar: '/avatars/carlos.jpg',
          participants: [
            {
              id: '6',
              name: 'Carlos Mendez',
              avatar: '/avatars/carlos.jpg',
              role: 'HOST',
              status: 'ONLINE',
              joinedAt: new Date(Date.now() - 15 * 60000).toISOString(),
              isMuted: false,
              hasVideo: true,
              studyStreak: 38,
              reputation: 1650
            }
          ],
          maxParticipants: 10,
          isPrivate: false,
          hasPassword: false,
          status: 'WAITING',
          startTime: new Date(Date.now() + 15 * 60000).toISOString(),
          estimatedDuration: 60,
          studyGoals: ['Improve Pronunciation', 'Learn Common Phrases', 'Build Confidence'],
          difficulty: 'BEGINNER',
          tags: ['Spanish', 'Conversation', 'Speaking', 'Culture'],
          features: {
            hasWhiteboard: false,
            hasScreenShare: false,
            hasBreakoutRooms: true,
            hasTimer: true
          }
        }
      ]

      setRooms(mockRooms)
    } catch (error) {
      console.error('Failed to fetch study rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSubject = selectedSubject === 'all' || room.subject === selectedSubject
    const matchesDifficulty = selectedDifficulty === 'all' || room.difficulty === selectedDifficulty

    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const joinRoom = (roomId: string) => {
    console.log('Joining room:', roomId)
    // In real app, this would handle room joining logic
  }

  const createRoom = () => {
    const room: StudyRoom = {
      id: `room_${Date.now()}`,
      ...newRoom,
      hostId: '1',
      hostName: 'You',
      hostAvatar: '/avatars/you.jpg',
      participants: [{
        id: '1',
        name: 'You',
        avatar: '/avatars/you.jpg',
        role: 'HOST',
        status: 'ONLINE',
        joinedAt: new Date().toISOString(),
        isMuted: false,
        hasVideo: true,
        studyStreak: 10,
        reputation: 500
      }],
      hasPassword: newRoom.password.length > 0,
      status: 'WAITING',
      startTime: new Date(Date.now() + 5 * 60000).toISOString(),
      tags: newRoom.subject ? [newRoom.subject] : []
    }

    setRooms([room, ...rooms])
    setShowCreateDialog(false)

    // Reset form
    setNewRoom({
      name: '',
      description: '',
      subject: '',
      maxParticipants: 6,
      isPrivate: false,
      password: '',
      estimatedDuration: 60,
      studyGoals: [''],
      difficulty: 'INTERMEDIATE',
      features: {
        hasWhiteboard: true,
        hasScreenShare: false,
        hasBreakoutRooms: false,
        hasTimer: true
      }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500'
      case 'WAITING': return 'bg-yellow-500'
      case 'ENDED': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'ADVANCED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'HOST': return <Crown className="h-3 w-3" />
      case 'MODERATOR': return <Shield className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Study Rooms</h1>
          <p className="text-muted-foreground">Join collaborative learning sessions with peers</p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Study Room</DialogTitle>
              <DialogDescription>
                Set up a collaborative learning session
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Room Name</label>
                <Input
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                  placeholder="e.g., React Fundamentals Study Group"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={newRoom.description}
                  onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                  placeholder="What will you be studying?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={newRoom.subject} onValueChange={(value) => setNewRoom({...newRoom, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={newRoom.difficulty} onValueChange={(value: any) => setNewRoom({...newRoom, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Max Participants</label>
                  <Select value={newRoom.maxParticipants.toString()} onValueChange={(value) => setNewRoom({...newRoom, maxParticipants: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 people</SelectItem>
                      <SelectItem value="6">6 people</SelectItem>
                      <SelectItem value="8">8 people</SelectItem>
                      <SelectItem value="10">10 people</SelectItem>
                      <SelectItem value="15">15 people</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Duration (minutes)</label>
                  <Select value={newRoom.estimatedDuration.toString()} onValueChange={(value) => setNewRoom({...newRoom, estimatedDuration: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={createRoom} disabled={!newRoom.name || !newRoom.subject}>
                  Create Room
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map(subject => (
              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="BEGINNER">Beginner</SelectItem>
            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
            <SelectItem value="ADVANCED">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Room Cards */}
      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-8">Loading study rooms...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No study rooms found matching your criteria
          </div>
        ) : (
          filteredRooms.map(room => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-xl">{room.name}</CardTitle>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(room.status)}`}></div>
                      {room.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <CardDescription>{room.description}</CardDescription>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{room.subject}</Badge>
                      <Badge className={getDifficultyColor(room.difficulty)}>
                        {room.difficulty}
                      </Badge>
                      {room.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-right space-y-2">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {room.participants.length}/{room.maxParticipants}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{room.estimatedDuration}m</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Host & Participants */}
                  <div>
                    <h4 className="font-medium mb-2">Participants</h4>
                    <div className="flex items-center space-x-2">
                      {room.participants.map(participant => (
                        <div key={participant.id} className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                          </Avatar>

                          {/* Role indicator */}
                          {participant.role !== 'PARTICIPANT' && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                              {getRoleIcon(participant.role)}
                            </div>
                          )}

                          {/* Status indicator */}
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                            participant.status === 'ONLINE' ? 'bg-green-500' :
                            participant.status === 'AWAY' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                      ))}

                      {room.participants.length < room.maxParticipants && (
                        <div className="w-8 h-8 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Study Goals */}
                  <div>
                    <h4 className="font-medium mb-2">Study Goals</h4>
                    <div className="space-y-1">
                      {room.studyGoals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span>{goal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {room.features.hasWhiteboard && (
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>Whiteboard</span>
                      </div>
                    )}
                    {room.features.hasScreenShare && (
                      <div className="flex items-center space-x-1">
                        <Video className="h-4 w-4" />
                        <span>Screen Share</span>
                      </div>
                    )}
                    {room.features.hasBreakoutRooms && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>Breakout Rooms</span>
                      </div>
                    )}
                    {room.features.hasTimer && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Timer</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      {room.status === 'ACTIVE' ? 'Started' : room.status === 'WAITING' ? 'Starts' : 'Ended'} {' '}
                      {new Date(room.startTime).toLocaleString()}
                    </div>

                    <Button
                      onClick={() => joinRoom(room.id)}
                      disabled={room.participants.length >= room.maxParticipants || room.status === 'ENDED'}
                    >
                      {room.status === 'ACTIVE' ? 'Join Now' : room.status === 'WAITING' ? 'Join Room' : 'Room Ended'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}