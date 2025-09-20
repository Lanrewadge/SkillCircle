import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import LoginForm from '@/components/auth/LoginForm'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthContext = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: jest.fn().mockResolvedValue({ success: true }),
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

describe('LoginForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders login form correctly', () => {
    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockLogin = jest.fn().mockResolvedValue({ success: true })

    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('shows loading state during submission', async () => {
    const mockLogin = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(submitButton)

    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('handles login error', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'))

    render(
      <MockAuthProvider>
        <LoginForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })
})