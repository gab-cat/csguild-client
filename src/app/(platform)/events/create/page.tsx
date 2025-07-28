import type { Metadata } from 'next'

import { CreateEventClient } from '@/features/events/components/create/create-event-client'

export const metadata: Metadata = {
  title: 'Create Event | CS Guild',
  description: 'Create a new event for the CS Guild community. Set up your event details, schedule, and custom feedback forms.',
  keywords: ['create event', 'event planning', 'community events', 'organize', 'CS Guild'],
  openGraph: {
    title: 'Create Event | CS Guild',
    description: 'Create a new event for the CS Guild community. Set up your event details, schedule, and custom feedback forms.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Event | CS Guild',
    description: 'Create a new event for the CS Guild community. Set up your event details, schedule, and custom feedback forms.',
  },
}

export default function CreateEventPage() {
  return <CreateEventClient />
}
