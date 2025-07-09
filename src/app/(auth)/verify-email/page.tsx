import { Metadata } from 'next'
import { Suspense } from 'react'

import { AuthLayout, VerifyEmailForm } from '@/features/auth/components'

export const metadata: Metadata = {
  title: 'Verify Email | CS Guild',
  description: 'Complete your CS Guild account setup by verifying your email address.',
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout
        title="Verify Your Email"
        subtitle="Complete your CS Guild account setup"
        showBackButton={true}
      >
        <VerifyEmailForm />
      </AuthLayout>
    </Suspense>
  )
}