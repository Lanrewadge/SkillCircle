import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import { SearchBar } from '@/components/ui/search-bar'
import { BookOpen, Users, MapPin, Star, MessageCircle, Calendar, Menu } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SC</span>
                </div>
                <span className="font-bold text-xl text-foreground">SkillCircle</span>
              </Link>
            </div>

            {/* Search Bar - Hidden on mobile */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <SearchBar showButton={false} className="w-full" />
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <SimpleThemeToggle />

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>

              {/* Auth Buttons - Hidden on mobile */}
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <SearchBar showButton={false} className="w-full" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Learn & Teach
              <span className="text-blue-600"> Skills Locally</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect with passionate locals to learn new skills or share your expertise.
              From cooking to coding, music to languages - discover your next adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <Link href="/auth/register">Start Learning</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3">
                <Link href="/auth/register?tab=teach">Become a Teacher</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How SkillCircle Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, safe, and effective way to connect learners with local experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Discover Skills</CardTitle>
                <CardDescription>
                  Browse thousands of skills from cooking to coding, music to languages
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Find Local Experts</CardTitle>
                <CardDescription>
                  Connect with verified teachers in your area who share your interests
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Book Sessions</CardTitle>
                <CardDescription>
                  Schedule convenient learning sessions online or in-person
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-muted-foreground">
              Explore skills across diverse categories
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Technology', icon: '💻', count: '500+ skills' },
              { name: 'Cooking', icon: '🍳', count: '300+ skills' },
              { name: 'Languages', icon: '🗣️', count: '50+ languages' },
              { name: 'Music', icon: '🎵', count: '100+ instruments' },
              { name: 'Arts & Crafts', icon: '🎨', count: '200+ skills' },
              { name: 'Sports', icon: '⚽', count: '150+ activities' },
              { name: 'Business', icon: '💼', count: '250+ skills' },
              { name: 'Wellness', icon: '🧘', count: '100+ practices' },
            ].map((category) => (
              <Card key={category.name} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="text-center p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 dark:bg-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8">
            Join thousands of learners and teachers in the SkillCircle community
          </p>
          <Button asChild size="lg" variant="secondary" className="px-8 py-3">
            <Link href="/auth/register">Get Started Free</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">SkillCircle</h3>
            <p className="text-gray-400 dark:text-gray-500 mb-8">
              Connecting learners with local experts
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/about" className="text-gray-400 dark:text-gray-500 hover:text-white">About</Link>
              <Link href="/privacy" className="text-gray-400 dark:text-gray-500 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-gray-400 dark:text-gray-500 hover:text-white">Terms</Link>
              <Link href="/contact" className="text-gray-400 dark:text-gray-500 hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}