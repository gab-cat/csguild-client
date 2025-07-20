import { Metadata } from 'next'

import { AttendanceTrackingClient } from '@/features/events/components/attendance-tracking/attendance-tracking-client'
import { toTitleCase } from '@/lib/utils'

interface AttendancePageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { slug } = await params
  return <AttendanceTrackingClient slug={slug} />
}

export async function generateMetadata({ params }: AttendancePageProps): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `${toTitleCase(slug.replace(/-/g, ' '))} - Attendance Tracking | CS Guild Events`,
    description: `Track attendance for ${toTitleCase(slug.replace(/-/g, ' '))} event. Manage attendee check-ins and check-outs.`,
  }
}
