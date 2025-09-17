'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, Star, DollarSign, Users, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { skillsApi, categoriesApi } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

interface UserSkill {
  id: string
  skillId: string
  skillName: string
  skillIcon: string
  role: 'TEACHER' | 'LEARNER'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  hourlyRate?: number
  currency: string
  experience?: string
  certifications: string[]
  isActive: boolean
  students?: number
  rating?: number
  reviewCount?: number
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface SkillFormData {
  skillId: string
  role: 'TEACHER' | 'LEARNER'
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'
  hourlyRate: number
  currency: string
  experience: string
  certifications: string
}

export default function ManageSkillsPage() {
  const { user } = useAuthStore()
  const [userSkills, setUserSkills] = useState<UserSkill[]>([])
  const [availableSkills, setAvailableSkills] = useState([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState<SkillFormData>({
    skillId: '',
    role: 'LEARNER',
    level: 'BEGINNER',
    hourlyRate: 50,
    currency: 'USD',
    experience: '',
    certifications: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [skillsData, categoriesData] = await Promise.all([
        skillsApi.getAll(),
        categoriesApi.getAll()
      ])
      setAvailableSkills(skillsData)
      setCategories(categoriesData)

      // Mock user skills data
      setUserSkills([
        {
          id: '1',
          skillId: '2',
          skillName: 'React Development',
          skillIcon: '⚛️',
          role: 'TEACHER',
          level: 'EXPERT',
          hourlyRate: 85,
          currency: 'USD',
          experience: '5+ years building production React applications',
          certifications: ['React Developer Certification', 'Advanced JavaScript'],
          isActive: true,
          students: 22,
          rating: 4.8,
          reviewCount: 15
        },
        {
          id: '2',
          skillId: '1',
          skillName: 'Italian Cooking',
          skillIcon: '🍝',
          role: 'LEARNER',
          level: 'BEGINNER',
          hourlyRate: 0,
          currency: 'USD',
          experience: '',
          certifications: [],
          isActive: true
        },
        {
          id: '3',
          skillId: '4',
          skillName: 'Guitar Playing',
          skillIcon: '🎸',
          role: 'LEARNER',
          level: 'INTERMEDIATE',
          hourlyRate: 0,
          currency: 'USD',
          experience: '2 years self-taught, looking to improve technique',
          certifications: [],
          isActive: true
        }
      ])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSkill = () => {
    setSelectedSkill(null)
    setFormData({
      skillId: '',
      role: 'LEARNER',
      level: 'BEGINNER',
      hourlyRate: 50,
      currency: 'USD',
      experience: '',
      certifications: ''
    })
    setIsDialogOpen(true)
  }

  const handleEditSkill = (skill: UserSkill) => {
    setSelectedSkill(skill)
    setFormData({
      skillId: skill.skillId,
      role: skill.role,
      level: skill.level,
      hourlyRate: skill.hourlyRate || 50,
      currency: skill.currency,
      experience: skill.experience || '',
      certifications: skill.certifications.join(', ')
    })
    setIsDialogOpen(true)
  }

  const handleSaveSkill = async () => {
    try {
      // TODO: Call API to save skill
      console.log('Saving skill:', formData)

      if (selectedSkill) {
        // Update existing skill
        setUserSkills(userSkills.map(skill =>
          skill.id === selectedSkill.id
            ? {
                ...skill,
                role: formData.role,
                level: formData.level,
                hourlyRate: formData.hourlyRate,
                currency: formData.currency,
                experience: formData.experience,
                certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c)
              }
            : skill
        ))
      } else {
        // Add new skill
        const selectedAvailableSkill = availableSkills.find((s: any) => s.id === formData.skillId)
        if (selectedAvailableSkill) {
          const newSkill: UserSkill = {
            id: Date.now().toString(),
            skillId: formData.skillId,
            skillName: (selectedAvailableSkill as any).name,
            skillIcon: (selectedAvailableSkill as any).icon || '🎯',
            role: formData.role,
            level: formData.level,
            hourlyRate: formData.role === 'TEACHER' ? formData.hourlyRate : undefined,
            currency: formData.currency,
            experience: formData.experience,
            certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c),
            isActive: true
          }
          setUserSkills([...userSkills, newSkill])
        }
      }

      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save skill:', error)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      // TODO: Call API to delete skill
      setUserSkills(userSkills.filter(skill => skill.id !== skillId))
    } catch (error) {
      console.error('Failed to delete skill:', error)
    }
  }

  const teachingSkills = userSkills.filter(skill => skill.role === 'TEACHER')
  const learningSkills = userSkills.filter(skill => skill.role === 'LEARNER')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your skills...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Your Skills</h1>
          <p className="text-muted-foreground mt-2">
            Add skills you want to teach or learn, set your rates, and manage your expertise
          </p>
        </div>
        <Button onClick={handleAddSkill}>
          <Plus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teaching</p>
                <p className="text-2xl font-bold">{teachingSkills.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Students</p>
                <p className="text-2xl font-bold">
                  {teachingSkills.reduce((sum, skill) => sum + (skill.students || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Rate</p>
                <p className="text-2xl font-bold">
                  ${Math.round(teachingSkills.reduce((sum, skill) => sum + (skill.hourlyRate || 0), 0) / Math.max(teachingSkills.length, 1))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teaching Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Teaching Skills ({teachingSkills.length})
            </CardTitle>
            <CardDescription>
              Skills you offer to teach others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teachingSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No teaching skills yet</p>
                <p className="text-sm">Add a skill you can teach others!</p>
              </div>
            ) : (
              teachingSkills.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{skill.skillIcon}</div>
                      <div>
                        <h3 className="font-semibold">{skill.skillName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">{skill.level}</Badge>
                          <span className="text-sm text-muted-foreground">
                            ${skill.hourlyRate}/{skill.currency}/hour
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSkill(skill)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {skill.experience && (
                    <p className="text-sm text-muted-foreground mb-2">{skill.experience}</p>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      {skill.students && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{skill.students} students</span>
                        </div>
                      )}
                      {skill.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{skill.rating} ({skill.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <Badge variant={skill.isActive ? 'default' : 'secondary'}>
                      {skill.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Learning Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Skills ({learningSkills.length})
            </CardTitle>
            <CardDescription>
              Skills you want to learn from others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {learningSkills.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No learning goals yet</p>
                <p className="text-sm">Add a skill you want to learn!</p>
              </div>
            ) : (
              learningSkills.map((skill) => (
                <div key={skill.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{skill.skillIcon}</div>
                      <div>
                        <h3 className="font-semibold">{skill.skillName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{skill.level}</Badge>
                          <span className="text-sm text-muted-foreground">Learning</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSkill(skill)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {skill.experience && (
                    <p className="text-sm text-muted-foreground">{skill.experience}</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Skill Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedSkill ? 'Edit Skill' : 'Add New Skill'}
            </DialogTitle>
            <DialogDescription>
              {selectedSkill
                ? 'Update your skill information and preferences'
                : 'Add a skill you want to teach or learn'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!selectedSkill && (
              <div>
                <Label htmlFor="skill">Skill</Label>
                <Select
                  value={formData.skillId}
                  onValueChange={(value) => setFormData({ ...formData, skillId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSkills.map((skill: any) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        <div className="flex items-center gap-2">
                          <span>{skill.icon || '🎯'}</span>
                          <span>{skill.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'TEACHER' | 'LEARNER') => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEACHER">Teacher - I can teach this skill</SelectItem>
                  <SelectItem value="LEARNER">Learner - I want to learn this skill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Current Level</Label>
              <Select
                value={formData.level}
                onValueChange={(value: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT') =>
                  setFormData({ ...formData, level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'TEACHER' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
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
            )}

            <div>
              <Label htmlFor="experience">Experience / Background</Label>
              <Textarea
                id="experience"
                placeholder="Describe your experience with this skill..."
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="certifications">Certifications (comma-separated)</Label>
              <Input
                id="certifications"
                placeholder="e.g., React Developer Certification, Advanced JavaScript"
                value={formData.certifications}
                onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSkill}>
              {selectedSkill ? 'Update Skill' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}