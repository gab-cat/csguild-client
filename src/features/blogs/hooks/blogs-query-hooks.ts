import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

import type { BlogFiltersType } from '../types'
import { blogsApiUtils, blogsExtendedApiUtils, blogsActionsApiUtils, commentsApiUtils, blogManagementApiUtils } from '../utils'

// Query keys for blog queries
export const blogQueryKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogQueryKeys.all, 'list'] as const,
  list: (filters: BlogFiltersType) => [...blogQueryKeys.lists(), filters] as const,
  details: () => [...blogQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogQueryKeys.details(), slug] as const,
  related: (slug: string) => [...blogQueryKeys.all, 'related', slug] as const,
  revisions: (slug: string) => [...blogQueryKeys.all, 'revisions', slug] as const,
  authorStats: (authorId: string) => [...blogQueryKeys.all, 'author-stats', authorId] as const,
  search: (query: string, filters?: Partial<BlogFiltersType>) => 
    [...blogQueryKeys.all, 'search', query, filters] as const,
  featured: (filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'featured', filters] as const,
  pinned: (filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'pinned', filters] as const,
  myBlogs: (filters?: Pick<BlogFiltersType, 'status' | 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'my-blogs', filters] as const,
  byAuthor: (authorSlug: string, filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'by-author', authorSlug, filters] as const,
  byTag: (tagSlug: string, filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'by-tag', tagSlug, filters] as const,
  byCategory: (categorySlug: string, filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'by-category', categorySlug, filters] as const,
  bookmarked: (filters?: Pick<BlogFiltersType, 'limit' | 'page'>) => 
    [...blogQueryKeys.all, 'bookmarked', filters] as const,
  categories: (filters?: { onlyActive?: boolean; limit?: number; page?: number }) => 
    [...blogQueryKeys.all, 'categories', filters] as const,
  tags: (filters?: { onlyActive?: boolean; limit?: number; page?: number }) => 
    [...blogQueryKeys.all, 'tags', filters] as const,
  popular: (filters?: { limit?: number; timeframe?: 'day' | 'week' | 'month' }) => 
    [...blogQueryKeys.all, 'popular', filters] as const,
  recent: (filters?: { limit?: number }) => 
    [...blogQueryKeys.all, 'recent', filters] as const,
  trending: (filters?: { limit?: number; timeframe?: 'day' | 'week' | 'month' }) => 
    [...blogQueryKeys.all, 'trending', filters] as const,
  analytics: (filters?: { timeframe?: 'day' | 'week' | 'month' | 'all'; startDate?: string; endDate?: string }) => 
    [...blogQueryKeys.all, 'analytics', filters] as const,
  stats: (id: string) => 
    [...blogQueryKeys.all, 'stats', id] as const,
}

// Comment query keys
export const commentQueryKeys = {
  all: ['comments'] as const,
  forBlog: (blogSlug: string, filters?: { page?: string; limit?: string; sort?: string }) => 
    [...commentQueryKeys.all, 'blog', blogSlug, filters] as const,
  replies: (blogSlug: string, parentId: string, filters?: { page?: string; limit?: string; sort?: string }) =>
    [...commentQueryKeys.all, 'replies', blogSlug, parentId, filters] as const,
}

// Management query keys
export const managementQueryKeys = {
  all: ['management'] as const,
  categories: (filters?: { page?: number; limit?: number }) => 
    [...managementQueryKeys.all, 'categories', filters] as const,
  tags: (filters?: { page?: number; limit?: number }) => 
    [...managementQueryKeys.all, 'tags', filters] as const,
}

