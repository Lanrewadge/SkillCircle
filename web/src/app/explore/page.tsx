'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Star,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
  Code,
  Palette,
  Globe,
  Music,
  Camera,
  Utensils,
  Dumbbell,
  Briefcase,
  Heart,
  Laptop,
  Smartphone,
  Database,
  Cloud,
  Shield,
  Brain,
  ChevronRight,
  MapPin
} from 'lucide-react'

const skillCategories = [
  {
    id: 'technology',
    name: 'Technology & Programming',
    icon: <Code className="w-8 h-8" />,
    description: 'Master the digital future with cutting-edge tech skills',
    color: 'bg-blue-500',
    skillCount: 850,
    subcategories: [
      { name: 'Web Development', skills: 120, trending: true },
      { name: 'Mobile App Development', skills: 85, trending: true },
      { name: 'Data Science & AI', skills: 95, trending: true },
      { name: 'Cloud Computing', skills: 70, trending: true },
      { name: 'Cybersecurity', skills: 65, trending: true },
      { name: 'DevOps & Infrastructure', skills: 55, trending: false },
      { name: 'Game Development', skills: 45, trending: false },
      { name: 'Blockchain & Crypto', skills: 35, trending: true },
      { name: 'IoT & Embedded Systems', skills: 30, trending: false },
      { name: 'Virtual/Augmented Reality', skills: 25, trending: true }
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare',
    icon: <Heart className="w-8 h-8" />,
    description: 'Healthcare skills for medical professionals and caregivers',
    color: 'bg-red-500',
    skillCount: 420,
    subcategories: [
      { name: 'Nursing', skills: 85, trending: true },
      { name: 'Medicine', skills: 120, trending: true },
      { name: 'Physical Therapy', skills: 45, trending: false },
      { name: 'Medical Technology', skills: 55, trending: true },
      { name: 'Healthcare Administration', skills: 40, trending: false },
      { name: 'Mental Health', skills: 35, trending: true },
      { name: 'Pharmacy', skills: 25, trending: false },
      { name: 'Medical Research', skills: 15, trending: true }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Manufacturing',
    icon: <Laptop className="w-8 h-8" />,
    description: 'Engineering disciplines and manufacturing expertise',
    color: 'bg-gray-600',
    skillCount: 680,
    subcategories: [
      { name: 'Mechanical Engineering', skills: 120, trending: false },
      { name: 'Electrical Engineering', skills: 95, trending: true },
      { name: 'Civil Engineering', skills: 85, trending: false },
      { name: 'Chemical Engineering', skills: 70, trending: false },
      { name: 'Software Engineering', skills: 150, trending: true },
      { name: 'Industrial Engineering', skills: 60, trending: false },
      { name: 'Aerospace Engineering', skills: 45, trending: true },
      { name: 'Environmental Engineering', skills: 35, trending: true },
      { name: 'Biomedical Engineering', skills: 20, trending: true }
    ]
  },
  {
    id: 'fashion',
    name: 'Fashion & Textiles',
    icon: <Camera className="w-8 h-8" />,
    description: 'Fashion design, styling, and textile arts',
    color: 'bg-pink-500',
    skillCount: 280,
    subcategories: [
      { name: 'Fashion Design', skills: 65, trending: true },
      { name: 'Fashion Styling', skills: 45, trending: true },
      { name: 'Pattern Making', skills: 35, trending: false },
      { name: 'Textile Design', skills: 40, trending: false },
      { name: 'Fashion Business', skills: 30, trending: true },
      { name: 'Sustainable Fashion', skills: 25, trending: true },
      { name: 'Fashion Photography', skills: 20, trending: false },
      { name: 'Fashion Marketing', skills: 20, trending: true }
    ]
  },
  {
    id: 'design',
    name: 'Design & Creative Arts',
    icon: <Palette className="w-8 h-8" />,
    description: 'Express creativity through visual and digital arts',
    color: 'bg-purple-500',
    skillCount: 420,
    subcategories: [
      { name: 'UI/UX Design', skills: 80, trending: true },
      { name: 'Graphic Design', skills: 75, trending: false },
      { name: 'Digital Illustration', skills: 60, trending: true },
      { name: 'Motion Graphics', skills: 45, trending: true },
      { name: 'Photography', skills: 55, trending: false },
      { name: 'Video Production', skills: 50, trending: true },
      { name: '3D Modeling & Animation', skills: 40, trending: true },
      { name: 'Brand Design', skills: 35, trending: false }
    ]
  },
  {
    id: 'languages',
    name: 'Languages & Communication',
    icon: <Globe className="w-8 h-8" />,
    description: 'Connect with the world through language mastery',
    color: 'bg-green-500',
    skillCount: 320,
    subcategories: [
      { name: 'English', skills: 85, trending: true },
      { name: 'Spanish', skills: 70, trending: true },
      { name: 'French', skills: 55, trending: false },
      { name: 'German', skills: 45, trending: false },
      { name: 'Mandarin Chinese', skills: 60, trending: true },
      { name: 'Japanese', skills: 40, trending: true },
      { name: 'Arabic', skills: 35, trending: false },
      { name: 'Italian', skills: 30, trending: false }
    ]
  },
  {
    id: 'music',
    name: 'Music & Audio',
    icon: <Music className="w-8 h-8" />,
    description: 'Create harmony and master musical instruments',
    color: 'bg-red-500',
    skillCount: 180,
    subcategories: [
      { name: 'Guitar', skills: 35, trending: true },
      { name: 'Piano', skills: 40, trending: true },
      { name: 'Voice Training', skills: 25, trending: false },
      { name: 'Music Production', skills: 30, trending: true },
      { name: 'Drums', skills: 20, trending: false },
      { name: 'Violin', skills: 15, trending: false },
      { name: 'DJ & Electronic Music', skills: 15, trending: true }
    ]
  },
  {
    id: 'cooking',
    name: 'Cooking & Culinary Arts',
    icon: <Utensils className="w-8 h-8" />,
    description: 'Master culinary techniques from around the world',
    color: 'bg-orange-500',
    skillCount: 250,
    subcategories: [
      { name: 'International Cuisine', skills: 60, trending: true },
      { name: 'Baking & Pastry', skills: 45, trending: true },
      { name: 'Healthy Cooking', skills: 35, trending: true },
      { name: 'Professional Techniques', skills: 40, trending: false },
      { name: 'Vegetarian & Vegan', skills: 30, trending: true },
      { name: 'Wine & Beverage', skills: 25, trending: false },
      { name: 'Food Photography', skills: 15, trending: true }
    ]
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    icon: <Dumbbell className="w-8 h-8" />,
    description: 'Achieve physical and mental wellness goals',
    color: 'bg-emerald-500',
    skillCount: 190,
    subcategories: [
      { name: 'Personal Training', skills: 40, trending: true },
      { name: 'Yoga & Meditation', skills: 35, trending: true },
      { name: 'Nutrition & Diet', skills: 30, trending: true },
      { name: 'Martial Arts', skills: 25, trending: false },
      { name: 'Dance & Movement', skills: 30, trending: true },
      { name: 'Mental Health', skills: 20, trending: true },
      { name: 'Sports Training', skills: 15, trending: false }
    ]
  },
  {
    id: 'business',
    name: 'Business & Finance',
    icon: <Briefcase className="w-8 h-8" />,
    description: 'Build entrepreneurial and financial expertise',
    color: 'bg-indigo-500',
    skillCount: 380,
    subcategories: [
      { name: 'Digital Marketing', skills: 70, trending: true },
      { name: 'Financial Planning', skills: 50, trending: true },
      { name: 'Project Management', skills: 60, trending: true },
      { name: 'Sales & Negotiation', skills: 45, trending: false },
      { name: 'Entrepreneurship', skills: 55, trending: true },
      { name: 'Real Estate', skills: 35, trending: false },
      { name: 'Cryptocurrency', skills: 30, trending: true },
      { name: 'Leadership', skills: 40, trending: true }
    ]
  },
  {
    id: 'crafts',
    name: 'Arts & Crafts',
    icon: <Heart className="w-8 h-8" />,
    description: 'Create beautiful handmade items and artwork',
    color: 'bg-pink-500',
    skillCount: 160,
    subcategories: [
      { name: 'Woodworking', skills: 30, trending: true },
      { name: 'Pottery & Ceramics', skills: 25, trending: false },
      { name: 'Jewelry Making', skills: 20, trending: true },
      { name: 'Knitting & Sewing', skills: 35, trending: false },
      { name: 'Painting & Drawing', skills: 40, trending: false },
      { name: 'Calligraphy', skills: 15, trending: true }
    ]
  }
]

const featuredSkills = [
  {
    id: 1,
    title: 'React Development Mastery',
    category: 'Technology',
    level: 'Intermediate',
    rating: 4.9,
    students: 1200,
    duration: '8 weeks',
    instructor: 'Sarah Johnson',
    description: 'Master modern React with hooks, context, and best practices',
    thumbnail: '/skills/react.jpg',
    trending: true,
    roadmap: ['JavaScript Fundamentals', 'React Basics', 'Hooks & State', 'Context API', 'Advanced Patterns', 'Testing', 'Performance', 'Real Projects']
  },
  {
    id: 2,
    title: 'Spanish Conversation Fluency',
    category: 'Languages',
    level: 'Beginner',
    rating: 4.8,
    students: 850,
    duration: '12 weeks',
    instructor: 'Maria Rodriguez',
    description: 'Speak Spanish confidently in everyday situations',
    thumbnail: '/skills/spanish.jpg',
    trending: true,
    roadmap: ['Basic Vocabulary', 'Grammar Essentials', 'Pronunciation', 'Common Phrases', 'Conversations', 'Cultural Context', 'Advanced Topics', 'Fluency Practice']
  },
  {
    id: 3,
    title: 'UI/UX Design Complete Course',
    category: 'Design',
    level: 'Beginner',
    rating: 4.7,
    students: 2100,
    duration: '10 weeks',
    instructor: 'Alex Chen',
    description: 'Design beautiful and user-friendly interfaces',
    thumbnail: '/skills/uxui.jpg',
    trending: true,
    roadmap: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping', 'Visual Design', 'Usability Testing', 'Design Systems', 'Portfolio Building']
  },
  {
    id: 4,
    title: 'Guitar for Beginners',
    category: 'Music',
    level: 'Beginner',
    rating: 4.6,
    students: 680,
    duration: '6 weeks',
    instructor: 'Mike Thompson',
    description: 'Learn to play your favorite songs on acoustic guitar',
    thumbnail: '/skills/guitar.jpg',
    trending: false,
    roadmap: ['Guitar Basics', 'Chords & Scales', 'Strumming Patterns', 'Fingerpicking', 'Song Practice', 'Performance Skills']
  },
  {
    id: 5,
    title: 'Italian Cooking Fundamentals',
    category: 'Cooking',
    level: 'Beginner',
    rating: 4.8,
    students: 920,
    duration: '4 weeks',
    instructor: 'Giuseppe Romano',
    description: 'Master authentic Italian recipes and techniques',
    thumbnail: '/skills/cooking.jpg',
    trending: true,
    roadmap: ['Italian Ingredients', 'Pasta Making', 'Sauces & Bases', 'Regional Dishes', 'Desserts', 'Wine Pairing']
  },
  {
    id: 6,
    title: 'Personal Fitness Training',
    category: 'Fitness',
    level: 'All Levels',
    rating: 4.9,
    students: 1500,
    duration: '8 weeks',
    instructor: 'Jennifer Davis',
    description: 'Build strength, endurance, and achieve your fitness goals',
    thumbnail: '/skills/fitness.jpg',
    trending: true,
    roadmap: ['Fitness Assessment', 'Exercise Fundamentals', 'Strength Training', 'Cardio Workouts', 'Nutrition Planning', 'Progress Tracking', 'Advanced Techniques', 'Lifestyle Integration']
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('popular')

  const filteredSkills = featuredSkills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' ||
                          skill.category.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Explore Amazing Skills
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Discover thousands of skills taught by expert instructors. From technology to arts,
            find your passion and start learning today.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for skills, topics, or instructors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg rounded-xl border-2 border-border/50 bg-background/80 backdrop-blur-sm focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-blue-600">2,500+</div>
              <div className="text-sm text-muted-foreground">Available Skills</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-green-600">15k+</div>
              <div className="text-sm text-muted-foreground">Active Learners</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-purple-600">800+</div>
              <div className="text-sm text-muted-foreground">Expert Teachers</div>
            </div>
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border border-border/50">
              <div className="text-2xl font-bold text-orange-600">4.8/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Skill Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find the perfect skill category that matches your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category) => (
              <Link key={category.id} href={`/explore/${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-0 bg-background/80 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">
                        {category.skillCount} skills available
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="space-y-1">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{sub.name}</span>
                          <div className="flex items-center gap-1">
                            {sub.trending && (
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            )}
                            <span className="text-muted-foreground">{sub.skills}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Skills */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Featured Skills
              </h2>
              <p className="text-xl text-muted-foreground">
                Popular skills trending among learners this month
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="all">All Categories</option>
                {skillCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSkills.map((skill) => (
              <Link key={skill.id} href={`/skills/${skill.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden border-0 bg-background">
                  {/* Skill Image */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 left-4">
                      {skill.trending && (
                        <Badge className="bg-red-500 text-white">
                          🔥 Trending
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800">
                        {skill.level}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs">
                        {skill.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{skill.rating}</span>
                      </div>
                    </div>

                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors line-clamp-2">
                      {skill.title}
                    </CardTitle>

                    <CardDescription className="text-sm line-clamp-2">
                      {skill.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Instructor */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {skill.instructor[0]}
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.instructor}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{skill.students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{skill.duration}</span>
                      </div>
                    </div>

                    {/* Roadmap Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-foreground">Learning Path:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.roadmap.slice(0, 4).map((step, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {step}
                          </Badge>
                        ))}
                        {skill.roadmap.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{skill.roadmap.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex justify-center items-center pt-2 border-t border-border">
                      <Button size="sm" className="group-hover:bg-blue-600 transition-colors w-full">
                        Start Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Skills
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners and start building skills that matter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-3">
              <Link href="/auth/register">Start Learning Today</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-3">
              <Link href="/auth/register?tab=teach">Become a Teacher</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}