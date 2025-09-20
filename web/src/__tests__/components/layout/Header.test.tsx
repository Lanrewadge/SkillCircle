import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const MockAuthProvider = ({
  children,
  isAuthenticated = false,
  user = null
}: {
  children: React.ReactNode
  isAuthenticated?: boolean
  user?: any
}) => {
  const mockAuthContext = {
    user,
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

describe('Header', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders header with logo and navigation for unauthenticated user', () => {
    render(
      <MockAuthProvider>
        <Header />
      </MockAuthProvider>
    )

    expect(screen.getByText('SkillCircle')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('renders header with dropdown menus for authenticated user', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    expect(screen.getByText('SkillCircle')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Learning')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument()
  })

  it('opens skills dropdown when clicked', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    const skillsButton = screen.getByText('Skills')
    fireEvent.click(skillsButton)

    await waitFor(() => {
      expect(screen.getByText('Programming & Tech')).toBeInTheDocument()
      expect(screen.getByText('Business & Marketing')).toBeInTheDocument()
      expect(screen.getByText('Creative Arts')).toBeInTheDocument()
      expect(screen.getByText('Academic Subjects')).toBeInTheDocument()
    })
  })

  it('opens learning dropdown when clicked', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    const learningButton = screen.getByText('Learning')
    fireEvent.click(learningButton)

    await waitFor(() => {
      expect(screen.getByText('My Courses')).toBeInTheDocument()
      expect(screen.getByText('Progress Tracking')).toBeInTheDocument()
      expect(screen.getByText('Certificates')).toBeInTheDocument()
    })
  })

  it('shows mobile menu toggle on small screens', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  it('handles search functionality', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    // Test keyboard shortcut (Cmd/Ctrl + K)
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search skills, courses, tutors...')).toBeInTheDocument()
    })
  })

  it('shows notifications bell for authenticated users', () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    expect(screen.getByRole('button', { name: /notifications/i })).toBeInTheDocument()
  })

  it('shows user avatar and dropdown for authenticated users', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    render(
      <MockAuthProvider isAuthenticated={true} user={mockUser}>
        <Header />
      </MockAuthProvider>
    )

    const userAvatar = screen.getByText('JD') // Avatar initials
    expect(userAvatar).toBeInTheDocument()

    fireEvent.click(userAvatar)

    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument()
      expect(screen.getByText('Settings')).toBeInTheDocument()
      expect(screen.getByText('Sign out')).toBeInTheDocument()
    })
  })

  it('handles logout correctly', async () => {
    const mockLogout = jest.fn()
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'student'
    }

    const MockAuthProviderWithLogout = ({ children }: { children: React.ReactNode }) => {
      const mockAuthContext = {
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        login: jest.fn(),
        logout: mockLogout,
        register: jest.fn(),
        refreshToken: jest.fn(),
      }

      return (
        <AuthProvider value={mockAuthContext}>
          {children}
        </AuthProvider>
      )
    }

    render(
      <MockAuthProviderWithLogout>
        <Header />
      </MockAuthProviderWithLogout>
    )

    const userAvatar = screen.getByText('JD')
    fireEvent.click(userAvatar)

    await waitFor(() => {
      const signOutButton = screen.getByText('Sign out')
      fireEvent.click(signOutButton)
    })

    expect(mockLogout).toHaveBeenCalled()
  })
})