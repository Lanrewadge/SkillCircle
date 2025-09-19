'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  Filter
} from 'lucide-react'

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