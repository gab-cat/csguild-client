import { configuration } from '@/lib/api'
import { AuthenticationApi, 
  AuthSuccessResponseDto, 
  CreateUserRequest, 
  EmailVerificationResponseDto, 
  RegisterRfidDto, 
  RfidLoginDto, 
  RfidLoginResponseDto, 
  SendEmailVerificationDto, 
  UsersApi, VerifyEmailDto, RfidRegistrationResponseDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, UserResponseDto, UpdateUserRequest } from '@generated/api-client'

const auth = new AuthenticationApi(configuration)
const user = new UsersApi(configuration)

// Auth API functions
export const authApi = {
  // Login with email and password
  login: async (credentials: LoginDto): Promise<AuthSuccessResponseDto> => {
    const response = await auth.authControllerLogin({
      loginDto: credentials
    })
    return response.data
  },

  // Register new user
  register: async (userData: CreateUserRequest): Promise<AuthSuccessResponseDto> => {
    const response = await user.usersControllerCreateUser({
      createUserRequest: userData
    })
    return response.data
  },

  // Verify email with code
  verifyEmail: async (data: VerifyEmailDto): Promise<EmailVerificationResponseDto> => {
    const response = await user.usersControllerVerifyEmail({
      verifyEmailDto: data
    })
    return response.data
  },

  // Resend verification email
  resendVerification: async (data: SendEmailVerificationDto): Promise<EmailVerificationResponseDto> => {
    const response = await user.usersControllerResendVerification({
      sendEmailVerificationDto: data
    })
    return response.data
  },

  // RFID login
  rfidLogin: async (data: RfidLoginDto): Promise<RfidLoginResponseDto> => {
    const response = await user.usersControllerRfidLogin({
      rfidLoginDto: data
    })
    return response.data
  },

  // Register RFID card
  registerRfid: async (data: RegisterRfidDto): Promise<RfidRegistrationResponseDto> => {
    const response = await user.usersControllerRegisterRfid({
      registerRfidDto: data
    })
    return response.data
  },

  // Refresh access token
  refreshToken: async (): Promise<AuthSuccessResponseDto> => {
    const response = await auth.authControllerRefresh()
    return response.data
  },

  // Logout user
  logout: async (): Promise<AuthSuccessResponseDto> => {
    const response = await auth.authControllerLogout()
    return response.data
  },

  // Get current user (if authenticated)
  getCurrentUser: async (): Promise<UserResponseDto> => {
    const response = await auth.authControllerMe()
    return response.data
  },

  updateUser: async (data: UpdateUserRequest): Promise<UserResponseDto> => {
    const response = await user.usersControllerUpdateUser({
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
    const response = await auth.authControllerForgotPassword({
      forgotPasswordDto: data
    })
    return {
      message: response.data.message!,
      statusCode: response.data.statusCode!,
    }
  },

  // Reset password
  resetPassword: async (data: ResetPasswordDto): Promise<AuthSuccessResponseDto> => {
    const response = await auth.authControllerResetPassword({
      resetPasswordDto: data
    })
    return {
      message: response.data.message!,
      statusCode: response.data.statusCode!,
    }
  },
} 