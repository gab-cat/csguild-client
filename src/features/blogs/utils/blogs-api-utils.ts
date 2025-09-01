import { useAuthStore } from '@/features/auth/stores/auth-store'
import { blogsApi as blogsApiInstance } from '@/lib/api'
import type {
  BlogDetailResponseDto,
  BlogListResponseDto
} from '@generated/api-client'

import type { BlogFiltersData } from '../schemas'

// Main Blogs API functions for querying published blogs
export const blogsApiUtils = {
  // Get all published blogs with filters
  async getBlogs(filters: Partial<BlogFiltersData> = {}): Promise<BlogListResponseDto> {
    // Get the current user slug from auth store for personalized data
    const { user } = useAuthStore.getState()
    const userSlug = user?.username || ''

    const response = await blogsApiInstance.blogsQueryControllerFindAll({
      search: filters.search,
      tags: filters.tags?.join(','),
      categories: filters.categories?.join(','),
      authorSlug: filters.authorSlug,
      status: filters.status,
      pinned: filters.pinned,
      featured: filters.featured,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: filters.page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      userSlug: userSlug || undefined,
    })
    return response.data
  },

  // Get blog by slug with personalized data
  async getBlogBySlug(slug: string): Promise<BlogDetailResponseDto> {
    // Get the current user slug from auth store for personalized data
    const { user } = useAuthStore.getState()
    const userSlug = user?.username || ''

    const response = await blogsApiInstance.blogsQueryControllerFindOne({ 
      slug,
      userSlug: userSlug || undefined 
    })
    // Handle wrapped response structure where blog data might be nested
    const responseData = response.data as unknown as {
      blog?: BlogDetailResponseDto
      statusCode?: number
      message?: string
    } & BlogDetailResponseDto
    
    // If response has a nested blog property, return that
    if (responseData.blog && typeof responseData.blog === 'object') {
      return responseData.blog
    }
    
    // Otherwise, assume the response data is the blog itself
    return responseData as BlogDetailResponseDto
  },

  // Get featured blogs with personalized data
  async getFeaturedBlogs(): Promise<BlogListResponseDto> {
    // Get the current user slug from auth store for personalized data
    const { user } = useAuthStore.getState()
    const userSlug = user?.username || ''

    const response = await blogsApiInstance.blogsQueryControllerGetFeatured({ 
      userSlug: userSlug || undefined 
    })
    return response.data
  },

  // Get pinned blogs with personalized data
  async getPinnedBlogs(): Promise<BlogListResponseDto> {
    // Get the current user slug from auth store for personalized data
    const { user } = useAuthStore.getState()
    const userSlug = user?.username || ''

    const response = await blogsApiInstance.blogsQueryControllerGetPinned({ 
      userSlug: userSlug || undefined 
    })
    return response.data
  },

  // Get author statistics
  async getAuthorStats(authorId: string): Promise<unknown> {
    const response = await blogsApiInstance.blogsQueryControllerGetAuthorStats({ authorId })
    return response.data
  },

  // Get blog revisions (admin only)
  async getBlogRevisions(slug: string, page = 1, limit = 10): Promise<unknown> {
    const response = await blogsApiInstance.blogsQueryControllerGetBlogRevisions({ 
      slug, 
      page: page.toString(), 
      limit: limit.toString() 
    })
    return response.data
  },

  // Get related blogs
  async getRelatedBlogs(slug: string, limit = 5): Promise<unknown> {
    const response = await blogsApiInstance.blogsQueryControllerGetRelatedBlogs({ 
      slug, 
      limit
    })
    // Handle potential wrapped response structure
    const responseData = response.data as unknown as {
      blogs?: unknown
      data?: unknown
    } & unknown
    
    // If response has nested data, return that
    if (responseData.blogs) {
      return responseData.blogs
    }
    if (responseData.data) {
      return responseData.data
    }
    
    return responseData
  }
}
