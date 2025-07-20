import { z } from 'zod'

import { FeedbackFormFieldDtoTypeEnum } from '@generated/api-client'

// Feedback form field schema
export const feedbackFormFieldSchema = z.object({
  id: z.string().min(1, 'Field ID is required'),
  
  label: z.string()
    .min(1, 'Field label is required')
    .max(200, 'Label must be less than 200 characters'),
  
  type: z.enum([
    FeedbackFormFieldDtoTypeEnum.TEXT,
    FeedbackFormFieldDtoTypeEnum.TEXTAREA,
    FeedbackFormFieldDtoTypeEnum.RADIO,
    FeedbackFormFieldDtoTypeEnum.CHECKBOX,
    FeedbackFormFieldDtoTypeEnum.SELECT,
    FeedbackFormFieldDtoTypeEnum.RATING
  ]),
  
  required: z.boolean().optional().default(false),
  
  options: z.array(z.string()).optional(),
  
  placeholder: z.string()
    .max(100, 'Placeholder must be less than 100 characters')
    .optional(),
  
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  maxRating: z.number()
    .min(2, 'Rating scale must have at least 2 points')
    .max(10, 'Rating scale cannot exceed 10 points')
    .optional()
})

// Feedback form schema
export const feedbackFormSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  
  title: z.string()
    .min(3, 'Form title must be at least 3 characters')
    .max(100, 'Form title must be less than 100 characters')
    .optional(),
  
  fields: z.array(feedbackFormFieldSchema)
    .min(1, 'At least one field is required')
    .max(20, 'Maximum 20 fields allowed')
    .refine((fields) => {
      const fieldIds = fields.map(field => field.id)
      const uniqueIds = new Set(fieldIds)
      return fieldIds.length === uniqueIds.size
    }, 'Field IDs must be unique')
})

// Submit feedback response schema
export const submitFeedbackResponseSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  responses: z.record(z.string(), z.union([
    z.string(),
    z.array(z.string()),
    z.number()
  ]))
})

// Form validation helpers
export const validateFormField = (field: unknown) => {
  return feedbackFormFieldSchema.safeParse(field)
}

export const validateFeedbackForm = (form: unknown) => {
  return feedbackFormSchema.safeParse(form)
}

export const validateFeedbackResponse = (response: unknown) => {
  return submitFeedbackResponseSchema.safeParse(response)
}

// Export types from schemas
export type FeedbackFormFieldSchemaType = z.infer<typeof feedbackFormFieldSchema>
export type FeedbackFormSchemaType = z.infer<typeof feedbackFormSchema>
export type SubmitFeedbackResponseSchemaType = z.infer<typeof submitFeedbackResponseSchema>
