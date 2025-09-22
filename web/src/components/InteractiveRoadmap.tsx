'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle,
  Circle,
  Clock,
  Users,
  Star,
  ArrowRight,
  BookOpen,
  Code,
  Trophy,
  Target,
  Rocket,
  Lightbulb,
  Zap,
  Calendar
} from 'lucide-react'

interface RoadmapStep {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  topics: string[]
  projects: string[]
  completed: boolean
  locked: boolean
  outcomes: string[]
}

const webDevRoadmap: RoadmapStep[] = [
  {
    id: 'foundations',
    title: 'Web Development Foundations',
    description: 'Build a solid foundation in web technologies and development tools',
    duration: '6-8 weeks',
    difficulty: 'Beginner',
    topics: [
      'HTML5 Semantic Elements',
      'CSS3 Flexbox & Grid',
      'JavaScript ES6+ Features',
      'DOM Manipulation',
      'Browser DevTools',
      'Version Control with Git',
      'Command Line Basics',
      'Package Managers (npm/yarn)'
    ],
    projects: [
      'Personal Portfolio Website',
      'Interactive Landing Page',
      'Calculator App',
      'Todo List Application'
    ],
    completed: true,
    locked: false,
    outcomes: [
      'Create responsive web pages',
      'Use modern JavaScript features',
      'Manage code with Git',
      'Debug web applications'
    ]
  },
  {
    id: 'frontend-frameworks',
    title: 'Modern Frontend Development',
    description: 'Master React ecosystem and modern frontend tools',
    duration: '8-10 weeks',
    difficulty: 'Intermediate',
    topics: [
      'React Components & JSX',
      'State Management (useState, useReducer)',
      'Effect Hooks & Lifecycle',
      'Context API & Props Drilling',
      'React Router for SPA',
      'TypeScript Integration',
      'Testing with Jest & RTL',
      'CSS-in-JS (Styled Components)',
      'Build Tools (Vite, Webpack)',
      'Performance Optimization'
    ],
    projects: [
      'E-commerce Product Catalog',
      'Social Media Dashboard',
      'Real-time Chat Application',
      'Movie Search App with API'
    ],
    completed: false,
    locked: false,
    outcomes: [
      'Build complex React applications',
      'Implement state management',
      'Write unit tests',
      'Optimize application performance'
    ]
  },
  {
    id: 'backend-development',
    title: 'Backend & API Development',
    description: 'Build robust server-side applications and APIs',
    duration: '8-10 weeks',
    difficulty: 'Intermediate',
    topics: [
      'Node.js & Express.js',
      'RESTful API Design',
      'GraphQL Fundamentals',
      'Database Design (SQL/NoSQL)',
      'MongoDB & Mongoose',
      'PostgreSQL & Prisma',
      'Authentication & Authorization',
      'JWT & Session Management',
      'Error Handling & Logging',
      'API Documentation (Swagger)'
    ],
    projects: [
      'Blog API with CRUD operations',
      'User Authentication System',
      'E-commerce Backend',
      'Real-time Notification Service'
    ],
    completed: false,
    locked: true,
    outcomes: [
      'Design and build REST APIs',
      'Implement secure authentication',
      'Work with databases',
      'Handle server-side logic'
    ]
  },
  {
    id: 'fullstack-integration',
    title: 'Full-Stack Integration',
    description: 'Connect frontend and backend for complete applications',
    duration: '6-8 weeks',
    difficulty: 'Advanced',
    topics: [
      'Frontend-Backend Communication',
      'State Management (Redux/Zustand)',
      'Real-time Features (WebSockets)',
      'File Upload & Processing',
      'Payment Integration (Stripe)',
      'Email Services',
      'Caching Strategies',
      'API Rate Limiting',
      'Security Best Practices',
      'Performance Monitoring'
    ],
    projects: [
      'Full-Stack E-commerce Platform',
      'Social Media Application',
      'Project Management Tool',
      'Learning Management System'
    ],
    completed: false,
    locked: true,
    outcomes: [
      'Build complete web applications',
      'Implement real-time features',
      'Handle payments and transactions',
      'Optimize full-stack performance'
    ]
  },
  {
    id: 'deployment-devops',
    title: 'Deployment & DevOps',
    description: 'Deploy and maintain applications in production',
    duration: '4-6 weeks',
    difficulty: 'Advanced',
    topics: [
      'Cloud Platforms (AWS, Vercel, Netlify)',
      'Docker Containerization',
      'CI/CD Pipelines',
      'Environment Configuration',
      'Domain & DNS Setup',
      'SSL Certificates',
      'Database Hosting',
      'Monitoring & Analytics',
      'Error Tracking (Sentry)',
      'Performance Optimization'
    ],
    projects: [
      'Dockerized Application Deployment',
      'CI/CD Pipeline Setup',
      'Production Environment Configuration',
      'Monitoring Dashboard'
    ],
    completed: false,
    locked: true,
    outcomes: [
      'Deploy applications to production',
      'Set up automated deployments',
      'Monitor application health',
      'Handle production issues'
    ]
  }
]

