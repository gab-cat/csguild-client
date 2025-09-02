'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'

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
    
    // Only check for authenticated users
    if (!isAuthenticated || !user) return
    
    // // Skip checks for auth routes and public routes
    // if (
    //   pathname.startsWith('/login') ||
    //   pathname.startsWith('/register') ||
    //   pathname.startsWith('/verify-email') ||
    //   pathname.startsWith('/forgot-password') ||
    //   pathname.startsWith('/reset-password') ||
    //   pathname.startsWith('/callback') ||
    //   pathname === '/' ||
    //   pathname.startsWith('/about') ||
    //   pathname.startsWith('/contact') ||
    //   pathname.startsWith('/privacy') ||
    //   pathname.startsWith('/terms') ||
    //   pathname.startsWith('/code-of-conduct') ||
    //   pathname.startsWith('/projects') ||
    //   pathname.startsWith('/events') ||
    //   pathname.startsWith('/community') ||
    //   pathname.startsWith('/blogs') ||
    //   pathname.startsWith('/facilities')
    // ) {
    //   return
    // }

    // Check if user is a Google OAuth user and needs profile completion
    if (user.signupMethod === 'GOOGLE') {
      const needsProfileCompletion = !user.username || !user.course || !user.birthdate || !user.rfidId
      
      console.log('🔍 ProfileCompletionGuard Check:', {
        pathname,
        username: user.username,
        course: user.course,
        birthdate: user.birthdate,
        rfidId: user.rfidId,
        needsProfileCompletion,
        checks: {
          noUsername: !user.username,
          noCourse: !user.course,
          noBirthdate: !user.birthdate,
          noRfidId: !user.rfidId
        }
      })

      // If user needs profile completion and is not on the register page
      if (needsProfileCompletion && !pathname.startsWith('/register')) {
        console.log('🚀 ProfileCompletionGuard: Redirecting to profile completion')
        router.push('/register?google=true')
        return
      }

      // If user has complete profile but is on register page with google=true, redirect to dashboard
      if (!needsProfileCompletion && pathname === '/register' && searchParams.get('google') === 'true') {
        console.log('✅ ProfileCompletionGuard: Profile complete, redirecting to dashboard')
        router.push('/dashboard')
        return
      }
    }
  }, [isLoading, isAuthenticated, user, pathname, searchParams, router])

  return <>{children}</>
}
