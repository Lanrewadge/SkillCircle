'use client'

import React, { useState, useEffect } from 'react'
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters'
import {
  Grid3X3,
  List,
  Star,
  Clock,
  Users,
  Award,
  PlayCircle,
  BookOpen,
  Heart,
  Share2,
  TrendingUp,
  MapPin,
  Calendar,
  Globe,
  DollarSign,
  Filter,
  SortAsc,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SearchResult {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    rating: number
    students: number
  }
  category: string
  skillLevel: string
  duration: number
  price: number
  rating: number
  reviews: number
  students: number
  thumbnail: string
  languages: string[]
  format: string
  certification: boolean
  trending: boolean
  lastUpdated: string
  tags: string[]
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Complete React Development Bootcamp 2024',
    description: 'Master React, Redux, and modern JavaScript. Build real-world projects and become a frontend developer.',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/avatars/sarah.jpg',
      rating: 4.9,
      students: 15420
    },
    category: 'Technology',
    skillLevel: 'Intermediate',
    duration: 45,
    price: 89.99,
    rating: 4.8,
    reviews: 2341,
    students: 12450,
    thumbnail: '/courses/react-bootcamp.jpg',
    languages: ['English', 'Spanish'],
    format: 'Video',
    certification: true,
    trending: true,
    lastUpdated: '2024-01-15',
    tags: ['React', 'JavaScript', 'Frontend', 'Redux']
  },
  {
    id: '2',
    title: 'Digital Marketing Mastery: From Beginner to Expert',
    description: 'Learn SEO, social media marketing, content strategy, and analytics to grow any business online.',
    instructor: {
      name: 'Michael Chen',
      avatar: '/avatars/michael.jpg',
      rating: 4.7,
      students: 8930
    },
    category: 'Marketing',
    skillLevel: 'Beginner',
    duration: 32,
    price: 79.99,
    rating: 4.6,
    reviews: 1876,
    students: 9834,
    thumbnail: '/courses/digital-marketing.jpg',
    languages: ['English'],
    format: 'Video',
    certification: true,
    trending: false,
    lastUpdated: '2024-01-10',
    tags: ['SEO', 'Social Media', 'Marketing', 'Analytics']
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals with Figma',
    description: 'Design beautiful and user-friendly interfaces. Learn design principles, Figma, and prototyping.',
    instructor: {
      name: 'Emily Rodriguez',
      avatar: '/avatars/emily.jpg',
      rating: 4.9,
      students: 6750
    },
    category: 'Design',
    skillLevel: 'Beginner',
    duration: 28,
    price: 69.99,
    rating: 4.7,
    reviews: 1234,
    students: 5670,
    thumbnail: '/courses/ui-ux-design.jpg',
    languages: ['English', 'French'],
    format: 'Interactive',
    certification: false,
    trending: true,
    lastUpdated: '2024-01-12',
    tags: ['UI', 'UX', 'Figma', 'Design', 'Prototyping']
  }
]

const SearchPage = () => {
  const [results, setResults] = useState<SearchResult[]>(mockResults)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('relevance')
  const [filters, setFilters] = useState({})

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    // TODO: Apply filters to results
    console.log('Filters changed:', newFilters)
  }

  const handleSort = (value: string) => {
    setSortBy(value)
    // TODO: Sort results
    console.log('Sort by:', value)
  }

  const ResultCard = ({ result, isListView = false }: { result: SearchResult; isListView?: boolean }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isListView ? 'flex' : ''}`}>
      <div className={`relative ${isListView ? 'w-64 flex-shrink-0' : 'aspect-video'}`}>
        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
          <PlayCircle className="w-12 h-12 text-white opacity-80" />
        </div>
        {result.trending && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            Trending
          </Badge>
        )}
        <div className="absolute top-2 right-2 flex space-x-1">
          <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Heart className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
              {result.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {result.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback>{result.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-700">{result.instructor.name}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-600">{result.instructor.rating}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{result.duration}h</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{result.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{result.rating}</span>
                <span className="text-gray-400">({result.reviews})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {result.skillLevel}
              </Badge>
              {result.certification && (
                <Badge variant="outline" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                ${result.price}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Filters */}
        <AdvancedSearchFilters
          onFiltersChange={handleFiltersChange}
          resultCount={results.length}
        />

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Search Results</h1>
            <p className="text-gray-600 mt-1">
              Found {results.length.toLocaleString()} courses matching your criteria
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSort}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="students">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {results.map((result) => (
            <ResultCard
              key={result.id}
              result={result}
              isListView={viewMode === 'list'}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </div>

        {/* Related Searches */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Related Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                'React Hooks',
                'Vue.js',
                'Node.js',
                'TypeScript',
                'Next.js',
                'GraphQL',
                'MongoDB',
                'Express.js'
              ].map((term, index) => (
                <Button key={index} variant="outline" size="sm">
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SearchPage