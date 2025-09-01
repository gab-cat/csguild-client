import axios, { AxiosInstance } from 'axios'

import { Configuration, AuthenticationApi, UsersApi, FacilitiesApi, AppApi, ProjectsApi, RolesApi, EventsApi, EventFeedbackApi, EventsAdminApi, BlogCommentsApi, BlogManagementApi, BlogModerationApi, BlogsActionsApi, BlogsApi, BlogsExtendedApi } from "@generated/api-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// Track if we're currently refreshing to avoid multiple refresh attempts
let isRefreshing = false
let refreshPromise: Promise<void> | null = null

// Create an axios instance with interceptors for token refresh
const createAxiosWithInterceptors = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Enable cookies for authentication
  })

  // Response interceptor to handle 401 errors and token refresh
  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // If path is /api/auth/login, we don't want to refresh the token
      if (originalRequest.url.includes('/api/auth/login')) {
        return Promise.reject(error.response?.data || error)
      }

      // If we get a 401 and haven't already tried to refresh, attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry && !isRefreshing) {
        originalRequest._retry = true

        try {
          await refreshToken()
          // Retry the original request
          console.log('Refreshed token, retrying request')
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed, continue with the original error
          console.error('Token refresh failed:', refreshError)
          return Promise.reject(error)
        }
      }
      return Promise.reject(error.response?.data || error)
    }
  )

  return axiosInstance
}

// Token refresh function
async function refreshToken(): Promise<void> {
  if (isRefreshing && refreshPromise) {
    await refreshPromise
    return
  }

  isRefreshing = true
  refreshPromise = axios.post(`${API_BASE_URL}/api/auth/refresh`, {}, {
    withCredentials: true
  })
    .then(() => {
      // Token refresh successful, the new tokens are set in cookies
      return
    })
    .catch((error) => {
      // Refresh failed, clear any stored auth state
      console.error('Token refresh failed:', error)
      throw error
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })
  try {
    await refreshPromise
  } catch (error) {
    console.error('Error occurred while refreshing token:', error)
  }
}

// Create the axios instance with interceptors
const axiosWithInterceptors = createAxiosWithInterceptors()

// Create configuration using our axios instance with interceptors
export const configuration = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  baseOptions: {
    withCredentials: true, // Enable cookies for authentication
  },
})

// Centralized API instances - these now automatically use token refresh through axios interceptors
export const authApi = new AuthenticationApi(configuration, undefined, axiosWithInterceptors)
export const usersApi = new UsersApi(configuration, undefined, axiosWithInterceptors)
export const facilitiesApi = new FacilitiesApi(configuration, undefined, axiosWithInterceptors)
export const appApi = new AppApi(configuration, undefined, axiosWithInterceptors)
export const rolesApi = new RolesApi(configuration, undefined, axiosWithInterceptors)
export const projectsApi = new ProjectsApi(configuration, undefined, axiosWithInterceptors)
export const eventsApi = new EventsApi(configuration, undefined, axiosWithInterceptors)
export const eventFeedbackApi = new EventFeedbackApi(configuration, undefined, axiosWithInterceptors)
export const eventsAdminApi = new EventsAdminApi(configuration, undefined, axiosWithInterceptors)

export const blogsApi = new BlogsApi(configuration, undefined, axiosWithInterceptors);
export const blogsActionsApi = new BlogsActionsApi(configuration, undefined, axiosWithInterceptors);
export const blogsExtendedApi = new BlogsExtendedApi(configuration, undefined, axiosWithInterceptors);
export const blogCommentsApi = new BlogCommentsApi(configuration, undefined, axiosWithInterceptors);
export const blogManagementApi = new BlogManagementApi(configuration, undefined, axiosWithInterceptors);
export const blogModerationApi = new BlogModerationApi(configuration, undefined, axiosWithInterceptors);

// API Error class for manual API calls
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





// Manual API client using fetch (for direct API calls if needed)
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  // Make the initial request
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // For cookie-based auth
  })

  // If we get a 401, try to refresh the token
  if (response.status === 401 && !isRefreshing) {
    try {
      await refreshToken()
      
      // Retry the original request
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })
    } catch (refreshError) {
      // Refresh failed, return the original 401 response
      console.error('Token refresh failed:', refreshError)
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    console.error('API request failed:', errorData.response?.data)
    throw new ApiError(
      response.status,
      errorData.response.data.message || `Request failed with status ${response.status}`,
      errorData
    )
  }

  // Handle empty responses
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  return response.json()
}

// Helper functions for common HTTP methods
export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  patch: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: unknown, options?: RequestInit) =>
    apiClient<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, options?: RequestInit) =>
    apiClient<T>(endpoint, { ...options, method: 'DELETE' }),
} 