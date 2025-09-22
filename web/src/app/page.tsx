import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import { SearchBar } from '@/components/ui/search-bar'
import { BookOpen, Users, MapPin, Star, MessageCircle, Calendar, Menu, Play, Clock, Award, TrendingUp, ChevronRight } from 'lucide-react'

const featuredCourses = [
  {
    id: 1,
    title: "Complete Web Development Bootcamp",
    instructor: "Angela Yu",
    rating: 4.7,
    reviews: 267634,
    image: "/api/placeholder/300/200",
    category: "Development",
    level: "Beginner",
    duration: "65 hours",
    students: "850,000+",
    bestseller: true
  },
  {
    id: 2,
    title: "The Complete JavaScript Course",
    instructor: "Jonas Schmedtmann",
    rating: 4.6,
    reviews: 151438,
    image: "/api/placeholder/300/200",
    category: "Development",
    level: "Intermediate",
    duration: "69 hours",
    students: "720,000+",
    bestseller: false
  },
  {
    id: 3,
    title: "React - The Complete Guide",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.6,
    reviews: 184329,
    image: "/api/placeholder/300/200",
    category: "Development",
    level: "Intermediate",
    duration: "48 hours",
    students: "500,000+",
    bestseller: true
  },
  {
    id: 4,
    title: "Python for Data Science and Machine Learning",
    instructor: "Jose Portilla",
    rating: 4.5,
    reviews: 112345,
    image: "/api/placeholder/300/200",
    category: "Data Science",
    level: "Intermediate",
    duration: "25 hours",
    students: "300,000+",
    bestseller: false
  }
]

const categories = [
  { name: "Development", count: "850+ courses", icon: "💻", href: "/explore/technology" },
  { name: "Business", count: "420+ courses", icon: "💼", href: "/explore/business" },
  { name: "Physics", count: "150+ courses", icon: "⚛️", href: "/explore/physics" },
  { name: "Mathematics", count: "200+ courses", icon: "📐", href: "/explore/mathematics" },
  { name: "Chemistry", count: "120+ courses", icon: "🧪", href: "/explore/chemistry" },
  { name: "Biology", count: "180+ courses", icon: "🧬", href: "/explore/biology" },
  { name: "Engineering", count: "300+ courses", icon: "⚙️", href: "/explore/engineering" },
  { name: "Geography", count: "195+ courses", icon: "🗺️", href: "/explore/geography" }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="font-bold text-xl text-gray-900 dark:text-white">SkillCircle</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Button variant="ghost" className="text-gray-700 dark:text-gray-300">Categories</Button>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar showButton={true} className="w-full" placeholder="Search for anything" />
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="hidden md:block text-gray-700 dark:text-gray-300">Teach on SkillCircle</Button>
              <Button variant="ghost" className="hidden md:block">
                <BookOpen className="h-4 w-4 mr-2" />
                My learning
              </Button>
              <SimpleThemeToggle />
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/auth">Log in</Link>
                </Button>
                <Button asChild className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                  <Link href="/auth/register">Sign up</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Skills that drive you forward
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Technology and the world of work change fast — with us, you're faster. Get the skills to achieve goals and stay competitive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100">
                Plan for teams
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Featured courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-gray-400" />
                  </div>
                  {course.bestseller && (
                    <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-400">
                      Bestseller
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{course.instructor}</p>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-sm font-semibold text-yellow-600 mr-1">{course.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < Math.floor(course.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({course.reviews.toLocaleString()})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.duration}
                    </span>
                    <span className="text-xs text-gray-500">• {course.level}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Top categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.name} href={category.href}>
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-12">
            Trusted by over 57 million learners and 213,000 instructors
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">57M+</div>
              <p className="text-gray-600 dark:text-gray-400">Students</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">213K+</div>
              <p className="text-gray-600 dark:text-gray-400">Instructors</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">75+</div>
              <p className="text-gray-600 dark:text-gray-400">Languages</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">773M+</div>
              <p className="text-gray-600 dark:text-gray-400">Course enrollments</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How SkillCircle works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Whether you want to learn or share what you know, you've come to the right place.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Learn</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of courses from expert instructors on hundreds of topics.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Practice</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Apply your skills with hands-on projects and real-world assignments.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Achieve</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Earn certificates and advance your career with new skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 dark:bg-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Transform your life through learning
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
            Start learning today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">SkillCircle</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/learners" className="hover:text-white">Learners</Link></li>
                <li><Link href="/partners" className="hover:text-white">Partners</Link></li>
                <li><Link href="/developers" className="hover:text-white">Developers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">More</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/investors" className="hover:text-white">Investors</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help and support</Link></li>
                <li><Link href="/trust" className="hover:text-white">Trust & safety</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2024 SkillCircle, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}