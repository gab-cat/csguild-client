'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, ArrowLeft, Shield, Lock, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas'

export function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signIn } = useAuthActions()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  })

  const onSendResetEmail = async (data: ForgotPasswordFormData) => {
    try {
      setIsSending(true)
      setError(null)

      // Use Convex Auth to send password reset email
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('flow', 'reset')

      await signIn('password', formData)

      setEmailSent(true)
      setShowPasswordFields(true)
      showSuccessToast(
        'Password reset email sent!',
        'If an account with this email exists, you will receive reset instructions. Enter the OTP code and your new password below.'
      )
    } catch  {
      // For security, always show success message regardless of whether email exists
      // This prevents email enumeration attacks
      setEmailSent(true)
      setShowPasswordFields(true)
      showSuccessToast(
        'Password reset email sent!',
        'If an account with this email exists, you will receive reset instructions. Enter the OTP code and your new password below.'
      )
    } finally {
      setIsSending(false)
    }
  }

  const onResetPassword = async (data: ForgotPasswordFormData) => {
    try {
      setIsResetting(true)
      setError(null)

      // Use Convex Auth to reset password with OTP
      const formData = new FormData()
      formData.append('code', data.code || '')
      formData.append('newPassword', data.newPassword || '')
      formData.append('email', data.email)
      formData.append('flow', 'reset-verification')

      await signIn('password', formData)

      showSuccessToast(
        'Password reset successful!',
        'Your password has been changed successfully. You can now log in with your new password.'
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      setError(errorMessage)
      showErrorToast(
        'Password reset failed',
        errorMessage || 'Unable to reset your password. Please check your code and try again.'
      )
    } finally {
      setIsResetting(false)
    }
  }

  if (emailSent) {
    return (
      <div className="space-y-6">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
            <Mail className="h-8 w-8 text-green-400" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
            <p className="text-gray-300 text-sm mb-4">
              We&apos;ve sent password reset instructions to{' '}
              <span className="text-pink-400 font-semibold">{getValues('email')}</span>
            </p>
            <div className="text-gray-400 text-xs space-y-1">
              <p>{"// The reset link will expire in 1 hour"}</p>
              <p>{"// Don't forget to check your spam folder"}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Send to different email</span>
            </div>
          </Button>

          <Link
            href="/login"
            className="block w-full"
          >
            <Button
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
            >
              <div className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Still need help?{' '}
            <Link
              href="/help"
              className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
            >
              Contact support
            </Link>
          </p>
          <p className="text-gray-500 text-xs mt-2 font-space-mono">
            {"// We're here to help you get back to coding"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(showPasswordFields ? onResetPassword : onSendResetEmail)} className="space-y-6">
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
        <div className="text-gray-500 text-xs font-space-mono">
          {"// Password reset link expires in 1 hour"}
        </div>
      </div>

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
            autoFocus
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

      {/* OTP Code Field (shown after email is sent) */}
      {showPasswordFields && (
        <div className="space-y-2">
          <label htmlFor="code" className="block text-sm font-medium text-gray-200">
            OTP Code
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('code')}
              type="text"
              id="code"
              placeholder="Enter the 8-digit code from your email"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="off"
              maxLength={8}
            />
          </div>
          {errors.code && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 font-space-mono"
            >
              {"// " + errors.code.message}
            </motion.p>
          )}
        </div>
      )}

      {/* New Password Field (shown after email is sent) */}
      {showPasswordFields && (
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
      )}

      {/* Confirm New Password Field (shown after email is sent) */}
      {showPasswordFields && (
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
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isSending || isResetting}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting || isSending || isResetting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>
              {showPasswordFields ? "Resetting password..." : "Sending reset email..."}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>
              {showPasswordFields ? "Reset Password" : "Send Reset Email"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Back Button or Different Email */}
      <div className="text-center space-y-2">
        {showPasswordFields ? (
          <Button
            type="button"
            onClick={() => {
              setShowPasswordFields(false)
              setEmailSent(false)
            }}
            variant="outline"
            className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Use different email</span>
            </div>
          </Button>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300 transition-colors duration-200 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-space-mono">{"// Back to login"}</span>
          </Link>
        )}
      </div>

      {/* Additional Help */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Remember your password?{' '}
          <Link
            href="/login"
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-gray-500 text-xs mt-2 font-space-mono">
          {"// Secure password reset with one-time tokens"}
        </p>
      </div>
    </form>
  )
}
