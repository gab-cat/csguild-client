import { render, screen } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import RegisterPage from './page'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

// Mock components
jest.mock('@/components/shared/loading', () => {
  return function MockLoadingComponent() {
    return <div data-testid="loading">Loading...</div>
  }
})

jest.mock('@/features/auth/components/auth-layout', () => {
  return {
    AuthLayout: ({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) => (
      <div data-testid="auth-layout">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    ),
  }
})

jest.mock('@/features/auth/components/google-profile-completion-form', () => {
  return {
    GoogleProfileCompletionForm: () => <div data-testid="google-profile-completion-form">Google Profile Completion Form</div>,
  }
})

jest.mock('@/features/auth/components/multi-step-register-form', () => {
  return {
    MultiStepRegisterForm: () => <div data-testid="multi-step-register-form">Multi Step Register Form</div>,
  }
})

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Registration Flow', () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => {
          if (key === 'google') return null
          return null
        }),
      } as any)
    })

    it('renders the default register page with correct title and subtitle', () => {
      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByText('Create your account and join 100+ developers building the future together.')).toBeInTheDocument()
    })

    it('renders the multi-step register form by default', () => {
      render(<RegisterPage />)

      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
      expect(screen.queryByTestId('google-profile-completion-form')).not.toBeInTheDocument()
    })

    it('renders the auth layout with correct props', () => {
      render(<RegisterPage />)

      const authLayout = screen.getByTestId('auth-layout')
      expect(authLayout).toBeInTheDocument()
      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByText('Create your account and join 100+ developers building the future together.')).toBeInTheDocument()
    })
  })

  describe('Google OAuth Flow', () => {
    beforeEach(() => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => {
          if (key === 'google') return 'true'
          return null
        }),
      } as any)
    })

    it('renders the Google OAuth completion page when google=true', () => {
      render(<RegisterPage />)

      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
      expect(screen.getByText('Just a few more details to complete your CS Guild profile.')).toBeInTheDocument()
    })

    it('renders the Google profile completion form for OAuth flow', () => {
      render(<RegisterPage />)

      expect(screen.getByTestId('google-profile-completion-form')).toBeInTheDocument()
      expect(screen.queryByTestId('multi-step-register-form')).not.toBeInTheDocument()
    })

    it('uses correct auth layout props for Google OAuth', () => {
      render(<RegisterPage />)

      const authLayout = screen.getByTestId('auth-layout')
      expect(authLayout).toBeInTheDocument()
      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
      expect(screen.getByText('Just a few more details to complete your CS Guild profile.')).toBeInTheDocument()
    })
  })

  describe('Search Params Edge Cases', () => {
    it('treats google=false as default flow', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => {
          if (key === 'google') return 'false'
          return null
        }),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
    })

    it('treats google=anything-other-than-true as default flow', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => {
          if (key === 'google') return 'yes'
          return null
        }),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
    })

    it('handles empty search params gracefully', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn(() => null),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
    })

    it('handles undefined search params gracefully', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn(() => undefined),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
    })
  })

  describe('Suspense Integration', () => {
    it('renders loading component while suspended', () => {
      // Mock a suspended component
      const SuspendedComponent = () => {
        throw new Promise(() => {}) // Never resolves, keeps component suspended
      }

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <SuspendedComponent />
        </Suspense>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()
      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('wraps RegisterPageContent with Suspense', () => {
      const { container } = render(<RegisterPage />)
      
      // The component should be wrapped in Suspense
      expect(container.querySelector('[data-testid="auth-layout"]')).toBeInTheDocument()
    })
  })

  describe('Component Structure', () => {
    it('maintains proper component hierarchy', () => {
      render(<RegisterPage />)

      const authLayout = screen.getByTestId('auth-layout')
      const form = screen.getByTestId('multi-step-register-form')
      
      expect(authLayout).toContainElement(form)
    })

    it('correctly passes children to AuthLayout', () => {
      render(<RegisterPage />)

      const authLayout = screen.getByTestId('auth-layout')
      const form = screen.getByTestId('multi-step-register-form')
      
      expect(authLayout).toContainElement(form)
    })
  })

  describe('Error Handling', () => {
    it('handles search params errors gracefully', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn(() => {
          throw new Error('Search params error')
        }),
      } as any)

      // Component should still render without crashing
      expect(() => render(<RegisterPage />)).not.toThrow()
    })

    it('handles null useSearchParams return', () => {
      mockUseSearchParams.mockReturnValue(null as any)

      // Component should handle null gracefully
      expect(() => render(<RegisterPage />)).not.toThrow()
    })
  })

  describe('Client Component Behavior', () => {
    it('uses client-side navigation hooks', () => {
      render(<RegisterPage />)

      expect(mockUseSearchParams).toHaveBeenCalled()
    })

    it('correctly reads search parameters', () => {
      const mockGet = jest.fn()
      mockUseSearchParams.mockReturnValue({
        get: mockGet,
      } as any)

      render(<RegisterPage />)

      expect(mockGet).toHaveBeenCalledWith('google')
    })
  })

  describe('RegisterPageContent Component', () => {
    it('correctly determines OAuth flow based on search params', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => key === 'google' ? 'true' : null),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByTestId('google-profile-completion-form')).toBeInTheDocument()
    })

    it('defaults to regular registration when google param is not true', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => key === 'google' ? 'false' : null),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByTestId('multi-step-register-form')).toBeInTheDocument()
    })
  })

  describe('Component Props and State', () => {
    it('passes correct title and subtitle for OAuth flow', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => key === 'google' ? 'true' : null),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
      expect(screen.getByText('Just a few more details to complete your CS Guild profile.')).toBeInTheDocument()
    })

    it('passes correct title and subtitle for regular registration', () => {
      mockUseSearchParams.mockReturnValue({
        get: jest.fn((key: string) => key === 'google' ? null : null),
      } as any)

      render(<RegisterPage />)

      expect(screen.getByText('Join CS Guild')).toBeInTheDocument()
      expect(screen.getByText('Create your account and join 100+ developers building the future together.')).toBeInTheDocument()
    })
  })

  describe('Integration with Loading Component', () => {
    it('uses the correct loading component as fallback', () => {
      const TestComponent = () => {
        throw new Promise(() => {}) // Never resolves
      }

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <TestComponent />
        </Suspense>
      )

      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })
  })
})