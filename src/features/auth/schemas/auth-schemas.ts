import { z } from 'zod'

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Register schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  birthdate: z
    .string()
    .min(1, 'Birthdate is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    }, 'You must be between 13 and 100 years old'),
  course: z
    .string()
    .min(1, 'Course is required')
    .max(100, 'Course name must not exceed 100 characters'),
  rfidId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Email verification schema
export const emailVerificationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  verificationCode: z
    .string()
    .min(6, 'Verification code must be 6 digits')
    .max(6, 'Verification code must be 6 digits')
    .regex(/^[0-9]+$/, 'Verification code must contain only numbers'),
})

// RFID login schema
export const rfidLoginSchema = z.object({
  rfidId: z
    .string()
    .min(1, 'RFID card ID is required')
    .max(50, 'RFID card ID is too long'),
})

// Resend verification schema
export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

// RFID registration schema
export const rfidRegistrationSchema = z.object({
  rfidId: z
    .string()
    .min(1, 'RFID card ID is required')
    .max(50, 'RFID card ID is too long'),
})

// Multi-step registration schemas
export const registrationStep1Schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  birthdate: z
    .string()
    .min(1, 'Birthdate is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    }, 'You must be between 13 and 100 years old'),
  course: z
    .string()
    .min(1, 'Course is required')
    .max(100, 'Course name must not exceed 100 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const registrationStep2Schema = z.object({
  rfidId: z
    .string()
    .min(1, 'RFID card ID is required')
    .max(50, 'RFID card ID is too long'),
})

// Complete registration data type (without refinement for API)
export const completeRegistrationSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  password: passwordSchema,
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must not exceed 50 characters'),
  birthdate: z
    .string()
    .min(1, 'Birthdate is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    }, 'You must be between 13 and 100 years old'),
  course: z
    .string()
    .min(1, 'Course is required')
    .max(100, 'Course name must not exceed 100 characters'),
  rfidId: z.string().optional(),
})

// Google OAuth callback schema
export const googleCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
})

// Google OAuth user update schema (for completing profile)
export const googleUserUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  birthdate: z
    .string()
    .min(1, 'Birthdate is required')
    .refine((date) => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 13 && age <= 100
    }, 'You must be between 13 and 100 years old')
    .optional(),
  course: z
    .string()
    .min(1, 'Course is required')
    .max(100, 'Course name must not exceed 100 characters')
    .optional(),
  rfidId: z
    .string()
    .min(1, 'RFID Card ID is required')
    .optional(),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>
export type RfidLoginFormData = z.infer<typeof rfidLoginSchema>
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>
export type RfidRegistrationFormData = z.infer<typeof rfidRegistrationSchema>
export type GoogleCallbackData = z.infer<typeof googleCallbackSchema>
export type GoogleUserUpdateData = z.infer<typeof googleUserUpdateSchema>

// Multi-step registration types
export type RegistrationStep1Data = z.infer<typeof registrationStep1Schema>
export type RegistrationStep2Data = z.infer<typeof registrationStep2Schema>
export type CompleteRegistrationData = z.infer<typeof completeRegistrationSchema> 