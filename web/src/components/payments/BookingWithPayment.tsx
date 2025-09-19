'use client'

import React, { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PaymentForm } from './PaymentForm'
import { Calendar, Clock, User, MapPin, DollarSign, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_test_key_here'
)

interface Skill {
  id: string
  name: string
  description: string
  price: number
  duration: number
  teacher: {
    id: string
    name: string
    avatar: string
    rating: number
    reviews: number
  }
  location: string
  category: string
}

interface BookingWithPaymentProps {
  skill: Skill
  onBookingComplete: (booking: any) => void
  onCancel: () => void
}

export const BookingWithPayment: React.FC<BookingWithPaymentProps> = ({
  skill,
  onBookingComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'booking' | 'payment'>('booking')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [bookingData, setBookingData] = useState<any>(null)

  // Mock available time slots
  const availableSlots = [
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
  ]

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }

    const sessionDateTime = `${selectedDate}T${selectedTime}:00`
    const booking = {
      skillId: skill.id,
      teacherId: skill.teacher.id,
      skillName: skill.name,
      teacherName: skill.teacher.name,
      amount: skill.price,
      sessionDuration: skill.duration,
      sessionDate: sessionDateTime,
      notes,
      location: skill.location
    }

    setBookingData(booking)
    setStep('payment')
  }

  const handlePaymentSuccess = (paymentResult: any) => {
    const completedBooking = {
      ...bookingData,
      ...paymentResult,
      status: 'confirmed',
      bookedAt: new Date().toISOString()
    }

    toast.success('Booking confirmed! You will receive a confirmation email shortly.')
    onBookingComplete(completedBooking)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (step === 'payment' && bookingData) {
    return (
      <div className="max-w-2xl mx-auto">
        <Elements stripe={stripePromise}>
          <PaymentForm
            skillId={bookingData.skillId}
            teacherId={bookingData.teacherId}
            skillName={bookingData.skillName}
            teacherName={bookingData.teacherName}
            amount={bookingData.amount}
            sessionDuration={bookingData.sessionDuration}
            sessionDate={bookingData.sessionDate}
            onSuccess={handlePaymentSuccess}
            onCancel={() => setStep('booking')}
          />
        </Elements>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Skill Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Book Session</span>
            <Badge variant="secondary">{skill.category}</Badge>
          </CardTitle>
          <CardDescription>
            Complete your booking details and proceed to payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-4">
            <img
              src={skill.teacher.avatar || '/placeholder-avatar.png'}
              alt={skill.teacher.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{skill.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{skill.teacher.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{skill.teacher.rating}</span>
                  <span>({skill.teacher.reviews} reviews)</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{skill.duration} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(skill.price)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{skill.location}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Form */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule Your Session</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Select Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Select Time</Label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Choose a time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded-md h-24"
                placeholder="Any specific topics you'd like to focus on, or other details..."
              />
            </div>

            {/* Booking Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <h4 className="font-medium mb-3">Booking Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Session duration:</span>
                <span>{skill.duration} minutes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Rate:</span>
                <span>{formatCurrency(skill.price)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Platform fee:</span>
                <span>{formatCurrency(skill.price * 0.1)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(skill.price + (skill.price * 0.1))}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Proceed to Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}