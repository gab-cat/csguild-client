import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { User, AuthState } from '../types'

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
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAuthenticated: (authenticated: boolean) => void
  clearAuth: () => void
  updateUser: (userData: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          error: null 
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
        })
        
        // Clear cookies for middleware
        deleteCookie('user')
        deleteCookie('isAuthenticated')
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
    }),
    {
      name: 'cs-guild-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
) 