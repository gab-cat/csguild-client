import type { 
  BlogCardType, 
  TrendingBlogsResponse, 
  PopularBlogsResponse, 
  FeaturedBlogsResponse,
  TrendingBlogResponseDto,
  PopularBlogResponseDto,
  BlogSummaryResponseDto
} from '../types'
import { toBlogCard } from '../types'

// Process different response types into unified BlogCardType array
export function processBlogData(
  data: unknown, 
  type: 'all' | 'featured' | 'trending' | 'popular'
): { blogs: BlogCardType[]; total: number } {
  if (!data) {
    return { blogs: [], total: 0 }
  }

  switch (type) {
  case 'trending': {
    if (typeof data === 'object' && data !== null) {
      // Handle trending response with data and pagination structure
      if ('data' in data && Array.isArray((data as Record<string, unknown>).data)) {
        const response = data as TrendingBlogsResponse
        const blogs = response.data.map((blog: TrendingBlogResponseDto) => toBlogCard(blog))
        return { 
          blogs, 
          total: response.pagination?.total || blogs.length 
        }
      }
      
      // Handle direct array response
      if (Array.isArray(data)) {
        const blogs = data.map((blog) => toBlogCard(blog as TrendingBlogResponseDto))
        return { blogs, total: blogs.length }
      }
    }
    break
  }

  case 'popular': {
    if (typeof data === 'object' && data !== null) {
      // Handle popular response with data and pagination structure
      if ('data' in data && Array.isArray((data as Record<string, unknown>).data)) {
        const response = data as PopularBlogsResponse
        const blogs = response.data.map((blog: PopularBlogResponseDto) => toBlogCard(blog))
        return { 
          blogs, 
          total: response.pagination?.total || blogs.length 
        }
      }
      
      // Handle direct array response
      if (Array.isArray(data)) {
        const blogs = data.map((blog) => toBlogCard(blog as PopularBlogResponseDto))
        return { blogs, total: blogs.length }
      }
    }
    break
  }

  case 'featured': {
    if (typeof data === 'object' && data !== null) {
      // Handle structured response with blogs array
      if ('blogs' in data && Array.isArray((data as Record<string, unknown>).blogs)) {
        const response = data as FeaturedBlogsResponse
        const blogs = response.blogs.map(blog => toBlogCard(blog))
        return { 
          blogs, 
          total: response.meta?.total || blogs.length 
        }
      }
      
      // Handle direct array response
      if (Array.isArray(data)) {
        const blogs = data.map(blog => toBlogCard(blog as BlogSummaryResponseDto))
        return { blogs, total: blogs.length }
      }
    }
    break
  }

  case 'all':
  default: {
    if (typeof data === 'object' && data !== null) {
      // Handle standard blog list response
      if ('blogs' in data && Array.isArray((data as Record<string, unknown>).blogs)) {
        const response = data as { blogs: BlogSummaryResponseDto[]; meta?: { total?: number } }
        const blogs = response.blogs.map(blog => toBlogCard(blog))
        return { 
          blogs, 
          total: response.meta?.total || blogs.length 
        }
      }
      
      // Handle direct array response
      if (Array.isArray(data)) {
        const blogs = data.map(blog => toBlogCard(blog as BlogSummaryResponseDto))
        return { blogs, total: blogs.length }
      }
    }
    break
  }
  }

  return { blogs: [], total: 0 }
}

// Process tags from different response formats
export function processTagsData(data: unknown): Array<{
  id: string
  name: string
  slug: string
  color?: string
}> {
  if (!data) return []

  // Handle structured response with tags array
  if (typeof data === 'object' && data !== null && 'tags' in data) {
    const response = data as { tags: Array<Record<string, unknown>> }
    if (Array.isArray(response.tags)) {
      return response.tags.map((tag: Record<string, unknown>) => ({
        id: (tag.id || tag.slug || tag.name) as string,
        name: (tag.name || '') as string,
        slug: (tag.slug || '') as string,
        color: tag.color as string | undefined,
      }))
    }
  }
  
  // Handle direct array response
  if (Array.isArray(data)) {
    return data.map((tag: Record<string, unknown>) => ({
      id: (tag.id || tag.slug || tag.name) as string,
      name: (tag.name || '') as string,
      slug: (tag.slug || '') as string,
      color: tag.color as string | undefined,
    }))
  }

  return []
}

// Helper to determine if response has pagination
export function hasPagination(data: unknown): boolean {
  return !!(
    data && 
    typeof data === 'object' && 
    ('meta' in data || 'pagination' in data)
  )
}

// Extract error message from various error formats
export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred'
  
  if (typeof error === 'string') return error
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }
    
    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }
  }
  
  return 'An unexpected error occurred'
}
