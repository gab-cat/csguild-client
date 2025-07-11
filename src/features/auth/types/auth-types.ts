import { UserResponseDto } from "@generated/api-client"

// User role types
export type UserRole = 'STUDENT' | 'STAFF' | 'ADMIN'

// Signup method types
export type SignupMethod = 'EMAIL' | 'GOOGLE'

// User/Student data types
export interface User {
  id: string
  email: string
  username: string
  firstName: string
  lastName: string
  birthdate: string
  course: string
  imageUrl?: string
  rfidId?: string
  emailVerified: boolean
  hasRefreshToken: boolean
  hasRfidCard: boolean
  roles: UserRole[]
  signupMethod: SignupMethod
  createdAt: string
  updatedAt: string
}

// Simplified user data for responses

// Auth state interface
export interface AuthState {
  user: UserResponseDto | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// API Response types
export interface ApiResponse<T = unknown> {
  message: string
  statusCode: number
  details?: string
  data?: T
}

// Login response
export interface LoginResponse extends ApiResponse {
  statusCode: 201
}

// Register response
export interface RegisterResponse extends ApiResponse {
  statusCode: 201
  details: string
}

// Email verification response
export interface EmailVerificationResponse extends ApiResponse {
  statusCode: 200
  details: string
}

// RFID login response
export interface RfidLoginResponse extends ApiResponse {
  statusCode: 200
  student: UserResponseDto
}

// RFID registration response
export interface RfidRegistrationResponse extends ApiResponse {
  statusCode: 201
  details: string
}

// Forgot password response
export interface ForgotPasswordResponse extends ApiResponse {
  statusCode: 200
}

// Reset password response
export interface ResetPasswordResponse extends ApiResponse {
  statusCode: 200
}

// Error response
export interface ApiError {
  statusCode: number
  message: string
  error: string
}

// Register request data
export interface RegisterRequestData {
  email: string
  username?: string
  password: string
  firstName: string
  lastName: string
  birthdate: string
  course: string
  rfidId?: string
}

// Auth context type
export interface AuthContextType {
  user: UserResponseDto | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterRequestData) => Promise<void>
  logout: () => Promise<void>
  verifyEmail: (email: string, code: string) => Promise<void>
  resendVerification: (email: string) => Promise<void>
  refreshToken: () => Promise<void>
  registerRfid: (rfidId: string) => Promise<void>
} 