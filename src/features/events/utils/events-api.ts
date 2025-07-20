import { eventsApi as eventsApiInstance, eventFeedbackApi as feedbackApiInstance } from '@/lib/api'
import {
  CreateEventDto,
  UpdateEventDto,
  CreateFeedbackFormDto,
  UpdateFeedbackFormDto,
  SubmitFeedbackResponseDto,
  ToggleSessionDto,
  EventRegistrationResponseDto,
  EventDetailResponseDtoTypeEnum
} from '@generated/api-client'
import type {
  EventCreateResponseDto,
  EventUpdateResponseDto,
  EventDeleteResponseDto,
  EventDetailResponseDto,
  EventListResponseDto,
  EventsQueryControllerGetEventAttendees200Response,
  FeedbackFormResponseDto,
  FeedbackFormUpdateResponseDto,
  FeedbackSubmissionResponseDto,
  FeedbackStatusResponseDto
} from '@generated/api-client'

import type { EventFiltersSchemaType } from '../schemas'


// Events API functions
export const eventsApiUtils = {
  // Create a new event
  async createEvent(eventData: CreateEventDto): Promise<EventCreateResponseDto> {
    const response = await eventsApiInstance.eventsCommandControllerCreate({
      createEventDto: eventData
    })
    return response.data
  },

  // Update an event
  async updateEvent(slug: string, updateData: UpdateEventDto): Promise<EventUpdateResponseDto> {
    const response = await eventsApiInstance.eventsCommandControllerUpdate({
      slug,
      updateEventDto: updateData
    })
    return response.data
  },

  // Delete an event
  async deleteEvent(slug: string): Promise<EventDeleteResponseDto> {
    const response = await eventsApiInstance.eventsCommandControllerDelete({ slug })
    return response.data
  },

  // Get event by slug
  async getEventBySlug(slug: string): Promise<EventDetailResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerFindOne({ slug })
    return response.data
  },

  // Get all events with filters
  async getEvents(filters: EventFiltersSchemaType = {}): Promise<EventListResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerFindAll(filters)
    return response.data
  },

  // Get pinned events
  async getPinnedEvents(): Promise<EventDetailResponseDto[]> {
    const response = await eventsApiInstance.eventsQueryControllerGetPinnedEvents()
    return response.data
  },

  // Get events created by current user
  async getMyCreatedEvents(filters: Omit<EventFiltersSchemaType, 'organizerSlug'> = {}): Promise<EventListResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerGetMyCreatedEvents(filters)
    return response.data
  },

  // Get events attended by current user
  async getMyAttendedEvents(filters: EventFiltersSchemaType = {}): Promise<EventListResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerGetMyAttendedEvents(filters)
    return response.data
  },

  // Get event attendees
  async getEventAttendees(eventId: string, page = 1, limit = 20): Promise<EventsQueryControllerGetEventAttendees200Response> {
    const response = await eventsApiInstance.eventsQueryControllerGetEventAttendees({
      eventId,
      page,
      limit
    })
    return response.data
  },

  // Get event sessions
  async getEventSessions(slug: string) {
    const response = await eventsApiInstance.eventsQueryControllerGetEventSessions({ slug })
    return response.data
  },

  // Toggle session (check-in/check-out)
  async toggleSession(sessionData: ToggleSessionDto): Promise<void> {
    const response = await eventsApiInstance.eventsCommandControllerToggleSession({
      toggleSessionDto: sessionData
    })
    return response.data
  },

  // Register for an event
  async registerToEvent(slug: string): Promise<EventRegistrationResponseDto> {
    const response = await eventsApiInstance.eventsCommandControllerRegisterToEvent({ slug })
    return response.data
  },

  // Check feedback status for an event
  async checkFeedbackStatus(slug: string): Promise<FeedbackStatusResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerCheckFeedbackResponse({ slug })
    return response.data
  }
}

// Feedback API functions
export const feedbackApiUtils = {
  // Create feedback form
  async createFeedbackForm(formData: CreateFeedbackFormDto): Promise<FeedbackFormResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerCreateFeedbackForm({
      createFeedbackFormDto: formData
    })
    return response.data
  },

  // Get feedback form
  async getFeedbackForm(eventId: string): Promise<FeedbackFormResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerGetFeedbackForm({ eventId })
    return response.data
  },

  // Get feedback form (public access)
  async getFeedbackFormPublic(eventId: string, token: string, userId: string): Promise<FeedbackFormResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerGetFeedbackFormPublic({
      eventId,
      token,
      userId
    })
    return response.data
  },

  // Submit feedback response
  async submitFeedbackResponse(responseData: SubmitFeedbackResponseDto): Promise<FeedbackSubmissionResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerSubmitFeedbackResponse({
      submitFeedbackResponseDto: responseData
    })
    return response.data
  },

  // Submit feedback response (public access)
  async submitFeedbackResponsePublic(
    token: string,
    userId: string,
    responseData: SubmitFeedbackResponseDto
  ): Promise<FeedbackSubmissionResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerSubmitFeedbackResponsePublic({
      token,
      userId,
      submitFeedbackResponseDto: responseData
    })
    return response.data
  },

  // Update feedback form
  async updateFeedbackForm(formId: string, updateData: UpdateFeedbackFormDto): Promise<FeedbackFormUpdateResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerUpdateFeedbackForm({
      formId,
      updateFeedbackFormDto: updateData
    })
    return response.data
  }
}

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

// Form builder utilities
export const formBuilderUtils = {
  // Generate unique field ID
  generateFieldId(): string {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  },

  // Validate field configuration
  validateFieldConfig(field: Record<string, unknown>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!field.label || typeof field.label !== 'string' || !field.label.trim()) {
      errors.push('Field label is required')
    }

    if (!field.type) {
      errors.push('Field type is required')
    }

    // Validate options for choice fields
    const choiceTypes = ['radio', 'checkbox', 'select']
    if (choiceTypes.includes(field.type as string) && (!field.options || !Array.isArray(field.options) || field.options.length < 2)) {
      errors.push('Choice fields must have at least 2 options')
    }

    // Validate max rating for rating fields
    if (field.type === 'rating' && (!field.maxRating || typeof field.maxRating !== 'number' || field.maxRating < 2 || field.maxRating > 10)) {
      errors.push('Rating fields must have a max rating between 2 and 10')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Get default field configuration
  getDefaultFieldConfig(type: string): Record<string, unknown> {
    const baseConfig = {
      id: this.generateFieldId(),
      required: false,
      description: ''
    }

    switch (type) {
    case 'text':
      return {
        ...baseConfig,
        label: 'Text Field',
        type: 'text',
        placeholder: 'Enter text...'
      }
    case 'textarea':
      return {
        ...baseConfig,
        label: 'Long Text Field',
        type: 'textarea',
        placeholder: 'Enter detailed response...'
      }
    case 'radio':
      return {
        ...baseConfig,
        label: 'Multiple Choice',
        type: 'radio',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'checkbox':
      return {
        ...baseConfig,
        label: 'Select Multiple',
        type: 'checkbox',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'select':
      return {
        ...baseConfig,
        label: 'Select Option',
        type: 'select',
        options: ['Option 1', 'Option 2', 'Option 3']
      }
    case 'rating':
      return {
        ...baseConfig,
        label: 'Rate this event',
        type: 'rating',
        maxRating: 5
      }
    default:
      return baseConfig
    }
  }
}
