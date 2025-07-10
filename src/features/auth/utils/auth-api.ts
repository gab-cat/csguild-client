import { api } from '@/lib/api'

import type {
  LoginFormData,
  EmailVerificationFormData,
  RfidLoginFormData,
  ResendVerificationFormData,
  RfidRegistrationFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  GoogleCallbackData,
  GoogleUserUpdateData,
} from '../schemas'
import type {
  RegisterRequestData,
  LoginResponse,
  RegisterResponse,
  EmailVerificationResponse,
  RfidLoginResponse,
  RfidRegistrationResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  User,
} from '../types'

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials)
  },

  // Register new user
  register: async (userData: RegisterRequestData): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/users', userData)
  },

  // Verify email with code
  verifyEmail: async (data: EmailVerificationFormData): Promise<EmailVerificationResponse> => {
    return api.post<EmailVerificationResponse>('/users/verify-email', data)
  },

  // Resend verification email
  resendVerification: async (data: ResendVerificationFormData): Promise<EmailVerificationResponse> => {
    return api.post<EmailVerificationResponse>('/users/resend-verification', data)
  },

  // RFID login
  rfidLogin: async (data: RfidLoginFormData): Promise<RfidLoginResponse> => {
    return api.post<RfidLoginResponse>('/auth/rfid-login', data)
  },

  // Register RFID card
  registerRfid: async (data: RfidRegistrationFormData): Promise<RfidRegistrationResponse> => {
    return api.post<RfidRegistrationResponse>('/users/register-rfid', data)
  },

  // Refresh access token
  refreshToken: async (): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh', undefined)
  },

  // Logout user
  logout: async (): Promise<void> => {
    return api.post<void>('/auth/logout')
  },

  // Get current user (if authenticated)
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>('/auth/me')
  },

  // Google OAuth redirect
  googleLogin: (): void => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  },

  // Google OAuth callback
  googleCallback: async (data: GoogleCallbackData): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/google/callback', data)
  },

  // Update user profile (for Google OAuth users)
  updateUserProfile: async (data: GoogleUserUpdateData): Promise<User> => {
    return api.patch<User>('/users/profile', data)
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordFormData): Promise<ForgotPasswordResponse> => {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', data)
  },

  // Reset password
  resetPassword: async (data: Omit<ResetPasswordFormData, 'confirmPassword'>): Promise<ResetPasswordResponse> => {
    return api.post<ResetPasswordResponse>('/auth/reset-password', data)
  },
} 