import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@skill-circle/shared'
import { authApi } from '@/lib/api'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

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
  name: string
  password: string
  isTeacher?: boolean
  isLearner?: boolean
  address: string
  city: string
  country: string
  latitude: number
  longitude: number
  bio?: string
}

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
          const { user, token } = await authApi.login(email, password)

          // Store token in cookie
          Cookies.set('authToken', token, { expires: 7 })

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          toast.success('Successfully logged in!')
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Login failed'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true })
        try {
          const { user, token } = await authApi.register(userData)

          // Store token in cookie
          Cookies.set('authToken', token, { expires: 7 })

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          })

          toast.success('Account created successfully!')
          return true
        } catch (error: any) {
          const message = error.response?.data?.message || error.message || 'Registration failed'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      logout: () => {
        authApi.logout()

        // Remove token from cookie
        Cookies.remove('authToken')

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
        const token = Cookies.get('authToken')

        if (!token) {
          set({ isAuthenticated: false, user: null, token: null })
          return
        }

        try {
          const user = await authApi.profile()

          set({
            user,
            token,
            isAuthenticated: true
          })
        } catch (error) {
          // Token is invalid, clear it
          Cookies.remove('authToken')

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