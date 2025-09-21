'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Star,
  Clock,
  DollarSign,
  Globe,
  Users,
  BookOpen,
  Award,
  Zap,
  ChevronDown,
  X,
  SlidersHorizontal,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'

interface SearchFilters {
  query: string
  categories: string[]
  skillLevel: string[]
  duration: number[]
  priceRange: number[]
  rating: number
  language: string[]
  format: string[]
  certification: boolean
  trending: boolean
  location: string
  availability: string[]
  instructor: string
  tags: string[]
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void
  initialFilters?: Partial<SearchFilters>
  resultCount?: number
}

const categories = [
  { id: 'technology', name: 'Technology', icon: '💻', count: 1250 },
  { id: 'business', name: 'Business', icon: '💼', count: 890 },
  { id: 'design', name: 'Design', icon: '🎨', count: 670 },
  { id: 'marketing', name: 'Marketing', icon: '📈', count: 540 },
  { id: 'health', name: 'Health & Fitness', icon: '🏥', count: 430 },
  { id: 'language', name: 'Languages', icon: '🗣️', count: 380 },
  { id: 'music', name: 'Music', icon: '🎵', count: 320 },
  { id: 'photography', name: 'Photography', icon: '📸', count: 290 },
  { id: 'cooking', name: 'Cooking', icon: '👨‍🍳', count: 250 },
  { id: 'science', name: 'Science', icon: '🔬', count: 210 }
]

const skillLevels = [
  { id: 'beginner', name: 'Beginner', icon: '🌱' },
  { id: 'intermediate', name: 'Intermediate', icon: '📚' },
  { id: 'advanced', name: 'Advanced', icon: '🚀' },
  { id: 'expert', name: 'Expert', icon: '👨‍🎓' }
]

const languages = [
  { id: 'english', name: 'English', flag: '🇺🇸' },
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'chinese', name: 'Chinese', flag: '🇨🇳' },
  { id: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { id: 'korean', name: 'Korean', flag: '🇰🇷' },
  { id: 'portuguese', name: 'Portuguese', flag: '🇵🇹' }
]

