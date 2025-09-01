import { useAuthStore } from '@/features/auth/stores/auth-store'
import { blogsActionsApi as blogsActionsApiInstance, blogsApi } from '@/lib/api'
import type {
  BlogActionResponseDto,
  CreateBlogDto,
  UpdateBlogDto,
  FlagBlogDto,
  ShareBlogDto,
  BlogStatsResponseDto,
  BlogAnalyticsResponseDto,
  BlogListResponseDto
} from '@generated/api-client'

// Blog Actions API functions for CRUD operations and interactions
export const blogsActionsApiUtils = {
  // Create a new blog
  async createBlog(blogData: CreateBlogDto): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerCreateBlog({
      createBlogDto: blogData
    })
    return response.data
  },

  // Update a blog
  async updateBlog(slug: string, updateData: UpdateBlogDto): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUpdateBlog({
      slug,
      updateBlogDto: updateData
    })
    return response.data
  },

  // Delete a blog
  async deleteBlog(slug: string): Promise<void> {
    const response = await blogsActionsApiInstance.blogsActionControllerDeleteBlog({ slug })
    return response.data
  },

  // Publish a blog
  async publishBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerPublishBlog({ slug })
    return response.data
  },

  // Unpublish a blog
  async unpublishBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUnpublishBlog({ slug })
    return response.data
  },

  // Like a blog
  async likeBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerLikeBlog({ slug })
    return response.data
  },

  // Unlike a blog
  async unlikeBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUnlikeBlog({ slug })
    return response.data
  },

  // Bookmark a blog
  async bookmarkBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerBookmarkBlog({ slug })
    return response.data
  },

  // Unbookmark a blog
  async unbookmarkBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUnbookmarkBlog({ slug })
    return response.data
  },

  // Share a blog
  async shareBlog(slug: string, shareData: ShareBlogDto): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerShareBlog({
      slug,
      shareBlogDto: shareData
    })
    return response.data
  },

  // Flag a blog for moderation
  async flagBlog(slug: string, flagData: FlagBlogDto): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerFlagBlog({
      slug,
      flagBlogDto: flagData
    })
    return response.data
  },

  // Pin a blog (admin only)
  async pinBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerPinBlog({ slug })
    return response.data
  },

  // Unpin a blog (admin only)
  async unpinBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUnpinBlog({ slug })
    return response.data
  },

  // Feature a blog (admin only)
  async featureBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerFeatureBlog({ slug })
    return response.data
  },

  // Unfeature a blog (admin only)
  async unfeatureBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerUnfeatureBlog({ slug })
    return response.data
  },

  // Schedule a blog for future publication
  async scheduleBlog(slug: string): Promise<BlogActionResponseDto> {
    const response = await blogsActionsApiInstance.blogsActionControllerScheduleBlog({ slug })
    return response.data
  },

  // Get blog analytics
  async getBlogAnalytics(timeframe: 'day' | 'week' | 'month' | 'all', startDate: string, endDate: string): Promise<BlogAnalyticsResponseDto> {
    const response = await blogsApi.blogsQueryControllerGetAnalytics({
      timeframe,
      startDate,
      endDate
    })
    return response.data
  },

  // Get blog statistics by ID
  async getBlogStats(id: string): Promise<BlogStatsResponseDto> {
    const response = await blogsApi.blogsQueryControllerGetBlogStats({ id })
    return response.data
  },

  // Get popular blogs
  async getPopularBlogs(limit: number, timeframe: 'day' | 'week' | 'month'): Promise<BlogListResponseDto> {
    const response = await blogsApi.blogsQueryControllerGetPopularBlogs({
      limit,
      timeframe
    })
    return response.data
  },

  // Get recent blogs with optional userSlug for personalized data
  async getRecentBlogs(limit: number): Promise<BlogListResponseDto> {
    // Get the current user slug from auth store
    const { user } = useAuthStore.getState()
    const userSlug = user?.username || ''

    const response = await blogsApi.blogsQueryControllerGetRecentBlogs({ 
      limit,
      userSlug: userSlug || undefined 
    })
    return response.data
  },

  // Get trending blogs
  async getTrendingBlogs(limit: number, timeframe: 'day' | 'week' | 'month'): Promise<BlogListResponseDto> {
    const response = await blogsApi.blogsQueryControllerGetTrendingBlogs({
      limit,
      timeframe
    })
    return response.data
  }
}
