'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  Star,
  Users,
  DollarSign,
  BookOpen,
  Target,
  Award,
  Activity,
  Download,
  Filter
} from 'lucide-react'

const performanceData = [
  {
    skill: 'JavaScript',
    sessionsCompleted: 24,
    averageRating: 4.8,
    totalEarnings: 1200,
    hoursSpent: 36,
    improvementRate: 15,
    progressPercentage: 85
  },
  {
    skill: 'Python',
    sessionsCompleted: 18,
    averageRating: 4.6,
    totalEarnings: 900,
    hoursSpent: 27,
    improvementRate: 12,
    progressPercentage: 72
  },
  {
    skill: 'React',
    sessionsCompleted: 15,
    averageRating: 4.9,
    totalEarnings: 750,
    hoursSpent: 22.5,
    improvementRate: 18,
    progressPercentage: 68
  },
  {
    skill: 'Node.js',
    sessionsCompleted: 12,
    averageRating: 4.7,
    totalEarnings: 600,
    hoursSpent: 18,
    improvementRate: 10,
    progressPercentage: 55
  }
]

const monthlyData = [
  { month: 'Jan', sessions: 8, earnings: 400, hours: 12 },
  { month: 'Feb', sessions: 12, earnings: 600, hours: 18 },
  { month: 'Mar', sessions: 15, earnings: 750, hours: 22.5 },
  { month: 'Apr', sessions: 18, earnings: 900, hours: 27 },
  { month: 'May', sessions: 22, earnings: 1100, hours: 33 },
  { month: 'Jun', sessions: 25, earnings: 1250, hours: 37.5 }
]

const goals = [
  {
    id: '1',
    title: 'Complete 30 Sessions This Month',
    current: 25,
    target: 30,
    category: 'Learning',
    status: 'on-track',
    deadline: '2025-09-30'
  },
  {
    id: '2',
    title: 'Earn $1500 in Revenue',
    current: 1250,
    target: 1500,
    category: 'Financial',
    status: 'on-track',
    deadline: '2025-09-30'
  },
  {
    id: '3',
    title: 'Maintain 4.8+ Rating',
    current: 4.8,
    target: 4.8,
    category: 'Quality',
    status: 'achieved',
    deadline: '2025-09-30'
  },
  {
    id: '4',
    title: 'Learn 2 New Skills',
    current: 1,
    target: 2,
    category: 'Growth',
    status: 'behind',
    deadline: '2025-12-31'
  }
]

const learningInsights = [
  {
    metric: 'Learning Velocity',
    value: '2.3x',
    change: '+23%',
    description: 'Faster than average learner',
    trend: 'up'
  },
  {
    metric: 'Retention Rate',
    value: '94%',
    change: '+5%',
    description: 'Knowledge retention after sessions',
    trend: 'up'
  },
  {
    metric: 'Practice Consistency',
    value: '87%',
    change: '-2%',
    description: 'Regular practice sessions',
    trend: 'down'
  },
  {
    metric: 'Skill Mastery',
    value: '76%',
    change: '+12%',
    description: 'Overall skill proficiency',
    trend: 'up'
  }
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m')
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved':
        return 'bg-green-100 text-green-800'
      case 'on-track':
        return 'bg-blue-100 text-blue-800'
      case 'behind':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Insights</h1>
          <p className="text-gray-600">Track your learning progress and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="learning">Learning Progress</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                    <p className="text-2xl font-bold">69</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% from last month
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hours Learned</p>
                    <p className="text-2xl font-bold">103.5</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% from last month
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +0.2 from last month
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skills Mastered</p>
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-xs text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +1 this quarter
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Learning Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{insight.metric}</h4>
                        {getTrendIcon(insight.trend)}
                        <span className={`text-sm ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {insight.change}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                    <div className="text-2xl font-bold text-right">
                      {insight.value}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.slice(-3).map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{month.month} 2025</h4>
                          <p className="text-sm text-gray-600">{month.sessions} sessions</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${month.earnings}</p>
                        <p className="text-sm text-gray-600">{month.hours}h</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {performanceData.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <span className="text-sm text-gray-600">{skill.progressPercentage}%</span>
                      </div>
                      <Progress value={skill.progressPercentage} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <span>{skill.sessionsCompleted} sessions</span>
                        <span>{skill.hoursSpent}h spent</span>
                        <span>{skill.averageRating}★ rating</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Learning Streaks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">7</div>
                    <p className="text-sm text-gray-600">Day streak</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Longest streak</span>
                      <span className="font-medium">21 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This month</span>
                      <span className="font-medium">15 days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average</span>
                      <span className="font-medium">4.2 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceData.map((skill, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <Badge variant={skill.averageRating >= 4.8 ? 'default' : 'secondary'}>
                        {skill.averageRating}★
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Sessions: </span>
                        <span className="font-medium">{skill.sessionsCompleted}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Earnings: </span>
                        <span className="font-medium">${skill.totalEarnings}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hours: </span>
                        <span className="font-medium">{skill.hoursSpent}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-600">Growth: </span>
                        <span className="font-medium text-green-600">+{skill.improvementRate}%</span>
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-8 w-8 text-green-600" />
                  <div>
                    <h4 className="font-medium">JavaScript Expert</h4>
                    <p className="text-sm text-gray-600">Completed advanced JS course</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Star className="h-8 w-8 text-blue-600" />
                  <div>
                    <h4 className="font-medium">5-Star Rating</h4>
                    <p className="text-sm text-gray-600">Maintained excellent ratings</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Goal Achiever</h4>
                    <p className="text-sm text-gray-600">Completed monthly learning target</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Current Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Progress</span>
                          <span>{typeof goal.current === 'number' && goal.current > 10 ? goal.current.toFixed(0) : goal.current}/{goal.target}</span>
                        </div>
                        <Progress
                          value={(goal.current / goal.target) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{goal.category}</span>
                          <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Goal Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">75%</div>
                    <p className="text-gray-600">Goals on track</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Completed this month</span>
                      <span className="font-medium">2 goals</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Average completion time</span>
                      <span className="font-medium">23 days</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm">Success rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Set New Goal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}