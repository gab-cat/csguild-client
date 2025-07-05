'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Calendar, User, GraduationCap, CreditCard, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useUpdateUserProfileMutation } from '../hooks'
import { googleUserUpdateSchema, type GoogleUserUpdateData } from '../schemas'
import { useAuthStore } from '../stores/auth-store'

export function GoogleProfileCompletionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuthStore()
  const [isFromGoogle, setIsFromGoogle] = useState(false)
  const updateProfileMutation = useUpdateUserProfileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<GoogleUserUpdateData>({
    resolver: zodResolver(googleUserUpdateSchema),
    mode: 'onBlur',
  })

  useEffect(() => {
    const googleParam = searchParams.get('google')
    setIsFromGoogle(googleParam === 'true')
    
    // Pre-fill form with existing user data if available
    if (user) {
      // Only pre-fill if user is a Google OAuth user
      if (user.signupMethod === 'GOOGLE') {
        reset({
          username: user.username || '',
          birthdate: user.birthdate || '',
          course: user.course || '',
          rfidId: user.hasRfidCard ? undefined : '',
        })
      }
    }
  }, [user, searchParams, reset])

  const onSubmit = async (data: GoogleUserUpdateData) => {
    try {
      // Remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
      ) as GoogleUserUpdateData

      await updateProfileMutation.mutateAsync(cleanData)
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  const handleBack = () => {
    router.push('/login')
  }

  const getRequiredFields = () => {
    if (!user) return []
    
    const required = []
    // Only show required fields for Google OAuth users with incomplete profiles
    if (user.signupMethod === 'GOOGLE') {
      if (!user.birthdate) required.push('birthdate')
      if (!user.course) required.push('course')
      if (!user.hasRfidCard) required.push('rfidId')
      if (!user.username) required.push('username')
    }
    
    return required
  }

  const requiredFields = getRequiredFields()

  // Show loading state while user data is loading
  if (isLoading || !user) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  // Let middleware handle redirects for non-Google users and complete profiles
  // This component should only render for Google OAuth users with incomplete profiles

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {isFromGoogle ? 'Complete Your Profile' : 'Update Your Profile'}
        </h2>
        <p className="text-gray-400">
          {isFromGoogle 
            ? 'Welcome to CS Guild! Please complete your profile to get started.' 
            : 'Fill in the missing information to complete your profile.'}
        </p>
        
        {/* User Info Display */}
        <div className="mt-4 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
          <p className="text-sm text-pink-400 font-jetbrains mb-2">
            {"// Connected as"}
          </p>
          <p className="text-white font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Username Field */}
        {requiredFields.includes('username') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
              <Input
                {...register('username')}
                type="text"
                placeholder="Username (optional)"
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-400 font-jetbrains">
                  {"// " + errors.username.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Birthdate Field */}
        {requiredFields.includes('birthdate') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
              <Input
                {...register('birthdate')}
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              />
              {errors.birthdate && (
                <p className="mt-2 text-sm text-red-400 font-jetbrains">
                  {"// " + errors.birthdate.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Course Field */}
        {requiredFields.includes('course') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
              <Input
                {...register('course')}
                type="text"
                placeholder="Course (e.g., Computer Science, Information Technology)"
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              />
              {errors.course && (
                <p className="mt-2 text-sm text-red-400 font-jetbrains">
                  {"// " + errors.course.message}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* RFID Field */}
        {requiredFields.includes('rfidId') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
              <Input
                {...register('rfidId')}
                type="text"
                placeholder="RFID Card ID (optional - tap your student ID)"
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              />
              {errors.rfidId && (
                <p className="mt-2 text-sm text-red-400 font-jetbrains">
                  {"// " + errors.rfidId.message}
                </p>
              )}
            </div>
            <p className="mt-2 text-sm text-gray-400 font-jetbrains">
              {"// Tap your student ID on an RFID reader to fill this field automatically"}
            </p>
          </motion.div>
        )}

        {/* Info Message */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-blue-400 font-jetbrains">
            {"// You can skip optional fields and complete them later in your profile settings"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="flex-1 border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || updateProfileMutation.isPending}
            className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
          >
            {isSubmitting || updateProfileMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Complete Profile</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 