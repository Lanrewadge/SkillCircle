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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
  Calendar,
  Wallet,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Receipt,
  PieChart,
  BarChart3,
  Percent,
  Building,
  Shield,
  Smartphone
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, subMonths, addMonths, isWithinInterval, parseISO } from 'date-fns'

interface PaymentMethod {
  id: string
  type: 'card' | 'bank' | 'paypal' | 'apple-pay' | 'google-pay'
  brand?: string
  last4: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  nickname?: string
  addedDate: string
}

interface Transaction {
  id: string
  type: 'payment' | 'payout' | 'refund' | 'fee'
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  amount: number
  currency: string
  description: string
  date: string
  paymentMethodId?: string
  skillName?: string
  teacherName?: string
  studentName?: string
  sessionId?: string
  receiptUrl?: string
  refundable: boolean
}

interface EarningsData {
  totalEarnings: number
  thisMonth: number
  lastMonth: number
  pendingPayouts: number
  availableBalance: number
  monthlyEarnings: {
    month: string
    amount: number
  }[]
  skillBreakdown: {
    skillName: string
    amount: number
    sessions: number
    percentage: number
  }[]
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true,
    nickname: 'Primary Card',
    addedDate: '2024-01-15'
  },
  {
    id: '2',
    type: 'paypal',
    last4: 'john@example.com',
    isDefault: false,
    addedDate: '2024-02-20'
  },
  {
    id: '3',
    type: 'bank',
    last4: '1234',
    isDefault: false,
    nickname: 'Savings Account',
    addedDate: '2024-03-10'
  }
]

const mockTransactions: Transaction[] = [
  {
    id: 'txn_001',
    type: 'payment',
    status: 'completed',
    amount: -85.00,
    currency: 'USD',
    description: 'React Development Session',
    date: '2025-09-15T10:30:00Z',
    paymentMethodId: '1',
    skillName: 'React Development',
    teacherName: 'Sarah Chen',
    sessionId: 'sess_001',
    receiptUrl: '/receipts/txn_001.pdf',
    refundable: true
  },
  {
    id: 'txn_002',
    type: 'payout',
    status: 'completed',
    amount: 340.00,
    currency: 'USD',
    description: 'Weekly earnings payout',
    date: '2025-09-13T09:00:00Z',
    refundable: false
  },
  {
    id: 'txn_003',
    type: 'payment',
    status: 'completed',
    amount: -70.00,
    currency: 'USD',
    description: 'Python Programming Session',
    date: '2025-09-12T14:00:00Z',
    paymentMethodId: '1',
    skillName: 'Python Programming',
    teacherName: 'James Wilson',
    sessionId: 'sess_002',
    receiptUrl: '/receipts/txn_003.pdf',
    refundable: true
  },
  {
    id: 'txn_004',
    type: 'refund',
    status: 'completed',
    amount: 60.00,
    currency: 'USD',
    description: 'Refund for cancelled Spanish session',
    date: '2025-09-10T16:30:00Z',
    skillName: 'Spanish Language',
    teacherName: 'Maria Gonzalez',
    refundable: false
  },
  {
    id: 'txn_005',
    type: 'fee',
    status: 'completed',
    amount: -2.50,
    currency: 'USD',
    description: 'Platform service fee',
    date: '2025-09-10T16:30:00Z',
    refundable: false
  }
]

const mockEarnings: EarningsData = {
  totalEarnings: 2850.00,
  thisMonth: 680.00,
  lastMonth: 420.00,
  pendingPayouts: 125.00,
  availableBalance: 340.00,
  monthlyEarnings: [
    { month: '2025-04', amount: 245.00 },
    { month: '2025-05', amount: 380.00 },
    { month: '2025-06', amount: 520.00 },
    { month: '2025-07', amount: 650.00 },
    { month: '2025-08', amount: 420.00 },
    { month: '2025-09', amount: 680.00 }
  ],
  skillBreakdown: [
    { skillName: 'React Development', amount: 1200.00, sessions: 18, percentage: 42 },
    { skillName: 'Python Programming', amount: 850.00, sessions: 14, percentage: 30 },
    { skillName: 'JavaScript Fundamentals', amount: 520.00, sessions: 12, percentage: 18 },
    { skillName: 'Node.js Development', amount: 280.00, sessions: 6, percentage: 10 }
  ]
}

