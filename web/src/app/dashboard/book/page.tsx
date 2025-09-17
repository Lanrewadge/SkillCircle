'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, User, Star, CreditCard, MessageCircle, Video, Shield, DollarSign, Award, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/stores/authStore'
import { allSkills } from '@/data/skills'
import PaymentModal from '@/components/payment/PaymentModal'
import { format, addDays, setHours, setMinutes, isSameDay, isAfter, isBefore } from 'date-fns'

interface Teacher {
  id: string
  name: string
  avatar: string
  bio: string
  rating: number
  reviewCount: number
  hourlyRate: number
  verified: boolean
  responseTime: string
  teachingExperience: string
  specialties: string[]
  languages: string[]
  education: string[]
  certifications: string[]
  totalSessions: number
  totalStudents: number
  joinedDate: string
  skills: {
    skillId: string
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
    experience: string
  }[]
  availability: {
    [key: string]: string[]
  }
  reviews: {
    id: string
    studentName: string
    studentAvatar: string
    rating: number
    comment: string
    date: string
    skillName: string
  }[]
}

// Mock teacher data
const mockTeacher: Teacher = {
  id: '1',
  name: 'Sarah Chen',
  avatar: '/avatars/sarah.jpg',
  bio: 'Passionate software engineer with 8+ years of experience in React, Node.js, and full-stack development. I love teaching and helping students build real-world projects.',
  rating: 4.9,
  reviewCount: 47,
  hourlyRate: 85,
  verified: true,
  responseTime: '< 1 hour',
  teachingExperience: '4+ years',
  totalSessions: 320,
  totalStudents: 89,
  joinedDate: '2022-03-15',
  specialties: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Full-Stack Development'],
  languages: ['English (Native)', 'Mandarin (Fluent)', 'Spanish (Basic)'],
  education: [
    'M.S. Computer Science - Stanford University',
    'B.S. Software Engineering - UC Berkeley'
  ],
  certifications: [
    'AWS Certified Solutions Architect',
    'Google Cloud Professional Developer',
    'Meta React Developer Certificate'
  ],
  skills: [
    {
      skillId: 'react-development',
      level: 'EXPERT',
      experience: '6+ years building production React apps at Google and Meta'
    },
    {
      skillId: 'nodejs-development',
      level: 'ADVANCED',
      experience: '5+ years backend development with Node.js and Express'
    },
    {
      skillId: 'javascript-fundamentals',
      level: 'EXPERT',
      experience: '8+ years of JavaScript development across different environments'
    }
  ],
  availability: {
    '2025-09-18': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
    '2025-09-19': ['10:00', '11:00', '13:00', '14:00', '15:00'],
    '2025-09-20': ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'],
    '2025-09-21': ['09:00', '10:00', '14:00', '15:00', '16:00'],
    '2025-09-22': ['10:00', '11:00', '12:00', '13:00', '14:00']
  },
  reviews: [
    {
      id: '1',
      studentName: 'Alex Johnson',
      studentAvatar: '/avatars/alex.jpg',
      rating: 5,
      comment: 'Sarah is an amazing teacher! She explained React concepts clearly and helped me build my first real project. Highly recommended!',
      date: '2025-09-10',
      skillName: 'React Development'
    },
    {
      id: '2',
      studentName: 'Maria Rodriguez',
      studentAvatar: '/avatars/maria.jpg',
      rating: 5,
      comment: 'Excellent teacher with great patience. The Node.js course was exactly what I needed to advance my backend skills.',
      date: '2025-09-08',
      skillName: 'Node.js Development'
    },
    {
      id: '3',
      studentName: 'David Kim',
      studentAvatar: '/avatars/david.jpg',
      rating: 4,
      comment: 'Very knowledgeable and professional. The JavaScript fundamentals course was comprehensive and well-structured.',
      date: '2025-09-05',
      skillName: 'JavaScript Fundamentals'
    }
  ]
}

interface BookingSession {
  skillId: string
  teacherId: string
  date: Date
  duration: number
  sessionType: 'online' | 'in-person'
  notes: string
  learningGoals: string
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()

