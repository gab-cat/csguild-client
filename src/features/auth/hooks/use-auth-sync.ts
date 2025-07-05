'use client'

import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'

import { useAuthStore } from '../stores/auth-store'
import { authApi } from '../utils/auth-api'

export function useAuthSync() {
  const { user, isAuthenticated, setUser, setLoading, clearAuth } = useAuthStore()

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
  }
} 