import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'
import RegisterForm from '@/components/auth/RegisterForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock fetch for API calls
global.fetch = jest.fn()

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockClear()
    mockPush.mockClear()
  })

  describe('User Registration Flow', () => {
    it('should complete full registration flow successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      // Mock successful registration API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: mockUser,
        }),
      })

      render(
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      )

      // Fill in registration form
      const nameInput = screen.getByPlaceholderText('Enter your full name')
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Create a password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /create account/i })

      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } })

      fireEvent.click(submitButton)

      // Wait for API call and navigation
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'StrongPass123!',
            role: 'student'
          }),
        })
      })

      // Verify success state
      expect(screen.getByText('Account created successfully!')).toBeInTheDocument()
    })

    it('should handle registration validation errors', async () => {
      // Mock validation error response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          errors: [
            { msg: 'Email already exists', param: 'email' }
          ],
        }),
      })

      render(
        <AuthProvider>
          <RegisterForm />
        </AuthProvider>
      )

      // Fill in form with existing email
      const nameInput = screen.getByPlaceholderText('Enter your full name')
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Create a password')
      const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
      const submitButton = screen.getByRole('button', { name: /create account/i })

      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'StrongPass123!' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Email already exists')).toBeInTheDocument()
      })
    })
  })

  describe('User Login Flow', () => {
    it('should complete full login flow successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      // Mock successful login API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: mockUser,
        }),
      })

      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      )

      // Fill in login form
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })

      fireEvent.click(submitButton)

      // Wait for API call and navigation
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'john@example.com',
            password: 'StrongPass123!',
          }),
        })
      })

      // Verify redirect to dashboard
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })

    it('should handle login with invalid credentials', async () => {
      // Mock invalid credentials response
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Invalid credentials',
        }),
      })

      render(
        <AuthProvider>
          <LoginForm />
        </AuthProvider>
      )

      // Fill in login form with wrong credentials
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      const submitButton = screen.getByRole('button', { name: /sign in/i })

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })

      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })

      // Should not redirect on failed login
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('Token Refresh Flow', () => {
    it('should automatically refresh expired tokens', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      // Mock localStorage with expired token
      const mockLocalStorage = {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'accessToken') return 'expired-token'
          if (key === 'refreshToken') return 'valid-refresh-token'
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

      // Mock failed profile request (401) followed by successful refresh
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Token expired' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            user: mockUser,
          }),
        })

      render(
        <AuthProvider>
          <div data-testid="auth-content">Content</div>
        </AuthProvider>
      )

      // Wait for auto-refresh flow to complete
      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(3) // Profile, refresh, profile retry
      })

      // Verify new tokens were stored
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', 'new-access-token')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', 'new-refresh-token')
    })

    it('should logout user when refresh token is invalid', async () => {
      const mockLocalStorage = {
        getItem: jest.fn().mockImplementation((key) => {
          if (key === 'accessToken') return 'expired-token'
          if (key === 'refreshToken') return 'invalid-refresh-token'
          return null
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

      // Mock failed profile request followed by failed refresh
      fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Token expired' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 403,
          json: async () => ({
            success: false,
            message: 'Invalid refresh token',
          }),
        })

      render(
        <AuthProvider>
          <div data-testid="auth-content">Content</div>
        </AuthProvider>
      )

      await waitFor(() => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
      })
    })
  })

  describe('Session Persistence', () => {
    it('should restore user session from stored tokens', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      }

      const mockLocalStorage = {
        getItem: jest.fn().mockReturnValue('valid-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      }
      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

      // Mock successful profile request
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          user: mockUser,
        }),
      })

      const { rerender } = render(
        <AuthProvider>
          <div data-testid="auth-content">Content</div>
        </AuthProvider>
      )

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith('/api/v1/auth/profile', {
          headers: {
            'Authorization': 'Bearer valid-token',
            'Content-Type': 'application/json',
          },
        })
      })

      // Verify user session is restored
      expect(screen.getByTestId('auth-content')).toBeInTheDocument()
    })
  })
})