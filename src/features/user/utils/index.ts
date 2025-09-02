import { format, formatRelative } from 'date-fns'

export function formatDate(date: string | Date | number): string {
  if (typeof date === 'number') {
    return format(new Date(date), 'MMM d, yyyy')
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'MMM d, yyyy')
}

export function formatRelativeTime(date: string | Date | number): string {
  if (typeof date === 'number') {
    return formatRelative(new Date(date), new Date())
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatRelative(dateObj, new Date())
}

export function getUserInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || 'U'
}

export function formatDateForInput(date: string | Date | number): string {
  if (typeof date === 'number') {
    return format(new Date(date), 'yyyy-MM-dd')
  }
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, 'yyyy-MM-dd')
}
