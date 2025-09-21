'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  Search,
  Star,
  Users,
  Clock,
  TrendingUp,
  Briefcase,
  DollarSign,
  BarChart3,
  Target,
  PieChart,
  TrendingDown,
  Calendar,
  Mail,
  MessageSquare,
  UserCheck,
  Building,
  CreditCard,
  Globe,
  Lightbulb,
  CheckCircle,
  ChevronRight,
  BookOpen,
  Map,
  Video,
  Play,
  Award,
  Zap,
  ArrowRight,
  Brain,
  Settings,
  Bot,
  Mic,
  Camera,
  Layers,
  LineChart,
  FileText,
  Calculator,
  Presentation,
  Network
} from 'lucide-react'

// Business Learning Paths (Beginner to Advanced)
const businessLearningPaths = {
  beginner: {
    title: 'Business Foundation',
    duration: '3-4 months',
    courses: [
      {
        title: 'Business Fundamentals',
        topics: ['Business Strategy', 'Market Analysis', 'Financial Basics', 'Communication Skills'],
        duration: '4 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Digital Marketing Essentials',
        topics: ['Social Media Marketing', 'SEO Basics', 'Email Marketing', 'Content Creation'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Financial Literacy',
        topics: ['Personal Finance', 'Budgeting', 'Investment Basics', 'Financial Planning'],
        duration: '5 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Professional Development',
    duration: '6-8 months',
    courses: [
      {
        title: 'Advanced Marketing Strategy',
        topics: ['Growth Hacking', 'Customer Analytics', 'Brand Development', 'Campaign Management'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Financial Analysis & Planning',
        topics: ['Financial Modeling', 'Investment Analysis', 'Risk Management', 'Corporate Finance'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Project Management Professional',
        topics: ['Agile Methodology', 'Scrum Framework', 'Resource Planning', 'Team Leadership'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Executive Leadership',
    duration: '8-12 months',
    courses: [
      {
        title: 'Strategic Business Management',
        topics: ['Strategic Planning', 'Change Management', 'Innovation Strategy', 'Global Business'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Entrepreneurship & Startup',
        topics: ['Business Model Innovation', 'Venture Capital', 'Scaling Strategies', 'Exit Planning'],
        duration: '14 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Advanced Finance & Investment',
        topics: ['Portfolio Management', 'Private Equity', 'M&A', 'International Finance'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Business Encyclopedia
const businessEncyclopedia = {
  fundamentals: {
    title: 'Business Fundamentals',
    topics: [
      {
        name: 'Strategic Planning',
        description: 'Long-term business planning, goal setting, and competitive analysis',
        importance: 'Foundation for business success and growth',
        applications: ['Corporate strategy', 'Market positioning', 'Resource allocation']
      },
      {
        name: 'Financial Management',
        description: 'Cash flow, budgeting, investment decisions, and financial analysis',
        importance: 'Ensures business sustainability and profitability',
        applications: ['Budget planning', 'Investment decisions', 'Performance monitoring']
      },
      {
        name: 'Marketing & Sales',
        description: 'Customer acquisition, brand building, and revenue generation',
        importance: 'Drives business growth and market presence',
        applications: ['Brand development', 'Customer engagement', 'Revenue optimization']
      }
    ]
  },
  modern: {
    title: 'Modern Business Practices',
    topics: [
      {
        name: 'Digital Transformation',
        description: 'Technology adoption, digital processes, and automation',
        importance: 'Competitive advantage in digital economy',
        applications: ['Process automation', 'Digital marketing', 'Data analytics']
      },
      {
        name: 'Agile Management',
        description: 'Flexible project management, iterative development, rapid adaptation',
        importance: 'Faster delivery and better customer satisfaction',
        applications: ['Product development', 'Team management', 'Process improvement']
      },
      {
        name: 'Sustainable Business',
        description: 'ESG principles, sustainable practices, social responsibility',
        importance: 'Long-term viability and stakeholder trust',
        applications: ['Corporate responsibility', 'Risk management', 'Brand reputation']
      }
    ]
  }
}

// Business Career Roadmaps
const businessRoadmaps = {
  marketingManager: {
    title: 'Digital Marketing Manager',
    duration: '12-15 months',
    steps: [
      {
        phase: 'Marketing Fundamentals',
        duration: '3 months',
        skills: ['Marketing Strategy', 'Consumer Psychology', 'Market Research', 'Brand Management'],
        projects: ['Market Analysis Report', 'Brand Strategy Document', 'Customer Persona Development'],
        completed: false
      },
      {
        phase: 'Digital Marketing Mastery',
        duration: '4 months',
        skills: ['SEO/SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing'],
        projects: ['SEO Campaign', 'Social Media Strategy', 'Content Calendar', 'Email Automation'],
        completed: false
      },
      {
        phase: 'Analytics & Optimization',
        duration: '3 months',
        skills: ['Google Analytics', 'Data Analysis', 'A/B Testing', 'ROI Measurement'],
        projects: ['Analytics Dashboard', 'Conversion Optimization', 'Marketing Attribution Model'],
        completed: false
      },
      {
        phase: 'Leadership & Strategy',
        duration: '3 months',
        skills: ['Team Management', 'Budget Planning', 'Strategic Planning', 'Cross-functional Collaboration'],
        projects: ['Marketing Team Leadership', 'Annual Marketing Plan', 'Executive Presentation'],
        completed: false
      }
    ]
  },
  entrepreneur: {
    title: 'Successful Entrepreneur',
    duration: '18-24 months',
    steps: [
      {
        phase: 'Business Foundation',
        duration: '4 months',
        skills: ['Business Planning', 'Market Validation', 'Financial Planning', 'Legal Basics'],
        projects: ['Business Plan', 'Market Research', 'Financial Projections', 'MVP Development'],
        completed: false
      },
      {
        phase: 'Product Development',
        duration: '6 months',
        skills: ['Product Management', 'User Experience', 'Technology Stack', 'Quality Assurance'],
        projects: ['Product Prototype', 'User Testing', 'Product Launch', 'Customer Feedback Loop'],
        completed: false
      },
      {
        phase: 'Growth & Scaling',
        duration: '6 months',
        skills: ['Growth Marketing', 'Sales Strategy', 'Operations Management', 'Team Building'],
        projects: ['Growth Strategy', 'Sales Funnel', 'Operations Manual', 'Team Expansion'],
        completed: false
      },
      {
        phase: 'Business Maturity',
        duration: '6 months',
        skills: ['Strategic Partnerships', 'Fundraising', 'Exit Strategy', 'Innovation Management'],
        projects: ['Partnership Agreements', 'Investor Pitch', 'Exit Planning', 'Innovation Lab'],
        completed: false
      }
    ]
  }
}

const businessSubcategories = [
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'SEO, social media, content marketing, and online advertising',
    skillCount: 120,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Search Engine Optimization (SEO)', 'Google Ads', 'Facebook Advertising',
      'Content Marketing', 'Email Marketing', 'Social Media Marketing',
      'Instagram Marketing', 'LinkedIn Marketing', 'YouTube Marketing',
      'Influencer Marketing', 'Affiliate Marketing', 'Marketing Analytics',
      'Google Analytics', 'Conversion Optimization', 'Brand Strategy',
      'Marketing Automation', 'Lead Generation', 'Growth Hacking'
    ]
  },
  {
    id: 'finance-accounting',
    name: 'Finance & Accounting',
    icon: <DollarSign className="w-6 h-6" />,
    description: 'Financial analysis, accounting, and investment strategies',
    skillCount: 95,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'Financial Analysis', 'Investment Banking', 'Corporate Finance',
      'Personal Finance', 'Tax Preparation', 'Bookkeeping', 'QuickBooks',
      'Excel for Finance', 'Financial Modeling', 'Budgeting', 'Forecasting',
      'Risk Management', 'Portfolio Management', 'Real Estate Investment',
      'Cryptocurrency Trading', 'Stock Market Analysis', 'Financial Planning'
    ]
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    icon: <Lightbulb className="w-6 h-6" />,
    description: 'Starting and growing successful businesses',
    skillCount: 85,
    color: 'bg-purple-500',
    trending: true,
    skills: [
      'Business Plan Writing', 'Startup Fundamentals', 'Fundraising',
      'Venture Capital', 'Angel Investment', 'Crowdfunding', 'Lean Startup',
      'Business Model Canvas', 'Market Research', 'Competitor Analysis',
      'Product Development', 'MVP Creation', 'Scaling Strategies',
      'E-commerce Business', 'Dropshipping', 'Amazon FBA', 'Shopify'
    ]
  },
  {
    id: 'project-management',
    name: 'Project Management',
    icon: <Target className="w-6 h-6" />,
    description: 'Agile, Scrum, PMP, and project leadership skills',
    skillCount: 75,
    color: 'bg-orange-500',
    trending: true,
    skills: [
      'Agile Methodology', 'Scrum Master', 'PMP Certification', 'Kanban',
      'Project Planning', 'Risk Management', 'Resource Management',
      'Team Leadership', 'Stakeholder Management', 'Communication',
      'Microsoft Project', 'Jira', 'Trello', 'Asana', 'Monday.com',
      'Gantt Charts', 'Project Budgeting', 'Quality Management'
    ]
  },
  {
    id: 'sales-negotiation',
    name: 'Sales & Negotiation',
    icon: <UserCheck className="w-6 h-6" />,
    description: 'Sales techniques, negotiation skills, and relationship building',
    skillCount: 70,
    color: 'bg-red-500',
    trending: false,
    skills: [
      'Sales Fundamentals', 'Cold Calling', 'Lead Qualification', 'B2B Sales',
      'B2C Sales', 'Sales Funnel', 'CRM Management', 'Salesforce',
      'Negotiation Tactics', 'Closing Techniques', 'Customer Psychology',
      'Relationship Building', 'Account Management', 'Sales Presentations',
      'Objection Handling', 'Sales Analytics', 'Territory Management'
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership & Management',
    icon: <Users className="w-6 h-6" />,
    description: 'Team leadership, management skills, and organizational behavior',
    skillCount: 80,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Team Leadership', 'Change Management', 'Emotional Intelligence',
      'Performance Management', 'Conflict Resolution', 'Decision Making',
      'Strategic Planning', 'Organizational Behavior', 'Time Management',
      'Delegation', 'Coaching & Mentoring', 'Communication Skills',
      'Public Speaking', 'Presentation Skills', 'Meeting Management'
    ]
  },
  {
    id: 'business-analysis',
    name: 'Business Analysis',
    icon: <PieChart className="w-6 h-6" />,
    description: 'Data analysis, process improvement, and business intelligence',
    skillCount: 60,
    color: 'bg-teal-500',
    trending: true,
    skills: [
      'Business Requirements', 'Process Mapping', 'Gap Analysis',
      'SWOT Analysis', 'Business Intelligence', 'Data Analytics',
      'SQL for Business', 'Tableau', 'Power BI', 'Excel Advanced',
      'Statistical Analysis', 'KPI Development', 'Performance Metrics',
      'Process Improvement', 'Lean Six Sigma', 'Business Process Modeling'
    ]
  },
  {
    id: 'supply-chain',
    name: 'Supply Chain & Operations',
    icon: <Building className="w-6 h-6" />,
    description: 'Logistics, supply chain management, and operations optimization',
    skillCount: 50,
    color: 'bg-gray-500',
    trending: false,
    skills: [
      'Supply Chain Management', 'Logistics', 'Inventory Management',
      'Procurement', 'Vendor Management', 'Quality Control',
      'Operations Management', 'Lean Manufacturing', 'Just-in-Time',
      'Distribution Strategy', 'Warehouse Management', 'Transportation',
      'Cost Optimization', 'Supply Chain Analytics', 'ERP Systems'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Complete Digital Marketing Bootcamp',
    instructor: 'Sarah Johnson',
    rating: 4.8,
    reviews: 12847,
    price: 89.99,
    originalPrice: 199.99,
    duration: '15 hours',
    students: '45,000+',
    level: 'Beginner',
    category: 'Digital Marketing',
    trending: true,
    skills: ['SEO', 'Google Ads', 'Social Media', 'Email Marketing'],
    description: 'Master digital marketing from scratch with practical projects and real-world case studies.'
  },
  {
    id: 2,
    title: 'Financial Analysis & Investment Banking',
    instructor: 'Michael Chen',
    rating: 4.9,
    reviews: 8932,
    price: 119.99,
    originalPrice: 249.99,
    duration: '22 hours',
    students: '28,000+',
    level: 'Intermediate',
    category: 'Finance',
    trending: true,
    skills: ['Financial Modeling', 'DCF Analysis', 'Valuation', 'Excel'],
    description: 'Learn professional financial analysis techniques used by top investment banks.'
  },
  {
    id: 3,
    title: 'Startup Entrepreneur Masterclass',
    instructor: 'Emma Rodriguez',
    rating: 4.7,
    reviews: 15672,
    price: 94.99,
    originalPrice: 199.99,
    duration: '18 hours',
    students: '38,000+',
    level: 'All Levels',
    category: 'Entrepreneurship',
    trending: true,
    skills: ['Business Planning', 'Fundraising', 'MVP Development', 'Scaling'],
    description: 'Build and scale your startup from idea to successful business with proven strategies.'
  },
  {
    id: 4,
    title: 'Agile Project Management Professional',
    instructor: 'David Kim',
    rating: 4.8,
    reviews: 6543,
    price: 109.99,
    originalPrice: 229.99,
    duration: '20 hours',
    students: '22,000+',
    level: 'Intermediate',
    category: 'Project Management',
    trending: true,
    skills: ['Scrum', 'Kanban', 'Agile Ceremonies', 'Team Leadership'],
    description: 'Master Agile and Scrum methodologies to lead high-performing development teams.'
  },
  {
    id: 5,
    title: 'Sales Psychology & Persuasion Techniques',
    instructor: 'Jennifer Park',
    rating: 4.6,
    reviews: 9876,
    price: 79.99,
    originalPrice: 179.99,
    duration: '12 hours',
    students: '31,000+',
    level: 'Beginner',
    category: 'Sales',
    trending: false,
    skills: ['Persuasion', 'Negotiation', 'Customer Psychology', 'Closing'],
    description: 'Learn the psychology behind successful sales and master advanced persuasion techniques.'
  },
  {
    id: 6,
    title: 'Leadership & Team Management Excellence',
    instructor: 'Robert Thompson',
    rating: 4.9,
    reviews: 7234,
    price: 99.99,
    originalPrice: 199.99,
    duration: '16 hours',
    students: '19,000+',
    level: 'Intermediate',
    category: 'Leadership',
    trending: true,
    skills: ['Team Building', 'Conflict Resolution', 'Strategic Thinking', 'Communication'],
    description: 'Develop executive-level leadership skills to inspire and manage high-performing teams.'
  }
]

export default function BusinessPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('marketingManager')
  const [roadmapProgress, setRoadmapProgress] = useState(25)

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedSubcategory === 'all' ||
                          course.category.toLowerCase() === selectedSubcategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Briefcase className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Business & Finance Skills
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Master business fundamentals, financial analysis, marketing strategies, and leadership skills to advance your career and grow your business.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search business courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl bg-white/10 border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">540+</div>
                <div className="text-sm opacity-80">Business Courses</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">120K+</div>
                <div className="text-sm opacity-80">Students Enrolled</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-80">Career Advancement</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">4.7/5</div>
                <div className="text-sm opacity-80">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Subcategories */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Business Specializations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose your path to business success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessSubcategories.map((subcategory) => (
              <Card key={subcategory.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${subcategory.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    {subcategory.icon}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {subcategory.name}
                    </CardTitle>
                    {subcategory.trending && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm mb-3">
                    {subcategory.description}
                  </CardDescription>
                  <p className="text-sm text-gray-500 mb-3">
                    {subcategory.skillCount} skills available
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Popular Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {subcategory.skills.slice(0, 4).map((skill, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {subcategory.skills.length > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{subcategory.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    Explore {subcategory.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Business Courses
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Top-rated courses chosen by business professionals
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Categories</option>
                {businessSubcategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/skills/${course.id}`}>
                <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                      <Briefcase className="h-12 w-12 text-white" />
                    </div>
                    {course.trending && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        🔥 Trending
                      </Badge>
                    )}
                    <Badge className="absolute top-2 right-2 bg-white/90 text-gray-800">
                      {course.level}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating}</span>
                        <span className="text-xs text-gray-500">({course.reviews.toLocaleString()})</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {course.instructor[0]}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{course.instructor}</span>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">You'll learn:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">${course.price}</span>
                        <span className="text-sm text-gray-500 line-through">${course.originalPrice}</span>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Enroll Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Business Skills */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Business Skills Matter
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Invest in skills that drive career growth and business success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Career Advancement</h3>
              <p className="text-gray-600 dark:text-gray-400">
                95% of our business course graduates report career advancement within 6 months.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Higher Earnings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Business skills lead to an average 40% salary increase within one year.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Entrepreneurship</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Learn to start and scale your own business with proven strategies and frameworks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Learning System */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Business Learning Ecosystem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From fundamentals to executive leadership - master every aspect of business
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Content
              </TabsTrigger>
              <TabsTrigger value="roadmaps" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Roadmaps
              </TabsTrigger>
              <TabsTrigger value="encyclopedia" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Encyclopedia
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Meetings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessSubcategories.map((subcategory) => (
                  <Card key={subcategory.id} className="group hover:shadow-lg transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 ${subcategory.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                        {subcategory.icon}
                      </div>
                      <CardTitle className="text-lg">{subcategory.name}</CardTitle>
                      <CardDescription className="text-sm">{subcategory.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-500">{subcategory.skillCount} skills</span>
                        {subcategory.trending && (
                          <Badge className="bg-red-500 text-white text-xs">🔥 Hot</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {subcategory.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Structured Content Tab */}
            <TabsContent value="content" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {Object.entries(businessLearningPaths).map(([level, path]) => (
                  <Card key={level} className="h-fit">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          level === 'beginner' ? 'bg-green-500' :
                          level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {level === 'beginner' ? <Target className="w-5 h-5" /> :
                           level === 'intermediate' ? <Zap className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{path.title}</CardTitle>
                          <p className="text-sm text-gray-500">{path.duration}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {path.courses.map((course, idx) => (
                        <div key={idx} className="border rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{course.title}</h4>
                            <Badge variant="outline" className="text-xs">{course.duration}</Badge>
                          </div>
                          <div className="space-y-2">
                            {course.topics.map((topic, topicIdx) => (
                              <div key={topicIdx} className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                {topic}
                              </div>
                            ))}
                          </div>
                          <Button size="sm" className="w-full mt-3">
                            <Play className="w-4 h-4 mr-2" />
                            Start Learning
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Interactive Roadmaps Tab */}
            <TabsContent value="roadmaps" className="space-y-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Roadmap Selection */}
                <div className="lg:w-1/3 space-y-4">
                  <h3 className="text-xl font-bold">Choose Your Career Path</h3>
                  {Object.entries(businessRoadmaps).map(([key, roadmap]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedRoadmap === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedRoadmap(key)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium">{roadmap.title}</h4>
                        <p className="text-sm text-gray-500">{roadmap.duration}</p>
                        <Progress value={roadmapProgress} className="mt-2" />
                        <p className="text-xs text-gray-500 mt-1">{roadmapProgress}% Complete</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Roadmap Detail */}
                <div className="lg:w-2/3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {businessRoadmaps[selectedRoadmap as keyof typeof businessRoadmaps].title}
                      </CardTitle>
                      <p className="text-gray-600">
                        Complete roadmap to become a successful {businessRoadmaps[selectedRoadmap as keyof typeof businessRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {businessRoadmaps[selectedRoadmap as keyof typeof businessRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < businessRoadmaps[selectedRoadmap as keyof typeof businessRoadmaps].steps.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                          )}
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              step.completed ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-lg">{step.phase}</h4>
                                <Badge variant="outline">{step.duration}</Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Skills to Master:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {step.skills.map((skill, skillIdx) => (
                                      <Badge key={skillIdx} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Key Projects:</h5>
                                  <div className="space-y-1">
                                    {step.projects.map((project, projIdx) => (
                                      <div key={projIdx} className="text-sm text-gray-600 flex items-center gap-2">
                                        <ArrowRight className="w-3 h-3" />
                                        {project}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <Button size="sm" variant={step.completed ? 'secondary' : 'default'}>
                                {step.completed ? 'Completed' : 'Start Phase'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Encyclopedia Tab */}
            <TabsContent value="encyclopedia" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(businessEncyclopedia).map(([category, section]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.topics.map((topic, idx) => (
                        <div key={idx} className="border-l-4 border-blue-500 pl-4 space-y-2">
                          <h4 className="font-medium text-lg">{topic.name}</h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-blue-600">Why Important:</span>
                              <p className="text-xs text-gray-600">{topic.importance}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-green-600">Applications:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {topic.applications.map((app, appIdx) => (
                                  <Badge key={appIdx} variant="outline" className="text-xs">
                                    {app}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Business Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Business Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Business Sessions
                    </CardTitle>
                    <CardDescription>
                      Join real-time sessions with business experts and entrepreneurs
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'Digital Marketing Strategy Workshop',
                        instructor: 'Sarah Johnson',
                        time: 'Today 2:00 PM',
                        participants: 32,
                        type: 'Workshop'
                      },
                      {
                        title: 'Startup Funding Masterclass',
                        instructor: 'Emma Rodriguez',
                        time: 'Tomorrow 4:00 PM',
                        participants: 28,
                        type: 'Masterclass'
                      },
                      {
                        title: 'Financial Planning Q&A',
                        instructor: 'Michael Chen',
                        time: 'Wed 3:00 PM',
                        participants: 24,
                        type: 'Q&A Session'
                      }
                    ].map((session, idx) => (
                      <div key={idx} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.title}</h4>
                            <p className="text-sm text-gray-600">by {session.instructor}</p>
                          </div>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.time}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {session.participants}
                            </div>
                          </div>
                          <Button size="sm">
                            <Video className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Business Meeting */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Business Session
                    </CardTitle>
                    <CardDescription>
                      Create your own business learning or networking session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Video className="w-6 h-6" />
                        <span className="text-sm">Business Meeting</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <Presentation className="w-6 h-6" />
                        <span className="text-sm">Pitch Session</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Business Session Types:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Strategy Session
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Network className="w-4 h-4 mr-2" />
                          Networking Event
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calculator className="w-4 h-4 mr-2" />
                          Financial Planning
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Innovation Workshop
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Business Tools Available:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Whiteboard
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Screen Sharing
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Document Sharing
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Recording
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Business Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">18</div>
                      <div className="text-sm text-gray-600">Business Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">142</div>
                      <div className="text-sm text-gray-600">Learning Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">6</div>
                      <div className="text-sm text-gray-600">Business Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">4</div>
                      <div className="text-sm text-gray-600">Certifications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Business Visualization Tools */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Business Learning Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Master business concepts through interactive simulations and visual models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Financial Modeling */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Financial Modeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive financial models</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>DCF Model</span>
                    <span className="text-blue-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Budget Planning</span>
                    <span className="text-green-600">Simulation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>ROI Calculator</span>
                    <span className="text-purple-600">Tool</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600">
                  <Play className="w-4 h-4 mr-2" />
                  Try Financial Model
                </Button>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Market Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Market research tools</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Competitor Analysis</span>
                    <span className="text-blue-600">Framework</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>SWOT Analysis</span>
                    <span className="text-green-600">Template</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Market Sizing</span>
                    <span className="text-purple-600">Calculator</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-blue-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Analyze Market
                </Button>
              </CardContent>
            </Card>

            {/* Business Strategy */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  Strategy Canvas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Target className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Strategy planning tools</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Business Model Canvas</span>
                    <span className="text-blue-600">Template</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Value Proposition</span>
                    <span className="text-green-600">Designer</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Strategy Map</span>
                    <span className="text-purple-600">Builder</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-purple-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Build Strategy
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Accelerate Your Business Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have transformed their careers with business skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Learning Today
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Browse All Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}