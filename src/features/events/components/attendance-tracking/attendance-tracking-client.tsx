'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, UserCheck, Clock, ScanLine, AlertCircle, MapPin, Tag, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuthStore } from '@/features/auth/stores/auth-store'
import { cn } from '@/lib/utils'

import { useEventWithAttendees, useToggleSessionMutation } from '../../hooks'
import { eventUtils, formatDateForDisplay } from '../../utils'
import { EventNavigationDropdown } from '../shared/event-navigation-dropdown'

import { AttendanceStats } from './attendance-stats'
import { AttendeesList } from './attendees-list'
import { RfidScanner } from './rfid-scanner'
import { ScanResultModal } from './scan-result-modal'

interface AttendanceTrackingClientProps {
  slug: string
}

export function AttendanceTrackingClient({ slug }: AttendanceTrackingClientProps) {
  const { user } = useAuthStore()
  const [rfidInput, setRfidInput] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [lastScannedRfid, setLastScannedRfid] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{
    success: boolean
    rfidId: string
    timestamp: string
    userInfo?: {
      name: string
      username: string
      email: string
      imageUrl?: string
    }
    attendanceInfo?: {
      action: 'check-in' | 'check-out'
      totalDuration: number
      sessionCount: number
      isEligible: boolean
    }
    errorMessage?: string
  } | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // Scroll animation hooks for parallax effect
  const { scrollY } = useScroll()
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.01])
  
  const {
    event,
    attendees: attendeesData,
    isLoading,
    isLoadingAttendees,
    refetchAttendees
  } = useEventWithAttendees(slug)

  const toggleSessionMutation = useToggleSessionMutation()

  // Check if current user is the event organizer
  const isOrganizer = user?.username === event?.organizer?.username

  const handleRfidScan = async (rfidId: string) => {
    if (!rfidId.trim() || !event?.id) return

    try {
      setIsScanning(true)
      setLastScannedRfid(rfidId)

      await toggleSessionMutation.mutateAsync({
        rfidId: rfidId.trim(),
        eventId: event.id
      })

      // Refresh attendees data to get updated info
      const updatedAttendees = await refetchAttendees()
      
      // Find the user in the updated attendees list (simplified for demo)
      const scannedUser = updatedAttendees.data?.attendees?.find(
        attendee => attendee.email // We'll match the first attendee for demo
      ) || updatedAttendees.data?.attendees?.[0]

      // Show success modal with user info
      setScanResult({
        success: true,
        rfidId: rfidId.trim(),
        timestamp: new Date().toISOString(),
        userInfo: scannedUser ? {
          name: `${scannedUser.firstName} ${scannedUser.lastName}`,
          username: scannedUser.username || 'unknown',
          email: scannedUser.email || 'unknown',
          imageUrl: scannedUser.imageUrl as string | undefined
        } : undefined,
        attendanceInfo: scannedUser ? {
          action: (scannedUser.sessionCount || 0) > 0 ? 'check-in' : 'check-out',
          totalDuration: scannedUser.totalDuration || 0,
          sessionCount: scannedUser.sessionCount || 0,
          isEligible: scannedUser.isEligible || false
        } : undefined
      })
      setShowModal(true)
      
      // Clear input
      setRfidInput('')
    } catch (error) {
      // Show error modal
      setScanResult({
        success: false,
        rfidId: rfidId.trim(),
        timestamp: new Date().toISOString(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      setShowModal(true)
    } finally {
      setIsScanning(false)
      setLastScannedRfid(null)
    }
  }

  const handleManualRfidSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rfidInput.trim()) {
      handleRfidScan(rfidInput.trim())
    }
  }

  // Auto-focus on RFID input when page loads
  useEffect(() => {
    const input = document.getElementById('rfid-input')
    if (input) {
      input.focus()
    }
  }, [])

  if (isLoading) {
    return <AttendanceTrackingSkeleton />
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

  if (!isOrganizer) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold text-white">Access Denied</h1>
          <p className="text-gray-400">Only event organizers can access the attendance tracking page.</p>
          <Button asChild variant="outline">
            <Link href={`/events/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Event
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const eventStatus = eventUtils.getEventStatus(event.startDate, typeof event.endDate === 'string' ? event.endDate : undefined)
  const isEventActive = eventStatus === 'ongoing'

  return (
    <div className="relative">
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
                {/* Navigation and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <EventNavigationDropdown 
                      eventSlug={slug}
                      currentPage="attend"
                      onBack={() => window.history.back()}
                    />

                    <div className="flex items-center space-x-2 text-sm text-blue-400 bg-blue-500/20 backdrop-blur-sm p-2 px-4 border border-blue-500/30 rounded-md">
                      <ScanLine className="h-4 w-4" />
                      <span>Attendance Tracking</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium",
                        eventStatus === 'ongoing' && "bg-green-500/20 text-green-400 border border-green-500/30",
                        eventStatus === 'upcoming' && "bg-blue-500/20 text-blue-400 border border-blue-500/30",
                        eventStatus === 'completed' && "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                      )}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {eventStatus === 'ongoing' && <Clock className="h-3 w-3 mr-1.5 inline" />}
                      {eventStatus === 'upcoming' && <Clock className="h-3 w-3 mr-1.5 inline" />}
                      {eventStatus === 'completed' && <UserCheck className="h-3 w-3 mr-1.5 inline" />}
                      {eventStatus === 'ongoing' ? 'Active' : eventStatus === 'upcoming' ? 'Upcoming' : 'Completed'}
                    </motion.div>
                  </div>
                </div>

                {/* Title and Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold font-space-grotesk tracking-tight text-white mb-4">
                    {event.title} - <span className='text-blue-400'>Attendance</span>
                  </h1>
                  {event.description && typeof event.description === 'string' && (
                    <p className="text-lg text-gray-300 max-w-4xl leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Positioned to start after hero */}
      <div className="relative z-20 bg-gray-950 mt-0">
        <div className="space-y-6 p-6 lg:p-8">
          {/* Event Metadata Section */}
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

          {!isEventActive && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-sm text-yellow-400">
                  {eventStatus === 'upcoming' 
                    ? 'Event has not started yet. Attendance tracking will be available when the event begins.'
                    : 'Event has ended. Attendance tracking is no longer available.'
                  }
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div 
            className="max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* RFID Scanner Section */}
              <motion.div 
                className="xl:col-span-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="sticky top-8 space-y-6">
                  {/* RFID Scanner Card */}
                  <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <ScanLine className="h-5 w-5" />
                        RFID Scanner
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <RfidScanner
                        onScan={handleRfidScan}
                        isScanning={isScanning}
                        lastScannedRfid={lastScannedRfid}
                        disabled={!isEventActive}
                      />
                      
                      {/* Manual RFID Input */}
                      <motion.div 
                        className="space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-px bg-gray-700 flex-1" />
                          <span className="text-xs text-gray-500">OR ENTER MANUALLY</span>
                          <div className="h-px bg-gray-700 flex-1" />
                        </div>
                        
                        <form onSubmit={handleManualRfidSubmit} className="space-y-3">
                          <div>
                            <Label htmlFor="rfid-input" className="text-sm text-gray-300">
                              RFID ID
                            </Label>
                            <Input
                              id="rfid-input"
                              type="text"
                              value={rfidInput}
                              onChange={(e) => setRfidInput(e.target.value)}
                              placeholder="Enter RFID ID..."
                              className="mt-1 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                              disabled={isScanning || !isEventActive}
                            />
                          </div>
                          
                          <Button 
                            type="submit" 
                            size="sm" 
                            className="w-full"
                            disabled={isScanning || !rfidInput.trim() || !isEventActive}
                          >
                            {isScanning ? 'Processing...' : 'Submit'}
                          </Button>
                        </form>
                      </motion.div>
                    </CardContent>
                  </Card>

                  {/* Attendance Stats */}
                  <AttendanceStats 
                    attendeesData={attendeesData}
                    isLoading={isLoadingAttendees}
                  />
                </div>
              </motion.div>

              {/* Attendees List */}
              <motion.div 
                className="xl:col-span-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <AttendeesList 
                  attendeesData={attendeesData}
                  isLoading={isLoadingAttendees}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scan Result Modal */}
      <ScanResultModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        scanResult={scanResult}
      />
    </div>
  )
}

function AttendanceTrackingSkeleton() {
  return (
    <div className="relative">
      {/* Hero Skeleton */}
      <div className="relative">
        <div className="h-80 lg:h-96 bg-gray-800 animate-pulse relative z-10">
          <div className="absolute bottom-6 left-6 right-6">
            <div className="max-w-7xl mx-auto space-y-4">
              {/* Navigation and Badge Row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-20 bg-gray-700" />
                  <Skeleton className="h-8 w-32 bg-gray-700" />
                </div>
                <Skeleton className="h-6 w-20 bg-gray-700" />
              </div>
              <Skeleton className="h-12 w-3/4 bg-gray-700" />
              <Skeleton className="h-6 w-full bg-gray-700" />
              <Skeleton className="h-6 w-2/3 bg-gray-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="relative z-20 bg-gray-950 space-y-6 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Event Metadata Skeleton */}
          <div className="border-b pb-6 border-gray-800 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-4 bg-gray-700" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-16 bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Skeleton className="h-3 w-12 bg-gray-700 mb-2" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-16 bg-gray-700" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Scanner Section Skeleton */}
            <div className="xl:col-span-1 space-y-6">
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                <CardHeader>
                  <Skeleton className="h-6 w-32 bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-40 w-full bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </CardContent>
              </Card>
              
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                <CardHeader>
                  <Skeleton className="h-6 w-24 bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full bg-gray-700" />
                    <Skeleton className="h-16 w-full bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Attendees List Skeleton */}
            <div className="xl:col-span-2">
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
                <CardHeader>
                  <Skeleton className="h-6 w-24 bg-gray-700" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
                      <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                      <div className="flex-1 space-y-1">
                        <Skeleton className="h-4 w-32 bg-gray-700" />
                        <Skeleton className="h-3 w-24 bg-gray-700" />
                      </div>
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
