'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSkillStore } from '@/stores/skillStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Search,
  MapPin,
  Star,
  Users,
  BookOpen,
  Filter,
  Loader2,
  Calendar,
  MessageCircle
} from 'lucide-react'

export default function BrowsePage() {
  const router = useRouter()
  const {
    categories,
    skills,
    teachers,
    searchResults,
    loading,
    fetchCategories,
    fetchSkills,
    searchSkills,
    searchTeachers
  } = useSkillStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchSkills()
    searchTeachers({ isTeacher: true, limit: 20 })
  }, [fetchCategories, fetchSkills, searchTeachers])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      searchSkills(query)
    } else {
      // Clear search results
      useSkillStore.setState({
        searchResults: { skills: [], teachers: [] }
      })
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
    fetchSkills(categoryId)
  }

  const displayedSkills = searchQuery
    ? searchResults.skills
    : activeCategory
      ? skills.filter(skill => skill.category.id === activeCategory)
      : skills

  const displayedTeachers = searchQuery
    ? searchResults.teachers
    : teachers

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Search Header */}
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Discover Skills & Teachers
        </h1>
        <p className="text-gray-600 mb-6">
          Find the perfect teacher to learn something new or share your expertise with others
        </p>

        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search for skills, teachers, or topics..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 text-lg h-12"
          />
        </div>
      </div>

      {/* Categories */}
      {!searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Browse by Category</CardTitle>
            <CardDescription>
              Explore skills organized by different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => {
                  setActiveCategory(null)
                  fetchSkills()
                }}
              >
                <BookOpen className="w-6 h-6" />
                <span className="text-sm">All Skills</span>
                <span className="text-xs text-gray-500">
                  {skills.length} skills
                </span>
              </Button>

              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "outline"}
                  className="h-auto p-4 flex flex-col items-center space-y-2"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                  <span className="text-xs text-gray-500">
                    {category._count.skills} skills
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="skills">
            Skills ({displayedSkills.length})
          </TabsTrigger>
          <TabsTrigger value="teachers">
            Teachers ({displayedTeachers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skills" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedSkills.map((skill) => (
                <Card key={skill.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {skill.description}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {skill.category.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {skill._count.userSkills} teachers
                        </span>
                      </div>
                      <Button size="sm">
                        Find Teachers
                      </Button>
                    </div>

                    {skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {skill.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {skill.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{skill.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{teacher.name}</CardTitle>
                          {teacher.verified && (
                            <Badge variant="default" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{teacher.rating}</span>
                            <span className="text-sm text-gray-500">
                              ({teacher.reviewCount})
                            </span>
                          </div>
                          {teacher.city && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {teacher.city}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {teacher.bio && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {teacher.bio}
                      </p>
                    )}

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {teacher.userSkills.slice(0, 3).map((userSkill) => (
                          <Badge key={userSkill.id} variant="outline" className="text-xs">
                            {userSkill.skill.name}
                          </Badge>
                        ))}
                        {teacher.userSkills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{teacher.userSkills.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">
                            ${teacher.userSkills[0]?.hourlyRate || 25}/hr
                          </span>
                          <span className="text-gray-500"> starting</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/dashboard/book?teacher=${teacher.id}&skill=${teacher.userSkills[0]?.skill.id}`)}
                          >
                            <Calendar className="h-3 w-3 mr-1" />
                            Book
                          </Button>
                          <Button size="sm">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}