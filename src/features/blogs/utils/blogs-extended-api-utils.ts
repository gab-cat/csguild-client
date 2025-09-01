import { blogsExtendedApi as blogsExtendedApiInstance } from '@/lib/api'
import type {
  BlogListResponseDto,
  MyBlogsListResponseDto
} from '@generated/api-client'

// Extended Blogs API functions for additional functionality
export const blogsExtendedApiUtils = {

  // Get blogs by author
  async getBlogsByAuthor(authorSlug: string, includeStatus?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED', limit?: number, page?: number): Promise<BlogListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerGetBlogsByAuthor({
      authorSlug,
      includeStatus,
      limit,
      page
    })
    return response.data
  },

  // Get blogs by category
  async getBlogsByCategory(categorySlug: string, limit?: number, page?: number): Promise<BlogListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerGetBlogsByCategory({
      categorySlug,
      limit,
      page
    })
    return response.data
  },

  // Get blogs by tag
  async getBlogsByTag(tagSlug: string, limit?: number, page?: number): Promise<BlogListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerGetBlogsByTag({
      tagSlug,
      limit,
      page
    })
    return response.data
  },

  // Get bookmarked blogs for current user
  async getBookmarkedBlogs(limit?: number, page?: number): Promise<BlogListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerGetBookmarkedBlogs({
      limit,
      page
    })
    return response.data
  },


  // Get current user's blogs
  async getMyBlogs(status?: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED', limit?: number, page?: number): Promise<MyBlogsListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerGetMyBlogs({
      status,
      limit,
      page
    })
    return response.data
  },

  // Search blogs
  async searchBlogs(
    q: string,
    tags?: string,
    categories?: string,
    authorSlug?: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: number,
    page?: number
  ): Promise<BlogListResponseDto> {
    const response = await blogsExtendedApiInstance.blogsExtendedControllerSearchBlogs({
      q,
      tags,
      categories,
      authorSlug,
      dateFrom,
      dateTo,
      limit,
      page
    })
    return response.data
  }
}
