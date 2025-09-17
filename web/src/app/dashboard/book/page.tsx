'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, User, Star, CreditCard, MessageCircle, Video, Shield } from 'lucide-react'
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
import { format, addDays, setHours, setMinutes } from 'date-fns'

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
  availability: {
    [key: string]: string[]
  }
}

interface Skill {
  id: string
  name: string
  category: string
  icon: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
}

export default function BookPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuthStore()

  const teacherId = searchParams.get('teacher')
  const skillId = searchParams.get('skill')

  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [skill, setSkill] = useState<Skill | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online')
  const [duration, setDuration] = useState(60)
  const [notes, setNotes] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (teacherId && skillId) {
      loadBookingData()
    }
  }, [teacherId, skillId])

  const loadBookingData = async () => {
    // Mock data - in real app this would come from API
    const mockTeacher: Teacher = {
      id: '1',
      name: 'Sarah Chen',
      avatar: '/avatars/sarah.jpg',
      bio: 'Professional chef with 10+ years experience in Italian and Asian cuisine. I specialize in traditional pasta making, authentic pizza techniques, and fusion cooking.',
      rating: 4.9,
      reviewCount: 47,
      hourlyRate: 75,
      verified: true,
      responseTime: 'Usually responds within 2 hours',
      teachingExperience: '5 years teaching experience',
      specialties: ['Italian Cuisine', 'Pasta Making', 'Pizza Techniques', 'Asian Fusion'],
      availability: {
        'Monday': ['09:00', '10:00', '14:00', '15:00', '16:00'],
        'Tuesday': ['09:00', '10:00', '11:00', '14:00', '15:00'],
        'Wednesday': ['10:00', '14:00', '15:00', '16:00'],
        'Thursday': ['09:00', '10:00', '14:00', '15:00', '16:00', '17:00'],
        'Friday': ['09:00', '10:00', '11:00', '14:00'],
        'Saturday': ['10:00', '11:00', '14:00', '15:00'],
        'Sunday': ['14:00', '15:00', '16:00']
      }
    }

    const mockSkill: Skill = {
      id: '1',
      name: 'Italian Cooking Fundamentals',
      category: 'Cooking',
      icon: '🍝',
      description: 'Learn the basics of authentic Italian cooking, from pasta making to classic sauces.',
      difficulty: 'Beginner',
      duration: 120
    }

    setTeacher(mockTeacher)
    setSkill(mockSkill)
    setDuration(mockSkill.duration)
  }

  const getAvailableSlots = (date: Date) => {
    if (!teacher) return []
    const dayName = format(date, 'EEEE')
    return teacher.availability[dayName] || []
  }

  const calculatePrice = () => {
    if (!teacher) return 0
    return Math.round((teacher.hourlyRate * duration) / 60)
  }

  const generateNextWeekDates = () => {
    const dates = []
    for (let i = 1; i <= 7; i++) {
      dates.push(addDays(new Date(), i))
    }
    return dates
  }

  const handleBooking = () => {
    setIsConfirming(true)
  }

  const confirmBooking = async () => {
    // Mock booking confirmation
    setTimeout(() => {
      setIsConfirming(false)
      setShowSuccess(true)
    }, 2000)
  }

  if (!teacher || !skill) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={teacher.avatar} />
          <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            {teacher.verified && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{teacher.rating}</span>
              <span>({teacher.reviewCount} reviews)</span>
            </div>
            <span>•</span>
            <span>{teacher.teachingExperience}</span>
            <span>•</span>
            <span>{teacher.responseTime}</span>
          </div>
          <p className="text-gray-700 mb-4">{teacher.bio}</p>
          <div className="flex items-center gap-2">
            {teacher.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-green-600">${teacher.hourlyRate}</div>
          <div className="text-sm text-gray-600">per hour</div>
        </div>
      </div>

      {/* Skill Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{skill.icon}</span>
            {skill.name}
          </CardTitle>
          <CardDescription>{skill.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 text-sm">
            <Badge variant="outline">{skill.difficulty}</Badge>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{skill.duration} minutes recommended</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{skill.category}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Date & Time</CardTitle>
              <CardDescription>Choose when you'd like to have your session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {generateNextWeekDates().map((date) => {
                  const availableSlots = getAvailableSlots(date)
                  const isSelected = selectedDate?.toDateString() === date.toDateString()

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date)
                        setSelectedTime('')
                      }}
                      disabled={availableSlots.length === 0}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : availableSlots.length > 0
                          ? 'hover:bg-blue-50 border-gray-200'
                          : 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                      <div className="text-lg font-bold">{format(date, 'd')}</div>
                      <div className="text-xs">{format(date, 'MMM')}</div>
                    </button>
                  )
                })}
              </div>

              {selectedDate && (
                <div>
                  <Label className="text-sm font-medium">Available times for {format(selectedDate, 'EEEE, MMMM d')}</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {getAvailableSlots(selectedDate).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded border transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-blue-50 border-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Session Type</Label>
                <RadioGroup value={sessionType} onValueChange={(value: 'online' | 'in-person') => setSessionType(value)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="online" id="online" />
                    <Label htmlFor="online" className="flex items-center gap-2 cursor-pointer">
                      <Video className="h-4 w-4" />
                      Online Session
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in-person" id="in-person" />
                    <Label htmlFor="in-person" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-4 w-4" />
                      In-Person Session
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                    <SelectItem value="180">180 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes" className="text-sm font-medium">Special Requests or Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Let the teacher know about your goals, experience level, or any special requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Teacher:</span>
                  <span className="text-sm font-medium">{teacher.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Skill:</span>
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between">
                    <span className="text-sm">Date:</span>
                    <span className="text-sm font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between">
                    <span className="text-sm">Time:</span>
                    <span className="text-sm font-medium">{selectedTime}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Duration:</span>
                  <span className="text-sm font-medium">{duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Type:</span>
                  <span className="text-sm font-medium">{sessionType === 'online' ? 'Online' : 'In-Person'}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-green-600">${calculatePrice()}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Based on ${teacher.hourlyRate}/hour rate
                </p>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className="w-full"
                size="lg"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Book Session
              </Button>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Teacher First
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirming} onOpenChange={setIsConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              Please review your session details before confirming
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Teacher:</span>
              <span className="font-medium">{teacher.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Skill:</span>
              <span className="font-medium">{skill.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Date & Time:</span>
              <span className="font-medium">
                {selectedDate && format(selectedDate, 'MMM d, yyyy')} at {selectedTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium text-green-600">${calculatePrice()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirming(false)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>
              Confirm & Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>🎉 Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your session has been successfully booked
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="mb-4">You'll receive a confirmation email shortly with session details.</p>
            <p className="text-sm text-gray-600">
              The teacher will be notified and you can message them directly from your dashboard.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => router.push('/dashboard/calendar')} className="w-full">
              View in Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}