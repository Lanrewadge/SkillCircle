'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SimpleThemeToggle } from '@/components/ui/theme-toggle'
import {
  BookOpen,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">SkillCircle</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting learners with local experts. Learn new skills, teach what you know,
              and build meaningful connections in your community.
            </p>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/skillcircle" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://twitter.com/skillcircle" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://linkedin.com/company/skillcircle" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard/browse" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Browse Skills
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teachers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Find Teachers
                </Link>
              </li>
              <li>
                <Link href="/auth/register?tab=teach" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Become a Teacher
                </Link>
              </li>
              <li>
                <Link href="/dashboard/learning" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Learning Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Send Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>hello@skillcircle.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>1-800-SKILL-UP</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">
                Subscribe to our newsletter
              </p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm text-muted-foreground">
                © {currentYear} SkillCircle. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <p className="text-sm text-muted-foreground flex items-center">
                Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for learners everywhere
              </p>
              <SimpleThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}