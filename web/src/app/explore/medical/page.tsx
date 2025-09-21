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
  Heart,
  Stethoscope,
  Brain,
  Activity,
  Shield,
  UserCheck,
  Pill,
  Microscope,
  MonitorSpeaker,
  Baby,
  Eye,
  Bone,
  Zap,
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
  Clipboard,
  HeartHandshake,
  Syringe,
  Thermometer,
  Scan,
  Layers
} from 'lucide-react'

// Medical Learning Paths (Beginner to Advanced)
const medicalLearningPaths = {
  beginner: {
    title: 'Healthcare Fundamentals',
    duration: '4-6 months',
    courses: [
      {
        title: 'Medical Terminology & Anatomy',
        topics: ['Medical Terminology', 'Human Anatomy', 'Physiology Basics', 'Body Systems'],
        duration: '6 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Patient Care Fundamentals',
        topics: ['Patient Communication', 'Basic Assessment', 'Vital Signs', 'Infection Control'],
        duration: '8 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Healthcare Ethics & Law',
        topics: ['Medical Ethics', 'Patient Rights', 'HIPAA Compliance', 'Professional Standards'],
        duration: '4 weeks',
        difficulty: 'Beginner'
      }
    ]
  },
  intermediate: {
    title: 'Clinical Practice',
    duration: '8-12 months',
    courses: [
      {
        title: 'Advanced Clinical Assessment',
        topics: ['Physical Examination', 'Diagnostic Reasoning', 'Clinical Documentation', 'Care Planning'],
        duration: '10 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Pharmacology & Medication Management',
        topics: ['Drug Classifications', 'Medication Administration', 'Drug Interactions', 'Patient Education'],
        duration: '12 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Specialized Nursing Care',
        topics: ['Critical Care', 'Emergency Nursing', 'Pediatric Care', 'Geriatric Care'],
        duration: '14 weeks',
        difficulty: 'Intermediate'
      }
    ]
  },
  advanced: {
    title: 'Expert Clinical Practice',
    duration: '12-18 months',
    courses: [
      {
        title: 'Advanced Practice Nursing',
        topics: ['Nurse Practitioner Skills', 'Advanced Diagnostics', 'Treatment Planning', 'Clinical Leadership'],
        duration: '16 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Medical Research & Evidence-Based Practice',
        topics: ['Research Methodology', 'Statistical Analysis', 'Literature Review', 'Quality Improvement'],
        duration: '14 weeks',
        difficulty: 'Advanced'
      },
      {
        title: 'Healthcare Leadership & Management',
        topics: ['Healthcare Administration', 'Team Leadership', 'Quality Management', 'Strategic Planning'],
        duration: '12 weeks',
        difficulty: 'Advanced'
      }
    ]
  }
}

// Medical Encyclopedia
const medicalEncyclopedia = {
  clinicalSkills: {
    title: 'Clinical Skills & Practice',
    topics: [
      {
        name: 'Physical Assessment',
        description: 'Systematic examination techniques, vital signs, and clinical observation',
        importance: 'Foundation of clinical diagnosis and patient care',
        applications: ['Primary care', 'Hospital medicine', 'Emergency care']
      },
      {
        name: 'Pharmacology',
        description: 'Drug mechanisms, interactions, administration, and monitoring',
        importance: 'Safe and effective medication management',
        applications: ['Medication therapy', 'Drug safety', 'Patient counseling']
      },
      {
        name: 'Infection Control',
        description: 'Prevention and management of infectious diseases',
        importance: 'Patient safety and public health protection',
        applications: ['Hospital infection prevention', 'Outbreak management', 'Sterilization protocols']
      }
    ]
  },
  medicalTechnology: {
    title: 'Medical Technology & Innovation',
    topics: [
      {
        name: 'Electronic Health Records',
        description: 'Digital health information systems and data management',
        importance: 'Efficient healthcare delivery and coordination',
        applications: ['Clinical documentation', 'Care coordination', 'Quality reporting']
      },
      {
        name: 'Telemedicine',
        description: 'Remote healthcare delivery using technology',
        importance: 'Accessible healthcare and cost reduction',
        applications: ['Remote consultations', 'Chronic disease management', 'Rural healthcare']
      },
      {
        name: 'Medical Devices',
        description: 'Diagnostic and therapeutic medical equipment',
        importance: 'Accurate diagnosis and effective treatment',
        applications: ['Patient monitoring', 'Diagnostic imaging', 'Surgical procedures']
      }
    ]
  }
}

