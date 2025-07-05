import { AuthLayout } from '@/features/auth/components/auth-layout'
import { LoginForm } from '@/features/auth/components/login-form'

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access your CS Guild account and continue your coding journey."
    >
      <LoginForm />
    </AuthLayout>
  )
}
