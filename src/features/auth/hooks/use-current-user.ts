'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { useEffect } from 'react'

import { api, Doc } from '@/lib/convex'
import { useAuthStore } from '@/stores/auth-store'

export function useCurrentUser() {
  const { setUser, setLoading } = useAuthStore()

  // Always call useQuery - Convex Auth will handle authentication state internally
  const userQuery = useQuery(api.users.getCurrentUser)

  // Update the store when the query result changes
  useEffect(() => {
    if (userQuery === undefined) {
      // Query is loading
      setLoading(true)
    } else if (userQuery === null) {
      // Query returned null (not authenticated)
      setUser(null)
      setLoading(false)
    } else {
      // Query returned a user
      setUser(userQuery as Doc<'users'> | null)
      setLoading(false)
    }
  }, [userQuery, setUser, setLoading])

  // Return the user from the query, which is managed by Convex Auth
  const currentUser = userQuery

  return {
    user: currentUser as Doc<'users'>,
    isAuthenticated: !!currentUser,
    isLoading: userQuery === undefined,
  }
}
