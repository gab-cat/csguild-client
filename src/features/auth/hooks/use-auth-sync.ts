'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'

import { useAuthStore, setupUserValidation, getAuthStoreInternals } from '../stores/auth-store'
import { authApi } from '../utils/auth-api'

export function useAuthSync() {
  const { user, isAuthenticated, setUser, setLoading, clearAuth, _isValidated } = useAuthStore()
  const { setValidating, isValidating } = getAuthStoreInternals()

  // Validation function that checks if stored user is still valid
  const validateStoredUser = useCallback(async () => {
    if (isValidating() || _isValidated) {
      return // Already validating or already validated
    }

    try {
      setValidating(true)
      setLoading(true)
      
      console.log('🔍 Validating stored user with API...')
      
      // Try to get current user - this will automatically handle token refresh
      const userData = await authApi.getCurrentUser()
      
      // If we get here, the user is still valid
      if (userData) {
        console.log('✅ User validation successful, updating stored data')
        setUser(userData) // This also sets _isValidated to true
      } else {
        console.log('❌ User validation failed - no user data returned')
        clearAuth()
      }
    } catch (error) {
      console.log('❌ User validation failed - clearing auth state', error)
      // If we can't get user data, clear the auth state
      clearAuth()
    } finally {
      setLoading(false)
      setValidating(false)
    }
  }, [setUser, setLoading, clearAuth, _isValidated, setValidating, isValidating])

  // Set up the validation function in the store
  useEffect(() => {
    setupUserValidation(validateStoredUser)
  }, [validateStoredUser])

  const syncAuth = useCallback(async () => {
    try {
      setLoading(true)
      
      // Try to get current user - this will automatically handle token refresh
      const userData = await authApi.getCurrentUser()
      setUser(userData)
      return userData
    } catch (error) {
      // If we can't get user data, clear the auth state
      clearAuth()
      throw error
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, clearAuth])

  // Use React Query to handle the auth sync with smart caching
  const authSyncQuery = useQuery({
    queryKey: ['auth-sync'],
    queryFn: syncAuth,
    enabled: !user && isAuthenticated, // Only run if we think we're authenticated but don't have user data
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Manual sync function for forcing a refresh
  const manualSync = useCallback(async () => {
    try {
      setLoading(true)
      const userData = await authApi.getCurrentUser()
      setUser(userData)
      return userData
    } catch (error) {
      clearAuth()
      throw error
    } finally {
      setLoading(false)
    }
  }, [setUser, setLoading, clearAuth])

  // Trigger validation if we have a user but haven't validated yet
  useEffect(() => {
    if (user && isAuthenticated && !_isValidated && !isValidating()) {
      console.log('🔄 User found but not validated, triggering validation...')
      validateStoredUser()
    }
  }, [user, isAuthenticated, _isValidated, validateStoredUser, isValidating])

  // Check auth state on mount if we have persisted auth but no user data
  useEffect(() => {
    const shouldSync = isAuthenticated && !user && !authSyncQuery.isFetching
    
    if (shouldSync) {
      authSyncQuery.refetch()
    }
  }, [isAuthenticated, user, authSyncQuery])

  return {
    isInitializing: authSyncQuery.isLoading || authSyncQuery.isFetching,
    error: authSyncQuery.error,
    manualSync,
    refetch: authSyncQuery.refetch,
    validateStoredUser,
    isValidated: _isValidated,
  }
} 