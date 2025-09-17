'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { allSkills, skillCategories, technologySkills, Skill, SkillCategory } from '@/data/skills'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Search,
  MapPin,
  Star,
  Users,
  BookOpen,
  Filter,
  Calendar,
  MessageCircle,
  Clock,
  DollarSign,
  Route,
  Target,
  Award,
  TrendingUp,
  ExternalLink
} from 'lucide-react'

// Mock teacher data
interface Teacher {
  id: string
  name: string
  avatar: string
  skillId: string
  level: string
  rating: number
  reviewCount: number
  hourlyRate: number
  location: string
  distance: string
  isOnline: boolean
  experience: string
  completedSessions: number
  nextAvailable: string
}

const mockTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    avatar: '/avatars/sarah.jpg',
    skillId: 'react-development',
    level: 'EXPERT',
    rating: 4.9,
    reviewCount: 47,
    hourlyRate: 85,
    location: 'San Francisco, CA',
    distance: '2.3 km away',
    isOnline: true,
    experience: '6+ years at Google, React core contributor',
    completedSessions: 150,
    nextAvailable: 'Today 3:00 PM'
  },
  {
    id: '2',
    name: 'James Wilson',
    avatar: '/avatars/james.jpg',
    skillId: 'python-programming',
    level: 'ADVANCED',
    rating: 4.8,
    reviewCount: 32,
    hourlyRate: 70,
    location: 'Austin, TX',
    distance: '1.8 km away',
    isOnline: false,
    experience: '5+ years in data science and web development',
    completedSessions: 95,
    nextAvailable: 'Tomorrow 10:00 AM'
  },
  {
    id: '3',
    name: 'Maria Gonzalez',
    avatar: '/avatars/maria.jpg',
    skillId: 'spanish-language',
    level: 'EXPERT',
    rating: 4.9,
    reviewCount: 65,
    hourlyRate: 45,
    location: 'Madrid, Spain',
    distance: 'Online only',
    isOnline: true,
    experience: 'Native speaker, 8+ years teaching experience',
    completedSessions: 200,
    nextAvailable: 'Today 5:00 PM'
  },
  {
    id: '4',
    name: 'Marco Rossi',
    avatar: '/avatars/marco.jpg',
    skillId: 'italian-cooking',
    level: 'EXPERT',
    rating: 4.9,
    reviewCount: 85,
    hourlyRate: 60,
    location: 'Rome, Italy',
    distance: 'Online + Local',
    isOnline: true,
    experience: 'Professional chef from Rome, family recipes',
    completedSessions: 120,
    nextAvailable: 'Tomorrow 2:00 PM'
  },
  {
    id: '5',
    name: 'Alex Thompson',
    avatar: '/avatars/alex.jpg',
    skillId: 'nodejs-development',
    level: 'ADVANCED',
    rating: 4.7,
    reviewCount: 28,
    hourlyRate: 75,
    location: 'London, UK',
    distance: '3.2 km away',
    isOnline: true,
    experience: '4+ years building scalable APIs',
    completedSessions: 68,
    nextAvailable: 'Today 8:00 PM'
  }
]

