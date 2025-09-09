'use client'

import { useMutation, useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { CalendarEventForm, CalendarEventsList, CalendarEvent } from '@/features/management/components/calendar'
import { api, Id } from '@/lib/convex'

export function CalendarManagementPage() {
  const { user } = useCurrentUser()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  // Convex queries and mutations
  const events = useQuery(api.dashboard.getCalendarEvents, {})
  const createEvent = useMutation(api.dashboard.createCalendarEvent)
  const updateEvent = useMutation(api.dashboard.updateCalendarEvent)
  const deleteEvent = useMutation(api.dashboard.deleteCalendarEvent)

  const [isSubmitting, setIsSubmitting] = useState(false)

  type FormData = {
    title: string
    description?: string
    startDate: string
    endDate?: string
    startTime?: string
    endTime?: string
    isAllDay?: boolean
    color?: string
    location?: string
    category?: 'MEETING' | 'DEADLINE' | 'EVENT' | 'REMINDER' | 'OTHER'
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    attendees?: string[]
    status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'POSTPONED'
  }

  const handleCreateEvent = async (data: FormData) => {
    if (!user?.username) {
      toast.error('You must be logged in to create events')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert date strings to timestamps
      const startDate = new Date(data.startDate).getTime()
      const endDate = data.endDate ? new Date(data.endDate).getTime() : undefined

      await createEvent({
        ...data,
        startDate,
        endDate,
        createdBy: user.username
      })

      toast.success('Calendar event created successfully!')
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating event:', error)
      toast.error('Failed to create calendar event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditEvent = async (data: Partial<FormData>) => {
    if (!selectedEvent) return

    setIsSubmitting(true)
    try {
      // Convert date strings to timestamps if they exist
      const updateData: Partial<FormData> = { ...data }
      // Build a payload matching the mutation's expected types
      const payload: {
        id: Id<'calendarEvents'>
        title?: string
        description?: string
        startDate?: number
        endDate?: number
        startTime?: string
        endTime?: string
        isAllDay?: boolean
        color?: string
        location?: string
        category?: 'MEETING' | 'DEADLINE' | 'EVENT' | 'REMINDER' | 'OTHER'
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
        attendees?: string[]
        status?: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED' | 'POSTPONED'
      } = {
        id: selectedEvent._id as Id<'calendarEvents'>,
      }

      if (updateData.title !== undefined) payload.title = updateData.title
      if (updateData.description !== undefined) payload.description = updateData.description
      if (updateData.startDate) payload.startDate = new Date(updateData.startDate).getTime()
      if (updateData.endDate) payload.endDate = new Date(updateData.endDate).getTime()
      if (updateData.startTime !== undefined) payload.startTime = updateData.startTime
      if (updateData.endTime !== undefined) payload.endTime = updateData.endTime
      if (updateData.isAllDay !== undefined) payload.isAllDay = updateData.isAllDay
      if (updateData.color !== undefined) payload.color = updateData.color
      if (updateData.location !== undefined) payload.location = updateData.location
      if (updateData.category !== undefined) payload.category = updateData.category
      if (updateData.priority !== undefined) payload.priority = updateData.priority
      if (updateData.attendees !== undefined) payload.attendees = updateData.attendees
      if (updateData.status !== undefined) payload.status = updateData.status

      await updateEvent(payload)

      toast.success('Calendar event updated successfully!')
      setIsEditDialogOpen(false)
      setSelectedEvent(null)
    } catch (error) {
      console.error('Error updating event:', error)
      toast.error('Failed to update calendar event')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return

    try {
      await deleteEvent({ id: eventToDelete as Id<'calendarEvents'> })
      toast.success('Calendar event deleted successfully!')
      setIsDeleteDialogOpen(false)
      setEventToDelete(null)
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete calendar event')
    }
  }

  const openEditDialog = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (eventId: string) => {
    setEventToDelete(eventId)
    setIsDeleteDialogOpen(true)
  }

  const handleViewEvent = (event: CalendarEvent) => {
    // For now, just open edit dialog to view details
    // In the future, you could create a dedicated view dialog
    openEditDialog(event)
  }

  const formatDateForInput = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0]
  }

  const getInitialFormData = (event: CalendarEvent) => {
    return {
      title: event.title,
      description: event.description || '',
      startDate: formatDateForInput(event.startDate),
      endDate: event.endDate ? formatDateForInput(event.endDate) : '',
      startTime: event.startTime || '',
      endTime: event.endTime || '',
      isAllDay: event.isAllDay || false,
      color: event.color || '#3b82f6',
      location: event.location || '',
      category: event.category || 'OTHER',
      priority: event.priority || 'MEDIUM',
      attendees: event.attendees || [],
      status: event.status || 'SCHEDULED',
    }
  }

  return (
    <motion.div
      className="container mx-auto px-0 py-8 max-w-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col gap-6 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
            Calendar Management
          </h1>
          <p className="text-gray-400 mt-3 text-base sm:text-lg">
            Create, edit, and manage calendar events for the organization.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="self-start sm:self-auto"
        >
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg hover:shadow-pink-500/25 transition-all duration-300 rounded-lg px-4 sm:px-6 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Event
          </Button>
        </motion.div>
      </motion.div>

      <CalendarEventsList
        events={events || []}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        onView={handleViewEvent}
        isLoading={events === undefined}
      />

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-500/30 shadow-2xl mx-4 sm:mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader className="pb-6">
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Create New Calendar Event
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-2">
                    Add a new event to the calendar with all the necessary details.
              </p>
            </DialogHeader>
            <CalendarEventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setIsCreateDialogOpen(false)}
              isLoading={isSubmitting}
              mode="create"
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Edit Event Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-500/30 shadow-2xl mx-4 sm:mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogHeader className="pb-6">
              <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                    Edit Calendar Event
              </DialogTitle>
              <p className="text-gray-400 text-sm mt-2">
                    Update the calendar event information.
              </p>
            </DialogHeader>
            {selectedEvent && (
              <CalendarEventForm
                initialData={getInitialFormData(selectedEvent)}
                onSubmit={handleEditEvent}
                onCancel={() => {
                  setIsEditDialogOpen(false)
                  setSelectedEvent(null)
                }}
                isLoading={isSubmitting}
                mode="edit"
              />
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-gray-900/95 backdrop-blur-xl border border-gray-500/30 shadow-2xl mx-4 sm:mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg sm:text-xl font-bold text-white">
                    Delete Calendar Event
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 text-sm sm:text-base">
                    Are you sure you want to delete this calendar event? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3 flex-col sm:flex-row">
              <AlertDialogCancel
                onClick={() => setIsDeleteDialogOpen(false)}
                className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 w-full sm:w-auto"
              >
                    Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteEvent}
                className="bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-red-500/25 transition-all duration-300 w-full sm:w-auto"
              >
                    Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </motion.div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
