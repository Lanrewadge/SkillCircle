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
  Calculator,
  PieChart,
  BarChart3,
  TrendingDown,
  Infinity,
  Triangle,
  CircleDot,
  Sigma,
  Function,
  Divide,
  Plus,
  Minus,
  X,
  CheckCircle,
  Award,
  BookOpen,
  Map,
  Video,
  Play,
  Target,
  ArrowRight,
  Calendar,
  Settings,
  Bot,
  Mic,
  Camera,
  FileText,
  Grid3x3,
  Layers,
  Compass,
  Ruler,
  Binary,
  Brain
} from 'lucide-react'

// Mathematics Learning Paths (Beginner to Advanced)
const mathLearningPaths = {
  beginner: {
    title: 'Mathematical Foundations',
    duration: '4-6 months',
    courses: [
      {
        title: 'Algebra & Basic Functions',
        topics: ['Linear Equations', 'Quadratic Functions', 'Polynomials', 'Exponential Functions'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Geometry & Trigonometry',
        topics: ['Euclidean Geometry', 'Trigonometric Functions', 'Triangle Properties', 'Circle Geometry'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Pre-Calculus',
        topics: ['Functions & Graphs', 'Limits', 'Sequences & Series', 'Mathematical Reasoning'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Advanced Mathematics',
    duration: '8-12 months',
    courses: [
      {
        title: 'Calculus I & II',
        topics: ['Derivatives', 'Integrals', 'Applications of Calculus', 'Differential Equations'],
        duration: '16 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Linear Algebra',
        topics: ['Vectors', 'Matrices', 'Linear Transformations', 'Eigenvalues & Eigenvectors'],
        duration: '12 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Statistics & Probability',
        topics: ['Descriptive Statistics', 'Probability Theory', 'Distributions', 'Hypothesis Testing'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Higher Mathematics',
    duration: '12-18 months',
    courses: [
      {
        title: 'Real & Complex Analysis',
        topics: ['Real Analysis', 'Complex Numbers', 'Fourier Analysis', 'Functional Analysis'],
        duration: '18 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Abstract Algebra',
        topics: ['Group Theory', 'Ring Theory', 'Field Theory', 'Galois Theory'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Topology & Geometry',
        topics: ['Point-Set Topology', 'Algebraic Topology', 'Differential Geometry', 'Manifolds'],
        duration: '20 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Mathematics Encyclopedia
const mathEncyclopedia = {
  pure: {
    title: 'Pure Mathematics',
    topics: [
      {
        name: 'Calculus',
        description: 'Study of continuous change through derivatives and integrals',
        importance: 'Foundation for physics, engineering, and advanced mathematics',
        applications: ['Physics modeling', 'Engineering optimization', 'Economics analysis']
      },
      {
        name: 'Linear Algebra',
        description: 'Study of vector spaces, linear transformations, and matrices',
        importance: 'Essential for computer graphics, machine learning, and physics',
        applications: ['Computer graphics', 'Data science', 'Quantum mechanics']
      },
      {
        name: 'Abstract Algebra',
        description: 'Study of algebraic structures like groups, rings, and fields',
        importance: 'Foundation for cryptography and theoretical computer science',
        applications: ['Cryptography', 'Error correction', 'Computer algebra']
      }
    ]
  },
  applied: {
    title: 'Applied Mathematics',
    topics: [
      {
        name: 'Statistics',
        description: 'Collection, analysis, interpretation, and presentation of data',
        importance: 'Essential for data-driven decision making',
        applications: ['Data science', 'Medical research', 'Quality control']
      },
      {
        name: 'Numerical Analysis',
        description: 'Algorithms for solving mathematical problems computationally',
        importance: 'Bridge between mathematics and computer science',
        applications: ['Scientific computing', 'Engineering simulations', 'Financial modeling']
      },
      {
        name: 'Optimization',
        description: 'Finding the best solution from a set of alternatives',
        importance: 'Critical for efficiency and resource allocation',
        applications: ['Machine learning', 'Operations research', 'Economics']
      }
    ]
  }
}

// Mathematics Career Roadmaps
const mathRoadmaps = {
  mathematician: {
    title: 'Research Mathematician',
    duration: '18-24 months',
    steps: [
      {
        phase: 'Mathematical Foundation',
        duration: '6 months',
        skills: ['Advanced Calculus', 'Linear Algebra', 'Real Analysis', 'Abstract Algebra'],
        projects: ['Mathematical Proofs', 'Research Papers', 'Problem Sets'],
        completed: false
      },
      {
        phase: 'Specialization Areas',
        duration: '8 months',
        skills: ['Topology', 'Number Theory', 'Differential Geometry', 'Logic'],
        projects: ['Original Research', 'Conference Presentations', 'Peer Review'],
        completed: false
      },
      {
        phase: 'Research Methods',
        duration: '6 months',
        skills: ['Mathematical Writing', 'Collaboration', 'Grant Writing', 'Teaching'],
        projects: ['PhD Thesis', 'Publications', 'Academic Network'],
        completed: false
      },
      {
        phase: 'Professional Development',
        duration: '4 months',
        skills: ['Academic Career', 'Industry Applications', 'Consulting', 'Leadership'],
        projects: ['Career Planning', 'Professional Portfolio', 'Mentoring'],
        completed: false
      }
    ]
  },
  dataScientist: {
    title: 'Mathematical Data Scientist',
    duration: '15-18 months',
    steps: [
      {
        phase: 'Mathematical Statistics',
        duration: '4 months',
        skills: ['Statistics', 'Probability', 'Hypothesis Testing', 'Bayesian Methods'],
        projects: ['Statistical Analysis', 'A/B Testing', 'Probability Models'],
        completed: false
      },
      {
        phase: 'Machine Learning Mathematics',
        duration: '6 months',
        skills: ['Linear Algebra', 'Optimization', 'Calculus', 'Information Theory'],
        projects: ['ML Algorithms', 'Optimization Problems', 'Model Validation'],
        completed: false
      },
      {
        phase: 'Applied Mathematics',
        duration: '5 months',
        skills: ['Numerical Methods', 'Computational Math', 'Graph Theory', 'Time Series'],
        projects: ['Data Pipelines', 'Predictive Models', 'Algorithm Implementation'],
        completed: false
      },
      {
        phase: 'Industry Application',
        duration: '3 months',
        skills: ['Business Analytics', 'Communication', 'Project Management', 'Ethics'],
        projects: ['Business Solutions', 'Stakeholder Presentations', 'Production Systems'],
        completed: false
      }
    ]
  }
}

const mathSubcategories = [
  {
    id: 'calculus',
    name: 'Calculus',
    icon: <Function className="w-6 h-6" />,
    description: 'Derivatives, integrals, limits, and applications of continuous change',
    skillCount: 95,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Limits', 'Derivatives', 'Integrals', 'Chain Rule',
      'Product Rule', 'Integration by Parts', 'Applications of Derivatives', 'Optimization',
      'Related Rates', 'Area Under Curves', 'Volume of Revolution', 'Differential Equations'
    ]
  },
  {
    id: 'algebra',
    name: 'Algebra',
    icon: <X className="w-6 h-6" />,
    description: 'Linear equations, polynomials, abstract structures, and algebraic systems',
    skillCount: 85,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'Linear Equations', 'Quadratic Equations', 'Polynomials', 'Factoring',
      'Systems of Equations', 'Matrices', 'Determinants', 'Linear Transformations',
      'Vector Spaces', 'Eigenvalues', 'Group Theory', 'Ring Theory'
    ]
  },
  {
    id: 'geometry',
    name: 'Geometry & Topology',
    icon: <Triangle className="w-6 h-6" />,
    description: 'Euclidean geometry, trigonometry, and topological spaces',
    skillCount: 75,
    color: 'bg-purple-500',
    trending: false,
    skills: [
      'Euclidean Geometry', 'Trigonometry', 'Coordinate Geometry', 'Transformations',
      'Proofs', 'Similar Triangles', 'Circle Theorems', 'Differential Geometry',
      'Topology', 'Manifolds', 'Algebraic Topology', 'Knot Theory'
    ]
  },
  {
    id: 'statistics',
    name: 'Statistics & Probability',
    icon: <BarChart3 className="w-6 h-6" />,
    description: 'Data analysis, probability theory, and statistical inference',
    skillCount: 110,
    color: 'bg-orange-500',
    trending: true,
    skills: [
      'Descriptive Statistics', 'Probability', 'Distributions', 'Hypothesis Testing',
      'Confidence Intervals', 'Regression Analysis', 'ANOVA', 'Bayesian Statistics',
      'Time Series', 'Multivariate Analysis', 'Experimental Design', 'Data Mining'
    ]
  },
  {
    id: 'discrete-math',
    name: 'Discrete Mathematics',
    icon: <Grid3x3 className="w-6 h-6" />,
    description: 'Combinatorics, graph theory, logic, and discrete structures',
    skillCount: 70,
    color: 'bg-red-500',
    trending: true,
    skills: [
      'Combinatorics', 'Graph Theory', 'Logic', 'Set Theory',
      'Number Theory', 'Algorithms', 'Cryptography', 'Boolean Algebra',
      'Recursion', 'Induction', 'Discrete Probability', 'Automata Theory'
    ]
  },
  {
    id: 'numerical-analysis',
    name: 'Numerical Analysis',
    icon: <Calculator className="w-6 h-6" />,
    description: 'Computational methods for solving mathematical problems',
    skillCount: 65,
    color: 'bg-cyan-500',
    trending: true,
    skills: [
      'Numerical Integration', 'Root Finding', 'Linear Systems', 'Interpolation',
      'Approximation Theory', 'Finite Differences', 'Monte Carlo Methods', 'Error Analysis',
      'Optimization Algorithms', 'Numerical ODEs', 'Iterative Methods', 'Computational Complexity'
    ]
  },
  {
    id: 'mathematical-modeling',
    name: 'Mathematical Modeling',
    icon: <PieChart className="w-6 h-6" />,
    description: 'Real-world problem solving using mathematical techniques',
    skillCount: 80,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Differential Equations', 'Dynamical Systems', 'Population Models', 'Economic Models',
      'Physics Models', 'Optimization Models', 'Stochastic Models', 'Game Theory',
      'Network Models', 'Epidemiological Models', 'Financial Models', 'Climate Models'
    ]
  },
  {
    id: 'logic',
    name: 'Logic & Foundations',
    icon: <Binary className="w-6 h-6" />,
    description: 'Mathematical logic, set theory, and foundations of mathematics',
    skillCount: 55,
    color: 'bg-yellow-500',
    trending: false,
    skills: [
      'Propositional Logic', 'Predicate Logic', 'Set Theory', 'Model Theory',
      'Proof Theory', 'Computability', 'Complexity Theory', 'Category Theory',
      'Type Theory', 'Constructive Mathematics', 'Formal Systems', 'Metamathematics'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Multivariable Calculus Mastery',
    instructor: 'Prof. Lisa Chen',
    rating: 4.9,
    reviews: 12456,
    price: 149.99,
    originalPrice: 299.99,
    duration: '35 hours',
    students: '28,000+',
    level: 'Intermediate',
    category: 'Calculus',
    trending: true,
    skills: ['Partial Derivatives', 'Multiple Integrals', 'Vector Calculus', 'Green\'s Theorem'],
    description: 'Master advanced calculus with interactive 3D visualizations and real-world applications.',
    certification: 'Advanced Calculus Certificate'
  },
  {
    id: 2,
    title: 'Linear Algebra for Data Science',
    instructor: 'Dr. Michael Rodriguez',
    rating: 4.8,
    reviews: 9876,
    price: 129.99,
    originalPrice: 249.99,
    duration: '28 hours',
    students: '32,000+',
    level: 'Intermediate',
    category: 'Algebra',
    trending: true,
    skills: ['Matrices', 'Vector Spaces', 'Eigenvalues', 'SVD'],
    description: 'Learn linear algebra with focus on machine learning and data science applications.',
    certification: 'Linear Algebra Certificate'
  },
  {
    id: 3,
    title: 'Statistics for Research & Analytics',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.7,
    reviews: 8234,
    price: 139.99,
    originalPrice: 279.99,
    duration: '32 hours',
    students: '25,000+',
    level: 'Intermediate',
    category: 'Statistics',
    trending: true,
    skills: ['Hypothesis Testing', 'Regression', 'ANOVA', 'Bayesian Analysis'],
    description: 'Comprehensive statistics course with R and Python for data analysis.',
    certification: 'Statistics Certificate'
  },
  {
    id: 4,
    title: 'Discrete Mathematics & Logic',
    instructor: 'Prof. Alex Kim',
    rating: 4.6,
    reviews: 6543,
    price: 119.99,
    originalPrice: 239.99,
    duration: '25 hours',
    students: '18,000+',
    level: 'Beginner',
    category: 'Discrete Mathematics',
    trending: true,
    skills: ['Graph Theory', 'Combinatorics', 'Logic', 'Proofs'],
    description: 'Essential discrete math for computer science and mathematical reasoning.',
    certification: 'Discrete Math Certificate'
  },
  {
    id: 5,
    title: 'Numerical Methods & Computing',
    instructor: 'Dr. Rachel Williams',
    rating: 4.8,
    reviews: 5678,
    price: 159.99,
    originalPrice: 319.99,
    duration: '30 hours',
    students: '15,000+',
    level: 'Advanced',
    category: 'Numerical Analysis',
    trending: false,
    skills: ['Root Finding', 'Numerical Integration', 'Linear Systems', 'Optimization'],
    description: 'Learn computational mathematics with MATLAB and Python implementations.',
    certification: 'Numerical Analysis Certificate'
  },
  {
    id: 6,
    title: 'Mathematical Modeling & Applications',
    instructor: 'Dr. David Thompson',
    rating: 4.7,
    reviews: 4321,
    price: 169.99,
    originalPrice: 339.99,
    duration: '38 hours',
    students: '12,000+',
    level: 'Advanced',
    category: 'Mathematical Modeling',
    trending: true,
    skills: ['Differential Equations', 'Dynamical Systems', 'Optimization', 'Simulation'],
    description: 'Apply mathematics to solve real-world problems in science and engineering.',
    certification: 'Mathematical Modeling Certificate'
  }
]

export default function MathematicsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('mathematician')
  const [roadmapProgress, setRoadmapProgress] = useState(45)

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedSubcategory === 'all' ||
                          course.category.toLowerCase() === selectedSubcategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-indigo-900/20 dark:to-cyan-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl mb-6">
              <Calculator className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Mathematics & Applied Math
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Master the language of the universe. From pure mathematics to applied analytics,
              develop the quantitative skills that power science, technology, and discovery.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search mathematics courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Math Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-indigo-600">635+</div>
                <div className="text-sm text-muted-foreground">Math Courses</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-blue-600">68K+</div>
                <div className="text-sm text-muted-foreground">Math Students</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-cyan-600">180+</div>
                <div className="text-sm text-muted-foreground">Math Professors</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-muted-foreground">Problem Solvers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Mathematics Specializations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore pure and applied mathematics across all major branches
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mathSubcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/explore/mathematics/${subcategory.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-background/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 ${subcategory.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {subcategory.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg group-hover:text-indigo-600 transition-colors">
                        {subcategory.name}
                      </CardTitle>
                      {subcategory.trending && (
                        <Badge className="bg-red-500 text-white text-xs">
                          🔥 Hot
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm mb-3">
                      {subcategory.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-muted-foreground">
                        {subcategory.skillCount} topics
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Popular Topics Preview */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-foreground mb-2">Key Topics:</h4>
                      <div className="flex flex-wrap gap-1">
                        {subcategory.skills.slice(0, 6).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {subcategory.skills.length > 6 && (
                          <Badge variant="secondary" className="text-xs">
                            +{subcategory.skills.length - 6}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Mathematics Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Mathematics Courses
              </h2>
              <p className="text-xl text-muted-foreground">
                Learn from world-class mathematicians and applied math experts
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="all">All Specializations</option>
                {mathSubcategories.map(sub => (
                  <option key={sub.id} value={sub.name}>{sub.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Recently Updated</option>
                <option value="price">Price: Low to High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Link key={course.id} href={`/skills/${course.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-0 bg-background">
                  {/* Course Image */}
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {course.trending && (
                        <Badge className="bg-red-500 text-white">
                          🔥 Trending
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {course.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-indigo-600 text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Function className="w-16 h-16 text-white/50" />
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">({course.reviews.toLocaleString()})</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {course.instructor[0]}
                      </div>
                      <span className="text-sm text-muted-foreground">{course.instructor}</span>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">You'll master:</h4>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certification */}
                    <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700 dark:text-green-400">{course.certification}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">${course.price}</span>
                        <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-indigo-600 transition-colors">
                        <Play className="w-4 h-4 mr-1" />
                        Enroll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Mathematics Learning System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Mathematics Learning Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              From algebra to abstract mathematics - master every branch of mathematical knowledge
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
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
                <Sigma className="w-4 h-4" />
                Encyclopedia
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Study Groups
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mathSubcategories.map((subcategory) => (
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
                        <span className="text-sm text-muted-foreground">{subcategory.skillCount} topics</span>
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
                {Object.entries(mathLearningPaths).map(([level, path]) => (
                  <Card key={level} className="h-fit">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          level === 'beginner' ? 'bg-green-500' :
                          level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {level === 'beginner' ? <Target className="w-5 h-5" /> :
                           level === 'intermediate' ? <Calculator className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{path.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{path.duration}</p>
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
                              <div key={topicIdx} className="flex items-center gap-2 text-sm text-muted-foreground">
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
                  <h3 className="text-xl font-bold">Choose Your Mathematical Career Path</h3>
                  {Object.entries(mathRoadmaps).map(([key, roadmap]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedRoadmap === key ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedRoadmap(key)}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium">{roadmap.title}</h4>
                        <p className="text-sm text-muted-foreground">{roadmap.duration}</p>
                        <Progress value={roadmapProgress} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">{roadmapProgress}% Complete</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Roadmap Detail */}
                <div className="lg:w-2/3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        {mathRoadmaps[selectedRoadmap as keyof typeof mathRoadmaps].title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Complete roadmap to become a professional {mathRoadmaps[selectedRoadmap as keyof typeof mathRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {mathRoadmaps[selectedRoadmap as keyof typeof mathRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < mathRoadmaps[selectedRoadmap as keyof typeof mathRoadmaps].steps.length - 1 && (
                            <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>
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
                                  <h5 className="font-medium text-sm mb-2">Mathematical Skills:</h5>
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
                                      <div key={projIdx} className="text-sm text-muted-foreground flex items-center gap-2">
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
                {Object.entries(mathEncyclopedia).map(([category, section]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.topics.map((topic, idx) => (
                        <div key={idx} className="border-l-4 border-indigo-500 pl-4 space-y-2">
                          <h4 className="font-medium text-lg">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-indigo-600">Why Important:</span>
                              <p className="text-xs text-muted-foreground">{topic.importance}</p>
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

            {/* Mathematics Study Groups & Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Math Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Mathematics Study Groups
                    </CardTitle>
                    <CardDescription>
                      Join collaborative problem-solving sessions with mathematicians
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'Calculus Problem Solving Workshop',
                        instructor: 'Prof. Lisa Chen',
                        time: 'Today 3:00 PM',
                        participants: 42,
                        type: 'Problem Session'
                      },
                      {
                        title: 'Linear Algebra Study Group',
                        instructor: 'Dr. Michael Rodriguez',
                        time: 'Tomorrow 2:00 PM',
                        participants: 38,
                        type: 'Study Group'
                      },
                      {
                        title: 'Statistics Research Seminar',
                        instructor: 'Dr. Sarah Johnson',
                        time: 'Wed 4:00 PM',
                        participants: 25,
                        type: 'Research Seminar'
                      }
                    ].map((session, idx) => (
                      <div key={idx} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{session.title}</h4>
                            <p className="text-sm text-muted-foreground">by {session.instructor}</p>
                          </div>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                            Join Study Group
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Math Session */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Math Session
                    </CardTitle>
                    <CardDescription>
                      Create your own mathematics study or problem-solving session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Calculator className="w-6 h-6" />
                        <span className="text-sm">Problem Solving</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <BarChart3 className="w-6 h-6" />
                        <span className="text-sm">Data Analysis</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Mathematics Session Types:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Function className="w-4 h-4 mr-2" />
                          Calculus Study Group
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Grid3x3 className="w-4 h-4 mr-2" />
                          Linear Algebra Workshop
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <PieChart className="w-4 h-4 mr-2" />
                          Statistics Lab
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="w-4 h-4 mr-2" />
                          Mathematical Reasoning
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Math Tools Available:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Graphing Calculator
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Equation Editor
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Mathematical Proofs
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Session Recording
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Math Learning Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Mathematics Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">28</div>
                      <div className="text-sm text-muted-foreground">Study Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">198</div>
                      <div className="text-sm text-muted-foreground">Problems Solved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">12</div>
                      <div className="text-sm text-muted-foreground">Math Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">6</div>
                      <div className="text-sm text-muted-foreground">Certificates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Mathematical Visualization Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Mathematical Tools
            </h2>
            <p className="text-xl text-muted-foreground">
              Visualize and explore mathematical concepts through interactive tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Graphing Calculator */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Function className="w-5 h-5" />
                  3D Graphing Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive function plotting</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>2D/3D Plotting</span>
                    <span className="text-indigo-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Calculus Tools</span>
                    <span className="text-blue-600">Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Function Analysis</span>
                    <span className="text-green-600">Real-time</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-indigo-600">
                  <Play className="w-4 h-4 mr-2" />
                  Open Calculator
                </Button>
              </CardContent>
            </Card>

            {/* Linear Algebra Visualizer */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="w-5 h-5" />
                  Linear Algebra Visualizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-cyan-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Matrix transformations</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Matrix Operations</span>
                    <span className="text-green-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Vector Spaces</span>
                    <span className="text-cyan-600">3D Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Eigenvalues</span>
                    <span className="text-blue-600">Animation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Explore Matrices
                </Button>
              </CardContent>
            </Card>

            {/* Statistics Simulator */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Statistics Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Statistical analysis tools</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Data Visualization</span>
                    <span className="text-orange-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Hypothesis Testing</span>
                    <span className="text-red-600">Simulation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Probability Models</span>
                    <span className="text-purple-600">Monte Carlo</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-orange-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Analyze Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Master the Language of Science?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and professionals developing quantitative skills for the future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3">
              <Link href="/auth/register">Start Mathematical Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link href="/dashboard/meetings">Join Math Study Group</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}