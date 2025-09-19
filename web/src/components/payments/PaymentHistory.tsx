'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Download, Calendar, DollarSign, User, BookOpen } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Payment {
  id: string
  skillName: string
  teacherName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed' | 'refunded'
  sessionDuration?: number
  paymentMethod?: string
}

interface PaymentHistoryProps {
  userId?: string
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ userId }) => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPaymentHistory()
  }, [userId])

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/v1/payments/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch payment history')
      }

      const data = await response.json()
      setPayments(data.payments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load payment history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'pending':
        return '⏳'
      case 'failed':
        return '✗'
      case 'refunded':
        return '↩'
      default:
        return '?'
    }
  }

  const downloadReceipt = (payment: Payment) => {
    // In a real app, this would generate and download a PDF receipt
    toast.success(`Receipt for ${payment.skillName} will be downloaded`)
  }

  const totalSpent = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Payment Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{payments.length}</div>
              <div className="text-sm text-gray-500">Total Payments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${totalSpent.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {payments.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {payments.filter(p => p.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            {payments.length === 0
              ? 'No payments found'
              : `${payments.length} payment${payments.length === 1 ? '' : 's'} found`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No payments yet</p>
              <p className="text-sm">Book your first skill session to see payments here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{payment.skillName}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{payment.teacherName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(payment.date).toLocaleDateString()}</span>
                      </div>
                      {payment.sessionDuration && (
                        <span>{payment.sessionDuration} min</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                      <Badge className={getStatusColor(payment.status)}>
                        {getStatusIcon(payment.status)} {payment.status}
                      </Badge>
                    </div>

                    {payment.status === 'completed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReceipt(payment)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}