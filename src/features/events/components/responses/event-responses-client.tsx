'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, FileText, MessageSquare, Search, MapPin, User, Clock, Tag, Download } from 'lucide-react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import React from 'react'

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { useEventFeedbackResponsesQuery, useEventQuery } from '../../hooks'
import type { FeedbackResponsesFilters } from '../../utils'
import { exportResponsesToExcel, formatDateForDisplay } from '../../utils'
import { EventNavigationDropdown } from '../shared/event-navigation-dropdown'

import { FeedbackResponsesList } from './feedback-responses-list'
import { FeedbackStatistics } from './feedback-statistics'
import { FieldStatisticsDetails } from './field-statistics-details'

interface EventResponsesClientProps {
  slug: string
}

export function EventResponsesClient({ slug }: EventResponsesClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Scroll animation hooks for parallax effect
  const { scrollY } = useScroll()
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.01])
  
  // Local state for export loading
  const [isExporting, setIsExporting] = React.useState(false)
  
  // Get filters from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const itemsPerPage = parseInt(searchParams.get('limit') || '10')
  const searchQuery = searchParams.get('search') || ''
  const sortBy = (searchParams.get('sortBy') as FeedbackResponsesFilters['sortBy']) || 'submittedAt'
  const sortOrder = (searchParams.get('sortOrder') as FeedbackResponsesFilters['sortOrder']) || 'desc'

  // Local state for filters (for immediate UI updates)
  const [localSearch, setLocalSearch] = React.useState(searchQuery)
  const [localSortBy, setLocalSortBy] = React.useState(sortBy)
  const [localSortOrder, setLocalSortOrder] = React.useState(sortOrder)

  // Build filters object
  const filters: FeedbackResponsesFilters = React.useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    sortBy: localSortBy,
    sortOrder: localSortOrder,
  }), [currentPage, itemsPerPage, searchQuery, localSortBy, localSortOrder])

  // Fetch data
  const { data: event, isLoading: isLoadingEvent } = useEventQuery(slug)
  const {
    data: responsesData,
    isLoading: isLoadingResponses,
    isError,
    error,
  } = useEventFeedbackResponsesQuery(slug, filters)

  // Handle search
  const handleSearch = React.useCallback((value: string) => {
    setLocalSearch(value)
    if (value !== searchQuery) {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('search', value)
      } else {
        params.delete('search')
      }
      params.set('page', '1') // Reset to first page when searching
      window.history.pushState(null, '', `?${params.toString()}`)
    }
  }, [searchQuery, searchParams])

  // Handle sort changes
  const handleSortChange = React.useCallback((field: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(field, value)
    params.set('page', '1') // Reset to first page when sorting
    window.history.pushState(null, '', `?${params.toString()}`)
    
    if (field === 'sortBy' && value) {
      setLocalSortBy(value as NonNullable<FeedbackResponsesFilters['sortBy']>)
    } else if (field === 'sortOrder' && value) {
      setLocalSortOrder(value as NonNullable<FeedbackResponsesFilters['sortOrder']>)
    }
  }, [searchParams])

  // Handle page changes (not needed since SimplePaginationControl handles it internally)
  // const handlePageChange = React.useCallback((page: number) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('page', page.toString())
  //   window.history.pushState(null, '', `?${params.toString()}`)
  // }, [searchParams])

  // Handle Excel export
  const handleExportToExcel = React.useCallback(async () => {
    if (!responsesData || !responsesData.responses.length) {
      showErrorToast('Export Failed', 'No responses available to export')
      return
    }

    setIsExporting(true)
    try {
      const result = exportResponsesToExcel({
        responses: responsesData.responses,
        form: responsesData.form,
        event: event
      })

      showSuccessToast(
        'Export Successful', 
        `Exported ${result.rowCount} responses with ${result.fieldCount} fields to ${result.filename}`
      )
    } catch (error) {
      console.error('Export error:', error)
      showErrorToast(
        'Export Failed', 
        error instanceof Error ? error.message : 'Failed to export responses to Excel'
      )
    } finally {
      setIsExporting(false)
    }
  }, [responsesData, event])

  const isLoading = isLoadingEvent || isLoadingResponses

  if (isLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Card className="border-purple-500/20 bg-gray-900/80 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-8 pb-8">
              <div className="text-center space-y-6">
                {/* Animated Icon */}
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"></div>
                  <div className="absolute inset-1 rounded-full bg-gray-900 flex items-center justify-center">
                    <MessageSquare className="h-7 w-7 text-purple-400 animate-pulse" />
                  </div>
                  <div className="absolute -inset-2 rounded-full border-2 border-purple-500/30 animate-spin"></div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white font-space-grotesk">
                    Gathering Feedback
                  </h3>
                  <div className="space-y-2">
                    <p className="text-purple-300 text-sm font-medium">
                      Analyzing event responses...
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      This might take a moment while we compile all the feedback data and statistics for you
                    </p>
                  </div>
                </div>

                {/* Progress Animation */}
                <div className="space-y-3">
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Loading Steps */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center space-x-2 text-purple-300">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Event Data</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300/70">
                      <div className="w-2 h-2 bg-purple-500/50 rounded-full animate-pulse delay-300"></div>
                      <span>Responses</span>
                    </div>
                    <div className="flex items-center space-x-2 text-purple-300/50">
                      <div className="w-2 h-2 bg-purple-500/30 rounded-full animate-pulse delay-700"></div>
                      <span>Statistics</span>
                    </div>
                  </div>
                </div>

                {/* Floating Particles Effect */}
                <div className="relative h-4 overflow-hidden">
                  <div className="absolute inset-0">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400/60 rounded-full animate-bounce"
                        style={{
                          left: `${15 + i * 12}%`,
                          animationDelay: `${i * 200}ms`,
                          animationDuration: '1.5s'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md border-red-500/80 bg-red-900/20 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold text-red-400/80 mb-2">Failed to Load Responses</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {error instanceof Error ? error.message : 'An unexpected error occurred'}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!responsesData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground text-sm">
                Unable to load response data for this event.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Parallax Hero Section */}
      {event && (
        <div className="relative">
          {/* Event Image with Parallax */}
          <motion.div 
            className="relative h-80 lg:h-96 overflow-hidden mt-12"
            style={{ 
              opacity: imageOpacity,
              scale: imageScale,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 0
            }}
          >
            <Image
              src={(typeof event.imageUrl === 'string' && event.imageUrl) 
                ? event.imageUrl 
                : '/events-placeholder.png'
              }
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </motion.div>

          {/* Content Container with proper z-index */}
          <div className="relative z-10 h-80 lg:h-96">
            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {/* Navigation and Feedback Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <EventNavigationDropdown 
                      eventSlug={slug}
                      currentPage="responses"
                      onBack={() => router.push('/events/my-events')}
                    />

                    <div className="flex items-center space-x-2 text-sm text-purple-400 bg-purple-500/20 backdrop-blur-sm p-2 px-4 border border-purple-500/30 rounded-md">
                      <Calendar className="h-4 w-4" />
                      <span>Event Feedback</span>
                    </div>
                  </div>
                </div>

                {/* Title and Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold font-space-grotesk tracking-tight text-white mb-4">
                    {event.title} - <span className='text-purple-400'>Responses</span>
                  </h1>
                  <p className="text-lg text-gray-300 max-w-4xl leading-relaxed">
                    View and analyze feedback responses submitted by event attendees
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Positioned to start after hero */}
      <div className="relative z-20 bg-gray-950 mt-0">
        <div className="space-y-6 p-6 lg:p-8">
          {/* Event Details Section */}
          {event && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b pb-6 border-gray-800"
            >
              <div className="max-w-7xl mx-auto space-y-4">
                {/* Event Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Event Type */}
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Event Type</p>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                        {event.type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  {/* Start Date */}
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Start Date</p>
                      <p className="text-sm text-white font-medium">
                        {formatDateForDisplay(event.startDate).date}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDateForDisplay(event.startDate).time}
                      </p>
                    </div>
                  </div>

                  {/* End Date */}
                  {event.endDate && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">End Date</p>
                        <p className="text-sm text-white font-medium">
                          {formatDateForDisplay(String(event.endDate)).date}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDateForDisplay(String(event.endDate)).time}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Organized By</p>
                      <p className="text-sm text-white font-medium truncate">
                        {event.organizer?.firstName && event.organizer?.lastName 
                          ? `${event.organizer.firstName} ${event.organizer.lastName}`
                          : event.organizer?.username || 'Unknown'
                        }
                      </p>
                      {event.organizer?.email && (
                        <p className="text-xs text-gray-400 truncate">
                          {event.organizer.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                {event.description && (
                  <div className="mt-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Description</p>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {String(event.description)}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-gray-800/50 border-gray-700 text-gray-300 text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          <div className="max-w-7xl mx-auto space-y-6">
            {/* Statistics Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FeedbackStatistics 
                statistics={responsesData.statistics}
                className="mb-6"
              />
            </motion.div>

            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(localSearch)
                      }
                    }}
                    className="pl-10 border-gray-800 border bg-gray-900 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex gap-2 *:data-slot=select-value]:line-clamp-1 *:data-slot=select-value]:flex *:data-slot=select-value]:items-center *:data-slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
                  <Select value={localSortBy} onValueChange={(value) => handleSortChange('sortBy', value)}>
                    <SelectTrigger className="w-[140px] bg-gray-900 border border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="submittedAt">Date</SelectItem>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="username">Username</SelectItem>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="firstName">First Name</SelectItem>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="lastName">Last Name</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={localSortOrder} onValueChange={(value) => handleSortChange('sortOrder', value)}>
                    <SelectTrigger className="w-[100px] bg-gray-900 border border-gray-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="desc">Newest</SelectItem>
                      <SelectItem className='text-gray-300 hover:bg-purple-500/10 hover:text-purple-500 transition-colors duration-200' value="asc">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                {/* Excel Export Button */}
                <Button 
                  onClick={handleExportToExcel}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none bg-green-600/10 border-green-600/30 text-green-400 hover:bg-green-600/20 hover:text-green-300 transition-colors"
                  disabled={!responsesData?.responses?.length || isExporting}
                >
                  <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
                  {isExporting ? 'Exporting...' : 'Export Excel'}
                </Button>

                {/* Apply Filters Button */}
                {(localSearch !== searchQuery || localSortBy !== sortBy || localSortOrder !== sortOrder) && (
                  <Button 
                    onClick={() => handleSearch(localSearch)}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    Apply Filters
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Split Screen Layout: Field Statistics (Left) | User Responses (Right) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Left Side - Field Statistics */}
              <div className="space-y-4">
                <FieldStatisticsDetails 
                  statistics={responsesData.statistics}
                />
              </div>

              {/* Right Side - User Responses */}
              <div className="space-y-4">
                <FeedbackResponsesList 
                  responses={responsesData.responses}
                  form={responsesData.form}
                  isLoading={isLoadingResponses}
                />
              </div>
            </motion.div>

            {/* Pagination */}
            {responsesData.meta && responsesData.meta.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-6"
              >
                <SimplePaginationControl
                  currentPage={responsesData.meta.page}
                  currentLimit={responsesData.meta.limit}
                  total={responsesData.meta.total}
                  showFirstLast
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
