'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Trophy,
  Users,
  Clock,
  Target,
  Zap,
  Star,
  Crown,
  Medal,
  Fire,
  Calendar,
  Plus,
  ChevronRight,
  TrendingUp,
  Award,
  Timer,
  Sword,
  Shield
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  type: 'INDIVIDUAL' | 'TEAM' | 'GLOBAL'
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED'
  startDate: string
  endDate: string
  participants: number
  maxParticipants?: number
  prize: {
    type: 'POINTS' | 'BADGE' | 'CERTIFICATE' | 'REWARDS'
    value: string
    description: string
  }
  requirements: string[]
  skills: string[]
  leaderboard: LeaderboardEntry[]
  progress?: {
    completed: number
    total: number
    userRank?: number
  }
  featured: boolean
}

interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatar: string
  score: number
  progress: number
  streak: number
  completedAt?: string
}

export default function LearningChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'active' | 'upcoming' | 'completed'>('active')
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      // Mock data for demonstration
      const mockChallenges: Challenge[] = [
        {
          id: 'challenge_1',
          title: '30-Day React Mastery Challenge',
          description: 'Build 30 React projects in 30 days. From simple components to complex applications.',
          category: 'Programming',
          difficulty: 'MEDIUM',
          type: 'INDIVIDUAL',
          status: 'ACTIVE',
          startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 1247,
          prize: {
            type: 'CERTIFICATE',
            value: 'React Master Certificate',
            description: 'Official certificate + 5000 skill points'
          },
          requirements: ['Basic JavaScript knowledge', 'Git fundamentals', 'HTML/CSS basics'],
          skills: ['React', 'JavaScript', 'Frontend Development', 'Component Design'],
          leaderboard: [
            {
              rank: 1,
              userId: '1',
              username: 'CodeNinja',
              avatar: '/avatars/user1.jpg',
              score: 2850,
              progress: 28,
              streak: 28,
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
            },
            {
              rank: 2,
              userId: '2',
              username: 'ReactMaster',
              avatar: '/avatars/user2.jpg',
              score: 2720,
              progress: 27,
              streak: 25
            },
            {
              rank: 3,
              userId: '3',
              username: 'DevProdigy',
              avatar: '/avatars/user3.jpg',
              score: 2680,
              progress: 26,
              streak: 26
            }
          ],
          progress: {
            completed: 12,
            total: 30,
            userRank: 156
          },
          featured: true
        },
        {
          id: 'challenge_2',
          title: 'AI Algorithm Speed Run',
          description: 'Implement 10 classic AI algorithms as fast as possible. Accuracy and efficiency matter!',
          category: 'Artificial Intelligence',
          difficulty: 'EXPERT',
          type: 'INDIVIDUAL',
          status: 'ACTIVE',
          startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 324,
          maxParticipants: 500,
          prize: {
            type: 'REWARDS',
            value: '$500 + Premium Mentorship',
            description: 'Cash prize + 1-month premium mentorship'
          },
          requirements: ['Advanced Python/Python knowledge', 'Data structures mastery', 'Math foundations'],
          skills: ['Machine Learning', 'Algorithms', 'Python', 'Data Science'],
          leaderboard: [
            {
              rank: 1,
              userId: '4',
              username: 'AlgoWizard',
              avatar: '/avatars/user4.jpg',
              score: 9500,
              progress: 10,
              streak: 5,
              completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
            }
          ],
          progress: {
            completed: 3,
            total: 10,
            userRank: 89
          },
          featured: true
        },
        {
          id: 'challenge_3',
          title: 'Team Design Sprint',
          description: 'Form teams of 4 and design a complete mobile app in 48 hours. Real client brief!',
          category: 'Design',
          difficulty: 'HARD',
          type: 'TEAM',
          status: 'UPCOMING',
          startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 128,
          maxParticipants: 200,
          prize: {
            type: 'BADGE',
            value: 'Design Sprint Champion',
            description: 'Legendary badge + portfolio feature + internship opportunities'
          },
          requirements: ['Basic design principles', 'Figma knowledge', 'Team collaboration'],
          skills: ['UI/UX Design', 'Prototyping', 'User Research', 'Team Work'],
          leaderboard: [],
          featured: false
        },
        {
          id: 'challenge_4',
          title: 'Language Learning Marathon',
          description: 'Learn 100 new vocabulary words daily for 30 days. Global community event!',
          category: 'Languages',
          difficulty: 'EASY',
          type: 'GLOBAL',
          status: 'ACTIVE',
          startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          participants: 8943,
          prize: {
            type: 'POINTS',
            value: '10,000 Points',
            description: 'Skill points + language badges + community recognition'
          },
          requirements: ['Basic language learning app', 'Daily commitment'],
          skills: ['Language Learning', 'Memory', 'Consistency', 'Cultural Awareness'],
          leaderboard: [
            {
              rank: 1,
              userId: '5',
              username: 'PolyglotPro',
              avatar: '/avatars/user5.jpg',
              score: 14500,
              progress: 1450,
              streak: 15
            },
            {
              rank: 2,
              userId: '6',
              username: 'WordMaster',
              avatar: '/avatars/user6.jpg',
              score: 13890,
              progress: 1389,
              streak: 15
            }
          ],
          progress: {
            completed: 850,
            total: 3000,
            userRank: 234
          },
          featured: false
        }
      ]

      setChallenges(mockChallenges)
    } catch (error) {
      console.error('Failed to fetch challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredChallenges = challenges.filter(challenge =>
    selectedTab === 'active' ? challenge.status === 'ACTIVE' :
    selectedTab === 'upcoming' ? challenge.status === 'UPCOMING' :
    challenge.status === 'COMPLETED'
  )

  const joinChallenge = (challengeId: string) => {
    console.log('Joining challenge:', challengeId)
    // In real app, this would handle challenge registration
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'HARD': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'EXPERT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL': return <Sword className="h-4 w-4" />
      case 'TEAM': return <Shield className="h-4 w-4" />
      case 'GLOBAL': return <Trophy className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getPrizeIcon = (prizeType: string) => {
    switch (prizeType) {
      case 'POINTS': return <Star className="h-4 w-4" />
      case 'BADGE': return <Medal className="h-4 w-4" />
      case 'CERTIFICATE': return <Award className="h-4 w-4" />
      case 'REWARDS': return <Crown className="h-4 w-4" />
      default: return <Trophy className="h-4 w-4" />
    }
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return 'Ended'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Learning Challenges</h1>
          <p className="text-muted-foreground">Compete, learn, and earn rewards through structured challenges</p>
        </div>

        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Challenge
        </Button>
      </div>

      {/* Featured Challenges */}
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Fire className="h-5 w-5 mr-2 text-orange-500" />
          Featured Challenges
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {challenges.filter(c => c.featured).map(challenge => (
            <Card key={challenge.id} className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <div className="flex items-center space-x-1 text-orange-500">
                    {getTypeIcon(challenge.type)}
                    <span className="text-sm font-medium">{challenge.type}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Progress (if active) */}
                  {challenge.progress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your Progress</span>
                        <span>{challenge.progress.completed}/{challenge.progress.total}</span>
                      </div>
                      <Progress value={(challenge.progress.completed / challenge.progress.total) * 100} />
                      <div className="text-xs text-muted-foreground mt-1">
                        Rank #{challenge.progress.userRank} of {challenge.participants}
                      </div>
                    </div>
                  )}

                  {/* Prize */}
                  <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                    {getPrizeIcon(challenge.prize.type)}
                    <div>
                      <div className="font-medium">{challenge.prize.value}</div>
                      <div className="text-sm text-muted-foreground">{challenge.prize.description}</div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} participants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Timer className="h-4 w-4 text-muted-foreground" />
                      <span>{getTimeRemaining(challenge.endDate)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    View Details
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'active', label: 'Active', count: challenges.filter(c => c.status === 'ACTIVE').length },
          { key: 'upcoming', label: 'Upcoming', count: challenges.filter(c => c.status === 'UPCOMING').length },
          { key: 'completed', label: 'Completed', count: challenges.filter(c => c.status === 'COMPLETED').length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setSelectedTab(tab.key as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-8">Loading challenges...</div>
        ) : filteredChallenges.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No {selectedTab} challenges found
          </div>
        ) : (
          filteredChallenges.map(challenge => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        {getTypeIcon(challenge.type)}
                        <span className="text-sm">{challenge.type}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">{challenge.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {challenge.skills.map(skill => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{challenge.participants} joined</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(challenge.startDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Timer className="h-4 w-4" />
                        <span>{getTimeRemaining(challenge.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6 text-right space-y-2">
                    <div className="flex items-center space-x-1">
                      {getPrizeIcon(challenge.prize.type)}
                      <span className="font-medium">{challenge.prize.value}</span>
                    </div>
                    <Button onClick={() => setSelectedChallenge(challenge)}>
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Challenge Details Modal */}
      <Dialog open={!!selectedChallenge} onOpenChange={() => setSelectedChallenge(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedChallenge && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>{selectedChallenge.title}</span>
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedChallenge.description}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Requirements */}
                <div>
                  <h4 className="font-semibold mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedChallenge.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <Target className="h-3 w-3 text-muted-foreground" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prize Details */}
                <div>
                  <h4 className="font-semibold mb-2">Prize</h4>
                  <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                    {getPrizeIcon(selectedChallenge.prize.type)}
                    <div>
                      <div className="font-medium">{selectedChallenge.prize.value}</div>
                      <div className="text-sm text-muted-foreground">{selectedChallenge.prize.description}</div>
                    </div>
                  </div>
                </div>

                {/* Leaderboard */}
                {selectedChallenge.leaderboard.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Leaderboard</h4>
                    <div className="space-y-2">
                      {selectedChallenge.leaderboard.slice(0, 10).map(entry => (
                        <div key={entry.userId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              entry.rank === 1 ? 'bg-yellow-500 text-white' :
                              entry.rank === 2 ? 'bg-gray-400 text-white' :
                              entry.rank === 3 ? 'bg-orange-500 text-white' :
                              'bg-muted-foreground text-white'
                            }`}>
                              {entry.rank}
                            </div>
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={entry.avatar} />
                              <AvatarFallback>{entry.username.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{entry.username}</div>
                              <div className="text-sm text-muted-foreground">
                                {entry.streak} day streak
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{entry.score.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
                    Close
                  </Button>
                  <Button onClick={() => joinChallenge(selectedChallenge.id)}>
                    {selectedChallenge.status === 'UPCOMING' ? 'Register' : 'Join Challenge'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}