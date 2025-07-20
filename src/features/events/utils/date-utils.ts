/**
 * Date utility functions for event management
 * Handles timezone-aware date formatting and conversion
 */

/**
 * Converts a date string to local datetime-local input format
 * Maintains the local timezone instead of converting to UTC
 */
export function formatDateForInput(dateString: string): string {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) return ''
  
  // Get local timezone offset
  const timezoneOffset = date.getTimezoneOffset() * 60000
  
  // Adjust for timezone to get local time
  const localDate = new Date(date.getTime() - timezoneOffset)
  
  // Return in YYYY-MM-DDTHH:MM format for datetime-local input
  return localDate.toISOString().slice(0, 16)
}

/**
 * Converts datetime-local input value to ISO string for API
 * Preserves the local time by treating input as local time
 */
export function formatDateForApi(inputValue: string): string {
  if (!inputValue) return ''
  
  // Create date from input (treats as local time)
  const date = new Date(inputValue)
  
  // Check if date is valid
  if (isNaN(date.getTime())) return ''
  
  // Return ISO string (this will be in UTC)
  return date.toISOString()
}

/**
 * Formats date for display in event metadata
 * Uses consistent formatting across the application
 */
export function formatDateForDisplay(dateString: string): {
  date: string
  time: string
  full: string
} {
  if (!dateString) return { date: '', time: '', full: '' }
  
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) return { date: '', time: '', full: '' }
  
  const dateFormatted = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  
  const timeFormatted = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  
  const fullFormatted = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
  
  return {
    date: dateFormatted,
    time: timeFormatted,
    full: fullFormatted,
  }
}

/**
 * Formats date range for display
 */
export function formatDateRange(startDate: string, endDate?: string): string {
  if (!startDate) return ''
  
  const start = new Date(startDate)
  if (isNaN(start.getTime())) return ''
  
  const startFormatted = formatDateForDisplay(startDate)
  
  if (!endDate) {
    return startFormatted.full
  }
  
  const end = new Date(endDate)
  if (isNaN(end.getTime())) {
    return startFormatted.full
  }
  
  const endFormatted = formatDateForDisplay(endDate)
  
  // Check if same day
  const isSameDay = start.toDateString() === end.toDateString()
  
  if (isSameDay) {
    return `${startFormatted.date} from ${startFormatted.time} to ${endFormatted.time}`
  }
  
  return `${startFormatted.full} to ${endFormatted.full}`
}

/**
 * Validates if a date string is valid
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

/**
 * Compares two date strings and returns if first is before second
 */
export function isDateBefore(firstDate: string, secondDate: string): boolean {
  if (!firstDate || !secondDate) return false
  
  const first = new Date(firstDate)
  const second = new Date(secondDate)
  
  if (isNaN(first.getTime()) || isNaN(second.getTime())) return false
  
  return first < second
}

/**
 * Gets current date in datetime-local input format
 */
export function getCurrentDateTimeLocal(): string {
  const now = new Date()
  const timezoneOffset = now.getTimezoneOffset() * 60000
  const localDate = new Date(now.getTime() - timezoneOffset)
  return localDate.toISOString().slice(0, 16)
}

/**
 * Adds minutes to a datetime-local input value
 */
export function addMinutesToDateTimeLocal(dateTimeLocal: string, minutes: number): string {
  if (!dateTimeLocal) return ''
  
  const date = new Date(dateTimeLocal)
  if (isNaN(date.getTime())) return ''
  
  const newDate = new Date(date.getTime() + (minutes * 60000))
  return formatDateForInput(newDate.toISOString())
}
