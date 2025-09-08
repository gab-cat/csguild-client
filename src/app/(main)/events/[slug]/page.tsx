import { Metadata } from 'next'

import { EventDetailClient } from '@/features/events/components/event-details/event-detail-client'
import { toTitleCase } from '@/lib/utils'

interface EventDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params
  return <EventDetailClient slug={slug} />
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  return {
    title: `${toTitleCase(slug.replace(/-/g, ' '))} | CS Guild Events`,
    description: `Join us for this exciting event. View event details, organizer information, and attendee list.`,
  }
}