'use client'

import { motion } from 'framer-motion'
import { Calendar, Clock, Star, MapPin, Globe, Layers } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { EventDetailResponseDto } from '../../types'
import { eventUtils } from '../../utils'

interface EventInformationCardProps {
  event: EventDetailResponseDto
}

export function EventInformationCard({ event }: EventInformationCardProps) {
  const eventTypeInfo = eventUtils.getEventTypeInfo(event.type)
  
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
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl text-white">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            Event Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date and Time Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-1.5 bg-green-500/20 rounded-md">
                  <Calendar className="h-4 w-4 text-green-400" />
                </div>
                Start Date
              </div>
              <div className="ml-8">
                <p className="text-white font-medium text-lg">
                  {eventUtils.formatEventDate(event.startDate)}
                </p>
              </div>
            </div>
            
            {event.endDate && typeof event.endDate === 'string' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="p-1.5 bg-red-500/20 rounded-md">
                    <Clock className="h-4 w-4 text-red-400" />
                  </div>
                  End Date
                </div>
                <div className="ml-8">
                  <p className="text-white font-medium text-lg">
                    {eventUtils.formatEventDate(event.endDate)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Duration and Event Type Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Duration Section */}
            {event.endDate && typeof event.endDate === 'string' && (
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="p-1.5 bg-orange-500/20 rounded-md">
                    <Clock className="h-4 w-4 text-orange-400" />
                  </div>
                  Duration
                </div>
                <div className="ml-8">
                  <p className="text-white font-medium text-lg">
                    {eventUtils.getEventDuration(event.startDate, event.endDate)}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Total event duration
                  </p>
                </div>
              </div>
            )}

            {/* Event Type Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className={`p-1.5 rounded-md ${eventTypeInfo.color === 'blue' ? 'bg-blue-500/20' : 
                  eventTypeInfo.color === 'green' ? 'bg-green-500/20' : 
                    eventTypeInfo.color === 'purple' ? 'bg-purple-500/20' : 'bg-gray-500/20'}`}>
                  <EventTypeIcon className={`h-4 w-4 ${eventTypeInfo.color === 'blue' ? 'text-blue-400' : 
                    eventTypeInfo.color === 'green' ? 'text-green-400' : 
                      eventTypeInfo.color === 'purple' ? 'text-purple-400' : 'text-gray-400'}`} />
                </div>
                Event Type
              </div>
              <div className="ml-8">
                <p className="text-white font-medium text-lg">
                  {eventTypeInfo.label}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {eventTypeInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Tags Section */}
          {event.tags && event.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="p-1.5 bg-purple-500/20 rounded-md">
                  <Star className="h-4 w-4 text-purple-400" />
                </div>
                Tags
              </div>
              <div className="ml-8">
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge 
                      key={tag} 
                      variant="outline"
                      className={`
                        bg-gray-800/50 border-gray-700/50 text-gray-300 
                        hover:bg-gray-700/50 transition-colors
                        ${index % 3 === 0 ? 'hover:border-blue-500/30 hover:text-blue-300' : ''}
                        ${index % 3 === 1 ? 'hover:border-purple-500/30 hover:text-purple-300' : ''}
                        ${index % 3 === 2 ? 'hover:border-green-500/30 hover:text-green-300' : ''}
                      `}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