export default function PaymentsPage() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [earnings] = useState<EarningsData>(mockEarnings)
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth')
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === 'all') return true
    return transaction.type === transactionFilter
  })

  const getTransactionIcon = (type: string, status: string) => {
    switch (type) {
      case 'payment':
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      case 'payout':
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'refund':
        return <ArrowUpRight className="h-4 w-4 text-blue-500" />
      case 'fee':
        return <ArrowDownRight className="h-4 w-4 text-orange-500" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />
    }
  }

  const getPaymentMethodIcon = (type: string, brand?: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="h-5 w-5" />
      case 'paypal':
        return <Wallet className="h-5 w-5" />
      case 'bank':
        return <Building className="h-5 w-5" />
      case 'apple-pay':
        return <Smartphone className="h-5 w-5" />
      case 'google-pay':
        return <Smartphone className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(Math.abs(amount))
  }

  const getEarningsGrowth = () => {
    if (earnings.lastMonth === 0) return 100
    return ((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Payments & Earnings</h1>
        <p className="text-gray-600">
          Manage your payment methods, view transactions, and track earnings
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available Balance</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(earnings.availableBalance)}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-2">
                  <Button size="sm" className="w-full">
                    <Download className="h-3 w-3 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month Earnings</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(earnings.thisMonth)}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <span className={`flex items-center ${getEarningsGrowth() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {getEarningsGrowth() >= 0 ? '+' : ''}{getEarningsGrowth().toFixed(1)}%
                  </span>
                  <span className="text-gray-600 ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payouts</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(earnings.pendingPayouts)}
                    </p>
                  </div>
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Next payout in 3 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(earnings.totalEarnings)}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Lifetime earnings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Earnings Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.monthlyEarnings.slice(-6).map((data, index) => {
                    const maxAmount = Math.max(...earnings.monthlyEarnings.map(e => e.amount))
                    const percentage = (data.amount / maxAmount) * 100

                    return (
                      <div key={data.month} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{format(parseISO(data.month + '-01'), 'MMM yyyy')}</span>
                          <span className="font-medium">{formatCurrency(data.amount)}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Skills Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Earnings by Skill
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnings.skillBreakdown.map((skill) => (
                    <div key={skill.skillName} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{skill.skillName}</span>
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(skill.amount)}</div>
                          <div className="text-xs text-gray-600">{skill.sessions} sessions</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={skill.percentage} className="h-2 flex-1" />
                        <span className="text-xs text-gray-600 w-10">{skill.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('transactions')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type, transaction.status)}
                      <div>
                        <h4 className="font-medium text-sm">{transaction.description}</h4>
                        <p className="text-xs text-gray-600">
                          {format(parseISO(transaction.date), 'MMM d, yyyy • h:mm a')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </div>
                      <Badge
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Transaction Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <Label>Filter by type:</Label>
                </div>
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                    <SelectItem value="payout">Payouts</SelectItem>
                    <SelectItem value="refund">Refunds</SelectItem>
                    <SelectItem value="fee">Fees</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredTransactions.map((transaction, index) => (
                  <div key={transaction.id} className={`p-4 ${index !== filteredTransactions.length - 1 ? 'border-b' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(transaction.type, transaction.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{transaction.description}</h4>
                            <Badge
                              variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{format(parseISO(transaction.date), 'MMM d, yyyy • h:mm a')}</span>
                            {transaction.skillName && (
                              <span>• {transaction.skillName}</span>
                            )}
                            {transaction.teacherName && (
                              <span>• with {transaction.teacherName}</span>
                            )}
                            {transaction.studentName && (
                              <span>• from {transaction.studentName}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className={`font-medium text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                            {transaction.amount >= 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-gray-600">{transaction.currency}</div>
                        </div>
                        <div className="flex gap-1">
                          {transaction.receiptUrl && (
                            <Button variant="ghost" size="sm">
                              <Receipt className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          {/* Earnings Summary */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Earnings Analytics</CardTitle>
                <CardDescription>Track your teaching income over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(earnings.thisMonth)}
                      </div>
                      <div className="text-sm text-gray-600">This Month</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(earnings.thisMonth / 30 * 7)}
                      </div>
                      <div className="text-sm text-gray-600">This Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {formatCurrency(earnings.thisMonth / 30)}
                      </div>
                      <div className="text-sm text-gray-600">Daily Average</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-4">Monthly Earnings Trend</h4>
                    <div className="space-y-3">
                      {earnings.monthlyEarnings.slice(-6).map((data) => {
                        const maxAmount = Math.max(...earnings.monthlyEarnings.map(e => e.amount))
                        const percentage = (data.amount / maxAmount) * 100

                        return (
                          <div key={data.month} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{format(parseISO(data.month + '-01'), 'MMMM yyyy')}</span>
                              <span className="font-medium">{formatCurrency(data.amount)}</span>
                            </div>
                            <Progress value={percentage} className="h-3" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payout Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="font-medium">Next Payout</div>
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {formatCurrency(earnings.pendingPayouts)}
                  </div>
                  <div className="text-sm text-gray-600">September 20, 2025</div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Payout frequency:</span>
                    <span className="font-medium">Weekly</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next payout day:</span>
                    <span className="font-medium">Friday</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing time:</span>
                    <span className="font-medium">1-2 business days</span>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  Update Payout Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Skills Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Performance</CardTitle>
              <CardDescription>See which skills are generating the most income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {earnings.skillBreakdown.map((skill) => (
                  <div key={skill.skillName} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{skill.skillName}</h4>
                        <p className="text-sm text-gray-600">{skill.sessions} sessions completed</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(skill.amount)}</div>
                        <div className="text-sm text-gray-600">{skill.percentage}% of total</div>
                      </div>
                    </div>
                    <Progress value={skill.percentage} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment and payout methods</CardDescription>
                </div>
                <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Method
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Payment Method</DialogTitle>
                      <DialogDescription>
                        Add a new payment method for bookings and payouts
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <CreditCard className="h-6 w-6" />
                          <span>Credit Card</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <Building className="h-6 w-6" />
                          <span>Bank Account</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <Wallet className="h-6 w-6" />
                          <span>PayPal</span>
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2">
                          <Smartphone className="h-6 w-6" />
                          <span>Digital Wallet</span>
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className={`${method.isDefault ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getPaymentMethodIcon(method.type, method.brand)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {method.type === 'card' && method.brand && `${method.brand} ****${method.last4}`}
                                {method.type === 'paypal' && `PayPal (${method.last4})`}
                                {method.type === 'bank' && `Bank ****${method.last4}`}
                              </h4>
                              {method.isDefault && (
                                <Badge variant="default" className="text-xs">Default</Badge>
                              )}
                            </div>
                            {method.nickname && (
                              <p className="text-sm text-gray-600">{method.nickname}</p>
                            )}
                            {method.expiryMonth && method.expiryYear && (
                              <p className="text-sm text-gray-600">
                                Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Added {format(parseISO(method.addedDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button variant="outline" size="sm">
                              Set Default
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security & Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Two-factor authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email notifications</h4>
                  <p className="text-sm text-gray-600">Get notified about payments and earnings</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tax documents</h4>
                  <p className="text-sm text-gray-600">Download your tax forms and reports</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}