export default function BrowsePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(allSkills)
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>(mockTeachers)

  useEffect(() => {
    // Handle search query from URL parameters
    const searchParam = searchParams.get('search')
    if (searchParam) {
      setSearchQuery(searchParam)
      handleSearch(searchParam)
    }

    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setActiveCategory(categoryParam)
      filterByCategory(categoryParam)
    }
  }, [searchParams])

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredSkills(allSkills)
      setFilteredTeachers(mockTeachers)
      return
    }

    const searchResults = allSkills.filter(skill =>
      skill.name.toLowerCase().includes(query.toLowerCase()) ||
      skill.description.toLowerCase().includes(query.toLowerCase()) ||
      skill.category.name.toLowerCase().includes(query.toLowerCase())
    )

    const teacherResults = mockTeachers.filter(teacher => {
      const skill = allSkills.find(s => s.id === teacher.skillId)
      return skill?.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.name.toLowerCase().includes(query.toLowerCase()) ||
        teacher.experience.toLowerCase().includes(query.toLowerCase())
    })

    setFilteredSkills(searchResults)
    setFilteredTeachers(teacherResults)
  }

  const filterByCategory = (categoryId: string) => {
    const categorySkills = allSkills.filter(skill => skill.category.id === categoryId)
    const categoryTeachers = mockTeachers.filter(teacher => {
      const skill = allSkills.find(s => s.id === teacher.skillId)
      return skill?.category.id === categoryId
    })

    setFilteredSkills(categorySkills)
    setFilteredTeachers(categoryTeachers)
  }

  const clearFilters = () => {
    setActiveCategory(null)
    setSearchQuery('')
    setFilteredSkills(allSkills)
    setFilteredTeachers(mockTeachers)
    router.push('/dashboard/browse')
  }

  const getTeachersForSkill = (skillId: string) => {
    return mockTeachers.filter(teacher => teacher.skillId === skillId)
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Discover New Skills 🚀</h1>
        <p className="text-purple-100 mb-6">
          Explore our comprehensive skill catalog and find expert teachers
        </p>

        {/* Search */}
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search skills, teachers, or categories..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                handleSearch(e.target.value)
              }}
              className="pl-12 bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeCategory === null ? "default" : "outline"}
          onClick={clearFilters}
          size="sm"
        >
          All Categories
        </Button>
        {skillCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            onClick={() => {
              setActiveCategory(category.id)
              filterByCategory(category.id)
            }}
            size="sm"
            className="gap-2"
          >
            <span>{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Found {filteredSkills.length} skills and {filteredTeachers.length} teachers
          {activeCategory && (
            <span className="ml-2">
              in <Badge variant="secondary">{skillCategories.find(c => c.id === activeCategory)?.name}</Badge>
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">Skills ({filteredSkills.length})</TabsTrigger>
          <TabsTrigger value="teachers">Teachers ({filteredTeachers.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{skill.category.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <Badge variant="outline" className="mt-1">
                          {skill.category.name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{skill.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Market Rate:</span>
                      <span className="font-medium">
                        ${skill.averageHourlyRate.min}-${skill.averageHourlyRate.max}/{skill.averageHourlyRate.currency}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Learning Time:</span>
                      <span className="font-medium">{skill.estimatedLearningTime.beginner}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Available Teachers:</span>
                      <span className="font-medium">{getTeachersForSkill(skill.id).length}</span>
                    </div>
                  </div>

                  {skill.prerequisites && skill.prerequisites.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Prerequisites:</p>
                      <div className="flex flex-wrap gap-1">
                        {skill.prerequisites.slice(0, 3).map((prereq) => (
                          <Badge key={prereq} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                        {skill.prerequisites.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{skill.prerequisites.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedSkill(skill)}
                        >
                          <Route className="w-3 h-3 mr-1" />
                          Roadmap
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {skill.category.icon} {skill.name} Learning Roadmap
                          </DialogTitle>
                          <DialogDescription>
                            Complete learning path with projects and resources
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Skill Overview */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">Overview</h3>
                              <p className="text-sm text-gray-600">{skill.description}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">Learning Timeline</h3>
                              <div className="space-y-1 text-sm">
                                <div>Beginner: {skill.estimatedLearningTime.beginner}</div>
                                <div>Intermediate: {skill.estimatedLearningTime.intermediate}</div>
                                <div>Advanced: {skill.estimatedLearningTime.advanced}</div>
                                <div>Expert: {skill.estimatedLearningTime.expert}</div>
                              </div>
                            </div>
                          </div>

                          {/* Skill Levels */}
                          <div>
                            <h3 className="font-semibold mb-3">Skill Levels</h3>
                            <div className="grid gap-3">
                              {skill.levels.map((level, index) => (
                                <Card key={level.level} className="border-l-4 border-l-blue-500">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium">{level.title}</h4>
                                      <Badge variant={index === 0 ? "default" : "outline"}>
                                        {level.level}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{level.description}</p>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <p className="font-medium text-gray-700 mb-1">Requirements:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                          {level.requirements.map((req, i) => (
                                            <li key={i}>{req}</li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-700 mb-1">Outcomes:</p>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                          {level.outcomes.map((outcome, i) => (
                                            <li key={i}>{outcome}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Roadmap Steps */}
                          {skill.roadmap && skill.roadmap.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-3">Learning Roadmap</h3>
                              <div className="space-y-4">
                                {skill.roadmap.map((step, index) => (
                                  <Card key={step.id} className="border-l-4 border-l-green-500">
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between mb-2">
                                        <div>
                                          <h4 className="font-medium">{step.title}</h4>
                                          <p className="text-sm text-gray-600">{step.description}</p>
                                        </div>
                                        <div className="text-right">
                                          <Badge variant="outline">{step.level}</Badge>
                                          <p className="text-xs text-gray-500 mt-1">
                                            ~{step.estimatedHours}h
                                          </p>
                                        </div>
                                      </div>

                                      <div className="grid md:grid-cols-3 gap-3 mt-3">
                                        <div>
                                          <p className="font-medium text-sm text-gray-700 mb-1">Skills:</p>
                                          <div className="flex flex-wrap gap-1">
                                            {step.skills.map((skillName) => (
                                              <Badge key={skillName} variant="secondary" className="text-xs">
                                                {skillName}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>

                                        {step.projects && (
                                          <div>
                                            <p className="font-medium text-sm text-gray-700 mb-1">Projects:</p>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                              {step.projects.map((project, i) => (
                                                <li key={i}>• {project}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {step.resources && (
                                          <div>
                                            <p className="font-medium text-sm text-gray-700 mb-1">Resources:</p>
                                            <div className="space-y-1">
                                              {step.resources.map((resource, i) => (
                                                <div key={i} className="flex items-center gap-1 text-xs">
                                                  <Badge variant="outline" className="text-xs">
                                                    {resource.type}
                                                  </Badge>
                                                  <span className="text-gray-600">{resource.title}</span>
                                                  {resource.url && (
                                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Related Skills */}
                          {skill.relatedSkills && skill.relatedSkills.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-2">Related Skills</h3>
                              <div className="flex flex-wrap gap-2">
                                {skill.relatedSkills.map((relatedSkill) => (
                                  <Badge key={relatedSkill} variant="outline">
                                    {relatedSkill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex gap-3 pt-4 border-t">
                            <Button className="flex-1">
                              Find Teachers for {skill.name}
                            </Button>
                            <Button variant="outline">
                              Save to Learning Goals
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/dashboard/browse?skill=${skill.id}`)}
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Find Teachers
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredSkills.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No skills found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all categories
                </p>
                <Button onClick={clearFilters}>
                  View All Skills
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <div className="grid gap-6">
            {filteredTeachers.map((teacher) => {
              const skill = allSkills.find(s => s.id === teacher.skillId)
              return (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={teacher.avatar} />
                          <AvatarFallback>
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {teacher.isOnline && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{teacher.name}</h3>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{skill?.category.icon}</span>
                              <span className="font-medium">{skill?.name}</span>
                              <Badge variant="outline">{teacher.level}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{teacher.rating}</span>
                                <span>({teacher.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{teacher.distance}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{teacher.nextAvailable}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-green-600">
                              ${teacher.hourlyRate}
                            </div>
                            <div className="text-sm text-gray-600">per hour</div>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3">{teacher.experience}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-blue-600" />
                              <span>{teacher.completedSessions} sessions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="h-3 w-3 text-purple-600" />
                              <span>{teacher.level.toLowerCase()}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              Book Session
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredTeachers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No teachers found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all skills
                </p>
                <Button onClick={clearFilters}>
                  View All Teachers
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}