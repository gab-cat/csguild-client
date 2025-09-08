'use client'

import { useQuery } from 'convex/react'
// Using string for _id as it's the runtime type from Convex
import { motion } from 'framer-motion'
import { Filter } from 'lucide-react'
import moment from 'moment'
import { useState, useCallback, useMemo } from 'react'
import { Calendar, momentLocalizer, Event, Views, View } from 'react-big-calendar'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { api, Id } from '@/lib/convex'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { cn } from '@/lib/utils'

// Custom calendar styling to match dark theme
const calendarStyles = `
  /* Base calendar container */
  .rbc-calendar {
    background: transparent !important;
    color: rgb(229 231 235) !important;
    border: none !important;
  }

  /* Month view container */
  .rbc-month-view {
    border: 1px solid rgb(75 85 99 / 0.3) !important;
    border-radius: 8px !important;
    overflow: hidden !important;
    background: transparent !important;
  }

  /* Month header row */
  .rbc-month-header {
    background: rgb(31 41 55 / 0.5) !important;
    border-bottom: 1px solid rgb(75 85 99 / 0.3) !important;
  }

  /* Individual headers */
  .rbc-header {
    background: rgb(31 41 55 / 0.5) !important;
    color: rgb(156 163 175) !important;
    border-bottom: 1px solid rgb(75 85 99 / 0.3) !important;
    border-right: 1px solid rgb(75 85 99 / 0.3) !important;
    border-left: none !important;
    border-top: none !important;
    padding: 8px 12px !important;
    font-weight: 600 !important;
  }

  .rbc-header:first-child {
    border-left: 1px solid rgb(75 85 99 / 0.3) !important;
  }

  /* Month rows */
  .rbc-month-row {
    border-bottom: 1px solid rgb(75 85 99 / 0.3) !important;
    background: transparent !important;
  }

  .rbc-month-row:last-child {
    border-bottom: none !important;
  }

  /* Date cells */
  .rbc-date-cell {
    color: rgb(229 231 235) !important;
    padding: 4px 6px !important;
    border-right: 1px solid rgb(75 85 99 / 0.3) !important;
    border-bottom: 1px solid rgb(75 85 99 / 0.3) !important;
    background: transparent !important;
    position: relative !important;
  }

  .rbc-date-cell > a {
    color: rgb(229 231 235) !important;
    text-decoration: none !important;
    padding: 4px !important;
    border-radius: 4px !important;
    transition: background-color 0.2s ease !important;
  }

  .rbc-date-cell > a:hover {
    background: rgb(55 65 81 / 0.5) !important;
  }

  /* Off-range dates (days not in current month) */
  .rbc-date-cell.rbc-off-range {
    color: rgb(107 114 128) !important;
    background: rgb(17 24 39 / 0.3) !important;
    opacity: 0.6 !important;
  }

  .rbc-date-cell.rbc-off-range > a {
    color: rgb(107 114 128) !important;
    opacity: 0.8 !important;
  }

  .rbc-date-cell.rbc-off-range > a:hover {
    background: rgb(55 65 81 / 0.3) !important;
  }

  .rbc-date-cell.rbc-off-range-bg {
    background: rgb(17 24 39 / 0.3) !important;
  }

  /* Today highlighting */
  .rbc-today {
    background: rgb(59 130 246 / 0.1) !important;
  }

  .rbc-today.rbc-off-range {
    background: rgb(17 24 39 / 0.3) !important;
  }

  .rbc-today > a {
    color: rgb(59 130 246) !important;
    font-weight: 600 !important;
  }

  /* Row borders */
  .rbc-row {
    border-bottom: 1px solid rgb(75 85 99 / 0.3) !important;
  }

  .rbc-row:last-child {
    border-bottom: none !important;
  }

  /* Additional grid lines */
  .rbc-row-segment {
    border-right: 1px solid rgb(75 85 99 / 0.3) !important;
  }

  .rbc-row-segment:last-child {
    border-right: none !important;
  }

  /* All calendar borders - catch all */
  .rbc-calendar * {
    border-color: rgb(75 85 99 / 0.3) !important;
  }

  /* Specific border overrides */
  .rbc-calendar .rbc-date-cell,
  .rbc-calendar .rbc-month-row,
  .rbc-calendar .rbc-header,
  .rbc-calendar .rbc-month-view {
    border-color: rgb(75 85 99 / 0.3) !important;
  }

  /* Ensure no white backgrounds */
  .rbc-calendar,
  .rbc-calendar *,
  .rbc-month-view,
  .rbc-date-cell,
  .rbc-off-range,
  .rbc-off-range-bg {
    background-color: transparent !important;
  }

  /* Force off-range styling */
  .rbc-off-range,
  .rbc-off-range * {
    color: rgb(107 114 128) !important;
    background-color: rgb(17 24 39 / 0.3) !important;
  }

  /* Additional specificity for off-range dates */
  .rbc-date-cell.rbc-off-range,
  .rbc-date-cell.rbc-off-range > a,
  .rbc-date-cell.rbc-off-range-bg,
  .rbc-date-cell.rbc-off-range-bg > a {
    color: rgb(107 114 128) !important;
    background-color: rgb(17 24 39 / 0.3) !important;
  }

  /* Today highlighting - consolidated */
  .rbc-today {
    background: rgb(59 130 246 / 0.1) !important;
  }

  .rbc-today.rbc-off-range {
    background: rgb(17 24 39 / 0.3) !important;
  }

  .rbc-today > a {
    color: rgb(59 130 246) !important;
    font-weight: 600 !important;
  }

  .rbc-slot-selection {
    background: rgb(59 130 246 / 0.1);
  }

  .rbc-toolbar {
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
    color: rgb(229 231 235);
  }

  .rbc-toolbar button {
    color: rgb(229 231 235);
    border: 1px solid rgb(75 85 99 / 0.3);
    background: rgb(31 41 55 / 0.5);
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 14px;
    transition: all 0.2s ease;
  }

  .rbc-toolbar button:hover {
    background: rgb(55 65 81 / 0.7);
    border-color: rgb(107 114 128 / 0.5);
  }

  .rbc-toolbar button.rbc-active {
    background: rgb(59 130 246);
    border-color: rgb(59 130 246);
    color: white;
  }

  .rbc-toolbar-label {
    color: rgb(229 231 235);
    font-size: 18px;
    font-weight: 600;
    margin: 0 16px;
  }

  .rbc-week-view,
  .rbc-day-view {
    border: 1px solid rgb(75 85 99 / 0.3);
    border-radius: 8px;
  }

  .rbc-time-view .rbc-header {
    border-bottom: 1px solid rgb(75 85 99 / 0.3);
  }

  .rbc-time-header-content {
    border-left: 1px solid rgb(75 85 99 / 0.3);
  }

  .rbc-time-content {
    border-top: 1px solid rgb(75 85 99 / 0.3);
  }

  .rbc-time-gutter .rbc-timeslot-group {
    border-bottom: 1px solid rgb(75 85 99 / 0.3);
  }

  .rbc-timeslot-group {
    border-bottom: 1px solid rgb(75 85 99 / 0.3);
  }

  .rbc-time-gutter .rbc-time-slot {
    border-top: 1px solid rgb(75 85 99 / 0.2);
  }

  .rbc-current-time-indicator {
    background: rgb(239 68 68);
    height: 2px;
  }

  .rbc-agenda-view {
    border: 1px solid rgb(75 85 99 / 0.3);
    border-radius: 8px;
  }

  .rbc-agenda-view table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .rbc-agenda-view table thead th {
    background: rgb(31 41 55 / 0.5);
    color: rgb(156 163 175);
    border-bottom: 1px solid rgb(75 85 99 / 0.3);
    padding: 8px 12px;
    font-weight: 600;
  }

  .rbc-agenda-view table tbody td {
    border-bottom: 1px solid rgb(75 85 99 / 0.2);
    padding: 8px 12px;
    color: rgb(229 231 235);
  }

  .rbc-agenda-view table tbody tr:hover td {
    background: rgb(55 65 81 / 0.3);
  }

  .rbc-event {
    border-radius: 4px;
    border: none;
    color: white !important;
    font-size: 12px;
    padding: 2px 6px;
  }

  .rbc-event.rbc-selected {
    outline: 2px solid rgb(59 130 246);
  }
`

