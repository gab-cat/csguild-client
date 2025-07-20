'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Calendar, Save, ImageIcon, Plus, X, Tag, Loader2, Trash2, Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { UpdateEventDto, CreateFeedbackFormDto, FeedbackFormFieldDto } from '@generated/api-client'
import { CreateEventDtoTypeEnum, FeedbackFormFieldDtoTypeEnum } from '@generated/api-client'

import { 
  useEventWithFeedbackForm, 
  useUpdateEventMutation, 
  useDeleteEventMutation, 
  useCreateFeedbackFormMutation, 
  useUpdateFeedbackFormMutation 
} from '../../hooks'
import { updateEventSchema, type UpdateEventSchemaType } from '../../schemas'
import type { FormField as FeedbackFormField } from '../../types'
import { toEventCard } from '../../types'
import { FormBuilder } from '../create/form-builder/form-builder'
import { EventNavigationDropdown } from '../shared/event-navigation-dropdown'

interface EditEventClientProps {
  slug: string
}

export function EditEventClient({ slug }: EditEventClientProps) {
  const router = useRouter()
  
  // Scroll animation hooks for parallax effect
  const { scrollY } = useScroll()
  const imageOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const imageScale = useTransform(scrollY, [0, 300], [1, 1.01])
  
  // Use the combined hook for event and feedback form data
  const {
    event: eventData,
    feedbackForm: feedbackFormData,
    isLoadingEvent,
    error: eventError
  } = useEventWithFeedbackForm(slug)
  
  // Mutation hooks
  const updateEventMutation = useUpdateEventMutation()
  const deleteEventMutation = useDeleteEventMutation()
  const createFeedbackFormMutation = useCreateFeedbackFormMutation()
  const updateFeedbackFormMutation = useUpdateFeedbackFormMutation()

  // Local state
  const [feedbackFields, setFeedbackFields] = useState<FeedbackFormField[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Initialize React Hook Form with Zod resolver
  const form = useForm<UpdateEventSchemaType>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: '',
      type: CreateEventDtoTypeEnum.IN_PERSON,
      description: '',
      details: '',
      startDate: '',
      endDate: '',
      imageUrl: '',
      tags: [],
      minimumAttendanceMinutes: 0,
    },
  })

  // Load event data into form when available
  useEffect(() => {
    if (eventData) {
      const eventCard = toEventCard(eventData)
      
      form.reset({
        title: eventCard.title,
        type: eventCard.type,
        description: eventCard.description || '',
        details: eventCard.details || '',
        startDate: new Date(eventCard.startDate).toISOString().slice(0, 16),
        endDate: eventCard.endDate ? new Date(eventCard.endDate).toISOString().slice(0, 16) : '',
        imageUrl: eventCard.imageUrl || '',
        tags: eventCard.tags || [],
        minimumAttendanceMinutes: 0, // Default value since not available in API
      })
    }
  }, [eventData, form])

  // Load feedback form data when available
  useEffect(() => {
    if (feedbackFormData?.fields && Array.isArray(feedbackFormData.fields)) {
      // Map the API response fields to our internal field format
      const fieldsArray: FeedbackFormField[] = feedbackFormData.fields.map((field: FeedbackFormFieldDto) => ({
        id: field.id || `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        label: field.label || '',
        type: field.type || FeedbackFormFieldDtoTypeEnum.TEXT,
        required: field.required || false,
        options: field.options || [],
        placeholder: field.placeholder || '',
        description: field.description || '',
        maxRating: field.maxRating || 5,
      }))
      
      setFeedbackFields(fieldsArray)
    } else if (feedbackFormData?.fields && !Array.isArray(feedbackFormData.fields)) {
      // Fallback: If fields is an object, convert it to array format
      const fieldsObj = feedbackFormData.fields as Record<string, FeedbackFormFieldDto>
      const fieldsArray: FeedbackFormField[] = Object.entries(fieldsObj).map(([key, field]: [string, FeedbackFormFieldDto]) => ({
        id: field.id || key,
        label: field.label || '',
        type: field.type || FeedbackFormFieldDtoTypeEnum.TEXT,
        required: field.required || false,
        options: field.options || [],
        placeholder: field.placeholder || '',
        description: field.description || '',
        maxRating: field.maxRating || 5,
      }))
      
      setFeedbackFields(fieldsArray)
    }
  }, [feedbackFormData])

  // Handle tag management
  const addTag = () => {
    const currentTags = form.getValues('tags') || []
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags') || []
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Handle form submission
  const onSubmit = async (data: UpdateEventSchemaType) => {
    try {
      // Prepare event data with correct structure, only including changed fields
      const updateEventPayload: UpdateEventDto = {}

      // Only include fields that have been changed from original values
      if (data.title && data.title !== eventData?.title) {
        updateEventPayload.title = data.title
      }
      if (data.type && data.type !== eventData?.type) {
        updateEventPayload.type = data.type
      }
      if (data.description !== eventData?.description) {
        updateEventPayload.description = data.description || undefined
      }
      if (data.details !== eventData?.details) {
        updateEventPayload.details = data.details || undefined
      }
      if (data.startDate) {
        const newStartDate = new Date(data.startDate).toISOString()
        const originalStartDate = new Date(eventData?.startDate || '').toISOString()
        if (newStartDate !== originalStartDate) {
          updateEventPayload.startDate = newStartDate
        }
      }
      if (data.endDate) {
        const newEndDate = new Date(data.endDate).toISOString()
        const originalEndDate = eventData?.endDate && typeof eventData.endDate === 'string' 
          ? new Date(eventData.endDate).toISOString() 
          : undefined
        if (newEndDate !== originalEndDate) {
          updateEventPayload.endDate = newEndDate
        }
      }
      if (data.imageUrl !== eventData?.imageUrl) {
        updateEventPayload.imageUrl = data.imageUrl || undefined
      }
      if (JSON.stringify(data.tags) !== JSON.stringify(eventData?.tags)) {
        updateEventPayload.tags = data.tags
      }
      if (data.minimumAttendanceMinutes && data.minimumAttendanceMinutes > 0) {
        updateEventPayload.minimumAttendanceMinutes = data.minimumAttendanceMinutes
      }

      // Only update if there are changes
      if (Object.keys(updateEventPayload).length > 0) {
        await updateEventMutation.mutateAsync({ slug, updateData: updateEventPayload })
      }
      
      // Handle feedback form creation/update
      if (feedbackFields.length > 0 && eventData?.id) {
        if (!feedbackFormData) {
          // Create new feedback form
          const feedbackFormPayload: CreateFeedbackFormDto = {
            eventId: eventData.id,
            title: `${data.title || eventData.title} Feedback`,
            fields: feedbackFields.map(field => ({
              id: field.id,
              label: field.label,
              type: field.type,
              required: field.required || false,
              options: field.options,
              placeholder: field.placeholder,
              description: field.description,
              maxRating: field.maxRating,
            }))
          }
          
          await createFeedbackFormMutation.mutateAsync(feedbackFormPayload)
        } else {
          // Update existing feedback form
          const updateFeedbackFormPayload = {
            title: `${data.title || eventData.title} Feedback`,
            fields: feedbackFields.map(field => ({
              id: field.id,
              label: field.label,
              type: field.type,
              required: field.required || false,
              options: field.options,
              placeholder: field.placeholder,
              description: field.description,
              maxRating: field.maxRating,
            }))
          }
          
          await updateFeedbackFormMutation.mutateAsync({
            formId: feedbackFormData.id,
            updateData: updateFeedbackFormPayload
          })
        }
      }
      
      // Redirect to event page
      router.push(`/events/${eventData?.slug}`)
    } catch (error) {
      console.error('Failed to update event:', error)
    }
  }

  // Handle event deletion
  const handleDelete = async () => {
    if (!eventData) return
    
    setIsDeleting(true)
    try {
      await deleteEventMutation.mutateAsync(slug)
      router.push('/events/my-events')
    } catch (error) {
      console.error('Failed to delete event:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  // Loading states
  const isLoading = updateEventMutation.isPending || createFeedbackFormMutation.isPending || updateFeedbackFormMutation.isPending
  const isFormLoading = isLoadingEvent || !eventData

  // Error state
  if (eventError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Event Not Found</h1>
          <p className="text-gray-400 mb-4">The event you&apos;re trying to edit doesn&apos;t exist or you don&apos;t have permission to edit it.</p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isFormLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 bg-gray-950" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500 mx-auto mb-4" />
                <p className="text-gray-400">Loading event details...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Parallax Hero Section */}
      {eventData && (
        <div className="relative">
          {/* Event Image with Parallax */}
          <motion.div 
            className="relative h-80 lg:h-96 overflow-hidden mt-12"
            style={{ 
              opacity: imageOpacity,
              scale: imageScale,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 0
            }}
          >
            <Image
              src={(typeof eventData.imageUrl === 'string' && eventData.imageUrl) 
                ? eventData.imageUrl 
                : '/events-placeholder.png'
              }
              alt={eventData.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
          </motion.div>

          {/* Content Container with proper z-index */}
          <div className="relative z-10 h-80 lg:h-96">
            {/* Event Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">
                {/* Navigation and Badge */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <EventNavigationDropdown 
                      eventSlug={slug}
                      currentPage="edit"
                      onBack={() => router.push(`/events/${slug}`)}
                    />

                    <div className="flex items-center space-x-2 text-sm text-blue-400 bg-blue-500/20 backdrop-blur-sm p-2 px-4 border border-blue-500/30 rounded-md">
                      <Edit className="h-4 w-4" />
                      Edit Mode
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Delete Event Button */}
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-red-700 text-red-300 hover:bg-red-800/20 hover:text-red-200 bg-gray-900/80 backdrop-blur-sm"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Event
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-800">
                        <DialogHeader>
                          <DialogTitle className="text-white">Delete Event</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Are you sure you want to delete this event? This action cannot be undone and will remove all associated data including attendees and feedback.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                            className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Deleting...
                              </>
                            ) : (
                              'Delete Event'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Title and Description */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1 className="text-4xl lg:text-5xl font-bold font-space-grotesk tracking-tight text-white mb-4">
                    Edit{' '}
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Event
                    </span>
                  </h1>
                  <p className="text-lg text-gray-300 max-w-4xl leading-relaxed">
                    Update your event details and settings
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Positioned to start after hero */}
      <div className="relative z-20 bg-gray-950 mt-0">
        <div className="space-y-8 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Event Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-2xl shadow-purple-500/5">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-xl text-white">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <Calendar className="h-5 w-5 text-white" />
                        </div>
                        Event Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Event Title *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter a compelling event title..."
                                {...field}
                                className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Event Type */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Event Type
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-12 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={CreateEventDtoTypeEnum.IN_PERSON}>
                                  🏢 In-Person - Physical attendance required
                                </SelectItem>
                                <SelectItem value={CreateEventDtoTypeEnum.VIRTUAL}>
                                  🌐 Virtual - Online participation
                                </SelectItem>
                                <SelectItem value={CreateEventDtoTypeEnum.HYBRID}>
                                  🔄 Hybrid - Both in-person and virtual options
                                </SelectItem>
                                <SelectItem value={CreateEventDtoTypeEnum.OTHERS}>
                                  📅 Other - Other event format
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Brief Description
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Write a brief, engaging description that will appear in event cards and previews..."
                                {...field}
                                rows={2}
                                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              A concise description that will appear in event cards and search results (max 500 characters).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Details */}
                      <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Detailed Information
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Provide comprehensive details about your event - agenda, requirements, what attendees can expect, speaker information, prerequisites, etc."
                                {...field}
                                rows={6}
                                className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 resize-none transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Detailed information that will appear on the event page. Include agenda, requirements, speaker bios, etc. (max 5000 characters).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Date and Time */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-200">
                                Start Date & Time *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  {...field}
                                  className="h-12 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage className='text-red-500'/>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-200">
                                End Date & Time (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="datetime-local"
                                  {...field}
                                  className="h-12 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Minimum Attendance Minutes */}
                      <FormField
                        control={form.control}
                        name="minimumAttendanceMinutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">
                              Minimum Attendance (Minutes)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="1440"
                                placeholder="Enter required minutes (e.g., 60)"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Minimum number of minutes attendees must be present to qualify for certificates or benefits. Leave 0 for no minimum requirement.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Image URL */}
                      <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium flex items-center gap-2 text-gray-200">
                              <ImageIcon className="h-4 w-4" />
                              Event Image URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="url"
                                placeholder="https://example.com/your-event-image.jpg"
                                {...field}
                                className="h-12 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Add an image to make your event more appealing. Use a high-quality image (recommended: 1200x630px).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Tags */}
                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-200">Tags *</FormLabel>
                            <div className="space-y-3">
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Add a tag..."
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={handleTagInputKeyDown}
                                  className="flex-1 h-10 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                                />
                                <Button
                                  type="button"
                                  onClick={addTag}
                                  disabled={!tagInput.trim()}
                                  className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {field.value && field.value.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {field.value.map((tag, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="bg-purple-500/20 text-purple-300 border-purple-500/30 pr-1"
                                    >
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                      <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 hover:text-red-400 transition-colors"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Feedback Form Builder */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-2xl shadow-purple-500/5">
                    <CardContent>
                      <FormBuilder
                        initialFields={feedbackFields}
                        onFieldsChange={setFeedbackFields}
                      />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Submit Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 pt-6"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating Event...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Update Event
                      </div>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}
