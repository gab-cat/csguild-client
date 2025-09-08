import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { UsersManagementPage } from '@/features/management/pages/users-management-page'

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <UsersManagementPage />
    </ProtectedRoute>
  )
}


