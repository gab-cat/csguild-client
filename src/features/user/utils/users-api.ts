import { usersApi as usersClient } from '@/lib/api'
import type {
  UserResponseDto,
  UpdateUserRequest,
  CreateUserRequest,
  CreateUserResponseDto,
  RegisterRfidDto,
  RfidRegistrationResponseDto,
  VerifyEmailDto,
  EmailVerificationResponseDto,
  SendEmailVerificationDto,
  RfidLoginDto,
  RfidLoginResponseDto,
} from '@generated/api-client'

export const usersApi = {
  // Get user by ID
  getUserById: async (id: string): Promise<UserResponseDto> => {
    const response = await usersClient.usersControllerGetUser({ id })
    return response.data
  },

  // Get all users (admin/staff only)
  getUsers: async (): Promise<UserResponseDto[]> => {
    const response = await usersClient.usersControllerGetUsers()
    return response.data
  },

  // Update current user profile
  updateCurrentUser: async (data: UpdateUserRequest): Promise<UserResponseDto> => {
    const response = await usersClient.usersControllerUpdateUser({
      updateUserRequest: data
    })
    return response.data
  },

  // Create new user (admin only)
  createUser: async (data: CreateUserRequest): Promise<CreateUserResponseDto> => {
    const response = await usersClient.usersControllerCreateUser({
      createUserRequest: data
    })
    return response.data
  },

  // Verify user email
  verifyEmail: async (data: VerifyEmailDto): Promise<EmailVerificationResponseDto> => {
    const response = await usersClient.usersControllerVerifyEmail({
      verifyEmailDto: data
    })
    return response.data
  },

  // Request email verification (resend)
  resendEmailVerification: async (data: SendEmailVerificationDto): Promise<EmailVerificationResponseDto> => {
    const response = await usersClient.usersControllerResendVerification({
      sendEmailVerificationDto: data
    })
    return response.data
  },

  // Register RFID card
  registerRfidCard: async (data: RegisterRfidDto): Promise<RfidRegistrationResponseDto> => {
    const response = await usersClient.usersControllerRegisterRfid({
      registerRfidDto: data
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
}