// Get all blogs with filtering and pagination
export function useBlogs(filters: BlogFiltersType = {}) {
  return useQuery({
    queryKey: blogQueryKeys.list(filters),
    queryFn: () => blogsApiUtils.getBlogs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Get all blogs with infinite scroll
export function useBlogsInfinite(filters: BlogFiltersType = {}) {
  return useInfiniteQuery({
    queryKey: blogQueryKeys.list(filters),
    queryFn: ({ pageParam = 1 }) => blogsApiUtils.getBlogs({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta || !lastPage.meta.page || !lastPage.meta.limit || !lastPage.meta.total) {
        return undefined
      }
      const { page, limit, total } = lastPage.meta
      const totalPages = Math.ceil(total / limit)
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get a specific blog by slug
export function useBlog(slug: string, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.detail(slug),
    queryFn: () => blogsApiUtils.getBlogBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

// Get related blogs
export function useRelatedBlogs(slug: string, limit = 5, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.related(slug),
    queryFn: () => blogsApiUtils.getRelatedBlogs(slug, limit),
    enabled: enabled && !!slug,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  })
}

// Get blog revisions (admin only)
export function useBlogRevisions(slug: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.revisions(slug),
    queryFn: () => blogsApiUtils.getBlogRevisions(slug, page, limit),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get author statistics
export function useAuthorStats(authorId: string, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.authorStats(authorId),
    queryFn: () => blogsApiUtils.getAuthorStats(authorId),
    enabled: enabled && !!authorId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Search blogs
export function useSearchBlogs(
  query: string, 
  filters: Partial<BlogFiltersType> = {},
  enabled = true
) {
  return useQuery({
    queryKey: blogQueryKeys.search(query, filters),
    queryFn: () => blogsExtendedApiUtils.searchBlogs(
      query, 
      filters.tags?.join(','), 
      filters.categories?.join(','),
      filters.authorSlug,
      filters.dateFrom,
      filters.dateTo,
      filters.limit,
      filters.page
    ),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Search blogs with infinite scroll
export function useSearchBlogsInfinite(
  query: string,
  filters: Partial<BlogFiltersType> = {}
) {
  return useInfiniteQuery({
    queryKey: blogQueryKeys.search(query, filters),
    queryFn: ({ pageParam = 1 }) => 
      blogsExtendedApiUtils.searchBlogs(
        query, 
        filters.tags?.join(','), 
        filters.categories?.join(','),
        filters.authorSlug,
        filters.dateFrom,
        filters.dateTo,
        filters.limit,
        pageParam
      ),
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta || !lastPage.meta.page || !lastPage.meta.limit || !lastPage.meta.total) {
        return undefined
      }
      const { page, limit, total } = lastPage.meta
      const totalPages = Math.ceil(total / limit)
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get featured blogs
export function useFeaturedBlogs(
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.featured(filters),
    queryFn: () => blogsApiUtils.getFeaturedBlogs(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get pinned blogs
export function usePinnedBlogs(
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.pinned(filters),
    queryFn: () => blogsApiUtils.getPinnedBlogs(),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get current user's blogs
export function useMyBlogs(
  filters: Pick<BlogFiltersType, 'status' | 'limit' | 'page'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.myBlogs(filters),
    queryFn: () => blogsExtendedApiUtils.getMyBlogs(filters.status, filters.limit, filters.page),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get current user's blogs with infinite scroll
export function useMyBlogsInfinite(
  filters: Pick<BlogFiltersType, 'status' | 'limit' | 'page'> = {}
) {
  return useInfiniteQuery({
    queryKey: blogQueryKeys.myBlogs(filters),
    queryFn: ({ pageParam = 1 }) => 
      blogsExtendedApiUtils.getMyBlogs(filters.status, filters.limit, pageParam),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination || !lastPage.pagination.page || !lastPage.pagination.limit || !lastPage.pagination.total) {
        return undefined
      }
      const { page, limit, total } = lastPage.pagination
      const totalPages = Math.ceil(total / limit)
      return page < totalPages ? page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get blogs by author
export function useBlogsByAuthor(
  authorSlug: string,
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {},
  enabled = true
) {
  return useQuery({
    queryKey: blogQueryKeys.byAuthor(authorSlug, filters),
    queryFn: () => blogsExtendedApiUtils.getBlogsByAuthor(authorSlug, undefined, filters.limit, filters.page),
    enabled: enabled && !!authorSlug,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get blogs by tag
export function useBlogsByTag(
  tagSlug: string,
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {},
  enabled = true
) {
  return useQuery({
    queryKey: blogQueryKeys.byTag(tagSlug, filters),
    queryFn: () => blogsExtendedApiUtils.getBlogsByTag(tagSlug, filters.limit, filters.page),
    enabled: enabled && !!tagSlug,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get blogs by category
export function useBlogsByCategory(
  categorySlug: string,
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {},
  enabled = true
) {
  return useQuery({
    queryKey: blogQueryKeys.byCategory(categorySlug, filters),
    queryFn: () => blogsExtendedApiUtils.getBlogsByCategory(categorySlug, filters.limit, filters.page),
    enabled: enabled && !!categorySlug,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get bookmarked blogs
export function useBookmarkedBlogs(
  filters: Pick<BlogFiltersType, 'limit' | 'page'> = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.bookmarked(filters),
    queryFn: () => blogsExtendedApiUtils.getBookmarkedBlogs(filters.limit, filters.page),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

// Get all categories
export function useCategories(
  filters: { onlyActive?: boolean; limit?: number; page?: number } = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.categories(filters),
    queryFn: () => blogManagementApiUtils.getCategories(filters.page, filters.limit),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Get all tags
export function useTags(
  filters: { onlyActive?: boolean; limit?: number; page?: number } = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.tags(filters),
    queryFn: () => blogManagementApiUtils.getTags(filters.page, filters.limit),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Get popular blogs
export function usePopularBlogs(
  filters: { limit?: number; timeframe?: 'day' | 'week' | 'month' } = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.popular(filters),
    queryFn: () => blogsActionsApiUtils.getPopularBlogs(
      filters.limit || 10, 
      filters.timeframe || 'week'
    ),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

// Get recent blogs
export function useRecentBlogs(
  filters: { limit?: number } = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.recent(filters),
    queryFn: () => blogsActionsApiUtils.getRecentBlogs(
      filters.limit || 10
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}

// Get trending blogs
export function useTrendingBlogs(
  filters: { limit?: number; timeframe?: 'day' | 'week' | 'month' } = {}
) {
  return useQuery({
    queryKey: blogQueryKeys.trending(filters),
    queryFn: () => blogsActionsApiUtils.getTrendingBlogs(
      filters.limit || 10,
      filters.timeframe || 'day'
    ),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

// Get blog analytics
export function useBlogAnalytics(
  filters: { timeframe?: 'day' | 'week' | 'month' | 'all'; startDate?: string; endDate?: string } = {},
  enabled = true
) {
  return useQuery({
    queryKey: blogQueryKeys.analytics(filters),
    queryFn: () => blogsActionsApiUtils.getBlogAnalytics(
      filters.timeframe || 'week',
      filters.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      filters.endDate || new Date().toISOString()
    ),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  })
}

// Get blog statistics by ID
export function useBlogStats(id: string, enabled = true) {
  return useQuery({
    queryKey: blogQueryKeys.stats(id),
    queryFn: () => blogsActionsApiUtils.getBlogStats(id),
    enabled: enabled && !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  })
}

// Get comments for a blog
export function useCommentsForBlog(
  blogSlug: string,
  filters: { page?: string; limit?: string; sort?: string } = {},
  enabled = true
) {
  return useQuery({
    queryKey: commentQueryKeys.forBlog(blogSlug, filters),
    queryFn: () => commentsApiUtils.getCommentsForBlog(
      blogSlug,
      filters.page || '1',
      filters.limit || '20',
      filters.sort || 'createdAt:desc'
    ),
    enabled: enabled && !!blogSlug,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Get replies for a specific comment
export function useCommentReplies(
  blogSlug: string,
  parentId: string,
  filters: { page?: string; limit?: string; sort?: string } = {},
  enabled = true
) {
  return useQuery({
    queryKey: commentQueryKeys.replies(blogSlug, parentId, filters),
    queryFn: () => commentsApiUtils.getCommentsForBlog(
      blogSlug,
      filters.page || '1',
      filters.limit || '20',
      filters.sort || 'createdAt:asc', // Show oldest replies first
      parentId
    ),
    enabled: enabled && !!blogSlug && !!parentId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  })
}

// Get categories for management (admin only)
export function useManagementCategories(
  filters: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: managementQueryKeys.categories(filters),
    queryFn: () => blogManagementApiUtils.getCategories(filters.page, filters.limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}

// Get tags for management (admin only)
export function useManagementTags(
  filters: { page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: managementQueryKeys.tags(filters),
    queryFn: () => blogManagementApiUtils.getTags(filters.page, filters.limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  })
}
