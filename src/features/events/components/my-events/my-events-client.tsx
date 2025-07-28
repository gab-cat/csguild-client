'use client'

import { motion } from 'framer-motion'
import { Calendar, Trophy, Search, Sparkles, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePagination } from '@/hooks/use-pagination'

import { useMyAttendedEventsQuery, useMyCreatedEventsQuery } from '../../hooks'
import { toEventCard } from '../../types'
import { useEventFilters } from '../events/event-filters'
import { EventFilters } from '../events/event-filters'

import { AttendedEventsTable } from './attended-events-table'
import { EventsTable } from './events-table'


export function MyEventsClient() {
  const [activeTab, setActiveTab] = React.useState('attended')

  // Pagination setup with usePagination hook
  const attendedPagination = usePagination({
    defaultPage: 1,
    defaultLimit: 12,
  })

  const createdPagination = usePagination({
    defaultPage: 1,
    defaultLimit: 12,
  })

  // Filters for attended events
  const { 
    filters: attendedFilters, 
    updateFilters: updateAttendedFilters, 
    hasActiveFilters: hasActiveAttendedFilters 
  } = useEventFilters()
  
  // Filters for created events  
  const { 
    filters: createdFilters, 
    updateFilters: updateCreatedFilters, 
    hasActiveFilters: hasActiveCreatedFilters 
  } = useEventFilters()

  // Transform filters for API calls
  const attendedApiFilters = React.useMemo(() => {
    const { tags, ...rest } = attendedFilters
    return {
      ...rest,
      tags: tags && tags.length > 0 ? tags.join(',') : undefined,
      page: attendedPagination.page,
      limit: attendedPagination.limit,
    }
  }, [attendedFilters, attendedPagination.page, attendedPagination.limit])

  const createdApiFilters = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags, organizerId, organizerSlug, ...rest } = createdFilters
    // Remove organizer filters since we're showing user's own events
    return {
      ...rest,
      tags: tags && tags.length > 0 ? tags.join(',') : undefined,
      page: createdPagination.page,
      limit: createdPagination.limit,
    }
  }, [createdFilters, createdPagination.page, createdPagination.limit])

  // Query attended events
  const {
    data: attendedEventsResponse,
    isLoading: isLoadingAttended,
    isError: isErrorAttended,
    error: attendedError,
  } = useMyAttendedEventsQuery(attendedApiFilters)

  // Query created events
  const {
    data: createdEventsResponse,
    isLoading: isLoadingCreated,
    isError: isErrorCreated,
    error: createdError,
  } = useMyCreatedEventsQuery(createdApiFilters)

  const attendedEvents = React.useMemo(() => {
    if (!attendedEventsResponse?.events) return []
    return attendedEventsResponse.events.map(event => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attendedEvent = event as any
      return {
        ...toEventCard(event),
        attendeeInfo: attendedEvent.attendeeInfo,
        minimumAttendanceMinutes: attendedEvent.minimumAttendanceMinutes
      }
    })
  }, [attendedEventsResponse])

  const createdEvents = React.useMemo(() => {
    if (!createdEventsResponse?.events) return []
    return createdEventsResponse.events.map(event => toEventCard(event))
  }, [createdEventsResponse])

  const renderEventsContent = (
    events: ReturnType<typeof toEventCard>[],
    isLoading: boolean,
    isError: boolean,
    error: Error | null,
    hasActiveFilters: boolean,
    totalItems: number,
    emptyTitle: string,
    emptyDescription: string,
    emptyAction?: React.ReactNode,
    showEditActions: boolean = false,
    isAttendedEvents: boolean = false
  ) => {
    if (isError) {
      return (
        <Card className="bg-gray-900/50 border-red-500/20">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-red-400">Failed to load events</h3>
              <p className="text-gray-400">
                {error?.message || 'An unexpected error occurred while loading events.'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-red-500/20 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="ml-2 text-gray-400">Loading events...</span>
        </div>
      )
    }

    if (events.length > 0) {
      return (
        <div className="space-y-6">
          {isAttendedEvents ? (
            <AttendedEventsTable 
              events={events} 
              isLoading={isLoading}
            />
          ) : (
            <EventsTable 
              events={events} 
              showActions={true} 
              showEditActions={showEditActions}
            />
          )}
          
          {totalItems > (isAttendedEvents ? attendedPagination.limit : createdPagination.limit) && (
            <div className="flex justify-center">
              <SimplePaginationControl
                currentPage={isAttendedEvents ? attendedPagination.page : createdPagination.page}
                currentLimit={isAttendedEvents ? attendedPagination.limit : createdPagination.limit}
                total={totalItems}
                showLimitSelector={true}
                limitOptions={[6, 12, 24, 48]}
                className="justify-between"
              />
            </div>
          )}
        </div>
      )
    }

    return (
      <Card className="bg-gray-900/30 border-gray-800">
        <CardContent className="p-16 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="relative">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-500/20 rounded-full animate-pulse animation-delay-2000" />
            </div>
            
            <h3 className="text-2xl font-semibold text-white">{emptyTitle}</h3>
            <p className="text-gray-400 text-lg">{emptyDescription}</p>
            
            {emptyAction}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Events</h1>
              <p className="text-gray-400">
                Manage your attended and created events
              </p>
            </div>
            <Button 
              asChild 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Link href="/events/create">
                <Plus className="h-5 w-5 mr-2" />
                Create Event
              </Link>
            </Button>
          </div>
        </motion.div>

        <div className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {/* Tab Navigation */}
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
                <TabsTrigger 
                  value="attended" 
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Trophy className="h-4 w-4" />
                  Attended Events
                  {attendedEventsResponse?.meta?.total ? (
                    <span className="ml-1 px-2 py-0.5 bg-gray-800/50 rounded-full text-xs">
                      {attendedEventsResponse.meta.total}
                    </span>
                  ) : null}
                </TabsTrigger>
                <TabsTrigger 
                  value="created"
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <Calendar className="h-4 w-4" />
                  Created Events
                  {createdEventsResponse?.meta?.total ? (
                    <span className="ml-1 px-2 py-0.5 bg-gray-800/50 rounded-full text-xs">
                      {createdEventsResponse.meta.total}
                    </span>
                  ) : null}
                </TabsTrigger>
              </TabsList>
            </div>            {/* Attended Events Tab */}
            <TabsContent value="attended" className="space-y-8">
              {/* Filters */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-lg">
                <EventFilters
                  filters={attendedFilters}
                  onFiltersChange={updateAttendedFilters}
                  availableTags={[]} // TODO: Get from API
                  availableOrganizers={[]} // TODO: Get from API
                />
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {isLoadingAttended ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Loading attended events...
                    </div>
                  ) : attendedEvents.length > 0 ? (
                    `${attendedEventsResponse?.meta?.total || 0} attended event${attendedEventsResponse?.meta?.total !== 1 ? 's' : ''}`
                  ) : hasActiveAttendedFilters ? (
                    'No attended events match your filters'
                  ) : (
                    'No attended events yet'
                  )}
                </div>
              
                {!isLoadingAttended && attendedEvents.length > 0 && (
                  <div className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  Page {attendedPagination.page} of {Math.ceil((attendedEventsResponse?.meta?.total || 0) / attendedPagination.limit)}
                  </div>
                )}
              </div>

              {/* Events Content */}
              {renderEventsContent(
                attendedEvents,
                isLoadingAttended,
                isErrorAttended,
                attendedError,
                hasActiveAttendedFilters,
                attendedEventsResponse?.meta?.total || 0,
                'No attended events yet',
                'Start attending events to see them here. Join upcoming events in your community!',
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/events">
                    <Search className="h-5 w-5 mr-2" />
                  Browse Events
                  </Link>
                </Button>,
                false, // showEditActions
                true // isAttendedEvents
              )}
            </TabsContent>

            {/* Created Events Tab */}
            <TabsContent value="created" className="space-y-8">
              {/* Filters */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-lg">
                <EventFilters
                  filters={createdFilters}
                  onFiltersChange={updateCreatedFilters}
                  availableTags={[]} // TODO: Get from API
                  availableOrganizers={[]} // Hide organizer filter for created events
                />
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {isLoadingCreated ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    Loading your events...
                    </div>
                  ) : createdEvents.length > 0 ? (
                    `${createdEventsResponse?.meta?.total || 0} created event${createdEventsResponse?.meta?.total !== 1 ? 's' : ''}`
                  ) : hasActiveCreatedFilters ? (
                    'No created events match your filters'
                  ) : (
                    'No created events yet'
                  )}
                </div>
              
                {!isLoadingCreated && createdEvents.length > 0 && (
                  <div className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                  Page {createdPagination.page} of {Math.ceil((createdEventsResponse?.meta?.total || 0) / createdPagination.limit)}
                  </div>
                )}
              </div>

              {/* Events Content */}
              {renderEventsContent(
                createdEvents,
                isLoadingCreated,
                isErrorCreated,
                createdError,
                hasActiveCreatedFilters,
                createdEventsResponse?.meta?.total || 0,
                'No created events yet',
                'Start creating events to build your community. Share your knowledge and connect with others!',
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/events/create">
                    <Sparkles className="h-5 w-5 mr-2" />
                  Create Your First Event
                  </Link>
                </Button>,
                true, // showEditActions for created events
                false // isAttendedEvents
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