export default function InteractiveRoadmap({ subcategory = 'web-development' }: { subcategory?: string }) {
  const [selectedStep, setSelectedStep] = useState<RoadmapStep | null>(null)
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  const getStepIcon = (step: RoadmapStep, index: number) => {
    const icons = [
      <BookOpen className="w-6 h-6" />,
      <Code className="w-6 h-6" />,
      <Rocket className="w-6 h-6" />,
      <Lightbulb className="w-6 h-6" />,
      <Trophy className="w-6 h-6" />
    ]
    return icons[index] || <Circle className="w-6 h-6" />
  }

  const getStepColor = (step: RoadmapStep) => {
    if (step.completed) return 'from-green-500 to-emerald-600'
    if (step.locked) return 'from-gray-500 to-gray-600'
    return 'from-blue-500 to-purple-600'
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-500/20 border-green-400/30'
      case 'Intermediate': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30'
      case 'Advanced': return 'text-red-400 bg-red-500/20 border-red-400/30'
      case 'Expert': return 'text-purple-400 bg-purple-500/20 border-purple-400/30'
      default: return 'text-blue-400 bg-blue-500/20 border-blue-400/30'
    }
  }

  const totalDuration = webDevRoadmap.reduce((total, step) => {
    const weeks = parseInt(step.duration.split('-')[0])
    return total + weeks
  }, 0)

  const completedSteps = webDevRoadmap.filter(step => step.completed).length

  return (
    <div className="w-full bg-black/20 rounded-xl p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h3
          className="text-3xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Complete Learning Roadmap
        </motion.h3>
        <p className="text-gray-300 text-lg mb-6">
          Follow this structured path to become a professional {subcategory.replace('-', ' ')} developer
        </p>

        {/* Progress Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{totalDuration}+ weeks</div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedSteps}/{webDevRoadmap.length}</div>
            <div className="text-sm text-gray-400">Steps Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">15+</div>
            <div className="text-sm text-gray-400">Real Projects</div>
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>

        {/* Roadmap Steps */}
        <div className="space-y-12">
          {webDevRoadmap.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              {/* Content Card */}
              <motion.div
                className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoveredStep(step.id)}
                onHoverEnd={() => setHoveredStep(null)}
              >
                <Card
                  className="cursor-pointer transition-all duration-300 bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40"
                  onClick={() => setSelectedStep(step)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${getDifficultyColor(step.difficulty)}`}>
                        {step.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{step.duration}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Quick Preview */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <BookOpen className="w-4 h-4" />
                          <span>{step.topics.length} Topics</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <Target className="w-4 h-4" />
                          <span>{step.projects.length} Projects</span>
                        </div>
                      </div>

                      {/* Preview Topics */}
                      <div className="flex flex-wrap gap-1">
                        {step.topics.slice(0, 3).map((topic, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs bg-blue-500/20 text-blue-200">
                            {topic}
                          </Badge>
                        ))}
                        {step.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                            +{step.topics.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2 pt-2">
                        {step.completed ? (
                          <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        ) : step.locked ? (
                          <Badge className="bg-gray-500/20 text-gray-300 border-gray-400/30">
                            🔒 Locked
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                            📚 Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Timeline Node */}
              <motion.div
                className="absolute left-1/2 transform -translate-x-1/2 z-10"
                whileHover={{ scale: 1.2 }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getStepColor(step)} flex items-center justify-center text-white shadow-lg border-4 border-white/20`}>
                  {step.completed ? <CheckCircle className="w-8 h-8" /> : getStepIcon(step, index)}
                </div>

                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
              </motion.div>

              {/* Arrow for Flow */}
              {index < webDevRoadmap.length - 1 && (
                <motion.div
                  className="absolute left-1/2 transform -translate-x-1/2 top-20 z-5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: (index + 1) * 0.2 }}
                >
                  <ArrowRight className="w-6 h-6 text-gray-400 transform rotate-90" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detailed Step Modal */}
      <AnimatePresence>
        {selectedStep && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStep(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-white/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedStep.title}</h2>
                  <div className="flex items-center gap-4">
                    <Badge className={getDifficultyColor(selectedStep.difficulty)}>
                      {selectedStep.difficulty}
                    </Badge>
                    <span className="text-gray-300">{selectedStep.duration}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStep(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <p className="text-gray-300 text-lg mb-8">{selectedStep.description}</p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Topics */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Topics Covered
                  </h3>
                  <div className="space-y-2">
                    {selectedStep.topics.map((topic, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Zap className="w-4 h-4 text-blue-400" />
                        {topic}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Hands-on Projects
                  </h3>
                  <div className="space-y-2">
                    {selectedStep.projects.map((project, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-2 text-gray-300"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Code className="w-4 h-4 text-green-400" />
                        {project}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  What You'll Achieve
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedStep.outcomes.map((outcome, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 text-gray-300"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <CheckCircle className="w-4 h-4 text-purple-400" />
                      {outcome}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="flex justify-center mt-8">
                <Button
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  disabled={selectedStep.locked}
                  data-magnetic
                >
                  {selectedStep.completed ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Review Module
                    </>
                  ) : selectedStep.locked ? (
                    <>
                      🔒 Complete Previous Steps First
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Start This Module
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}