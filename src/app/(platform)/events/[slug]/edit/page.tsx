import type { Metadata } from 'next'

import { EditEventClient } from '@/features/events/components/edit'

interface EditEventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: EditEventPageProps): Promise<Metadata> {
  const { slug } = await params
  
  return {
    title: `Edit Event | CS Guild`,
    description: `Edit event details and settings for ${slug}. Modify event information, schedule, and feedback forms.`,
    keywords: ['edit event', 'event management', 'update event', 'CS Guild'],
    openGraph: {
      title: `Edit Event | CS Guild`,
      description: `Edit event details and settings for ${slug}. Modify event information, schedule, and feedback forms.`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Edit Event | CS Guild`,
      description: `Edit event details and settings for ${slug}. Modify event information, schedule, and feedback forms.`,
    },
  }
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { slug } = await params
  
  return <EditEventClient slug={slug} />
}
