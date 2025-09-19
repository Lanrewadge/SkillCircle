'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Brain,
  CheckCircle,
  Star,
  TrendingUp,
  Book,
  Award,
  ArrowRight
} from 'lucide-react'

interface QuickAssessmentQuestion {
  id: string
  question: string
  options: {
    text: string
    level: number // 1-5 scale
  }[]
}

interface SkillLevelTestProps {
  skillName: string
  onComplete: (level: SkillLevel) => void
  onCancel: () => void
}

interface SkillLevel {
  level: 'novice' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  score: number
  description: string
  nextSteps: string[]
}

const quickAssessmentQuestions: QuickAssessmentQuestion[] = [
  {
    id: 'experience',
    question: 'How would you describe your experience with this skill?',
    options: [
      { text: 'Complete beginner - never used it', level: 1 },
      { text: 'Some exposure - basic understanding', level: 2 },
      { text: 'Regular use - comfortable with fundamentals', level: 3 },
      { text: 'Experienced - handle complex tasks', level: 4 },
      { text: 'Expert - teach others and solve complex problems', level: 5 }
    ]
  },
  {
    id: 'comfort',
    question: 'How comfortable are you solving problems independently?',
    options: [
      { text: 'Need step-by-step guidance', level: 1 },
      { text: 'Can follow tutorials with some help', level: 2 },
      { text: 'Can solve most problems with documentation', level: 3 },
      { text: 'Solve complex problems independently', level: 4 },
      { text: 'Create solutions and help others debug', level: 5 }
    ]
  },
  {
    id: 'projects',
    question: 'What type of projects have you completed?',
    options: [
      { text: 'None - just starting to learn', level: 1 },
      { text: 'Tutorial projects and simple exercises', level: 2 },
      { text: 'Personal projects and assignments', level: 3 },
      { text: 'Professional/commercial projects', level: 4 },
      { text: 'Complex systems and architectural decisions', level: 5 }
    ]
  },
  {
    id: 'teaching',
    question: 'How often do you help others or share knowledge?',
    options: [
      { text: 'Never - I\'m still learning basics', level: 1 },
      { text: 'Rarely - mostly ask questions myself', level: 2 },
      { text: 'Sometimes - answer simple questions', level: 3 },
      { text: 'Often - mentor junior developers', level: 4 },
      { text: 'Regularly - teach courses or write content', level: 5 }
    ]
  },
  {
    id: 'concepts',
    question: 'How well do you understand advanced concepts?',
    options: [
      { text: 'Still learning basic syntax and concepts', level: 1 },
      { text: 'Understand basics, working on intermediate', level: 2 },
      { text: 'Comfortable with most intermediate concepts', level: 3 },
      { text: 'Strong grasp of advanced patterns and practices', level: 4 },
      { text: 'Deep understanding of internals and optimization', level: 5 }
    ]
  }
]

const skillLevelDescriptions = {
  novice: {
    level: 'novice' as const,
    score: 1,
    description: 'You\'re just starting your journey with this skill. Focus on learning fundamentals and building a strong foundation.',
    nextSteps: [
      'Start with beginner-friendly tutorials and courses',
      'Practice basic concepts daily',
      'Join community forums and study groups',
      'Find a mentor or study buddy'
    ]
  },
  beginner: {
    level: 'beginner' as const,
    score: 2,
    description: 'You have basic understanding and can follow tutorials. Time to start building simple projects.',
    nextSteps: [
      'Build simple personal projects',
      'Follow along with guided tutorials',
      'Learn best practices and conventions',
      'Start reading documentation regularly'
    ]
  },
  intermediate: {
    level: 'intermediate' as const,
    score: 3,
    description: 'You can work independently on most tasks and understand core concepts well.',
    nextSteps: [
      'Take on more complex projects',
      'Learn advanced patterns and architectures',
      'Contribute to open source projects',
      'Start mentoring beginners'
    ]
  },
  advanced: {
    level: 'advanced' as const,
    score: 4,
    description: 'You have strong expertise and can handle complex problems and architectural decisions.',
    nextSteps: [
      'Lead technical projects and teams',
      'Share knowledge through teaching or writing',
      'Explore cutting-edge features and techniques',
      'Contribute to the community and ecosystem'
    ]
  },
  expert: {
    level: 'expert' as const,
    score: 5,
    description: 'You have mastery-level knowledge and regularly help others learn and solve complex problems.',
    nextSteps: [
      'Become a thought leader in the field',
      'Create educational content and courses',
      'Speak at conferences and events',
      'Innovate and push the boundaries of the skill'
    ]
  }
}

