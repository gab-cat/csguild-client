import type {
  LoginFormData,
  EmailVerificationFormData,
  RfidLoginFormData,
  ResendVerificationFormData,
  RfidRegistrationFormData,
  GoogleCallbackData,
  GoogleUserUpdateData,
} from '../schemas'
import { useAuthStore } from '../stores/auth-store'
import type {
  RegisterRequestData,
  LoginResponse,
  RegisterResponse,
  EmailVerificationResponse,
  RfidLoginResponse,
  RfidRegistrationResponse,
  User,
} from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

export class AuthApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'AuthApiError'
  }
}

let refreshPromise: Promise<LoginResponse> | null = null

async function refreshAccessToken(): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new AuthApiError(response.status, 'Failed to refresh token')
  }

  const data: LoginResponse = await response.json()
  return data
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options
  const authStore = useAuthStore.getState()
  const isAuthenticated = authStore.isAuthenticated

  const headers = new Headers(fetchOptions.headers)
  headers.set('Content-Type', 'application/json')

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const makeRequest = async () => {
    const response = await fetch(url, {
      ...fetchOptions,
      credentials: 'include', // Important for cookie-based auth
      headers,
    })

    if (response.status === 401 && !skipAuth && isAuthenticated) {
      // Token might be expired, try to refresh
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }

      try {
        await refreshPromise
        refreshPromise = null
        
        // Retry the original request
        return makeRequest()
      } catch {
        refreshPromise = null
        authStore.clearAuth()
        throw new AuthApiError(401, 'Session expired. Please login again.')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new AuthApiError(
        response.status,
        errorData.message || `Request failed with status ${response.status}`,
        errorData
      )
    }

    // Handle empty responses
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T
    }

    return response.json()
  }

  return makeRequest()
}

// Helper functions for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
}

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/login', credentials, { skipAuth: true })
  },

  // Register new user
  register: async (userData: RegisterRequestData): Promise<RegisterResponse> => {
    return api.post<RegisterResponse>('/users', userData, { skipAuth: true })
  },

  // Verify email with code
  verifyEmail: async (data: EmailVerificationFormData): Promise<EmailVerificationResponse> => {
    return api.post<EmailVerificationResponse>('/users/verify-email', data, { skipAuth: true })
  },

  // Resend verification email
  resendVerification: async (data: ResendVerificationFormData): Promise<EmailVerificationResponse> => {
    return api.post<EmailVerificationResponse>('/users/resend-verification', data, { skipAuth: true })
  },

  // RFID login
  rfidLogin: async (data: RfidLoginFormData): Promise<RfidLoginResponse> => {
    return api.post<RfidLoginResponse>('/auth/rfid-login', data, { skipAuth: true })
  },

  // Register RFID card
  registerRfid: async (data: RfidRegistrationFormData): Promise<RfidRegistrationResponse> => {
    return api.post<RfidRegistrationResponse>('/users/register-rfid', data)
  },

  // Refresh access token
  refreshToken: async (): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/refresh', undefined, { skipAuth: true })
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
    window.location.href = `${API_BASE_URL}/auth/google`
  },

  // Google OAuth callback
  googleCallback: async (data: GoogleCallbackData): Promise<LoginResponse> => {
    return api.post<LoginResponse>('/auth/google/callback', data, { skipAuth: true })
  },

  // Update user profile (for Google OAuth users)
  updateUserProfile: async (data: GoogleUserUpdateData): Promise<User> => {
    return api.patch<User>('/users/profile', data)
  },
} 