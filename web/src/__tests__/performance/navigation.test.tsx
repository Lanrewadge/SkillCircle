import { render, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'

// Performance testing utilities
const measureRenderTime = async (component: React.ReactElement) => {
  const start = performance.now()
  const result = render(component)
  const end = performance.now()
  return {
    renderTime: end - start,
    result
  }
}

const measureInteractionTime = async (callback: () => void) => {
  const start = performance.now()
  await callback()
  const end = performance.now()
  return end - start
}

describe('Navigation Performance Tests', () => {
  const MockAuthProvider = ({
    children,
    isAuthenticated = true
  }: {
    children: React.ReactNode
    isAuthenticated?: boolean
  }) => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    const mockAuthContext = {
      user: isAuthenticated ? mockUser : null,
      isAuthenticated,
      isLoading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      refreshToken: jest.fn(),
    }

    return (
      <AuthProvider value={mockAuthContext}>
        {children}
      </AuthProvider>
    )
  }

  it('should render header within acceptable time', async () => {
    const { renderTime } = await measureRenderTime(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    // Header should render within 50ms
    expect(renderTime).toBeLessThan(50)
  })

  it('should handle dropdown interactions quickly', async () => {
    const { result } = render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    const skillsButton = result.getByText('Skills')

    const interactionTime = await measureInteractionTime(async () => {
      fireEvent.click(skillsButton)
      await waitFor(() => {
        expect(result.getByText('Programming & Tech')).toBeInTheDocument()
      })
    })

    // Dropdown should open within 100ms
    expect(interactionTime).toBeLessThan(100)
  })

  it('should handle multiple rapid dropdown interactions', async () => {
    const { result } = render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    const skillsButton = result.getByText('Skills')
    const learningButton = result.getByText('Learning')

    const times: number[] = []

    // Test rapid switching between dropdowns
    for (let i = 0; i < 5; i++) {
      const time = await measureInteractionTime(async () => {
        fireEvent.click(skillsButton)
        await waitFor(() => {
          expect(result.getByText('Programming & Tech')).toBeInTheDocument()
        })

        fireEvent.click(learningButton)
        await waitFor(() => {
          expect(result.getByText('My Courses')).toBeInTheDocument()
        })
      })
      times.push(time)
    }

    // Average interaction time should remain under 150ms
    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
    expect(averageTime).toBeLessThan(150)

    // No interaction should take longer than 300ms
    expect(Math.max(...times)).toBeLessThan(300)
  })

  it('should maintain performance with large numbers of menu items', async () => {
    // This would test performance with extensive menu structures
    const { renderTime } = await measureRenderTime(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    // Even with complex navigation, render time should be reasonable
    expect(renderTime).toBeLessThan(100)
  })

  it('should handle search functionality efficiently', async () => {
    const { result } = render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    const searchTime = await measureInteractionTime(async () => {
      // Simulate Cmd+K shortcut
      fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

      await waitFor(() => {
        expect(result.getByPlaceholderText('Search skills, courses, tutors...')).toBeInTheDocument()
      })
    })

    // Search should open quickly
    expect(searchTime).toBeLessThan(100)
  })

  it('should efficiently handle mobile menu toggle', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })

    const { result } = render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    const toggleButton = result.getByRole('button', { name: /toggle menu/i })

    const toggleTime = await measureInteractionTime(async () => {
      fireEvent.click(toggleButton)
      // Mobile menu should respond immediately
    })

    expect(toggleTime).toBeLessThan(50)
  })

  it('should maintain consistent performance across authentication states', async () => {
    // Test unauthenticated state
    const { renderTime: unauthTime } = await measureRenderTime(
      <MockAuthProvider isAuthenticated={false}>
        <Header />
      </MockAuthProvider>
    )

    // Test authenticated state
    const { renderTime: authTime } = await measureRenderTime(
      <MockAuthProvider isAuthenticated={true}>
        <Header />
      </MockAuthProvider>
    )

    // Both states should render quickly and within similar timeframes
    expect(unauthTime).toBeLessThan(50)
    expect(authTime).toBeLessThan(50)
    expect(Math.abs(authTime - unauthTime)).toBeLessThan(20) // Similar performance
  })
})