export const SkillLevelTest: React.FC<SkillLevelTestProps> = ({
  skillName,
  onComplete,
  onCancel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [assessedLevel, setAssessedLevel] = useState<SkillLevel | null>(null)

  const currentQuestion = quickAssessmentQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quickAssessmentQuestions.length - 1
  const progress = ((currentQuestionIndex + 1) / quickAssessmentQuestions.length) * 100

  const handleAnswerSelect = (level: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: level
    }))
  }

  const goToNextQuestion = () => {
    if (answers[currentQuestion.id]) {
      if (isLastQuestion) {
        calculateLevel()
      } else {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }
  }

  const calculateLevel = () => {
    const scores = Object.values(answers)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

    let levelKey: keyof typeof skillLevelDescriptions
    if (averageScore <= 1.5) levelKey = 'novice'
    else if (averageScore <= 2.5) levelKey = 'beginner'
    else if (averageScore <= 3.5) levelKey = 'intermediate'
    else if (averageScore <= 4.5) levelKey = 'advanced'
    else levelKey = 'expert'

    const level = { ...skillLevelDescriptions[levelKey], score: Math.round(averageScore * 20) }
    setAssessedLevel(level)
    setShowResults(true)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'novice': return 'text-gray-600'
      case 'beginner': return 'text-blue-600'
      case 'intermediate': return 'text-green-600'
      case 'advanced': return 'text-orange-600'
      case 'expert': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'novice': return <Book className="w-6 h-6" />
      case 'beginner': return <TrendingUp className="w-6 h-6" />
      case 'intermediate': return <CheckCircle className="w-6 h-6" />
      case 'advanced': return <Star className="w-6 h-6" />
      case 'expert': return <Award className="w-6 h-6" />
      default: return <Brain className="w-6 h-6" />
    }
  }

  if (showResults && assessedLevel) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              assessedLevel.level === 'expert' ? 'bg-purple-100' :
              assessedLevel.level === 'advanced' ? 'bg-orange-100' :
              assessedLevel.level === 'intermediate' ? 'bg-green-100' :
              assessedLevel.level === 'beginner' ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <div className={getLevelColor(assessedLevel.level)}>
                {getLevelIcon(assessedLevel.level)}
              </div>
            </div>
            <CardTitle className="text-2xl">Your {skillName} Level</CardTitle>
            <CardDescription>
              Based on your responses, here's your skill assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${getLevelColor(assessedLevel.level)} border-current`}
              >
                {assessedLevel.level.charAt(0).toUpperCase() + assessedLevel.level.slice(1)}
              </Badge>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold">{assessedLevel.score}/100</span>
                <span className="text-gray-600">skill points</span>
              </div>
            </div>

            <div className="space-y-4">
              <Progress value={assessedLevel.score} className="h-3" />
              <p className="text-center text-gray-600">{assessedLevel.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommended Next Steps</h3>
              <ul className="space-y-2">
                {assessedLevel.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={onCancel}>
                Back to Skills
              </Button>
              <Button onClick={() => onComplete(assessedLevel)}>
                Find Teachers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6" />
            <span>{skillName} Level Assessment</span>
          </CardTitle>
          <CardDescription>
            Quick assessment to determine your current skill level
          </CardDescription>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {quickAssessmentQuestions.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          <CardDescription>
            Select the option that best describes your current level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion.id]?.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <RadioGroupItem value={option.level.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= option.level
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={goToNextQuestion}
          disabled={!answers[currentQuestion.id]}
        >
          {isLastQuestion ? 'Get Results' : 'Next Question'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}