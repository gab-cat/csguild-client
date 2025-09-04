import { useQuery, useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'

// Hook for getting event with feedback form for public access
export function useEventWithFeedbackFormPublic(eventSlug: string, token: string, userId: string) {
  const result = useQuery(
    api.events.getEventWithFeedbackFormPublic,
    token && userId ? { eventSlug, token, userId } : 'skip'
  )

  return {
    event: result?.event || null,
    feedbackForm: result?.feedbackForm || null,
    isLoading: result === undefined,
    error: null, // Error handling is done in Convex queries
  }
}

// Hook for submitting feedback response for public access
export function useSubmitFeedbackResponsePublicMutation() {
  return useMutation(api.events.submitFeedbackResponsePublic)
}

// Hook for submitting organizer rating for public access
export function useSubmitOrganizerRatingPublicMutation() {
  return useMutation(api.events.submitOrganizerRatingPublic)
}
