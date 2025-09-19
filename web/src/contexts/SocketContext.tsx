'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
// import { io, Socket } from 'socket.io-client'

// Placeholder for Socket type until socket.io-client is installed
interface Socket {
  emit: (event: string, ...args: any[]) => void
  on: (event: string, callback: Function) => void
  off: (event: string, callback?: Function) => void
  disconnect: () => void
  connected: boolean
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  sendMessage: (conversationId: string, message: string) => void
  joinConversation: (conversationId: string) => void
  leaveConversation: (conversationId: string) => void
  onMessageReceived: (callback: (message: any) => void) => void
  onUserStatusChanged: (callback: (data: any) => void) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: React.ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize socket connection when socket.io-client is available
    // const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002', {
    //   autoConnect: true,
    //   withCredentials: true,
    //   transports: ['websocket', 'polling']
    // })

    // Mock socket for now
    const mockSocket: Socket = {
      emit: (event: string, ...args: any[]) => {
        console.log('Mock socket emit:', event, args)
      },
      on: (event: string, callback: Function) => {
        console.log('Mock socket on:', event)
      },
      off: (event: string, callback?: Function) => {
        console.log('Mock socket off:', event)
      },
      disconnect: () => {
        console.log('Mock socket disconnect')
        setIsConnected(false)
      },
      connected: true
    }

    setSocket(mockSocket)
    setIsConnected(true)

    // Real socket event handlers would be:
    // newSocket.on('connect', () => {
    //   console.log('Connected to server')
    //   setIsConnected(true)
    // })

    // newSocket.on('disconnect', () => {
    //   console.log('Disconnected from server')
    //   setIsConnected(false)
    // })

    // newSocket.on('error', (error) => {
    //   console.error('Socket error:', error)
    // })

    // setSocket(newSocket)

    return () => {
      // newSocket.disconnect()
      mockSocket.disconnect()
    }
  }, [])

  const sendMessage = useCallback((conversationId: string, message: string) => {
    if (socket) {
      socket.emit('send_message', {
        conversationId,
        message,
        timestamp: new Date().toISOString()
      })
    }
  }, [socket])

  const joinConversation = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('join_conversation', conversationId)
    }
  }, [socket])

  const leaveConversation = useCallback((conversationId: string) => {
    if (socket) {
      socket.emit('leave_conversation', conversationId)
    }
  }, [socket])

  const onMessageReceived = useCallback((callback: (message: any) => void) => {
    if (socket) {
      socket.on('message_received', callback)
      return () => {
        socket.off('message_received', callback)
      }
    }
  }, [socket])

  const onUserStatusChanged = useCallback((callback: (data: any) => void) => {
    if (socket) {
      socket.on('user_status_changed', callback)
      return () => {
        socket.off('user_status_changed', callback)
      }
    }
  }, [socket])

  const value: SocketContextType = {
    socket,
    isConnected,
    sendMessage,
    joinConversation,
    leaveConversation,
    onMessageReceived,
    onUserStatusChanged
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

// Hook for online users
export const useOnlineUsers = () => {
  const { socket } = useSocket()
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (!socket) return

    socket.on('online_users_updated', (users: string[]) => {
      setOnlineUsers(users)
    })

    return () => {
      socket.off('online_users_updated')
    }
  }, [socket])

  return onlineUsers
}

// Hook for typing indicators
export const useTypingIndicator = (conversationId: string) => {
  const { socket } = useSocket()
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  const startTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing_start', conversationId)
    }
  }, [socket, conversationId])

  const stopTyping = useCallback(() => {
    if (socket) {
      socket.emit('typing_stop', conversationId)
    }
  }, [socket, conversationId])

  useEffect(() => {
    if (!socket) return

    socket.on('user_typing', ({ userId, conversationId: convId }: any) => {
      if (convId === conversationId) {
        setTypingUsers(prev => [...prev.filter(id => id !== userId), userId])
      }
    })

    socket.on('user_stopped_typing', ({ userId, conversationId: convId }: any) => {
      if (convId === conversationId) {
        setTypingUsers(prev => prev.filter(id => id !== userId))
      }
    })

    return () => {
      socket.off('user_typing')
      socket.off('user_stopped_typing')
    }
  }, [socket, conversationId])

  return { typingUsers, startTyping, stopTyping }
}