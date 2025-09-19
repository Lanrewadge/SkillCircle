'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Code,
  Play,
  Square,
  Save,
  Share2,
  Users,
  Settings,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  MessageSquare,
  Zap,
  Bug,
  CheckCircle,
  AlertCircle,
  Clock,
  Cpu,
  Terminal
} from 'lucide-react'

interface CodeFile {
  id: string
  name: string
  language: string
  content: string
  lastModified: string
  modifiedBy: string
}

interface Collaborator {
  id: string
  name: string
  avatar: string
  color: string
  cursor: { line: number; column: number } | null
  selection: { start: { line: number; column: number }; end: { line: number; column: number } } | null
  isActive: boolean
}

interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  executionTime: number
  memoryUsage: number
}

interface CodeEditorProps {
  sessionId?: string
  isCollaborative?: boolean
  initialCode?: string
  language?: string
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: '.js' },
  { value: 'typescript', label: 'TypeScript', extension: '.ts' },
  { value: 'python', label: 'Python', extension: '.py' },
  { value: 'java', label: 'Java', extension: '.java' },
  { value: 'cpp', label: 'C++', extension: '.cpp' },
  { value: 'html', label: 'HTML', extension: '.html' },
  { value: 'css', label: 'CSS', extension: '.css' },
  { value: 'sql', label: 'SQL', extension: '.sql' },
  { value: 'markdown', label: 'Markdown', extension: '.md' }
]

const THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'vs-light', label: 'Light' },
  { value: 'monokai', label: 'Monokai' },
  { value: 'github', label: 'GitHub' }
]

