'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { useAuthStore } from '@/features/auth/stores/auth-store'
import { 
  showSuccessToast, 
  showErrorToast, 
  showInfoToast 
} from '@/lib/toast'
import type {
  UserResponseDto,
  UpdateUserRequest,
  CreateUserRequest,
  RegisterRfidDto,
  VerifyEmailDto,
  SendEmailVerificationDto,
  RfidLoginDto,
} from '@generated/api-client'

import { usersApi } from '../utils/users-api'

// Query keys
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => 
    [...userQueryKeys.lists(), { filters }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
}

// Hook to get current user from auth store
export function useCurrentUser() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  return {
    user: user as UserResponseDto | null,
    isAuthenticated,
    isLoading,
  }
}

// Get user by ID
export function useUser(id: string) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get all users (admin/staff only)
export function useUsers() {
  return useQuery({
    queryKey: userQueryKeys.lists(),
    queryFn: () => usersApi.getUsers(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Update current user profile
export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { user, updateUser } = useAuthStore()

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.updateCurrentUser(data),
    onMutate: async (newData) => {
      // Optimistic update
      if (user) {
        const optimisticUser = { ...user, ...newData }
        updateUser(optimisticUser)
        
        // Show optimistic toast
        showInfoToast('Updating profile...', 'Please wait while we save your changes')
      }
      
      return { previousUser: user }
    },
    onSuccess: (updatedUser) => {
      // Update auth store with server response
      updateUser(updatedUser)
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
      if (updatedUser.id) {
        queryClient.invalidateQueries({ 
          queryKey: userQueryKeys.detail(updatedUser.id) 
        })
      }
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      
      showSuccessToast('Profile updated successfully!')
    },
    onError: (error, _newData, context) => {
      // Rollback optimistic update
      if (context?.previousUser) {
        updateUser(context.previousUser)
      }
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update profile. Please try again.'
      
      showErrorToast('Profile update failed', errorMessage)
    },
  })
}

// Create new user (admin only)
export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.createUser(data),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      showSuccessToast('User created successfully!')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create user. Please try again.'
      
      showErrorToast('User creation failed', errorMessage)
    },
  })
}

// Verify email
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (data: VerifyEmailDto) => usersApi.verifyEmail(data),
    onSuccess: () => {
      showSuccessToast('Email verified successfully!')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to verify email. Please try again.'
      
      showErrorToast('Email verification failed', errorMessage)
    },
  })
}

// Resend email verification
export function useResendEmailVerification() {
  return useMutation({
    mutationFn: (data: SendEmailVerificationDto) => usersApi.resendEmailVerification(data),
    onSuccess: () => {
      showSuccessToast('Verification email sent successfully!')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to send verification email. Please try again.'
      
      showErrorToast('Email sending failed', errorMessage)
    },
  })
}

// Register RFID card
export function useRegisterRfidCard() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterRfidDto) => usersApi.registerRfidCard(data),
    onSuccess: () => {
      // Invalidate related queries to refetch updated user data
      queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() })
      if (user?.id) {
        queryClient.invalidateQueries({ 
          queryKey: userQueryKeys.detail(user.id) 
        })
      }
      
      showSuccessToast('RFID card registered successfully!')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to register RFID card. Please try again.'
      
      showErrorToast('RFID registration failed', errorMessage)
    },
  })
}

// RFID login
export function useRfidLogin() {
  return useMutation({
    mutationFn: (data: RfidLoginDto) => usersApi.rfidLogin(data),
    onSuccess: () => {
      showSuccessToast('RFID login successful!')
    },
    onError: (error) => {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'RFID login failed. Please try again.'
      
      showErrorToast('RFID login failed', errorMessage)
    },
  })
}
