'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

import { useAuthStore } from '../stores/auth-store'
import { authApi } from '../utils/auth-api'

export function GoogleCallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    let isMounted = true

    const checkUserStatus = async () => {
      try {
        if (!isMounted) return

        setLoading(true)
        
        // Check for OAuth errors in URL params
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

        // Server has already processed the OAuth code
        // Just check if user is authenticated and get user data
        const user = await authApi.getCurrentUser()
        
        if (!isMounted) return

        setUser(user)
        
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
                !redirectUrl.pathname.startsWith('/register')) {
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
        
        // Let middleware handle redirects based on profile completion
        // Just redirect to dashboard and middleware will handle the rest
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
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkUserStatus()

    return () => {
      isMounted = false
    }
  }, [searchParams, router, setLoading, setUser]) // Removed setUser and setLoading from dependencies as they're stable Zustand references

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