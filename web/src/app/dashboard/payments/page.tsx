'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  CreditCard,
  DollarSign,
  Download,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Filter,
  Calendar
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'paypal'
  last4: string
  brand: string
  expiryMonth: number
  expiryYear: number
  isDefault: boolean
}

interface Transaction {
  id: string
  type: 'payment' | 'payout' | 'refund' | 'fee'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  description: string
  sessionId?: string
  teacherId?: string
  teacherName?: string
  learnerId?: string
  learnerName?: string
  date: Date
  fee?: number
  netAmount?: number
}

interface PayoutAccount {
  id: string
  type: 'bank' | 'paypal'
  accountName: string
  accountNumber: string
  routingNumber?: string
  email?: string
  isVerified: boolean
  isDefault: boolean
}

export default function PaymentsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false)
  const [isAddPayoutOpen, setIsAddPayoutOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')

  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    name: '',
    isDefault: false
  })

  const [newPayoutAccount, setNewPayoutAccount] = useState({
    type: 'bank' as const,
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    email: '',
    isDefault: false
  })

  useEffect(() => {
    loadPaymentData()
  }, [])

  const loadPaymentData = () => {
    // Mock payment methods
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        type: 'card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
      },
      {
        id: '2',
        type: 'card',
        last4: '0005',
        brand: 'Mastercard',
        expiryMonth: 8,
        expiryYear: 2025,
        isDefault: false
      }
    ]

    // Mock payout accounts
    const mockPayoutAccounts: PayoutAccount[] = [
      {
        id: '1',
        type: 'bank',
        accountName: 'John Doe',
        accountNumber: '****1234',
        routingNumber: '021000021',
        isVerified: true,
        isDefault: true
      },
      {
        id: '2',
        type: 'paypal',
        accountName: 'PayPal Account',
        accountNumber: 'john@example.com',
        email: 'john@example.com',
        isVerified: true,
        isDefault: false
      }
    ]

    // Mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        type: 'payment',
        amount: 85,
        currency: 'USD',
        status: 'completed',
        description: 'React Development session',
        sessionId: 'sess_1',
        teacherId: '2',
        teacherName: 'Alex Rodriguez',
        date: new Date('2025-09-15T14:00:00'),
        fee: 4.25,
        netAmount: 80.75
      },
      {
        id: '2',
        type: 'payout',
        amount: 450.50,
        currency: 'USD',
        status: 'completed',
        description: 'Weekly payout',
        date: new Date('2025-09-10T09:00:00'),
        fee: 22.53,
        netAmount: 427.97
      },
      {
        id: '3',
        type: 'payment',
        amount: 75,
        currency: 'USD',
        status: 'pending',
        description: 'Italian Cooking session',
        sessionId: 'sess_2',
        teacherId: '1',
        teacherName: 'Sarah Chen',
        date: new Date('2025-09-18T16:00:00'),
        fee: 3.75,
        netAmount: 71.25
      },
      {
        id: '4',
        type: 'refund',
        amount: -60,
        currency: 'USD',
        status: 'completed',
        description: 'Guitar lesson refund',
        sessionId: 'sess_3',
        date: new Date('2025-09-12T10:00:00')
      }
    ]

    setPaymentMethods(mockPaymentMethods)
    setPayoutAccounts(mockPayoutAccounts)
    setTransactions(mockTransactions)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'failed':
      case 'cancelled':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-green-600'
      case 'payout':
        return 'text-blue-600'
      case 'refund':
        return 'text-red-600'
      case 'fee':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const calculateTotalEarnings = () => {
    return transactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + (t.netAmount || t.amount), 0)
  }

  const calculatePendingPayments = () => {
    return transactions
      .filter(t => t.type === 'payment' && t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)
  }

  const formatCardNumber = (number: string) => {
    return number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payments & Billing</h1>
        <p className="text-muted-foreground mt-2">
          Manage your payment methods, view transactions, and track earnings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">${calculateTotalEarnings().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${calculatePendingPayments().toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">$1,247.50</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="payouts">Payout Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest payment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(transaction.date, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Manage how you pay for sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium">{method.brand} •••• {method.last4}</p>
                          <p className="text-xs text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Manage Payment Methods
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Download className="h-5 w-5 mb-2" />
                  Download Statement
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Plus className="h-5 w-5 mb-2" />
                  Add Payment Method
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <CreditCard className="h-5 w-5 mb-2" />
                  Request Payout
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Filter className="h-5 w-5 mb-2" />
                  Filter Transactions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Payment Methods</h2>
            <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>
                    Add a new credit or debit card for payments
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formatCardNumber(newPaymentMethod.cardNumber)}
                      onChange={(e) => setNewPaymentMethod({
                        ...newPaymentMethod,
                        cardNumber: e.target.value.replace(/\s/g, '')
                      })}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM"
                        value={newPaymentMethod.expiryMonth}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryMonth: e.target.value})}
                        maxLength={2}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Input
                        id="expiryYear"
                        placeholder="YYYY"
                        value={newPaymentMethod.expiryYear}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, expiryYear: e.target.value})}
                        maxLength={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={newPaymentMethod.cvc}
                        onChange={(e) => setNewPaymentMethod({...newPaymentMethod, cvc: e.target.value})}
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={newPaymentMethod.name}
                      onChange={(e) => setNewPaymentMethod({...newPaymentMethod, name: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPaymentOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddPaymentOpen(false)}>
                    Add Card
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{method.brand} •••• {method.last4}</p>
                        <p className="text-sm text-muted-foreground">
                          Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {method.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payout Accounts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Payout Accounts</h2>
            <Dialog open={isAddPayoutOpen} onOpenChange={setIsAddPayoutOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payout Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payout Account</DialogTitle>
                  <DialogDescription>
                    Add a bank account or PayPal for receiving payments
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <Label>Account Type</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="button"
                        variant={newPayoutAccount.type === 'bank' ? 'default' : 'outline'}
                        onClick={() => setNewPayoutAccount({...newPayoutAccount, type: 'bank'})}
                      >
                        Bank Account
                      </Button>
                      <Button
                        type="button"
                        variant={newPayoutAccount.type === 'paypal' ? 'default' : 'outline'}
                        onClick={() => setNewPayoutAccount({...newPayoutAccount, type: 'paypal'})}
                      >
                        PayPal
                      </Button>
                    </div>
                  </div>

                  {newPayoutAccount.type === 'bank' ? (
                    <>
                      <div>
                        <Label htmlFor="accountName">Account Holder Name</Label>
                        <Input
                          id="accountName"
                          value={newPayoutAccount.accountName}
                          onChange={(e) => setNewPayoutAccount({...newPayoutAccount, accountName: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="routingNumber">Routing Number</Label>
                        <Input
                          id="routingNumber"
                          value={newPayoutAccount.routingNumber}
                          onChange={(e) => setNewPayoutAccount({...newPayoutAccount, routingNumber: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          value={newPayoutAccount.accountNumber}
                          onChange={(e) => setNewPayoutAccount({...newPayoutAccount, accountNumber: e.target.value})}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="paypalEmail">PayPal Email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={newPayoutAccount.email}
                        onChange={(e) => setNewPayoutAccount({...newPayoutAccount, email: e.target.value})}
                      />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddPayoutOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddPayoutOpen(false)}>
                    Add Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {payoutAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{account.accountName}</p>
                        <p className="text-sm text-muted-foreground">
                          {account.type === 'bank' ? `•••• ${account.accountNumber}` : account.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {account.isVerified && (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      )}
                      {account.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{format(transaction.date, 'MMM d, yyyy HH:mm')}</span>
                          {transaction.teacherName && (
                            <>
                              <span>•</span>
                              <span>with {transaction.teacherName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                      {transaction.fee && (
                        <div className="text-xs text-muted-foreground">
                          Fee: ${transaction.fee.toFixed(2)}
                        </div>
                      )}
                      <Badge variant="outline" className="text-xs mt-1">
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}