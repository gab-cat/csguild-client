'use client'

import { useQuery } from '@tanstack/react-query'

import type { EventFiltersSchemaType } from '../schemas'
import { eventsApiUtils, feedbackApiUtils, feedbackResponsesApiUtils, type FeedbackResponsesFilters } from '../utils'

// Query keys
const QUERY_KEYS = {
  EVENTS: 'events',
  EVENT: 'event',
  PINNED_EVENTS: 'pinned-events',
  MY_CREATED_EVENTS: 'my-created-events',
  MY_ATTENDED_EVENTS: 'my-attended-events',
  EVENT_ATTENDEES: 'event-attendees',
  EVENT_SESSIONS: 'event-sessions',
  FEEDBACK_FORM: 'feedback-form',
  FEEDBACK_STATUS: 'feedback-status',
  FEEDBACK_RESPONSES: 'feedback-responses',
  ORGANIZER_STATISTICS: 'organizer-statistics',
} as const

// Events Query Hooks
export const useEventsQuery = (filters: EventFiltersSchemaType = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENTS, filters],
    queryFn: () => eventsApiUtils.getEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEventQuery = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT, slug],
    queryFn: () => eventsApiUtils.getEventBySlug(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const usePinnedEventsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PINNED_EVENTS],
    queryFn: () => eventsApiUtils.getPinnedEvents(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useMyCreatedEventsQuery = (filters: Omit<EventFiltersSchemaType, 'organizerSlug'> = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_CREATED_EVENTS, filters],
    queryFn: () => eventsApiUtils.getMyCreatedEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useMyAttendedEventsQuery = (filters: EventFiltersSchemaType = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MY_ATTENDED_EVENTS, filters],
    queryFn: () => eventsApiUtils.getMyAttendedEvents(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEventAttendeesQuery = (eventId: string, page = 1, limit = 20) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT_ATTENDEES, eventId, page, limit],
    queryFn: () => eventsApiUtils.getEventAttendees(eventId, page, limit),
    enabled: !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useEventSessionsQuery = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EVENT_SESSIONS, slug],
    queryFn: () => eventsApiUtils.getEventSessions(slug),
    enabled: !!slug,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Feedback Query Hooks
export const useFeedbackFormQuery = (eventId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_FORM, eventId],
    queryFn: () => feedbackApiUtils.getFeedbackForm(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useFeedbackStatusQuery = (slug: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_STATUS, slug],
    queryFn: () => eventsApiUtils.checkFeedbackStatus(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Event Feedback Responses Query Hook
export const useEventFeedbackResponsesQuery = (slug: string, filters: FeedbackResponsesFilters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_RESPONSES, slug, filters],
    queryFn: () => feedbackResponsesApiUtils.getEventFeedbackResponses(slug, filters),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Organizer Statistics Query Hook
export const useOrganizerStatisticsQuery = (username: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORGANIZER_STATISTICS, username],
    queryFn: () => eventsApiUtils.getOrganizerStatistics(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Combined Query Hooks
export const useEventWithAttendees = (slug: string) => {
  const eventQuery = useEventQuery(slug)
  const attendeesQuery = useEventAttendeesQuery(eventQuery.data?.id || '', 1, 20)

  return {
    event: eventQuery.data,
    attendees: attendeesQuery.data,
    isLoadingEvent: eventQuery.isLoading,
    isLoadingAttendees: attendeesQuery.isLoading,
    isLoading: eventQuery.isLoading || attendeesQuery.isLoading,
    error: eventQuery.error || attendeesQuery.error,
    refetchEvent: eventQuery.refetch,
    refetchAttendees: attendeesQuery.refetch,
  }
}

// Public Feedback Query Hook (for token-based access)
export const useFeedbackFormPublicQuery = (eventId: string, token: string, userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FEEDBACK_FORM, 'public', eventId, token, userId],
    queryFn: () => feedbackApiUtils.getFeedbackFormPublic(eventId, token, userId),
    enabled: !!eventId && !!token && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEventWithFeedbackForm = (slug: string) => {
  const eventQuery = useEventQuery(slug)
  const feedbackFormQuery = useFeedbackFormQuery(eventQuery.data?.id || '')
  const feedbackStatusQuery = useFeedbackStatusQuery(slug)

  return {
    event: eventQuery.data,
    feedbackForm: feedbackFormQuery.data,
    feedbackStatus: feedbackStatusQuery.data,
    isLoadingEvent: eventQuery.isLoading,
    isLoadingFeedbackForm: feedbackFormQuery.isLoading,
    isLoadingFeedbackStatus: feedbackStatusQuery.isLoading,
    isLoading: eventQuery.isLoading || feedbackFormQuery.isLoading || feedbackStatusQuery.isLoading,
    error: eventQuery.error || feedbackFormQuery.error || feedbackStatusQuery.error,
    refetchEvent: eventQuery.refetch,
    refetchFeedbackForm: feedbackFormQuery.refetch,
    refetchFeedbackStatus: feedbackStatusQuery.refetch,
  }
}

// Combined hook for public feedback access
export const useEventWithFeedbackFormPublic = (slug: string, token: string, userId: string) => {
  const eventQuery = useEventQuery(slug)
  const feedbackFormQuery = useFeedbackFormPublicQuery(eventQuery.data?.id || '', token, userId)

  return {
    event: eventQuery.data,
    feedbackForm: feedbackFormQuery.data,
    isLoadingEvent: eventQuery.isLoading,
    isLoadingFeedbackForm: feedbackFormQuery.isLoading,
    isLoading: eventQuery.isLoading || feedbackFormQuery.isLoading,
    error: eventQuery.error || feedbackFormQuery.error,
    refetchEvent: eventQuery.refetch,
    refetchFeedbackForm: feedbackFormQuery.refetch,
  }
}

// Export query keys for external use
export { QUERY_KEYS }
