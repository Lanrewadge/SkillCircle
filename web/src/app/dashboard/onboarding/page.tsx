'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  BookOpen,
  Target,
  MapPin,
  Star,
  Users,
  MessageCircle,
  Calendar,
  Sparkles
} from 'lucide-react'

interface OnboardingData {
  profileInfo: {
    name: string
    bio: string
    location: string
    profileType: 'learner' | 'teacher' | 'both'
  }
  skills: {
    teaching: string[]
    learning: string[]
  }
  preferences: {
    sessionTypes: string[]
    availability: string[]
    budget: string
    goals: string
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user, updateUser } = useAuthStore()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    profileInfo: {
      name: user?.name || '',
      bio: '',
      location: '',
      profileType: 'both'
    },
    skills: {
      teaching: [],
      learning: []
    },
    preferences: {
      sessionTypes: [],
      availability: [],
      budget: '',
      goals: ''
    }
  })

  const skillOptions = [
    'React Development', 'Python Programming', 'Italian Cooking', 'Spanish Language',
    'Guitar Playing', 'Yoga & Meditation', 'Photography', 'Data Science',
    'Digital Marketing', 'Graphic Design', 'Business Strategy', 'Public Speaking',
    'Creative Writing', 'Piano Playing', 'French Language', 'Personal Finance'
  ]

  const availabilityOptions = [
    'Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings',
    'Weekend Mornings', 'Weekend Afternoons', 'Weekend Evenings'
  ]

  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    // Update user profile with onboarding data
    updateUser({
      ...onboardingData.profileInfo,
      onboardingCompleted: true
    })
    router.push('/dashboard')
  }

  const updateProfileInfo = (field: string, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      profileInfo: { ...prev.profileInfo, [field]: value }
    }))
  }

  const toggleSkill = (skill: string, type: 'teaching' | 'learning') => {
    setOnboardingData(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [type]: prev.skills[type].includes(skill)
          ? prev.skills[type].filter(s => s !== skill)
          : [...prev.skills[type], skill]
      }
    }))
  }

  const updatePreferences = (field: string, value: string | string[]) => {
    setOnboardingData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-blue-600" />
              <h2 className="text-2xl font-bold mb-2">Welcome to SkillCircle!</h2>
              <p className="text-gray-600">Let's set up your profile to get you connected with the right people</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={onboardingData.profileInfo.name}
                  onChange={(e) => updateProfileInfo('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="bio">Tell us about yourself</Label>
                <Textarea
                  id="bio"
                  value={onboardingData.profileInfo.bio}
                  onChange={(e) => updateProfileInfo('bio', e.target.value)}
                  placeholder="Share your background, interests, or what you're passionate about..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={onboardingData.profileInfo.location}
                  onChange={(e) => updateProfileInfo('location', e.target.value)}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <Label>I'm interested in...</Label>
                <RadioGroup
                  value={onboardingData.profileInfo.profileType}
                  onValueChange={(value: 'learner' | 'teacher' | 'both') => updateProfileInfo('profileType', value)}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="learner" id="learner" />
                    <Label htmlFor="learner">Learning new skills</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teaching others</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Both learning and teaching</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-green-600" />
              <h2 className="text-2xl font-bold mb-2">What would you like to teach?</h2>
              <p className="text-gray-600">Select the skills you can share with others</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill, 'teaching')}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    onboardingData.skills.teaching.includes(skill)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {onboardingData.skills.teaching.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Selected Teaching Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.skills.teaching.map((skill) => (
                    <Badge key={skill} className="bg-green-100 text-green-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-purple-600" />
              <h2 className="text-2xl font-bold mb-2">What do you want to learn?</h2>
              <p className="text-gray-600">Choose skills you'd like to develop</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill, 'learning')}
                  className={`p-3 text-sm rounded-lg border-2 transition-all ${
                    onboardingData.skills.learning.includes(skill)
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {onboardingData.skills.learning.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-800 mb-2">Selected Learning Goals:</h3>
                <div className="flex flex-wrap gap-2">
                  {onboardingData.skills.learning.map((skill) => (
                    <Badge key={skill} className="bg-purple-100 text-purple-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-16 w-16 mx-auto mb-4 text-orange-600" />
              <h2 className="text-2xl font-bold mb-2">Set your preferences</h2>
              <p className="text-gray-600">Help us match you with the right opportunities</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>When are you typically available?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availabilityOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={onboardingData.preferences.availability.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updatePreferences('availability', [...onboardingData.preferences.availability, option])
                          } else {
                            updatePreferences('availability', onboardingData.preferences.availability.filter(a => a !== option))
                          }
                        }}
                      />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="budget">Preferred budget range (for learning)</Label>
                <Select value={onboardingData.preferences.budget} onValueChange={(value) => updatePreferences('budget', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="$20-50">$20-50 per session</SelectItem>
                    <SelectItem value="$51-100">$51-100 per session</SelectItem>
                    <SelectItem value="$101-200">$101-200 per session</SelectItem>
                    <SelectItem value="$200+">$200+ per session</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="goals">What are your main goals on SkillCircle?</Label>
                <Textarea
                  id="goals"
                  value={onboardingData.preferences.goals}
                  onChange={(e) => updatePreferences('goals', e.target.value)}
                  placeholder="Share what you hope to achieve through skill sharing..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps ? (
            <Button onClick={handleComplete} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Complete Setup
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex items-center gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-sm text-gray-500">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}