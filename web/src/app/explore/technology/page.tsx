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
  Code,
  Laptop,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Brain,
  Gamepad2,
  Globe,
  ChevronRight,
  DollarSign,
  Calendar,
  Filter,
  BookOpen,
  Map,
  Video,
  Play,
  Award,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingDown,
  MessageSquare,
  Camera,
  Mic,
  Settings,
  PieChart,
  BarChart3,
  Layers,
  Code2,
  Palette,
  Bot
} from 'lucide-react'

// Structured Learning Content (Beginner to Advanced)
const learningPaths = {
  beginner: {
    title: 'Foundation Level',
    duration: '2-4 months',
    courses: [
      {
        title: 'Programming Fundamentals',
        topics: ['Variables & Data Types', 'Control Structures', 'Functions', 'Basic Algorithms'],
        duration: '4 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Web Development Basics',
        topics: ['HTML5 Fundamentals', 'CSS3 Styling', 'JavaScript Basics', 'DOM Manipulation'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Database Fundamentals',
        topics: ['SQL Basics', 'Database Design', 'CRUD Operations', 'Data Modeling'],
        duration: '4 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Professional Level',
    duration: '6-8 months',
    courses: [
      {
        title: 'Advanced Frontend Development',
        topics: ['React/Vue.js', 'State Management', 'API Integration', 'Testing'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Backend Development',
        topics: ['Server Architecture', 'RESTful APIs', 'Authentication', 'Database Optimization'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'DevOps Essentials',
        topics: ['CI/CD Pipelines', 'Containerization', 'Cloud Services', 'Monitoring'],
        duration: '6 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Expert Level',
    duration: '8-12 months',
    courses: [
      {
        title: 'System Architecture',
        topics: ['Microservices', 'Scalability', 'Performance Optimization', 'Security'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Machine Learning & AI',
        topics: ['Deep Learning', 'Neural Networks', 'Computer Vision', 'NLP'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Blockchain Development',
        topics: ['Smart Contracts', 'DeFi', 'Web3', 'Cryptocurrency'],
        duration: '10 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Technology Encyclopedia
const techEncyclopedia = {
  fundamentals: {
    title: 'Computer Science Fundamentals',
    topics: [
      {
        name: 'Data Structures',
        description: 'Arrays, linked lists, trees, graphs, hash tables',
        importance: 'Essential for efficient algorithm design',
        applications: ['Database indexing', 'Network routing', 'Memory management']
      },
      {
        name: 'Algorithms',
        description: 'Sorting, searching, dynamic programming, greedy algorithms',
        importance: 'Problem-solving foundation',
        applications: ['Search engines', 'Route optimization', 'Data compression']
      },
      {
        name: 'System Design',
        description: 'Architecture patterns, scalability, distributed systems',
        importance: 'Building robust applications',
        applications: ['Cloud services', 'Social media platforms', 'E-commerce systems']
      }
    ]
  },
  technologies: {
    title: 'Modern Technologies',
    topics: [
      {
        name: 'Artificial Intelligence',
        description: 'Machine learning, deep learning, neural networks',
        importance: 'Automation and intelligent systems',
        applications: ['Autonomous vehicles', 'Medical diagnosis', 'Language translation']
      },
      {
        name: 'Cloud Computing',
        description: 'AWS, Azure, Google Cloud, serverless architecture',
        importance: 'Scalable and cost-effective infrastructure',
        applications: ['Global applications', 'Big data processing', 'IoT systems']
      },
      {
        name: 'Cybersecurity',
        description: 'Encryption, penetration testing, security protocols',
        importance: 'Protecting digital assets',
        applications: ['Financial systems', 'Healthcare data', 'Government infrastructure']
      }
    ]
  }
}

// Interactive Roadmaps
const interactiveRoadmaps = {
  webDeveloper: {
    title: 'Full-Stack Web Developer',
    duration: '12-18 months',
    steps: [
      {
        phase: 'Foundation',
        duration: '3 months',
        skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Git/GitHub'],
        projects: ['Personal Portfolio', 'Landing Pages', 'Interactive Forms'],
        completed: false
      },
      {
        phase: 'Frontend Mastery',
        duration: '4 months',
        skills: ['React/Vue.js', 'TypeScript', 'State Management', 'Testing'],
        projects: ['E-commerce Frontend', 'Social Media Dashboard', 'Progressive Web App'],
        completed: false
      },
      {
        phase: 'Backend Development',
        duration: '4 months',
        skills: ['Node.js/Python', 'Databases', 'APIs', 'Authentication'],
        projects: ['REST API', 'Real-time Chat App', 'Microservices'],
        completed: false
      },
      {
        phase: 'Full-Stack Integration',
        duration: '3 months',
        skills: ['DevOps', 'Cloud Deployment', 'Performance Optimization', 'Security'],
        projects: ['Complete Web Application', 'Portfolio Showcase', 'Open Source Contribution'],
        completed: false
      }
    ]
  },
  dataScientist: {
    title: 'Data Scientist & AI Specialist',
    duration: '15-20 months',
    steps: [
      {
        phase: 'Mathematical Foundation',
        duration: '4 months',
        skills: ['Statistics', 'Linear Algebra', 'Calculus', 'Python/R'],
        projects: ['Statistical Analysis', 'Data Visualization', 'Hypothesis Testing'],
        completed: false
      },
      {
        phase: 'Machine Learning',
        duration: '5 months',
        skills: ['Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation'],
        projects: ['Prediction Models', 'Recommendation System', 'Classification Projects'],
        completed: false
      },
      {
        phase: 'Deep Learning & AI',
        duration: '6 months',
        skills: ['Neural Networks', 'Computer Vision', 'NLP', 'Reinforcement Learning'],
        projects: ['Image Recognition', 'Chatbot', 'Game AI', 'Language Model'],
        completed: false
      },
      {
        phase: 'Production & Deployment',
        duration: '3 months',
        skills: ['MLOps', 'Model Deployment', 'Monitoring', 'Scaling'],
        projects: ['Production ML Pipeline', 'AI API Service', 'Data Dashboard'],
        completed: false
      }
    ]
  }
}

const techSubcategories = [
  {
    id: 'web-development',
    name: 'Web Development',
    icon: <Globe className="w-6 h-6" />,
    description: 'Frontend, backend, and full-stack web development',
    skillCount: 120,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'React.js', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express.js',
      'Django', 'Flask', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Spring Boot',
      'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'Tailwind CSS',
      'Bootstrap', 'jQuery', 'PHP', 'Python', 'Java', 'C#', 'Go', 'Rust'
    ]
  },
  {
    id: 'mobile-development',
    name: 'Mobile App Development',
    icon: <Smartphone className="w-6 h-6" />,
    description: 'iOS, Android, and cross-platform mobile apps',
    skillCount: 85,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'React Native', 'Flutter', 'Swift', 'Kotlin', 'Java', 'Dart',
      'Xamarin', 'Ionic', 'Cordova', 'Unity', 'Unreal Engine',
      'iOS Development', 'Android Development', 'Cross-platform Development',
      'Mobile UI/UX', 'App Store Optimization', 'Firebase', 'SQLite'
    ]
  },
  {
    id: 'data-science-ai',
    name: 'Data Science & AI',
    icon: <Brain className="w-6 h-6" />,
    description: 'Machine learning, data analysis, and artificial intelligence',
    skillCount: 95,
    color: 'bg-purple-500',
    trending: true,
    skills: [
      'Python', 'R', 'Machine Learning', 'Deep Learning', 'Neural Networks',
      'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy',
      'Data Visualization', 'Tableau', 'Power BI', 'D3.js', 'Matplotlib',
      'Statistics', 'SQL', 'NoSQL', 'Big Data', 'Spark', 'Hadoop',
      'Natural Language Processing', 'Computer Vision', 'Reinforcement Learning'
    ]
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: <Cloud className="w-6 h-6" />,
    description: 'AWS, Azure, Google Cloud, and cloud architecture',
    skillCount: 70,
    color: 'bg-cyan-500',
    trending: true,
    skills: [
      'Amazon Web Services (AWS)', 'Microsoft Azure', 'Google Cloud Platform',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins',
      'Cloud Architecture', 'Serverless Computing', 'Lambda Functions',
      'Cloud Security', 'Cloud Storage', 'CDN', 'Load Balancing',
      'Microservices', 'API Gateway', 'Container Orchestration'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    icon: <Shield className="w-6 h-6" />,
    description: 'Information security, ethical hacking, and protection',
    skillCount: 65,
    color: 'bg-red-500',
    trending: true,
    skills: [
      'Ethical Hacking', 'Penetration Testing', 'Network Security',
      'Web Application Security', 'Cryptography', 'Security Auditing',
      'Incident Response', 'Malware Analysis', 'Digital Forensics',
      'Security Compliance', 'Risk Assessment', 'Vulnerability Assessment',
      'CISSP', 'CEH', 'OSCP', 'Security+', 'Wireshark', 'Metasploit'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Infrastructure',
    icon: <Laptop className="w-6 h-6" />,
    description: 'CI/CD, automation, and infrastructure management',
    skillCount: 55,
    color: 'bg-orange-500',
    trending: false,
    skills: [
      'CI/CD Pipelines', 'Git', 'GitHub Actions', 'GitLab CI', 'Jenkins',
      'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet',
      'Monitoring & Logging', 'Prometheus', 'Grafana', 'ELK Stack',
      'Linux Administration', 'Shell Scripting', 'Infrastructure as Code',
      'Configuration Management', 'Container Security'
    ]
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: <Gamepad2 className="w-6 h-6" />,
    description: '2D/3D games, game engines, and interactive experiences',
    skillCount: 45,
    color: 'bg-pink-500',
    trending: false,
    skills: [
      'Unity', 'Unreal Engine', 'Godot', 'C#', 'C++', 'JavaScript',
      'Game Design', 'Level Design', 'Character Design', '3D Modeling',
      'Animation', 'Shader Programming', 'Physics Programming',
      'Mobile Game Development', 'VR Game Development', 'AR Game Development',
      'Game Testing', 'Game Optimization', 'Multiplayer Programming'
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Crypto',
    icon: <Database className="w-6 h-6" />,
    description: 'Cryptocurrency, smart contracts, and DeFi',
    skillCount: 35,
    color: 'bg-yellow-500',
    trending: true,
    skills: [
      'Blockchain Development', 'Smart Contracts', 'Solidity', 'Ethereum',
      'Bitcoin', 'DeFi', 'NFTs', 'Web3', 'Cryptocurrency Trading',
      'Blockchain Security', 'Consensus Algorithms', 'Cryptography',
      'Hyperledger', 'Polkadot', 'Cardano', 'Binance Smart Chain',
      'MetaMask Integration', 'Decentralized Applications (DApps)'
    ]
  }
]

const featuredTechSkills = [
  {
    id: 1,
    title: 'Complete React Developer Course',
    subcategory: 'Web Development',
    level: 'Beginner to Advanced',
    rating: 4.9,
    students: 12000,
    duration: '12 weeks',
    price: 129,
    instructor: 'Sarah Johnson',
    description: 'Master React from basics to advanced concepts including hooks, context, and testing',
    thumbnail: '/skills/react.jpg',
    trending: true,
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-15',
    roadmap: [
      'JavaScript ES6+ Fundamentals',
      'React Basics & JSX',
      'Components & Props',
      'State & Event Handling',
      'React Hooks',
      'Context API',
      'React Router',
      'Testing with Jest',
      'Performance Optimization',
      'Real-world Projects'
    ]
  },
  {
    id: 2,
    title: 'Python Machine Learning Bootcamp',
    subcategory: 'Data Science & AI',
    level: 'Intermediate',
    rating: 4.8,
    students: 8500,
    duration: '16 weeks',
    price: 199,
    instructor: 'Dr. Michael Chen',
    description: 'Comprehensive machine learning with Python, scikit-learn, and TensorFlow',
    thumbnail: '/skills/ml-python.jpg',
    trending: true,
    difficulty: 'Advanced',
    lastUpdated: '2024-01-10',
    roadmap: [
      'Python Programming Basics',
      'NumPy & Pandas',
      'Data Visualization',
      'Statistics Fundamentals',
      'Supervised Learning',
      'Unsupervised Learning',
      'Deep Learning Basics',
      'TensorFlow & Keras',
      'Model Deployment',
      'MLOps Basics'
    ]
  },
  {
    id: 3,
    title: 'AWS Cloud Practitioner',
    subcategory: 'Cloud Computing',
    level: 'Beginner',
    rating: 4.7,
    students: 6800,
    duration: '8 weeks',
    price: 89,
    instructor: 'Alex Rodriguez',
    description: 'Get AWS certified and learn cloud fundamentals',
    thumbnail: '/skills/aws.jpg',
    trending: true,
    difficulty: 'Beginner',
    lastUpdated: '2024-01-20',
    roadmap: [
      'Cloud Computing Basics',
      'AWS Core Services',
      'EC2 & Storage',
      'Networking & Security',
      'Databases on AWS',
      'Monitoring & Scaling',
      'Cost Management',
      'Exam Preparation'
    ]
  },
  {
    id: 4,
    title: 'Flutter Mobile Development',
    subcategory: 'Mobile Development',
    level: 'Intermediate',
    rating: 4.6,
    students: 4200,
    duration: '10 weeks',
    price: 119,
    instructor: 'Jennifer Liu',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart',
    thumbnail: '/skills/flutter.jpg',
    trending: true,
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-12',
    roadmap: [
      'Dart Programming Language',
      'Flutter Basics',
      'Widgets & Layouts',
      'Navigation & Routing',
      'State Management',
      'API Integration',
      'Local Storage',
      'App Deployment',
      'Performance Optimization',
      'Testing'
    ]
  },
  {
    id: 5,
    title: 'Ethical Hacking & Penetration Testing',
    subcategory: 'Cybersecurity',
    level: 'Advanced',
    rating: 4.8,
    students: 3500,
    duration: '14 weeks',
    price: 249,
    instructor: 'David Kumar',
    description: 'Learn ethical hacking techniques and penetration testing methodologies',
    thumbnail: '/skills/ethical-hacking.jpg',
    trending: true,
    difficulty: 'Advanced',
    lastUpdated: '2024-01-08',
    roadmap: [
      'Cybersecurity Fundamentals',
      'Network Security',
      'Vulnerability Assessment',
      'Penetration Testing Methodology',
      'Web Application Security',
      'Wireless Security',
      'Social Engineering',
      'Malware Analysis',
      'Incident Response',
      'Certification Prep (CEH)'
    ]
  },
  {
    id: 6,
    title: 'DevOps with Docker & Kubernetes',
    subcategory: 'DevOps & Infrastructure',
    level: 'Intermediate',
    rating: 4.7,
    students: 5100,
    duration: '12 weeks',
    price: 159,
    instructor: 'Robert Wilson',
    description: 'Master containerization and orchestration for modern applications',
    thumbnail: '/skills/devops.jpg',
    trending: false,
    difficulty: 'Intermediate',
    lastUpdated: '2024-01-05',
    roadmap: [
      'Linux Fundamentals',
      'Docker Basics',
      'Container Management',
      'Kubernetes Fundamentals',
      'Pod & Service Management',
      'Deployments & ConfigMaps',
      'Monitoring & Logging',
      'CI/CD with Jenkins',
      'Security Best Practices',
      'Production Deployment'
    ]
  }
]

export default function TechnologyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showAllSkills, setShowAllSkills] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('webDeveloper')
  const [roadmapProgress, setRoadmapProgress] = useState(0)

  const filteredSkills = featuredTechSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubcategory = selectedSubcategory === 'all' ||
                              skill.subcategory.toLowerCase().includes(selectedSubcategory.toLowerCase())
    return matchesSearch && matchesSubcategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-cyan-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl mb-6">
              <Code className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Technology & Programming
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Master the digital future with cutting-edge technology skills. From web development to AI,
              learn from industry experts and build the skills that matter.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search technology skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Tech Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-blue-600">850+</div>
                <div className="text-sm text-muted-foreground">Tech Skills</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-green-600">8k+</div>
                <div className="text-sm text-muted-foreground">Tech Learners</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-purple-600">200+</div>
                <div className="text-sm text-muted-foreground">Expert Instructors</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-muted-foreground">Job Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Subcategories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technology Specializations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore specialized areas in technology and programming
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techSubcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/explore/technology/${subcategory.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-background/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 ${subcategory.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {subcategory.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
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
                        {subcategory.skillCount} skills
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>

                    {/* Popular Skills Preview */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-medium text-foreground mb-2">Popular Skills:</h4>
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

      {/* Featured Tech Skills */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Technology Skills
              </h2>
              <p className="text-xl text-muted-foreground">
                Master the most in-demand tech skills with expert-led courses
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
                {techSubcategories.map(sub => (
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
            {filteredSkills.map((skill) => (
              <Link key={skill.id} href={`/skills/${skill.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-0 bg-background">
                  {/* Skill Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4 flex gap-2">
                      {skill.trending && (
                        <Badge className="bg-red-500 text-white">
                          🔥 Trending
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {skill.level}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        {skill.subcategory}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{skill.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{skill.difficulty}</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                      {skill.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {skill.instructor[0]}
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.instructor}</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{skill.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{skill.duration}</span>
                      </div>
                    </div>

                    {/* Learning Path Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Learning Roadmap:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.roadmap.slice(0, 3).map((step, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                        <Badge variant="secondary" className="text-xs">
                          +{skill.roadmap.length - 3} more steps
                        </Badge>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex justify-between items-center pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">${skill.price}</span>
                      </div>
                      <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
                        <Calendar className="w-4 h-4 mr-1" />
                        Join Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Explore All Technology Skills
            </Button>
          </div>
        </div>
      </section>

      {/* All Tech Skills List */}
      {showAllSkills && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Complete Technology Skills Library
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {techSubcategories.map((subcategory) => (
                <Card key={subcategory.id} className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    {subcategory.icon}
                    {subcategory.name}
                  </h3>
                  <div className="space-y-1">
                    {subcategory.skills.map((skill, idx) => (
                      <Link key={idx} href={`/skills/search?q=${encodeURIComponent(skill)}`}>
                        <div className="text-sm text-muted-foreground hover:text-blue-600 cursor-pointer transition-colors">
                          {skill}
                        </div>
                      </Link>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Show All Skills Button */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={() => setShowAllSkills(!showAllSkills)}
            className="px-8"
          >
            {showAllSkills ? 'Hide' : 'Show'} All Technology Skills
          </Button>
        </div>
      </section>

      {/* Comprehensive Learning Tabs */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Technology Learning System
            </h2>
            <p className="text-xl text-muted-foreground">
              From beginner to expert - everything you need to master technology
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
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
                {techSubcategories.map((subcategory) => (
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
                        <span className="text-sm text-muted-foreground">{subcategory.skillCount} skills</span>
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
                {Object.entries(learningPaths).map(([level, path]) => (
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
                  <h3 className="text-xl font-bold">Choose Your Path</h3>
                  {Object.entries(interactiveRoadmaps).map(([key, roadmap]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedRoadmap === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
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
                        {interactiveRoadmaps[selectedRoadmap as keyof typeof interactiveRoadmaps].title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Complete roadmap to become a professional {interactiveRoadmaps[selectedRoadmap as keyof typeof interactiveRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {interactiveRoadmaps[selectedRoadmap as keyof typeof interactiveRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < interactiveRoadmaps[selectedRoadmap as keyof typeof interactiveRoadmaps].steps.length - 1 && (
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
                                  <h5 className="font-medium text-sm mb-2">Skills to Learn:</h5>
                                  <div className="flex flex-wrap gap-1">
                                    {step.skills.map((skill, skillIdx) => (
                                      <Badge key={skillIdx} variant="secondary" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm mb-2">Projects:</h5>
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
                {Object.entries(techEncyclopedia).map(([category, section]) => (
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
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-blue-600">Why Important:</span>
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

            {/* Video/Audio Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Learning Sessions
                    </CardTitle>
                    <CardDescription>
                      Join real-time video sessions with instructors and peers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'React Advanced Patterns',
                        instructor: 'Sarah Johnson',
                        time: 'Today 3:00 PM',
                        participants: 24,
                        type: 'Workshop'
                      },
                      {
                        title: 'Python Machine Learning Q&A',
                        instructor: 'Dr. Michael Chen',
                        time: 'Tomorrow 2:00 PM',
                        participants: 18,
                        type: 'Q&A Session'
                      },
                      {
                        title: 'System Design Interview Prep',
                        instructor: 'Alex Rodriguez',
                        time: 'Wed 4:00 PM',
                        participants: 12,
                        type: 'Study Group'
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
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Meeting */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Your Session
                    </CardTitle>
                    <CardDescription>
                      Create your own learning or teaching session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Video className="w-6 h-6" />
                        <span className="text-sm">Video Meeting</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <Mic className="w-6 h-6" />
                        <span className="text-sm">Audio Only</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Quick Start Options:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Briefcase className="w-4 h-4 mr-2" />
                          Study Group Session
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Code Review Meeting
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Target className="w-4 h-4 mr-2" />
                          Interview Practice
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="w-4 h-4 mr-2" />
                          Problem Solving Session
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Meeting Features:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Screen Sharing
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Code Editor
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Whiteboard
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

              {/* Meeting Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-muted-foreground">Sessions Attended</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">156</div>
                      <div className="text-sm text-muted-foreground">Learning Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">8</div>
                      <div className="text-sm text-muted-foreground">Skills Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <div className="text-sm text-muted-foreground">Certificates Earned</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Graphical Illustrations Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Learning Visualizations
            </h2>
            <p className="text-xl text-muted-foreground">
              Learn complex concepts through interactive diagrams and visual guides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Algorithm Visualization */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Algorithm Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Code className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive sorting animations</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bubble Sort</span>
                    <span className="text-blue-600">Interactive Demo</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quick Sort</span>
                    <span className="text-green-600">Step-by-step</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Merge Sort</span>
                    <span className="text-purple-600">Visualization</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-blue-600">
                  <Play className="w-4 h-4 mr-2" />
                  Try Interactive Demo
                </Button>
              </CardContent>
            </Card>

            {/* System Architecture */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">3D system diagrams</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Microservices</span>
                    <span className="text-blue-600">3D Model</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Database Design</span>
                    <span className="text-green-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cloud Architecture</span>
                    <span className="text-purple-600">Animated</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Explore Architecture
                </Button>
              </CardContent>
            </Card>

            {/* AI/ML Concepts */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI/ML Concepts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Neural network playground</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Neural Networks</span>
                    <span className="text-blue-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Decision Trees</span>
                    <span className="text-green-600">Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Deep Learning</span>
                    <span className="text-purple-600">Animated</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-purple-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Train Your Model
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
            Ready to Code Your Future?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the next generation of developers and tech professionals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3">
              <Link href="/auth/register">Start Learning Tech</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link href="/dashboard/meetings">Join Study Group</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}