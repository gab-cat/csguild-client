import { eventsAdminApi } from '@/lib/api'
import type { EventFeedbackResponsesDto } from '@generated/api-client'

export interface FeedbackResponsesFilters {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'submittedAt' | 'username' | 'firstName' | 'lastName'
  sortOrder?: 'asc' | 'desc'
}

// Event Feedback Responses API functions
export const feedbackResponsesApiUtils = {
  // Get event feedback responses with statistics
  async getEventFeedbackResponses(
    slug: string,
    filters: FeedbackResponsesFilters = {}
  ): Promise<EventFeedbackResponsesDto> {
    const response = await eventsAdminApi.eventsAdminControllerGetEventFeedbackResponses({
      slug,
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    })
    return response.data
  },
}
