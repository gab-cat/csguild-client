'use client'

import { motion } from 'framer-motion'
import { Users, Eye, UserCheck, Clock } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Use the actual API response type
interface AttendeesSectionProps {
  attendeesData?: {
    attendees?: Array<{
      id?: string
      username?: string
      firstName?: string
      lastName?: string
      email?: string
      imageUrl?: string | null
      sessionCount?: number
      isCurrentlyAttending?: boolean
    }>
    meta?: {
      total?: number
      page?: number
      limit?: number
      totalPages?: number
    }
  }
  isLoading: boolean
}

export function AttendeesSection({ attendeesData, isLoading }: AttendeesSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-white">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg">
              <Users className="h-5 w-5 text-orange-400" />
            </div>
            Attendees
            {attendeesData?.meta?.total ? (
              <Badge variant="outline" className="ml-auto bg-orange-500/20 text-orange-400 border-orange-500/30">
                {attendeesData.meta.total}
              </Badge>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30">
                  <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full bg-gray-700" />
                    <Skeleton className="h-3 w-3/4 bg-gray-700" />
                  </div>
                </div>
              ))}
            </div>
          ) : attendeesData?.attendees && attendeesData.attendees.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendeesData.attendees.slice(0, 12).map((attendee, index) => (
                  <div 
                    key={attendee.username || index} 
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={attendee.imageUrl || undefined} 
                          alt={`${attendee.firstName || ''} ${attendee.lastName || ''}`}
                        />
                        <AvatarFallback className="bg-gray-700 text-gray-300 text-sm">
                          {(attendee.firstName?.[0] || '?')}{(attendee.lastName?.[0] || '')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Status indicators */}
                      {attendee.isCurrentlyAttending && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center">
                          <div className="h-2 w-2 bg-white rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-white truncate">
                          {attendee.firstName || ''} {attendee.lastName || ''}
                        </p>
                        {attendee.sessionCount && attendee.sessionCount > 0 ? (
                          <Badge 
                            variant="outline" 
                            className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-1 py-0"
                          >
                            <UserCheck className="h-3 w-3" />
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-gray-400 truncate mb-1">
                        @{attendee.username || 'unknown'}
                      </p>
                      
                      {/* Session info */}
                      {attendee.sessionCount && attendee.sessionCount > 0 ? (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{attendee.sessionCount} session{attendee.sessionCount > 1 ? 's' : ''}</span>
                        </div>
                      ) : null}
                    </div>
                    
                    {/* Quick actions on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-gray-700"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {attendeesData.meta?.total && attendeesData.meta.total > 12 ? (
                <div className="pt-4 text-center border-t border-gray-800/50">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View All {attendeesData.meta.total} Attendees
                  </Button>
                </div>
              ): null}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="p-4 bg-gray-800/30 rounded-full inline-block">
                  <Users className="h-12 w-12 text-gray-600" />
                </div>
              </div>
              <h3 className="text-white font-medium mb-2">No attendees yet</h3>
              <p className="text-gray-400 text-sm mb-4">
                Be the first to register for this event!
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <UserCheck className="h-4 w-4" />
                <span>Registration is open</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
