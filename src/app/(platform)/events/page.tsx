import type { Metadata } from 'next'

import { EventsClient } from '@/features/events/components'

export const metadata: Metadata = {
  title: 'Events | CS Guild',
  description: 'Discover and join amazing events in our community. Connect with fellow developers, learn new skills, and grow your network.',
  keywords: ['events', 'community', 'developers', 'networking', 'programming', 'workshops', 'meetups'],
  openGraph: {
    title: 'Events | CS Guild',
    description: 'Discover and join amazing events in our community. Connect with fellow developers, learn new skills, and grow your network.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events | CS Guild',
    description: 'Discover and join amazing events in our community. Connect with fellow developers, learn new skills, and grow your network.',
  },
}

export default function EventsPage() {
  return <EventsClient />
}
