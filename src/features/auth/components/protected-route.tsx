'use client'

import { useRouter, usePathname } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { useCurrentUser } from '../hooks/use-current-user'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  redirectTo?: string
  requiredRoles?: UserRole[]
}

export function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requiredRoles = []
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return

    // Redirect if not authenticated
    if (!isAuthenticated || !user) {
      router.push(redirectTo)
      return
    }

    // Check if Google OAuth user has incomplete profile
    // Don't redirect if already on register page to prevent infinite loop
    if (user.signupMethod === 'GOOGLE' && !pathname.includes('/register')) {
      // RFID is optional, so only check for required fields: birthdate and course
      const needsProfileCompletion = !user.rfidId || !user.birthdate || !user.course
      
      if (needsProfileCompletion && !isLoading) {
        router.push('/register?google=true')
        return
      }
    }

    // Check role requirements if specified
    if (requiredRoles.length > 0) {
      const hasRequiredRole = requiredRoles.some(role => 
        user.roles.includes(role)
      )
      
      if (!hasRequiredRole) {
        // Redirect to access denied or home page
        router.push('/')
        return
      }
    }
  }, [isAuthenticated, user, isLoading, router, redirectTo, requiredRoles, pathname])

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-300 font-space-mono text-sm">
            {"// Verifying access permissions..."}
          </p>
        </div>
      </div>
    )
  }

  // Don't render children if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  // Don't render children if Google OAuth user has incomplete profile
  if (user.signupMethod === 'GOOGLE') {
    // RFID is optional, so only check for required fields: birthdate and course
    const needsProfileCompletion = !user.birthdate || !user.course
    
    if (needsProfileCompletion) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-300 font-space-mono text-sm">
              {"// Redirecting to complete your profile..."}
            </p>
          </div>
        </div>
      )
    }
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => 
      user.roles.includes(role)
    )
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-red-400 text-2xl">🚫</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-300 mb-4">
                You don&apos;t have the required permissions to access this page.
              </p>
              <div className="text-sm text-red-400 font-space-mono bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                {"// Required roles: " + requiredRoles.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}

export default ProtectedRoute 