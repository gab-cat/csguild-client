import { blogModerationApi as blogModerationApiInstance } from '@/lib/api'
import type { ModerateBlogDto, ModerationActionResponseDto } from '@generated/api-client'

// Blog Moderation API functions for admin/moderator actions
export const blogModerationApiUtils = {
  // Get moderation queue
  async getModerationQueue(
    page: string, 
    limit: string, 
    type: string, 
    status: string
  ): Promise<unknown> {
    const response = await blogModerationApiInstance.blogModerationControllerGetModerationQueue({
      page,
      limit,
      type,
      status
    })
    return response.data
  },

  // Moderate a blog
  async moderateBlog(slug: string, moderationData: ModerateBlogDto): Promise<ModerationActionResponseDto> {
    const response = await blogModerationApiInstance.blogModerationControllerModerateBlog({
      slug,
      moderateBlogDto: moderationData
    })
    return response.data
  },

  // Moderate a comment
  async moderateComment(commentId: string): Promise<ModerationActionResponseDto> {
    const response = await blogModerationApiInstance.blogModerationControllerModerateComment({
      commentId
    })
    return response.data
  }
}
