'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { toast } from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string
  role: 'student' | 'teacher'
  isEmailVerified: boolean
  skills: string[]
  bio: string
  profilePicture?: string
  createdAt: string
  lastLoginAt?: string
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: string
}

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  logoutAll: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  name: string
  role?: 'student' | 'teacher'
  skills?: string[]
  bio?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user && !!tokens

  // Store tokens in localStorage
  const storeTokens = useCallback((authTokens: AuthTokens) => {
    setTokens(authTokens)
    localStorage.setItem('accessToken', authTokens.accessToken)
    localStorage.setItem('refreshToken', authTokens.refreshToken)
  }, [])

  // Clear tokens from localStorage
  const clearTokens = useCallback(() => {
    setTokens(null)
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }, [])

  // API call with automatic token refresh
  const apiCall = useCallback(async (url: string, options: RequestInit = {}) => {
    const accessToken = tokens?.accessToken || localStorage.getItem('accessToken')

    const headers = {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      ...options.headers,
    }

    let response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    // If token expired, try to refresh
    if (response.status === 401 && accessToken) {
      const refreshed = await refreshTokenSilently()
      if (refreshed) {
        // Retry the original request with new token
        const newAccessToken = localStorage.getItem('accessToken')
        response = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        })
      }
    }

    return response
  }, [tokens])

  // Refresh token silently
  const refreshTokenSilently = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = tokens?.refreshToken || localStorage.getItem('refreshToken')
      if (!refreshToken) return false

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('accessToken', data.tokens.accessToken)
        setTokens(prev => prev ? { ...prev, accessToken: data.tokens.accessToken } : null)
        return true
      } else {
        clearTokens()
        return false
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearTokens()
      return false
    }
  }, [tokens, clearTokens])

  // Get current user
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await apiCall('/auth/me')

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        clearTokens()
      }
    } catch (error) {
      console.error('Failed to get current user:', error)
      clearTokens()
    }
  }, [apiCall, clearTokens])

  // Login
  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        storeTokens(data.tokens)
        toast.success('Login successful!')
      } else {
        throw new Error(data.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }, [storeTokens])

  // Register
  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        setUser(responseData.user)
        storeTokens(responseData.tokens)
        toast.success('Registration successful!')
      } else {
        throw new Error(responseData.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
      throw error
    }
  }, [storeTokens])

  // Logout
  const logout = useCallback(async () => {
    try {
      if (tokens?.refreshToken) {
        await apiCall('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearTokens()
      toast.success('Logged out successfully')
    }
  }, [apiCall, tokens, clearTokens])

  // Logout from all devices
  const logoutAll = useCallback(async () => {
    try {
      await apiCall('/auth/logout-all', { method: 'POST' })
    } catch (error) {
      console.error('Logout all error:', error)
    } finally {
      clearTokens()
      toast.success('Logged out from all devices')
    }
  }, [apiCall, clearTokens])

  // Refresh token manually
  const refreshToken = useCallback(async () => {
    const success = await refreshTokenSilently()
    if (!success) {
      toast.error('Session expired. Please log in again.')
    }
  }, [refreshTokenSilently])

  // Update profile
  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const response = await apiCall('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (response.ok) {
        setUser(responseData.user)
        toast.success('Profile updated successfully!')
      } else {
        throw new Error(responseData.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
      throw error
    }
  }, [apiCall])

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiCall('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password changed successfully!')
      } else {
        throw new Error(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to change password')
      throw error
    }
  }, [apiCall])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshTokenValue = localStorage.getItem('refreshToken')

      if (accessToken && refreshTokenValue) {
        setTokens({
          accessToken,
          refreshToken: refreshTokenValue,
          tokenType: 'Bearer',
          expiresIn: '15m'
        })

        await getCurrentUser()
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [getCurrentUser])

  // Set up automatic token refresh
  useEffect(() => {
    if (!tokens?.accessToken) return

    // Refresh token 2 minutes before expiry (13 minutes for 15-minute tokens)
    const refreshInterval = setInterval(() => {
      refreshTokenSilently()
    }, 13 * 60 * 1000) // 13 minutes

    return () => clearInterval(refreshInterval)
  }, [tokens, refreshTokenSilently])

  const value: AuthContextType = {
    user,
    tokens,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    logoutAll,
    refreshToken,
    updateProfile,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}