'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { useEventWithAttendees } from '../../hooks'
import { eventUtils } from '../../utils'
import { RegisterEventModal } from '../register-event-modal'

import { 
  EventHeroSection, 
  EventDetails, 
  EventMetadataSection,
  AttendeesSection, 
  OrganizerCard, 
  RegistrationSection 
} from './'

interface EventDetailClientProps {
  slug: string
}

export function EventDetailClient({ slug }: EventDetailClientProps) {
  const {
    event,
    attendees: attendeesData,
    isLoading,
    isLoadingAttendees
  } = useEventWithAttendees(slug)

  const [isBookmarked, setIsBookmarked] = React.useState(false)
  const [showRegisterModal, setShowRegisterModal] = React.useState(false)

  if (isLoading) {
    return <EventDetailSkeleton />
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Event Not Found</h1>
          <p className="text-gray-400">The event you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventStatus = eventUtils.getEventStatus(event.startDate, typeof event.endDate === 'string' ? event.endDate : undefined)
  const isCompleted = eventStatus === 'completed'

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: event.title,
        text: typeof event.description === 'string' ? event.description : '',
        url: window.location.href,
      })
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // TODO: Implement bookmark API call
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gray-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 pt-24">
        {/* Hero Section */}
        <EventHeroSection
          event={event}
          isBookmarked={isBookmarked}
          onToggleBookmark={toggleBookmark}
          onShare={handleShare}
        />

        {/* Content */}
        <div className="relative z-10 bg-gray-950 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Event Metadata Section */}
            <EventMetadataSection event={event} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              {/* Main Content - Event Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Event Details Section */}
                <EventDetails event={event} />

                {/* Attendees Card */}
                <AttendeesSection 
                  attendeesData={attendeesData || undefined} 
                  isLoading={isLoadingAttendees} 
                />
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Register Button */}
                <RegistrationSection
                  event={event}
                  onRegister={() => setShowRegisterModal(true)}
                  isCompleted={isCompleted}
                />

                {/* Organizer Card */}
                <OrganizerCard event={event} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Modal */}
      {event && (
        <RegisterEventModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          event={{
            id: event.id,
            slug: event.slug,
            title: event.title,
            type: event.type,
            description: typeof event.description === 'string' ? event.description : undefined,
            details: typeof event.details === 'string' ? event.details : undefined,
            startDate: event.startDate,
            endDate: typeof event.endDate === 'string' ? event.endDate : null,
            organizer: {
              firstName: event.organizer.firstName,
              lastName: event.organizer.lastName,
              username: event.organizer.username,
            },
            tags: event.tags || undefined,
          }}
        />
      )}
    </div>
  )
}

function EventDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-gray-950" />
      <div className="relative z-10">
        {/* Hero Skeleton */}
        <div className="relative">
          <div className="h-80 lg:h-96 bg-gray-800 animate-pulse relative z-10">
            <div className="absolute bottom-6 left-6 right-6">
              <div className="max-w-7xl mx-auto space-y-4">
                {/* Navigation and Status Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-20 bg-gray-700" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 bg-gray-700" />
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-10 bg-gray-700" />
                    <Skeleton className="h-10 w-10 bg-gray-700" />
                  </div>
                </div>
                <Skeleton className="h-12 w-3/4 bg-gray-700" />
                <Skeleton className="h-6 w-full bg-gray-700" />
                <Skeleton className="h-6 w-2/3 bg-gray-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="relative z-10 bg-gray-950 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Event Details Skeleton */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-48 bg-gray-700" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-gray-700" />
                        <Skeleton className="h-5 w-40 bg-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20 bg-gray-700" />
                        <Skeleton className="h-5 w-40 bg-gray-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-16 bg-gray-700" />
                      <Skeleton className="h-5 w-24 bg-gray-700" />
                    </div>
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-12 bg-gray-700" />
                      <div className="flex flex-wrap gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-6 w-16 bg-gray-700" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attendees Skeleton */}
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                  <CardHeader>
                    <Skeleton className="h-6 w-32 bg-gray-700" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
                          <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-24 bg-gray-700" />
                            <Skeleton className="h-3 w-16 bg-gray-700" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar Skeleton */}
              <div className="space-y-6">
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-5 w-32 bg-gray-700" />
                    <Skeleton className="h-4 w-40 bg-gray-700" />
                    <Skeleton className="h-10 w-full bg-gray-700" />
                    <Skeleton className="h-8 w-full bg-gray-700" />
                  </CardContent>
                </Card>
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                  <CardHeader>
                    <Skeleton className="h-5 w-24 bg-gray-700" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-32 bg-gray-700" />
                        <Skeleton className="h-3 w-20 bg-gray-700" />
                      </div>
                    </div>
                    <Skeleton className="h-px w-full bg-gray-800" />
                    <Skeleton className="h-4 w-40 bg-gray-700" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
