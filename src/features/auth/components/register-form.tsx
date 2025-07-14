'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Calendar, GraduationCap, ArrowRight, Loader2, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useRegisterMutation } from '../hooks'
import { registerSchema, type RegisterFormData } from '../schemas'
import { useAuthStore } from '../stores/auth-store'
import { authApi } from '../utils/auth-api'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const { isLoading, error } = useAuthStore()
  const registerMutation = useRegisterMutation()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const watchedEmail = watch('email')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Remove confirmPassword before sending to API
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data
      await registerMutation.mutateAsync(registerData)
      setRegistrationSuccess(true)
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Registration error:', error)
    }
  }

  if (registrationSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
          <p className="text-gray-200 mb-4">
            We&apos;ve sent a verification email to <strong>{watchedEmail}</strong>
          </p>
          <div className="text-sm text-pink-400 font-space-mono bg-pink-500/10 border border-pink-500/20 rounded-lg p-4">
            {"// Please check your email and click the verification link to activate your account"}
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => setRegistrationSuccess(false)}
            variant="outline"
            className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10"
          >
            Register Another Account
          </Button>
          
          <Link href="/login">
            <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600">
              Continue to Login
            </Button>
          </Link>
        </div>
      </motion.div>
    )
  }

  const handleGoogleSignup = async () => {
    authApi.googleLogin()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('firstName')}
              type="text"
              id="firstName"
              placeholder="John"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="given-name"
            />
          </div>
          {errors.firstName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.firstName.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('lastName')}
              type="text"
              id="lastName"
              placeholder="Doe"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="family-name"
            />
          </div>
          {errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.lastName.message}
            </motion.p>
          )}
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
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
          Username <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('username')}
            type="text"
            id="username"
            placeholder="johndoe123"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="username"
          />
        </div>
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.username.message}
          </motion.p>
        )}
      </div>

      {/* Course and Birthdate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="course" className="block text-sm font-medium text-gray-200">
            Course/Program
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('course')}
              type="text"
              id="course"
              placeholder="Bachelor of Science in Computer Science"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            />
          </div>
          {errors.course && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.course.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-200">
            Birthdate
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('birthdate')}
              type="date"
              id="birthdate"
              className="pl-10 bg-black/40 border-pink-500/30 text-white focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="bday"
            />
          </div>
          {errors.birthdate && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.birthdate.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* RFID Field */}
      <div className="space-y-2">
        <label htmlFor="rfidId" className="block text-sm font-medium text-gray-200">
          RFID Card ID <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('rfidId')}
            type="text"
            id="rfidId"
            placeholder="RF001234567"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
          />
        </div>
        {errors.rfidId && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.rfidId.message}
          </motion.p>
        )}
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Create password"
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
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm password"
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
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.confirmPassword.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting || isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Create Account</span>
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

      {/* Google Signup Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
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
          <span>Continue with Google</span>
        </div>
      </Button>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
        <p className="text-gray-500 text-xs mt-2 font-space-mono">
          {"// Join the community of 100+ developers"}
        </p>
      </div>
    </form>
  )
} 