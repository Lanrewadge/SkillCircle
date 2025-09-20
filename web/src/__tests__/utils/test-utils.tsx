import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock implementations for testing
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'student' as const
}

export const mockAuthContext = {
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: jest.fn().mockResolvedValue({ success: true }),
  logout: jest.fn().mockResolvedValue(undefined),
  register: jest.fn().mockResolvedValue({ success: true }),
  refreshToken: jest.fn().mockResolvedValue({ success: true }),
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: Partial<typeof mockAuthContext>
  isAuthenticated?: boolean
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    authContext = {},
    isAuthenticated = true,
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const AuthWrapper = ({ children }: { children: ReactNode }) => {
    const contextValue = {
      ...mockAuthContext,
      ...authContext,
      user: isAuthenticated ? (authContext.user || mockUser) : null,
      isAuthenticated,
    }

    return (
      <AuthProvider value={contextValue}>
        {children}
      </AuthProvider>
    )
  }

  return render(ui, { wrapper: AuthWrapper, ...renderOptions })
}

// Mock fetch utility
export const mockFetch = (response: any, options: { ok?: boolean; status?: number } = {}) => {
  const { ok = true, status = 200 } = options

  global.fetch = jest.fn().mockResolvedValueOnce({
    ok,
    status,
    json: async () => response,
  })
}

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

export const setupLocalStorageMock = () => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  })
}

// Mock router
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

export const setupRouterMock = () => {
  jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/test-path',
    useSearchParams: () => new URLSearchParams(),
  }))
}

// Form testing utilities
export const fillForm = (form: HTMLFormElement, data: Record<string, string>) => {
  Object.entries(data).forEach(([name, value]) => {
    const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      fireEvent.change(input, { target: { value } })
    }
  })
}

// Async testing utilities
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })
}

export const waitForErrorToAppear = async (errorText: string) => {
  await waitFor(() => {
    expect(screen.getByText(errorText)).toBeInTheDocument()
  })
}

// Performance testing utilities
export const measureRenderTime = async (renderFn: () => any) => {
  const start = performance.now()
  const result = await renderFn()
  const end = performance.now()
  return {
    renderTime: end - start,
    result
  }
}

// Accessibility testing helpers
export const checkAccessibility = (container: HTMLElement) => {
  // Check for basic accessibility attributes
  const focusableElements = container.querySelectorAll(
    'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )

  focusableElements.forEach(element => {
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      expect(element).toHaveAttribute('aria-label', expect.any(String))
    }
  })
}

// API response mocks
export const createMockResponse = (data: any, success = true) => ({
  success,
  ...(success ? { data } : { error: data }),
  timestamp: new Date().toISOString(),
})

export const createMockAuthResponse = (user = mockUser, token = 'mock-token') => ({
  success: true,
  user,
  token,
  refreshToken: 'mock-refresh-token',
})

export const createMockErrorResponse = (message: string, code?: string) => ({
  success: false,
  message,
  code,
  timestamp: new Date().toISOString(),
})

// Test data generators
export const generateTestUser = (overrides: Partial<typeof mockUser> = {}) => ({
  ...mockUser,
  ...overrides,
  id: overrides.id || Math.random().toString(36).substr(2, 9),
})

export const generateTestCredentials = () => ({
  email: `test${Math.random().toString(36).substr(2, 9)}@example.com`,
  password: 'TestPass123!',
})

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'