// Medical Career Roadmaps
const medicalRoadmaps = {
  registeredNurse: {
    title: 'Registered Nurse',
    duration: '15-18 months',
    steps: [
      {
        phase: 'Nursing Fundamentals',
        duration: '4 months',
        skills: ['Medical Terminology', 'Anatomy & Physiology', 'Basic Patient Care', 'Nursing Ethics'],
        projects: ['Patient Care Plan', 'Health Assessment', 'Medication Administration'],
        completed: false
      },
      {
        phase: 'Clinical Skills Development',
        duration: '6 months',
        skills: ['IV Therapy', 'Wound Care', 'Emergency Response', 'Patient Education'],
        projects: ['Clinical Rotations', 'Skills Competency', 'Case Studies'],
        completed: false
      },
      {
        phase: 'Specialized Practice',
        duration: '4 months',
        skills: ['Specialty Nursing', 'Advanced Assessment', 'Care Coordination', 'Quality Improvement'],
        projects: ['Specialty Rotation', 'Quality Project', 'Evidence-Based Practice'],
        completed: false
      },
      {
        phase: 'Professional Development',
        duration: '2 months',
        skills: ['Leadership', 'Mentoring', 'Professional Growth', 'Certification Prep'],
        projects: ['NCLEX Preparation', 'Professional Portfolio', 'Career Planning'],
        completed: false
      }
    ]
  },
  nursePractitioner: {
    title: 'Nurse Practitioner',
    duration: '24-30 months',
    steps: [
      {
        phase: 'Advanced Nursing Foundation',
        duration: '6 months',
        skills: ['Advanced Pathophysiology', 'Pharmacology', 'Health Assessment', 'Research Methods'],
        projects: ['Comprehensive Assessment', 'Research Proposal', 'Case Presentations'],
        completed: false
      },
      {
        phase: 'Clinical Practicum',
        duration: '12 months',
        skills: ['Diagnostic Skills', 'Treatment Planning', 'Patient Management', 'Clinical Decision Making'],
        projects: ['Clinical Hours', 'Patient Presentations', 'Quality Improvement Project'],
        completed: false
      },
      {
        phase: 'Specialty Focus',
        duration: '8 months',
        skills: ['Specialty Practice', 'Advanced Procedures', 'Population Health', 'Healthcare Leadership'],
        projects: ['Specialty Certification', 'Capstone Project', 'Community Health Initiative'],
        completed: false
      },
      {
        phase: 'Independent Practice',
        duration: '4 months',
        skills: ['Independent Practice', 'Business Skills', 'Collaborative Care', 'Professional Development'],
        projects: ['Practice Management', 'Board Certification', 'Professional Network'],
        completed: false
      }
    ]
  }
}

