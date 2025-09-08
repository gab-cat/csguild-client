import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import { EventFeedbackClient } from '@/features/events/components/my-events/event-feedback-client'

interface EventFeedbackPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EventFeedbackPage({ params }: EventFeedbackPageProps) {
  const { slug } = await params

  if (!slug || typeof slug !== 'string') {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-400">Loading feedback form...</span>
        </div>
      }>
        <EventFeedbackClient eventSlug={slug} />
      </Suspense>
    </div>
  )
}
