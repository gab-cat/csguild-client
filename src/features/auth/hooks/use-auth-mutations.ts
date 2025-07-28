'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { showSuccessToast, showErrorToast, showCodeToast, showInfoToast } from '@/lib/toast'
import { UpdateUserRequest, UserResponseDto } from '@generated/api-client'

import type {
  LoginFormData,
  EmailVerificationFormData,
  RfidLoginFormData,
  ResendVerificationFormData,
  RfidRegistrationFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
} from '../schemas'
import { useAuthStore } from '../stores/auth-store'
import type { RegisterRequestData } from '../types'
import { authApi } from '../utils/auth-api'

// Login mutation
export function useLoginMutation() {
  const { setUser, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: LoginFormData & { redirectTo?: string | null }) => {
      setLoading(true)
      setError(null)
      const { redirectTo, ...credentials } = data
      const response = await authApi.login(credentials)
      return { response, redirectTo }
    },
    onSuccess: async ({ redirectTo }) => {
      try {
        // After successful login, fetch user data
        const user = await authApi.getCurrentUser()
        setUser(user)
        setLoading(false)
        
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: ['user'] })
        
        // Handle redirect after successful login
        if (redirectTo) {
          // Validate that redirectTo is a safe internal URL
          try {
            const url = new URL(redirectTo, window.location.origin)
            // Ensure it's same origin and not an auth route
            if (url.origin === window.location.origin && !url.pathname.startsWith('/login') && !url.pathname.startsWith('/register')) {
              window.location.href = url.toString()
              return
            }
          } catch (error) {
            console.error('Invalid redirect URL:', redirectTo, error)
          }
        }
        
        // Default behavior - reload page
        window.location.reload()
      } catch {
        setError('Failed to fetch user data')
        setLoading(false)
        showErrorToast(
          'Login incomplete',
          'Successfully authenticated but failed to load user data. Please refresh.'
        )
      }
    },
    onError: (error: Error) => {
      if (error.message.includes('locked')) {
        setError(error.message)
      } else {
        setError('Invalid credentials. Double-check your email and password.')
      }
      
      setLoading(false)
      showErrorToast(
        'Login failed',
        'Invalid credentials. Double-check your email and password.'
      )
    },
  })
}

// Register mutation
export function useRegisterMutation() {
  const { setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (userData: RegisterRequestData) => {
      setLoading(true)
      setError(null)
      return authApi.register({
        email: userData.email,
        username: userData.username || '',
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthdate: userData.birthdate,
        course: userData.course,
        rfidId: userData.rfidId,
      })
    },
    onSuccess: () => {
      setLoading(false)
      showSuccessToast(
        'Welcome to CS Guild!',
        'Account created successfully. Check your email to verify and complete setup.'
      )
      // Don't set user here - they need to verify email first
    },
    onError: (error: Error) => {
      setError(error.message || 'Registration failed')
      setLoading(false)
      showErrorToast(
        'Registration failed',
        error.message || 'Unable to create account. Please check your information and try again.'
      )
    },
  })
}

// Email verification mutation
export function useEmailVerificationMutation() {
  const router = useRouter()
  const { setUser, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: EmailVerificationFormData) => {
      setLoading(true)
      setError(null)
      return authApi.verifyEmail(data)
    },
    onSuccess: async () => {
      try {
        // After email verification, try to get user data
        const user = await authApi.getCurrentUser()
        setUser(user)
        setLoading(false)
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: ['user'] })
        
        showSuccessToast(
          'Email verified successfully!',
          'Your CS Guild account is now fully activated. Welcome to the community!'
        )
        
        // Check for stored redirect URL
        const storedRedirect = sessionStorage.getItem('auth_redirect_after_login')
        if (storedRedirect) {
          // Clear the stored redirect
          sessionStorage.removeItem('auth_redirect_after_login')
          
          // Validate that it's a safe internal URL
          try {
            const redirectUrl = new URL(storedRedirect, window.location.origin)
            // Ensure it's same origin and not an auth route
            if (redirectUrl.origin === window.location.origin && 
                !redirectUrl.pathname.startsWith('/login') && 
                !redirectUrl.pathname.startsWith('/register')) {
              router.push(redirectUrl.pathname + redirectUrl.search)
              return
            }
          } catch (error) {
            console.error('Invalid stored redirect URL:', storedRedirect, error)
          }
        }
        
        // Default redirect to dashboard
        router.push('/dashboard')
      } catch {
        setLoading(false)
        showInfoToast(
          'Email verified!',
          'Please log in to access your CS Guild account.'
        )
        // Email verified but not logged in, redirect to login
        router.push('/login')
      }
    },
    onError: (error: Error) => {
      setError(error.message || 'Email verification failed')
      setLoading(false)
      showErrorToast(
        'Verification failed',
        error.message || 'Invalid or expired verification code. Request a new one if needed.'
      )
    },
  })
}

// Resend verification mutation
export function useResendVerificationMutation() {
  const { setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (data: ResendVerificationFormData) => {
      setLoading(true)
      setError(null)
      return authApi.resendVerification(data)
    },
    onSuccess: () => {
      setLoading(false)
      showInfoToast(
        'Verification email sent!',
        'Check your inbox for a new verification code. It may take a few minutes to arrive.'
      )
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to resend verification email')
      setLoading(false)
      showErrorToast(
        'Failed to send email',
        error.message || 'Unable to resend verification email. Please try again later.'
      )
    },
  })
}

