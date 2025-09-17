'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, Star, MapPin, Heart, Target } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About SkillCircle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting passionate learners with expert teachers in local communities.
            Learn new skills, share your expertise, and build meaningful connections.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Target className="h-6 w-6 text-blue-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              We believe everyone has something valuable to teach and something new to learn.
              SkillCircle creates a trusted platform where knowledge flows freely between community members,
              fostering personal growth and strengthening local connections.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Local Community</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Connect with talented teachers and passionate learners in your local area.
                Build relationships that extend beyond just learning.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Diverse Skills</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                From programming and languages to cooking and music, discover a wide range of
                skills taught by experienced practitioners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle>Quality Learning</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Our rating system and review process ensures you connect with qualified teachers
                who are passionate about sharing their knowledge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Our Values
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-2">Community First</h3>
                <p className="text-gray-600">
                  We prioritize building strong, supportive communities where everyone feels welcome to learn and teach.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Quality Education</h3>
                <p className="text-gray-600">
                  We're committed to facilitating high-quality learning experiences that are engaging and effective.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Trust & Safety</h3>
                <p className="text-gray-600">
                  Creating a safe, trusted environment where learners and teachers can connect with confidence.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  Making skill-sharing accessible to everyone, regardless of background or experience level.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of learners and teachers who are already part of the SkillCircle community.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/dashboard/browse">Browse Skills</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}