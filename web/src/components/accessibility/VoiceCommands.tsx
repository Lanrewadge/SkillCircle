'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  HelpCircle,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  BookOpen,
  Search,
  Users,
  MessageSquare,
  Navigation,
  Zap,
  Brain,
  Eye,
  EyeOff
} from 'lucide-react'

interface VoiceCommand {
  id: string
  phrase: string
  action: string
  category: 'NAVIGATION' | 'LEARNING' | 'ACCESSIBILITY' | 'CONTENT' | 'SOCIAL'
  description: string
  example: string
  enabled: boolean
}

interface VoiceSettings {
  isEnabled: boolean
  language: string
  sensitivity: number
  continuousListening: boolean
  voiceResponse: boolean
  screenReader: boolean
  keyboardShortcuts: boolean
  highContrast: boolean
  largeText: boolean
}

const VOICE_COMMANDS: VoiceCommand[] = [
  // Navigation Commands
  {
    id: 'nav_home',
    phrase: 'go home',
    action: 'navigate_home',
    category: 'NAVIGATION',
    description: 'Navigate to the home page',
    example: 'Say "go home" or "take me home"',
    enabled: true
  },
  {
    id: 'nav_skills',
    phrase: 'show skills',
    action: 'navigate_skills',
    category: 'NAVIGATION',
    description: 'Navigate to skills page',
    example: 'Say "show skills" or "browse skills"',
    enabled: true
  },
  {
    id: 'nav_challenges',
    phrase: 'show challenges',
    action: 'navigate_challenges',
    category: 'NAVIGATION',
    description: 'Navigate to learning challenges',
    example: 'Say "show challenges" or "open challenges"',
    enabled: true
  },
  {
    id: 'nav_study_rooms',
    phrase: 'join study room',
    action: 'navigate_study_rooms',
    category: 'SOCIAL',
    description: 'Navigate to study rooms',
    example: 'Say "join study room" or "find study groups"',
    enabled: true
  },

  // Learning Commands
  {
    id: 'learn_start',
    phrase: 'start learning',
    action: 'start_learning_session',
    category: 'LEARNING',
    description: 'Start a new learning session',
    example: 'Say "start learning" or "begin session"',
    enabled: true
  },
  {
    id: 'learn_pause',
    phrase: 'pause lesson',
    action: 'pause_content',
    category: 'LEARNING',
    description: 'Pause current content',
    example: 'Say "pause lesson" or "stop"',
    enabled: true
  },
  {
    id: 'learn_next',
    phrase: 'next lesson',
    action: 'next_content',
    category: 'LEARNING',
    description: 'Move to next lesson or content',
    example: 'Say "next lesson" or "continue"',
    enabled: true
  },
  {
    id: 'learn_repeat',
    phrase: 'repeat that',
    action: 'repeat_content',
    category: 'LEARNING',
    description: 'Repeat the last content or explanation',
    example: 'Say "repeat that" or "say again"',
    enabled: true
  },

  // Content Commands
  {
    id: 'content_search',
    phrase: 'search for',
    action: 'search_content',
    category: 'CONTENT',
    description: 'Search for specific content',
    example: 'Say "search for React hooks" or "find Python tutorials"',
    enabled: true
  },
  {
    id: 'content_bookmark',
    phrase: 'bookmark this',
    action: 'bookmark_content',
    category: 'CONTENT',
    description: 'Bookmark current content',
    example: 'Say "bookmark this" or "save for later"',
    enabled: true
  },
  {
    id: 'content_rate',
    phrase: 'rate this lesson',
    action: 'rate_content',
    category: 'CONTENT',
    description: 'Rate current lesson or content',
    example: 'Say "rate this lesson" or "give feedback"',
    enabled: true
  },

  // Accessibility Commands
  {
    id: 'a11y_read',
    phrase: 'read this page',
    action: 'read_page',
    category: 'ACCESSIBILITY',
    description: 'Read the current page content aloud',
    example: 'Say "read this page" or "read content"',
    enabled: true
  },
  {
    id: 'a11y_describe',
    phrase: 'describe this',
    action: 'describe_element',
    category: 'ACCESSIBILITY',
    description: 'Describe the focused element',
    example: 'Say "describe this" or "what is this"',
    enabled: true
  },
  {
    id: 'a11y_help',
    phrase: 'help me',
    action: 'show_help',
    category: 'ACCESSIBILITY',
    description: 'Show help and available commands',
    example: 'Say "help me" or "show commands"',
    enabled: true
  }
]

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [lastCommand, setLastCommand] = useState<string>('')
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    isEnabled: false,
    language: 'en-US',
    sensitivity: 70,
    continuousListening: false,
    voiceResponse: true,
    screenReader: false,
    keyboardShortcuts: true,
    highContrast: false,
    largeText: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showCommands, setShowCommands] = useState(false)
  const [commandHistory, setCommandHistory] = useState<Array<{command: string, timestamp: Date, success: boolean}>>([])

  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<any>(null)

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const SpeechSynthesis = (window as any).speechSynthesis

    if (SpeechRecognition && SpeechSynthesis) {
      setIsSupported(true)

      // Initialize speech recognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = voiceSettings.language

      // Initialize speech synthesis
      synthesisRef.current = SpeechSynthesis

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        const confidence = event.results[0][0].confidence * 100

        setLastCommand(transcript)
        setConfidence(confidence)
        processVoiceCommand(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        if (voiceSettings.voiceResponse) {
          speak('Sorry, I didn\'t understand that command. Please try again.')
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (voiceSettings.continuousListening && voiceSettings.isEnabled) {
          setTimeout(() => startListening(), 1000)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [voiceSettings])

  const startListening = () => {
    if (!isSupported || !voiceSettings.isEnabled) return

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error('Failed to start voice recognition:', error)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const speak = (text: string) => {
    if (!synthesisRef.current || !voiceSettings.voiceResponse) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = voiceSettings.language
    utterance.rate = 0.9
    utterance.pitch = 1

    synthesisRef.current.speak(utterance)
  }

  const processVoiceCommand = (transcript: string) => {
    const command = VOICE_COMMANDS.find(cmd =>
      cmd.enabled && transcript.includes(cmd.phrase)
    )

    const commandEntry = {
      command: transcript,
      timestamp: new Date(),
      success: !!command
    }

    setCommandHistory(prev => [commandEntry, ...prev.slice(0, 9)])

    if (command) {
      executeCommand(command, transcript)
      if (voiceSettings.voiceResponse) {
        speak(`Executing ${command.description}`)
      }
    } else {
      if (voiceSettings.voiceResponse) {
        speak('Command not recognized. Say "help me" to see available commands.')
      }
    }
  }

  const executeCommand = (command: VoiceCommand, transcript: string) => {
    switch (command.action) {
      case 'navigate_home':
        window.location.href = '/'
        break
      case 'navigate_skills':
        window.location.href = '/skills'
        break
      case 'navigate_challenges':
        window.location.href = '/challenges'
        break
      case 'navigate_study_rooms':
        window.location.href = '/study-rooms'
        break
      case 'search_content':
        const searchTerm = transcript.replace(/search for|find/gi, '').trim()
        if (searchTerm) {
          window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
        }
        break
      case 'start_learning_session':
        // Trigger learning session start
        console.log('Starting learning session...')
        break
      case 'pause_content':
        // Pause any playing content
        const videos = document.querySelectorAll('video')
        const audios = document.querySelectorAll('audio')
        videos.forEach(video => video.pause())
        audios.forEach(audio => audio.pause())
        break
      case 'next_content':
        // Trigger next content
        const nextButton = document.querySelector('[data-testid="next-button"]') as HTMLElement
        nextButton?.click()
        break
      case 'repeat_content':
        // Repeat last content
        console.log('Repeating content...')
        break
      case 'bookmark_content':
        // Bookmark current content
        console.log('Bookmarking content...')
        break
      case 'rate_content':
        // Open rating dialog
        console.log('Opening rating dialog...')
        break
      case 'read_page':
        // Read page content
        const pageContent = document.body.innerText.slice(0, 1000)
        speak(pageContent)
        break
      case 'describe_element':
        // Describe focused element
        const focusedElement = document.activeElement
        if (focusedElement) {
          const description = focusedElement.getAttribute('aria-label') ||
                           focusedElement.textContent?.slice(0, 100) ||
                           'Interactive element'
          speak(description)
        }
        break
      case 'show_help':
        setShowCommands(true)
        speak('Showing available voice commands')
        break
      default:
        console.log('Command not implemented:', command.action)
    }
  }

  const toggleVoiceCommands = () => {
    const newState = !voiceSettings.isEnabled
    setVoiceSettings(prev => ({ ...prev, isEnabled: newState }))

    if (newState) {
      speak('Voice commands enabled. Say "help me" to see available commands.')
    } else {
      stopListening()
      speak('Voice commands disabled.')
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NAVIGATION': return <Navigation className="h-4 w-4" />
      case 'LEARNING': return <BookOpen className="h-4 w-4" />
      case 'CONTENT': return <Search className="h-4 w-4" />
      case 'SOCIAL': return <Users className="h-4 w-4" />
      case 'ACCESSIBILITY': return <Eye className="h-4 w-4" />
      default: return <Zap className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NAVIGATION': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'LEARNING': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'CONTENT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'SOCIAL': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'ACCESSIBILITY': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MicOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Voice commands are not supported in this browser</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Voice Commands & Accessibility</span>
              </CardTitle>
              <CardDescription>
                Control SkillCircle with your voice and enhance accessibility
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2">
              <Dialog open={showCommands} onOpenChange={setShowCommands}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Commands
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Available Voice Commands</DialogTitle>
                    <DialogDescription>
                      Say any of these phrases to control SkillCircle
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {Object.entries(
                      VOICE_COMMANDS.reduce((groups, command) => {
                        if (!groups[command.category]) groups[command.category] = []
                        groups[command.category].push(command)
                        return groups
                      }, {} as Record<string, VoiceCommand[]>)
                    ).map(([category, commands]) => (
                      <div key={category}>
                        <h3 className="font-semibold mb-2 flex items-center space-x-2">
                          {getCategoryIcon(category)}
                          <span>{category.replace('_', ' ')}</span>
                        </h3>
                        <div className="grid gap-2">
                          {commands.map(command => (
                            <div key={command.id} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <code className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                  "{command.phrase}"
                                </code>
                                <Badge className={getCategoryColor(command.category)}>
                                  {command.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{command.description}</p>
                              <p className="text-xs text-muted-foreground">{command.example}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Voice & Accessibility Settings</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="font-medium">Voice Response</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings(prev => ({ ...prev, voiceResponse: !prev.voiceResponse }))}
                      >
                        {voiceSettings.voiceResponse ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="font-medium">High Contrast</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setVoiceSettings(prev => ({ ...prev, highContrast: !prev.highContrast }))}
                      >
                        {voiceSettings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <label className="font-medium">Voice Sensitivity: {voiceSettings.sensitivity}%</label>
                      <Progress value={voiceSettings.sensitivity} className="w-full" />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={toggleVoiceCommands}
                variant={voiceSettings.isEnabled ? "default" : "outline"}
              >
                {voiceSettings.isEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isListening ? 'bg-red-500 animate-pulse' :
                  voiceSettings.isEnabled ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <div>
                  <p className="font-medium">
                    {isListening ? 'Listening...' :
                     voiceSettings.isEnabled ? 'Ready for commands' : 'Voice commands disabled'}
                  </p>
                  {lastCommand && (
                    <p className="text-sm text-muted-foreground">
                      Last: "{lastCommand}" ({Math.round(confidence)}% confidence)
                    </p>
                  )}
                </div>
              </div>

              {voiceSettings.isEnabled && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  size="sm"
                  variant={isListening ? "destructive" : "default"}
                >
                  {isListening ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              )}
            </div>

            {/* Quick Commands */}
            <div>
              <h4 className="font-medium mb-2">Quick Commands</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {VOICE_COMMANDS.slice(0, 8).map(command => (
                  <Button
                    key={command.id}
                    variant="outline"
                    size="sm"
                    onClick={() => processVoiceCommand(command.phrase)}
                    className="justify-start"
                  >
                    {getCategoryIcon(command.category)}
                    <span className="ml-2 truncate">{command.phrase}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Command History */}
            {commandHistory.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recent Commands</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {commandHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                      <span className="truncate">"{entry.command}"</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {entry.timestamp.toLocaleTimeString()}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${entry.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}