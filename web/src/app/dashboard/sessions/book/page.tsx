'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { sessionsApi, teachersApi, skillsApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

interface Teacher {
  id: string
  name: string
  avatar?: string
  bio?: string
  rating: number
  reviewCount: number
  verified: boolean
  city: string
}

interface Skill {
  id: string
  name: string
  description: string
  icon?: string
}

interface BookingForm {
  teacherId: string
  skillId: string
  date: string
  time: string
  duration: number
  meetingType: 'in-person' | 'online'
  location?: string
  message?: string
}

export default function BookSessionPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(false)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    teacherId: '',
    skillId: '',
    date: '',
    time: '',
    duration: 60,
    meetingType: 'online',
    location: '',
    message: ''
  })

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [teachersData, skillsData] = await Promise.all([
        teachersApi.search(''),
        skillsApi.getAll()
      ])
      setTeachers(teachersData)
      setSkills(skillsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTeacherSelect = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    setBookingForm({ ...bookingForm, teacherId: teacher.id })
    setStep(2)
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill)
    setBookingForm({ ...bookingForm, skillId: skill.id })
    setStep(3)
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      const sessionData = {
        ...bookingForm,
        learnerId: user?.id,
        scheduledAt: new Date(`${bookingForm.date}T${bookingForm.time}`),
        price: calculatePrice()
      }

      await sessionsApi.create(sessionData)
      setStep(4) // Success step
    } catch (error) {
      console.error('Booking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculatePrice = () => {
    // Mock pricing logic - this would come from teacher's rates
    const baseRate = 75 // per hour
    const duration = bookingForm.duration / 60
    return Math.round(baseRate * duration)
  }

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Book a Learning Session</h1>
        <p className="text-muted-foreground mt-2">
          Choose a teacher, select a skill, and schedule your session
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > stepNumber ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                stepNumber
              )}
            </div>
            {stepNumber < 4 && (
              <div
                className={`w-20 h-1 mx-2 ${
                  step > stepNumber ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Teacher */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Choose Your Teacher</CardTitle>
            <CardDescription>
              Browse our verified teachers and find the perfect match for your learning goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{teacher.name}</h3>
                          {teacher.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span>{teacher.rating} ({teacher.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{teacher.city}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {teacher.bio}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Select Skill */}
      {step === 2 && selectedTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Choose What to Learn</CardTitle>
            <CardDescription>
              Select the skill you want to learn from {selectedTeacher.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <Card
                  key={skill.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSkillSelect(skill)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{skill.icon || '🎯'}</div>
                    <h3 className="font-semibold mb-2">{skill.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {skill.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" onClick={() => setStep(1)} className="mt-4">
              Back to Teachers
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Schedule Details */}
      {step === 3 && selectedTeacher && selectedSkill && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Schedule Your Session</CardTitle>
            <CardDescription>
              Choose a date, time, and session details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Session Summary */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Session Summary</h4>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{selectedTeacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedSkill.icon || '🎯'}</span>
                  <span>{selectedSkill.name}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingForm.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={bookingForm.time}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select
                    value={bookingForm.duration.toString()}
                    onValueChange={(value) => setBookingForm({ ...bookingForm, duration: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="meeting-type">Meeting Type</Label>
                  <Select
                    value={bookingForm.meetingType}
                    onValueChange={(value: 'in-person' | 'online') =>
                      setBookingForm({ ...bookingForm, meetingType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online Session</SelectItem>
                      <SelectItem value="in-person">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {bookingForm.meetingType === 'in-person' && (
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter meeting location"
                      value={bookingForm.location}
                      onChange={(e) => setBookingForm({ ...bookingForm, location: e.target.value })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Any specific goals or questions for this session?"
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({ ...bookingForm, message: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-semibold">Total Cost</span>
                </div>
                <span className="text-2xl font-bold">${calculatePrice()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {bookingForm.duration} minutes session
              </p>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Skills
              </Button>
              <Button
                onClick={handleBooking}
                disabled={!bookingForm.date || !bookingForm.time || loading}
                className="flex-1"
              >
                {loading ? 'Booking...' : 'Book Session'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Session Booked Successfully! 🎉</h2>
            <p className="text-muted-foreground mb-6">
              Your learning session has been scheduled. You'll receive a confirmation email shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push('/dashboard/sessions')}>
                View My Sessions
              </Button>
              <Button variant="outline" onClick={() => {
                setStep(1)
                setSelectedTeacher(null)
                setSelectedSkill(null)
                setBookingForm({
                  teacherId: '',
                  skillId: '',
                  date: '',
                  time: '',
                  duration: 60,
                  meetingType: 'online',
                  location: '',
                  message: ''
                })
              }}>
                Book Another Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}