  const [teacher] = useState<Teacher>(mockTeacher)
  const [selectedSkill, setSelectedSkill] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [sessionDuration, setSessionDuration] = useState<number>(60)
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online')
  const [notes, setNotes] = useState('')
  const [learningGoals, setLearningGoals] = useState('')
  const [currentStep, setCurrentStep] = useState<'details' | 'schedule' | 'payment'>('details')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  useEffect(() => {
    const skillParam = searchParams.get('skill')
    const teacherParam = searchParams.get('teacher')

    if (skillParam) {
      setSelectedSkill(skillParam)
    }

    if (teacherParam) {
      // Load specific teacher data
    }
  }, [searchParams])

  const availableDates = Object.keys(teacher.availability).map(dateStr => new Date(dateStr))
  const skill = allSkills.find(s => s.id === selectedSkill)
  const teacherSkill = teacher.skills.find(s => s.skillId === selectedSkill)

  const getAvailableTimesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return teacher.availability[dateStr] || []
  }

  const calculateTotalCost = () => {
    const hourlyRate = teacher.hourlyRate
    const hours = sessionDuration / 60
    return hourlyRate * hours
  }

  const canProceedToSchedule = () => {
    return selectedSkill && sessionDuration && sessionType
  }

  const canProceedToPayment = () => {
    return selectedDate && selectedTime && canProceedToSchedule()
  }

  const handleBookSession = () => {
    if (!canProceedToPayment()) return

    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    setBookingConfirmed(true)
    setShowPaymentModal(false)

    // Here you would typically save the booking to your backend
    console.log('Booking confirmed with payment ID:', paymentId)
  }

  const formatSessionDateTime = () => {
    if (!selectedDate || !selectedTime) return ''

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const sessionDateTime = setMinutes(setHours(selectedDate, hours), minutes)

    return {
      date: format(sessionDateTime, 'EEEE, MMMM d, yyyy'),
      time: format(sessionDateTime, 'h:mm a'),
      dateTime: sessionDateTime
    }
  }

  const sessionDateTime = formatSessionDateTime()

  if (bookingConfirmed) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="text-center">
          <CardContent className="p-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Session Booked Successfully! 🎉</h1>
            <p className="text-gray-600 mb-6">
              Your session with {teacher.name} has been confirmed. You will receive a confirmation email shortly.
            </p>

            <Card className="max-w-md mx-auto mb-6">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Skill:</span>
                    <span className="font-medium">{skill?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{sessionDateTime.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{sessionDateTime.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{sessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{sessionType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/dashboard/calendar')}>
                View Calendar
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/browse')}>
                Book Another Session
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Book a Session</h1>
        <p className="text-gray-600">Schedule a learning session with an expert teacher</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8">
        {[
          { id: 'details', label: 'Session Details', icon: BookOpen },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'payment', label: 'Payment', icon: CreditCard }
        ].map((step, index) => {
          const Icon = step.icon
          const isActive = currentStep === step.id
          const isCompleted = (step.id === 'details' && canProceedToSchedule()) ||
                            (step.id === 'schedule' && canProceedToPayment()) ||
                            (step.id === 'payment' && bookingConfirmed)

          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isActive ? 'bg-blue-600 text-white' :
                isCompleted ? 'bg-green-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-blue-600' :
                isCompleted ? 'text-green-600' :
                'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < 2 && (
                <div className={`w-20 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {currentStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
                <CardDescription>Choose what you want to learn and how</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="skill">Select Skill</Label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a skill to learn" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.skills.map((teacherSkill) => {
                        const skill = allSkills.find(s => s.id === teacherSkill.skillId)
                        if (!skill) return null

                        return (
                          <SelectItem key={skill.id} value={skill.id}>
                            <div className="flex items-center gap-2">
                              <span>{skill.category.icon}</span>
                              <span>{skill.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {teacherSkill.level}
                              </Badge>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  {selectedSkill && teacherSkill && (
                    <p className="text-sm text-gray-600 mt-2">
                      {teacherSkill.experience}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="duration">Session Duration</Label>
                  <Select value={sessionDuration.toString()} onValueChange={(value) => setSessionDuration(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes - ${(teacher.hourlyRate * 0.5).toFixed(0)}</SelectItem>
                      <SelectItem value="60">1 hour - ${teacher.hourlyRate}</SelectItem>
                      <SelectItem value="90">1.5 hours - ${(teacher.hourlyRate * 1.5).toFixed(0)}</SelectItem>
                      <SelectItem value="120">2 hours - ${teacher.hourlyRate * 2}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Session Type</Label>
                  <RadioGroup value={sessionType} onValueChange={(value: 'online' | 'in-person') => setSessionType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online" className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Online Session
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="in-person" id="in-person" />
                      <Label htmlFor="in-person" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        In-Person Session
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="goals">Learning Goals (Optional)</Label>
                  <Textarea
                    id="goals"
                    placeholder="What specific topics or goals would you like to focus on during this session?"
                    value={learningGoals}
                    onChange={(e) => setLearningGoals(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information for your teacher..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep('schedule')}
                  disabled={!canProceedToSchedule()}
                  className="w-full"
                  size="lg"
                >
                  Continue to Schedule
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle>Choose Date & Time</CardTitle>
                <CardDescription>Select when you'd like to have your session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Available Dates</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {availableDates.map((date) => {
                      const isSelected = selectedDate && isSameDay(date, selectedDate)
                      const availableTimes = getAvailableTimesForDate(date)

                      return (
                        <Button
                          key={date.toISOString()}
                          variant={isSelected ? "default" : "outline"}
                          onClick={() => {
                            setSelectedDate(date)
                            setSelectedTime('')
                          }}
                          className="h-auto p-3 flex flex-col items-center"
                          disabled={availableTimes.length === 0}
                        >
                          <div className="font-medium">
                            {format(date, 'EEE')}
                          </div>
                          <div className="text-sm">
                            {format(date, 'MMM d')}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {availableTimes.length} slots
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <Label>Available Times for {format(selectedDate, 'EEEE, MMMM d')}</Label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                      {getAvailableTimesForDate(selectedDate).map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          size="sm"
                        >
                          {format(new Date(`2000-01-01T${time}:00`), 'h:mm a')}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('details')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStep('payment')}
                    disabled={!canProceedToPayment()}
                    className="flex-1"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle>Session Summary</CardTitle>
                <CardDescription>Review your booking details before payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex justify-between">
                    <span>Skill:</span>
                    <span className="font-medium">{skill?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teacher:</span>
                    <span className="font-medium">{teacher.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{sessionDateTime.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{sessionDateTime.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{sessionDuration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium capitalize">{sessionType}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total:</span>
                    <span>${calculateTotalCost().toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Booking Protection</h4>
                      <p className="text-sm text-blue-700">
                        Your booking is protected. If your teacher cancels or doesn't show up, you'll receive a full refund.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('schedule')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleBookSession}
                    className="flex-1"
                    size="lg"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Book & Pay ${calculateTotalCost().toFixed(2)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Teacher Info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback>
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {teacher.verified && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{teacher.name}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{teacher.rating}</span>
                      <span className="text-sm text-gray-600">({teacher.reviewCount})</span>
                    </div>
                    {teacher.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${teacher.hourlyRate}/hour
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{teacher.bio}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{teacher.totalStudents} students taught</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span>{teacher.totalSessions} sessions completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Responds in {teacher.responseTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Teaching for {teacher.teachingExperience}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-1">
                  {teacher.specialties.slice(0, 4).map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {teacher.specialties.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{teacher.specialties.length - 4} more
                    </Badge>
                  )}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                <MessageCircle className="h-3 w-3 mr-2" />
                Message Teacher
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {teacher.reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={review.studentAvatar} />
                      <AvatarFallback className="text-xs">
                        {review.studentName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{review.studentName}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{review.skillName}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedDate && selectedTime && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          session={{
            id: 'temp-session-id',
            skillName: skill?.name || '',
            teacherName: teacher.name,
            teacherAvatar: teacher.avatar,
            date: sessionDateTime.dateTime,
            duration: sessionDuration,
            hourlyRate: teacher.hourlyRate,
            totalAmount: calculateTotalCost(),
            currency: 'USD',
            type: sessionType,
            location: sessionType === 'online' ? 'Online (Video Call)' : 'In-Person'
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  )
}