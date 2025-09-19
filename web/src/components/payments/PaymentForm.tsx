'use client'

import React, { useState } from 'react'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PaymentFormProps {
  skillId: string
  teacherId: string
  skillName: string
  teacherName: string
  amount: number
  sessionDuration: number
  sessionDate: string
  onSuccess: (paymentResult: any) => void
  onCancel: () => void
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  skillId,
  teacherId,
  skillName,
  teacherName,
  amount,
  sessionDuration,
  sessionDate,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create payment intent on the backend
      const response = await fetch('/api/v1/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          skillId,
          teacherId,
          sessionDuration
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('Card element not found')
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'SkillCircle User',
          },
        },
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        return
      }

      if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend and create booking
        const confirmResponse = await fetch('/api/v1/payments/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId,
            skillId,
            teacherId,
            sessionDate,
            sessionDuration
          }),
        })

        if (!confirmResponse.ok) {
          throw new Error('Failed to confirm booking')
        }

        const result = await confirmResponse.json()
        toast.success('Payment successful! Booking confirmed.')
        onSuccess(result)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Complete Payment</span>
        </CardTitle>
        <CardDescription>
          Secure payment for your skill session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Skill:</span>
            <span className="text-sm">{skillName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Teacher:</span>
            <span className="text-sm">{teacherName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Duration:</span>
            <span className="text-sm">{sessionDuration} minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Date:</span>
            <span className="text-sm">{new Date(sessionDate).toLocaleDateString()}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 border rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-center text-xs text-gray-500 space-x-1">
            <Lock className="w-3 h-3" />
            <span>Secured by Stripe</span>
          </div>

          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}