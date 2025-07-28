import { eventsApi as eventsApiInstance } from '@/lib/api'
import {
  CreateEventDto,
  UpdateEventDto,
  ToggleSessionDto,
  EventRegistrationResponseDto,
  SubmitOrganizerRatingDto
} from '@generated/api-client'
import type {
  EventCreateResponseDto,
  EventUpdateResponseDto,
  EventDeleteResponseDto,
  EventDetailResponseDto,
  EventListResponseDto,
  EventsQueryControllerGetEventAttendees200Response,
  FeedbackStatusResponseDto,
  OrganizerRatingResponseDto,
  OrganizerStatisticsResponseDto
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
  },

  // Submit organizer rating for an event
  async submitOrganizerRating(slug: string, ratingData: SubmitOrganizerRatingDto): Promise<OrganizerRatingResponseDto> {
    const response = await eventsApiInstance.eventsCommandControllerRateOrganizer({
      slug,
      submitOrganizerRatingDto: ratingData
    })
    return response.data
  },

  // Get organizer statistics
  async getOrganizerStatistics(username: string): Promise<OrganizerStatisticsResponseDto> {
    const response = await eventsApiInstance.eventsQueryControllerGetOrganizerStatistics({ username })
    return response.data
  }
}