const medicalSubcategories = [
  {
    id: 'nursing',
    name: 'Nursing',
    icon: <Heart className="w-6 h-6" />,
    description: 'Comprehensive nursing education from fundamentals to specialized care',
    skillCount: 145,
    color: 'bg-red-500',
    trending: true,
    skills: [
      'Patient Care', 'Medication Administration', 'IV Therapy', 'Wound Care',
      'Critical Care Nursing', 'Pediatric Nursing', 'Geriatric Care', 'Mental Health Nursing',
      'Emergency Nursing', 'Surgical Nursing', 'Infection Control', 'Patient Safety',
      'Nursing Assessment', 'Care Planning', 'Documentation', 'Health Education'
    ]
  },
  {
    id: 'medicine',
    name: 'Medicine & Clinical Practice',
    icon: <Stethoscope className="w-6 h-6" />,
    description: 'Medical knowledge, diagnosis, and clinical practice skills',
    skillCount: 180,
    color: 'bg-blue-500',
    trending: true,
    skills: [
      'Clinical Diagnosis', 'Physical Examination', 'Medical History Taking',
      'Internal Medicine', 'Family Medicine', 'Emergency Medicine', 'Cardiology',
      'Pulmonology', 'Gastroenterology', 'Neurology', 'Endocrinology',
      'Dermatology', 'Infectious Diseases', 'Oncology', 'Rheumatology'
    ]
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Psychology',
    icon: <Brain className="w-6 h-6" />,
    description: 'Mental health care, counseling, and psychological support',
    skillCount: 95,
    color: 'bg-purple-500',
    trending: true,
    skills: [
      'Clinical Psychology', 'Counseling Techniques', 'Cognitive Behavioral Therapy',
      'Depression Treatment', 'Anxiety Management', 'PTSD Therapy', 'Addiction Counseling',
      'Child Psychology', 'Couples Therapy', 'Group Therapy', 'Crisis Intervention',
      'Mindfulness Therapy', 'Dialectical Behavior Therapy', 'Trauma-Informed Care'
    ]
  },
  {
    id: 'physical-therapy',
    name: 'Physical Therapy & Rehabilitation',
    icon: <Activity className="w-6 h-6" />,
    description: 'Physical rehabilitation, mobility, and therapeutic exercises',
    skillCount: 85,
    color: 'bg-green-500',
    trending: false,
    skills: [
      'Physical Assessment', 'Exercise Therapy', 'Manual Therapy', 'Gait Training',
      'Sports Rehabilitation', 'Neurological Rehabilitation', 'Pediatric PT',
      'Geriatric Physical Therapy', 'Orthopedic Rehabilitation', 'Balance Training',
      'Pain Management', 'Therapeutic Modalities', 'Adaptive Equipment'
    ]
  },
  {
    id: 'medical-technology',
    name: 'Medical Technology',
    icon: <MonitorSpeaker className="w-6 h-6" />,
    description: 'Healthcare technology, medical devices, and digital health',
    skillCount: 75,
    color: 'bg-cyan-500',
    trending: true,
    skills: [
      'Electronic Health Records', 'Medical Imaging', 'Laboratory Technology',
      'Telemedicine', 'Medical Device Operation', 'Health Informatics',
      'Radiology Technology', 'Ultrasound Technology', 'CT/MRI Operation',
      'Laboratory Analysis', 'Point-of-Care Testing', 'Medical Software',
      'Healthcare Analytics', 'Digital Health Tools', 'Remote Monitoring'
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy & Pharmacology',
    icon: <Pill className="w-6 h-6" />,
    description: 'Pharmaceutical knowledge, drug interactions, and medication management',
    skillCount: 65,
    color: 'bg-orange-500',
    trending: false,
    skills: [
      'Pharmacology', 'Drug Interactions', 'Medication Safety', 'Clinical Pharmacy',
      'Pharmaceutical Calculations', 'Drug Dispensing', 'Patient Counseling',
      'Pharmacy Management', 'Compounding', 'Immunizations', 'Medication Therapy',
      'Pharmaceutical Care', 'Drug Information', 'Pharmacy Law', 'Quality Control'
    ]
  },
  {
    id: 'medical-research',
    name: 'Medical Research',
    icon: <Microscope className="w-6 h-6" />,
    description: 'Clinical research, biostatistics, and evidence-based medicine',
    skillCount: 55,
    color: 'bg-indigo-500',
    trending: true,
    skills: [
      'Clinical Research', 'Biostatistics', 'Research Methodology', 'Data Analysis',
      'Evidence-Based Medicine', 'Literature Review', 'Research Ethics',
      'Clinical Trials', 'Epidemiology', 'Health Economics', 'Public Health Research',
      'Regulatory Affairs', 'Grant Writing', 'Scientific Writing', 'Research Design'
    ]
  },
  {
    id: 'healthcare-administration',
    name: 'Healthcare Administration',
    icon: <UserCheck className="w-6 h-6" />,
    description: 'Healthcare management, policy, and administrative skills',
    skillCount: 70,
    color: 'bg-gray-600',
    trending: false,
    skills: [
      'Healthcare Management', 'Health Policy', 'Healthcare Finance', 'Quality Improvement',
      'Healthcare Law', 'Risk Management', 'Healthcare Leadership', 'Strategic Planning',
      'Healthcare Operations', 'Compliance', 'Human Resources', 'Performance Management',
      'Healthcare Economics', 'Population Health', 'Healthcare Marketing'
    ]
  }
]

const featuredCourses = [
  {
    id: 1,
    title: 'Comprehensive Nursing Fundamentals',
    instructor: 'Dr. Sarah Williams',
    rating: 4.9,
    reviews: 15432,
    price: 149.99,
    originalPrice: 299.99,
    duration: '40 hours',
    students: '25,000+',
    level: 'Beginner',
    category: 'Nursing',
    trending: true,
    skills: ['Patient Care', 'Medication Administration', 'Assessment', 'Documentation'],
    description: 'Master essential nursing skills with hands-on practice and real-world scenarios.',
    certification: 'Nursing Fundamentals Certificate'
  },
  {
    id: 2,
    title: 'Clinical Medicine & Diagnosis',
    instructor: 'Dr. Michael Chen',
    rating: 4.8,
    reviews: 8923,
    price: 199.99,
    originalPrice: 399.99,
    duration: '55 hours',
    students: '12,000+',
    level: 'Advanced',
    category: 'Medicine',
    trending: true,
    skills: ['Clinical Diagnosis', 'Physical Exam', 'Medical History', 'Treatment Planning'],
    description: 'Advanced clinical skills for medical professionals and students.',
    certification: 'Clinical Medicine Certificate'
  },
  {
    id: 3,
    title: 'Mental Health Counseling Techniques',
    instructor: 'Dr. Emma Rodriguez',
    rating: 4.7,
    reviews: 12678,
    price: 129.99,
    originalPrice: 249.99,
    duration: '30 hours',
    students: '18,000+',
    level: 'Intermediate',
    category: 'Mental Health',
    trending: true,
    skills: ['CBT', 'Counseling Techniques', 'Crisis Intervention', 'Assessment'],
    description: 'Learn evidence-based mental health counseling and therapy techniques.',
    certification: 'Mental Health Counseling Certificate'
  },
  {
    id: 4,
    title: 'Physical Therapy & Rehabilitation',
    instructor: 'Dr. David Kim',
    rating: 4.8,
    reviews: 6543,
    price: 179.99,
    originalPrice: 349.99,
    duration: '45 hours',
    students: '8,500+',
    level: 'Intermediate',
    category: 'Physical Therapy',
    trending: false,
    skills: ['Exercise Therapy', 'Manual Therapy', 'Assessment', 'Treatment Planning'],
    description: 'Comprehensive physical therapy techniques for optimal patient outcomes.',
    certification: 'Physical Therapy Certificate'
  },
  {
    id: 5,
    title: 'Healthcare Technology & Informatics',
    instructor: 'Dr. Jennifer Park',
    rating: 4.6,
    reviews: 9876,
    price: 159.99,
    originalPrice: 299.99,
    duration: '35 hours',
    students: '14,000+',
    level: 'Intermediate',
    category: 'Medical Technology',
    trending: true,
    skills: ['EHR Systems', 'Health Informatics', 'Medical Devices', 'Data Analysis'],
    description: 'Master healthcare technology and digital health solutions.',
    certification: 'Healthcare Technology Certificate'
  },
  {
    id: 6,
    title: 'Clinical Pharmacy Practice',
    instructor: 'Dr. Robert Thompson',
    rating: 4.7,
    reviews: 5234,
    price: 139.99,
    originalPrice: 279.99,
    duration: '32 hours',
    students: '6,800+',
    level: 'Advanced',
    category: 'Pharmacy',
    trending: false,
    skills: ['Pharmacology', 'Drug Interactions', 'Patient Counseling', 'Clinical Practice'],
    description: 'Advanced pharmacy practice and clinical pharmaceutical care.',
    certification: 'Clinical Pharmacy Certificate'
  }
]

export default function MedicalPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedRoadmap, setSelectedRoadmap] = useState('registeredNurse')
  const [roadmapProgress, setRoadmapProgress] = useState(35)

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
      <section className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <Heart className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Medical & Healthcare Education
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Advance your healthcare career with comprehensive medical education, clinical skills training, and evidence-based practice courses.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search medical courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg rounded-xl bg-white/10 border-white/20 text-white placeholder-white/70"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">770+</div>
                <div className="text-sm opacity-80">Medical Courses</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">85K+</div>
                <div className="text-sm opacity-80">Healthcare Professionals</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm opacity-80">Certification Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold">4.8/5</div>
                <div className="text-sm opacity-80">Course Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Specializations */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Medical Specializations
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose your healthcare specialty and advance your medical career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {medicalSubcategories.map((subcategory) => (
              <Card key={subcategory.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${subcategory.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                    {subcategory.icon}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
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
                    {subcategory.skillCount} courses available
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Key Areas:</h4>
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

      {/* Featured Medical Courses */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Featured Medical Courses
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Top-rated courses from leading medical educators
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                <option value="all">All Specialties</option>
                {medicalSubcategories.map(cat => (
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
                    <div className="aspect-video bg-gradient-to-r from-red-500 to-pink-600 rounded-t-lg flex items-center justify-center">
                      <Heart className="h-12 w-12 text-white" />
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

                    <CardTitle className="text-xl group-hover:text-red-600 transition-colors line-clamp-2">
                      {course.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {course.instructor[0]}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{course.instructor}</span>
                    </div>

                    {/* Skills */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">Clinical Skills:</h4>
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
                      <Button size="sm" className="bg-red-600 hover:bg-red-700">
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

      {/* Medical Accreditation */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Accredited Medical Education
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Our courses meet the highest medical education standards
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Accredited Programs</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All courses are accredited by leading medical education bodies and recognized by healthcare institutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Evidence-Based Learning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Curriculum based on latest medical research and evidence-based practice guidelines.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional Certification</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn certificates recognized by medical boards and healthcare employers worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Medical Learning System */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Medical Education Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From medical fundamentals to advanced clinical practice - comprehensive healthcare education
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
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
                {medicalSubcategories.map((subcategory) => (
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
                        <span className="text-sm text-gray-500">{subcategory.skillCount} courses</span>
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
                {Object.entries(medicalLearningPaths).map(([level, path]) => (
                  <Card key={level} className="h-fit">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          level === 'beginner' ? 'bg-green-500' :
                          level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>
                          {level === 'beginner' ? <Target className="w-5 h-5" /> :
                           level === 'intermediate' ? <Stethoscope className="w-5 h-5" /> : <Award className="w-5 h-5" />}
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
                          <Button size="sm" className="w-full mt-3 bg-red-600 hover:bg-red-700">
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
                  <h3 className="text-xl font-bold">Choose Your Medical Career Path</h3>
                  {Object.entries(medicalRoadmaps).map(([key, roadmap]) => (
                    <Card
                      key={key}
                      className={`cursor-pointer transition-all ${
                        selectedRoadmap === key ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'
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
                        {medicalRoadmaps[selectedRoadmap as keyof typeof medicalRoadmaps].title}
                      </CardTitle>
                      <p className="text-gray-600">
                        Complete roadmap to become a certified {medicalRoadmaps[selectedRoadmap as keyof typeof medicalRoadmaps].title.toLowerCase()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {medicalRoadmaps[selectedRoadmap as keyof typeof medicalRoadmaps].steps.map((step, idx) => (
                        <div key={idx} className="relative">
                          {idx < medicalRoadmaps[selectedRoadmap as keyof typeof medicalRoadmaps].steps.length - 1 && (
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
                                  <h5 className="font-medium text-sm mb-2">Clinical Skills:</h5>
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

                              <Button size="sm" variant={step.completed ? 'secondary' : 'default'} className="bg-red-600 hover:bg-red-700">
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
                {Object.entries(medicalEncyclopedia).map(([category, section]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {section.topics.map((topic, idx) => (
                        <div key={idx} className="border-l-4 border-red-500 pl-4 space-y-2">
                          <h4 className="font-medium text-lg">{topic.name}</h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-red-600">Why Important:</span>
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

            {/* Medical Meetings Tab */}
            <TabsContent value="meetings" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Medical Sessions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Medical Education Sessions
                    </CardTitle>
                    <CardDescription>
                      Join real-time sessions with medical experts and healthcare professionals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: 'Advanced Cardiac Care Workshop',
                        instructor: 'Dr. Sarah Williams',
                        time: 'Today 1:00 PM',
                        participants: 45,
                        type: 'Workshop'
                      },
                      {
                        title: 'Mental Health Assessment Techniques',
                        instructor: 'Dr. Emma Rodriguez',
                        time: 'Tomorrow 3:00 PM',
                        participants: 38,
                        type: 'Masterclass'
                      },
                      {
                        title: 'Clinical Research Methods Q&A',
                        instructor: 'Dr. Michael Chen',
                        time: 'Wed 2:00 PM',
                        participants: 29,
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
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <Video className="w-4 h-4 mr-2" />
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Create Medical Meeting */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Organize Medical Session
                    </CardTitle>
                    <CardDescription>
                      Create your own medical education or clinical discussion session
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="flex items-center gap-2 h-20 flex-col bg-red-600 hover:bg-red-700">
                        <Video className="w-6 h-6" />
                        <span className="text-sm">Clinical Session</span>
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2 h-20 flex-col">
                        <Stethoscope className="w-6 h-6" />
                        <span className="text-sm">Case Study</span>
                      </Button>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Medical Session Types:</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <HeartHandshake className="w-4 h-4 mr-2" />
                          Patient Care Discussion
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Clipboard className="w-4 h-4 mr-2" />
                          Clinical Case Review
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Microscope className="w-4 h-4 mr-2" />
                          Research Collaboration
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Brain className="w-4 h-4 mr-2" />
                          Medical Study Group
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <h4 className="font-medium">Medical Tools Available:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Medical Whiteboard
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Case Presentation
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Medical Images
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

              {/* Medical Learning Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Medical Learning Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">22</div>
                      <div className="text-sm text-gray-600">Clinical Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">186</div>
                      <div className="text-sm text-gray-600">Learning Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">9</div>
                      <div className="text-sm text-gray-600">Medical Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">5</div>
                      <div className="text-sm text-gray-600">Certifications</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Medical Visualization Tools */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Interactive Medical Learning Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Master medical concepts through interactive simulations and 3D anatomical models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Anatomical Models */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="w-5 h-5" />
                  3D Anatomical Models
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-red-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive anatomy explorer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Human Heart</span>
                    <span className="text-red-600">3D Model</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Respiratory System</span>
                    <span className="text-green-600">Interactive</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nervous System</span>
                    <span className="text-purple-600">Simulation</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-red-600 bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  Explore Anatomy
                </Button>
              </CardContent>
            </Card>

            {/* Medical Simulations */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="w-5 h-5" />
                  Clinical Simulations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Stethoscope className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Virtual patient scenarios</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Patient Assessment</span>
                    <span className="text-blue-600">Simulation</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Emergency Response</span>
                    <span className="text-green-600">Scenario</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medication Admin</span>
                    <span className="text-purple-600">Practice</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-blue-600">
                  <Settings className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              </CardContent>
            </Card>

            {/* Diagnostic Tools */}
            <Card className="group hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="w-5 h-5" />
                  Diagnostic Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 mb-4 min-h-32 flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">AI-powered diagnosis trainer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Symptom Analysis</span>
                    <span className="text-blue-600">AI Tool</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Differential Diagnosis</span>
                    <span className="text-green-600">Assistant</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Case Studies</span>
                    <span className="text-purple-600">Interactive</span>
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-green-600">
                  <Bot className="w-4 h-4 mr-2" />
                  Try Diagnostic Tool
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 dark:bg-red-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Advance Your Medical Career Today
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of healthcare professionals who have enhanced their skills and advanced their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
              Start Learning
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
              View All Medical Courses
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}