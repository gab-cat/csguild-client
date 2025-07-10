import { AuthLayout } from '@/features/auth/components/auth-layout'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email address and we'll send you a secure link to reset your password."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
