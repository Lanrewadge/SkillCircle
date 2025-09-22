'use client'

import React from 'react'
import { DocumentManager } from '@/components/skills/DocumentManager'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft, FileText, Upload, Download, Users, Shield } from 'lucide-react'

export default function DocumentsDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/skills/react-development"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to React Development
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Document Management System Demo
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">
                Experience our comprehensive document sharing system that allows teachers and students
                to upload, organize, and share learning resources for each skill.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-green-100 text-green-800">
                <FileText className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
              <Badge variant="outline">React Development</Badge>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Easy Upload</CardTitle>
              <CardDescription>
                Teachers and students can upload documents, guides, presentations, and images
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Collaborative Sharing</CardTitle>
              <CardDescription>
                Community-driven learning with resources from both instructors and peers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Quality Control</CardTitle>
              <CardDescription>
                Teacher-approved content with automatic approval for instructors
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Demo Component */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Live Document Manager</CardTitle>
            <CardDescription>
              This is a fully functional demo of our document management system.
              You can upload files, browse existing documents, and test all features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DocumentManager
              skillId="react-development"
              userRole="student"
              userId="demo-user"
            />
          </CardContent>
        </Card>

        {/* Key Features */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Supported File Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                    <span className="text-red-600 text-xs font-bold">PDF</span>
                  </div>
                  <span className="text-sm">PDF Documents - Guides, tutorials, references</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">DOC</span>
                  </div>
                  <span className="text-sm">Word Documents - Notes, assignments, reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">PPT</span>
                  </div>
                  <span className="text-sm">Presentations - Slides, lectures, demos</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-xs font-bold">IMG</span>
                  </div>
                  <span className="text-sm">Images - Diagrams, screenshots, charts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                User Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Teachers</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Upload documents with automatic approval</li>
                    <li>• Delete any documents in their skills</li>
                    <li>• Approve student submissions</li>
                    <li>• Access all uploaded materials</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-blue-700 mb-2">Students</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Upload documents (pending approval)</li>
                    <li>• Download all approved materials</li>
                    <li>• Delete their own uploads</li>
                    <li>• Search and filter documents</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            How to Use the Document Manager
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Uploading Documents</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click "Upload Document" button</li>
                <li>Fill in title and description</li>
                <li>Add relevant tags (optional)</li>
                <li>Select your file (max 10MB)</li>
                <li>Click "Upload" to share</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Finding Documents</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Use the search bar to find specific content</li>
                <li>Filter by "All", "Teacher", "Student", or "Mine"</li>
                <li>Browse by tags and categories</li>
                <li>Check approval status indicators</li>
                <li>Download or preview documents</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}