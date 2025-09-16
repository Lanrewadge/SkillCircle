import { create } from 'zustand'
import axios from 'axios'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

interface Message {
  id: string
  content: string
  type: 'text' | 'image' | 'file'
  senderId: string
  receiverId?: string
  conversationId?: string
  createdAt: string
  updatedAt: string
  sender: {
    id: string
    name: string
    avatar?: string
  }
}

interface Conversation {
  id: string
  title?: string
  type: 'direct' | 'group'
  participants: {
    id: string
    userId: string
    user: {
      id: string
      name: string
      avatar?: string
    }
  }[]
  messages: Message[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

interface MessageState {
  conversations: Conversation[]
  activeConversation: Conversation | null
  messages: Message[]
  socket: Socket | null
  isConnected: boolean
  loading: boolean

  // Actions
  initializeSocket: (token: string) => void
  disconnectSocket: () => void
  fetchConversations: () => Promise<void>
  selectConversation: (conversationId: string) => void
  sendMessage: (content: string, conversationId?: string, receiverId?: string) => Promise<void>
  markAsRead: (conversationId: string) => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  socket: null,
  isConnected: false,
  loading: false,

  initializeSocket: (token: string) => {
    const socket = io(SOCKET_URL, {
      auth: { token }
    })

    socket.on('connect', () => {
      console.log('Connected to socket server')
      set({ isConnected: true })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server')
      set({ isConnected: false })
    })

    socket.on('new_message', (message: Message) => {
      const state = get()

      // Update conversations list
      const updatedConversations = state.conversations.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            messages: [message],
            lastMessage: message,
            unreadCount: conv.id === state.activeConversation?.id
              ? conv.unreadCount
              : conv.unreadCount + 1,
            updatedAt: message.createdAt
          }
        }
        return conv
      })

      // Update active conversation messages
      let updatedMessages = state.messages
      if (state.activeConversation?.id === message.conversationId) {
        updatedMessages = [...state.messages, message]
      }

      set({
        conversations: updatedConversations,
        messages: updatedMessages
      })

      // Show notification if not in active conversation
      if (state.activeConversation?.id !== message.conversationId) {
        toast.success(`New message from ${message.sender.name}`)
      }
    })

    socket.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
      // Handle typing indicators
      console.log('User typing:', data)
    })

    set({ socket })
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  fetchConversations: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('/messages/conversations')
      set({ conversations: response.data.data, loading: false })
    } catch (error: any) {
      toast.error('Failed to load conversations')
      set({ loading: false })
    }
  },

  selectConversation: async (conversationId: string) => {
    const state = get()
    const conversation = state.conversations.find(c => c.id === conversationId)

    if (!conversation) return

    set({ activeConversation: conversation, loading: true })

    try {
      // Fetch conversation messages
      const response = await axios.get(`/messages/conversations/${conversationId}/messages`)
      const messages = response.data.data

      set({
        messages,
        loading: false,
        activeConversation: { ...conversation, unreadCount: 0 }
      })

      // Mark conversation as read
      get().markAsRead(conversationId)

      // Join conversation room for real-time updates
      if (state.socket) {
        state.socket.emit('join_conversation', conversationId)
      }
    } catch (error: any) {
      toast.error('Failed to load messages')
      set({ loading: false })
    }
  },

  sendMessage: async (content: string, conversationId?: string, receiverId?: string) => {
    const state = get()

    try {
      let targetConversationId = conversationId

      // If no conversation exists, create one
      if (!targetConversationId && receiverId) {
        const response = await axios.post('/messages/conversations', {
          participantIds: [receiverId],
          type: 'direct'
        })
        targetConversationId = response.data.data.id
      }

      if (!targetConversationId) {
        throw new Error('No conversation or receiver specified')
      }

      // Send message
      const messageResponse = await axios.post('/messages', {
        conversationId: targetConversationId,
        content,
        type: 'text'
      })

      const newMessage = messageResponse.data.data

      // Emit to socket for real-time delivery
      if (state.socket) {
        state.socket.emit('send_message', {
          conversationId: targetConversationId,
          message: newMessage
        })
      }

      // Update local state
      const updatedMessages = [...state.messages, newMessage]
      set({ messages: updatedMessages })

    } catch (error: any) {
      toast.error('Failed to send message')
    }
  },

  markAsRead: async (conversationId: string) => {
    try {
      await axios.post(`/messages/conversations/${conversationId}/read`)

      // Update local state
      const state = get()
      const updatedConversations = state.conversations.map(conv =>
        conv.id === conversationId
          ? { ...conv, unreadCount: 0 }
          : conv
      )

      set({ conversations: updatedConversations })
    } catch (error: any) {
      console.error('Failed to mark as read:', error)
    }
  }
}))