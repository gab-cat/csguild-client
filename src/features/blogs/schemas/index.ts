import { z } from 'zod'

// Re-export simple blog schema
export * from './simple-blog'

// Blog creation schema
export const createBlogSchema = z.object({
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
  metaKeywords: z.array(z.string())
    .max(10, 'Maximum 10 keywords allowed')
    .optional(),
  canonicalUrl: z.string()
    .url('Must be a valid URL')
    .optional(),
  tagNames: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  categoryNames: z.array(z.string())
    .max(5, 'Maximum 5 categories allowed')
    .optional(),
  allowComments: z.boolean().default(true),
  allowBookmarks: z.boolean().default(true),
  allowLikes: z.boolean().default(true),
  allowShares: z.boolean().default(true),
  scheduledFor: z.string().optional(),
})

// Blog update schema (similar to create but with optional title and content)
export const updateBlogSchema = createBlogSchema.partial().extend({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  content: z.string()
    .min(1, 'Content is required')
    .max(50000, 'Content must be less than 50,000 characters')
    .optional(),
})

// Comment creation schema
export const createCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1,000 characters'),
  parentId: z.string().optional(),
})

// Comment update schema
export const updateCommentSchema = z.object({
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment must be less than 1,000 characters'),
})

// Blog filters schema
export const blogFiltersSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  authorSlug: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED']).optional(),
  pinned: z.boolean().optional(),
  featured: z.boolean().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  sortBy: z.enum([
    'createdAt', 
    'updatedAt', 
    'publishedAt', 
    'title', 
    'viewCount', 
    'likeCount', 
    'commentCount'
  ]).optional().default('createdAt'),
  limit: z.number().min(1).max(100).optional().default(20),
  page: z.number().min(1).optional().default(1),
})

// Admin moderation filters schema
export const moderationFiltersSchema = z.object({
  type: z.enum(['blogs', 'comments']).optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED']).optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
})

// Blog moderation schema
export const moderateBlogSchema = z.object({
  moderationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'FLAGGED']),
  moderationNotes: z.string()
    .max(500, 'Moderation notes must be less than 500 characters')
    .optional(),
})

// Flag blog schema
export const flagBlogSchema = z.object({
  reason: z.enum([
    'SPAM',
    'HARASSMENT', 
    'INAPPROPRIATE_CONTENT',
    'COPYRIGHT_VIOLATION',
    'MISINFORMATION',
    'OTHER'
  ]),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
})

// Share blog schema
export const shareBlogSchema = z.object({
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'reddit', 'email', 'copy']),
  message: z.string()
    .max(280, 'Message must be less than 280 characters')
    .optional(),
})

// Tag creation schema
export const createTagSchema = z.object({
  name: z.string()
    .min(1, 'Tag name is required')
    .max(50, 'Tag name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9-_\s]+$/, 'Tag name can only contain letters, numbers, hyphens, underscores, and spaces'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
})

// Category creation schema
export const createCategorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters')
    .regex(/^[a-zA-Z0-9-_\s]+$/, 'Category name can only contain letters, numbers, hyphens, underscores, and spaces'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .optional(),
})

// Search filters schema
export const searchFiltersSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  type: z.enum(['all', 'blogs', 'authors', 'tags', 'categories']).optional().default('all'),
  sortBy: z.enum(['relevance', 'date', 'popularity']).optional().default('relevance'),
  dateRange: z.enum(['all', 'today', 'week', 'month', 'year']).optional().default('all'),
})

// Reading list creation schema
export const createReadingListSchema = z.object({
  name: z.string()
    .min(1, 'Reading list name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  isPublic: z.boolean().optional().default(false),
})

// Blog series creation schema
export const createBlogSeriesSchema = z.object({
  title: z.string()
    .min(1, 'Series title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1,000 characters')
    .optional(),
})

// Analytics date range schema
export const analyticsDateRangeSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  granularity: z.enum(['day', 'week', 'month']).optional().default('day'),
})

// Export types for the schemas
export type CreateBlogFormData = z.infer<typeof createBlogSchema>
export type UpdateBlogFormData = z.infer<typeof updateBlogSchema>
export type CreateCommentFormData = z.infer<typeof createCommentSchema>
export type UpdateCommentFormData = z.infer<typeof updateCommentSchema>
export type BlogFiltersData = z.infer<typeof blogFiltersSchema>
export type ModerationFiltersData = z.infer<typeof moderationFiltersSchema>
export type ModerateBlogFormData = z.infer<typeof moderateBlogSchema>
export type FlagBlogFormData = z.infer<typeof flagBlogSchema>
export type ShareBlogFormData = z.infer<typeof shareBlogSchema>
export type CreateTagFormData = z.infer<typeof createTagSchema>
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>
export type SearchFiltersData = z.infer<typeof searchFiltersSchema>
export type CreateReadingListFormData = z.infer<typeof createReadingListSchema>
export type CreateBlogSeriesFormData = z.infer<typeof createBlogSeriesSchema>
export type AnalyticsDateRangeData = z.infer<typeof analyticsDateRangeSchema>

// Combined schemas for complex forms
export const combinedBlogSchema = z.object({
  basic: createBlogSchema.pick({
    title: true,
    subtitle: true,
    excerpt: true,
  }),
  content: createBlogSchema.pick({
    content: true,
  }),
  settings: createBlogSchema.pick({
    tagNames: true,
    categoryNames: true,
    allowComments: true,
    allowBookmarks: true,
    allowLikes: true,
    allowShares: true,
    scheduledFor: true,
  }),
  seo: createBlogSchema.pick({
    metaDescription: true,
    metaKeywords: true,
    canonicalUrl: true,
  }),
})

export type CombinedBlogFormData = z.infer<typeof combinedBlogSchema>
