'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageSquare, Send, Star, Calendar, Clock, User, CheckCircle, Award } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { api, Id, useMutation } from '@/lib/convex'
import { showSuccessToast } from '@/lib/toast'

import type { OrganizerRatingSchemaType } from '../../schemas'
import type { FeedbackFormFieldDto } from '../../types'
import { OrganizerRatingForm } from '../shared'


interface EventFeedbackClientProps {
  eventSlug: string
}

export function EventFeedbackClient({ eventSlug }: EventFeedbackClientProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizerRating, setOrganizerRating] = useState<OrganizerRatingSchemaType | undefined>(undefined)
  // @ts-ignore
  const event = useQuery(api.events.getEventBySlug, { slug: eventSlug })
  const feedbackStatus = useQuery(api.events.checkFeedbackStatus, { eventSlug })
  const feedbackForm = useQuery(api.events.getFeedbackForm, { eventId: event?.id as Id<"events"> })

  const isLoading = event === undefined || feedbackForm === undefined || feedbackStatus === undefined
  const error = null // Error handling is done in Convex queries/mutations

  const submitFeedbackMutation = useMutation(api.events.submitFeedbackResponse)
  const submitOrganizerRatingMutation = useMutation(api.events.rateOrganizer)
  
  // Simple form without complex validation - validation handled on server
  const { register, handleSubmit: handleFormSubmit, setValue, watch, formState: { errors } } = useForm<Record<string, string | number | string[]>>({
    defaultValues: {}
  })
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  const handleSubmit = async (data: Record<string, string | number | string[]>) => {
    if (!feedbackForm?.id) return
    
    setIsSubmitting(true)
    
    try {
      // Submit feedback response
      await submitFeedbackMutation({
        eventSlug,
        responses: Object.entries(data).reduce((acc, [fieldId, value]) => {
          if (Array.isArray(value)) {
            acc[fieldId] = value.join(',')
          } else {
            acc[fieldId] = String(value)
          }
          return acc
        }, {} as Record<string, string>)
      })

      // Submit organizer rating if provided
      if (organizerRating && organizerRating.rating) {
        await submitOrganizerRatingMutation({
          eventSlug,
          rating: organizerRating.rating,
          comment: organizerRating.comment
        })
      }
      
      router.push(`/events/${eventSlug}`)
    } catch {
      // Error handling is done in mutation hooks
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const handleRequestCertification = () => {
    showSuccessToast('Certification feature coming soon!')
  }
  
  const renderField = (field: FeedbackFormFieldDto, index: number) => {
    const fieldValue = watch(field.id)
    
    return (
      <motion.div 
        key={field.id} 
        className="space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.1,
          ease: "easeOut"
        }}
      >
        <label className="text-white flex items-center gap-2">
          {field.label}
          {field.required && <span className="text-red-400">*</span>}
        </label>
        
        {field.description && (
          <motion.p 
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
          >
            {field.description}
          </motion.p>
        )}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          {field.type === 'text' && (
            <Input
              {...register(field.id, { required: field.required })}
              placeholder={field.placeholder}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 transition-all duration-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />  
          )}
          
          {field.type === 'textarea' && (
            <Textarea
              {...register(field.id, { required: field.required })}
              placeholder={field.placeholder}
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 min-h-[100px] transition-all duration-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          )}
          
          {field.type === 'radio' && (
            <RadioGroup
              onValueChange={(value) => setValue(field.id, value)}
              value={typeof fieldValue === 'string' ? fieldValue : ''}
              className="space-y-2"
            >
              {field.options?.map((option: string, optionIndex: number) => (
                <motion.div 
                  key={optionIndex} 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1 + optionIndex * 0.05 + 0.3 
                  }}
                >
                  <RadioGroupItem value={option} id={`${field.id}-${optionIndex}`} />
                  <label
                    htmlFor={`${field.id}-${optionIndex}`}
                    className="text-white cursor-pointer hover:text-purple-300 transition-colors duration-200"
                  >
                    {option}
                  </label>
                </motion.div>
              ))}
            </RadioGroup>
          )}
          
          {field.type === 'checkbox' && (
            <div className="space-y-2">
              {field.options?.map((option: string, optionIndex: number) => (
                <motion.div 
                  key={optionIndex} 
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.1 + optionIndex * 0.05 + 0.3 
                  }}
                >
                  <Checkbox
                    id={`${field.id}-${optionIndex}`}
                    checked={Array.isArray(fieldValue) ? fieldValue.includes(option) : false}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(fieldValue) ? fieldValue : []
                      if (checked) {
                        setValue(field.id, [...currentValues, option])
                      } else {
                        setValue(field.id, currentValues.filter((v: string) => v !== option))
                      }
                    }}
                  />
                  <label
                    htmlFor={`${field.id}-${optionIndex}`}
                    className="text-white cursor-pointer hover:text-purple-300 transition-colors duration-200"
                  >
                    {option}
                  </label>
                </motion.div>
              ))}
            </div>
          )}
          
          {field.type === 'select' && (
            <Select 
              onValueChange={(value) => setValue(field.id, value)}
              value={typeof fieldValue === 'string' ? fieldValue : ''}
            >
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white transition-all duration-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string, optionIndex: number) => (
                  <SelectItem key={optionIndex} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {field.type === 'rating' && (
            <div className="flex items-center space-x-1">
              {Array.from({ length: field.maxRating || 5 }, (_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setValue(field.id, i + 1)}
                  className={`p-1 rounded transition-all duration-200 ${
                    (typeof fieldValue === 'number' ? fieldValue : 0) > i
                      ? 'text-yellow-400 hover:text-yellow-300'
                      : 'text-gray-600 hover:text-gray-400'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.1 + i * 0.05 + 0.4 
                  }}
                >
                  <Star className="w-6 h-6 fill-current" />
                </motion.button>
              ))}
              <motion.span 
                className="ml-2 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
              >
                {typeof fieldValue === 'number' && fieldValue > 0 
                  ? `${fieldValue}/${field.maxRating || 5}` 
                  : 'Not rated'}
              </motion.span>
            </div>
          )}
        </motion.div>
        
        {errors[field.id] && (
          <motion.p 
            className="text-red-400 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {field.label} is required
          </motion.p>
        )}
      </motion.div>
    )
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span 
                className="text-gray-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                Loading feedback form...
              </motion.span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
  
  if (error || !event) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900/50 border-red-500/20">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <motion.div 
                    className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <MessageSquare className="h-8 w-8 text-red-400" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-red-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Failed to load event
                  </motion.h3>
                  <motion.p 
                    className="text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    An error occurred while loading the event. Please try again later.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      <Link href="/my-events">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Events
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Handle case where user has already submitted feedback
  if (feedbackStatus?.hasSubmittedFeedback) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900/50 border-green-500/20">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <motion.div 
                    className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-green-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    Feedback Already Submitted
                  </motion.h3>
                  <motion.p 
                    className="text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    Thank you! You have already submitted feedback for this event.
                  </motion.p>
                  <motion.div 
                    className="flex items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      <Link href={`/events/${eventSlug}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Event
                      </Link>
                    </Button>
                    <Button 
                      onClick={handleRequestCertification}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Request Certification
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Handle case where no feedback form exists
  if (!feedbackForm) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-gray-900/50 border-yellow-500/20">
              <CardContent className="p-12 text-center">
                <div className="max-w-md mx-auto space-y-4">
                  <motion.div 
                    className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                  >
                    <MessageSquare className="h-8 w-8 text-yellow-400" />
                  </motion.div>
                  <motion.h3 
                    className="text-lg font-semibold text-yellow-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    No Feedback Form Available
                  </motion.h3>
                  <motion.p 
                    className="text-gray-400"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    This event does not have a feedback form available at this time.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                  >
                    <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      <Link href={`/events/${eventSlug}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Event
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" asChild className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link href={`/events/${eventSlug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Event
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Event Feedback</h1>
              <p className="text-gray-400">Share your experience and help us improve</p>
            </div>
          </div>
        </motion.div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Info Sidebar */}
          <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-gray-900/50 border-gray-800 sticky top-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <motion.div
                    initial={{ rotate: -10, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </motion.div>
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <h3 className="text-base font-bold tracking-tight text-white mb-2">{event.title}</h3>
                  <Separator className="mb-4 text-white bg-white/50" />
                  <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                    <User className="h-4 w-4" />
                    <span>by {event.organizer?.firstName || 'Unknown'} {event.organizer?.lastName || 'User'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(event.startDate.toString())}</span>
                  </div>
                </motion.div>
                
                {event.tags && event.tags.length > 0 && (
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                  >
                    {event.tags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: 0.7 + index * 0.1,
                          type: "spring",
                          stiffness: 300
                        }}
                      >
                        <Badge 
                          variant="outline" 
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {tag}
                        </Badge>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Feedback Form */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <CardTitle className="text-white">Feedback Form</CardTitle>
                  <p className="text-gray-400">
                    Please take a moment to share your thoughts about this event
                  </p>
                </motion.div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit(handleSubmit)} className="space-y-6">
                  {feedbackForm.fields && Array.isArray(feedbackForm.fields) ? feedbackForm.fields.map((field, index) => renderField(field, index)) : null}
                  
                  {/* Organizer Rating Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.7 + (Array.isArray(feedbackForm.fields) ? feedbackForm.fields.length : 0) * 0.1 
                    }}
                  >
                    <OrganizerRatingForm
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      event={event as any}
                      value={organizerRating}
                      onChange={setOrganizerRating}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                    
                  <motion.div 
                    className="flex items-center justify-end gap-4 pt-6 border-t border-gray-800"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: 0.8 + (Array.isArray(feedbackForm.fields) ? feedbackForm.fields.length : 0) * 0.1 
                    }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/events/${eventSlug}`)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800 transition-all duration-200"
                    >
                        Cancel
                    </Button>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div 
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                              Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                              Submit {organizerRating ? 'Feedback & Rating' : 'Feedback'}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
