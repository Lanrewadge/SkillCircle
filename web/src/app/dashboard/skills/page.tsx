'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  DollarSign,
  Star,
  Users,
  Clock,
  Calendar,
  MessageCircle
} from 'lucide-react'

const skillSchema = z.object({
  skillId: z.string().min(1, 'Please select a skill'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  experience: z.string().min(10, 'Please provide more details about your experience'),
  hourlyRate: z.number().min(5).max(500),
  currency: z.string().default('USD')
})

type SkillFormData = z.infer<typeof skillSchema>

export default function SkillsPage() {
  const [isAddingSkill, setIsAddingSkill] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any>(null)

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      currency: 'USD',
      hourlyRate: 25
    }
  })

  // Mock data
  const mockUserSkills = [
    {
      id: 1,
      role: 'TEACHER',
      level: 'EXPERT',
      experience: '5+ years of professional React development',
      hourlyRate: 75,
      currency: 'USD',
      isActive: true,
      skill: {
        id: 1,
        name: 'React Development',
        category: { name: 'Technology', icon: '💻' }
      },
      students: 24,
      rating: 4.8,
      totalSessions: 89,
      totalEarnings: 6675
    },
    {
      id: 2,
      role: 'TEACHER',
      level: 'ADVANCED',
      experience: '4+ years of Python for web and data science',
      hourlyRate: 65,
      currency: 'USD',
      isActive: true,
      skill: {
        id: 2,
        name: 'Python Programming',
        category: { name: 'Technology', icon: '💻' }
      },
      students: 18,
      rating: 4.7,
      totalSessions: 52,
      totalEarnings: 3380
    }
  ]

  const mockAvailableSkills = [
    { id: 3, name: 'JavaScript Fundamentals', category: { name: 'Technology' } },
    { id: 4, name: 'Node.js Development', category: { name: 'Technology' } },
    { id: 5, name: 'Italian Cooking', category: { name: 'Cooking' } },
    { id: 6, name: 'Guitar Lessons', category: { name: 'Music' } }
  ]

  const mockLearningSkills = [
    {
      id: 3,
      role: 'LEARNER',
      level: 'BEGINNER',
      skill: {
        id: 5,
        name: 'Italian Cooking',
        category: { name: 'Cooking', icon: '🍳' }
      },
      teacher: {
        id: 2,
        name: 'Bob Smith',
        avatar: null,
        rating: 4.9
      },
      sessionsCompleted: 3,
      nextSession: '2024-01-20T14:00:00Z'
    }
  ]

  const onSubmit = (data: SkillFormData) => {
    console.log('Adding skill:', data)
    setIsAddingSkill(false)
    form.reset()
    // TODO: Call API to add skill
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
          <p className="text-gray-600 mt-2">
            Manage the skills you teach and learn
          </p>
        </div>
        <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>
                Add a skill you want to teach to others
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skill">Skill</Label>
                <Select onValueChange={(value) => form.setValue('skillId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAvailableSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id.toString()}>
                        {skill.name} - {skill.category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.skillId && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.skillId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Your Level</Label>
                <Select onValueChange={(value: any) => form.setValue('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                    <SelectItem value="EXPERT">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Description</Label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your experience with this skill..."
                  {...form.register('experience')}
                />
                {form.formState.errors.experience && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.experience.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    type="number"
                    min="5"
                    max="500"
                    {...form.register('hourlyRate', { valueAsNumber: true })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="USD" onValueChange={(value) => form.setValue('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddingSkill(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Skill</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="teaching">
            Skills I Teach ({mockUserSkills.length})
          </TabsTrigger>
          <TabsTrigger value="learning">
            Skills I'm Learning ({mockLearningSkills.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="teaching" className="space-y-6">
          <div className="grid gap-6">
            {mockUserSkills.map((userSkill) => (
              <Card key={userSkill.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{userSkill.skill.category.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{userSkill.skill.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{userSkill.level}</Badge>
                          <Badge variant={userSkill.isActive ? "default" : "secondary"}>
                            {userSkill.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Experience</h4>
                      <p className="text-gray-600 text-sm mb-4">{userSkill.experience}</p>

                      <div className="flex items-center space-x-1 mb-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-lg">
                          ${userSkill.hourlyRate}
                        </span>
                        <span className="text-gray-600">/{userSkill.currency} per hour</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {userSkill.students}
                        </div>
                        <div className="text-sm text-gray-600">Students</div>
                      </div>

                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {userSkill.rating}
                        </div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>

                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {userSkill.totalSessions}
                        </div>
                        <div className="text-sm text-gray-600">Sessions</div>
                      </div>

                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${userSkill.totalEarnings}
                        </div>
                        <div className="text-sm text-gray-600">Earned</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <Button variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Student Messages
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid gap-6">
            {mockLearningSkills.map((learningSkill) => (
              <Card key={learningSkill.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{learningSkill.skill.category.icon}</div>
                      <div>
                        <CardTitle className="text-xl">{learningSkill.skill.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{learningSkill.level}</Badge>
                          <Badge variant="secondary">Learning</Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Teacher
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Your Teacher</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={learningSkill.teacher.avatar} />
                          <AvatarFallback>
                            {learningSkill.teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h5 className="font-medium">{learningSkill.teacher.name}</h5>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm">{learningSkill.teacher.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sessions Completed:</span>
                        <span className="font-medium">{learningSkill.sessionsCompleted}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Next Session:</span>
                        <span className="font-medium">
                          {new Date(learningSkill.nextSession).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <Button>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Next Session
                    </Button>
                    <Button variant="outline">
                      View Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockLearningSkills.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No skills in progress
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start learning something new by finding a teacher
                  </p>
                  <Button>
                    Browse Skills
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}