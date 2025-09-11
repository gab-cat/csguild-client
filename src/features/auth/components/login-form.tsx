'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { loginSchema, type LoginFormData } from '../schemas'

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuthActions()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get the next parameter from URL
  const nextParam = searchParams.get('next')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null)

      // Use Convex Auth signIn with FormData
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('flow', 'signIn')

      await signIn('password', formData)

      showSuccessToast('Login successful', 'Welcome back to CS Guild!')

      // Handle redirect after successful login
      if (nextParam) {
        try {
          const url = new URL(nextParam, window.location.origin)
          if (url.origin === window.location.origin &&
              !url.pathname.startsWith('/login') &&
              !url.pathname.startsWith('/register')) {
            router.push(url.pathname + url.search)
            return
          }
        } catch (error) {
          console.error('Invalid redirect URL:', nextParam, error)
        }
      }

      router.push('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'

      // Check if the error is related to unverified email
      // @ts-expect-error - not typed properly
      if ((error as Error).statusCode === 409) {
        // Store the next parameter before redirecting to verify email
        if (nextParam) {
          sessionStorage.setItem('auth_redirect_after_login', nextParam)
        }
        router.push(`/verify-email?email=${data.email}`)
        setError('Please verify your email before logging in.')
      } else if (errorMessage.includes('locked')) {
        setError('Your account has been locked. Please contact support.')
        showErrorToast('Account locked', 'Your account has been locked. Please contact support.')
      } else {
        setError('Invalid credentials. Double-check your email and password.')
        showErrorToast('Login failed', 'Invalid credentials. Double-check your email and password.')
      }
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      // Store the next parameter in sessionStorage for Google OAuth flow
      if (nextParam) {
        sessionStorage.setItem('auth_redirect_after_login', nextParam)
      }

      // Show redirecting toast
      showSuccessToast('Redirecting...', 'Redirecting to Google for authentication')

      // Use Convex's built-in Google OAuth
      await signIn('google')

      // Note: No manual redirect here - Google OAuth will handle the redirect flow
      // The success toast and dashboard redirect will be handled by the OAuth callback
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google login failed'
      setError(errorMessage)
      showErrorToast('Login failed', 'Unable to sign in with Google. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <div className="font-space-mono">{"// Error:"}</div>
          <div>{error}</div>
        </motion.div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('email')}
            type="email"
            id="email"
            placeholder="student@university.edu"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 font-space-mono"
          >
            {"// " + errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-200">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            id="password"
            placeholder="Enter your password"
            className="pl-10 pr-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 font-space-mono"
          >
            {"// " + errors.password.message}
          </motion.p>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-sm text-pink-400 hover:text-pink-300 transition-colors duration-200 font-space-mono"
        >
          {"// Forgot password?"}
        </Link>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Logging in...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-pink-500/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400 font-space-mono">{"// Or continue with"}</span>
        </div>
      </div>

      {/* Google Login Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="flex items-center gap-3">
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}</span>
        </div>
      </Button>

      {/* Sign Up Link */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
          >
            Sign up here
          </Link>
        </p>
        <p className="text-gray-500 text-xs mt-2 font-space-mono">
          {"// Join the community of 100+ developers"}
        </p>
      </div>
    </form>
  )
} 