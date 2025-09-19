'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  Share2,
  FileText,
  Code,
  Image,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Screen,
  ScreenShare,
  MessageSquare,
  Clock,
  Save,
  Download,
  Upload,
  Settings,
  Plus,
  Eye,
  Edit3,
  Lock,
  Unlock,
  Timer,
  Play,
  Pause,
  Square
} from 'lucide-react'

interface WorkspaceUser {
  id: string
  name: string
  avatar: string
  role: 'OWNER' | 'COLLABORATOR' | 'VIEWER'
  status: 'ONLINE' | 'AWAY' | 'BUSY'
  cursor?: { x: number; y: number }
  selection?: { start: number; end: number }
  isTyping: boolean
  lastSeen: string
}

interface WorkspaceFile {
  id: string
  name: string
  type: 'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO' | 'WHITEBOARD'
  content: string
  lastModified: string
  modifiedBy: string
  version: number
  locked: boolean
  lockedBy?: string
}

interface ChatMessage {
  id: string
  userId: string
  userName: string
  message: string
  timestamp: string
  type: 'MESSAGE' | 'SYSTEM' | 'FILE_SHARE'
}

interface SharedWorkspaceProps {
  workspaceId: string
  isHost?: boolean
}

export default function SharedWorkspace({ workspaceId, isHost = false }: SharedWorkspaceProps) {
  const [users, setUsers] = useState<WorkspaceUser[]>([])
  const [files, setFiles] = useState<WorkspaceFile[]>([])
  const [activeFile, setActiveFile] = useState<WorkspaceFile | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMicOn, setIsMicOn] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(false)
  const [sessionTimer, setSessionTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<'TEXT' | 'CODE' | 'IMAGE' | 'VIDEO' | 'WHITEBOARD'>('TEXT')
  const [showFileDialog, setShowFileDialog] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)
  const fileContentRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    initializeWorkspace()
    startTimer()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const initializeWorkspace = () => {
    // Mock data for demonstration
    const mockUsers: WorkspaceUser[] = [
      {
        id: '1',
        name: 'You',
        avatar: '/avatars/you.jpg',
        role: 'OWNER',
        status: 'ONLINE',
        isTyping: false,
        lastSeen: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        role: 'COLLABORATOR',
        status: 'ONLINE',
        cursor: { x: 150, y: 200 },
        isTyping: true,
        lastSeen: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Mike Johnson',
        avatar: '/avatars/mike.jpg',
        role: 'VIEWER',
        status: 'AWAY',
        isTyping: false,
        lastSeen: new Date(Date.now() - 5 * 60000).toISOString()
      }
    ]

    const mockFiles: WorkspaceFile[] = [
      {
        id: 'file_1',
        name: 'Project Proposal.md',
        type: 'TEXT',
        content: '# React Learning Project\n\nThis is our collaborative project to build a React application.\n\n## Goals\n- Learn React hooks\n- Implement state management\n- Create reusable components\n\n## Timeline\nWeek 1: Setup and basic components\nWeek 2: State management\nWeek 3: Testing and deployment',
        lastModified: new Date().toISOString(),
        modifiedBy: 'Sarah Chen',
        version: 3,
        locked: false
      },
      {
        id: 'file_2',
        name: 'app.js',
        type: 'CODE',
        content: 'import React, { useState } from \'react\';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="App">\n      <h1>Counter: {count}</h1>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n\nexport default App;',
        lastModified: new Date(Date.now() - 30 * 60000).toISOString(),
        modifiedBy: 'You',
        version: 1,
        locked: false
      },
      {
        id: 'file_3',
        name: 'Whiteboard Session',
        type: 'WHITEBOARD',
        content: '',
        lastModified: new Date(Date.now() - 60 * 60000).toISOString(),
        modifiedBy: 'Mike Johnson',
        version: 2,
        locked: true,
        lockedBy: 'Sarah Chen'
      }
    ]

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg_1',
        userId: '2',
        userName: 'Sarah Chen',
        message: 'Hey everyone! Ready to start working on the React project?',
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        type: 'MESSAGE'
      },
      {
        id: 'msg_2',
        userId: 'system',
        userName: 'System',
        message: 'Mike Johnson joined the workspace',
        timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
        type: 'SYSTEM'
      },
      {
        id: 'msg_3',
        userId: '1',
        userName: 'You',
        message: 'Yes! I\'ve already started the basic app structure. Check out app.js',
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        type: 'MESSAGE'
      },
      {
        id: 'msg_4',
        userId: '3',
        userName: 'Mike Johnson',
        message: 'Looks great! Should we add some styling next?',
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        type: 'MESSAGE'
      }
    ]

    setUsers(mockUsers)
    setFiles(mockFiles)
    setActiveFile(mockFiles[0])
    setChatMessages(mockMessages)
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    timerRef.current = setInterval(() => {
      setSessionTimer(prev => prev + 1)
    }, 1000)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setSessionTimer(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: '1',
      userName: 'You',
      message: newMessage,
      timestamp: new Date().toISOString(),
      type: 'MESSAGE'
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage('')

    // Simulate real-time collaboration
    broadcastMessage(message)
  }

  const broadcastMessage = (message: ChatMessage) => {
    // In a real app, this would send to WebSocket/Socket.io
    console.log('Broadcasting message:', message)
  }

  const createFile = () => {
    const file: WorkspaceFile = {
      id: `file_${Date.now()}`,
      name: newFileName || `New ${newFileType.toLowerCase()} file`,
      type: newFileType,
      content: newFileType === 'CODE' ? '// New file\n' : newFileType === 'TEXT' ? '# New Document\n\n' : '',
      lastModified: new Date().toISOString(),
      modifiedBy: 'You',
      version: 1,
      locked: false
    }

    setFiles(prev => [...prev, file])
    setActiveFile(file)
    setShowFileDialog(false)
    setNewFileName('')
  }

  const updateFileContent = (content: string) => {
    if (!activeFile) return

    const updatedFile = {
      ...activeFile,
      content,
      lastModified: new Date().toISOString(),
      modifiedBy: 'You',
      version: activeFile.version + 1
    }

    setFiles(prev => prev.map(f => f.id === activeFile.id ? updatedFile : f))
    setActiveFile(updatedFile)

    // Broadcast changes
    broadcastFileChange(updatedFile)
  }

  const broadcastFileChange = (file: WorkspaceFile) => {
    // In a real app, this would send to WebSocket/Socket.io
    console.log('Broadcasting file change:', file)
  }

  const toggleFileLock = (fileId: string) => {
    setFiles(prev => prev.map(file =>
      file.id === fileId ? {
        ...file,
        locked: !file.locked,
        lockedBy: !file.locked ? 'You' : undefined
      } : file
    ))
  }

  const shareWorkspace = () => {
    const shareUrl = `${window.location.origin}/workspace/${workspaceId}`
    navigator.clipboard.writeText(shareUrl)

    const systemMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      userId: 'system',
      userName: 'System',
      message: 'Workspace link copied to clipboard!',
      timestamp: new Date().toISOString(),
      type: 'SYSTEM'
    }
    setChatMessages(prev => [...prev, systemMessage])
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        setIsScreenSharing(true)

        const systemMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          userId: 'system',
          userName: 'System',
          message: 'You started screen sharing',
          timestamp: new Date().toISOString(),
          type: 'SYSTEM'
        }
        setChatMessages(prev => [...prev, systemMessage])
      } else {
        setIsScreenSharing(false)

        const systemMessage: ChatMessage = {
          id: `msg_${Date.now()}`,
          userId: 'system',
          userName: 'System',
          message: 'You stopped screen sharing',
          timestamp: new Date().toISOString(),
          type: 'SYSTEM'
        }
        setChatMessages(prev => [...prev, systemMessage])
      }
    } catch (error) {
      console.error('Screen sharing failed:', error)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'TEXT': return <FileText className="h-4 w-4" />
      case 'CODE': return <Code className="h-4 w-4" />
      case 'IMAGE': return <Image className="h-4 w-4" />
      case 'VIDEO': return <Video className="h-4 w-4" />
      case 'WHITEBOARD': return <Edit3 className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'COLLABORATOR': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'VIEWER': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'bg-green-500'
      case 'AWAY': return 'bg-yellow-500'
      case 'BUSY': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Shared Workspace</h1>

            {/* Timer */}
            <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm">{formatTime(sessionTimer)}</span>
              <div className="flex space-x-1">
                {isTimerRunning ? (
                  <Button size="sm" variant="ghost" onClick={pauseTimer}>
                    <Pause className="h-3 w-3" />
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={startTimer}>
                    <Play className="h-3 w-3" />
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={stopTimer}>
                  <Square className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Active Users */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex -space-x-2">
                {users.map(user => (
                  <div key={user.id} className="relative">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-background ${getStatusColor(user.status)}`}></div>
                    {user.isTyping && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={shareWorkspace}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "outline"}
              size="sm"
              onClick={toggleScreenShare}
            >
              {isScreenSharing ? <Screen className="h-4 w-4" /> : <ScreenShare className="h-4 w-4" />}
            </Button>

            <Button
              variant={isMicOn ? "default" : "outline"}
              size="sm"
              onClick={() => setIsMicOn(!isMicOn)}
            >
              {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>

            <Button
              variant={isCameraOn ? "default" : "outline"}
              size="sm"
              onClick={() => setIsCameraOn(!isCameraOn)}
            >
              {isCameraOn ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
            </Button>

            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Files */}
        <div className="w-64 border-r bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Files</h3>
            <Dialog open={showFileDialog} onOpenChange={setShowFileDialog}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New File</DialogTitle>
                  <DialogDescription>Add a new file to the workspace</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="File name"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                  />
                  <Select value={newFileType} onValueChange={(value: any) => setNewFileType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEXT">Text Document</SelectItem>
                      <SelectItem value="CODE">Code File</SelectItem>
                      <SelectItem value="WHITEBOARD">Whiteboard</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowFileDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={createFile}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            {files.map(file => (
              <div
                key={file.id}
                className={`p-2 rounded cursor-pointer hover:bg-muted ${
                  activeFile?.id === file.id ? 'bg-muted border border-border' : ''
                }`}
                onClick={() => setActiveFile(file)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getFileIcon(file.type)}
                    <span className="text-sm truncate">{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {file.locked && (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFileLock(file.id)
                      }}
                    >
                      {file.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  v{file.version} • {file.modifiedBy}
                </div>
              </div>
            ))}
          </div>

          {/* Collaborators */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Collaborators</h4>
            {users.map(user => (
              <div key={user.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{user.name}</div>
                  <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                    {user.role}
                  </Badge>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <>
              <div className="border-b p-4 bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(activeFile.type)}
                    <span className="font-medium">{activeFile.name}</span>
                    <Badge variant="outline">v{activeFile.version}</Badge>
                    {activeFile.locked && (
                      <Badge variant="destructive">
                        <Lock className="h-3 w-3 mr-1" />
                        Locked by {activeFile.lockedBy}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4">
                {activeFile.type === 'WHITEBOARD' ? (
                  <div className="h-full border rounded-lg bg-white">
                    <div className="p-4 text-center text-muted-foreground">
                      Interactive Whiteboard
                      <br />
                      <small>Whiteboard component would be integrated here</small>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    ref={fileContentRef}
                    value={activeFile.content}
                    onChange={(e) => updateFileContent(e.target.value)}
                    className="h-full resize-none font-mono text-sm"
                    placeholder="Start typing..."
                    disabled={activeFile.locked && activeFile.lockedBy !== 'You'}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <p>Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 border-l bg-card flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </h3>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map(message => (
              <div key={message.id} className={`${
                message.type === 'SYSTEM' ? 'text-center' :
                message.userId === '1' ? 'text-right' : 'text-left'
              }`}>
                {message.type === 'SYSTEM' ? (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded inline-block">
                    {message.message}
                  </div>
                ) : (
                  <div className={`max-w-[80%] inline-block ${
                    message.userId === '1' ? 'ml-auto' : 'mr-auto'
                  }`}>
                    <div className={`p-2 rounded-lg ${
                      message.userId === '1'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      <div className="text-sm">{message.message}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.userName} • {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="sm" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Workspace Settings</DialogTitle>
            <DialogDescription>Configure your collaborative workspace</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm">
              <p><strong>Workspace ID:</strong> {workspaceId}</p>
              <p><strong>Created:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Collaborators:</strong> {users.length}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}