// RFID login mutation
export function useRfidLoginMutation() {
  const router = useRouter()
  const { setUser, setLoading, setError, user } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: RfidLoginFormData) => {
      setLoading(true)
      setError(null)
      return authApi.rfidLogin(data)
    },
    onSuccess: (response) => {
      // RFID login returns student data directly
      setUser(response.student as UserResponseDto)
      setLoading(false)
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['user'] })
      
      showCodeToast(
        'RFID login successful!',
        `Quick access granted. Welcome back, ${user?.firstName}!`
      )
      
      // Check for stored redirect URL
      const storedRedirect = sessionStorage.getItem('auth_redirect_after_login')
      if (storedRedirect) {
        // Clear the stored redirect
        sessionStorage.removeItem('auth_redirect_after_login')
        
        // Validate that it's a safe internal URL
        try {
          const redirectUrl = new URL(storedRedirect, window.location.origin)
          // Ensure it's same origin and not an auth route
          if (redirectUrl.origin === window.location.origin && 
              !redirectUrl.pathname.startsWith('/login') && 
              !redirectUrl.pathname.startsWith('/register')) {
            router.push(redirectUrl.pathname + redirectUrl.search)
            return
          }
        } catch (error) {
          console.error('Invalid stored redirect URL:', storedRedirect, error)
        }
      }
      
      // Default redirect to dashboard
      router.push('/')
    },
    onError: (error: Error) => {
      setError(error.message || 'RFID login failed')
      setLoading(false)
      showErrorToast(
        'RFID login failed',
        error.message || 'Unable to authenticate with RFID. Ensure your card is registered.'
      )
    },
  })
}

// RFID registration mutation
export function useRfidRegistrationMutation() {
  const { setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (data: RfidRegistrationFormData) => {
      setLoading(true)
      setError(null)
      return authApi.registerRfid(data)
    },
    onSuccess: () => {
      setLoading(false)
      showSuccessToast(
        'RFID registration complete!',
        'Your student ID card is now linked to your CS Guild account for quick access.'
      )
    },
    onError: (error: Error) => {
      setError(error.message || 'RFID registration failed')
      setLoading(false)
      showErrorToast(
        'RFID registration failed',
        error.message || 'Unable to register your RFID card. Please try again or contact support.'
      )
    },
  })
}

// Update user mutation
export function useUpdateUserProfileMutation() {
  const { setLoading, setError, setUser } = useAuthStore()

  return useMutation({
    mutationFn: async (data: UpdateUserRequest) => {
      setLoading(true)
      setError(null)
      return authApi.updateUser(data)
    },
    onSuccess: (response) => {
      setUser(response)
      setLoading(false)
      showSuccessToast(
        'Profile updated successfully!',
        'Your CS Guild profile has been updated successfully.'
      )
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to update user profile')
      setLoading(false)
      showErrorToast(
        'Failed to update profile',
        error.message || 'Unable to update your profile. Please check your information and try again.'
      )
    },
  })
}

// Logout mutation
export function useLogoutMutation() {
  const router = useRouter()
  const { clearAuth, setLoading, setError } = useAuthStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      setLoading(true)
      setError(null)
      return authApi.logout()
    },
    onSuccess: () => {
      router.push('/')
      clearAuth()
      
      // Clear all cached data
      queryClient.clear()
      
      showInfoToast(
        'Logged out successfully',
        'See you later! Your coding journey continues when you return.'
      )
      
    },
    onError: (error: Error) => {
      // Even if logout fails on server, clear local auth state
      clearAuth()
      queryClient.clear()
      router.push('/')
      
      showErrorToast(
        'Logout completed',
        'You have been logged out locally. Some server cleanup may have failed.'
      )
      
      setError(error.message || 'Logout failed')
      setLoading(false)
    },
  })
}

// Forgot password mutation
export function useForgotPasswordMutation() {
  const { setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      setLoading(true)
      setError(null)
      return authApi.forgotPassword(data)
    },
    onSuccess: () => {
      setLoading(false)
      showSuccessToast(
        'Password reset email sent!',
        'Check your inbox for instructions on how to reset your password. The link will expire in 1 hour.'
      )
    },
    onError: (error: Error) => {
      setError(error.message || 'Failed to send password reset email')
      setLoading(false)
      showErrorToast(
        'Failed to send reset email',
        error.message || 'Unable to send password reset email. Please try again later.'
      )
    },
  })
}

// Reset password mutation
export function useResetPasswordMutation() {
  const router = useRouter()
  const { setLoading, setError } = useAuthStore()

  return useMutation({
    mutationFn: async (data: Omit<ResetPasswordFormData, 'confirmPassword'>) => {
      setLoading(true)
      setError(null)
      return authApi.resetPassword(data)
    },
    onSuccess: () => {
      setLoading(false)
      showSuccessToast(
        'Password reset successful!',
        'Your password has been changed successfully. You can now log in with your new password.'
      )
      // Redirect to login page
      router.push('/login')
    },
    onError: (error: Error) => {
      setError(error.message || 'Password reset failed')
      setLoading(false)
      showErrorToast(
        'Password reset failed',
        error.message || 'Unable to reset your password. The token may be invalid or expired. Please request a new reset link.'
      )
    },
  })
} 