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
  Leaf,
  Heart,
  Brain,
  Eye,
  Microscope,
  TreePine,
  Fish,
  Bird,
  Bug,
  Dna,
  Flower,
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
  TestTube,
  Activity,
  Layers,
  Compass,
  Binary,
  Zap,
  Sun,
  Droplets,
  Mountain
} from 'lucide-react'

// Biology Learning Paths (Beginner to Advanced)
const biologyLearningPaths = {
  beginner: {
    title: 'Life Science Fundamentals',
    duration: '4-6 months',
    courses: [
      {
        title: 'Cell Biology & Genetics',
        topics: ['Cell Structure', 'DNA & RNA', 'Protein Synthesis', 'Cell Division'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Human Anatomy & Physiology',
        topics: ['Body Systems', 'Homeostasis', 'Circulation', 'Nervous System'],
        duration: '10 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Ecology & Environmental Science',
        topics: ['Ecosystems', 'Biodiversity', 'Food Webs', 'Conservation'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Advanced Life Sciences',
    duration: '8-12 months',
    courses: [
      {
        title: 'Molecular Biology',
        topics: ['Gene Expression', 'Recombinant DNA', 'PCR', 'Genetic Engineering'],
        duration: '12 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Microbiology & Immunology',
        topics: ['Bacterial Systems', 'Viral Replication', 'Immune Response', 'Vaccines'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Developmental Biology',
        topics: ['Embryogenesis', 'Cell Differentiation', 'Morphogenesis', 'Stem Cells'],
        duration: '8 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Specialized Biology',
    duration: '12-18 months',
    courses: [
      {
        title: 'Bioinformatics & Computational Biology',
        topics: ['Genomics', 'Proteomics', 'Systems Biology', 'Machine Learning'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Neuroscience & Behavior',
        topics: ['Neural Networks', 'Synaptic Transmission', 'Cognitive Function', 'Brain Imaging'],
        duration: '14 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Biotechnology & Bioengineering',
        topics: ['Synthetic Biology', 'Bioprocessing', 'Drug Development', 'Tissue Engineering'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

const biologySubcategories = [
  {
    id: 'cell-biology',
    name: 'Cell & Molecular Biology',
    icon: <Microscope className="w-6 h-6" />,
    description: 'Cellular structure, function, and molecular mechanisms of life',
    skillCount: 95,
    color: 'bg-green-500',
    trending: true,
    skills: [
      'Cell Structure', 'DNA Replication', 'Protein Synthesis', 'Cell Division',
      'Gene Expression', 'Signal Transduction', 'Molecular Cloning', 'PCR',
      'Gel Electrophoresis', 'Western Blotting', 'Cell Culture', 'Microscopy'
    ]
  },
  {
    id: 'human-biology',
    name: 'Human Biology',
    icon: <Heart className="w-6 h-6" />,
    description: 'Human anatomy, physiology, and health sciences',
    skillCount: 120,
    color: 'bg-red-500',
    trending: true,
    skills: [
      'Anatomy', 'Physiology', 'Homeostasis', 'Cardiovascular System',
      'Respiratory System', 'Digestive System', 'Endocrine System', 'Immune System',
      'Nervous System', 'Reproductive System', 'Musculoskeletal System', 'Medical Terminology'
    ]
  },
  {
    id: 'genetics',
    name: 'Genetics & Genomics',
    icon: <Dna className="w-6 h-6" />,
    description: 'Heredity, genetic variation, and genomic analysis',
    skillCount: 85,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Mendelian Genetics', 'Population Genetics', 'Genomics', 'Genetic Engineering',
      'CRISPR', 'Gene Therapy', 'Genetic Disorders', 'Phylogenetics',
      'Bioinformatics', 'Genome Sequencing', 'Genetic Counseling', 'Epigenetics'
    ]
  },
  {
    id: 'ecology',
    name: 'Ecology & Environment',
    icon: <TreePine className="w-6 h-6" />,
    description: 'Ecosystems, environmental science, and conservation biology',
    skillCount: 75,
    color: 'bg-emerald-500',
    trending: true,
    skills: [
      'Ecosystems', 'Biodiversity', 'Population Dynamics', 'Food Webs',
      'Conservation Biology', 'Environmental Science', 'Climate Change', 'Pollution',
      'Habitat Restoration', 'Field Studies', 'Environmental Monitoring', 'Sustainability'
    ]
  },
  {
    id: 'microbiology',
    name: 'Microbiology',
    icon: <Bug className="w-6 h-6" />,
    description: 'Bacteria, viruses, fungi, and microscopic life forms',
    skillCount: 80,
    color: 'bg-purple-500',
    trending: false,
    skills: [
      'Bacterial Culture', 'Viral Replication', 'Fungal Biology', 'Parasitology',
      'Antibiotic Resistance', 'Fermentation', 'Pathogenesis', 'Microbial Ecology',
      'Sterilization', 'Food Microbiology', 'Medical Microbiology', 'Industrial Microbiology'
    ]
  },
  {
    id: 'neuroscience',
    name: 'Neuroscience',
    icon: <Brain className="w-6 h-6" />,
    description: 'Brain structure, function, and nervous system biology',
    skillCount: 70,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Neuroanatomy', 'Neurophysiology', 'Synaptic Transmission', 'Neural Development',
      'Neurotransmitters', 'Brain Imaging', 'Cognitive Neuroscience', 'Behavioral Neuroscience',
      'Neurological Disorders', 'Neural Networks', 'Electrophysiology', 'Optogenetics'
    ]
  },
  {
    id: 'biotechnology',
    name: 'Biotechnology',
    icon: <TestTube className="w-6 h-6" />,
    description: 'Applied biology for technological and industrial applications',
    skillCount: 90,
    color: 'bg-cyan-500',
    trending: true,
    skills: [
      'Genetic Engineering', 'Bioprocessing', 'Fermentation Technology', 'Bioreactors',
      'Enzyme Technology', 'Vaccine Development', 'Tissue Engineering', 'Stem Cell Technology',
      'Synthetic Biology', 'Biofuels', 'Biopharmaceuticals', 'Biomedical Devices'
    ]
  },
  {
    id: 'marine-biology',
    name: 'Marine Biology',
    icon: <Fish className="w-6 h-6" />,
    description: 'Ocean life, marine ecosystems, and aquatic biology',
    skillCount: 60,
    color: 'bg-blue-600',
    trending: false,
    skills: [
      'Marine Ecosystems', 'Ocean Biology', 'Coral Reefs', 'Plankton',
      'Marine Conservation', 'Fisheries Science', 'Deep Sea Biology', 'Marine Pollution',
      'Aquaculture', 'Marine Biotechnology', 'Oceanography', 'Marine Biodiversity'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Cell Biology & Molecular Mechanisms',
    instructor: 'Dr. Emily Chen',
    rating: 4.9,
    reviews: 12456,
    price: 169.99,
    originalPrice: 329.99,
    duration: '42 hours',
    students: '28,000+',
    level: 'Intermediate',
    category: 'Cell Biology',
    trending: true,
    skills: ['Cell Structure', 'DNA Replication', 'Protein Synthesis', 'Gene Expression'],
    description: 'Explore cellular mechanisms with 3D models and virtual microscopy.',
    certification: 'Cell Biology Certificate'
  },
  {
    id: 2,
    title: 'Human Anatomy & Physiology Complete',
    instructor: 'Prof. Michael Rodriguez',
    rating: 4.8,
    reviews: 18543,
    price: 189.99,
    originalPrice: 379.99,
    duration: '55 hours',
    students: '45,000+',
    level: 'Beginner',
    category: 'Human Biology',
    trending: true,
    skills: ['Anatomy', 'Physiology', 'Body Systems', 'Medical Terminology'],
    description: 'Master human biology with interactive 3D anatomy models.',
    certification: 'Human Biology Certificate'
  },
  {
    id: 3,
    title: 'Genetics & Genomics Fundamentals',
    instructor: 'Dr. Sarah Park',
    rating: 4.7,
    reviews: 9876,
    price: 159.99,
    originalPrice: 319.99,
    duration: '38 hours',
    students: '22,000+',
    level: 'Intermediate',
    category: 'Genetics',
    trending: true,
    skills: ['Genetics', 'Genomics', 'CRISPR', 'Bioinformatics'],
    description: 'Learn modern genetics with computational biology tools.',
    certification: 'Genetics Certificate'
  },
  {
    id: 4,
    title: 'Ecology & Environmental Science',
    instructor: 'Dr. Lisa Wilson',
    rating: 4.6,
    reviews: 7234,
    price: 149.99,
    originalPrice: 299.99,
    duration: '35 hours',
    students: '18,000+',
    level: 'Beginner',
    category: 'Ecology',
    trending: true,
    skills: ['Ecosystems', 'Biodiversity', 'Conservation', 'Field Studies'],
    description: 'Understand ecosystems through virtual field studies and simulations.',
    certification: 'Ecology Certificate'
  },
  {
    id: 5,
    title: 'Neuroscience & Brain Function',
    instructor: 'Prof. David Kim',
    rating: 4.8,
    reviews: 5432,
    price: 199.99,
    originalPrice: 399.99,
    duration: '45 hours',
    students: '15,000+',
    level: 'Advanced',
    category: 'Neuroscience',
    trending: true,
    skills: ['Neuroanatomy', 'Brain Imaging', 'Cognitive Function', 'Neural Networks'],
    description: 'Explore the brain with advanced neuroimaging and simulation tools.',
    certification: 'Neuroscience Certificate'
  },
  {
    id: 6,
    title: 'Biotechnology & Genetic Engineering',
    instructor: 'Dr. Rachel Thompson',
    rating: 4.7,
    reviews: 6789,
    price: 179.99,
    originalPrice: 359.99,
    duration: '40 hours',
    students: '12,000+',
    level: 'Advanced',
    category: 'Biotechnology',
    trending: false,
    skills: ['Genetic Engineering', 'Bioprocessing', 'Synthetic Biology', 'Drug Development'],
    description: 'Master biotechnology applications in medicine and industry.',
    certification: 'Biotechnology Certificate'
  }
]

export default function BiologyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('biologist')
  const [roadmapProgress, setRoadmapProgress] = useState(50)

  const filteredCourses = featuredCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedSubcategory === 'all' ||
                          course.category.toLowerCase() === selectedSubcategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl mb-6">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6">
              Biology & Life Sciences
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover the wonders of life from molecules to ecosystems. Explore biology through
              interactive 3D models, virtual labs, and cutting-edge research tools.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search biology courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Biology Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-emerald-600">420+</div>
                <div className="text-sm text-muted-foreground">Biology Courses</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-green-600">52K+</div>
                <div className="text-sm text-muted-foreground">Life Science Students</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-teal-600">145+</div>
                <div className="text-sm text-muted-foreground">Research Scientists</div>
              </div>
              <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                <div className="text-2xl font-bold text-cyan-600">93%</div>
                <div className="text-sm text-muted-foreground">Research Ready</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biology Specializations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Biology Specializations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore diverse fields in biology and life sciences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {biologySubcategories.map((subcategory) => (
              <Link key={subcategory.id} href={`/explore/biology/${subcategory.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-background/80 backdrop-blur-sm overflow-hidden h-full">
                  <CardHeader className="pb-3">
                    <div className={`w-12 h-12 ${subcategory.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {subcategory.icon}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
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
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
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

      {/* Featured Biology Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Biology Courses
              </h2>
              <p className="text-xl text-muted-foreground">
                Learn from leading biologists and researchers with virtual labs
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
                {biologySubcategories.map(sub => (
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
                  <div className="relative h-48 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-500 overflow-hidden">
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
                      <Badge className="bg-emerald-600 text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Dna className="w-16 h-16 text-white/50" />
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

                    <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
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
                      <Button size="sm" className="group-hover:bg-emerald-600 transition-colors bg-emerald-600 hover:bg-emerald-700">
                        <Play className="w-4 h-4 mr-1" />
                        Explore Life
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Biology Virtual Labs & Simulations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Interactive Biology Simulations
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore life sciences through cutting-edge 3D models and virtual laboratories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 3D Cell Explorer */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Microscope className="w-5 h-5" />
                  3D Cell Explorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Interactive cellular structures</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cell Organelles</span>
                    <span className="text-green-600">3D Model</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Protein Synthesis</span>
                    <span className="text-emerald-600">Animation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cell Division</span>
                    <span className="text-teal-600">Simulation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600 bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Explore Cells
                </Button>
              </CardContent>
            </Card>

            {/* Virtual Dissection */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Virtual Anatomy Lab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="w-12 h-12 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">3D anatomical models</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Human Anatomy</span>
                    <span className="text-red-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Organ Systems</span>
                    <span className="text-pink-600">3D Visual</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Virtual Dissection</span>
                    <span className="text-purple-600">Guided</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-red-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Virtual Dissection
                </Button>
              </CardContent>
            </Card>

            {/* Ecosystem Simulator */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="w-5 h-5" />
                  Ecosystem Simulator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Compass className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Virtual field studies</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Food Webs</span>
                    <span className="text-emerald-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Population Dynamics</span>
                    <span className="text-green-600">Modeling</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Climate Impact</span>
                    <span className="text-teal-600">Simulation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-emerald-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Study Ecosystems
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
            Ready to Discover the Wonders of Life?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of students and researchers exploring biology through interactive learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700">
              <Link href="/auth/register">Start Biology Journey</Link>
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