const localizer = momentLocalizer(moment)

interface CalendarEvent {
  _id: Id<'calendarEvents'>
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
}

interface BigCalendarEvent extends Event {
  resource: CalendarEvent
}

export function CalendarView() {
  const { user } = useCurrentUser()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showMyEventsOnly, setShowMyEventsOnly] = useState(false)

  // Convex queries
  const events = useQuery(api.dashboard.getCalendarEvents, {})


  // Transform Convex events to BigCalendar format
  const calendarEvents: BigCalendarEvent[] = useMemo(() => {
    if (!events) return []

    return events
      .filter(event => {
        // Filter by category
        if (filterCategory !== 'all' && event.category !== filterCategory) {
          return false
        }
        
        // Filter by creator
        if (showMyEventsOnly && event.createdBy !== user?.username) {
          return false
        }

        // Filter out cancelled events
        if (event.status === 'CANCELLED') {
          return false
        }

        return true
      })
      .map(event => {
        const startDateTime = event.isAllDay
          ? new Date(event.startDate)
          : new Date(event.startDate + (event.startTime ? moment(`2000-01-01 ${event.startTime}`).diff(moment('2000-01-01 00:00'), 'milliseconds') : 0))

        const endDateTime = event.endDate
          ? (event.isAllDay
            ? new Date(event.endDate)
            : new Date((event.endDate || event.startDate) + (event.endTime ? moment(`2000-01-01 ${event.endTime}`).diff(moment('2000-01-01 00:00'), 'milliseconds') : (event.startTime ? moment(`2000-01-01 ${event.startTime}`).diff(moment('2000-01-01 00:00'), 'milliseconds') : 0))))
          : startDateTime

        return {
          id: event._id,
          title: event.title,
          start: startDateTime,
          end: endDateTime,
          allDay: event.isAllDay || false,
          resource: event,
        }
      })
  }, [events, filterCategory, showMyEventsOnly, user?.username])

  const handleSelectSlot = useCallback(() => {
    // open create dialog (creation disabled in this view)
    setIsCreateDialogOpen(true)
  }, [])

  const handleSelectEvent = useCallback((event: BigCalendarEvent) => {
    setSelectedEvent(event.resource)
    setIsViewDialogOpen(true)
  }, [])

  // Creation is disabled in this view; show informative toast instead
  const handleDisabledCreateAttempt = () => {
    setIsCreateDialogOpen(false)
  }

  const eventStyleGetter = useCallback((event: BigCalendarEvent) => {
    const eventData = event.resource
    
    let backgroundColor = eventData.color || '#3b82f6'
    
    // Apply priority-based styling
    if (eventData.priority === 'URGENT') {
      backgroundColor = '#ef4444'
    } else if (eventData.priority === 'HIGH') {
      backgroundColor = '#f97316'
    }

    // Apply status-based styling
    if (eventData.status === 'COMPLETED') {
      backgroundColor = '#22c55e'
    } else if (eventData.status === 'POSTPONED') {
      backgroundColor = '#eab308'
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        fontSize: '12px',
        padding: '2px 4px'
      }
    }
  }, [])

  // Choose text color classes based on category for better visual cues
  function getCategoryTextColor(
    category?: CalendarEvent['category']
  ): string {
    switch (category) {
    case 'MEETING':
      return 'text-blue-500'
    case 'DEADLINE':
      return 'text-red-500'
    case 'EVENT':
      return 'text-violet-500'
    case 'REMINDER':
      return 'text-yellow-500'
    case 'OTHER':
    default:
      return 'text-white'
    }
  }


  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Calendar Toolbar */}
      <motion.div
        className="flex items-center gap-2 mb-4"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 rounded-lg backdrop-blur-sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                  Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
              <DropdownMenuItem
                onClick={() => setFilterCategory('all')}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                  All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                onClick={() => setFilterCategory('MEETING')}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                  Meetings
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory('DEADLINE')}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                  Deadlines
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory('EVENT')}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                  Events
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setFilterCategory('REMINDER')}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                  Reminders
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-600" />
              <DropdownMenuItem
                onClick={() => setShowMyEventsOnly(!showMyEventsOnly)}
                className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
              >
                {showMyEventsOnly ? 'Show All Events' : 'My Events Only'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </motion.div>

      {/* Calendar Component */}
      <motion.div
        className="flex-1 min-h-[600px] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden relative"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {/* Inject custom styles */}
        <style dangerouslySetInnerHTML={{ __html: calendarStyles }} />

        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', background: 'transparent' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          selectable
          eventPropGetter={eventStyleGetter}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          step={30}
          showMultiDayTimes
          components={{
            event: ({ event }) => {
              const categoryTextClass = getCategoryTextColor(event.resource.category)
              return (
                <motion.div
                  className="text-xs p-1 rounded-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={cn("font-medium truncate", categoryTextClass)}>{event.title}</div>
                  {event.resource.location && (
                    <div className="opacity-75 truncate text-gray-200 text-xs">{event.resource.location}</div>
                  )}
                </motion.div>
              )
            },
          }}
          messages={{
            allDay: 'All Day',
            previous: 'Previous',
            next: 'Next',
            today: 'Today',
            month: 'Month',
            week: 'Week',
            day: 'Day',
            agenda: 'Agenda',
            date: 'Date',
            time: 'Time',
            event: 'Event',
            noEventsInRange: 'No events to display.',
            showMore: (total) => `+${total} more`,
          }}
        />
      </motion.div>

      {/* Create Event Dialog - Disabled in this view (no AnimatePresence) */}
      {isCreateDialogOpen && (
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="max-w-sm bg-gray-900/95 backdrop-blur-xl border border-gray-500/30 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-center space-y-4 py-6"
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-pink-500/20 to-violet-500/20 rounded-full flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"></div>
              </motion.div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                  Event Creation
                </h3>
                <p className="text-gray-400 text-sm">
                  To create events, please visit the Calendar Management page.
                </p>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="pt-2"
              >
                <Button
                  onClick={handleDisabledCreateAttempt}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-6"
                >
                  Got it
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}

      {/* View Event Dialog (no AnimatePresence) */}
      {isViewDialogOpen && selectedEvent && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-md bg-gray-900/95 backdrop-blur-xl border border-gray-500/30 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Event Color Indicator */}
              <div className="flex items-center justify-between">
                <motion.div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: selectedEvent.color || '#3b82f6' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                />
              </div>

              {/* Event Title */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2 className="text-xl font-bold text-white leading-tight">
                  {selectedEvent.title}
                </h2>
              </motion.div>

              {/* Event Date & Time */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-white">
                      {new Date(selectedEvent.startDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    {!selectedEvent.isAllDay && (selectedEvent.startTime || selectedEvent.endTime) && (
                      <div className="text-gray-400 text-xs mt-1">
                        {selectedEvent.startTime && `${selectedEvent.startTime}`}
                        {selectedEvent.endTime && selectedEvent.startTime !== selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                      </div>
                    )}
                    {selectedEvent.isAllDay && (
                      <div className="text-gray-400 text-xs mt-1">All day</div>
                    )}
                  </div>
                </div>

                {/* Location */}
                {selectedEvent.location && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400 text-xs">Location</div>
                      <div className="font-medium text-white">{selectedEvent.location}</div>
                    </div>
                  </div>
                )}

                {/* Attendees */}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                    <div className="text-sm">
                      <div className="text-gray-400 text-xs">Attendees</div>
                      <div className="font-medium text-white">
                        {selectedEvent.attendees.length} {selectedEvent.attendees.length === 1 ? 'person' : 'people'}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Event Description */}
              {selectedEvent.description && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="text-gray-400 text-xs font-medium">Description</div>
                  <div className="text-sm text-gray-200 leading-relaxed">
                    {selectedEvent.description}
                  </div>
                </motion.div>
              )}

              {/* Event Badges */}
              <motion.div
                className="flex flex-wrap gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Category Badge */}
                <div className="px-3 py-1 bg-gray-700/50 rounded-full text-xs font-medium text-gray-200 border border-gray-600/30">
                  {selectedEvent.category || 'Other'}
                </div>

                {/* Priority Badge */}
                {selectedEvent.priority && selectedEvent.priority !== 'MEDIUM' && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedEvent.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                      selectedEvent.priority === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30' :
                        'bg-green-500/20 text-green-300 border-green-500/30'
                  }`}>
                    {selectedEvent.priority}
                  </div>
                )}

                {/* Status Badge */}
                {selectedEvent.status && selectedEvent.status !== 'SCHEDULED' && (
                  <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedEvent.status === 'COMPLETED' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      selectedEvent.status === 'CANCELLED' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
                        'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}>
                    {selectedEvent.status}
                  </div>
                )}
              </motion.div>

              {/* Creator Info */}
              <motion.div
                className="flex items-center justify-between pt-4 border-t border-gray-600/30"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="text-xs text-gray-400">
                    Created by <span className="text-gray-200 font-medium">{selectedEvent.createdBy}</span>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsViewDialogOpen(false)
                      setSelectedEvent(null)
                    }}
                    className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white text-xs px-4 py-2 rounded-lg"
                  >
                      Close
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  )
}
