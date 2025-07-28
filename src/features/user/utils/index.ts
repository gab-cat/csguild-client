export * from './users-api'

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Invalid date'
  }
}

// src/features/user/utils/index.ts
import { formatDistanceToNow } from 'date-fns'

export const formatRelativeTime = (dateString: string): string => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    return 'Unknown'
  }
}

export const getUserInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'U'
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
}

export const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/
  return usernameRegex.test(username)
}

export const formatDateForInput = (dateString: string | undefined | null): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    // Check if date is valid
    if (isNaN(date.getTime())) return ''
    // Format as YYYY-MM-DD for HTML date input using local timezone
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return ''
  }
}

export const calculateAge = (birthdate: string): number | null => {
  try {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  } catch {
    return null
  }
}