export default function CodeEditor({
  sessionId = 'demo',
  isCollaborative = true,
  initialCode = '',
  language = 'javascript'
}: CodeEditorProps) {
  const [files, setFiles] = useState<CodeFile[]>([])
  const [activeFile, setActiveFile] = useState<CodeFile | null>(null)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [code, setCode] = useState(initialCode)
  const [selectedLanguage, setSelectedLanguage] = useState(language)
  const [theme, setTheme] = useState('vs-dark')
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const [showCollaborators, setShowCollaborators] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(14)
  const [tabSize, setTabSize] = useState(2)
  const [wordWrap, setWordWrap] = useState(false)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [liveShare, setLiveShare] = useState(isCollaborative)

  const editorRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    initializeEditor()
  }, [])

  useEffect(() => {
    if (autoSave && activeFile) {
      const timeout = setTimeout(() => {
        saveFile()
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [code, autoSave, activeFile])

  const initializeEditor = () => {
    // Mock initial files
    const initialFiles: CodeFile[] = [
      {
        id: 'file_1',
        name: 'main.js',
        language: 'javascript',
        content: '// Welcome to the collaborative code editor!\n\nfunction greetLearners() {\n  const learners = ["Alice", "Bob", "Charlie"];\n  \n  learners.forEach(name => {\n    console.log(`Hello, ${name}! Welcome to SkillCircle!`);\n  });\n}\n\n// Call the function\ngreetLearners();\n\n// Try editing this code collaboratively!',
        lastModified: new Date().toISOString(),
        modifiedBy: 'You'
      },
      {
        id: 'file_2',
        name: 'styles.css',
        language: 'css',
        content: '/* Collaborative CSS Styling */\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  border-radius: 10px;\n  box-shadow: 0 10px 30px rgba(0,0,0,0.1);\n}\n\n.title {\n  font-size: 2.5rem;\n  color: white;\n  text-align: center;\n  margin-bottom: 30px;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);\n}\n\n.card {\n  background: white;\n  padding: 20px;\n  border-radius: 8px;\n  margin: 10px 0;\n  transition: transform 0.3s ease;\n}\n\n.card:hover {\n  transform: translateY(-5px);\n}',
        lastModified: new Date(Date.now() - 60000).toISOString(),
        modifiedBy: 'Sarah Chen'
      },
      {
        id: 'file_3',
        name: 'algorithm.py',
        language: 'python',
        content: '# Collaborative Python Algorithm Practice\n\ndef binary_search(arr, target):\n    """\n    Implement binary search algorithm\n    Time Complexity: O(log n)\n    Space Complexity: O(1)\n    """\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        \n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1\n\n# Test the algorithm\nif __name__ == "__main__":\n    numbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]\n    target = 7\n    \n    result = binary_search(numbers, target)\n    \n    if result != -1:\n        print(f"Target {target} found at index {result}")\n    else:\n        print(f"Target {target} not found in the array")\n    \n    # Try different targets\n    for test_target in [1, 10, 19, 20]:\n        index = binary_search(numbers, test_target)\n        print(f"Target {test_target}: {\'Found at index \' + str(index) if index != -1 else \'Not found\'}")',
        lastModified: new Date(Date.now() - 120000).toISOString(),
        modifiedBy: 'Mike Johnson'
      }
    ]

    // Mock collaborators
    const mockCollaborators: Collaborator[] = [
      {
        id: '1',
        name: 'You',
        avatar: '/avatars/you.jpg',
        color: '#FF6B6B',
        cursor: { line: 5, column: 15 },
        selection: null,
        isActive: true
      },
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: '/avatars/sarah.jpg',
        color: '#4ECDC4',
        cursor: { line: 8, column: 25 },
        selection: { start: { line: 8, column: 20 }, end: { line: 8, column: 35 } },
        isActive: true
      },
      {
        id: '3',
        name: 'Mike Johnson',
        avatar: '/avatars/mike.jpg',
        color: '#45B7D1',
        cursor: { line: 12, column: 10 },
        selection: null,
        isActive: false
      }
    ]

    setFiles(initialFiles)
    setActiveFile(initialFiles[0])
    setCode(initialFiles[0].content)
    setSelectedLanguage(initialFiles[0].language)
    setCollaborators(mockCollaborators)
  }

  const saveFile = useCallback(() => {
    if (!activeFile) return

    const updatedFile = {
      ...activeFile,
      content: code,
      lastModified: new Date().toISOString(),
      modifiedBy: 'You'
    }

    setFiles(prev => prev.map(file =>
      file.id === activeFile.id ? updatedFile : file
    ))
    setActiveFile(updatedFile)

    // Broadcast changes in collaborative mode
    if (liveShare) {
      broadcastCodeChange(updatedFile)
    }
  }, [activeFile, code, liveShare])

  const broadcastCodeChange = (file: CodeFile) => {
    // In real implementation, this would use WebSocket/Socket.io
    console.log('Broadcasting code change:', file)
  }

  const executeCode = async () => {
    setIsExecuting(true)
    setShowOutput(true)

    try {
      // Mock code execution - in real app, this would send to a backend sandbox
      await new Promise(resolve => setTimeout(resolve, 1500))

      let result: ExecutionResult

      if (selectedLanguage === 'javascript') {
        try {
          // Simple JavaScript execution (dangerous in real app - use sandbox)
          const originalLog = console.log
          let output = ''
          console.log = (...args) => {
            output += args.join(' ') + '\n'
          }

          const startTime = performance.now()
          eval(code)
          const endTime = performance.now()

          console.log = originalLog

          result = {
            success: true,
            output: output || 'Code executed successfully (no output)',
            executionTime: Math.round(endTime - startTime),
            memoryUsage: Math.floor(Math.random() * 1000 + 500) // Mock memory usage
          }
        } catch (error) {
          result = {
            success: false,
            output: '',
            error: (error as Error).message,
            executionTime: 0,
            memoryUsage: 0
          }
        }
      } else if (selectedLanguage === 'python') {
        // Mock Python execution
        result = {
          success: true,
          output: 'Target 7 found at index 3\nTarget 1: Found at index 0\nTarget 10: Not found\nTarget 19: Found at index 9\nTarget 20: Not found',
          executionTime: 45,
          memoryUsage: 1240
        }
      } else {
        result = {
          success: true,
          output: `${selectedLanguage.toUpperCase()} code executed successfully!\n\nNote: This is a demo execution. In a real environment, your code would be compiled and run in a secure sandbox.`,
          executionTime: Math.floor(Math.random() * 100 + 50),
          memoryUsage: Math.floor(Math.random() * 2000 + 800)
        }
      }

      setExecutionResult(result)
    } catch (error) {
      setExecutionResult({
        success: false,
        output: '',
        error: 'Execution failed',
        executionTime: 0,
        memoryUsage: 0
      })
    } finally {
      setIsExecuting(false)
    }
  }

  const switchFile = (file: CodeFile) => {
    saveFile() // Save current file before switching
    setActiveFile(file)
    setCode(file.content)
    setSelectedLanguage(file.language)
  }

  const shareSession = () => {
    const shareUrl = `${window.location.origin}/code-session/${sessionId}`
    navigator.clipboard.writeText(shareUrl)
    // Could show a toast notification here
  }

  const downloadFile = () => {
    if (!activeFile) return

    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = activeFile.name
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCode = () => {
    // Simple code formatting (in real app, use prettier or similar)
    let formatted = code

    if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
      // Basic JavaScript formatting
      formatted = formatted
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}')
        .replace(/;/g, ';\n')
    }

    setCode(formatted)
  }

  const getLanguageIcon = (lang: string) => {
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return '🟨'
      case 'python':
        return '🐍'
      case 'java':
        return '☕'
      case 'cpp':
        return '⚡'
      case 'html':
        return '🌐'
      case 'css':
        return '🎨'
      case 'sql':
        return '🗄️'
      case 'markdown':
        return '📝'
      default:
        return '📄'
    }
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span className="font-semibold">Collaborative Code Editor</span>
              {liveShare && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Live
                </Badge>
              )}
            </div>

            {/* File Tabs */}
            <div className="flex space-x-1">
              {files.map(file => (
                <button
                  key={file.id}
                  onClick={() => switchFile(file)}
                  className={`px-3 py-1 text-sm rounded-t border-b-2 transition-colors ${
                    activeFile?.id === file.id
                      ? 'bg-background border-primary'
                      : 'bg-muted border-transparent hover:bg-background'
                  }`}
                >
                  <span className="mr-1">{getLanguageIcon(file.language)}</span>
                  {file.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map(lang => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={formatCode}>
              <Zap className="h-4 w-4 mr-1" />
              Format
            </Button>

            <Button variant="outline" size="sm" onClick={downloadFile}>
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>

            <Button variant="outline" size="sm" onClick={shareSession}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>

            <Button
              onClick={executeCode}
              disabled={isExecuting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <Square className="h-4 w-4 mr-1" />
              ) : (
                <Play className="h-4 w-4 mr-1" />
              )}
              {isExecuting ? 'Running...' : 'Run'}
            </Button>

            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editor Settings</DialogTitle>
                  <DialogDescription>Customize your coding experience</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label>Theme</label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map(t => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label>Font Size</label>
                    <Select value={fontSize.toString()} onValueChange={(v) => setFontSize(parseInt(v))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[12, 14, 16, 18, 20].map(size => (
                          <SelectItem key={size} value={size.toString()}>
                            {size}px
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label>Auto Save</label>
                    <Button
                      variant={autoSave ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAutoSave(!autoSave)}
                    >
                      {autoSave ? 'On' : 'Off'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono resize-none border-0 bg-background focus:outline-none"
              style={{
                fontSize: `${fontSize}px`,
                tabSize: tabSize,
                lineHeight: 1.5
              }}
              placeholder="Start coding..."
              spellCheck={false}
            />

            {/* Collaborative Cursors (mock positions) */}
            {liveShare && collaborators.filter(c => c.id !== '1' && c.isActive).map(collaborator => (
              <div
                key={collaborator.id}
                className="absolute pointer-events-none z-10"
                style={{
                  left: `${collaborator.cursor ? collaborator.cursor.column * 8 + 16 : 0}px`,
                  top: `${collaborator.cursor ? collaborator.cursor.line * 24 + 16 : 0}px`,
                  borderLeft: `2px solid ${collaborator.color}`
                }}
              >
                <div
                  className="text-xs px-1 rounded text-white -ml-1 -mt-6"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.name}
                </div>
              </div>
            ))}
          </div>

          {/* Output Panel */}
          {showOutput && (
            <div className="h-64 border-t bg-card">
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4" />
                  <span className="font-medium">Output</span>
                  {executionResult && (
                    <Badge variant={executionResult.success ? "default" : "destructive"}>
                      {executionResult.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                      {executionResult.success ? 'Success' : 'Error'}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {executionResult && (
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{executionResult.executionTime}ms</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Cpu className="h-3 w-3" />
                        <span>{executionResult.memoryUsage}KB</span>
                      </div>
                    </div>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => setShowOutput(false)}>
                    <EyeOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div ref={outputRef} className="h-full overflow-auto p-4 font-mono text-sm">
                {isExecuting ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    <span>Executing code...</span>
                  </div>
                ) : executionResult ? (
                  <div>
                    {executionResult.success ? (
                      <pre className="text-green-600 dark:text-green-400">{executionResult.output}</pre>
                    ) : (
                      <pre className="text-red-600 dark:text-red-400">{executionResult.error}</pre>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground">Click 'Run' to execute your code</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Collaborators Sidebar */}
        {liveShare && showCollaborators && (
          <div className="w-64 border-l bg-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Collaborators ({collaborators.length})
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCollaborators(false)}>
                <EyeOff className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {collaborators.map(collaborator => (
                <div key={collaborator.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{collaborator.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {collaborator.cursor && (
                        <span>Line {collaborator.cursor.line}:{collaborator.cursor.column}</span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      collaborator.isActive ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-2">Session Info</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Session: {sessionId}</div>
                <div>Language: {selectedLanguage}</div>
                <div>Theme: {theme}</div>
                <div>Auto-save: {autoSave ? 'On' : 'Off'}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show Output Button (when hidden) */}
      {!showOutput && (
        <div className="fixed bottom-4 right-4">
          <Button onClick={() => setShowOutput(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Show Output
          </Button>
        </div>
      )}

      {/* Show Collaborators Button (when hidden) */}
      {liveShare && !showCollaborators && (
        <div className="fixed bottom-4 right-20">
          <Button variant="outline" onClick={() => setShowCollaborators(true)}>
            <Users className="h-4 w-4 mr-2" />
            Collaborators
          </Button>
        </div>
      )}
    </div>
  )
}