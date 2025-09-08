import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { FacilitiesManagementPage } from '@/features/management/pages/facilities-management-page'

export default function Page() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <FacilitiesManagementPage />
    </ProtectedRoute>
  )
}


