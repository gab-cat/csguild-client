import type { Metadata } from 'next'

import { PublicEventFeedbackClient } from '@/features/events/components/my-events'

export const metadata: Metadata = {
  title: 'Event Feedback | CS Guild',
  description: 'Provide feedback for the event you attended. Your input helps us improve future events.',
  keywords: ['event feedback', 'community feedback', 'event review', 'CS Guild'],
  openGraph: {
    title: 'Event Feedback | CS Guild',
    description: 'Provide feedback for the event you attended. Your input helps us improve future events.',
  },
  twitter: {
    card: 'summary',
    title: 'Event Feedback | CS Guild',
    description: 'Provide feedback for the event you attended. Your input helps us improve future events.',
  },
}

interface PublicEventFeedbackPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicEventFeedbackPage({ params }: PublicEventFeedbackPageProps) {
  const { slug } = await params

  return <PublicEventFeedbackClient eventSlug={slug} />
}
