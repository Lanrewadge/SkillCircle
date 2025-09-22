'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  Search,
  Filter,
  Calendar,
  User,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface Document {
  id: string
  title: string
  description: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: {
    id: string
    name: string
    role: 'teacher' | 'student'
    avatar?: string
  }
  uploadedAt: Date
  views: number
  skillId: string
  tags: string[]
  isApproved: boolean
}

interface DocumentManagerProps {
  skillId: string
  userRole: 'teacher' | 'student'
  userId: string
}

const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    title: 'React Hooks Complete Guide',
    description: 'Comprehensive guide covering all React hooks with practical examples and best practices.',
    fileName: 'react-hooks-guide.pdf',
    fileSize: 2048000, // 2MB
    fileType: 'application/pdf',
    uploadedBy: {
      id: 'teacher-1',
      name: 'Sarah Johnson',
      role: 'teacher'
    },
    uploadedAt: new Date('2024-01-15'),
    views: 156,
    skillId: 'react-development',
    tags: ['hooks', 'guide', 'react', 'beginner'],
    isApproved: true
  },
  {
    id: 'doc-2',
    title: 'State Management Patterns',
    description: 'Advanced patterns for managing state in React applications using Context API and Redux.',
    fileName: 'state-management-patterns.docx',
    fileSize: 1536000, // 1.5MB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedBy: {
      id: 'student-1',
      name: 'Alex Chen',
      role: 'student'
    },
    uploadedAt: new Date('2024-01-12'),
    views: 89,
    skillId: 'react-development',
    tags: ['state', 'context', 'redux', 'advanced'],
    isApproved: true
  },
  {
    id: 'doc-3',
    title: 'Component Design Principles',
    description: 'Best practices for designing reusable and maintainable React components.',
    fileName: 'component-design.pptx',
    fileSize: 3072000, // 3MB
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    uploadedBy: {
      id: 'teacher-2',
      name: 'Mike Thompson',
      role: 'teacher'
    },
    uploadedAt: new Date('2024-01-10'),
    views: 234,
    skillId: 'react-development',
    tags: ['components', 'design', 'principles', 'best-practices'],
    isApproved: true
  }
]

export function DocumentManager({ skillId, userRole, userId }: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>(
    mockDocuments.filter(doc => doc.skillId === skillId)
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    tags: '',
    file: null as File | null
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <FileImage className="w-5 h-5" />
    if (fileType.includes('video')) return <FileVideo className="w-5 h-5" />
    if (fileType.includes('audio')) return <FileAudio className="w-5 h-5" />
    if (fileType.includes('pdf') || fileType.includes('document')) return <FileText className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = selectedFilter === 'all' ||
                         (selectedFilter === 'teacher' && doc.uploadedBy.role === 'teacher') ||
                         (selectedFilter === 'student' && doc.uploadedBy.role === 'student') ||
                         (selectedFilter === 'mine' && doc.uploadedBy.id === userId)

    return matchesSearch && matchesFilter
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]

      if (!allowedTypes.includes(file.type)) {
        alert('File type not supported. Please upload PDF, Word, PowerPoint, Text, or Image files.')
        return
      }

      setUploadForm(prev => ({ ...prev, file }))
    }
  }

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title.trim()) {
      alert('Please provide a title and select a file')
      return
    }

    setIsUploading(true)

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: uploadForm.title,
      description: uploadForm.description,
      fileName: uploadForm.file.name,
      fileSize: uploadForm.file.size,
      fileType: uploadForm.file.type,
      uploadedBy: {
        id: userId,
        name: 'Current User', // This would come from user context
        role: userRole
      },
      uploadedAt: new Date(),
      views: 0,
      skillId,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      isApproved: userRole === 'teacher' // Teachers auto-approved, students need approval
    }

    setDocuments(prev => [newDocument, ...prev])
    setUploadForm({ title: '', description: '', tags: '', file: null })
    setIsUploadOpen(false)
    setIsUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleView = (document: Document) => {
    // In a real app, this would open the document in a viewer/preview mode
    console.log(`Viewing: ${document.fileName}`)

    // Update view count
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === document.id
          ? { ...doc, views: doc.views + 1 }
          : doc
      )
    )
  }

  const handleDelete = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    }
  }

  const canDelete = (document: Document) => {
    return document.uploadedBy.id === userId || userRole === 'teacher'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Learning Resources</h3>
          <p className="text-muted-foreground">
            Share and access documents, guides, and materials for this skill
          </p>
        </div>

        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Learning Resource</DialogTitle>
              <DialogDescription>
                Share a document, guide, or material to help others learn this skill.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., React Hooks Complete Guide"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this document covers..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., hooks, guide, beginner"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </div>
                {uploadForm.file && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {getFileIcon(uploadForm.file.type)}
                    <span>{uploadForm.file.name}</span>
                    <span>({formatFileSize(uploadForm.file.size)})</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Supported: PDF, Word, PowerPoint, Text, Images (max 10MB)
                </p>
              </div>

              {userRole === 'student' && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-sm text-amber-800">
                    Student uploads require teacher approval before being visible to others.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !uploadForm.file || !uploadForm.title.trim()}>
                {isUploading ? 'Uploading...' : 'Upload'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="all">All Documents</option>
            <option value="teacher">Teacher Resources</option>
            <option value="student">Student Contributions</option>
            <option value="mine">My Uploads</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {getFileIcon(document.fileType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{document.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {document.description}
                    </p>
                  </div>
                </div>

                {document.isApproved ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Tags */}
              {document.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {document.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <File className="w-4 h-4" />
                    {formatFileSize(document.fileSize)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {document.views} views
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {document.uploadedAt.toLocaleDateString()}
                </span>
              </div>

              {/* Uploader Info */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {document.uploadedBy.name[0]}
                </div>
                <span className="text-sm text-muted-foreground">
                  {document.uploadedBy.name}
                </span>
                <Badge variant={document.uploadedBy.role === 'teacher' ? 'default' : 'secondary'} className="text-xs">
                  {document.uploadedBy.role}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleView(document)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Document
                  </Button>
                </div>

                {canDelete(document) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No documents found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Be the first to share a learning resource for this skill!'
            }
          </p>
          {(!searchQuery && selectedFilter === 'all') && (
            <Button onClick={() => setIsUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-2" />
              Upload First Document
            </Button>
          )}
        </div>
      )}
    </div>
  )
}