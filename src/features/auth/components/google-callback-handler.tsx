'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

import { useCurrentUser } from '../hooks/use-current-user'

export function GoogleCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  // Get current user from Convex Auth
  const { user: currentUser, isLoading, isAuthenticated } = useCurrentUser()

  useEffect(() => {
    let isMounted = true

    const checkUserStatus = async () => {
      try {
        if (!isMounted) return

        // Check for OAuth errors in URL params first
        const urlError = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (urlError) {
          if (isMounted) {
            setError(errorDescription || urlError)
            setIsProcessing(false)
            showErrorToast(
              'Google authentication failed',
              errorDescription || 'Authentication was cancelled or failed'
            )
          }
          return
        }

        // Wait for authentication to complete
        if (isLoading) {
          return // Still loading, wait for Convex Auth to process the OAuth callback
        }

        // Check if user is authenticated
        if (!isAuthenticated) {
          if (isMounted) {
            setError('Authentication failed')
            setIsProcessing(false)
            showErrorToast(
              'Authentication failed',
              'Google authentication was not successful. Please try again.'
            )
          }
          return
        }

        // Check if we have user data
        if (!currentUser) {
          if (isMounted) {
            setError('No user data found')
            setIsProcessing(false)
            showErrorToast(
              'Authentication failed',
              'Unable to retrieve user information. Please try again.'
            )
          }
          return
        }

        // Check if this is a Google user and if they need profile completion
        if (currentUser.signupMethod === 'GOOGLE') {
          console.log('🔍 Google User Profile Check:', {
            username: currentUser.username,
            course: currentUser.course,
            birthdate: currentUser.birthdate,
            rfidId: currentUser.rfidId,
            signupMethod: currentUser.signupMethod
          })

          const needsProfileCompletion = !currentUser.username || !currentUser.course || !currentUser.birthdate || !currentUser.rfidId
          
          console.log('🔍 Profile Completion Check:', {
            needsProfileCompletion,
            checks: {
              noUsername: !currentUser.username,
              noCourse: !currentUser.course,
              noBirthdate: !currentUser.birthdate,
              noRfidId: !currentUser.rfidId
            }
          })

          if (needsProfileCompletion) {
            console.log('🚀 Redirecting to profile completion form')
            // Redirect to profile completion
            router.push('/register?google=true')
            showSuccessToast(
              'Welcome to CS Guild!',
              'Please complete your profile to get started.'
            )
            return
          }
          
          console.log('✅ Profile is complete, continuing with normal flow')
        }
        
        // Check for stored redirect URL from Google OAuth flow
        const storedRedirect = sessionStorage.getItem('auth_redirect_after_login')
        if (storedRedirect) {
          // Clear the stored redirect
          sessionStorage.removeItem('auth_redirect_after_login')
          
          // Validate that it's a safe internal URL
          try {
            const redirectUrl = new URL(storedRedirect, window.location.origin)
            // Ensure it's same origin and not an auth route
            if (redirectUrl.origin === window.location.origin && 
                !redirectUrl.pathname.startsWith('/login') && 
                !redirectUrl.pathname.startsWith('/register') &&
                !redirectUrl.pathname.startsWith('/callback')) {
              router.push(redirectUrl.pathname + redirectUrl.search)
              showSuccessToast(
                'Welcome back to CS Guild!',
                'Successfully logged in with Google. Redirecting you back to where you were!'
              )
              return
            }
          } catch (error) {
            console.error('Invalid stored redirect URL:', storedRedirect, error)
          }
        }
        
        // Default redirect to dashboard
        router.push('/dashboard')
        showSuccessToast(
          'Welcome back to CS Guild!',
          `Successfully logged in with Google. Ready to continue your coding journey!`
        )

      } catch (err) {
        if (isMounted) {
          setError('Authentication failed')
          setIsProcessing(false)
          console.error('Google callback error:', err)
          showErrorToast(
            'Authentication failed',
            'Unable to verify your authentication. Please try again.'
          )
        }
      }
    }

    // Add a small delay to allow Convex Auth to complete processing
    const timeoutId = setTimeout(() => {
      if (!isLoading) {
        checkUserStatus()
      }
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      isMounted = false
    }
  }, [searchParams, router, currentUser, isLoading, isAuthenticated])

  const handleRetry = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }



  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <div className="text-center">
          <p className="text-white text-lg font-medium">Processing authentication...</p>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we complete your Google login
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-2">Authentication Failed</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="text-sm text-red-400 font-space-mono bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            {"// Google authentication could not be completed"}
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <Button
            onClick={handleRetry}
            className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white"
          >
            Try Again
          </Button>
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="flex-1 border-pink-500/50 text-pink-300 hover:bg-pink-500/10"
          >
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return null
} 