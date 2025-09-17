'use client'

import { useState, useEffect } from 'react'
import { Star, StarIcon, ThumbsUp, MessageSquare, Filter, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  sessionId: string
  reviewerId: string
  revieweeId: string
  reviewerName: string
  reviewerAvatar: string
  skillName: string
  skillIcon: string
  rating: number
  comment: string
  skills: {
    communication: number
    knowledge: number
    patience: number
    punctuality: number
  }
  wouldRecommend: boolean
  createdAt: Date
  isTeacher: boolean // true if reviewing a teacher, false if reviewing a student
}

interface ReviewStats {
  averageRating: number
  totalReviews: number
  ratingDistribution: { [key: number]: number }
  skillAverages: {
    communication: number
    knowledge: number
    patience: number
    punctuality: number
  }
}

const StarRating = ({ rating, onRatingChange, size = 'sm', readonly = false }: {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'text-yellow-500 fill-yellow-500'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('received')
  const [sortBy, setSortBy] = useState('newest')
  const [filterRating, setFilterRating] = useState('all')
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false)
  const [newReview, setNewReview] = useState({
    sessionId: '',
    rating: 5,
    comment: '',
    skills: {
      communication: 5,
      knowledge: 5,
      patience: 5,
      punctuality: 5
    },
    wouldRecommend: true
  })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      setLoading(true)

      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: '1',
          sessionId: 'session-1',
          reviewerId: '2',
          revieweeId: '1',
          reviewerName: 'Alex Rodriguez',
          reviewerAvatar: '/avatars/alex.jpg',
          skillName: 'Italian Cooking',
          skillIcon: '🍝',
          rating: 5,
          comment: 'Sarah is an amazing teacher! Her pasta making techniques are authentic and she explains everything so clearly. I learned more in one session than I thought possible. Highly recommended!',
          skills: {
            communication: 5,
            knowledge: 5,
            patience: 5,
            punctuality: 5
          },
          wouldRecommend: true,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          isTeacher: true
        },
        {
          id: '2',
          sessionId: 'session-2',
          reviewerId: '3',
          revieweeId: '1',
          reviewerName: 'Maria Gonzalez',
          reviewerAvatar: '/avatars/maria.jpg',
          skillName: 'React Development',
          skillIcon: '⚛️',
          rating: 5,
          comment: 'Excellent teacher! Very knowledgeable about React and modern web development. The session was well-structured and I got hands-on experience building a real component.',
          skills: {
            communication: 5,
            knowledge: 5,
            patience: 4,
            punctuality: 5
          },
          wouldRecommend: true,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          isTeacher: true
        },
        {
          id: '3',
          sessionId: 'session-3',
          reviewerId: '4',
          revieweeId: '1',
          reviewerName: 'James Thompson',
          reviewerAvatar: '/avatars/james.jpg',
          skillName: 'Guitar Playing',
          skillIcon: '🎸',
          rating: 4,
          comment: 'Great enthusiasm for learning! Came prepared with specific questions and practice pieces. Made good progress during our session.',
          skills: {
            communication: 4,
            knowledge: 3,
            patience: 4,
            punctuality: 5
          },
          wouldRecommend: true,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isTeacher: false
        },
        {
          id: '4',
          sessionId: 'session-4',
          reviewerId: '5',
          revieweeId: '1',
          reviewerName: 'Emma Wilson',
          reviewerAvatar: '/avatars/emma.jpg',
          skillName: 'Node.js Backend',
          skillIcon: '🟢',
          rating: 5,
          comment: 'Fantastic session! Really helped me understand API development and database integration. The explanations were clear and the examples were practical.',
          skills: {
            communication: 5,
            knowledge: 5,
            patience: 5,
            punctuality: 4
          },
          wouldRecommend: true,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          isTeacher: true
        },
        {
          id: '5',
          sessionId: 'session-5',
          reviewerId: '1',
          revieweeId: '2',
          reviewerName: 'David Park',
          reviewerAvatar: '/avatars/david.jpg',
          skillName: 'React Development',
          skillIcon: '⚛️',
          rating: 4,
          comment: 'Alex is very knowledgeable and patient. The session covered hooks and state management really well. Would definitely book another session!',
          skills: {
            communication: 4,
            knowledge: 5,
            patience: 5,
            punctuality: 4
          },
          wouldRecommend: true,
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
          isTeacher: true
        }
      ]

      setReviews(mockReviews)

      // Calculate stats
      const teacherReviews = mockReviews.filter(r => r.isTeacher)
      const totalReviews = teacherReviews.length
      const averageRating = totalReviews > 0
        ? teacherReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0

      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      teacherReviews.forEach(r => {
        ratingDistribution[r.rating]++
      })

      const skillAverages = {
        communication: totalReviews > 0 ? teacherReviews.reduce((sum, r) => sum + r.skills.communication, 0) / totalReviews : 0,
        knowledge: totalReviews > 0 ? teacherReviews.reduce((sum, r) => sum + r.skills.knowledge, 0) / totalReviews : 0,
        patience: totalReviews > 0 ? teacherReviews.reduce((sum, r) => sum + r.skills.patience, 0) / totalReviews : 0,
        punctuality: totalReviews > 0 ? teacherReviews.reduce((sum, r) => sum + r.skills.punctuality, 0) / totalReviews : 0,
      }

      setStats({
        averageRating,
        totalReviews,
        ratingDistribution,
        skillAverages
      })

    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredAndSortedReviews = () => {
    let filtered = reviews

    // Filter by tab
    if (activeTab === 'received') {
      filtered = filtered.filter(r => r.revieweeId === '1') // Current user
    } else {
      filtered = filtered.filter(r => r.reviewerId === '1') // Current user
    }

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(r => r.rating === parseInt(filterRating))
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        break
      case 'highest':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'lowest':
        filtered.sort((a, b) => a.rating - b.rating)
        break
    }

    return filtered
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading reviews...</p>
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
            <Star className="h-8 w-8 text-yellow-500" />
            Reviews & Ratings
          </h1>
          <p className="text-muted-foreground mt-2">
            View feedback from your students and teachers
          </p>
        </div>
        <Dialog open={isWriteReviewOpen} onOpenChange={setIsWriteReviewOpen}>
          <DialogTrigger asChild>
            <Button>
              <Star className="h-4 w-4 mr-2" />
              Write Review
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this teacher or student
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating
                    rating={newReview.rating}
                    onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
                    size="lg"
                  />
                  <span className="text-sm text-muted-foreground">({newReview.rating}/5)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Communication</Label>
                  <StarRating
                    rating={newReview.skills.communication}
                    onRatingChange={(rating) => setNewReview({
                      ...newReview,
                      skills: { ...newReview.skills, communication: rating }
                    })}
                  />
                </div>
                <div>
                  <Label>Knowledge</Label>
                  <StarRating
                    rating={newReview.skills.knowledge}
                    onRatingChange={(rating) => setNewReview({
                      ...newReview,
                      skills: { ...newReview.skills, knowledge: rating }
                    })}
                  />
                </div>
                <div>
                  <Label>Patience</Label>
                  <StarRating
                    rating={newReview.skills.patience}
                    onRatingChange={(rating) => setNewReview({
                      ...newReview,
                      skills: { ...newReview.skills, patience: rating }
                    })}
                  />
                </div>
                <div>
                  <Label>Punctuality</Label>
                  <StarRating
                    rating={newReview.skills.punctuality}
                    onRatingChange={(rating) => setNewReview({
                      ...newReview,
                      skills: { ...newReview.skills, punctuality: rating }
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWriteReviewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log('Submitting review:', newReview)
                setIsWriteReviewOpen(false)
              }}>
                Submit Review
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      {stats && activeTab === 'received' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{stats.averageRating.toFixed(1)}</div>
                <div className="flex justify-center mt-1">
                  <StarRating rating={Math.round(stats.averageRating)} size="sm" readonly />
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.totalReviews} reviews
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Communication</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(stats.skillAverages.communication)} size="sm" readonly />
                  <span className="text-sm">{stats.skillAverages.communication.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Knowledge</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(stats.skillAverages.knowledge)} size="sm" readonly />
                  <span className="text-sm">{stats.skillAverages.knowledge.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Patience</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={Math.round(stats.skillAverages.patience)} size="sm" readonly />
                  <span className="text-sm">{stats.skillAverages.patience.toFixed(1)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="received">
              Reviews Received ({reviews.filter(r => r.revieweeId === '1').length})
            </TabsTrigger>
            <TabsTrigger value="given">
              Reviews Given ({reviews.filter(r => r.reviewerId === '1').length})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rated</SelectItem>
                <SelectItem value="lowest">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-4">
            {getFilteredAndSortedReviews().length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'received'
                      ? "Complete some sessions to start receiving reviews!"
                      : "Write your first review after completing a session."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              getFilteredAndSortedReviews().map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                        <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{review.reviewerName}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{review.skillIcon}</span>
                              <span>{review.skillName}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(review.createdAt, { addSuffix: true })}</span>
                            </div>
                          </div>
                          <Badge variant={review.isTeacher ? 'default' : 'outline'}>
                            {review.isTeacher ? 'Teacher Review' : 'Student Review'}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <StarRating rating={review.rating} size="sm" readonly />
                          <span className="font-semibold">{review.rating}/5</span>
                          {review.wouldRecommend && (
                            <Badge variant="secondary" className="ml-2">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Recommends
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4">{review.comment}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Communication:</span>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.skills.communication} size="sm" readonly />
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Knowledge:</span>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.skills.knowledge} size="sm" readonly />
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Patience:</span>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.skills.patience} size="sm" readonly />
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Punctuality:</span>
                            <div className="flex items-center gap-1">
                              <StarRating rating={review.skills.punctuality} size="sm" readonly />
                            </div>
                          </div>
                        </div>
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