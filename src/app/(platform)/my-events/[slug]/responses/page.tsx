import { Suspense } from 'react'

import { EventResponsesClient } from '@/features/events/components/responses'

interface EventResponsesPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EventResponsesPage({ params }: EventResponsesPageProps) {
  const { slug } = await params
  return (
    <div className="flex w-7xl justify-center items-center max-w-7xl mx-auto py-8 px-0">
      <Suspense fallback={<div>Loading event responses...</div>}>
        <EventResponsesClient slug={slug} />
      </Suspense>
    </div>
  )
}

export const metadata = {
  title: 'Event Feedback Responses',
  description: 'View and analyze feedback responses for this event',
}