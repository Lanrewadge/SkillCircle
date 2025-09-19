'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Search,
  BookOpen,
  Users,
  MessageCircle,
  Bell,
  ChevronDown,
  Star,
  TrendingUp,
  Calendar
} from 'lucide-react'

export default function NavigationDemo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Enhanced Navigation Demo
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Explore the new dropdown menus and improved navigation structure
            </p>
          </div>

          {/* Navigation Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skills Dropdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Skills Dropdown
                </CardTitle>
                <CardDescription>
                  Browse skills by category with quick access to popular sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Programming & Tech</Badge>
                  <Badge variant="secondary">Business & Marketing</Badge>
                  <Badge variant="secondary">Creative Arts</Badge>
                  <Badge variant="secondary">Academic Subjects</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Learning Dropdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learning Dropdown
                </CardTitle>
                <CardDescription>
                  Manage your learning journey with progress tracking and goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Current Courses</Badge>
                  <Badge variant="secondary">Progress Tracking</Badge>
                  <Badge variant="secondary">Certificates</Badge>
                  <Badge variant="secondary">Learning Goals</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Smart Notifications
                </CardTitle>
                <CardDescription>
                  Stay updated with messages, reminders, and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">New Messages</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Lesson Reminders</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Achievements</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Enhanced User Menu
                </CardTitle>
                <CardDescription>
                  Quick access to profile, settings, and account management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Profile & Role</Badge>
                  <Badge variant="secondary">Calendar & Reviews</Badge>
                  <Badge variant="secondary">Payments & Settings</Badge>
                  <Badge variant="secondary">Help & Support</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mobile Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Mobile Navigation
                </CardTitle>
                <CardDescription>
                  Organized mobile menu with categorized sections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Skills & Learning</Badge>
                  <Badge variant="secondary">Communication</Badge>
                  <Badge variant="secondary">Account Management</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Interactive Features
                </CardTitle>
                <CardDescription>
                  Hover effects, keyboard shortcuts, and smooth animations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="secondary">Hover Interactions</Badge>
                  <Badge variant="secondary">Keyboard Shortcuts</Badge>
                  <Badge variant="secondary">Smooth Animations</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Test the Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Desktop Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Click "Skills" dropdown for categorized skill browsing</li>
                    <li>• Click "Learning" dropdown for progress management</li>
                    <li>• Click the bell icon for notifications</li>
                    <li>• Click your avatar for user menu options</li>
                    <li>• Use Cmd/Ctrl + K to open search</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mobile Features:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Tap hamburger menu for organized navigation</li>
                    <li>• Browse categorized sections</li>
                    <li>• User profile info at the top</li>
                    <li>• Swipe-friendly interface</li>
                    <li>• Clear visual hierarchy</li>
                  </ul>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Try Skills Dropdown
                </Button>
                <Button variant="outline" size="sm">
                  Check Learning Menu
                </Button>
                <Button variant="outline" size="sm">
                  View Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}