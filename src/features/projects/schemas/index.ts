import { z } from 'zod'

// Project role schema for project creation
export const projectRoleSchema = z.object({
  roleSlug: z.string().min(1, 'Role is required'),
  maxMembers: z.number().min(1, 'Must have at least 1 member').max(50, 'Cannot exceed 50 members'),
  requirements: z.string().optional(),
})

// Create project schema
export const createProjectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  tags: z.array(z.string().min(1, 'Tag cannot be empty'))
    .min(1, 'At least one tag is required')
    .max(10, 'Cannot have more than 10 tags'),
  dueDate: z.string()
    .refine((date) => new Date(date) > new Date(), {
      message: 'Due date must be in the future',
    }),
  roles: z.array(projectRoleSchema)
    .min(1, 'At least one role is required')
    .max(10, 'Cannot have more than 10 roles'),
})

// Join project schema
export const joinProjectSchema = z.object({
  projectSlug: z.string().min(1, 'Project slug is required'),
  roleSlug: z.string().min(1, 'Role is required'),
  message: z.string()
    .min(10, 'Application message must be at least 10 characters')
    .max(500, 'Application message cannot exceed 500 characters'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions to proceed',
  }),
})

// Review application schema
export const reviewApplicationSchema = z.object({
  applicationId: z.string().min(1, 'Application ID is required'),
  decision: z.enum(['APPROVED', 'REJECTED'], {
    required_error: 'Decision is required',
  }),
  reviewMessage: z.string()
    .max(500, 'Review message cannot exceed 500 characters')
    .optional(),
})

// Update project schema
export const updateProjectSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description cannot exceed 2000 characters')
    .optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty'))
    .min(1, 'At least one tag is required')
    .max(10, 'Cannot have more than 10 tags')
    .optional(),
  dueDate: z.string()
    .refine((date) => new Date(date) > new Date(), {
      message: 'Due date must be in the future',
    })
    .optional(),
  roles: z.array(projectRoleSchema)
    .min(1, 'At least one role is required')
    .max(10, 'Cannot have more than 10 roles')
    .optional(),
})

// Project filters schema
export const projectFiltersSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  ownerSlug: z.string().optional(),
  page: z.number().min(1, 'Page must be at least 1').optional(),
  limit: z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'dueDate', 'title']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

// Type exports for forms
export type CreateProjectFormData = z.infer<typeof createProjectSchema>
export type JoinProjectFormData = z.infer<typeof joinProjectSchema>
export type ReviewApplicationFormData = z.infer<typeof reviewApplicationSchema>
export type UpdateProjectFormData = z.infer<typeof updateProjectSchema>
export type ProjectFiltersFormData = z.infer<typeof projectFiltersSchema>
export type ProjectRoleFormData = z.infer<typeof projectRoleSchema>
