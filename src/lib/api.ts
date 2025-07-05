import { useAuthStore } from '@/src/stores/auth-store'
import type { AuthResponse, RefreshTokenDto } from '@/src/types/auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'

interface FetchOptions extends RequestInit {
  skipAuth?: boolean
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

let refreshPromise: Promise<AuthResponse> | null = null

async function refreshAccessToken(): Promise<AuthResponse> {
  const refreshToken = useAuthStore.getState().tokens?.refreshToken

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken } as RefreshTokenDto),
  })

  if (!response.ok) {
    throw new ApiError(response.status, 'Failed to refresh token')
  }

  const data: AuthResponse = await response.json()
  return data
}

export async function apiClient<T = unknown>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options
  const authStore = useAuthStore.getState()
  const accessToken = authStore.tokens?.accessToken

  const headers = new Headers(fetchOptions.headers)
  
  if (!skipAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  headers.set('Content-Type', 'application/json')

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const makeRequest = async (token?: string) => {
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })

    if (response.status === 401 && !skipAuth && authStore.isAuthenticated) {
      // Token might be expired, try to refresh
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken()
      }

      try {
        const authResponse = await refreshPromise
        authStore.login(authResponse.user, authResponse.tokens)
        refreshPromise = null
        
        // Retry the original request with new token
        return makeRequest(authResponse.tokens.accessToken)
      } catch {
        refreshPromise = null
        authStore.logout()
        throw new ApiError(401, 'Session expired. Please login again.')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new ApiError(
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