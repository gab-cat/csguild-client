'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { BookmarkCheck, Bookmark, Share2, Radio, Calendar, CheckCircle2, Pin } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { EventDetailResponseDto } from '../../types'
import { eventUtils } from '../../utils'
import { EventNavigationDropdown } from '../shared/event-navigation-dropdown'

interface EventHeroSectionProps {
  event: EventDetailResponseDto
  isBookmarked: boolean
  onToggleBookmark: () => void
  onShare: () => void
}

export function EventHeroSection({ 
  event, 
  isBookmarked, 
  onToggleBookmark, 
  onShare 
}: EventHeroSectionProps) {
  const router = useRouter()
  
  // Scroll animation hooks
  const { scrollY } = useScroll()
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.01])

  const eventStatus = eventUtils.getEventStatus(
    event.startDate, 
    typeof event.endDate === 'string' ? event.endDate : undefined
  )
  const isUpcoming = eventStatus === 'upcoming'
  const isOngoing = eventStatus === 'ongoing'
  const isCompleted = eventStatus === 'completed'

  return (
    <div className="relative">
      {/* Event Image with Parallax */}
      <motion.div 
        className="relative h-80 lg:h-96 overflow-hidden mt-12"
        style={{ 
          opacity: imageOpacity,
          scale: imageScale,
          position: 'fixed',
          top: '1rem',
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
          className="object-cover animate-fade-in"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
      </motion.div>

      {/* Content Container with proper z-index */}
      <div className="relative z-10 h-80 lg:h-96">
        {/* Event Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Navigation and Status Row */}
            <div className="flex items-start justify-between mb-4">
              {/* Left Side - Event Navigation and Status */}
              <div className="flex items-center gap-4">
                <EventNavigationDropdown 
                  eventSlug={event.slug}
                  currentPage="detail"
                  onBack={() => router.back()}
                />

                <div className="flex items-center gap-3">
                  <Badge 
                    variant={isOngoing ? 'destructive' : isUpcoming ? 'default' : 'secondary'}
                    className={`
                      px-3 py-1 text-sm font-medium
                      ${isOngoing ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                      ${isUpcoming ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : ''}
                      ${isCompleted ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' : ''}
                    `}
                  >
                    {isOngoing && (
                      <span className="flex items-center gap-1">
                        <Radio className="h-3 w-3" />
                        Live Now
                      </span>
                    )}
                    {isUpcoming && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Upcoming
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </span>
                    )}
                  </Badge>
                  {event.isPinned && (
                    <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                      <Pin className="h-3 w-3 mr-1" />
                      Pinned
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right Side - Share and Bookmark Actions */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleBookmark}
                  className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 text-white"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 text-white"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Title and Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold font-space-grotesk tracking-tight text-white mb-4">
                {event.title}
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
  )
}
