import { ProtectedRoute } from '@/features/auth/components/protected-route'
import { CalendarManagementPage } from '@/features/management/pages/calendar-management-page'


export default function ManagementCalendarPage() {
  return (
    <ProtectedRoute requiredRoles={["ADMIN"]}>
      <CalendarManagementPage />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Calendar Management - CS Guild',
  description: 'Manage calendar events and scheduling for the CS Guild organization.',
}
