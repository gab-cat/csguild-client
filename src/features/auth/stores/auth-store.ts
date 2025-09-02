import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { UserResponseDto } from '@generated/api-client'

import type { AuthState } from '../types'

// Helper functions to manage cookies for middleware
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window !== 'undefined') {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; secure; samesite=lax`
  }
}

const deleteCookie = (name: string) => {
  if (typeof window !== 'undefined') {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  }
}

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: UserResponseDto | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAuthenticated: (authenticated: boolean) => void
  clearAuth: () => void
  updateUser: (userData: Partial<UserResponseDto>) => void
  // Internal flag to track if validation has been performed
  _isValidated: boolean
  _setValidated: (validated: boolean) => void
}

// Flag to track if we're currently validating to prevent loops
let isValidating = false

// Function to validate user with API - will be set after store creation
let validateUserWithApi: (() => Promise<void>) | null = null

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _isValidated: false,

      // Actions
      setUser: (user) => {
        set({ 
          user: user, 
          isAuthenticated: !!user,
          error: null,
          _isValidated: true // Mark as validated when explicitly setting user
        })
        
        // Update cookies for middleware
        if (user) {
          setCookie('user', JSON.stringify(user))
          setCookie('isAuthenticated', 'true')
        } else {
          deleteCookie('user')
          deleteCookie('isAuthenticated')
        }
      },

      setLoading: (isLoading) => {
        set({ isLoading })
      },

      setError: (error) => {
        set({ error, isLoading: false })
      },

      setAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated })
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          _isValidated: false,
        })
        
        // Clear cookies for middleware
        deleteCookie('user')
        deleteCookie('isAuthenticated')
        
        // Explicitly clear the persisted storage
        if (typeof window !== 'undefined') {
          try {
            localStorage.removeItem('cs-guild-auth')
            console.log('🧹 Cleared persistent auth storage')
          } catch (error) {
            console.warn('Failed to clear persistent auth storage:', error)
          }
        }
      },

      updateUser: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser = { ...currentUser, ...userData }
          set({
            user: updatedUser
          })
          
          // Update cookies for middleware
          setCookie('user', JSON.stringify(updatedUser))
        }
      },

      _setValidated: (validated) => {
        set({ _isValidated: validated })
      },
    }),
    {
      name: 'cs-guild-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // This runs after state is loaded from storage
        if (state?.user && state?.isAuthenticated && !isValidating) {
          console.log('🔄 Auth store rehydrated with user, scheduling validation...')
          // We have a user from storage but haven't validated yet
          if (validateUserWithApi && typeof window !== 'undefined') {
            // Small delay to ensure the auth API is available
            setTimeout(() => {
              console.log('⚡ Triggering user validation from storage rehydration')
              validateUserWithApi?.()
            }, 100)
          }
        } else if (state?.user && state?.isAuthenticated) {
          console.log('⏸️ Auth store rehydrated but validation already in progress')
        } else {
          console.log('📭 Auth store rehydrated but no user found')
        }
      },
    }
  )
)

// Function to set up the validation function
export const setupUserValidation = (validationFn: () => Promise<void>) => {
  validateUserWithApi = validationFn
}

// Get the store's internal methods for validation
export const getAuthStoreInternals = () => {
  const store = useAuthStore.getState()
  return {
    setValidated: store._setValidated,
    setValidating: (validating: boolean) => {
      isValidating = validating
    },
    isValidating: () => isValidating,
  }
} 