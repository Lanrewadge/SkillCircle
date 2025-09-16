'use client'

import { useEffect, useState } from 'react'
import { useMessageStore } from '@/stores/messageStore'
import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Search,
  MessageCircle,
  Phone,
  Video,
  MoreVertical,
  Loader2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function MessagesPage() {
  const { user, token } = useAuthStore()
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    isConnected,
    initializeSocket,
    fetchConversations,
    selectConversation,
    sendMessage
  } = useMessageStore()

  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (token) {
      initializeSocket(token)
      fetchConversations()
    }

    return () => {
      useMessageStore.getState().disconnectSocket()
    }
  }, [token, initializeSocket, fetchConversations])

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeConversation) return

    await sendMessage(messageInput, activeConversation.id)
    setMessageInput('')
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.user.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const getOtherParticipant = (conversation: any) => {
    return conversation.participants.find((p: any) => p.user.id !== user?.id)?.user
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-500">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations yet</p>
                  <p className="text-sm">Start a conversation with a teacher!</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const otherUser = getOtherParticipant(conversation)
                  const isActive = activeConversation?.id === conversation.id

                  return (
                    <button
                      key={conversation.id}
                      onClick={() => selectConversation(conversation.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                          <AvatarFallback>
                            {otherUser?.name?.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">
                              {otherUser?.name}
                            </h3>
                            {conversation.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), {
                                  addSuffix: true
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mt-1">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="min-w-[20px] h-5 text-xs rounded-full flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={getOtherParticipant(activeConversation)?.avatar}
                        alt={getOtherParticipant(activeConversation)?.name}
                      />
                      <AvatarFallback>
                        {getOtherParticipant(activeConversation)?.name
                          ?.split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {getOtherParticipant(activeConversation)?.name}
                      </h3>
                      <p className="text-sm text-gray-500">Online</p>
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
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.senderId === user?.id

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-500">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}