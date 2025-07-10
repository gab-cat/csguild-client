import { AuthLayout } from '@/features/auth/components/auth-layout'
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form'

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be different from your previous password for security."
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}
