'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSocket, useTypingIndicator } from '@/contexts/SocketContext'
import { withErrorHandling } from '@/lib/error-handling'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  status: 'sending' | 'sent' | 'delivered' | 'read'
}

interface User {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

interface RealTimeChatProps {
  conversationId: string
  currentUser: User
  otherUser: User
  initialMessages?: Message[]
}

export const RealTimeChat: React.FC<RealTimeChatProps> = ({
  conversationId,
  currentUser,
  otherUser,
  initialMessages = []
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { isConnected, sendMessage, joinConversation, leaveConversation, onMessageReceived } = useSocket()
  const { typingUsers, startTyping, stopTyping } = useTypingIndicator(conversationId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    joinConversation(conversationId)

    const cleanup = onMessageReceived((message: Message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      leaveConversation(conversationId)
      if (cleanup) cleanup()
    }
  }, [conversationId, joinConversation, leaveConversation, onMessageReceived])

  const handleSendMessage = withErrorHandling(async () => {
    if (!newMessage.trim()) return

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'text',
      status: 'sending'
    }

    setMessages(prev => [...prev, tempMessage])
    setNewMessage('')
    stopTyping()

    // Send via WebSocket
    sendMessage(conversationId, tempMessage.content)

    // Update message status after sending
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === tempMessage.id
          ? { ...msg, status: 'sent' as const }
          : msg
      ))
    }, 500)
  }, { showToast: false })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)
    if (e.target.value.trim()) {
      startTyping()
    } else {
      stopTyping()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isOwnMessage = (senderId: string) => senderId === currentUser.id

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border rounded-lg">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {otherUser.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {otherUser.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {otherUser.isOnline ? 'Online' : `Last seen ${otherUser.lastSeen}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm text-center">
          Reconnecting...
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => {
          const isOwn = isOwnMessage(message.senderId)
          const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId)

          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} items-end space-x-2`}
            >
              {!isOwn && (
                <Avatar className={`w-8 h-8 ${showAvatar ? 'visible' : 'invisible'}`}>
                  <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                  <AvatarFallback className="text-xs">
                    {otherUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-1' : 'order-2'}`}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                <div className={`flex items-center mt-1 space-x-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                  {isOwn && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        message.status === 'sending' ? 'bg-yellow-100 text-yellow-800' :
                        message.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        message.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {message.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback className="text-xs">
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
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

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12"
              disabled={!isConnected}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}