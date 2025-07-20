'use client'

import { motion } from 'framer-motion'
import { Users, Search, UserCheck, Clock, Award } from 'lucide-react'
import React, { useState, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import type { 
  EventsQueryControllerGetEventAttendees200Response,
  EventsQueryControllerGetEventAttendees200ResponseAttendeesInner
} from '@generated/api-client'

interface AttendeesListProps {
  attendeesData: EventsQueryControllerGetEventAttendees200Response | undefined
  isLoading: boolean
}

export function AttendeesList({ 
  attendeesData, 
  isLoading 
}: AttendeesListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'not-checked-in'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'sessions'>('name')

  const attendees = useMemo(() => 
    attendeesData?.attendees || [], 
  [attendeesData?.attendees]
  )

  const filteredAndSortedAttendees = useMemo(() => {
    const filtered = attendees.filter(attendee => {
      const matchesSearch = 
        attendee.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter = 
        filterStatus === 'all' ||
        (filterStatus === 'checked-in' && (attendee.sessionCount || 0) > 0) ||
        (filterStatus === 'not-checked-in' && (attendee.sessionCount || 0) === 0)

      return matchesSearch && matchesFilter
    })

    // Sort attendees
    filtered.sort((a, b) => {
      switch (sortBy) {
      case 'name':
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      case 'time':
        return (b.totalDuration || 0) - (a.totalDuration || 0)
      case 'sessions':
        return (b.sessionCount || 0) - (a.sessionCount || 0)
      default:
        return 0
      }
    })

    return filtered
  }, [attendees, searchTerm, filterStatus, sortBy])

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const getAttendeeStatus = (attendee: EventsQueryControllerGetEventAttendees200ResponseAttendeesInner) => {
    const sessionCount = attendee.sessionCount || 0
    const isEligible = attendee.isEligible || false
    
    if (sessionCount === 0) return 'not-checked-in'
    if (isEligible) return 'eligible'
    return 'checked-in'
  }

  const getStatusBadge = (attendee: EventsQueryControllerGetEventAttendees200ResponseAttendeesInner) => {
    const status = getAttendeeStatus(attendee)
    
    switch (status) {
    case 'eligible':
      return (
        <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
          <Award className="h-3 w-3 mr-1" />
          Eligible
        </Badge>
      )
    case 'checked-in':
      return (
        <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          <UserCheck className="h-3 w-3 mr-1" />
          Present
        </Badge>
      )
    case 'not-checked-in':
      return (
        <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <Clock className="h-3 w-3 mr-1" />
          Not Present
        </Badge>
      )
    default:
      return null
    }
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5" />
              Attendees List
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/30">
                <Skeleton className="h-12 w-12 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                  <Skeleton className="h-3 w-24 bg-gray-700" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-6 w-16 bg-gray-700" />
                  <Skeleton className="h-4 w-12 bg-gray-700" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5 text-purple-500" />
            Attendees List
            <Badge variant="outline" className="ml-2 bg-gray-900 border border-gray-800 p-2 px-4">
              {filteredAndSortedAttendees.length} of {attendees.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters and Search */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm text-gray-300">
                Search Attendees
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by name, username, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Filter by Status</Label>
              <Select value={filterStatus} onValueChange={(value: 'all' | 'checked-in' | 'not-checked-in') => setFilterStatus(value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attendees</SelectItem>
                  <SelectItem value="checked-in">Checked In</SelectItem>
                  <SelectItem value="not-checked-in">Not Checked In</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Sort by</Label>
              <Select value={sortBy} onValueChange={(value: 'name' | 'time' | 'sessions') => setSortBy(value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="time">Attendance Time</SelectItem>
                  <SelectItem value="sessions">Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Attendees List */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            {filteredAndSortedAttendees.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                {searchTerm || filterStatus !== 'all' ? 
                  'No attendees match your search criteria.' : 
                  'No attendees registered for this event yet.'}
              </div>
            ) : (
              filteredAndSortedAttendees.map((attendee, index) => (
                <motion.div
                  key={`${attendee.email}-${index}`}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg transition-all duration-200",
                    "bg-gray-800/30 hover:bg-gray-800/50 border border-gray-700/30"
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.6 + (index * 0.05),
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                >
                  {/* Avatar */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={attendee.imageUrl as string || undefined} 
                      alt={`${attendee.firstName} ${attendee.lastName}`} 
                    />
                    <AvatarFallback className="bg-gray-700 text-white">
                      {attendee.firstName?.[0]}{attendee.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {/* Attendee Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-white truncate">
                        {attendee.firstName} {attendee.lastName}
                      </h3>
                      {getStatusBadge(attendee)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>@{attendee.username}</span>
                      <span>•</span>
                      <span>{attendee.email}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-white font-medium">
                        {formatDuration(attendee.totalDuration || 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-400">
                        {attendee.sessionCount || 0} sessions
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>

          {/* Pagination could be added here if needed */}
          {attendees.length > 50 && (
            <motion.div 
              className="flex justify-center pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <Button variant="outline" size="sm">
                Load More
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
