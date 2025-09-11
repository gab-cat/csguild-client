'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { Calendar, Clock, ExternalLink, MessageSquare, CheckCircle, XCircle, Award } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api } from '@/lib/convex'
import { showInfoToast } from '@/lib/toast'

import { toEventCard } from '../../types'
import { getEventStatusDetails } from '../../utils'

interface AttendedEvent extends ReturnType<typeof toEventCard> {
  myAttendance?: {
    totalDuration: number
    isEligible: boolean
    registeredAt: number
  }
  minimumAttendanceMinutes?: number | null
  hasSubmittedFeedback?: boolean
  hasRatedOrganizer?: boolean
}

interface FeedbackStatusCellProps {
  event: AttendedEvent
  isEligible: boolean
}

function FeedbackStatusCell({ event, isEligible }: FeedbackStatusCellProps) {
  // @ts-ignore - Complex type inference issue with useQuery
  const feedbackStatus = useQuery(api.events.checkFeedbackStatus, { eventSlug: event.slug })
  const isLoading = feedbackStatus === undefined
  
  // Debug logging
  console.log('FeedbackStatusCell Debug:', {
    eventSlug: event.slug,
    isEligible,
    feedbackStatus,
    isLoading,
    canSubmitFeedback: feedbackStatus?.canSubmitFeedback,
    reason: feedbackStatus?.reason,
    hasSubmittedFeedback: feedbackStatus?.hasSubmittedFeedback
  })
  
  const handleRequestCertification = () => {
    showInfoToast('Certification feature coming soon!')
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 text-sm">Checking...</span>
      </div>
    )
  }
  
  if (!isEligible) {
    return (
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-red-400" />
        <span className="text-red-400 text-sm">Not eligible</span>
      </div>
    )
  }
  
  if (!feedbackStatus?.canSubmitFeedback) {
    // If user has already submitted feedback, show certification button
    if (feedbackStatus?.hasSubmittedFeedback) {
      return (
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleRequestCertification}
            className="border-green-700 text-green-300 hover:bg-green-800/20"
          >
            <Award className="w-4 h-4 mr-1" />
            Request Certification
          </Button>
        </div>
      )
    }
    
    // Otherwise show the reason
    return (
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-500 rounded-full" />
        <span className="text-gray-400 text-sm">
          {feedbackStatus?.reason || 'No feedback form'}
        </span>
      </div>
    )
  }
  
  
  return (
    <div className="flex items-center gap-2">
      <Button 
        size="sm" 
        variant="outline" 
        asChild 
        className="border-purple-700 text-purple-300 hover:bg-purple-800/20"
      >
        <Link href={`/events/${event.slug}/feedback`}>
          <MessageSquare className="w-4 h-4 mr-1" />
          Take Survey
        </Link>
      </Button>
    </div>
  )
}

interface AttendedEventsTableProps {
  events: AttendedEvent[]
  isLoading?: boolean
}

