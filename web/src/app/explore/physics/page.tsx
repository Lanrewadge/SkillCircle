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
  Atom,
  Zap,
  Orbit,
  Waves,
  Magnet,
  Eye,
  Thermometer,
  Radio,
  Telescope,
  Microscope,
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
  Calculator,
  Beaker,
  Lightbulb,
  Globe,
  Rocket,
  Cpu,
  Battery,
  Sun
} from 'lucide-react'

// Physics Learning Paths (Beginner to Advanced)
const physicsLearningPaths = {
  beginner: {
    title: 'Physics Fundamentals',
    duration: '4-6 months',
    courses: [
      {
        title: 'Classical Mechanics Basics',
        topics: ['Motion & Kinematics', 'Forces & Newton\'s Laws', 'Energy & Work', 'Momentum & Collisions'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Electricity & Magnetism Intro',
        topics: ['Electric Charges', 'Electric Fields', 'Magnetic Fields', 'Simple Circuits'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Waves & Sound Physics',
        topics: ['Wave Properties', 'Sound Waves', 'Light Waves', 'Wave Interference'],
        duration: '5 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Advanced Physics',
    duration: '8-12 months',
    courses: [
      {
        title: 'Quantum Mechanics Foundation',
        topics: ['Wave-Particle Duality', 'Uncertainty Principle', 'Schrödinger Equation', 'Quantum States'],
        duration: '12 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Thermodynamics & Statistical Mechanics',
        topics: ['Laws of Thermodynamics', 'Heat Engines', 'Entropy', 'Statistical Distributions'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Electromagnetism & Maxwell\'s Equations',
        topics: ['Electric Potential', 'Magnetic Induction', 'Maxwell\'s Equations', 'Electromagnetic Waves'],
        duration: '14 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Theoretical Physics',
    duration: '12-18 months',
    courses: [
      {
        title: 'Relativity Theory',
        topics: ['Special Relativity', 'General Relativity', 'Spacetime Geometry', 'Gravitational Waves'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Particle Physics & Cosmology',
        topics: ['Standard Model', 'Particle Accelerators', 'Big Bang Theory', 'Dark Matter & Energy'],
        duration: '18 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Condensed Matter Physics',
        topics: ['Crystal Structure', 'Electronic Properties', 'Superconductivity', 'Nanotechnology'],
        duration: '14 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Physics Encyclopedia
const physicsEncyclopedia = {
  fundamentals: {
    title: 'Physics Fundamentals',
    topics: [
      {
        name: 'Classical Mechanics',
        description: 'Study of motion, forces, energy, and momentum in macroscopic systems',
        importance: 'Foundation for understanding physical motion and engineering applications',
        applications: ['Engineering design', 'Aerospace systems', 'Mechanical systems']
      },
      {
        name: 'Electromagnetism',
        description: 'Study of electric and magnetic fields and their interactions',
        importance: 'Basis for modern electronics and technology',
        applications: ['Electronics', 'Power generation', 'Communication systems']
      },
      {
        name: 'Thermodynamics',
        description: 'Study of heat, temperature, energy transfer, and entropy',
        importance: 'Understanding energy efficiency and thermal systems',
        applications: ['Engine design', 'Refrigeration', 'Climate science']
      }
    ]
  },
  modern: {
    title: 'Modern Physics',
    topics: [
      {
        name: 'Quantum Mechanics',
        description: 'Study of matter and energy at atomic and subatomic scales',
        importance: 'Foundation for modern technology and materials science',
        applications: ['Computer chips', 'Lasers', 'Medical imaging']
      },
      {
        name: 'Relativity',
        description: 'Einstein\'s theories of special and general relativity',
        importance: 'Understanding space, time, and gravity at cosmic scales',
        applications: ['GPS systems', 'Particle accelerators', 'Astronomy']
      },
      {
        name: 'Particle Physics',
        description: 'Study of fundamental particles and their interactions',
        importance: 'Understanding the basic building blocks of matter',
        applications: ['Medical treatments', 'Nuclear energy', 'Materials research']
      }
    ]
  }
}

// Physics Career Roadmaps
const physicsRoadmaps = {
  physicist: {
    title: 'Research Physicist',
    duration: '15-20 months',
    steps: [
      {
        phase: 'Mathematical Foundation',
        duration: '4 months',
        skills: ['Calculus', 'Linear Algebra', 'Differential Equations', 'Mathematical Physics'],
        projects: ['Mathematical Problem Sets', 'Physics Simulations', 'Data Analysis'],
        completed: false
      },
      {
        phase: 'Experimental Physics',
        duration: '6 months',
        skills: ['Laboratory Techniques', 'Data Collection', 'Error Analysis', 'Instrumentation'],
        projects: ['Lab Experiments', 'Measurement Projects', 'Equipment Calibration'],
        completed: false
      },
      {
        phase: 'Theoretical Mastery',
        duration: '6 months',
        skills: ['Advanced Theory', 'Computational Physics', 'Modeling', 'Simulation'],
        projects: ['Theoretical Models', 'Computer Simulations', 'Research Papers'],
        completed: false
      },
      {
        phase: 'Research Specialization',
        duration: '4 months',
        skills: ['Research Methods', 'Peer Review', 'Grant Writing', 'Scientific Communication'],
        projects: ['Original Research', 'Publication', 'Conference Presentation'],
        completed: false
      }
    ]
  },
  engineer: {
    title: 'Physics Engineer',
    duration: '12-15 months',
    steps: [
      {
        phase: 'Applied Physics',
        duration: '3 months',
        skills: ['Engineering Physics', 'Materials Science', 'Systems Analysis', 'Design Principles'],
        projects: ['Design Projects', 'Material Testing', 'System Optimization'],
        completed: false
      },
      {
        phase: 'Technology Development',
        duration: '5 months',
        skills: ['Product Development', 'Prototyping', 'Testing & Validation', 'Quality Control'],
        projects: ['Prototype Development', 'Performance Testing', 'Design Validation'],
        completed: false
      },
      {
        phase: 'Industry Application',
        duration: '4 months',
        skills: ['Industry Standards', 'Project Management', 'Cost Analysis', 'Manufacturing'],
        projects: ['Industrial Projects', 'Cost Optimization', 'Production Planning'],
        completed: false
      }
    ]
  }
}

const physicsSubcategories = [
  {
    id: 'classical-mechanics',
    name: 'Classical Mechanics',
    icon: <Orbit className="w-6 h-6" />,
    description: 'Motion, forces, energy, and momentum in macroscopic systems',
    skillCount: 85,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Kinematics', 'Dynamics', 'Newton\'s Laws', 'Energy Conservation',
      'Momentum', 'Rotational Motion', 'Oscillations', 'Gravitation',
      'Fluid Mechanics', 'Statics', 'Lagrangian Mechanics', 'Hamiltonian Mechanics'
    ]
  },
  {
    id: 'electromagnetism',
    name: 'Electromagnetism',
    icon: <Zap className="w-6 h-6" />,
    description: 'Electric and magnetic fields, circuits, and electromagnetic waves',
    skillCount: 95,
    color: 'bg-yellow-500',
    trending: true,
    skills: [
      'Electric Fields', 'Magnetic Fields', 'Gauss\'s Law', 'Ampère\'s Law',
      'Faraday\'s Law', 'Maxwell\'s Equations', 'Electromagnetic Waves', 'AC/DC Circuits',
      'Capacitors', 'Inductors', 'Transformers', 'Electromagnetic Induction'
    ]
  },
  {
    id: 'quantum-physics',
    name: 'Quantum Physics',
    icon: <Atom className="w-6 h-6" />,
    description: 'Quantum mechanics, atomic structure, and subatomic particles',
    skillCount: 120,
    color: 'bg-purple-500',
    trending: true,
    skills: [
      'Wave-Particle Duality', 'Uncertainty Principle', 'Schrödinger Equation', 'Quantum States',
      'Atomic Structure', 'Electron Orbitals', 'Quantum Tunneling', 'Entanglement',
      'Particle Physics', 'Standard Model', 'Quantum Field Theory', 'Quantum Computing'
    ]
  },
  {
    id: 'thermodynamics',
    name: 'Thermodynamics',
    icon: <Thermometer className="w-6 h-6" />,
    description: 'Heat, temperature, energy transfer, and statistical mechanics',
    skillCount: 65,
    color: 'bg-red-500',
    trending: false,
    skills: [
      'Laws of Thermodynamics', 'Heat Transfer', 'Entropy', 'Temperature Scales',
      'Heat Engines', 'Refrigeration', 'Phase Transitions', 'Statistical Mechanics',
      'Kinetic Theory', 'Thermal Equilibrium', 'Carnot Cycle', 'Gibbs Free Energy'
    ]
  },
  {
    id: 'optics',
    name: 'Optics & Photonics',
    icon: <Eye className="w-6 h-6" />,
    description: 'Light, lasers, optical instruments, and photonic devices',
    skillCount: 70,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'Geometric Optics', 'Wave Optics', 'Interference', 'Diffraction',
      'Polarization', 'Lasers', 'Fiber Optics', 'Optical Instruments',
      'Spectroscopy', 'Holography', 'Photonic Crystals', 'Nonlinear Optics'
    ]
  },
  {
    id: 'waves',
    name: 'Waves & Acoustics',
    icon: <Waves className="w-6 h-6" />,
    description: 'Wave phenomena, sound, vibrations, and acoustic systems',
    skillCount: 55,
    color: 'bg-cyan-500',
    trending: false,
    skills: [
      'Wave Properties', 'Sound Waves', 'Acoustic Resonance', 'Doppler Effect',
      'Wave Interference', 'Standing Waves', 'Musical Acoustics', 'Ultrasound',
      'Seismic Waves', 'Wave Propagation', 'Acoustic Design', 'Noise Control'
    ]
  },
  {
    id: 'relativity',
    name: 'Relativity & Cosmology',
    icon: <Rocket className="w-6 h-6" />,
    description: 'Einstein\'s relativity, spacetime, and cosmic phenomena',
    skillCount: 45,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Special Relativity', 'General Relativity', 'Spacetime', 'Time Dilation',
      'Length Contraction', 'Gravitational Waves', 'Black Holes', 'Big Bang Theory',
      'Cosmic Microwave Background', 'Dark Matter', 'Dark Energy', 'Cosmological Models'
    ]
  },
  {
    id: 'computational-physics',
    name: 'Computational Physics',
    icon: <Cpu className="w-6 h-6" />,
    description: 'Numerical methods, simulations, and computational modeling',
    skillCount: 80,
    color: 'bg-orange-500',
    trending: true,
    skills: [
      'Numerical Methods', 'Monte Carlo Simulations', 'Finite Element Analysis', 'Molecular Dynamics',
      'Computational Fluid Dynamics', 'Quantum Simulations', 'Data Analysis', 'Scientific Computing',
      'Programming for Physics', 'Visualization', 'High-Performance Computing', 'Machine Learning in Physics'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Quantum Mechanics Fundamentals',
    instructor: 'Dr. Sarah Chen',
    rating: 4.9,
    reviews: 8432,
    price: 159.99,
    originalPrice: 299.99,
    duration: '25 hours',
    students: '15,000+',
    level: 'Intermediate',
    category: 'Quantum Physics',
    trending: true,
    skills: ['Wave Functions', 'Uncertainty Principle', 'Quantum States', 'Schrödinger Equation'],
    description: 'Master the fundamental principles of quantum mechanics with interactive simulations.',
    certification: 'Quantum Physics Certificate'
  },
  {
    id: 2,
    title: 'Classical Mechanics & Dynamics',
    instructor: 'Prof. Michael Rodriguez',
    rating: 4.8,
    reviews: 6789,
    price: 129.99,
    originalPrice: 249.99,
    duration: '30 hours',
    students: '22,000+',
    level: 'Beginner',
    category: 'Classical Mechanics',
    trending: true,
    skills: ['Newton\'s Laws', 'Energy Conservation', 'Momentum', 'Rotational Motion'],
    description: 'Comprehensive introduction to classical mechanics with practical applications.',
    certification: 'Classical Physics Certificate'
  },
  {
    id: 3,
    title: 'Electromagnetism & Maxwell\'s Equations',
    instructor: 'Dr. Emily Johnson',
    rating: 4.7,
    reviews: 5234,
    price: 179.99,
    originalPrice: 349.99,
    duration: '35 hours',
    students: '18,000+',
    level: 'Advanced',
    category: 'Electromagnetism',
    trending: true,
    skills: ['Electric Fields', 'Magnetic Fields', 'Maxwell\'s Equations', 'EM Waves'],
    description: 'Advanced course on electromagnetic theory and its applications.',
    certification: 'Electromagnetism Certificate'
  },
  {
    id: 4,
    title: 'Computational Physics with Python',
    instructor: 'Dr. Alex Kim',
    rating: 4.8,
    reviews: 7123,
    price: 149.99,
    originalPrice: 289.99,
    duration: '40 hours',
    students: '12,000+',
    level: 'Intermediate',
    category: 'Computational Physics',
    trending: true,
    skills: ['Numerical Methods', 'Python Programming', 'Simulations', 'Data Analysis'],
    description: 'Learn to solve physics problems using computational methods and Python.',
    certification: 'Computational Physics Certificate'
  },
  {
    id: 5,
    title: 'Optics & Laser Physics',
    instructor: 'Prof. Rachel Williams',
    rating: 4.6,
    reviews: 4567,
    price: 139.99,
    originalPrice: 279.99,
    duration: '28 hours',
    students: '9,500+',
    level: 'Intermediate',
    category: 'Optics',
    trending: false,
    skills: ['Geometric Optics', 'Wave Optics', 'Laser Principles', 'Optical Instruments'],
    description: 'Comprehensive course on optics, photonics, and laser technology.',
    certification: 'Optics Certificate'
  },
  {
    id: 6,
    title: 'Einstein\'s Relativity Theory',
    instructor: 'Dr. David Thompson',
    rating: 4.9,
    reviews: 3456,
    price: 189.99,
    originalPrice: 379.99,
    duration: '32 hours',
    students: '7,800+',
    level: 'Advanced',
    category: 'Relativity',
    trending: true,
    skills: ['Special Relativity', 'General Relativity', 'Spacetime', 'Gravitational Waves'],
    description: 'Deep dive into Einstein\'s theories of relativity and their implications.',
    certification: 'Relativity Physics Certificate'
  }
]

export default function PhysicsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('physicist')
  const [roadmapProgress, setRoadmapProgress] = useState(40)

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedSubcategory === 'all' ||
                          course.category.toLowerCase() === selectedSubcategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Atom className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Physics & Physical Sciences
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore the fundamental laws of nature from quantum mechanics to relativity.
              Master physics through interactive simulations and cutting-edge research.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search physics courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Physics Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-blue-600">520+</div>
                <div className="text-sm text-muted-foreground">Physics Courses</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-purple-600">45K+</div>
                <div className="text-sm text-muted-foreground">Physics Students</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-indigo-600">150+</div>
                <div className="text-sm text-muted-foreground">PhD Instructors</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-green-600">96%</div>
                <div className="text-sm text-muted-foreground">Research Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physics Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Physics Specializations
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover specialized areas in physics and physical sciences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {physicsSubcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/explore/physics/${subcategory.id}`}>
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
                        {subcategory.skillCount} topics
                      </span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
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

      {/* Featured Physics Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Physics Courses
              </h2>
              <p className="text-xl text-muted-foreground">
                Master physics with courses from world-renowned physicists
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
                {physicsSubcategories.map(sub => (
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
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 overflow-hidden">
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
                      <Badge className="bg-blue-600 text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Atom className="w-16 h-16 text-white/50" />
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
                      <Button size="sm" className="group-hover:bg-blue-600 transition-colors">
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

      {/* Comprehensive Physics Learning System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Physics Learning Ecosystem
            </h2>
            <p className="text-xl text-muted-foreground">
              From classical mechanics to quantum theory - master every branch of physics
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Atom className="w-4 h-4" />
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
                <Calculator className="w-4 h-4" />
                Encyclopedia
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Labs
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {physicsSubcategories.map((subcategory) => (
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
                {Object.entries(physicsLearningPaths).map(([level, path]) => (
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
                  <h3 className="text-xl font-bold">Choose Your Physics Career Path</h3>
                  {Object.entries(physicsRoadmaps).map(([key, roadmap]) => (
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
                        {physicsRoadmaps[selectedRoadmap as keyof typeof physicsRoadmaps].title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Complete roadmap to become a professional {physicsRoadmaps[selectedRoadmap as keyof typeof physicsRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {physicsRoadmaps[selectedRoadmap as keyof typeof physicsRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < physicsRoadmaps[selectedRoadmap as keyof typeof physicsRoadmaps].steps.length - 1 && (
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
                {Object.entries(physicsEncyclopedia).map(([category, section]) => (
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

            {/* Physics Labs & Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Physics Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Physics Labs & Sessions
                    </CardTitle>
                    <CardDescription>
                      Join real-time physics experiments and discussions with experts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'Quantum Mechanics Lab Session',
                        instructor: 'Dr. Sarah Chen',
                        time: 'Today 2:00 PM',
                        participants: 35,
                        type: 'Virtual Lab'
                      },
                      {
                        title: 'Relativity Theory Discussion',
                        instructor: 'Dr. David Thompson',
                        time: 'Tomorrow 4:00 PM',
                        participants: 28,
                        type: 'Seminar'
                      },
                      {
                        title: 'Computational Physics Workshop',
                        instructor: 'Dr. Alex Kim',
                        time: 'Wed 3:00 PM',
                        participants: 42,
                        type: 'Workshop'
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
                            Join Lab
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Physics Session */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Physics Session
                    </CardTitle>
                    <CardDescription>
                      Create your own physics lab or study session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Beaker className="w-6 h-6" />
                        <span className="text-sm">Virtual Lab</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <Calculator className="w-6 h-6" />
                        <span className="text-sm">Problem Solving</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Physics Session Types:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Atom className="w-4 h-4 mr-2" />
                          Quantum Physics Study
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Telescope className="w-4 h-4 mr-2" />
                          Astrophysics Discussion
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Zap className="w-4 h-4 mr-2" />
                          Electromagnetism Lab
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Calculator className="w-4 h-4 mr-2" />
                          Physics Problem Solving
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Lab Tools Available:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Physics Simulations
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Equation Editor
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Graphing Tools
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Lab Recording
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Physics Learning Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Orbit className="w-5 h-5" />
                    Physics Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">16</div>
                      <div className="text-sm text-muted-foreground">Lab Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">124</div>
                      <div className="text-sm text-muted-foreground">Study Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">7</div>
                      <div className="text-sm text-muted-foreground">Physics Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-sm text-muted-foreground">Certificates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Physics Simulation Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Physics Simulations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore physics concepts through cutting-edge interactive simulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quantum Mechanics Simulator */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  Quantum Mechanics Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Orbit className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive quantum systems</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wave Functions</span>
                    <span className="text-purple-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Quantum Tunneling</span>
                    <span className="text-blue-600">3D Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Particle in a Box</span>
                    <span className="text-green-600">Simulation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-purple-600">
                  <Play className="w-4 h-4 mr-2" />
                  Explore Quantum World
                </Button>
              </CardContent>
            </Card>

            {/* Electromagnetic Field Visualizer */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  EM Field Visualizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Magnet className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">3D field visualization</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Electric Fields</span>
                    <span className="text-yellow-600">3D Model</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Magnetic Fields</span>
                    <span className="text-orange-600">Vector Field</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>EM Waves</span>
                    <span className="text-red-600">Animation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-yellow-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Visualize Fields
                </Button>
              </CardContent>
            </Card>

            {/* Relativity Explorer */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Relativity Explorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Globe className="w-12 h-12 text-indigo-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Spacetime visualization</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Dilation</span>
                    <span className="text-indigo-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Spacetime Curvature</span>
                    <span className="text-purple-600">3D Model</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Black Holes</span>
                    <span className="text-blue-600">Simulation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-indigo-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Explore Relativity
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
            Ready to Unlock the Secrets of the Universe?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join the next generation of physicists and researchers exploring the fundamental laws of nature
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3">
              <Link href="/auth/register">Start Physics Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link href="/dashboard/meetings">Join Physics Lab</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}