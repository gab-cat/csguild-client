'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Loader2, Edit3, User, GraduationCap, CreditCard, Lock } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import type { CompleteRegistrationData } from '../schemas'

import type { RegistrationStep } from './multi-step-register-form'

interface RegistrationStep3Props {
  data: CompleteRegistrationData
  onConfirm: () => void
  onBack: () => void
  onEdit: (step: RegistrationStep) => void
}

export function RegistrationStep3({ data, onConfirm, onBack, onEdit }: RegistrationStep3Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signIn } = useAuthActions()

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      setError(null)

      // Create FormData for Convex Auth signIn - this is the proper way according to docs
      const formData = new FormData()
      formData.append('email', data.email)
      formData.append('password', data.password)
      formData.append('firstName', data.firstName || '')
      formData.append('lastName', data.lastName || '')
      formData.append('username', data.username || '')
      formData.append('birthdate', data.birthdate || '')
      formData.append('course', data.course || '')
      formData.append('rfidId', data.rfidId || '')
      formData.append('flow', 'signUp') // This is the key - flow must be a form field

      // Use Convex Auth signIn for registration with FormData
      await signIn('password', formData)

      console.log('✅ Registration Step 3 - Account created successfully')
      showSuccessToast(
        'Welcome to CS Guild!',
        'Account created successfully. Check your email to verify and complete setup.'
      )
      onConfirm()
    } catch (error) {
      console.error('❌ Registration Step 3 - Registration failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      showErrorToast(
        'Registration failed',
        errorMessage || 'Unable to create account. Please check your information and try again.'
      )
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const DataSection = ({ 
    title, 
    icon: Icon, 
    children, 
    onEditClick 
  }: { 
    title: string
    icon: React.ElementType
    children: React.ReactNode
    onEditClick: () => void
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-lg bg-black/40 border border-pink-500/20 hover:border-pink-500/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-pink-400" />
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        <Button
          type="button"
          onClick={onEditClick}
          variant="ghost"
          size="sm"
          className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </motion.div>
  )

  const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}:</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <DataSection
        title="Personal Information"
        icon={User}
        onEditClick={() => onEdit(1)}
      >
        <InfoItem label="First Name" value={data.firstName} />
        <InfoItem label="Last Name" value={data.lastName} />
        <InfoItem label="Email" value={data.email} />
        {data.username && <InfoItem label="Username" value={data.username} />}
        <InfoItem label="Birthdate" value={formatDate(data.birthdate)} />
      </DataSection>

      {/* Academic Information */}
      <DataSection
        title="Academic Information"
        icon={GraduationCap}
        onEditClick={() => onEdit(1)}
      >
        <InfoItem label="Course/Program" value={data.course} />
      </DataSection>

      {/* RFID Information */}
      <DataSection
        title="RFID Card"
        icon={CreditCard}
        onEditClick={() => onEdit(2)}
      >
        <InfoItem 
          label="RFID ID" 
          value={data.rfidId || 'Not configured'} 
        />
        {data.rfidId && (
          <div className="mt-2 p-2 rounded bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CreditCard className="h-4 w-4" />
              <span>RFID card linked successfully</span>
            </div>
          </div>
        )}
      </DataSection>

      {/* Security Information */}
      <DataSection
        title="Security"
        icon={Lock}
        onEditClick={() => onEdit(1)}
      >
        <InfoItem label="Password" value="••••••••••••" />
        <div className="mt-2 p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <div className="text-blue-300 text-sm">
            Your password is securely encrypted and stored
          </div>
        </div>
      </DataSection>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20"
      >
        <div className="text-center">
          <div className="font-space-mono text-pink-300 mb-2">{"// Account Summary"}</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-white font-medium">{data.firstName} {data.lastName}</div>
              <div className="text-gray-400">Full Name</div>
            </div>
            <div>
              <div className="text-white font-medium">{data.course}</div>
              <div className="text-gray-400">Program</div>
            </div>
            <div>
              <div className="text-white font-medium">{data.rfidId ? 'Connected' : 'Not Set'}</div>
              <div className="text-gray-400">RFID Status</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Terms and Conditions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
      >
        <div className="text-sm text-yellow-200">
          <div className="font-space-mono mb-2">{"// Terms & Conditions"}</div>
          <p>
            By creating an account, you agree to our Terms of Service and Privacy Policy. 
            Your information will be used to provide CS Guild services and communication.
          </p>
        </div>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          <div className="font-space-mono">{"// Registration Error:"}</div>
          <div>{error}</div>
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
            <span>Back to RFID</span>
          </div>
        </Button>

        <Button
          type="button"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating Account...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Create My Account</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}

export default RegistrationStep3 