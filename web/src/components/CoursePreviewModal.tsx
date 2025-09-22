'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Play,
  Clock,
  Users,
  Star,
  Award,
  BookOpen,
  Code,
  Download,
  CheckCircle,
  ArrowRight,
  Target,
  TrendingUp,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    credentials: string
    rating: number
  }
  preview: {
    videoUrl: string
    thumbnail: string
    duration: string
  }
  stats: {
    duration: string
    students: number
    rating: number
    reviews: number
    level: string
  }
  curriculum: {
    modules: number
    lessons: number
    projects: number
    quizzes: number
  }
  skills: string[]
  outcomes: string[]
  requirements: string[]
  pricing: {
    original: number
    current: number
    discount: number
  }
  highlights: string[]
  testimonials: {
    name: string
    role: string
    content: string
    rating: number
  }[]
}

interface CoursePreviewModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
}

export default function CoursePreviewModal({ course, isOpen, onClose }: CoursePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'curriculum' | 'instructor' | 'reviews'>('overview')
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setActiveTab('overview')
      setIsVideoPlaying(false)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!course) return null

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'curriculum', label: 'Curriculum', icon: <Code className="w-4 h-4" /> },
    { id: 'instructor', label: 'Instructor', icon: <Users className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Course Info */}
                <div className="text-white">
                  <Badge className="mb-3 bg-white/20 text-white border-white/30">
                    {course.stats.level}
                  </Badge>
                  <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
                  <p className="text-blue-100 mb-4 leading-relaxed">{course.description}</p>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.stats.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.stats.students.toLocaleString()} students
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      {course.stats.rating} ({course.stats.reviews} reviews)
                    </div>
                  </div>
                </div>

                {/* Video Preview */}
                <div className="relative">
                  <motion.div
                    className="relative bg-black rounded-xl overflow-hidden aspect-video cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <img
                      src={course.preview.thumbnail}
                      alt="Course preview"
                      className="w-full h-full object-cover"
                    />

                    {!isVideoPlaying && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                        <motion.div
                          className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-8 h-8 text-gray-900 ml-1" />
                        </motion.div>
                      </div>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-white text-sm">
                      {course.preview.duration}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 border-b border-gray-700">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700/50'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/30'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* What You'll Learn */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                          <Target className="w-5 h-5 text-blue-400" />
                          What You'll Learn
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {course.outcomes.map((outcome, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-300">{outcome}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Skills You'll Gain</h3>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-600/20 text-blue-300 border-blue-500/30"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Requirements */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                        <div className="space-y-2">
                          {course.requirements.map((req, index) => (
                            <div key={index} className="flex items-center gap-3 text-gray-300">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Course Highlights */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Course Highlights</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                              <Award className="w-5 h-5 text-yellow-400" />
                              <span className="text-gray-300">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'curriculum' && (
                    <div className="space-y-6">
                      {/* Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-400">{course.curriculum.modules}</div>
                          <div className="text-gray-400 text-sm">Modules</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-400">{course.curriculum.lessons}</div>
                          <div className="text-gray-400 text-sm">Lessons</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-400">{course.curriculum.projects}</div>
                          <div className="text-gray-400 text-sm">Projects</div>
                        </div>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-400">{course.curriculum.quizzes}</div>
                          <div className="text-gray-400 text-sm">Quizzes</div>
                        </div>
                      </div>

                      {/* Sample Modules */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">Course Modules</h3>
                        <div className="space-y-3">
                          {['Introduction to Fundamentals', 'Core Concepts', 'Practical Implementation', 'Advanced Techniques', 'Final Project'].map((module, index) => (
                            <motion.div
                              key={index}
                              className="border border-gray-700 rounded-lg p-4 hover:bg-gray-800/50 transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <span className="text-white font-medium">{module}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'instructor' && (
                    <div className="space-y-6">
                      <div className="flex items-start gap-6">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{course.instructor.name}</h3>
                          <p className="text-blue-400 mb-3">{course.instructor.credentials}</p>
                          <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 fill-current text-yellow-400" />
                            <span className="text-white font-medium">{course.instructor.rating} Instructor Rating</span>
                          </div>
                          <div className="text-gray-300 leading-relaxed">
                            Expert instructor with over 10 years of experience in the field.
                            Has taught thousands of students and maintains high ratings across all courses.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-6">
                      {/* Rating Overview */}
                      <div className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-4xl font-bold text-white">{course.stats.rating}</div>
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                              ))}
                            </div>
                            <div className="text-gray-400 text-sm mt-1">{course.stats.reviews} reviews</div>
                          </div>
                          <div className="flex-1">
                            {[5, 4, 3, 2, 1].map((stars) => (
                              <div key={stars} className="flex items-center gap-3 mb-2">
                                <span className="text-gray-400 w-6">{stars}</span>
                                <div className="flex-1 bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${Math.random() * 80 + 10}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Sample Reviews */}
                      <div className="space-y-4">
                        {course.testimonials.map((testimonial, index) => (
                          <motion.div
                            key={index}
                            className="bg-gray-800 p-4 rounded-lg"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="font-medium text-white">{testimonial.name}</div>
                                <div className="text-gray-400 text-sm">{testimonial.role}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-300">{testimonial.content}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 border-t border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-gray-400 text-sm line-through">
                      ${course.pricing.original}
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${course.pricing.current}
                    </div>
                  </div>
                  <Badge className="bg-red-600 text-white">
                    {course.pricing.discount}% OFF
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Syllabus
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" data-magnetic>
                    <Play className="w-4 h-4 mr-2" />
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}