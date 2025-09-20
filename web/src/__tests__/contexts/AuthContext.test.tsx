import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

global.fetch = jest.fn()

const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    fetch.mockClear()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
  })

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.isLoading).toBe(true)
  })

  it('loads user from token on initialization', async () => {
    const mockToken = 'mock-jwt-token'
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    mockLocalStorage.getItem.mockReturnValue(mockToken)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, user: mockUser }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockUser)
    })

    expect(fetch).toHaveBeenCalledWith('/api/v1/auth/profile', {
      headers: {
        'Authorization': `Bearer ${mockToken}`,
        'Content-Type': 'application/json',
      },
    })
  })

  it('handles login successfully', async () => {
    const mockToken = 'mock-jwt-token'
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: mockToken,
        user: mockUser,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.login('john@example.com', 'password123')
      expect(response.success).toBe(true)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('handles login failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: 'Invalid credentials',
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.login('john@example.com', 'wrongpassword')
      expect(response.success).toBe(false)
      expect(response.message).toBe('Invalid credentials')
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('handles registration successfully', async () => {
    const mockToken = 'mock-jwt-token'
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: mockToken,
        user: mockUser,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      })
      expect(response.success).toBe(true)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', mockToken)
    expect(result.current.isAuthenticated).toBe(true)
    expect(result.current.user).toEqual(mockUser)
  })

  it('handles logout correctly', async () => {
    const mockToken = 'mock-jwt-token'
    mockLocalStorage.getItem.mockReturnValue(mockToken)

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.logout()
    })

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('handles token refresh', async () => {
    const mockRefreshToken = 'mock-refresh-token'
    const mockNewToken = 'new-access-token'

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'refreshToken') return mockRefreshToken
      return null
    })

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        accessToken: mockNewToken,
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.refreshToken()
      expect(response.success).toBe(true)
    })

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', mockNewToken)
  })

  it('handles network errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      const response = await result.current.login('john@example.com', 'password123')
      expect(response.success).toBe(false)
      expect(response.message).toBe('Network error occurred')
    })
  })

  it('automatically refreshes token on 401 responses', async () => {
    const mockToken = 'expired-token'
    const mockRefreshToken = 'valid-refresh-token'
    const mockNewToken = 'new-access-token'

    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'accessToken') return mockToken
      if (key === 'refreshToken') return mockRefreshToken
      return null
    })

    // First call returns 401
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Token expired' }),
    })

    // Refresh token call
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        accessToken: mockNewToken,
      }),
    })

    // Retry original call with new token
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        user: { id: '1', name: 'John Doe' },
      }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper })

    // This should trigger the automatic refresh flow
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(fetch).toHaveBeenCalledTimes(3) // Original call, refresh, retry
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', mockNewToken)
  })
})