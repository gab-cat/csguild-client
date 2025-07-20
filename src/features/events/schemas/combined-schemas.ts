import { z } from 'zod'

import { createEventSchema } from './event-schemas'
import { feedbackFormSchema } from './feedback-schemas'

// Event creation with feedback form schema
export const createEventWithFeedbackSchema = z.object({
  event: createEventSchema,
  feedbackForm: feedbackFormSchema.pick({ title: true, fields: true }).optional()
})

// Organizer rating schema
export const organizerRatingSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
})

// Feedback submission with organizer rating schema
export const feedbackWithRatingSchema = z.object({
  feedbackResponses: z.record(z.string(), z.string()),
  organizerRating: organizerRatingSchema.optional()
})

// Combined schema validation helper
export const validateEventWithFeedback = (data: unknown) => {
  return createEventWithFeedbackSchema.safeParse(data)
}

export const validateFeedbackWithRating = (data: unknown) => {
  return feedbackWithRatingSchema.safeParse(data)
}

export const validateOrganizerRating = (data: unknown) => {
  return organizerRatingSchema.safeParse(data)
}

// Export types from schemas
export type CreateEventWithFeedbackSchemaType = z.infer<typeof createEventWithFeedbackSchema>
export type OrganizerRatingSchemaType = z.infer<typeof organizerRatingSchema>
export type FeedbackWithRatingSchemaType = z.infer<typeof feedbackWithRatingSchema>
