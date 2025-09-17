'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import {
  CreditCard,
  DollarSign,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  MapPin
} from 'lucide-react'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  session: {
    id: string
    skillName: string
    teacherName: string
    teacherAvatar: string
    date: Date
    duration: number
    hourlyRate: number
    totalAmount: number
    currency: string
    type: 'online' | 'in-person'
    location: string
  }
  onPaymentSuccess: (paymentId: string) => void
}

interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'stripe' | 'apple-pay' | 'google-pay'
  name: string
  icon: string
  processingFee: number
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    processingFee: 2.9,
    description: 'Visa, Mastercard, American Express'
  },
  {
    id: 'paypal',
    type: 'paypal',
    name: 'PayPal',
    icon: '🟦',
    processingFee: 3.5,
    description: 'Pay with your PayPal account'
  },
  {
    id: 'stripe',
    type: 'stripe',
    name: 'Stripe',
    icon: '💜',
    processingFee: 2.9,
    description: 'Secure payment processing'
  },
  {
    id: 'apple-pay',
    type: 'apple-pay',
    name: 'Apple Pay',
    icon: '🍎',
    processingFee: 2.9,
    description: 'Pay with Touch ID or Face ID'
  },
  {
    id: 'google-pay',
    type: 'google-pay',
    name: 'Google Pay',
    icon: '🔵',
    processingFee: 2.9,
    description: 'Quick and secure payments'
  }
]

export default function PaymentModal({ isOpen, onClose, session, onPaymentSuccess }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(paymentMethods[0])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'processing' | 'success'>('method')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    email: '',
    saveCard: false
  })

  const processingFee = (session.totalAmount * selectedMethod.processingFee) / 100
  const finalAmount = session.totalAmount + processingFee

  const handlePayment = async () => {
    setIsProcessing(true)
    setPaymentStep('processing')

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Simulate successful payment
    const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`
    setPaymentStep('success')
    setIsProcessing(false)

    // Call success callback after showing success for 2 seconds
    setTimeout(() => {
      onPaymentSuccess(paymentId)
      onClose()
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const renderPaymentMethodSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Choose Payment Method</h3>
        <div className="grid gap-3">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-colors ${
                selectedMethod.id === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedMethod(method)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {method.processingFee}% fee
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-semibold">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Session ({session.duration} minutes)</span>
            <span>${session.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Processing fee ({selectedMethod.processingFee}%)</span>
            <span>${processingFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${finalAmount.toFixed(2)} {session.currency}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => setPaymentStep('details')}
        className="w-full"
        size="lg"
      >
        Continue with {selectedMethod.name}
      </Button>
    </div>
  )

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Payment Details</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setPaymentStep('method')}
        >
          Change Method
        </Button>
      </div>

      {selectedMethod.type === 'card' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                number: formatCardNumber(e.target.value)
              })}
              maxLength={19}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  expiry: formatExpiry(e.target.value)
                })}
                maxLength={5}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({
                  ...cardDetails,
                  cvv: e.target.value.replace(/\D/g, '')
                })}
                maxLength={4}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                name: e.target.value
              })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={cardDetails.email}
              onChange={(e) => setCardDetails({
                ...cardDetails,
                email: e.target.value
              })}
            />
          </div>
        </div>
      )}

      {selectedMethod.type === 'paypal' && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🟦</div>
          <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment</p>
        </div>
      )}

      {(selectedMethod.type === 'apple-pay' || selectedMethod.type === 'google-pay') && (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">{selectedMethod.icon}</div>
          <p className="text-gray-600 mb-4">Use your biometric authentication to complete payment</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          Secure Payment
        </h4>
        <p className="text-sm text-gray-600">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      <Button
        onClick={handlePayment}
        className="w-full"
        size="lg"
        disabled={selectedMethod.type === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name)}
      >
        Pay ${finalAmount.toFixed(2)} {session.currency}
      </Button>
    </div>
  )

  const renderProcessing = () => (
    <div className="text-center py-12">
      <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-blue-600" />
      <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
      <p className="text-gray-600">
        Please wait while we process your payment. Do not close this window.
      </p>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center py-12">
      <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-600" />
      <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-4">
        Your session has been booked. You will receive a confirmation email shortly.
      </p>
      <Badge variant="outline" className="bg-green-50 text-green-700">
        Payment ID: pay_{Math.random().toString(36).substr(2, 9)}
      </Badge>
    </div>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {paymentStep === 'success' ? 'Payment Complete' : 'Book Session'}
          </DialogTitle>
          <DialogDescription>
            {paymentStep === 'success'
              ? 'Your booking has been confirmed'
              : 'Complete your payment to book this session'
            }
          </DialogDescription>
        </DialogHeader>

        {paymentStep !== 'success' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📚</div>
                <div className="flex-1">
                  <h3 className="font-semibold">{session.skillName}</h3>
                  <p className="text-sm text-gray-600 mb-2">with {session.teacherName}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span>{session.date.toLocaleDateString()} at {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      <span>{session.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3" />
                      <span>${session.hourlyRate}/hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {paymentStep === 'method' && renderPaymentMethodSelection()}
        {paymentStep === 'details' && renderPaymentDetails()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'success' && renderSuccess()}
      </DialogContent>
    </Dialog>
  )
}