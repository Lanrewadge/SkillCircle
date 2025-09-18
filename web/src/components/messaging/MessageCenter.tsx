'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MessageCircle,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Star,
  Clock,
  CheckCheck,
  Circle,
  User
} from 'lucide-react'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'file' | 'booking'
  status: 'sent' | 'delivered' | 'read'
  metadata?: {
    fileName?: string
    fileSize?: string
    imageUrl?: string
    bookingId?: string
  }
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantAvatar: string
  participantRole: 'learner' | 'tutor'
  lastMessage: Message
  unreadCount: number
  isOnline: boolean
  skill?: string
  sessionStatus?: 'upcoming' | 'ongoing' | 'completed'
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    participantId: '2',
    participantName: 'Sarah Johnson',
    participantAvatar: '👩‍🏫',
    participantRole: 'tutor',
    skill: 'JavaScript Programming',
    sessionStatus: 'upcoming',
    isOnline: true,
    unreadCount: 2,
    lastMessage: {
      id: '1',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: '👩‍🏫',
      content: "Great! I've prepared some exercises for our session tomorrow.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  },
  {
    id: '2',
    participantId: '3',
    participantName: 'Michael Chen',
    participantAvatar: '👨‍💻',
    participantRole: 'learner',
    skill: 'Python Data Science',
    sessionStatus: 'completed',
    isOnline: false,
    unreadCount: 0,
    lastMessage: {
      id: '2',
      senderId: '1',
      senderName: 'You',
      senderAvatar: '👤',
      content: "Thanks for the great session! The pandas tutorial was very helpful.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  },
  {
    id: '3',
    participantId: '4',
    participantName: 'Emma Wilson',
    participantAvatar: '👩‍🎨',
    participantRole: 'tutor',
    skill: 'UI/UX Design',
    sessionStatus: 'ongoing',
    isOnline: true,
    unreadCount: 1,
    lastMessage: {
      id: '3',
      senderId: '4',
      senderName: 'Emma Wilson',
      senderAvatar: '👩‍🎨',
      content: "Can you share your screen? I'd like to review your wireframes.",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text',
      status: 'delivered'
    }
  }
]

const mockMessages: { [conversationId: string]: Message[] } = {
  '1': [
    {
      id: '1',
      senderId: '1',
      senderName: 'You',
      senderAvatar: '👤',
      content: "Hi Sarah! I'm excited about our JavaScript session tomorrow. What should I prepare?",
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '2',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: '👩‍🏫',
      content: "Hi! Great to hear you're excited. I recommend reviewing basic ES6 features like arrow functions and destructuring.",
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      type: 'text',
      status: 'read'
    },
    {
      id: '3',
      senderId: '2',
      senderName: 'Sarah Johnson',
      senderAvatar: '👩‍🏫',
      content: "Great! I've prepared some exercises for our session tomorrow.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      type: 'text',
      status: 'read'
    }
  ]
}

export default function MessageCenter() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentConversation = conversations.find(c => c.id === selectedConversation)

  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation] || [])
      // Mark conversation as read
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversation
          ? { ...conv, unreadCount: 0 }
          : conv
      ))
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      senderAvatar: '👤',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update last message in conversation
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation
        ? { ...conv, lastMessage: message }
        : conv
    ))

    // Simulate typing indicator and response
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        // Simulate a response in real app
      }, 2000)
    }, 1000)
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.skill?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Circle className="h-3 w-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
    }
  }

  const getSessionStatusBadge = (status: string) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    }
    return (
      <Badge variant="outline" className={colors[status as keyof typeof colors]}>
        {status}
      </Badge>
    )
  }

  return (
    <Card className="h-[600px] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4 mr-2" />
              New
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedConversation === conversation.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="text-2xl">{conversation.participantAvatar}</div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.participantName}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessage.timestamp)}
                      </span>
                    </div>

                    {conversation.skill && (
                      <p className="text-xs text-blue-600 mb-1">{conversation.skill}</p>
                    )}

                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage.content}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {conversation.sessionStatus && getSessionStatusBadge(conversation.sessionStatus)}
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="bg-blue-600 text-xs px-2 py-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation && currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="text-2xl">{currentConversation.participantAvatar}</div>
                    {currentConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentConversation.participantName}</h3>
                    <p className="text-sm text-gray-600">
                      {currentConversation.skill} • {currentConversation.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === '1'
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg p-3 ${
                            isOwn
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isOwn && getStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  )
                })}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex items-end gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 bottom-2"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}