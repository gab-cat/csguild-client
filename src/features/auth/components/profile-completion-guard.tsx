'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { Doc } from '@/lib/convex'

import { useCurrentUser } from '../hooks/use-current-user'

interface ProfileCompletionGuardProps {
  children: React.ReactNode
}

export function ProfileCompletionGuard({ children }: ProfileCompletionGuardProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Wait for auth to load
    if (isLoading) return

    // Only check for authenticated users with valid user data
    if (!isAuthenticated || !user || typeof user !== 'object' || !('_id' in user)) return

    // Prevent infinite loops by checking if we're already navigating
    const isNavigating = sessionStorage.getItem('profile_completion_navigating')
    if (isNavigating) {
      // Clear the flag after a short delay to prevent permanent blocking
      setTimeout(() => sessionStorage.removeItem('profile_completion_navigating'), 1000)
      return
    }

    // Type guard to ensure we have a proper user object
    const userData = user as Doc<'users'>

    // Check if user is a Google OAuth user and needs profile completion
    if (userData.signupMethod === 'GOOGLE') {
      const needsProfileCompletion = !userData.username || !userData.course || !userData.birthdate || !userData.rfidId

      console.log('🔍 ProfileCompletionGuard Check:', {
        pathname,
        username: userData.username,
        course: userData.course,
        birthdate: userData.birthdate,
        rfidId: userData.rfidId,
        needsProfileCompletion,
        checks: {
          noUsername: !userData.username,
          noCourse: !userData.course,
          noBirthdate: !userData.birthdate,
          noRfidId: !userData.rfidId
        }
      })

      // If user needs profile completion and is not on the register page
      if (needsProfileCompletion && !pathname.startsWith('/register')) {
        console.log('🚀 ProfileCompletionGuard: Redirecting to profile completion')
        sessionStorage.setItem('profile_completion_navigating', 'true')
        router.push('/register?google=true')
        return
      }

      // If user has complete profile but is on register page with google=true, redirect to dashboard
      if (!needsProfileCompletion && pathname === '/register' && searchParams.get('google') === 'true') {
        console.log('✅ ProfileCompletionGuard: Profile complete, redirecting to dashboard')
        sessionStorage.setItem('profile_completion_navigating', 'true')
        router.push('/dashboard')
        return
      }
    }

    // Handle post-authentication redirect for all authentication methods
    // Check if user is on auth pages and should be redirected to dashboard
    const isOnAuthPage = pathname === '/login' || pathname === '/register' ||
                        pathname.startsWith('/verify-email') ||
                        pathname.startsWith('/forgot-password') ||
                        pathname.startsWith('/reset-password') ||
                        pathname.startsWith('/callback')

    if (isOnAuthPage && userData.signupMethod !== 'GOOGLE') {
      console.log('🔄 AuthRedirect: User authenticated on auth page, redirecting to dashboard')

      // Check for stored redirect URL from sessionStorage (set during OAuth flow)
      const storedRedirect = sessionStorage.getItem('auth_redirect_after_login')
      if (storedRedirect) {
        sessionStorage.removeItem('auth_redirect_after_login')
        console.log('🔄 AuthRedirect: Using stored redirect URL:', storedRedirect)
        router.push(storedRedirect)
        return
      }

      // Check for next parameter in URL
      const nextParam = searchParams.get('next')
      if (nextParam) {
        console.log('🔄 AuthRedirect: Using next parameter:', nextParam)
        router.push(nextParam)
        return
      }

      // Default redirect to dashboard
      router.push('/dashboard')
      return
    }
  }, [isLoading, isAuthenticated, user, pathname, searchParams, router])

  return <>{children}</>
}
