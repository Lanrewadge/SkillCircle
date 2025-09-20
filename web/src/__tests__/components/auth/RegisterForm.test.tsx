import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'
import RegisterForm from '@/components/auth/RegisterForm'

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
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn().mockResolvedValue({ success: true }),
    refreshToken: jest.fn(),
  }

  return (
    <AuthProvider value={mockAuthContext}>
      {children}
    </AuthProvider>
  )
}

describe('RegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders registration form correctly', () => {
    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

    expect(screen.getByText('Create your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

    const submitButton = screen.getByRole('button', { name: /create account/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument()
    })
  })

  it('validates password strength', async () => {
    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

    const passwordInput = screen.getByPlaceholderText('Create a password')
    fireEvent.change(passwordInput, { target: { value: 'weak' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters long')).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    fireEvent.change(passwordInput, { target: { value: 'StrongPass123!' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPass123!' } })
    fireEvent.blur(confirmPasswordInput)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockRegister = jest.fn().mockResolvedValue({ success: true })

    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

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

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'StrongPass123!',
        role: 'student'
      })
    })
  })

  it('shows loading state during submission', async () => {
    const mockRegister = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

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

    expect(screen.getByText('Creating account...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('handles registration error', async () => {
    const mockRegister = jest.fn().mockRejectedValue(new Error('Email already exists'))

    render(
      <MockAuthProvider>
        <RegisterForm />
      </MockAuthProvider>
    )

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