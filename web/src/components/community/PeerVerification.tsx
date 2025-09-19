'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
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
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  Users,
  Eye,
  MessageSquare,
  Flag,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  FileText,
  Video,
  Code,
  Zap,
  Trophy,
  Medal,
  Crown
} from 'lucide-react'

interface VerificationRequest {
  id: string
  userId: string
  userName: string
  userAvatar: string
  skillName: string
  skillCategory: string
  experienceLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  evidence: {
    type: 'PROJECT' | 'CERTIFICATE' | 'PORTFOLIO' | 'VIDEO' | 'CODE'
    title: string
    description: string
    url?: string
    content?: string
  }[]
  submittedAt: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED'
  reviewers: string[]
  requiredReviews: number
  currentReviews: number
  consensusScore: number
}

interface VerificationReview {
  id: string
  requestId: string
  reviewerId: string
  reviewerName: string
  reviewerReputation: number
  decision: 'APPROVE' | 'REJECT' | 'NEEDS_MORE_INFO'
  confidence: number
  feedback: string
  createdAt: string
}

interface VerificationStats {
  totalRequests: number
  verified: number
  pending: number
  verificationRate: number
  averageReviewTime: number
  topVerifiers: Array<{
    id: string
    name: string
    avatar: string
    reviews: number
    accuracy: number
  }>
}

