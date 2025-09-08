'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, ArrowRight, Loader2, ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas'
import { useAuthStore } from '../stores/auth-store'

// Note: The email should be passed via URL params or stored in local state
// For now, we'll need to get it from the forgot-password flow

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenFromUrl, setTokenFromUrl] = useState<string | null>(null)
  const [emailFromUrl, setEmailFromUrl] = useState<string | null>(null)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuthActions()
  const router = useRouter()
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    // Get token and email from URL params
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (token) {
      setTokenFromUrl(token)
      setValue('token', token)
    }

    if (email) {
      setEmailFromUrl(email)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setIsResetting(true)
      setError(null)

      // Check if we have the email (required for password reset verification)
      if (!emailFromUrl) {
        throw new Error('Email is required for password reset. Please go back to the forgot password page.')
      }

      // Use Convex Auth to reset password
      const formData = new FormData()
      formData.append('code', data.token)
      formData.append('newPassword', data.newPassword)
      formData.append('email', emailFromUrl)
      formData.append('flow', 'reset-verification')

      await signIn('password', formData)

      showSuccessToast(
        'Password reset successful!',
        'Your password has been changed successfully. You can now log in with your new password.'
      )

      // Redirect to login page after successful password reset
      router.push('/login')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      setError(errorMessage)
      showErrorToast(
        'Password reset failed',
        errorMessage || 'Unable to reset your password. The token may be invalid or expired. Please request a new reset link.'
      )
    } finally {
      setIsResetting(false)
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

      {/* Instructions */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30 flex items-center justify-center">
          <Shield className="h-8 w-8 text-pink-400" />
        </div>
        <p className="text-gray-300 text-sm">
          Enter your new password below. Make sure it&apos;s strong and secure.
        </p>
        <div className="text-gray-500 text-xs font-space-mono">
          {"// Password must include uppercase, lowercase, numbers, and special characters"}
        </div>
      </div>

      {/* Code Field (hidden if from URL) */}
      {!tokenFromUrl && (
        <div className="space-y-2">
          <label htmlFor="token" className="block text-sm font-medium text-gray-200">
            Reset Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('token')}
              type="text"
              id="token"
              placeholder="Enter the code from your email"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20 font-mono text-sm"
              autoComplete="off"
            />
          </div>
          {errors.token && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 font-space-mono"
            >
              {"// " + errors.token.message}
            </motion.p>
          )}
        </div>
      )}

      {/* New Password Field */}
      <div className="space-y-2">
        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200">
          New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('newPassword')}
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            placeholder="Enter your new password"
            className="pl-10 pr-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-300 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.newPassword && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 font-space-mono"
          >
            {"// " + errors.newPassword.message}
          </motion.p>
        )}
      </div>

      {/* Confirm New Password Field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
          Confirm New Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('confirmPassword')}
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            placeholder="Confirm your new password"
            className="pl-10 pr-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-300 transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 font-space-mono"
          >
            {"// " + errors.confirmPassword.message}
          </motion.p>
        )}
      </div>

      {/* Password Requirements */}
      <div className="bg-black/20 border border-pink-500/20 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-200 mb-2">Password Requirements:</h4>
        <ul className="text-xs text-gray-400 space-y-1 font-space-mono">
          <li>{"// At least 8 characters long"}</li>
          <li>{"// Include uppercase and lowercase letters"}</li>
          <li>{"// Include at least one number"}</li>
          <li>{"// Include at least one special character"}</li>
        </ul>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isResetting}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting || isResetting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Updating password...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Update Password</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-space-mono">{"// Back to login"}</span>
        </Link>
      </div>

      {/* Additional Help */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Need a new reset link?{' '}
          <Link
            href="/forgot-password"
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
          >
            Request again
          </Link>
        </p>
        <p className="text-gray-500 text-xs mt-2 font-space-mono">
          {"// Reset tokens expire after 1 hour for security"}
        </p>
      </div>
    </form>
  )
}
