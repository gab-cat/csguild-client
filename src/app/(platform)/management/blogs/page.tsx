import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { BlogsManagementPage } from '@/features/management/pages/blogs-management-page'


export default function ManagementBlogsPage() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <BlogsManagementPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Blogs Management - CS Guild',
  description: 'Manage blogs for the CS Guild organization.',
}