const formats = [
  { id: 'video', name: 'Video Lessons', icon: '🎥' },
  { id: 'live', name: 'Live Sessions', icon: '📹' },
  { id: 'text', name: 'Text-based', icon: '📖' },
  { id: 'interactive', name: 'Interactive', icon: '🎮' },
  { id: 'workshop', name: 'Workshops', icon: '🛠️' },
  { id: 'bootcamp', name: 'Bootcamps', icon: '⚡' }
]

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  resultCount = 0
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    categories: [],
    skillLevel: [],
    duration: [0, 50],
    priceRange: [0, 500],
    rating: 0,
    language: [],
    format: [],
    certification: false,
    trending: false,
    location: '',
    availability: [],
    instructor: '',
    tags: [],
    ...initialFilters
  })

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    onFiltersChange(filters)

    // Count active filters
    let count = 0
    if (filters.query) count++
    if (filters.categories.length > 0) count++
    if (filters.skillLevel.length > 0) count++
    if (filters.duration[0] > 0 || filters.duration[1] < 50) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++
    if (filters.rating > 0) count++
    if (filters.language.length > 0) count++
    if (filters.format.length > 0) count++
    if (filters.certification) count++
    if (filters.trending) count++
    if (filters.location) count++
    if (filters.availability.length > 0) count++
    if (filters.instructor) count++

    setActiveFiltersCount(count)
  }, [filters, onFiltersChange])

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleArrayFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      query: '',
      categories: [],
      skillLevel: [],
      duration: [0, 50],
      priceRange: [0, 500],
      rating: 0,
      language: [],
      format: [],
      certification: false,
      trending: false,
      location: '',
      availability: [],
      instructor: '',
      tags: []
    })
  }

  const getActiveFilterTags = () => {
    const tags = []

    if (filters.categories.length > 0) {
      filters.categories.forEach(cat => {
        const category = categories.find(c => c.id === cat)
        if (category) tags.push({ key: 'categories', value: cat, label: category.name })
      })
    }

    if (filters.skillLevel.length > 0) {
      filters.skillLevel.forEach(level => {
        const skillLevel = skillLevels.find(s => s.id === level)
        if (skillLevel) tags.push({ key: 'skillLevel', value: level, label: skillLevel.name })
      })
    }

    if (filters.language.length > 0) {
      filters.language.forEach(lang => {
        const language = languages.find(l => l.id === lang)
        if (language) tags.push({ key: 'language', value: lang, label: language.name })
      })
    }

    if (filters.format.length > 0) {
      filters.format.forEach(fmt => {
        const format = formats.find(f => f.id === fmt)
        if (format) tags.push({ key: 'format', value: fmt, label: format.name })
      })
    }

    if (filters.certification) {
      tags.push({ key: 'certification', value: 'true', label: 'Certification Available' })
    }

    if (filters.trending) {
      tags.push({ key: 'trending', value: 'true', label: 'Trending' })
    }

    return tags
  }

  const removeFilterTag = (key: string, value: string) => {
    if (key === 'certification' || key === 'trending') {
      updateFilter(key as keyof SearchFilters, false)
    } else {
      toggleArrayFilter(key as keyof SearchFilters, value)
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search for skills, courses, instructors..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10 text-lg h-12"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="h-12 px-6"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <Button className="h-12 px-8">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              {resultCount.toLocaleString()} results found
            </p>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </Button>
            )}
          </div>

          {/* Active Filter Tags */}
          {getActiveFilterTags().length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {getActiveFilterTags().map((tag, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {tag.label}
                  <button
                    onClick={() => removeFilterTag(tag.key, tag.value)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Advanced Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">

              {/* Categories */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Categories</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.id}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={() => toggleArrayFilter('categories', category.id)}
                      />
                      <Label htmlFor={category.id} className="flex items-center space-x-2 cursor-pointer">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                        <span className="text-xs text-gray-500">({category.count})</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Level */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Skill Level</Label>
                <div className="space-y-2">
                  {skillLevels.map((level) => (
                    <div key={level.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={level.id}
                        checked={filters.skillLevel.includes(level.id)}
                        onCheckedChange={() => toggleArrayFilter('skillLevel', level.id)}
                      />
                      <Label htmlFor={level.id} className="flex items-center space-x-2 cursor-pointer">
                        <span>{level.icon}</span>
                        <span>{level.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Languages</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {languages.map((language) => (
                    <div key={language.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={language.id}
                        checked={filters.language.includes(language.id)}
                        onCheckedChange={() => toggleArrayFilter('language', language.id)}
                      />
                      <Label htmlFor={language.id} className="flex items-center space-x-2 cursor-pointer">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Format */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Format</Label>
                <div className="space-y-2">
                  {formats.map((format) => (
                    <div key={format.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={format.id}
                        checked={filters.format.includes(format.id)}
                        onCheckedChange={() => toggleArrayFilter('format', format.id)}
                      />
                      <Label htmlFor={format.id} className="flex items-center space-x-2 cursor-pointer">
                        <span>{format.icon}</span>
                        <span>{format.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Duration (hours)</Label>
                <div className="px-2">
                  <Slider
                    value={filters.duration}
                    onValueChange={(value) => updateFilter('duration', value)}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{filters.duration[0]}h</span>
                    <span>{filters.duration[1]}h+</span>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Price Range ($)</Label>
                <div className="px-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value)}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${filters.priceRange[0]}</span>
                    <span>${filters.priceRange[1]}+</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Additional Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t">

              {/* Rating */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Minimum Rating</Label>
                <Select value={filters.rating.toString()} onValueChange={(value) => updateFilter('rating', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any rating</SelectItem>
                    <SelectItem value="4">4+ stars</SelectItem>
                    <SelectItem value="4.5">4.5+ stars</SelectItem>
                    <SelectItem value="5">5 stars only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="City, country, or timezone"
                    value={filters.location}
                    onChange={(e) => updateFilter('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Instructor */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Instructor</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by instructor name"
                    value={filters.instructor}
                    onChange={(e) => updateFilter('instructor', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

            </div>

            {/* Quick Filters */}
            <div className="space-y-3 pt-6 border-t">
              <Label className="text-base font-semibold">Quick Filters</Label>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certification"
                    checked={filters.certification}
                    onCheckedChange={(checked) => updateFilter('certification', checked)}
                  />
                  <Label htmlFor="certification" className="flex items-center space-x-2 cursor-pointer">
                    <Award className="w-4 h-4" />
                    <span>Certification Available</span>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={filters.trending}
                    onCheckedChange={(checked) => updateFilter('trending', checked)}
                  />
                  <Label htmlFor="trending" className="flex items-center space-x-2 cursor-pointer">
                    <TrendingUp className="w-4 h-4" />
                    <span>Trending Now</span>
                  </Label>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  )
}