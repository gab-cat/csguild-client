import { z } from 'zod'

// Event filters schema for query validation
export const eventFiltersSchema = z.object({
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
  organizerSlug: z.string().optional(),
  pinned: z.boolean().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'startDate', 'endDate', 'title']).optional(),
  limit: z.number().min(1).max(100).optional(),
  page: z.number().min(1).optional()
})

// RFID session toggle schema
export const toggleSessionSchema = z.object({
  rfidId: z.string().min(1, 'RFID ID is required'),
  eventId: z.string().min(1, 'Event ID is required')
})

// Validation helpers
export const validateEventFilters = (filters: unknown) => {
  return eventFiltersSchema.safeParse(filters)
}

export const validateSessionToggle = (data: unknown) => {
  return toggleSessionSchema.safeParse(data)
}

// Export types from schemas
export type EventFiltersSchemaType = z.infer<typeof eventFiltersSchema>
export type ToggleSessionSchemaType = z.infer<typeof toggleSessionSchema>
