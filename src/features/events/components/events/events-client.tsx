'use client'

import { motion } from 'framer-motion'
import { Loader2, Search, Calendar, Link, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { api, useQuery } from '@/lib/convex'

import { toEventCardFromConvex } from '../../types'

import { EventCard, EventCardSkeleton } from './event-card'
import { EventFilters, useEventFilters } from './event-filters'
import { EventsHeader } from './events-header'

export function EventsClient() {
  const { filters, updateFilters, hasActiveFilters } = useEventFilters()
  const searchParams = useSearchParams()
  
  // Get pagination from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const itemsPerPage = parseInt(searchParams.get('limit') || '12')

  // Transform filters for Convex query
  const convexFilters = React.useMemo(() => {
    const { tags, ...rest } = filters
    return {
      ...rest,
      tags: tags && tags.length > 0 ? tags.join(',') : undefined,
      page: currentPage,
      limit: itemsPerPage,
    }
  }, [filters, currentPage, itemsPerPage])

  const eventsResponse = useQuery(api.events.getEvents, convexFilters)

  const events = React.useMemo(() => {
    if (!eventsResponse?.data) return []
    return eventsResponse.data.map(toEventCardFromConvex)
  }, [eventsResponse])

  const totalItems = eventsResponse?.meta?.total || 0
  const isLoading = eventsResponse === undefined
  const isError = eventsResponse === null

  const handleClearFilters = React.useCallback(() => {
    updateFilters({
      search: '',
      status: undefined,
      organizerId: undefined,
      tags: undefined,
    })
  }, [updateFilters])

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20 pointer-events-none" />
        
      
      {/* Events Header */}
      <div className="relative container mx-auto px-4 pt-16 pb-8">
        <EventsHeader />
      </div>

      <div className="relative container mx-auto px-4 py-8 space-y-8">
        {/* Filters Section */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 shadow-lg">
          <EventFilters
            filters={filters}
            onFiltersChange={updateFilters}
            availableTags={[]} // TODO: Get from API
            availableOrganizers={[]} // TODO: Get from API
          />
        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="text-gray-400 text-sm">
            {totalItems > 0 ? (
              <>
                Showing {events.length} of {totalItems} events
                {currentPage && currentPage > 1 && ` (page ${currentPage})`}
                {filters.search && ` for "${filters.search}"`}
                {filters.status && ` with status "${filters.status}"`}
                {filters.tags?.length && ` tagged with "${filters.tags.join(', ')}"`}
              </>
            ) : hasActiveFilters ? (
              'No events match your current filters'
            ) : (
              'No events available yet'
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading events...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="bg-gray-900/50 border-red-500/20">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400">Failed to load events</h3>
                <p className="text-gray-400">
                  An unexpected error occurred while loading events.
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
        )}

        {/* Events Grid with Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : !isError && events.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                showActions={true}
                index={index}
              />
            ))}
          </motion.div>
        ) : null}

        {/* Empty State */}
        {!isLoading && !isError && events.length === 0 && (
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
                
                {hasActiveFilters ? (
                  <>
                    <h3 className="text-2xl font-semibold text-white">No events found</h3>
                    <p className="text-gray-400 text-lg">
                      Try adjusting your filters or search terms to find more events.
                    </p>
                    <Button 
                      onClick={handleClearFilters}
                      variant="outline"
                      className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                    >
                      Clear All Filters
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold text-white">No events yet</h3>
                    <p className="text-gray-400 text-lg">
                      Be the first to create an event in our community!
                    </p>
                    <Button 
                      asChild 
                      className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/events/create">
                        <Plus className="h-5 w-5 mr-2" />
                        Create Your First Event
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pagination Control */}
        {!isLoading && !isError && events.length > 0 && totalItems > itemsPerPage && (
          <div className="mt-8">
            <SimplePaginationControl 
              currentPage={currentPage}
              currentLimit={itemsPerPage}
              total={totalItems}
              showLimitSelector={true}
              limitOptions={[6, 12, 24, 48]}
              className="justify-between"
            />
          </div>
        )}
      </div>
    </div>
  )
}
