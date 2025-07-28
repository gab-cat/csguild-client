import { authApi as authClient, usersApi as usersClient } from '@/lib/api'
import { 
  AuthSuccessResponseDto, 
  CreateUserRequest, 
  EmailVerificationResponseDto, 
  RegisterRfidDto, 
  RfidLoginDto, 
  RfidLoginResponseDto, 
  SendEmailVerificationDto, 
  VerifyEmailDto, 
  RfidRegistrationResponseDto, 
  LoginDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  UserResponseDto, 
  UpdateUserRequest 
} from '@generated/api-client'

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginDto): Promise<AuthSuccessResponseDto> => {
    const response = await authClient.authControllerLogin({
      loginDto: credentials
    })
    return response.data
  },

  // Register new user
  register: async (userData: CreateUserRequest): Promise<AuthSuccessResponseDto> => {
    const response = await usersClient.usersControllerCreateUser({
      createUserRequest: userData
    })
    return response.data
  },

  // Verify email with code
  verifyEmail: async (data: VerifyEmailDto): Promise<EmailVerificationResponseDto> => {
    const response = await usersClient.usersControllerVerifyEmail({
      verifyEmailDto: data
    })
    return response.data
  },

  // Resend verification email
  resendVerification: async (data: SendEmailVerificationDto): Promise<EmailVerificationResponseDto> => {
    const response = await usersClient.usersControllerResendVerification({
      sendEmailVerificationDto: data
    })
    return response.data
  },

  // RFID login
  rfidLogin: async (data: RfidLoginDto): Promise<RfidLoginResponseDto> => {
    const response = await usersClient.usersControllerRfidLogin({
      rfidLoginDto: data
    })
    return response.data
  },

  // Register RFID card
  registerRfid: async (data: RegisterRfidDto): Promise<RfidRegistrationResponseDto> => {
    const response = await usersClient.usersControllerRegisterRfid({
      registerRfidDto: data
    })
    return response.data
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthSuccessResponseDto> => {
    const response = await authClient.authControllerRefresh()
    return response.data
  },

  // Logout user
  logout: async (): Promise<AuthSuccessResponseDto> => {
    const response = await authClient.authControllerLogout()
    return response.data
  },

  // Get current user (if authenticated)
  getCurrentUser: async (): Promise<UserResponseDto> => {
    const response = await authClient.authControllerMe()
    return response.data
  },

  // Update user
  updateUser: async (data: UpdateUserRequest): Promise<UserResponseDto> => {
    const response = await usersClient.usersControllerUpdateUser({
      updateUserRequest: data
    })
    return response.data
  },

  // Google OAuth redirect
  googleLogin: (): void => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordDto): Promise<AuthSuccessResponseDto> => {
    const response = await authClient.authControllerForgotPassword({
      forgotPasswordDto: data
    })
    return {
      message: response.data.message!,
      statusCode: response.data.statusCode!,
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordDto): Promise<AuthSuccessResponseDto> => {
    const response = await authClient.authControllerResetPassword({
      resetPasswordDto: data
    })
    return {
      message: response.data.message!,
      statusCode: response.data.statusCode!,
    }
  },
} 