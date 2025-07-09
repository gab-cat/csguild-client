'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, Loader2, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useEmailVerificationMutation, useResendVerificationMutation } from '../hooks'
import { emailVerificationSchema, type EmailVerificationFormData } from '../schemas'
import { useAuthStore } from '../stores/auth-store'

export function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const emailFromUrl = searchParams.get('email')
  const [resendCooldown, setResendCooldown] = useState(0)
  const { isLoading, error } = useAuthStore()
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([])
  
  const verifyEmailMutation = useEmailVerificationMutation()
  const resendVerificationMutation = useResendVerificationMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: 'onBlur',
    defaultValues: {
      email: emailFromUrl || '',
      verificationCode: '',
    },
  })

  const emailValue = watch('email')
  const codeValue = watch('verificationCode')

  // Set email from URL params
  useEffect(() => {
    if (emailFromUrl) {
      setValue('email', emailFromUrl)
    }
  }, [emailFromUrl, setValue])

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1) // Only keep the last character
    }
    
    if (!/^\d*$/.test(value)) {
      return // Only allow digits
    }

    const currentCode = codeValue || ''
    const newCode = currentCode.split('')
    newCode[index] = value
    
    const updatedCode = newCode.join('').slice(0, 6)
    setValue('verificationCode', updatedCode)

    // Auto-focus next input
    if (value && index < 5) {
      codeInputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codeValue?.[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    setValue('verificationCode', pastedData)
    
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 5)
    codeInputsRef.current[nextIndex]?.focus()
  }

  const onSubmit = async (data: EmailVerificationFormData) => {
    try {
      await verifyEmailMutation.mutateAsync(data)
    } catch (error) {
      console.error('Email verification error:', error)
      setError('verificationCode', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Invalid verification code'
      })
    }
  }

  const handleResendVerification = async () => {
    if (!emailValue || resendCooldown > 0) return

    try {
      await resendVerificationMutation.mutateAsync({ email: emailValue })
      setResendCooldown(60) // 60 seconds cooldown
    } catch (error) {
      console.error('Resend verification error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Success Icon Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center mb-6"
      >
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30 flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-pink-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Check Your Email</h3>
          <p className="text-gray-300 text-sm">
            We&apos;ve sent a 6-digit verification code to:
          </p>
          {emailValue && (
            <p className="font-space-mono text-pink-400 text-sm bg-pink-500/10 px-3 py-1 rounded-lg inline-block">
              {emailValue}
            </p>
          )}
        </div>
      </motion.div>

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

      {/* Verification Code Field */}
      <div className="space-y-4">
        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-200 text-center">
          Enter Verification Code
        </label>
        
        <div className="flex justify-center gap-3 mt-2">
          {[...Array(6)].map((_, index) => (
            <Input
              key={index}
              ref={(el) => { codeInputsRef.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={codeValue?.[index] || ''}
              onChange={(e) => handleCodeChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-bold bg-black/40 border-pink-500/30 text-white focus:border-pink-400 focus:ring-pink-400/20"
            />
          ))}
        </div>

        {errors.verificationCode && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 font-space-mono text-center"
          >
            {"// " + errors.verificationCode.message}
          </motion.p>
        )}
        
        {/* Code hints */}
        <div className="flex items-center justify-center text-xs text-gray-400">
          <span className="font-space-mono">{"// Enter the 6-digit code from your email"}</span>
        </div>
      </div>

      {/* Resend Verification */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-violet-500/10 border border-violet-500/20">
        <div className="text-sm text-gray-300">
          <p>Didn&apos;t receive the code?</p>
          <p className="text-xs text-gray-400 font-space-mono">
            {"// Check your spam folder too"}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleResendVerification}
          disabled={!emailValue || resendCooldown > 0 || resendVerificationMutation.isPending}
          className="border-violet-500/50 text-violet-300 hover:bg-violet-500/10 bg-black/30 backdrop-blur-sm hover:border-violet-400 transition-all duration-300"
        >
          {resendVerificationMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : resendCooldown > 0 ? (
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Resend ({resendCooldown}s)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Resend Code</span>
            </div>
          )}
        </Button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoading || !codeValue || codeValue.length !== 6}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting || isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Verify Email</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Additional Help */}
      <div className="text-center space-y-4">
        <div className="text-sm text-gray-400">
          <p>Having trouble verifying your email?</p>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-xs">
          <Link 
            href="/contact" 
            className="text-pink-400 hover:text-pink-300 transition-colors duration-200 font-space-mono"
          >
            {"// Contact Support"}
          </Link>
          <Link 
            href="/login" 
            className="text-violet-400 hover:text-violet-300 transition-colors duration-200 font-space-mono"
          >
            {"// Back to Login"}
          </Link>
        </div>

        <div className="text-sm text-gray-400 font-space-mono bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
          {"// Check your spam folder if you don't see the email within a few minutes"}
        </div>
      </div>
    </form>
  )
}
