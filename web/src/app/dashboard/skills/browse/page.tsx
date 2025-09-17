'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, MapPin, Star, Clock, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { skillsApi, teachersApi, categoriesApi } from '@/lib/api'

interface Teacher {
  id: string
  name: string
  avatar?: string
  bio?: string
  rating: number
  reviewCount: number
  verified: boolean
  city: string
  country: string
}

interface Skill {
  id: string
  name: string
  description: string
  categoryId: string
  tags: string[]
  icon?: string
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export default function BrowseSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('rating')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'skills' | 'teachers'>('skills')

  useEffect(() => {
    loadInitialData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      searchSkillsAndTeachers()
    } else {
      loadSkillsByCategory()
    }
  }, [searchQuery, selectedCategory])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [categoriesData, skillsData, teachersData] = await Promise.all([
        categoriesApi.getAll(),
        skillsApi.getAll(),
        teachersApi.search('')
      ])
      setCategories(categoriesData)
      setSkills(skillsData)
      setTeachers(teachersData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchSkillsAndTeachers = async () => {
    try {
      setLoading(true)
      const [skillResults, teacherResults] = await Promise.all([
        skillsApi.search(searchQuery),
        teachersApi.search(searchQuery)
      ])
      setSkills(skillResults)
      setTeachers(teacherResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSkillsByCategory = async () => {
    try {
      setLoading(true)
      if (selectedCategory === 'all') {
        const [skillsData, teachersData] = await Promise.all([
          skillsApi.getAll(),
          teachersApi.search('')
        ])
        setSkills(skillsData)
        setTeachers(teachersData)
      } else {
        const [skillsData, teachersData] = await Promise.all([
          categoriesApi.getSkillsByCategory(selectedCategory),
          teachersApi.search('')
        ])
        setSkills(skillsData)
        setTeachers(teachersData)
      }
    } catch (error) {
      console.error('Failed to load skills by category:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortedTeachers = [...teachers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.reviewCount - a.reviewCount
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const filteredSkills = skills.filter(skill =>
    selectedCategory === 'all' || skill.categoryId === selectedCategory
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Discover Skills & Teachers</h1>
        <p className="text-muted-foreground mt-2">
          Find the perfect teacher to learn any skill, from cooking to coding
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search skills or teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="reviews">Reviews</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 border-b-2 font-medium ${
            activeTab === 'skills'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('skills')}
        >
          Skills ({filteredSkills.length})
        </button>
        <button
          className={`px-4 py-2 border-b-2 font-medium ml-6 ${
            activeTab === 'teachers'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => setActiveTab('teachers')}
        >
          Teachers ({sortedTeachers.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'skills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{skill.icon || '🎯'}</div>
                      <div>
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {skill.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {skill.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {skill.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{skill.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <Button className="w-full" size="sm">
                      Find Teachers
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'teachers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          {teacher.verified && (
                            <Badge variant="secondary" className="text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>{teacher.rating}</span>
                            <span>({teacher.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{teacher.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {teacher.bio}
                    </p>
                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && activeTab === 'skills' && filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse a different category
          </p>
        </div>
      )}

      {!loading && activeTab === 'teachers' && sortedTeachers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👨‍🏫</div>
          <h3 className="text-xl font-semibold mb-2">No teachers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or browse a different category
          </p>
        </div>
      )}
    </div>
  )
}