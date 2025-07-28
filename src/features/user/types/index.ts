import { UserResponseDto, UpdateUserRequest } from '@generated/api-client'

// Re-export the generated types for convenience
export type UserProfileData = UserResponseDto
export type UpdateProfileData = UpdateUserRequest

export interface ProfileSectionProps {
  title: string
  isEditable?: boolean
  isEditing?: boolean
  onEdit?: () => void
  onSave?: () => void
  onCancel?: () => void
  children: React.ReactNode
}

export interface EditableFieldProps {
  label: string
  value: string | undefined
  isEditing: boolean
  type?: 'text' | 'email' | 'date'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  onChange?: (value: string) => void
  onSave?: () => void
  onCancel?: () => void
}
