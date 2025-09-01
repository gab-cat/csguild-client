import { useAuthStore } from '@/features/auth/stores/auth-store'
import { blogCommentsApi } from '@/lib/api'
import type {
  CreateCommentDto,
  UpdateCommentDto,
  FlagBlogDto,
  CommentsListResponseDto,
  CommentActionResponseDto
} from '@generated/api-client'

// Blog Comments API functions using the generated API client
export const commentsApiUtils = {
  // Get comments for a blog
  async getCommentsForBlog(
    blogSlug: string, 
    page = '1', 
    limit = '20', 
    sort = 'createdAt:desc',
    parentId?: string
  ): Promise<CommentsListResponseDto> {
    try {
      // Get the current user slug from auth store
      const { user } = useAuthStore.getState()
      const userSlug = user?.username || ''

      const response = await blogCommentsApi.blogCommentsControllerGetComments({
        blogSlug,
        page,
        limit,
        sort,
        parentId: parentId || '',
        userSlug
      })
      
      console.log('Fetched comments:', response.data)
      
      return response.data
    } catch (error) {
      console.error('Error fetching comments:', error)
      // Return empty result on error with proper structure
      return {
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0,
        }
      }
    }
  },

  // Create a new comment
  async createComment(blogSlug: string, commentData: CreateCommentDto): Promise<CommentActionResponseDto> {
    const response = await blogCommentsApi.blogCommentsControllerCreateComment({
      blogSlug,
      createCommentDto: commentData
    })
    return response.data
  },

  // Update a comment
  async updateComment(commentId: string, blogSlug: string, updateData: UpdateCommentDto): Promise<CommentActionResponseDto> {
    const response = await blogCommentsApi.blogCommentsControllerUpdateComment({
      commentId,
      blogSlug,
      updateCommentDto: updateData
    })
    return response.data
  },

  // Delete a comment
  async deleteComment(commentId: string, blogSlug: string): Promise<void> {
    const response = await blogCommentsApi.blogCommentsControllerDeleteComment({
      commentId,
      blogSlug,
    })
    return response.data
  },

  // Like a comment
  async likeComment(commentId: string, blogSlug: string): Promise<CommentActionResponseDto> {
    const response = await blogCommentsApi.blogCommentsControllerLikeComment({
      commentId,
      blogSlug
    })
    return response.data
  },

  // Unlike a comment
  async unlikeComment(commentId: string, blogSlug: string): Promise<CommentActionResponseDto> {
    const response = await blogCommentsApi.blogCommentsControllerUnlikeComment({
      commentId,
      blogSlug
    })
    return response.data
  },

  // Flag a comment
  async flagComment(commentId: string, blogSlug: string, flagData: FlagBlogDto): Promise<CommentActionResponseDto> {
    const response = await blogCommentsApi.blogCommentsControllerFlagComment({
      commentId,
      blogSlug,
      flagBlogDto: flagData
    })
    return response.data
  }
}