export default function PeerVerification() {
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [reviews, setReviews] = useState<VerificationReview[]>([])
  const [stats, setStats] = useState<VerificationStats | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null)
  const [newReview, setNewReview] = useState({
    decision: 'APPROVE' as 'APPROVE' | 'REJECT' | 'NEEDS_MORE_INFO',
    confidence: 80,
    feedback: ''
  })
  const [activeTab, setActiveTab] = useState<'pending' | 'my-requests' | 'completed'>('pending')
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [newRequest, setNewRequest] = useState({
    skillName: '',
    skillCategory: '',
    experienceLevel: 'INTERMEDIATE' as const,
    evidence: []
  })

  useEffect(() => {
    fetchVerificationData()
  }, [])

  const fetchVerificationData = async () => {
    try {
      // Mock data for demonstration
      const mockRequests: VerificationRequest[] = [
        {
          id: 'req_1',
          userId: '2',
          userName: 'Sarah Chen',
          userAvatar: '/avatars/sarah.jpg',
          skillName: 'React Development',
          skillCategory: 'Programming',
          experienceLevel: 'ADVANCED',
          evidence: [
            {
              type: 'PROJECT',
              title: 'E-commerce Platform with React',
              description: 'Built a full-stack e-commerce platform using React, Redux, and Node.js. Features include user authentication, payment processing, and real-time inventory management.',
              url: 'https://github.com/sarachen/ecommerce-react'
            },
            {
              type: 'CERTIFICATE',
              title: 'React Advanced Patterns Certification',
              description: 'Completed advanced React certification covering hooks, context, performance optimization, and testing.',
              url: 'https://certificates.dev/react-advanced-123'
            },
            {
              type: 'CODE',
              title: 'Custom React Hooks Library',
              description: 'Created a collection of 15+ custom React hooks for common use cases, with TypeScript support and comprehensive testing.',
              content: 'import { useState, useEffect, useCallback } from \'react\';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}'
            }
          ],
          submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'UNDER_REVIEW',
          reviewers: ['1', '3', '4'],
          requiredReviews: 3,
          currentReviews: 2,
          consensusScore: 85
        },
        {
          id: 'req_2',
          userId: '5',
          userName: 'Alex Kim',
          userAvatar: '/avatars/alex.jpg',
          skillName: 'Machine Learning',
          skillCategory: 'Data Science',
          experienceLevel: 'EXPERT',
          evidence: [
            {
              type: 'PROJECT',
              title: 'Computer Vision Model for Medical Diagnosis',
              description: 'Developed a deep learning model using TensorFlow and PyTorch for analyzing medical images. Achieved 94% accuracy on validation set.',
              url: 'https://github.com/alexkim/medical-cv'
            },
            {
              type: 'VIDEO',
              title: 'ML Conference Presentation',
              description: 'Presented research findings at the International ML Conference 2024. Talk covered novel approaches to model interpretability.',
              url: 'https://youtube.com/watch?v=ml-conference-2024'
            }
          ],
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'PENDING',
          reviewers: [],
          requiredReviews: 5,
          currentReviews: 0,
          consensusScore: 0
        },
        {
          id: 'req_3',
          userId: '1',
          userName: 'You',
          userAvatar: '/avatars/you.jpg',
          skillName: 'UI/UX Design',
          skillCategory: 'Design',
          experienceLevel: 'INTERMEDIATE',
          evidence: [
            {
              type: 'PORTFOLIO',
              title: 'Design Portfolio - Mobile Apps',
              description: 'Collection of 8 mobile app designs with user research, wireframes, prototypes, and usability testing results.',
              url: 'https://portfolio.dev/my-designs'
            }
          ],
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          status: 'VERIFIED',
          reviewers: ['2', '4', '6'],
          requiredReviews: 3,
          currentReviews: 3,
          consensusScore: 92
        }
      ]

      const mockReviews: VerificationReview[] = [
        {
          id: 'review_1',
          requestId: 'req_1',
          reviewerId: '1',
          reviewerName: 'You',
          reviewerReputation: 850,
          decision: 'APPROVE',
          confidence: 90,
          feedback: 'Excellent work! The e-commerce project demonstrates advanced React skills including state management, performance optimization, and testing. Code quality is high and follows best practices.',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'review_2',
          requestId: 'req_1',
          reviewerId: '3',
          reviewerName: 'Mike Johnson',
          reviewerReputation: 720,
          decision: 'APPROVE',
          confidence: 85,
          feedback: 'Strong React skills demonstrated through practical projects. The custom hooks library shows deep understanding of React patterns. Certificate adds credibility.',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ]

      const mockStats: VerificationStats = {
        totalRequests: 156,
        verified: 124,
        pending: 32,
        verificationRate: 79.5,
        averageReviewTime: 18.5,
        topVerifiers: [
          { id: '4', name: 'Dr. Emily Rodriguez', avatar: '/avatars/emily.jpg', reviews: 89, accuracy: 96.2 },
          { id: '6', name: 'David Wilson', avatar: '/avatars/david.jpg', reviews: 67, accuracy: 94.8 },
          { id: '1', name: 'You', avatar: '/avatars/you.jpg', reviews: 45, accuracy: 91.1 }
        ]
      }

      setRequests(mockRequests)
      setReviews(mockReviews)
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to fetch verification data:', error)
    }
  }

  const submitReview = () => {
    if (!selectedRequest) return

    const review: VerificationReview = {
      id: `review_${Date.now()}`,
      requestId: selectedRequest.id,
      reviewerId: '1',
      reviewerName: 'You',
      reviewerReputation: 850,
      decision: newReview.decision,
      confidence: newReview.confidence,
      feedback: newReview.feedback,
      createdAt: new Date().toISOString()
    }

    setReviews(prev => [...prev, review])

    // Update request
    const updatedRequest = {
      ...selectedRequest,
      currentReviews: selectedRequest.currentReviews + 1,
      reviewers: [...selectedRequest.reviewers, '1']
    }

    // Check if verification is complete
    if (updatedRequest.currentReviews >= updatedRequest.requiredReviews) {
      updatedRequest.status = 'VERIFIED'
      updatedRequest.consensusScore = 88 // Mock calculation
    }

    setRequests(prev => prev.map(req =>
      req.id === selectedRequest.id ? updatedRequest : req
    ))

    setSelectedRequest(null)
    setNewReview({ decision: 'APPROVE', confidence: 80, feedback: '' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'VERIFIED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />
      case 'UNDER_REVIEW': return <Eye className="h-4 w-4" />
      case 'VERIFIED': return <CheckCircle className="h-4 w-4" />
      case 'REJECTED': return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getExperienceIcon = (level: string) => {
    switch (level) {
      case 'BEGINNER': return <Badge className="bg-green-100 text-green-800">🌱 Beginner</Badge>
      case 'INTERMEDIATE': return <Badge className="bg-blue-100 text-blue-800">⚡ Intermediate</Badge>
      case 'ADVANCED': return <Badge className="bg-purple-100 text-purple-800">🚀 Advanced</Badge>
      case 'EXPERT': return <Badge className="bg-orange-100 text-orange-800">👑 Expert</Badge>
      default: return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case 'PROJECT': return <Code className="h-4 w-4" />
      case 'CERTIFICATE': return <Award className="h-4 w-4" />
      case 'PORTFOLIO': return <FileText className="h-4 w-4" />
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'CODE': return <Code className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredRequests = requests.filter(request => {
    switch (activeTab) {
      case 'pending':
        return request.status === 'PENDING' || request.status === 'UNDER_REVIEW'
      case 'my-requests':
        return request.userId === '1'
      case 'completed':
        return request.status === 'VERIFIED' || request.status === 'REJECTED'
      default:
        return true
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            Peer Verification
          </h1>
          <p className="text-muted-foreground">Community-driven skill verification and validation</p>
        </div>

        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogTrigger asChild>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Submit for Verification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit Skill for Verification</DialogTitle>
              <DialogDescription>
                Get your skills verified by experienced community members
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Skill verification helps establish credibility and trust in the community.
                Provide evidence of your expertise for peer review.
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalRequests}</div>
                  <div className="text-sm text-muted-foreground">Total Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.verified}</div>
                  <div className="text-sm text-muted-foreground">Verified Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending Review</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.verificationRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { key: 'pending', label: 'Pending Review', count: requests.filter(r => r.status === 'PENDING' || r.status === 'UNDER_REVIEW').length },
          { key: 'my-requests', label: 'My Requests', count: requests.filter(r => r.userId === '1').length },
          { key: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'VERIFIED' || r.status === 'REJECTED').length }
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

      {/* Verification Requests */}
      <div className="space-y-4">
        {filteredRequests.map(request => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={request.userAvatar} />
                      <AvatarFallback>{request.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{request.skillName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{request.userName}</span>
                        <span>•</span>
                        <span>{request.skillCategory}</span>
                        <span>•</span>
                        <span>{new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {getExperienceIcon(request.experienceLevel)}
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>

                  {/* Evidence Preview */}
                  <div>
                    <h4 className="font-medium mb-2">Evidence ({request.evidence.length} items)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {request.evidence.slice(0, 2).map((evidence, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded text-sm">
                          {getEvidenceIcon(evidence.type)}
                          <span className="truncate">{evidence.title}</span>
                        </div>
                      ))}
                      {request.evidence.length > 2 && (
                        <div className="text-sm text-muted-foreground">
                          +{request.evidence.length - 2} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Review Progress</span>
                      <span>{request.currentReviews}/{request.requiredReviews} reviews</span>
                    </div>
                    <Progress value={(request.currentReviews / request.requiredReviews) * 100} />
                    {request.consensusScore > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Consensus Score: {request.consensusScore}%
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-6 space-y-2">
                  <Button
                    onClick={() => setSelectedRequest(request)}
                    disabled={request.reviewers.includes('1') || request.userId === '1'}
                  >
                    {request.reviewers.includes('1') ? 'Already Reviewed' :
                     request.userId === '1' ? 'Your Request' : 'Review'}
                  </Button>

                  {request.status === 'VERIFIED' && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Medal className="h-4 w-4" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Verifiers */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Top Verifiers
            </CardTitle>
            <CardDescription>Community members with highest verification accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topVerifiers.map((verifier, index) => (
                <div key={verifier.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-500 text-white' :
                      'bg-muted-foreground text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={verifier.avatar} />
                      <AvatarFallback>{verifier.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{verifier.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {verifier.reviews} reviews
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{verifier.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <span>Review: {selectedRequest.skillName}</span>
                  {getExperienceIcon(selectedRequest.experienceLevel)}
                </DialogTitle>
                <DialogDescription>
                  Evaluate {selectedRequest.userName}'s skill verification request
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Evidence Details */}
                <div>
                  <h3 className="font-semibold mb-3">Evidence Submitted</h3>
                  <div className="space-y-3">
                    {selectedRequest.evidence.map((evidence, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            {getEvidenceIcon(evidence.type)}
                            <div className="flex-1">
                              <h4 className="font-medium">{evidence.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{evidence.description}</p>
                              {evidence.url && (
                                <a
                                  href={evidence.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                                >
                                  View Evidence →
                                </a>
                              )}
                              {evidence.content && (
                                <pre className="bg-muted p-2 rounded text-xs mt-2 overflow-x-auto">
                                  {evidence.content}
                                </pre>
                              )}
                            </div>
                            <Badge variant="outline">{evidence.type}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Existing Reviews */}
                {reviews.filter(r => r.requestId === selectedRequest.id).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Previous Reviews</h3>
                    <div className="space-y-3">
                      {reviews.filter(r => r.requestId === selectedRequest.id).map(review => (
                        <div key={review.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.reviewerName}</span>
                              <Badge variant={review.decision === 'APPROVE' ? 'default' : 'destructive'}>
                                {review.decision === 'APPROVE' ? <ThumbsUp className="h-3 w-3 mr-1" /> : <ThumbsDown className="h-3 w-3 mr-1" />}
                                {review.decision}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {review.confidence}% confidence
                            </div>
                          </div>
                          <p className="text-sm">{review.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <div>
                  <h3 className="font-semibold mb-3">Your Review</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Decision</label>
                      <Select value={newReview.decision} onValueChange={(value: any) => setNewReview(prev => ({ ...prev, decision: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APPROVE">Approve - Skills demonstrated clearly</SelectItem>
                          <SelectItem value="REJECT">Reject - Insufficient evidence</SelectItem>
                          <SelectItem value="NEEDS_MORE_INFO">Needs More Info - Request clarification</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Confidence: {newReview.confidence}%</label>
                      <Progress value={newReview.confidence} className="mt-2" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newReview.confidence}
                        onChange={(e) => setNewReview(prev => ({ ...prev, confidence: parseInt(e.target.value) }))}
                        className="w-full mt-2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Feedback</label>
                      <Textarea
                        value={newReview.feedback}
                        onChange={(e) => setNewReview(prev => ({ ...prev, feedback: e.target.value }))}
                        placeholder="Provide detailed feedback on the evidence quality, skill demonstration, and areas for improvement..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                        Cancel
                      </Button>
                      <Button onClick={submitReview} disabled={!newReview.feedback.trim()}>
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}