import { eventFeedbackApi as feedbackApiInstance } from '@/lib/api'
import {
  CreateFeedbackFormDto,
  UpdateFeedbackFormDto,
  SubmitFeedbackResponseDto,
  SubmitOrganizerRatingDto
} from '@generated/api-client'
import type {
  FeedbackFormResponseDto,
  FeedbackFormUpdateResponseDto,
  FeedbackSubmissionResponseDto,
  OrganizerRatingResponseDto
} from '@generated/api-client'

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

  // Submit organizer rating (public access)
  async submitOrganizerRatingPublic(
    token: string,
    userId: string,
    ratingData: SubmitOrganizerRatingDto
  ): Promise<OrganizerRatingResponseDto> {
    const response = await feedbackApiInstance.feedbackControllerSubmitOrganizerRatingPublic({
      token,
      userId,
      submitOrganizerRatingDto: ratingData
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
