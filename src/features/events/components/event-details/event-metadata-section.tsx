'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, Tag, User } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'

import { EventDetailResponseDto } from '../../types'

interface EventMetadataSectionProps {
  event: EventDetailResponseDto
}

export function EventMetadataSection({ event }: EventMetadataSectionProps) {
  return (
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
                {new Date(event.startDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(event.startDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
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
                  {new Date(String(event.endDate)).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(String(event.endDate)).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
  )
}
