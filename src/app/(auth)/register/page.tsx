'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

import { AuthLayout } from '@/features/auth/components/auth-layout'
import { GoogleProfileCompletionForm } from '@/features/auth/components/google-profile-completion-form'
import { MultiStepRegisterForm } from '@/features/auth/components/multi-step-register-form'

function RegisterPageContent() {
  const searchParams = useSearchParams()
  const isGoogleOAuth = searchParams.get('google') === 'true'

  if (isGoogleOAuth) {
    return (
      <AuthLayout
        title="Complete Your Profile"
        subtitle="Just a few more details to complete your CS Guild profile."
      >
        <GoogleProfileCompletionForm />
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Join CS Guild"
      subtitle="Create your account and join 10,000+ developers building the future together."
    >
      <MultiStepRegisterForm />
    </AuthLayout>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  )
}