export function AttendedEventsTable({ events, isLoading }: AttendedEventsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (60 * 1000))
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}m`
  }

  const getEligibilityStatus = useCallback((myAttendance?: AttendedEvent['myAttendance'], eventEndDate?: string, minimumAttendanceMinutes?: number | null) => {
    const now = new Date()
    const endDate = eventEndDate ? new Date(eventEndDate) : null
    const isCompleted = endDate ? now > endDate : false
    
    // If no attendance data, assume eligible for completed events
    if (!myAttendance) {
      return { 
        eligible: isCompleted, 
        reason: isCompleted ? 'Event completed - feedback available' : 'Attendance data not available' 
      }
    }

    const { totalDuration, isEligible } = myAttendance
    const minimumMinutes = minimumAttendanceMinutes || 0
    const minimumMilliseconds = minimumMinutes * 60 * 1000

    // If the event is completed, always show as eligible for feedback
    if (isCompleted) {
      return { 
        eligible: true, 
        reason: isEligible 
          ? `Met requirement (${formatDuration(totalDuration)}/${formatDuration(minimumMilliseconds)})`
          : 'Event completed - feedback available'
      }
    }

    if (minimumMinutes === 0) {
      return { eligible: true, reason: 'No minimum requirement' }
    }

    return {
      eligible: isEligible,
      reason: isEligible 
        ? `Met requirement (${formatDuration(totalDuration)}/${formatDuration(minimumMilliseconds)})`
        : `Need ${formatDuration(minimumMilliseconds - totalDuration)} more`
    }
  }, [])

  const processedEvents = useMemo(() => {
    return events.map(event => {
      const eligibilityStatus = getEligibilityStatus(event.myAttendance, event.endDate, event.minimumAttendanceMinutes)
      
      // Debug logging
      console.log('Processed Event Debug:', {
        eventTitle: event.title,
        eventSlug: event.slug,
        myAttendance: event.myAttendance,
        minimumAttendanceMinutes: event.minimumAttendanceMinutes,
        eligibilityStatus,
        hasSubmittedFeedback: event.hasSubmittedFeedback,
        hasRatedOrganizer: event.hasRatedOrganizer
      })
      
      return {
        ...event,
        eligibilityStatus
      }
    })
  }, [events, getEligibilityStatus])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8">
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400">Loading attended events...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <motion.div 
                className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              >
                <Calendar className="h-8 w-8 text-purple-400" />
              </motion.div>
              <motion.h3 
                className="text-lg font-semibold text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                No attended events
              </motion.h3>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                You haven&apos;t attended any events yet. Start attending events to see them here!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/events">
                    Browse Events
                  </Link>
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Attended Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300 font-semibold">Event</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Attendance</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Eligibility</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Feedback</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {processedEvents.map((event, index) => {
                  const startDateInfo = formatDate(event.startDate)
                  const { status, color } = getEventStatusDetails(event.startDate, event.endDate)
                  const { eligible, reason } = event.eligibilityStatus
                  
                  return (
                    <TableRow 
                      key={event.id} 
                      className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                    >
                      <TableCell className="max-w-xs">
                        <motion.div 
                          className="space-y-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                        >
                          <h4 className="text-white font-medium line-clamp-1">{event.title}</h4>
                          <p className="text-gray-400 text-sm">
                            by {event.organizer.firstName} {event.organizer.lastName}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {event.tags && event.tags.length > 0 ? (
                              event.tags.slice(0, 2).map((tag, tagIndex) => (
                                <motion.div
                                  key={tagIndex}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    duration: 0.2, 
                                    delay: index * 0.05 + tagIndex * 0.05 + 0.1 
                                  }}
                                >
                                  <Badge 
                                    variant="outline" 
                                    className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                </motion.div>
                              ))
                            ) : null}
                          </div>
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div 
                          className="flex items-center gap-2 text-gray-300"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                        >
                          <Calendar className="w-4 h-4" />
                          <div className="text-sm">
                            <div>{startDateInfo.day}, {startDateInfo.date}</div>
                            <div className="text-gray-400">{startDateInfo.time}</div>
                          </div>
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 + 0.15 }}
                        >
                          <Badge variant="outline" className={color}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div className="text-sm">
                            {event.myAttendance ? (
                              <>
                                <div className="text-white font-medium">
                                  {formatDuration(event.myAttendance.totalDuration)}
                                </div>
                                <div className="text-gray-400">
                                  Registered {new Date(event.myAttendance.registeredAt).toLocaleDateString()}
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-gray-400">
                                  Attendance tracking
                                </div>
                                <div className="text-gray-500 text-xs">
                                  Not available
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.25 }}
                        >
                          {eligible ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <div className="text-sm">
                            <div className={eligible ? 'text-green-400' : 'text-red-400'}>
                              {eligible ? 'Eligible' : 'Not Eligible'}
                            </div>
                            <div className="text-gray-400 text-xs">
                              {reason}
                            </div>
                          </div>
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                        >
                          <FeedbackStatusCell event={event} isEligible={eligible} />
                        </motion.div>
                      </TableCell>
                      
                      <TableCell>
                        <motion.div 
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 + 0.35 }}
                        >
                          <Button 
                            size="sm" 
                            variant="outline" 
                            asChild 
                            className="border-gray-700 text-gray-300 hover:bg-gray-800"
                          >
                            <Link href={`/events/${event.slug}`}>
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View
                            </Link>
                          </Button>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
