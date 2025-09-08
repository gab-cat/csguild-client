'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Clock, MapPin, Users, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm, type Resolver, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

// Calendar event form schema
const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  isAllDay: z.boolean().default(false),
  color: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(['MEETING', 'DEADLINE', 'EVENT', 'REMINDER', 'OTHER']).default('OTHER'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  attendees: z.array(z.string()).default([]),
  status: z.enum(['SCHEDULED', 'CANCELLED', 'COMPLETED', 'POSTPONED']).default('SCHEDULED'),
})

type CalendarEventFormData = z.infer<typeof calendarEventSchema>

interface CalendarEventFormProps {
  initialData?: Partial<CalendarEventFormData>
  onSubmit: (data: CalendarEventFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  mode?: 'create' | 'edit'
}

const CATEGORY_OPTIONS = [
  { value: 'MEETING', label: 'Meeting', color: 'bg-blue-500' },
  { value: 'DEADLINE', label: 'Deadline', color: 'bg-red-500' },
  { value: 'EVENT', label: 'Event', color: 'bg-green-500' },
  { value: 'REMINDER', label: 'Reminder', color: 'bg-yellow-500' },
  { value: 'OTHER', label: 'Other', color: 'bg-gray-500' },
]

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800' },
]

const STATUS_OPTIONS = [
  { value: 'SCHEDULED', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'POSTPONED', label: 'Postponed', color: 'bg-yellow-100 text-yellow-800' },
]

