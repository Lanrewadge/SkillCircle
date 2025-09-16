import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  username: string
  name: string
  avatar?: string
  bio?: string
  verified: boolean
  isTeacher: boolean
  isLearner: boolean
  rating: number
  reviewCount: number
  city?: string
  country?: string
  createdAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  checkAuth: () => Promise<void>
}

interface RegisterData {
  email: string
  username: string
  firstName: string
  lastName: string
  password: string
  location?: string
  latitude?: number
  longitude?: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

// Configure axios defaults
axios.defaults.baseURL = API_URL

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/auth/login', {
            email,
            password
          })

          const { user, token } = response.data.data

          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Store token in cookie
          Cookies.set('token', token, { expires: 7 })

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          toast.success('Successfully logged in!')
          return true
        } catch (error: any) {
          const message = error.response?.data?.error?.message || 'Login failed'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true })
        try {
          const response = await axios.post('/auth/register', userData)

          const { user, token } = response.data.data

          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Store token in cookie
          Cookies.set('token', token, { expires: 7 })

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          toast.success('Account created successfully!')
          return true
        } catch (error: any) {
          const message = error.response?.data?.error?.message || 'Registration failed'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        // Remove token from axios headers
        delete axios.defaults.headers.common['Authorization']

        // Remove token from cookie
        Cookies.remove('token')

        set({
          user: null,
          token: null,
          isAuthenticated: false
        })

        toast.success('Logged out successfully')
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      },

      checkAuth: async () => {
        const token = Cookies.get('token')

        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          // Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          const response = await axios.get('/auth/me')
          const user = response.data.data

          set({
            user,
            token,
            isAuthenticated: true
          })
        } catch (error) {
          // Token is invalid, clear it
          Cookies.remove('token')
          delete axios.defaults.headers.common['Authorization']

          set({
            user: null,
            token: null,
            isAuthenticated: false
          })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)