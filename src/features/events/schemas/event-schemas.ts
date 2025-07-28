import { z } from 'zod'

import { CreateEventDtoTypeEnum } from '@generated/api-client'

// Create base schema without the refine for reuse
const baseCreateEventSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  type: z.enum([
    CreateEventDtoTypeEnum.IN_PERSON,
    CreateEventDtoTypeEnum.VIRTUAL,
    CreateEventDtoTypeEnum.HYBRID,
    CreateEventDtoTypeEnum.OTHERS
  ]).optional(),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  
  details: z.string()
    .min(10, 'Details must be at least 10 characters')
    .max(5000, 'Details must be less than 5000 characters')
    .optional(),
  
  imageUrl: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  
  startDate: z.string()
    .min(1, 'Start date is required')
    .refine((val) => {
      // Accept datetime-local format (YYYY-MM-DDTHH:MM) or ISO string
      const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
      const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
      return datetimeLocalRegex.test(val) || isoStringRegex.test(val) || !isNaN(Date.parse(val))
    }, 'Please enter a valid date and time'),
  
  endDate: z.string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      // Accept datetime-local format (YYYY-MM-DDTHH:MM) or ISO string
      const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/
      const isoStringRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
      return datetimeLocalRegex.test(val) || isoStringRegex.test(val) || !isNaN(Date.parse(val))
    }, 'Please enter a valid end date and time')
    .or(z.literal('')),
  
  tags: z.array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  
  minimumAttendanceMinutes: z.number()
    .min(0, 'Minimum attendance must be at least 1 minute')
    .max(1440, 'Minimum attendance cannot exceed 24 hours')
    .optional()
})

// Event creation schema with cross-field validation
export const createEventSchema = baseCreateEventSchema.refine((data) => {
  if (!data.endDate) return true
  
  const endDate = new Date(data.endDate)
  const startDate = new Date(data.startDate)
  
  return endDate > startDate
}, {
  message: 'End date must be after start date',
  path: ['endDate']
})

// Event update schema (all fields optional except for validation rules) and remove start date validation
export const updateEventSchema = baseCreateEventSchema.partial().refine(
  (data: Partial<z.infer<typeof baseCreateEventSchema>>) => Object.keys(data).length > 0,
  'At least one field must be updated'
)

// Event creation validation helper
export const validateEventCreation = (data: unknown) => {
  return createEventSchema.safeParse(data)
}

// Event update validation helper
export const validateEventUpdate = (data: unknown) => {
  return updateEventSchema.safeParse(data)
}

// Export types from schemas
export type CreateEventSchemaType = z.infer<typeof createEventSchema>
export type UpdateEventSchemaType = z.infer<typeof updateEventSchema>
