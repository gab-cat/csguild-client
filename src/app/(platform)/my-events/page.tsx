import type { Metadata } from 'next'

import { MyEventsClient } from '@/features/events/components/my-events/my-events-client'

export const metadata: Metadata = {
  title: 'My Events | CS Guild',
  description: 'Manage your attended and created events in the CS Guild community. Track your event history and manage your organized events.',
  keywords: ['my events', 'attended events', 'created events', 'event management', 'CS Guild'],
  openGraph: {
    title: 'My Events | CS Guild',
    description: 'Manage your attended and created events in the CS Guild community. Track your event history and manage your organized events.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Events | CS Guild',
    description: 'Manage your attended and created events in the CS Guild community. Track your event history and manage your organized events.',
  },
}

export default function MyEventsPage() {
  return <MyEventsClient />
}
