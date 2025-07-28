'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Sparkles, ImageIcon, Plus, X, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DateTimePicker } from '@/components/ui/date-time-picker'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { CreateEventDto, CreateFeedbackFormDto } from '@generated/api-client'
import { CreateEventDtoTypeEnum } from '@generated/api-client'

import { useCreateEventMutation, useCreateFeedbackFormMutation } from '../../hooks'
import { createEventSchema, type CreateEventSchemaType } from '../../schemas'
import type { FormField as FeedbackFormField } from '../../types'
import { formatDateForApi } from '../../utils'

import { FormBuilder } from './form-builder/form-builder'


export function CreateEventClient() {
  const router = useRouter()
  const createEventMutation = useCreateEventMutation()
  const createFeedbackFormMutation = useCreateFeedbackFormMutation()

  // Feedback form state
  const [feedbackFields, setFeedbackFields] = useState<FeedbackFormField[]>([])
  const [tagInput, setTagInput] = useState('')

  // Initialize React Hook Form with Zod resolver
  const form = useForm<CreateEventSchemaType>({
    resolver: zodResolver(createEventSchema),
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

  // Handle tag management
  const addTag = () => {
    const currentTags = form.getValues('tags')
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues('tags')
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Handle form submission
  const onSubmit = async (data: CreateEventSchemaType) => {
    try {
      // Prepare event data with correct structure
      const createEventPayload: CreateEventDto = {
        title: data.title,
        type: data.type,
        description: data.description,
        details: data.details,
        startDate: formatDateForApi(data.startDate),
        endDate: data.endDate ? formatDateForApi(data.endDate) : undefined,
        imageUrl: data.imageUrl || undefined,
        tags: data.tags,
        minimumAttendanceMinutes: data.minimumAttendanceMinutes && data.minimumAttendanceMinutes > 0 
          ? data.minimumAttendanceMinutes 
          : undefined,
      }

      // First, create the event
      const eventResult = await createEventMutation.mutateAsync(createEventPayload)
      
      // If feedback fields exist, create the feedback form separately
      if (feedbackFields.length > 0 && eventResult.event?.id) {
        const feedbackFormPayload: CreateFeedbackFormDto = {
          eventId: eventResult.event.id,
          title: `${data.title} Feedback`,
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
        
        // Wait for feedback form creation before redirecting
        await createFeedbackFormMutation.mutateAsync(feedbackFormPayload)
      }
      
      // Only redirect after both event and feedback form (if any) are created
      router.push(`/events/${eventResult.event.slug}`)
    } catch (error) {
      console.error('Failed to create event:', error)
    }
  }

  const isLoading = createEventMutation.isPending || createFeedbackFormMutation.isPending

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gray-950" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      {/* Main Content */}

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold font-space-grotesk tracking-tight text-white">
                  Create New 
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {' '}Event
                  </span>
                </h1>
                <p className="text-gray-400 text-lg">
                  Set up your event details and custom feedback form to engage your community
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                asChild 
                className="hover:bg-gray-800/50 text-gray-300 hover:text-white transition-colors w-fit"
              >
                <Link href="/events">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
            </div>
          </motion.div>

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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select start date and time"
                                className="h-12 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Select when your event will begin. Time zone will be automatically detected.
                            </FormDescription>
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
                              <DateTimePicker
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Select end date and time"
                                className="h-12 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all duration-200"
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-gray-500">
                              Optional: Select when your event will end. Leave empty for single-day events.
                            </FormDescription>
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
                            {field.value.length > 0 && (
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
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Event...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Create Event
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
