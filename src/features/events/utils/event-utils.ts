import { EventDetailResponseDtoTypeEnum } from '@generated/api-client'

// Utility functions for data transformation and validation
export const eventUtils = {
  // Format event date for display
  formatEventDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Check if event is ongoing
  isEventOngoing(startDate: string, endDate?: string): boolean {
    const now = new Date()
    const start = new Date(startDate)
    
    if (!endDate) {
      // If no end date, consider ongoing for the day of start date
      const startOfDay = new Date(start)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(start)
      endOfDay.setHours(23, 59, 59, 999)
      
      return now >= startOfDay && now <= endOfDay
    }
    
    const end = new Date(endDate)
    return now >= start && now <= end
  },

  // Check if event is upcoming
  isEventUpcoming(startDate: string): boolean {
    const now = new Date()
    const start = new Date(startDate)
    return start > now
  },

  // Check if event is completed
  isEventCompleted(startDate: string, endDate?: string): boolean {
    const now = new Date()
    
    if (!endDate) {
      // If no end date, consider completed after the day of start date
      const start = new Date(startDate)
      const endOfDay = new Date(start)
      endOfDay.setHours(23, 59, 59, 999)
      return now > endOfDay
    }
    
    const end = new Date(endDate)
    return now > end
  },

  // Get event status
  getEventStatus(startDate: string, endDate?: string): 'upcoming' | 'ongoing' | 'completed' {
    if (this.isEventUpcoming(startDate)) return 'upcoming'
    if (this.isEventOngoing(startDate, endDate)) return 'ongoing'
    return 'completed'
  },

  // Calculate event duration in a readable format
  getEventDuration(startDate: string, endDate?: string): string {
    if (!endDate) return '0 hours'
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffMs = end.getTime() - start.getTime()
    const totalHours = Math.round(diffMs / (1000 * 60 * 60))
    
    if (totalHours < 24) {
      return totalHours === 1 ? '1 hour' : `${totalHours} hours`
    }
    
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24
    
    if (hours === 0) {
      return days === 1 ? '1 day' : `${days} days`
    }
    
    const dayText = days === 1 ? '1 day' : `${days} days`
    const hourText = hours === 1 ? '1 hour' : `${hours} hours`
    
    return `${dayText} and ${hourText}`
  },

  // Format tags for URL query
  formatTagsForQuery(tags: string[]): string {
    return tags.join(',')
  },

  // Parse tags from URL query
  parseTagsFromQuery(tagsString: string): string[] {
    return tagsString.split(',').filter(tag => tag.trim().length > 0)
  },

  // Validate event times
  validateEventTimes(startDate: string, endDate?: string): { isValid: boolean; error?: string } {
    const start = new Date(startDate)
    const now = new Date()

    if (start <= now) {
      return { isValid: false, error: 'Start date must be in the future' }
    }

    if (endDate) {
      const end = new Date(endDate)
      if (end <= start) {
        return { isValid: false, error: 'End date must be after start date' }
      }
    }

    return { isValid: true }
  },

  // Generate event slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
  },

  // Truncate text for cards
  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
  },

  // Get event type display info
  getEventTypeInfo(type: EventDetailResponseDtoTypeEnum): {
    label: string
    icon: string
    color: string
    description: string
  } {
    switch (type) {
    case EventDetailResponseDtoTypeEnum.IN_PERSON:
      return {
        label: 'In-Person',
        icon: 'MapPin',
        color: 'blue',
        description: 'Physical attendance required'
      }
    case EventDetailResponseDtoTypeEnum.VIRTUAL:
      return {
        label: 'Virtual',
        icon: 'Globe',
        color: 'green',
        description: 'Online participation'
      }
    case EventDetailResponseDtoTypeEnum.HYBRID:
      return {
        label: 'Hybrid',
        icon: 'Layers',
        color: 'purple',
        description: 'Both in-person and virtual options'
      }
    case EventDetailResponseDtoTypeEnum.OTHERS:
      return {
        label: 'Other',
        icon: 'Calendar',
        color: 'gray',
        description: 'Other event format'
      }
    default:
      return {
        label: 'Unknown',
        icon: 'Help',
        color: 'gray',
        description: 'Event type not specified'
      }
    }
  },

  // Get event type badge styling
  getEventTypeBadgeStyle(type: EventDetailResponseDtoTypeEnum): string {
    const typeInfo = this.getEventTypeInfo(type)
    const colorMap = {
      blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      green: 'bg-green-500/20 text-green-300 border-green-500/30',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colorMap[typeInfo.color as keyof typeof colorMap] || colorMap.gray
  }
}

// Event status utility function for display
export const getEventStatusDetails = (startDate: string, endDate?: string) => {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  if (now < start) {
    return { status: 'upcoming', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' }
  } else if (end && now > end) {
    return { status: 'completed', color: 'bg-gray-500/20 text-gray-300 border-gray-500/30' }
  } else {
    return { status: 'ongoing', color: 'bg-green-500/20 text-green-300 border-green-500/30' }
  }
}
