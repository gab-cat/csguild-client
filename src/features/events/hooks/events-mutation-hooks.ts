'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showSuccessToast, showErrorToast } from '@/lib/toast'
import type { 
  CreateEventDto, 
  UpdateEventDto, 
  CreateFeedbackFormDto,
  UpdateFeedbackFormDto,
  SubmitFeedbackResponseDto,
  ToggleSessionDto,
  SubmitOrganizerRatingDto
} from '@generated/api-client'

import { eventsApiUtils, feedbackApiUtils } from '../utils'

import { QUERY_KEYS } from './events-query-hooks'

// Events Mutation Hooks
export const useCreateEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventData: CreateEventDto) => eventsApiUtils.createEvent(eventData),
    onSuccess: (data) => {
      showSuccessToast('Event created successfully!')
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_CREATED_EVENTS] })
      
      // Set the created event in cache
      queryClient.setQueryData([QUERY_KEYS.EVENT, data.event.slug], data.event)
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to create event')
    },
  })
}

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, updateData }: { slug: string; updateData: UpdateEventDto }) =>
      eventsApiUtils.updateEvent(slug, updateData),
    onSuccess: (data, variables) => {
      showSuccessToast('Event updated successfully!', 'The event has been updated successfully.')
      
      // Invalidate and update relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_CREATED_EVENTS] })
      queryClient.setQueryData([QUERY_KEYS.EVENT, variables.slug], data.event)
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to update event', 'Please try again later.')
    },
  })
}

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => eventsApiUtils.deleteEvent(slug),
    onSuccess: (_, slug) => {
      showSuccessToast('Event deleted successfully!', 'The event has been removed from your list.')
      
      // Remove from cache and invalidate queries
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.EVENT, slug] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_CREATED_EVENTS] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to delete event')
    },
  })
}

export const useToggleSessionMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionData: ToggleSessionDto) => eventsApiUtils.toggleSession(sessionData),
    onSuccess: () => {
      
      // Invalidate session-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT_SESSIONS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT_ATTENDEES] })
    },
  })
}

export const useRegisterToEventMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => eventsApiUtils.registerToEvent(slug),
    onSuccess: () => {
      showSuccessToast('Successfully registered for event!', 'You will receive updates and reminders.')
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT_ATTENDEES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MY_ATTENDED_EVENTS] })
    },
    onError: (error: Error) => {
      showErrorToast('Failed to register for event', error?.message ?? 'Please try again later.')
    },
  })
}

// Feedback Mutation Hooks
export const useCreateFeedbackFormMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (formData: CreateFeedbackFormDto) => feedbackApiUtils.createFeedbackForm(formData),
    onSuccess: (data) => {
      showSuccessToast('Feedback form created successfully!', 'You can now collect feedback for your event.')
      
      // Set the created form in cache
      queryClient.setQueryData([QUERY_KEYS.FEEDBACK_FORM, data.eventId], data)
      
      // Invalidate event query to update with feedback form info
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to create feedback form', 'Please try again later.')
    },
  })
}

export const useUpdateFeedbackFormMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ formId, updateData }: { formId: string; updateData: UpdateFeedbackFormDto }) =>
      feedbackApiUtils.updateFeedbackForm(formId, updateData),
    onSuccess: (data) => {
      showSuccessToast('Feedback form updated successfully!', 'Your changes have been saved.')
      
      // Update the feedback form cache
      queryClient.setQueryData([QUERY_KEYS.FEEDBACK_FORM, data.feedbackForm.eventId], data.feedbackForm)
      
      // Invalidate event query to update with feedback form info
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EVENT] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to update feedback form', 'Please try again later.')
    },
  })
}

export const useSubmitFeedbackResponseMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (responseData: SubmitFeedbackResponseDto) => 
      feedbackApiUtils.submitFeedbackResponse(responseData),
    onSuccess: () => {
      showSuccessToast('Feedback submitted successfully!', 'Thank you for your feedback!')
      
      // Invalidate feedback-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDBACK_FORM] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to submit feedback', 'Please try again later.')
    },
  })
}

export const useSubmitOrganizerRatingMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, ratingData }: { slug: string; ratingData: SubmitOrganizerRatingDto }) =>
      eventsApiUtils.submitOrganizerRating(slug, ratingData),
    onSuccess: () => {
      showSuccessToast('Organizer rating submitted successfully!', 'Thank you for rating the organizer!')
      
      // Invalidate organizer statistics to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANIZER_STATISTICS] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to submit organizer rating', 'Please try again later.')
    },
  })
}

// Public Feedback Mutation Hooks (for token-based access)
export const useSubmitFeedbackResponsePublicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ token, userId, responseData }: { 
      token: string
      userId: string
      responseData: SubmitFeedbackResponseDto 
    }) => feedbackApiUtils.submitFeedbackResponsePublic(token, userId, responseData),
    onSuccess: () => {
      showSuccessToast('Feedback submitted successfully!', 'Thank you for your feedback!')
      
      // Invalidate feedback-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FEEDBACK_FORM] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to submit feedback', 'Please try again later.')
    },
  })
}

export const useSubmitOrganizerRatingPublicMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ token, userId, ratingData }: { 
      token: string
      userId: string
      ratingData: SubmitOrganizerRatingDto 
    }) => feedbackApiUtils.submitOrganizerRatingPublic(token, userId, ratingData),
    onSuccess: () => {
      showSuccessToast('Organizer rating submitted successfully!', 'Thank you for rating the organizer!')
      
      // Invalidate organizer statistics to refresh the data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORGANIZER_STATISTICS] })
    },
    onError: (error: Error) => {
      showErrorToast(error?.message || 'Failed to submit organizer rating', 'Please try again later.')
    },
  })
}
