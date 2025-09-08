'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, MapPin, Users, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface CalendarEvent {
  _id: string
  _creationTime: number
  title: string
  description?: string
  startDate: number
  endDate?: number
  startTime?: string
  endTime?: string
  isAllDay?: boolean
  color?: string
  location?: string
  category?: 'MEETING' | 'DEADLINE' | 'EVENT' | 'REMINDER' | 'OTHER'
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  createdBy: string
  attendees?: string[]
  status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'POSTPONED'
  createdAt?: number
  updatedAt?: number
}

interface CalendarEventsListProps {
  events: CalendarEvent[]
  onEdit: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
  onView: (event: CalendarEvent) => void
  isLoading?: boolean
}

const CATEGORY_COLORS = {
  MEETING: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  DEADLINE: 'bg-red-500/10 text-red-500 border-red-500/30',
  EVENT: 'bg-green-500/10 text-green-500 border-green-500/30',
  REMINDER: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  OTHER: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
}

const PRIORITY_COLORS = {
  LOW: 'bg-green-500/10 text-green-500 border-green-500/30',
  MEDIUM: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  HIGH: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  URGENT: 'bg-red-500/10 text-red-500 border-red-500/30',
}

const STATUS_COLORS = {
  SCHEDULED: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/30',
  COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/30',
  POSTPONED: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
}

export function CalendarEventsList({
  events,
  onEdit,
  onDelete,
  onView,
  isLoading = false
}: CalendarEventsListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('startDate')

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time?: string) => {
    if (!time) return ''
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || event.category === filterCategory
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
      case 'startDate':
        return a.startDate - b.startDate
      case 'title':
        return a.title.localeCompare(b.title)
      case 'createdAt':
        return (b.createdAt || b._creationTime) - (a.createdAt || a._creationTime)
      case 'priority':
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
        return (priorityOrder[b.priority || 'MEDIUM']) - (priorityOrder[a.priority || 'MEDIUM'])
      default:
        return 0
      }
    })

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className="text-center py-12 bg-gray-900/30 rounded-xl border border-gray-600/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-pink-400/30 border-t-pink-400 mx-auto"></div>
              <div className="absolute inset-0 rounded-full border-2 border-violet-400/20 border-t-transparent animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <motion.p
              className="mt-4 text-gray-400 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Loading events...
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="flex-1"
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20 transition-all duration-300 rounded-lg h-12"
          />
        </motion.div>

        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg h-12">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
              <SelectItem value="all" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">All Categories</SelectItem>
              <SelectItem value="MEETING" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Meeting</SelectItem>
              <SelectItem value="DEADLINE" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Deadline</SelectItem>
              <SelectItem value="EVENT" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Event</SelectItem>
              <SelectItem value="REMINDER" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Reminder</SelectItem>
              <SelectItem value="OTHER" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg h-12">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
              <SelectItem value="all" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">All Status</SelectItem>
              <SelectItem value="SCHEDULED" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Scheduled</SelectItem>
              <SelectItem value="CANCELLED" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Cancelled</SelectItem>
              <SelectItem value="COMPLETED" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Completed</SelectItem>
              <SelectItem value="POSTPONED" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Postponed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-36 bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg h-12">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
              <SelectItem value="startDate" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Date</SelectItem>
              <SelectItem value="title" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Title</SelectItem>
              <SelectItem value="priority" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Priority</SelectItem>
              <SelectItem value="createdAt" className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200">Created</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </motion.div>

      {/* Events Table */}
      <AnimatePresence mode="wait">
        {filteredAndSortedEvents.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            key="empty-state"
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Calendar className="w-10 h-10 text-gray-500" />
            </motion.div>
            <motion.h3
              className="text-xl font-semibold mb-3 text-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              No events found
            </motion.h3>
            <motion.p
              className="text-gray-400 max-w-md mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first calendar event to get started.'
              }
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="rounded-xl border border-gray-600/30 overflow-hidden bg-gray-800/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            key="table"
          >
            <Table>
              <TableHeader className="bg-gray-800/50">
                <TableRow className="border-gray-600/30 hover:bg-gray-800/30">
                  <TableHead className="text-gray-300 font-semibold py-4">Event</TableHead>
                  <TableHead className="text-gray-300 font-semibold py-4">Date & Time</TableHead>
                  <TableHead className="text-gray-300 font-semibold py-4">Category</TableHead>
                  <TableHead className="text-gray-300 font-semibold py-4">Priority</TableHead>
                  <TableHead className="text-gray-300 font-semibold py-4">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold py-4">Creator</TableHead>
                  <TableHead className="w-[50px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredAndSortedEvents.map((event, index) => (
                    <motion.tr
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-gray-600/30 hover:bg-gray-800/30 transition-all duration-200"
                    >
                      <TableCell className="py-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="font-semibold text-white">{event.title}</div>
                          {event.description && (
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {event.description}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-cyan-400" />
                                {event.location}
                              </div>
                            )}
                            {event.attendees && event.attendees.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-teal-400" />
                                {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </TableCell>

                      <TableCell className="py-4">
                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <Calendar className="w-4 h-4 text-orange-400" />
                            {formatDate(event.startDate)}
                            {event.endDate && event.endDate !== event.startDate && (
                              <span className="text-gray-500"> - {formatDate(event.endDate)}</span>
                            )}
                          </div>
                          {!event.isAllDay && (event.startTime || event.endTime) && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="w-4 h-4 text-orange-400" />
                              {event.startTime && formatTime(event.startTime)}
                              {event.endTime && event.startTime !== event.endTime && (
                                <span> - {formatTime(event.endTime)}</span>
                              )}
                            </div>
                          )}
                          {event.isAllDay && (
                            <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300 border-gray-600">
                              All Day
                            </Badge>
                          )}
                        </motion.div>
                      </TableCell>

                      <TableCell className="py-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Badge className={`${CATEGORY_COLORS[event.category || 'OTHER']} border-0 font-medium`}>
                            {event.category || 'Other'}
                          </Badge>
                        </motion.div>
                      </TableCell>

                      <TableCell className="py-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.25 }}
                        >
                          <Badge className={`${PRIORITY_COLORS[event.priority || 'MEDIUM']} border-0 font-medium`}>
                            {event.priority || 'Medium'}
                          </Badge>
                        </motion.div>
                      </TableCell>

                      <TableCell className="py-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Badge className={`${STATUS_COLORS[event.status || 'SCHEDULED']} border-0 font-medium`}>
                            {event.status || 'Scheduled'}
                          </Badge>
                        </motion.div>
                      </TableCell>

                      <TableCell className="py-4 text-sm text-gray-400">
                        {event.createdBy}
                      </TableCell>

                      <TableCell className="py-4">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 }}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-700/50 transition-colors duration-200"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg shadow-lg"
                            >
                              <DropdownMenuItem
                                onClick={() => onView(event)}
                                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
                              >
                                <Eye className="w-4 h-4 mr-2 text-blue-400" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onEdit(event)}
                                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
                              >
                                <Edit className="w-4 h-4 mr-2 text-green-400" />
                                Edit Event
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-600" />
                              <DropdownMenuItem
                                onClick={() => onDelete(event._id)}
                                className="text-red-400 hover:bg-red-900/20 focus:bg-red-900/20 transition-colors duration-200"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Event
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
