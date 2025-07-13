import { z } from 'zod'

export const updateProfileSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters')
    .optional(),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters')
    .optional(),
  course: z
    .string()
    .max(100, 'Course must be at most 100 characters')
    .optional(),
  birthdate: z
    .string()
    .refine((date) => {
      if (!date) return true
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    }, 'You must be between 13 and 100 years old')
    .optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
