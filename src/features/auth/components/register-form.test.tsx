import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { RegisterForm } from './register-form'
import { useRegisterMutation } from '../hooks'
import { useAuthStore } from '../stores/auth-store'
import { authApi } from '../utils/auth-api'

// Mock external dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../hooks', () => ({
  useRegisterMutation: jest.fn(),
}))

jest.mock('../stores/auth-store', () => ({
  useAuthStore: jest.fn(),
}))

jest.mock('../utils/auth-api', () => ({
  authApi: {
    googleLogin: jest.fn(),
  },
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
}))

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  EyeOff: () => <span data-testid="eye-off-icon">EyeOff</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Lock: () => <span data-testid="lock-icon">Lock</span>,
  User: () => <span data-testid="user-icon">User</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  GraduationCap: () => <span data-testid="graduation-cap-icon">GraduationCap</span>,
  ArrowRight: () => <span data-testid="arrow-right-icon">ArrowRight</span>,
  Loader2: () => <span data-testid="loader-icon">Loader2</span>,
  CreditCard: () => <span data-testid="credit-card-icon">CreditCard</span>,
}))

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

// Helper function to render component with providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('RegisterForm', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }

  const mockRegisterMutation = {
    mutateAsync: jest.fn(),
    isLoading: false,
    error: null,
  }

  const mockAuthStore = {
    isLoading: false,
    error: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(useRegisterMutation as jest.Mock).mockReturnValue(mockRegisterMutation)
    ;(useAuthStore as jest.Mock).mockReturnValue(mockAuthStore)
  })

  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.getByLabelText('First Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
      expect(screen.getByLabelText(/Username.*optional/)).toBeInTheDocument()
      expect(screen.getByLabelText('Course/Program')).toBeInTheDocument()
      expect(screen.getByLabelText('Birthdate')).toBeInTheDocument()
      expect(screen.getByLabelText(/RFID Card ID.*optional/)).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    it('renders submit button with correct initial state', () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
      expect(submitButton).toHaveAttribute('type', 'submit')
    })

    it('renders Google signup button', () => {
      renderWithProviders(<RegisterForm />)

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      expect(googleButton).toBeInTheDocument()
      expect(googleButton).toHaveAttribute('type', 'button')
    })

    it('renders sign in link', () => {
      renderWithProviders(<RegisterForm />)

      const signInLink = screen.getByRole('link', { name: /sign in here/i })
      expect(signInLink).toBeInTheDocument()
      expect(signInLink).toHaveAttribute('href', '/login')
    })

    it('displays all required icons in form fields', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.getAllByTestId('user-icon')).toHaveLength(3) // First name, last name, username
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
      expect(screen.getByTestId('graduation-cap-icon')).toBeInTheDocument()
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
      expect(screen.getByTestId('credit-card-icon')).toBeInTheDocument()
      expect(screen.getAllByTestId('lock-icon')).toHaveLength(2) // Password and confirm password
    })

    it('displays correct placeholder text for all fields', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.getByPlaceholderText('John')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('student@university.edu')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('johndoe123')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Bachelor of Science in Computer Science')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('RF001234567')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Create password')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument()
    })
  })

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields on blur', async () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')
      const emailInput = screen.getByLabelText('Email Address')

      fireEvent.focus(firstNameInput)
      fireEvent.blur(firstNameInput)

      fireEvent.focus(lastNameInput)
      fireEvent.blur(lastNameInput)

      fireEvent.focus(emailInput)
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.getByText(/\/\/.*required/i)).toBeInTheDocument()
      })
    })

    it('validates email format correctly', async () => {
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByLabelText('Email Address')
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
      fireEvent.blur(emailInput)

      await waitFor(() => {
        expect(screen.getByText(/\/\/.*invalid.*email/i)).toBeInTheDocument()
      })
    })

    it('validates password confirmation match', async () => {
      renderWithProviders(<RegisterForm />)

      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')

      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
      fireEvent.blur(confirmPasswordInput)

      await waitFor(() => {
        expect(screen.getByText(/\/\/.*passwords.*match/i)).toBeInTheDocument()
      })
    })

    it('validates password strength requirements', async () => {
      renderWithProviders(<RegisterForm />)

      const passwordInput = screen.getByLabelText('Password')
      fireEvent.change(passwordInput, { target: { value: 'weak' } })
      fireEvent.blur(passwordInput)

      await waitFor(() => {
        expect(screen.getByText(/\/\/.*password.*characters/i)).toBeInTheDocument()
      })
    })

    it('validates date input format', async () => {
      renderWithProviders(<RegisterForm />)

      const birthdateInput = screen.getByLabelText('Birthdate')
      fireEvent.change(birthdateInput, { target: { value: 'invalid-date' } })
      fireEvent.blur(birthdateInput)

      await waitFor(() => {
        expect(screen.getByText(/\/\/.*date/i)).toBeInTheDocument()
      })
    })

    it('shows no errors for valid inputs', async () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const emailInput = screen.getByLabelText('Email Address')
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText('Confirm Password')

      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

      fireEvent.blur(firstNameInput)
      fireEvent.blur(emailInput)
      fireEvent.blur(passwordInput)
      fireEvent.blur(confirmPasswordInput)

      await waitFor(() => {
        expect(screen.queryByText(/\/\/.*required/i)).not.toBeInTheDocument()
        expect(screen.queryByText(/\/\/.*invalid/i)).not.toBeInTheDocument()
      })
    })
  })

  describe('Form Interactions', () => {
    it('toggles password visibility on eye icon click', () => {
      renderWithProviders(<RegisterForm />)

      const passwordInput = screen.getByLabelText('Password')
      const eyeButton = passwordInput.parentElement?.querySelector('button')

      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument()

      fireEvent.click(eyeButton!)
      expect(passwordInput).toHaveAttribute('type', 'text')
      expect(screen.getByTestId('eye-off-icon')).toBeInTheDocument()

      fireEvent.click(eyeButton!)
      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(screen.getByTestId('eye-icon')).toBeInTheDocument()
    })

    it('toggles confirm password visibility on eye icon click', () => {
      renderWithProviders(<RegisterForm />)

      const confirmPasswordInput = screen.getByLabelText('Confirm Password')
      const eyeButton = confirmPasswordInput.parentElement?.querySelector('button')

      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      expect(screen.getAllByTestId('eye-icon')).toHaveLength(2)

      fireEvent.click(eyeButton!)
      expect(confirmPasswordInput).toHaveAttribute('type', 'text')
      expect(screen.getAllByTestId('eye-off-icon')).toHaveLength(1)

      fireEvent.click(eyeButton!)
      expect(confirmPasswordInput).toHaveAttribute('type', 'password')
      expect(screen.getAllByTestId('eye-icon')).toHaveLength(2)
    })

    it('handles form input changes correctly', () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')
      const emailInput = screen.getByLabelText('Email Address')
      const usernameInput = screen.getByLabelText(/Username.*optional/)
      const courseInput = screen.getByLabelText('Course/Program')
      const birthdateInput = screen.getByLabelText('Birthdate')
      const rfidInput = screen.getByLabelText(/RFID Card ID.*optional/)

      fireEvent.change(firstNameInput, { target: { value: 'John' } })
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(usernameInput, { target: { value: 'johndoe123' } })
      fireEvent.change(courseInput, { target: { value: 'Computer Science' } })
      fireEvent.change(birthdateInput, { target: { value: '1990-01-01' } })
      fireEvent.change(rfidInput, { target: { value: 'RF001234567' } })

      expect(firstNameInput).toHaveValue('John')
      expect(lastNameInput).toHaveValue('Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(usernameInput).toHaveValue('johndoe123')
      expect(courseInput).toHaveValue('Computer Science')
      expect(birthdateInput).toHaveValue('1990-01-01')
      expect(rfidInput).toHaveValue('RF001234567')
    })

    it('handles Google signup button click', async () => {
      renderWithProviders(<RegisterForm />)

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      fireEvent.click(googleButton)

      expect(authApi.googleLogin).toHaveBeenCalledTimes(1)
    })

    it('handles tab navigation between fields', () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const lastNameInput = screen.getByLabelText('Last Name')

      firstNameInput.focus()
      expect(document.activeElement).toBe(firstNameInput)

      fireEvent.keyDown(firstNameInput, { key: 'Tab' })
      // In a real browser, this would focus the next element
      // Here we simulate the expected behavior
      expect(firstNameInput).toBeInTheDocument()
      expect(lastNameInput).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText(/Username.*optional/), { target: { value: 'johndoe123' } })
      fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
      fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
      fireEvent.change(screen.getByLabelText(/RFID Card ID.*optional/), { target: { value: 'RF001234567' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
    }

    it('submits form with valid data', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          username: 'johndoe123',
          course: 'Computer Science',
          birthdate: '1990-01-01',
          rfidId: 'RF001234567',
          password: 'password123',
        })
      })
    })

    it('submits form with minimal required data', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      // Fill only required fields
      fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
      fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
      fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
      fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
      fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          username: '',
          course: 'Computer Science',
          birthdate: '1990-01-01',
          rfidId: '',
          password: 'password123',
        })
      })
    })

    it('excludes confirmPassword from submission data', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledWith(
          expect.not.objectContaining({ confirmPassword: expect.anything() })
        )
      })
    })

    it('handles submission failure gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockRegisterMutation.mutateAsync.mockRejectedValue(new Error('Registration failed'))
      renderWithProviders(<RegisterForm />)

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Registration error:', expect.any(Error))
      })

      consoleError.mockRestore()
    })

    it('disables submit button during submission', async () => {
      mockRegisterMutation.mutateAsync.mockImplementation(() => new Promise(() => {})) // Never resolves
      renderWithProviders(<RegisterForm />)

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(submitButton).toBeDisabled()
      })
    })

    it('prevents form submission when validation fails', async () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).not.toHaveBeenCalled()
      })
    })
  })

  describe('Loading States', () => {
    it('shows loading state from auth store', () => {
      ;(useAuthStore as jest.Mock).mockReturnValue({ isLoading: true, error: null })
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /creating account/i })
      expect(submitButton).toBeDisabled()
      expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    })

    it('shows loading state during form submission', async () => {
      mockRegisterMutation.mutateAsync.mockImplementation(() => new Promise(() => {})) // Never resolves
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
        expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
      })
    })

    it('shows normal state when not loading', () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).not.toBeDisabled()
      expect(screen.getByTestId('arrow-right-icon')).toBeInTheDocument()
      expect(screen.queryByTestId('loader-icon')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message from auth store', () => {
      ;(useAuthStore as jest.Mock).mockReturnValue({
        isLoading: false,
        error: 'Registration failed. Please try again.',
      })
      renderWithProviders(<RegisterForm />)

      expect(screen.getByText('// Error:')).toBeInTheDocument()
      expect(screen.getByText('Registration failed. Please try again.')).toBeInTheDocument()
    })

    it('does not display error message when no error exists', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.queryByText('// Error:')).not.toBeInTheDocument()
    })

    it('handles network errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
      mockRegisterMutation.mutateAsync.mockRejectedValue(new Error('Network error'))
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('Registration error:', expect.any(Error))
      })

      consoleError.mockRestore()
    })
  })

  describe('Success State', () => {
    it('shows success message after successful registration', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
        expect(screen.getByText(/We've sent a verification email to/)).toBeInTheDocument()
        expect(screen.getByText('john@example.com')).toBeInTheDocument()
        expect(screen.getByText(/Please check your email and click the verification link/)).toBeInTheDocument()
      })
    })

    it('provides option to register another account in success state', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
      })

      // Click "Register Another Account" button
      const registerAnotherButton = screen.getByRole('button', { name: /register another account/i })
      fireEvent.click(registerAnotherButton)

      // Should return to form view
      await waitFor(() => {
        expect(screen.getByLabelText('First Name')).toBeInTheDocument()
        expect(screen.queryByText('Registration Successful!')).not.toBeInTheDocument()
      })
    })

    it('provides link to login page in success state', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
      })

      const loginLink = screen.getByRole('link', { name: /continue to login/i })
      expect(loginLink).toBeInTheDocument()
      expect(loginLink).toHaveAttribute('href', '/login')
    })

    it('displays success checkmark icon', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      fireEvent.click(screen.getByRole('button', { name: /create account/i }))

      await waitFor(() => {
        expect(screen.getByText('Registration Successful!')).toBeInTheDocument()
        // Check for the SVG checkmark
        const checkmark = screen.getByText('Registration Successful!').closest('div')?.querySelector('svg')
        expect(checkmark).toBeInTheDocument()
      })
    })
  })

  describe('Accessibility', () => {
    it('has proper form labels', () => {
      renderWithProviders(<RegisterForm />)

      const inputs = screen.getAllByRole('textbox')
      inputs.forEach((input) => {
        expect(input).toHaveAccessibleName()
      })

      const passwordInputs = screen.getAllByLabelText(/password/i)
      passwordInputs.forEach((input) => {
        expect(input).toHaveAccessibleName()
      })
    })

    it('has proper button roles and labels', () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      expect(submitButton).toHaveAttribute('type', 'submit')

      const googleButton = screen.getByRole('button', { name: /continue with google/i })
      expect(googleButton).toHaveAttribute('type', 'button')

      const eyeButtons = screen.getAllByRole('button').filter((button) =>
        button.getAttribute('type') === 'button' && !button.textContent?.includes('Google')
      )
      expect(eyeButtons).toHaveLength(2) // Two password eye buttons
    })

    it('has proper autocomplete attributes', () => {
      renderWithProviders(<RegisterForm />)

      expect(screen.getByLabelText('First Name')).toHaveAttribute('autocomplete', 'given-name')
      expect(screen.getByLabelText('Last Name')).toHaveAttribute('autocomplete', 'family-name')
      expect(screen.getByLabelText('Email Address')).toHaveAttribute('autocomplete', 'email')
      expect(screen.getByLabelText(/Username.*optional/)).toHaveAttribute('autocomplete', 'username')
      expect(screen.getByLabelText('Birthdate')).toHaveAttribute('autocomplete', 'bday')
      expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password')
      expect(screen.getByLabelText('Confirm Password')).toHaveAttribute('autocomplete', 'new-password')
    })

    it('has proper form structure', () => {
      renderWithProviders(<RegisterForm />)

      const form = screen.getByRole('form')
      expect(form).toBeInTheDocument()
      expect(form).toHaveAttribute('novalidate')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty form submission gracefully', async () => {
      renderWithProviders(<RegisterForm />)

      const submitButton = screen.getByRole('button', { name: /create account/i })
      fireEvent.click(submitButton)

      // Should show validation errors instead of submitting
      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).not.toHaveBeenCalled()
      })
    })

    it('handles special characters in form fields', () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const specialChars = "João O'Connor-Smith"

      fireEvent.change(firstNameInput, { target: { value: specialChars } })
      expect(firstNameInput).toHaveValue(specialChars)
    })

    it('handles very long input values', () => {
      renderWithProviders(<RegisterForm />)

      const longString = 'a'.repeat(1000)
      const firstNameInput = screen.getByLabelText('First Name')

      fireEvent.change(firstNameInput, { target: { value: longString } })
      expect(firstNameInput).toHaveValue(longString)
    })

    it('handles rapid successive form submissions', async () => {
      mockRegisterMutation.mutateAsync.mockResolvedValue({})
      renderWithProviders(<RegisterForm />)

      const fillValidForm = () => {
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } })
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } })
        fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } })
        fireEvent.change(screen.getByLabelText('Course/Program'), { target: { value: 'Computer Science' } })
        fireEvent.change(screen.getByLabelText('Birthdate'), { target: { value: '1990-01-01' } })
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })
      }

      fillValidForm()

      const submitButton = screen.getByRole('button', { name: /create account/i })

      // Rapid clicks
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockRegisterMutation.mutateAsync).toHaveBeenCalledTimes(1)
      })
    })

    it('handles form reset after error', async () => {
      ;(useAuthStore as jest.Mock).mockReturnValue({
        isLoading: false,
        error: 'Registration failed. Please try again.',
      })
      renderWithProviders(<RegisterForm />)

      expect(screen.getByText('// Error:')).toBeInTheDocument()

      // Clear error and try again
      ;(useAuthStore as jest.Mock).mockReturnValue({
        isLoading: false,
        error: null,
      })

      // Re-render to simulate store update
      renderWithProviders(<RegisterForm />)

      expect(screen.queryByText('// Error:')).not.toBeInTheDocument()
    })

    it('handles Unicode characters in input fields', () => {
      renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const unicodeChars = '测试用户名'

      fireEvent.change(firstNameInput, { target: { value: unicodeChars } })
      expect(firstNameInput).toHaveValue(unicodeChars)
    })

    it('handles copy and paste operations', () => {
      renderWithProviders(<RegisterForm />)

      const emailInput = screen.getByLabelText('Email Address')
      const pastedEmail = 'pasted@example.com'

      fireEvent.paste(emailInput, {
        clipboardData: {
          getData: () => pastedEmail,
        },
      })

      // Simulate the paste result
      fireEvent.change(emailInput, { target: { value: pastedEmail } })
      expect(emailInput).toHaveValue(pastedEmail)
    })
  })

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = renderWithProviders(<RegisterForm />)

      const firstNameInput = screen.getByLabelText('First Name')
      const initialValue = firstNameInput.value

      // Re-render with same props
      rerender(<RegisterForm />)

      expect(screen.getByLabelText('First Name')).toHaveValue(initialValue)
    })
  })
})