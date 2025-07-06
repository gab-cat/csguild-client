'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Mail, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useEmailVerificationMutation, useResendVerificationMutation } from '../hooks'
import { emailVerificationSchema, type EmailVerificationFormData } from '../schemas'

interface RegistrationStep4Props {
  email: string
  onComplete: () => void
  onBack: () => void
}

export function RegistrationStep4({ email, onBack }: RegistrationStep4Props) {
  const [resendCooldown, setResendCooldown] = useState(0)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const router = useRouter()
  
  const emailVerificationMutation = useEmailVerificationMutation()
  const resendVerificationMutation = useResendVerificationMutation()
  
  const codeInputsRef = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
  } = useForm<EmailVerificationFormData>({
    resolver: zodResolver(emailVerificationSchema),
    mode: 'onBlur',
    defaultValues: {
      email,
      verificationCode: '',
    },
  })

  const watchedCode = watch('verificationCode')

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
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

    const currentCode = watchedCode || ''
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
    if (e.key === 'Backspace' && !watchedCode?.[index] && index > 0) {
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

  const handleResendCode = async () => {
    try {
      await resendVerificationMutation.mutateAsync({ email })
      setResendCooldown(60) // 60 second cooldown
    } catch (error) {
      console.error('Resend failed:', error)
    }
  }

  const onSubmit = async (data: EmailVerificationFormData) => {
    try {
      await emailVerificationMutation.mutateAsync(data)
      setVerificationSuccess(true)
      
      // Redirect after showing success message
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: unknown) {
      setError('verificationCode', {
        type: 'manual',
        message: error instanceof Error ? error.message : 'Invalid verification code'
      })
    }
  }

  if (verificationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Welcome to CS Guild!</h3>
          <p className="text-gray-200 mb-4">
            Your account has been successfully verified and created.
          </p>
          <div className="text-sm text-green-400 font-space-mono bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            {"// Redirecting you to the dashboard..."}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Sent Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Check Your Email</h3>
          <p className="text-gray-300">
             We&apos;ve sent a 6-digit verification code to
          </p>
          <p className="text-pink-400 font-medium">{email}</p>
        </div>
      </motion.div>

      {/* 6-Digit Code Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-200 text-center">
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
              value={watchedCode?.[index] || ''}
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
            className="text-xs text-red-400 font-space-mono text-center"
          >
            {"// " + errors.verificationCode.message}
          </motion.p>
        )}
      </div>

      {/* Resend Code */}
      <div className="text-center space-y-3">
        <p className="text-gray-400 text-sm">Didn&apos;t receive the code?</p>
        
        <Button
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || resendVerificationMutation.isPending}
          variant="ghost"
          className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
        >
          {resendVerificationMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Sending...</span>
            </div>
          ) : resendCooldown > 0 ? (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Resend in {resendCooldown}s</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Resend Code</span>
            </div>
          )}
        </Button>
        
        {resendVerificationMutation.isSuccess && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-green-400 font-space-mono"
          >
            {"// Verification code sent successfully!"}
          </motion.p>
        )}
      </div>

      {/* Error Display */}
      {emailVerificationMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <div className="font-space-mono">{"// Verification Error:"}</div>
          <div>{emailVerificationMutation.error?.message || 'Verification failed'}</div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
          disabled={isSubmitting}
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </div>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !watchedCode || watchedCode.length !== 6}
          className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Verify & Complete</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <div className="text-sm text-gray-400 font-space-mono bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
          {"// Check your spam folder if you don't see the email within a few minutes"}
        </div>
      </div>
    </form>
  )
}

export default RegistrationStep4 