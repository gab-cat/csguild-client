import { z } from 'zod'

// Simple blog creation schema for the basic create page
export const simpleBlogSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  subtitle: z.string()
    .max(300, 'Subtitle must be less than 300 characters')
    .optional(),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50,000 characters'),
  excerpt: z.string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional(),
  metaDescription: z.string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
  tagNames: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
})

export type SimpleBlogFormData = z.infer<typeof simpleBlogSchema>