export function CalendarEventForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create'
}: CalendarEventFormProps) {
  const [attendeeInput, setAttendeeInput] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CalendarEventFormData>({
    resolver: zodResolver(calendarEventSchema) as unknown as Resolver<CalendarEventFormData>,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      startDate: initialData?.startDate || '',
      endDate: initialData?.endDate || '',
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      isAllDay: initialData?.isAllDay || false,
      color: initialData?.color || '#3b82f6',
      location: initialData?.location || '',
      category: initialData?.category || 'OTHER',
      priority: initialData?.priority || 'MEDIUM',
      attendees: initialData?.attendees || [],
      status: initialData?.status || 'SCHEDULED',
    },
  })

  const watchedValues = watch()
  const isAllDay = watch('isAllDay')
  const attendees = watch('attendees')

  const addAttendee = () => {
    if (attendeeInput.trim() && !attendees.includes(attendeeInput.trim())) {
      setValue('attendees', [...attendees, attendeeInput.trim()])
      setAttendeeInput('')
    }
  }

  const removeAttendee = (attendee: string) => {
    setValue('attendees', attendees.filter(a => a !== attendee))
  }

  const handleFormSubmit: SubmitHandler<CalendarEventFormData> = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="space-y-2 p-2">
        {/* Title */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Label htmlFor="title" className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-pink-400 to-violet-400 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            />
              Title *
          </Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter event title"
              className={`bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20 transition-all duration-300 rounded-lg ${
                errors.title ? 'border-red-500 focus:border-red-500' : ''
              }`}
            />
          </motion.div>
          {errors.title && (
            <motion.p
              className="text-sm text-red-400 flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AlertCircle className="w-4 h-4" />
              {errors.title.message}
            </motion.p>
          )}
        </motion.div>

        {/* Description */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Label htmlFor="description" className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            />
              Description
          </Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter event description (optional)"
              rows={3}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-400 focus:ring-green-400/20 transition-all duration-300 rounded-lg resize-none"
            />
          </motion.div>
        </motion.div>

        {/* Date and Time Section */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
            />
            <Label className="text-sm font-medium text-gray-300">Date & Time</Label>
          </div>

          <motion.div
            className="flex items-center space-x-3 p-4 bg-gray-800/30 rounded-lg border border-gray-600/30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Switch
              id="isAllDay"
              checked={isAllDay}
              onCheckedChange={(checked) => setValue('isAllDay', checked)}
              className="bg-gray-800/50 border-gray-600 text-white data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-500 data-[state=checked]:to-violet-500"
            />
            <Label htmlFor="isAllDay" className="text-gray-300 cursor-pointer">
                All day event
            </Label>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-300">
                  Start Date *
              </Label>
              <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className={`bg-gray-800/50 border-gray-600 text-white focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-lg ${
                    errors.startDate ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
              </motion.div>
              {errors.startDate && (
                <motion.p
                  className="text-sm text-red-400 flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.startDate.message}
                </motion.p>
              )}
            </motion.div>

            {/* End Date */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-300">
                  End Date
              </Label>
              <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-lg"
                />
              </motion.div>
            </motion.div>
          </div>

          {!isAllDay && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              {/* Start Time */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Label htmlFor="startTime" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                      Start Time
                </Label>
                <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <Input
                    id="startTime"
                    type="time"
                    {...register('startTime')}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-lg"
                  />
                </motion.div>
              </motion.div>

              {/* End Time */}
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Label htmlFor="endTime" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-400" />
                      End Time
                </Label>
                <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
                  <Input
                    id="endTime"
                    type="time"
                    {...register('endTime')}
                    className="bg-gray-800/50 border-gray-600 text-white focus:border-orange-400 focus:ring-orange-400/20 transition-all duration-300 rounded-lg"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Category, Priority, Status */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1 }}
            />
            <Label className="text-sm font-medium text-gray-300">Event Details</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <Label className="text-sm font-medium text-gray-300">Category</Label>
              <Select value={watchedValues.category} onValueChange={(value: CalendarEventFormData['category']) => setValue('category', value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
                  {CATEGORY_OPTIONS.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <Label className="text-sm font-medium text-gray-300">Priority</Label>
              <Select value={watchedValues.priority} onValueChange={(value: CalendarEventFormData['priority']) => setValue('priority', value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
                  {PRIORITY_OPTIONS.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
                    >
                      <Badge className={option.color}>{option.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <Label className="text-sm font-medium text-gray-300">Status</Label>
              <Select value={watchedValues.status} onValueChange={(value: CalendarEventFormData['status']) => setValue('status', value)}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-purple-400 focus:ring-purple-400/20 transition-all duration-300 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900/95 backdrop-blur-sm border-gray-600 rounded-lg">
                  {STATUS_OPTIONS.map(option => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="hover:bg-gray-800 focus:bg-gray-800 transition-colors duration-200"
                    >
                      <Badge className={option.color}>{option.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <Label htmlFor="location" className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
              Location
          </Label>
          <motion.div whileFocus={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
            <Input
              id="location"
              {...register('location')}
              placeholder="Enter event location (optional)"
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20 transition-all duration-300 rounded-lg"
            />
          </motion.div>
        </motion.div>

        {/* Color */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Label htmlFor="color" className="text-sm font-medium text-gray-300">
              Event Color
          </Label>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="color"
              type="color"
              {...register('color')}
              className="w-20 h-12 bg-gray-800/50 border-gray-600 rounded-lg cursor-pointer"
            />
          </motion.div>
        </motion.div>

        {/* Attendees */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
              Attendees
          </Label>
          <div className="flex gap-3">
            <motion.div
              className="flex-1"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                placeholder="Enter username"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-400 focus:ring-teal-400/20 transition-all duration-300 rounded-lg"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="button"
                onClick={addAttendee}
                variant="outline"
                className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 rounded-lg"
              >
                  Add
              </Button>
            </motion.div>
          </div>
          {attendees.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {attendees.map((attendee, index) => (
                <motion.div
                  key={attendee}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <Badge
                    variant="secondary"
                    className="bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 cursor-pointer transition-all duration-200 rounded-full px-3 py-1"
                    onClick={() => removeAttendee(attendee)}
                  >
                    {attendee}
                    <span className="ml-2 text-red-400 hover:text-red-300">×</span>
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      <motion.div
        className="flex justify-end gap-4 p-8 pt-6 border-t border-gray-600/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-300 rounded-lg px-6"
          >
                Cancel
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 shadow-lg hover:shadow-pink-500/25 transition-all duration-300 rounded-lg px-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
              </div>
            ) : (
              mode === 'create' ? 'Create Event' : 'Update Event'
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  )
}
