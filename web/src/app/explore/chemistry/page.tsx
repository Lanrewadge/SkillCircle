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
  Beaker,
  Atom,
  Zap,
  Flame,
  Droplets,
  TestTube,
  FlaskConical,
  Microscope,
  Thermometer,
  Scale,
  Pipette,
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
  Orbit,
  Binary,
  Brain,
  Lightbulb,
  Factory,
  Leaf,
  Sun
} from 'lucide-react'

// Chemistry Learning Paths (Beginner to Advanced)
const chemistryLearningPaths = {
  beginner: {
    title: 'Chemistry Fundamentals',
    duration: '4-6 months',
    courses: [
      {
        title: 'Atomic Structure & Periodic Table',
        topics: ['Atomic Theory', 'Electron Configuration', 'Periodic Trends', 'Chemical Bonding'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Chemical Reactions & Stoichiometry',
        topics: ['Chemical Equations', 'Mole Concept', 'Reaction Types', 'Stoichiometric Calculations'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'States of Matter & Solutions',
        topics: ['Gas Laws', 'Liquids & Solids', 'Phase Changes', 'Solution Chemistry'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Advanced Chemistry',
    duration: '8-12 months',
    courses: [
      {
        title: 'Thermodynamics & Kinetics',
        topics: ['Enthalpy', 'Entropy', 'Gibbs Free Energy', 'Reaction Rates', 'Catalysis'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Chemical Equilibrium & Acids/Bases',
        topics: ['Equilibrium Constants', 'Le Chatelier\'s Principle', 'pH & pOH', 'Buffer Systems'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Electrochemistry & Redox',
        topics: ['Oxidation-Reduction', 'Galvanic Cells', 'Electrolysis', 'Electrode Potentials'],
        duration: '6 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Specialized Chemistry',
    duration: '12-18 months',
    courses: [
      {
        title: 'Organic Chemistry Mastery',
        topics: ['Functional Groups', 'Reaction Mechanisms', 'Stereochemistry', 'Spectroscopy'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Physical Chemistry',
        topics: ['Quantum Chemistry', 'Molecular Spectroscopy', 'Statistical Thermodynamics', 'Surface Chemistry'],
        duration: '14 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Analytical Chemistry',
        topics: ['Instrumental Analysis', 'Chromatography', 'Mass Spectrometry', 'Method Validation'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Chemistry Encyclopedia
const chemistryEncyclopedia = {
  fundamentals: {
    title: 'Chemical Fundamentals',
    topics: [
      {
        name: 'Atomic Structure',
        description: 'Protons, neutrons, electrons, and electron configuration',
        importance: 'Foundation for understanding chemical behavior and bonding',
        applications: ['Electronic devices', 'Nuclear medicine', 'Materials science']
      },
      {
        name: 'Chemical Bonding',
        description: 'Ionic, covalent, and metallic bonds that hold atoms together',
        importance: 'Explains molecular structure and chemical properties',
        applications: ['Drug design', 'Materials engineering', 'Catalysis']
      },
      {
        name: 'Thermodynamics',
        description: 'Energy changes in chemical reactions and processes',
        importance: 'Predicts reaction spontaneity and equilibrium',
        applications: ['Industrial processes', 'Energy storage', 'Environmental chemistry']
      }
    ]
  },
  specialized: {
    title: 'Specialized Chemistry',
    topics: [
      {
        name: 'Organic Chemistry',
        description: 'Chemistry of carbon-containing compounds',
        importance: 'Basis for pharmaceuticals, polymers, and biochemistry',
        applications: ['Drug development', 'Plastics', 'Biochemical processes']
      },
      {
        name: 'Analytical Chemistry',
        description: 'Methods for identifying and quantifying chemical components',
        importance: 'Quality control and research methodology',
        applications: ['Environmental monitoring', 'Food safety', 'Medical diagnostics']
      },
      {
        name: 'Green Chemistry',
        description: 'Environmentally sustainable chemical processes',
        importance: 'Reducing environmental impact of chemical industry',
        applications: ['Sustainable manufacturing', 'Renewable energy', 'Waste reduction']
      }
    ]
  }
}

// Chemistry Career Roadmaps
const chemistryRoadmaps = {
  chemist: {
    title: 'Research Chemist',
    duration: '18-24 months',
    steps: [
      {
        phase: 'Chemistry Foundation',
        duration: '6 months',
        skills: ['General Chemistry', 'Organic Chemistry', 'Physical Chemistry', 'Analytical Methods'],
        projects: ['Lab Experiments', 'Synthesis Projects', 'Analysis Reports'],
        completed: false
      },
      {
        phase: 'Specialized Training',
        duration: '8 months',
        skills: ['Instrumental Analysis', 'Spectroscopy', 'Chromatography', 'Research Methods'],
        projects: ['Research Project', 'Method Development', 'Data Analysis'],
        completed: false
      },
      {
        phase: 'Advanced Research',
        duration: '6 months',
        skills: ['Project Management', 'Literature Review', 'Publication Writing', 'Collaboration'],
        projects: ['Original Research', 'Scientific Papers', 'Conference Presentations'],
        completed: false
      },
      {
        phase: 'Professional Development',
        duration: '4 months',
        skills: ['Industry Knowledge', 'Regulatory Affairs', 'Quality Control', 'Leadership'],
        projects: ['Industry Projects', 'Professional Network', 'Career Planning'],
        completed: false
      }
    ]
  },
  pharmacist: {
    title: 'Pharmaceutical Chemist',
    duration: '20-24 months',
    steps: [
      {
        phase: 'Medicinal Chemistry',
        duration: '6 months',
        skills: ['Drug Design', 'Pharmacology', 'Toxicology', 'ADMET Properties'],
        projects: ['Drug Synthesis', 'Structure-Activity Studies', 'Pharmacokinetics'],
        completed: false
      },
      {
        phase: 'Pharmaceutical Development',
        duration: '8 months',
        skills: ['Formulation Science', 'Drug Delivery', 'Clinical Chemistry', 'Regulatory Science'],
        projects: ['Formulation Development', 'Bioavailability Studies', 'Regulatory Submissions'],
        completed: false
      },
      {
        phase: 'Quality & Manufacturing',
        duration: '6 months',
        skills: ['GMP Guidelines', 'Quality Control', 'Process Chemistry', 'Scale-up'],
        projects: ['Manufacturing Processes', 'Quality Systems', 'Process Optimization'],
        completed: false
      }
    ]
  }
}

const chemistrySubcategories = [
  {
    id: 'general-chemistry',
    name: 'General Chemistry',
    icon: <Beaker className="w-6 h-6" />,
    description: 'Fundamental principles of chemistry including atoms, molecules, and reactions',
    skillCount: 95,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Stoichiometry',
      'Gas Laws', 'Solutions', 'Acids & Bases', 'Thermodynamics',
      'Kinetics', 'Equilibrium', 'Electrochemistry', 'Nuclear Chemistry'
    ]
  },
  {
    id: 'organic-chemistry',
    name: 'Organic Chemistry',
    icon: <Atom className="w-6 h-6" />,
    description: 'Chemistry of carbon compounds, reactions, and synthesis',
    skillCount: 120,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'Functional Groups', 'Nomenclature', 'Stereochemistry', 'Reaction Mechanisms',
      'Substitution Reactions', 'Elimination Reactions', 'Addition Reactions', 'Rearrangements',
      'Aromatic Chemistry', 'Carbonyl Chemistry', 'Spectroscopy', 'Synthesis'
    ]
  },
  {
    id: 'inorganic-chemistry',
    name: 'Inorganic Chemistry',
    icon: <Grid3x3 className="w-6 h-6" />,
    description: 'Chemistry of elements, coordination compounds, and solid-state materials',
    skillCount: 85,
    color: 'bg-purple-500',
    trending: false,
    skills: [
      'Coordination Chemistry', 'Crystal Field Theory', 'Organometallics', 'Solid State',
      'Main Group Chemistry', 'Transition Metals', 'Bioinorganic Chemistry', 'Materials Chemistry',
      'Catalysis', 'Electronic Properties', 'Magnetic Properties', 'Nanomaterials'
    ]
  },
  {
    id: 'physical-chemistry',
    name: 'Physical Chemistry',
    icon: <Thermometer className="w-6 h-6" />,
    description: 'Quantitative study of chemical phenomena using physics principles',
    skillCount: 100,
    color: 'bg-red-500',
    trending: true,
    skills: [
      'Thermodynamics', 'Statistical Mechanics', 'Kinetics', 'Quantum Chemistry',
      'Spectroscopy', 'Electrochemistry', 'Surface Chemistry', 'Photochemistry',
      'Computational Chemistry', 'Molecular Dynamics', 'Phase Equilibria', 'Transport Properties'
    ]
  },
  {
    id: 'analytical-chemistry',
    name: 'Analytical Chemistry',
    icon: <Microscope className="w-6 h-6" />,
    description: 'Methods for identifying and quantifying chemical composition',
    skillCount: 110,
    color: 'bg-orange-500',
    trending: true,
    skills: [
      'Chromatography', 'Mass Spectrometry', 'NMR Spectroscopy', 'IR Spectroscopy',
      'UV-Vis Spectroscopy', 'Electroanalytical Methods', 'Atomic Spectroscopy', 'X-ray Methods',
      'Sample Preparation', 'Method Validation', 'Quality Control', 'Chemometrics'
    ]
  },
  {
    id: 'biochemistry',
    name: 'Biochemistry',
    icon: <TestTube className="w-6 h-6" />,
    description: 'Chemical processes within living organisms',
    skillCount: 90,
    color: 'bg-cyan-500',
    trending: true,
    skills: [
      'Protein Structure', 'Enzyme Kinetics', 'Metabolism', 'Nucleic Acids',
      'Lipids & Membranes', 'Carbohydrates', 'Signal Transduction', 'Gene Expression',
      'Protein Folding', 'Molecular Biology', 'Bioanalytical Methods', 'Structural Biology'
    ]
  },
  {
    id: 'medicinal-chemistry',
    name: 'Medicinal Chemistry',
    icon: <FlaskConical className="w-6 h-6" />,
    description: 'Design and development of pharmaceutical compounds',
    skillCount: 75,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Drug Design', 'Pharmacophores', 'QSAR', 'Lead Optimization',
      'ADMET Properties', 'Drug Metabolism', 'Toxicology', 'Structure-Based Design',
      'Fragment-Based Design', 'Prodrugs', 'Drug Delivery', 'Clinical Chemistry'
    ]
  },
  {
    id: 'environmental-chemistry',
    name: 'Environmental Chemistry',
    icon: <Leaf className="w-6 h-6" />,
    description: 'Chemical processes in air, water, and soil environments',
    skillCount: 70,
    color: 'bg-emerald-500',
    trending: true,
    skills: [
      'Atmospheric Chemistry', 'Water Chemistry', 'Soil Chemistry', 'Pollution Analysis',
      'Remediation Technologies', 'Green Chemistry', 'Environmental Monitoring', 'Fate & Transport',
      'Ecotoxicology', 'Climate Chemistry', 'Sustainable Chemistry', 'Life Cycle Assessment'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Organic Chemistry Complete Course',
    instructor: 'Dr. Maria Santos',
    rating: 4.9,
    reviews: 15678,
    price: 179.99,
    originalPrice: 349.99,
    duration: '45 hours',
    students: '32,000+',
    level: 'Intermediate',
    category: 'Organic Chemistry',
    trending: true,
    skills: ['Reaction Mechanisms', 'Stereochemistry', 'Synthesis', 'Spectroscopy'],
    description: 'Master organic chemistry with 3D molecular models and reaction simulations.',
    certification: 'Organic Chemistry Certificate'
  },
  {
    id: 2,
    title: 'Analytical Chemistry & Instrumentation',
    instructor: 'Prof. David Chen',
    rating: 4.8,
    reviews: 8934,
    price: 159.99,
    originalPrice: 319.99,
    duration: '38 hours',
    students: '18,000+',
    level: 'Advanced',
    category: 'Analytical Chemistry',
    trending: true,
    skills: ['Chromatography', 'Mass Spectrometry', 'NMR', 'Method Development'],
    description: 'Learn modern analytical techniques with virtual instrumentation.',
    certification: 'Analytical Chemistry Certificate'
  },
  {
    id: 3,
    title: 'Physical Chemistry Fundamentals',
    instructor: 'Dr. Sarah Rodriguez',
    rating: 4.7,
    reviews: 6543,
    price: 149.99,
    originalPrice: 299.99,
    duration: '42 hours',
    students: '22,000+',
    level: 'Intermediate',
    category: 'Physical Chemistry',
    trending: true,
    skills: ['Thermodynamics', 'Kinetics', 'Quantum Chemistry', 'Spectroscopy'],
    description: 'Quantitative chemistry with mathematical modeling and simulations.',
    certification: 'Physical Chemistry Certificate'
  },
  {
    id: 4,
    title: 'Medicinal Chemistry & Drug Design',
    instructor: 'Dr. James Wilson',
    rating: 4.8,
    reviews: 4567,
    price: 199.99,
    originalPrice: 399.99,
    duration: '35 hours',
    students: '12,000+',
    level: 'Advanced',
    category: 'Medicinal Chemistry',
    trending: true,
    skills: ['Drug Design', 'Pharmacophores', 'QSAR', 'Lead Optimization'],
    description: 'Design pharmaceuticals using computational chemistry tools.',
    certification: 'Medicinal Chemistry Certificate'
  },
  {
    id: 5,
    title: 'Biochemistry & Molecular Biology',
    instructor: 'Prof. Lisa Park',
    rating: 4.6,
    reviews: 7890,
    price: 169.99,
    originalPrice: 339.99,
    duration: '40 hours',
    students: '25,000+',
    level: 'Intermediate',
    category: 'Biochemistry',
    trending: false,
    skills: ['Protein Structure', 'Enzyme Kinetics', 'Metabolism', 'Gene Expression'],
    description: 'Explore the chemistry of life with interactive molecular models.',
    certification: 'Biochemistry Certificate'
  },
  {
    id: 6,
    title: 'Green Chemistry & Sustainability',
    instructor: 'Dr. Michael Kim',
    rating: 4.7,
    reviews: 3456,
    price: 129.99,
    originalPrice: 259.99,
    duration: '28 hours',
    students: '14,000+',
    level: 'Intermediate',
    category: 'Environmental Chemistry',
    trending: true,
    skills: ['Green Synthesis', 'Renewable Feedstocks', 'Catalysis', 'Life Cycle Assessment'],
    description: 'Learn sustainable chemistry practices for environmental protection.',
    certification: 'Green Chemistry Certificate'
  }
]

export default function ChemistryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('chemist')
  const [roadmapProgress, setRoadmapProgress] = useState(35)

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedSubcategory === 'all' ||
                          course.category.toLowerCase() === selectedSubcategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-green-900/20 dark:to-cyan-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl mb-6">
              <Beaker className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Chemistry & Chemical Sciences
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Explore the molecular world through hands-on experiments and cutting-edge simulations.
              Master chemistry from atoms to complex reactions and industrial applications.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search chemistry courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-green-500 transition-all"
                />
              </div>
            </div>

            {/* Chemistry Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-green-600">485+</div>
                <div className="text-sm text-muted-foreground">Chemistry Courses</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-blue-600">38K+</div>
                <div className="text-sm text-muted-foreground">Chemistry Students</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-cyan-600">125+</div>
                <div className="text-sm text-muted-foreground">PhD Chemists</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-emerald-600">92%</div>
                <div className="text-sm text-muted-foreground">Lab Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chemistry Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Chemistry Specializations
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover specialized branches of chemistry and chemical sciences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {chemistrySubcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/explore/chemistry/${subcategory.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-background/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 ${subcategory.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {subcategory.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
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
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
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

      {/* Featured Chemistry Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Chemistry Courses
              </h2>
              <p className="text-xl text-muted-foreground">
                Learn from leading chemists and researchers with hands-on labs
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
                {chemistrySubcategories.map(sub => (
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
                  <div className="relative h-48 bg-gradient-to-br from-green-500 via-blue-600 to-cyan-500 overflow-hidden">
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
                      <Badge className="bg-green-600 text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FlaskConical className="w-16 h-16 text-white/50" />
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

                    <CardTitle className="text-xl group-hover:text-green-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
                      <Button size="sm" className="group-hover:bg-green-600 transition-colors bg-green-600 hover:bg-green-700">
                        <Play className="w-4 h-4 mr-1" />
                        Start Lab
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comprehensive Chemistry Learning System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Complete Chemistry Learning Platform
            </h2>
            <p className="text-xl text-muted-foreground">
              From basic atoms to complex synthesis - master all aspects of chemistry
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Beaker className="w-4 h-4" />
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
                <TestTube className="w-4 h-4" />
                Encyclopedia
              </TabsTrigger>
              <TabsTrigger value="meetings" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Virtual Labs
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {chemistrySubcategories.map((subcategory) => (
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
                {Object.entries(chemistryLearningPaths).map(([level, path]) => (
                  <Card key={level} className="h-fit">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          level === 'beginner' ? 'bg-green-500' :
                          level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {level === 'beginner' ? <Target className="w-5 h-5" /> :
                           level === 'intermediate' ? <Beaker className="w-5 h-5" /> : <Award className="w-5 h-5" />}
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
                          <Button size="sm" className="w-full mt-3 bg-green-600 hover:bg-green-700">
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
                  <h3 className="text-xl font-bold">Choose Your Chemistry Career Path</h3>
                  {Object.entries(chemistryRoadmaps).map(([key, roadmap]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedRoadmap === key ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
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
                        {chemistryRoadmaps[selectedRoadmap as keyof typeof chemistryRoadmaps].title}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Complete roadmap to become a professional {chemistryRoadmaps[selectedRoadmap as keyof typeof chemistryRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {chemistryRoadmaps[selectedRoadmap as keyof typeof chemistryRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < chemistryRoadmaps[selectedRoadmap as keyof typeof chemistryRoadmaps].steps.length - 1 && (
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
                                  <h5 className="font-medium text-sm mb-2">Chemistry Skills:</h5>
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

                              <Button size="sm" variant={step.completed ? 'secondary' : 'default'} className="bg-green-600 hover:bg-green-700">
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
                {Object.entries(chemistryEncyclopedia).map(([category, section]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.topics.map((topic, idx) => (
                        <div key={idx} className="border-l-4 border-green-500 pl-4 space-y-2">
                          <h4 className="font-medium text-lg">{topic.name}</h4>
                          <p className="text-sm text-muted-foreground">{topic.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-green-600">Why Important:</span>
                              <p className="text-xs text-muted-foreground">{topic.importance}</p>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-blue-600">Applications:</span>
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

            {/* Chemistry Virtual Labs & Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Chemistry Labs */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Chemistry Virtual Labs
                    </CardTitle>
                    <CardDescription>
                      Join interactive chemistry experiments and synthesis sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'Organic Synthesis Workshop',
                        instructor: 'Dr. Maria Santos',
                        time: 'Today 2:30 PM',
                        participants: 28,
                        type: 'Virtual Lab'
                      },
                      {
                        title: 'Analytical Chemistry Seminar',
                        instructor: 'Prof. David Chen',
                        time: 'Tomorrow 3:00 PM',
                        participants: 35,
                        type: 'Lab Session'
                      },
                      {
                        title: 'Medicinal Chemistry Research',
                        instructor: 'Dr. James Wilson',
                        time: 'Wed 4:00 PM',
                        participants: 22,
                        type: 'Research Lab'
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
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Video className="w-4 h-4 mr-2" />
                            Join Lab
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Chemistry Session */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Chemistry Session
                    </CardTitle>
                    <CardDescription>
                      Create your own chemistry lab or study session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col bg-green-600 hover:bg-green-700">
                        <FlaskConical className="w-6 h-6" />
                        <span className="text-sm">Virtual Lab</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <Atom className="w-6 h-6" />
                        <span className="text-sm">Molecular Modeling</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Chemistry Session Types:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <TestTube className="w-4 h-4 mr-2" />
                          Organic Chemistry Lab
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Microscope className="w-4 h-4 mr-2" />
                          Analytical Methods
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Flame className="w-4 h-4 mr-2" />
                          Physical Chemistry
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Beaker className="w-4 h-4 mr-2" />
                          General Chemistry
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Lab Tools Available:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          3D Molecular Models
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Reaction Simulator
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Virtual Instruments
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

              {/* Chemistry Learning Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    Chemistry Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">19</div>
                      <div className="text-sm text-muted-foreground">Lab Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-muted-foreground">Experiments</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-600">8</div>
                      <div className="text-sm text-muted-foreground">Chemistry Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-600">4</div>
                      <div className="text-sm text-muted-foreground">Certificates</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Chemistry Simulation Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Chemistry Simulations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore molecular behavior through cutting-edge chemistry simulations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Molecular Builder */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Atom className="w-5 h-5" />
                  3D Molecular Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Orbit className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive molecule construction</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>3D Structures</span>
                    <span className="text-green-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bond Visualization</span>
                    <span className="text-blue-600">Real-time</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Property Analysis</span>
                    <span className="text-purple-600">Computed</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600 bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Build Molecules
                </Button>
              </CardContent>
            </Card>

            {/* Reaction Simulator */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Reaction Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Flame className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Chemical reaction dynamics</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reaction Mechanisms</span>
                    <span className="text-orange-600">Animated</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Energy Profiles</span>
                    <span className="text-red-600">Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Kinetics</span>
                    <span className="text-purple-600">Real-time</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-orange-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Run Reactions
                </Button>
              </CardContent>
            </Card>

            {/* Spectroscopy Analyzer */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  Spectroscopy Analyzer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Virtual spectroscopy lab</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>NMR Spectra</span>
                    <span className="text-purple-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IR Analysis</span>
                    <span className="text-indigo-600">Simulation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Mass Spectrometry</span>
                    <span className="text-blue-600">Prediction</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-purple-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Analyze Spectra
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
            Ready to Explore the Molecular World?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and researchers discovering chemistry through hands-on learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 bg-green-600 hover:bg-green-700">
              <Link href="/auth/register">Start Chemistry Journey</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link href="/dashboard/meetings">Join Virtual Lab</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}