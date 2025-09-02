'use client'

import { useQuery } from 'convex/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { api } from '@/lib/convex'

interface EmailVerificationGuardProps {
  children: React.ReactNode
}

export function EmailVerificationGuard({ children }: EmailVerificationGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const verificationStatus = useQuery(api.users.getUserVerificationStatus)
  
  useEffect(() => {
    // Wait for query to load
    if (verificationStatus === undefined) return
    
    // Skip checks for auth routes and public routes
    if (
      pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/verify-email') ||
      pathname.startsWith('/forgot-password') ||
      pathname.startsWith('/reset-password') ||
      pathname.startsWith('/callback') ||
      pathname === '/' ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/privacy') ||
      pathname.startsWith('/terms') ||
      pathname.startsWith('/code-of-conduct') ||
      pathname.startsWith('/projects') ||
      pathname.startsWith('/events') ||
      pathname.startsWith('/community') ||
      pathname.startsWith('/blogs') ||
      pathname.startsWith('/facilities')
    ) {
      return
    }
    
    // If user needs email verification, redirect to verification page
    if (verificationStatus.needsVerification) {
      console.log('🔍 EmailVerificationGuard: User needs email verification, redirecting')
      router.push(`/verify-email?email=${encodeURIComponent(verificationStatus.email || '')}`)
      return
    }
  }, [verificationStatus, router, pathname])
  
  // Show loading state while checking verification status
  if (verificationStatus === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-300 font-space-mono text-sm">
            {"// Checking verification status..."}
          </p>
        </div>
      </div>
    )
  }
  
  // Don't render children if user needs verification and is on a protected route
  const isProtectedRoute = !pathname.startsWith('/login') &&
    !pathname.startsWith('/register') &&
    !pathname.startsWith('/verify-email') &&
    !pathname.startsWith('/forgot-password') &&
    !pathname.startsWith('/reset-password') &&
    !pathname.startsWith('/callback') &&
    pathname !== '/' &&
    !pathname.startsWith('/about') &&
    !pathname.startsWith('/contact') &&
    !pathname.startsWith('/privacy') &&
    !pathname.startsWith('/terms') &&
    !pathname.startsWith('/code-of-conduct') &&
    !pathname.startsWith('/projects') &&
    !pathname.startsWith('/events') &&
    !pathname.startsWith('/community') &&
    !pathname.startsWith('/blogs') &&
    !pathname.startsWith('/facilities')
  
  if (isProtectedRoute && verificationStatus.needsVerification) {
    return null
  }
  
  return <>{children}</>
}
