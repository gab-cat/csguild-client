import { create } from 'zustand'

import type { Doc } from '@/lib/convex'

// Simple auth store that syncs with Convex Auth
// This is mainly used for components that need to update when auth state changes
interface AuthState {
  // Authentication status
  isAuthenticated: boolean
  isLoading: boolean

  // User data (when available)
  user: Doc<'users'> | null

  // Actions
  setAuthenticated: (authenticated: boolean) => void
  setLoading: (loading: boolean) => void
  setUser: (user: Doc<'users'> | null) => void
  clearAuth: () => void

  // Computed helpers
  hasSession: () => boolean
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  // Initial state
  isAuthenticated: false,
  isLoading: true,
  user: null,

  // Actions
  setAuthenticated: (authenticated: boolean) =>
    set({ isAuthenticated: authenticated }),

  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  setUser: (user: Doc<'users'> | null) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false
    }),

  clearAuth: () => {
    set({
      isAuthenticated: false,
      isLoading: false,
      user: null
    })
    
    // Clear all browser storage that might contain auth data
    if (typeof window !== 'undefined') {
      try {
        // Clear localStorage items that might store auth data
        localStorage.removeItem('cs-guild-auth') // Persistent auth store
        localStorage.removeItem('auth_redirect_after_login') // Redirect storage
        localStorage.removeItem('blog-draft') // Blog drafts might contain user-specific data
        
        // Clear sessionStorage items
        sessionStorage.removeItem('auth_redirect_after_login')
        
        // Clear any other auth-related localStorage keys
        Object.keys(localStorage).forEach(key => {
          if (key.includes('auth') || key.includes('user') || key.includes('token')) {
            localStorage.removeItem(key)
          }
        })
        
        // Clear any auth-related sessionStorage keys
        Object.keys(sessionStorage).forEach(key => {
          if (key.includes('auth') || key.includes('user') || key.includes('token')) {
            sessionStorage.removeItem(key)
          }
        })
        
        console.log('🧹 Cleared all browser storage during logout')
      } catch (error) {
        console.warn('Failed to clear browser storage during logout:', error)
      }
    }
  },

  // Computed helpers
  hasSession: () => {
    const state = get()
    return state.isAuthenticated || !!state.user
  }
}))
