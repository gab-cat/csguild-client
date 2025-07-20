import { motion } from 'framer-motion'
import { Calendar, Clock, Users, MapPin, Eye, Globe, Layers } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import type { EventCardType } from '../../types'
import { eventUtils } from '../../utils'

interface EventCardProps {
  event: EventCardType
  showActions?: boolean
  className?: string
  index?: number
}

export function EventCard({ event, showActions = false, className, index = 0 }: EventCardProps) {
  const eventStatus = eventUtils.getEventStatus(event.startDate, event.endDate)
  const eventTypeInfo = eventUtils.getEventTypeInfo(event.type)
  const isUpcoming = eventStatus === 'upcoming'
  const isOngoing = eventStatus === 'ongoing'
  const isCompleted = eventStatus === 'completed'

  const statusConfig = {
    upcoming: {
      label: 'Upcoming',
      className: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Calendar,
    },
    ongoing: {
      label: 'Live',
      className: 'bg-green-500/20 text-green-300 border-green-500/30',
      icon: null, // Special handling for live indicator
    },
    completed: {
      label: 'Completed',
      className: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      icon: Clock,
    },
  }

  const currentStatus = statusConfig[eventStatus]
  const StatusIcon = currentStatus.icon

  // Get the appropriate icon for event type
  const getEventTypeIcon = () => {
    switch (eventTypeInfo.icon) {
    case 'MapPin':
      return MapPin
    case 'Globe':
      return Globe
    case 'Layers':
      return Layers
    default:
      return Calendar
    }
  }

  const EventTypeIcon = getEventTypeIcon()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Card className={`group h-full transition-all pt-0 duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-purple-500/50 overflow-hidden ${className}`}>
        {/* Image Header */}
        {event.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <Image
              src={event.imageUrl ?? '/events-placeholder.png'}
              alt={event.title}
              fill
              className="object-cover transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Status Badge Overlay */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className={`${currentStatus.className} backdrop-blur-sm border`}>
                {isOngoing ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {currentStatus.label}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {StatusIcon && <StatusIcon className="h-3 w-3" />}
                    {currentStatus.label}
                  </div>
                )}
              </Badge>
            </div>

            {/* Quick Actions Overlay */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button 
                asChild 
                size="sm" 
                variant="secondary"
                className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/90 border-gray-700"
              >
                <Link href={`/events/${event.slug}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        <CardHeader className={`pb-3 ${!event.imageUrl ? 'pt-4' : ''}`}>
          {/* Status badge for events without images */}
          {!event.imageUrl && (
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className={currentStatus.className}>
                {isOngoing ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {currentStatus.label}
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {StatusIcon && <StatusIcon className="h-3 w-3" />}
                    {currentStatus.label}
                  </div>
                )}
              </Badge>
              {isOngoing && (
                <div className="flex items-center gap-1 text-xs text-green-400 font-medium">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </div>
              )}
            </div>
          )}
          
          <Link 
            href={`/events/${event.slug}`}
            className="block group-hover:text-purple-400 transition-colors"
          >
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2 text-white">
              {event.title}
            </h3>
          </Link>
          
          {event.description && (
            <p className="text-sm text-gray-400 line-clamp-2">
              {eventUtils.truncateText(event.description, 120)}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0 pb-4 space-y-3">
          {/* Event Date & Time */}
          <div className="flex items-center text-sm text-gray-400">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0 text-purple-400" />
            <span className="truncate">
              {eventUtils.formatEventDate(event.startDate)}
            </span>
          </div>

          {/* Duration */}
          {event.endDate && (
            <div className="flex items-center text-sm text-gray-400">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-purple-400" />
              <span>
                {eventUtils.getEventDuration(event.startDate, event.endDate)} hours
              </span>
            </div>
          )}

          {/* Event Type */}
          <div className="flex items-center text-sm text-gray-400">
            <EventTypeIcon className="w-4 h-4 mr-2 flex-shrink-0 text-purple-400" />
            <span>{eventTypeInfo.label}</span>
          </div>

          {/* Organizer */}
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-2 flex-shrink-0 text-purple-400" />
            <span className="truncate">
              {event.organizer.firstName} {event.organizer.lastName}
            </span>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-xs bg-purple-500/10 border-purple-500/20 text-purple-300 hover:bg-purple-500/20 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 2 && (
                <Badge 
                  variant="outline" 
                  className="text-xs bg-gray-800/50 border-gray-600 text-gray-300"
                >
                  +{event.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        {showActions && (
          <CardFooter className="pt-0 pb-4">
            <div className="flex gap-2 w-full">
              {isUpcoming && (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Link href={`/events/${event.slug}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Register
                  </Button>
                </>
              )}
              
              {isOngoing && (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Link href={`/events/${event.slug}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Link>
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      Join Live
                    </div>
                  </Button>
                </>
              )}
              
              {isCompleted && (
                <>
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Link href={`/events/${event.slug}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Event
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    size="sm" 
                    variant="outline"
                    className="flex-1 bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700"
                  >
                    <Link href={`/events/${event.slug}/feedback`}>
                      Feedback
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  )
}

// Enhanced loading skeleton with better animations
export function EventCardSkeleton() {
  return (
    <Card className="h-full bg-gray-900/50 backdrop-blur-sm border-gray-800 overflow-hidden">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse">
        {/* Status badge skeleton */}
        <div className="absolute top-3 left-3">
          <div className="h-6 w-20 bg-gray-700 rounded-full animate-pulse" />
        </div>
        {/* Quick action skeleton */}
        <div className="absolute top-3 right-3">
          <div className="h-8 w-8 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      
      <CardHeader className="pb-3">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-1/2 bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Description skeleton */}
        <div className="mt-3 space-y-1">
          <div className="h-4 w-full bg-gray-700/70 rounded animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-700/70 rounded animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4 space-y-3">
        {/* Event details skeleton - matches the structure of the real card */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/30 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-700/70 rounded animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/30 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-700/70 rounded animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/30 rounded animate-pulse" />
          <div className="h-4 w-24 bg-gray-700/70 rounded animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500/30 rounded animate-pulse" />
          <div className="h-4 w-28 bg-gray-700/70 rounded animate-pulse" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <div className="h-5 w-16 bg-purple-500/20 border border-purple-500/30 rounded-full animate-pulse" />
          <div className="h-5 w-12 bg-purple-500/20 border border-purple-500/30 rounded-full animate-pulse" />
          <div className="h-5 w-8 bg-gray-700/50 border border-gray-600 rounded-full animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="flex gap-2 w-full">
          <div className="h-8 flex-1 bg-gray-700/50 border border-gray-600 rounded animate-pulse" />
          <div className="h-8 flex-1 bg-purple-600/50 rounded animate-pulse" />
        </div>
      </CardFooter>
    </Card>
  )
}
