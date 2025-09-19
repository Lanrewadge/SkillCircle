'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  Clock,
  Star,
  Brain,
  Code,
  FileText,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Target
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface AssessmentQuestion {
  id: string
  type: 'multiple-choice' | 'code' | 'essay' | 'practical'
  question: string
  options?: string[]
  correctAnswer?: string | number
  points: number
  timeLimit?: number
  codeTemplate?: string
  explanation?: string
}

interface SkillAssessmentProps {
  skillId: string
  skillName: string
  level: 'beginner' | 'intermediate' | 'advanced'
  onComplete: (result: AssessmentResult) => void
  onCancel: () => void
}

interface AssessmentResult {
  skillId: string
  score: number
  maxScore: number
  percentage: number
  level: string
  timeSpent: number
  answers: Record<string, any>
  feedback: string
  recommendations: string[]
  certificate?: {
    id: string
    url: string
  }
}

const mockQuestions: Record<string, AssessmentQuestion[]> = {
  'react': [
    {
      id: 'react_q1',
      type: 'multiple-choice',
      question: 'What is the purpose of the useState hook in React?',
      options: [
        'To manage component lifecycle',
        'To manage local component state',
        'To handle side effects',
        'To optimize performance'
      ],
      correctAnswer: 1,
      points: 10,
      explanation: 'useState is used to add state to functional components in React.'
    },
    {
      id: 'react_q2',
      type: 'code',
      question: 'Write a React component that displays a counter with increment and decrement buttons.',
      points: 20,
      timeLimit: 300,
      codeTemplate: `import React, { useState } from 'react';

function Counter() {
  // Your code here

  return (
    <div>
      {/* Your JSX here */}
    </div>
  );
}

export default Counter;`
    },
    {
      id: 'react_q3',
      type: 'multiple-choice',
      question: 'Which lifecycle method is equivalent to componentDidMount in functional components?',
      options: [
        'useEffect with empty dependency array',
        'useEffect with no dependency array',
        'useState',
        'useCallback'
      ],
      correctAnswer: 0,
      points: 15,
      explanation: 'useEffect with an empty dependency array runs once after the component mounts.'
    },
    {
      id: 'react_q4',
      type: 'essay',
      question: 'Explain the concept of props drilling in React and describe two ways to avoid it.',
      points: 25,
      timeLimit: 600
    },
    {
      id: 'react_q5',
      type: 'practical',
      question: 'Create a custom hook that fetches data from an API and handles loading states.',
      points: 30,
      timeLimit: 900,
      codeTemplate: `import { useState, useEffect } from 'react';

function useApiData(url) {
  // Implement the custom hook

  return { data, loading, error };
}`
    }
  ],
  'javascript': [
    {
      id: 'js_q1',
      type: 'multiple-choice',
      question: 'What is the difference between let, const, and var in JavaScript?',
      options: [
        'No difference, they are synonyms',
        'Different scoping rules and mutability',
        'Only syntax differences',
        'Performance differences only'
      ],
      correctAnswer: 1,
      points: 10
    },
    {
      id: 'js_q2',
      type: 'code',
      question: 'Write a function that debounces another function call.',
      points: 25,
      timeLimit: 600,
      codeTemplate: `function debounce(func, delay) {
  // Your implementation here
}`
    }
  ]
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({
  skillId,
  skillName,
  level,
  onComplete,
  onCancel
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null)

  // Get questions based on skill
  const questions = mockQuestions[skillId.toLowerCase()] || mockQuestions['javascript']
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

  // Reset question timer when question changes
  useEffect(() => {
    setQuestionStartTime(Date.now())
  }, [currentQuestionIndex])

  const handleAnswerChange = (value: any) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const calculateScore = () => {
    let totalScore = 0
    let maxScore = 0

    questions.forEach(question => {
      maxScore += question.points
      const userAnswer = answers[question.id]

      if (question.type === 'multiple-choice' && userAnswer === question.correctAnswer) {
        totalScore += question.points
      } else if (question.type === 'code' || question.type === 'practical') {
        // Simplified scoring for code questions
        if (userAnswer && userAnswer.trim().length > 50) {
          totalScore += Math.floor(question.points * 0.7) // Give partial credit
        }
      } else if (question.type === 'essay') {
        // Simplified scoring for essays
        if (userAnswer && userAnswer.trim().length > 100) {
          totalScore += Math.floor(question.points * 0.8)
        }
      }
    })

    return { totalScore, maxScore }
  }

  const getSkillLevel = (percentage: number) => {
    if (percentage >= 90) return 'Expert'
    if (percentage >= 75) return 'Advanced'
    if (percentage >= 60) return 'Intermediate'
    if (percentage >= 40) return 'Beginner'
    return 'Novice'
  }

  const generateRecommendations = (percentage: number, skillName: string) => {
    const recommendations = []

    if (percentage < 60) {
      recommendations.push(`Consider taking a foundational ${skillName} course`)
      recommendations.push(`Practice basic ${skillName} concepts daily`)
      recommendations.push(`Join a study group or find a mentor`)
    } else if (percentage < 80) {
      recommendations.push(`Work on intermediate ${skillName} projects`)
      recommendations.push(`Contribute to open source projects`)
      recommendations.push(`Consider advanced ${skillName} specializations`)
    } else {
      recommendations.push(`Share your knowledge by teaching others`)
      recommendations.push(`Explore cutting-edge ${skillName} features`)
      recommendations.push(`Consider becoming a ${skillName} mentor`)
    }

    return recommendations
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)

    try {
      const { totalScore, maxScore } = calculateScore()
      const percentage = Math.round((totalScore / maxScore) * 100)
      const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000)
      const achievedLevel = getSkillLevel(percentage)

      const result: AssessmentResult = {
        skillId,
        score: totalScore,
        maxScore,
        percentage,
        level: achievedLevel,
        timeSpent: finalTimeSpent,
        answers,
        feedback: `You scored ${totalScore} out of ${maxScore} points (${percentage}%). Your current skill level is ${achievedLevel}.`,
        recommendations: generateRecommendations(percentage, skillName),
        certificate: percentage >= 70 ? {
          id: `cert_${skillId}_${Date.now()}`,
          url: `/certificates/cert_${skillId}_${Date.now()}.pdf`
        } : undefined
      }

      setAssessmentResult(result)
      setShowResults(true)
      toast.success('Assessment completed successfully!')
    } catch (error) {
      toast.error('Failed to submit assessment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (showResults && assessmentResult) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              You've successfully completed the {skillName} assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {assessmentResult.score}/{assessmentResult.maxScore}
                </div>
                <div className="text-sm text-gray-600">Points Scored</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {assessmentResult.percentage}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {assessmentResult.level}
                </div>
                <div className="text-sm text-gray-600">Skill Level</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Breakdown</h3>
              <Progress value={assessmentResult.percentage} className="h-3" />
              <p className="text-sm text-gray-600">{assessmentResult.feedback}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recommendations</h3>
              <ul className="space-y-2">
                {assessmentResult.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {assessmentResult.certificate && (
              <Alert>
                <Award className="w-4 h-4" />
                <AlertDescription>
                  Congratulations! You've earned a certificate for this assessment.
                  <Button variant="link" className="p-0 h-auto ml-2">
                    Download Certificate
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex space-x-4">
              <Button onClick={() => onComplete(assessmentResult)} className="flex-1">
                Continue to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-6 h-6" />
                <span>{skillName} Assessment</span>
              </CardTitle>
              <CardDescription>
                Level: {level} • Question {currentQuestionIndex + 1} of {questions.length}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
              <Badge variant="outline">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </Badge>
            </div>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {currentQuestion.type === 'code' || currentQuestion.type === 'practical' ? (
              <Code className="w-5 h-5" />
            ) : currentQuestion.type === 'essay' ? (
              <FileText className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            <span>Question {currentQuestionIndex + 1}</span>
            <Badge variant="secondary">{currentQuestion.points} points</Badge>
          </CardTitle>
          <CardDescription>
            {currentQuestion.timeLimit && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Recommended time: {Math.floor(currentQuestion.timeLimit / 60)} minutes</span>
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="text-lg">{currentQuestion.question}</p>
          </div>

          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.id]?.toString()}
              onValueChange={(value) => handleAnswerChange(parseInt(value))}
            >
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Code Question */}
          {(currentQuestion.type === 'code' || currentQuestion.type === 'practical') && (
            <div className="space-y-2">
              <Label>Your Code:</Label>
              <Textarea
                value={answers[currentQuestion.id] || currentQuestion.codeTemplate || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="font-mono text-sm min-h-64"
                placeholder="Write your code here..."
              />
            </div>
          )}

          {/* Essay Question */}
          {currentQuestion.type === 'essay' && (
            <div className="space-y-2">
              <Label>Your Answer:</Label>
              <Textarea
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                className="min-h-32"
                placeholder="Write your detailed answer here..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel Assessment
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={submitAssessment}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
            </Button>
          ) : (
            <Button onClick={goToNextQuestion}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}