'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useDebounce } from '@/hooks/use-debounce'
import { api } from '@/lib/convex'

import {
  BlogHeaderWithNavigation,
  BlogListingContent,
  BlogSidebar,
} from '../components/listing'
import type { BlogFiltersType, BlogCardType } from '../types'
import { processBlogData, processTagsData, extractErrorMessage } from '../utils/data-processing'

type BlogTab = 'all' | 'featured' | 'trending' | 'popular'

interface BlogFilter {
  categories: string[]
  tags: string[]
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
  status: 'all' | 'DRAFT' | 'PUBLISHED' | 'PENDING' | 'ARCHIVED'
}

export default function BlogsListingPageRefactored() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useCurrentUser()


  // Get pagination from URL params
  const currentPage = parseInt(searchParams.get('page') || '1')
  const itemsPerPage = parseInt(searchParams.get('limit') || '10')
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [activeTab, setActiveTab] = useState<BlogTab>((searchParams.get('tab') as BlogTab) || 'all')
  const [filters] = useState<BlogFilter>({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    tags: searchParams.get('tag') ? [searchParams.get('tag')!] : [],
    sortBy: 'newest',
    status: 'all'
  })

  // Debounced search
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Transform filters for API call
  const apiFilters = useMemo<BlogFiltersType>(() => {
    const baseFilters: BlogFiltersType = {
      page: currentPage,
      limit: itemsPerPage,
      status: filters.status !== 'all' ? filters.status : undefined,
    }

    if (debouncedSearchQuery) {
      baseFilters.search = debouncedSearchQuery
    }

    if (filters.categories.length > 0) {
      baseFilters.categories = filters.categories
    }

    if (filters.tags.length > 0) {
      baseFilters.tags = filters.tags
    }

    // Set sorting
    switch (filters.sortBy) {
    case 'newest':
      baseFilters.sortBy = 'publishedAt'
      baseFilters.sortOrder = 'desc'
      break
    case 'oldest':
      baseFilters.sortBy = 'publishedAt'
      baseFilters.sortOrder = 'asc'
      break
    case 'popular':
      baseFilters.sortBy = 'viewCount'
      baseFilters.sortOrder = 'desc'
      break
    case 'trending':
      baseFilters.sortBy = 'likeCount'
      baseFilters.sortOrder = 'desc'
      break
    }

    return baseFilters
  }, [currentPage, itemsPerPage, debouncedSearchQuery, filters])

  // Query hooks based on active tab
  const blogsResponse = useQuery(api.blogs.getBlogs, activeTab === 'all' ? {
    paginationOpts: { numItems: itemsPerPage, cursor: ((currentPage - 1) * itemsPerPage).toString() },
    search: apiFilters.search,
    status: 'PUBLISHED',
    categorySlug: apiFilters.categories?.[0],
    tagSlug: apiFilters.tags?.[0],
    sortBy: apiFilters.sortBy,
    sortOrder: apiFilters.sortOrder,
    userSlug: user?.username, // Pass user slug for interaction state
  } : "skip")
  const isBlogsLoading = blogsResponse === undefined
  const isBlogsError = false
  const blogsError = null

  const featuredResponse = useQuery(api.blogs.getFeaturedBlogs, activeTab === 'featured' ? {
    paginationOpts: { numItems: itemsPerPage, cursor: ((currentPage - 1) * itemsPerPage).toString() },
    userSlug: user?.username, // Pass user slug for interaction state
  } : "skip")
  const isFeaturedLoading = featuredResponse === undefined
  const isFeaturedError = false
  const featuredError = null

  // Note: Trending and Popular queries don't exist in Convex, so we'll use the main blogs query with appropriate filters
  const trendingResponse = useQuery(api.blogs.getBlogs, activeTab === 'trending' ? {
    paginationOpts: { numItems: itemsPerPage, cursor: ((currentPage - 1) * itemsPerPage).toString() },
    status: 'PUBLISHED',
    sortBy: 'likeCount',
    sortOrder: 'desc',
    userSlug: user?.username, // Pass user slug for interaction state
  } : "skip")
  const isTrendingLoading = trendingResponse === undefined
  const isTrendingError = false
  const trendingError = null

  const popularResponse = useQuery(api.blogs.getBlogs, activeTab === 'popular' ? {
    paginationOpts: { numItems: itemsPerPage, cursor: ((currentPage - 1) * itemsPerPage).toString() },
    status: 'PUBLISHED',
    sortBy: 'viewCount',
    sortOrder: 'desc',
    userSlug: user?.username, // Pass user slug for interaction state
  } : "skip")
  const isPopularLoading = popularResponse === undefined
  const isPopularError = false
  const popularError = null

  // Get staff picks (featured blogs for sidebar)
  const staffPicksResponse = useQuery(api.blogs.getFeaturedBlogs, {
    paginationOpts: { numItems: 6, cursor: '0' },
    userSlug: user?.username, // Pass user slug for interaction state
  })
  const isStaffPicksLoading = staffPicksResponse === undefined

  // Categories and tags for recommendations
  const tagsResponse = useQuery(api.blogs.getTags, {})
  const isTagsLoading = tagsResponse === undefined

  // Process data based on active tab
  const { blogs, total: totalItems } = useMemo(() => {
    let currentData: unknown

    switch (activeTab) {
    case 'featured':
      currentData = featuredResponse
      break
    case 'trending':
      currentData = trendingResponse
      break
    case 'popular':
      currentData = popularResponse
      break
    default:
      currentData = blogsResponse
      break
    }

    return processBlogData(currentData, activeTab);
  }, [activeTab, blogsResponse, featuredResponse, trendingResponse, popularResponse])

  // Process loading and error states
  const isLoading = useMemo(() => {
    switch (activeTab) {
    case 'featured':
      return isFeaturedLoading
    case 'trending':
      return isTrendingLoading
    case 'popular':
      return isPopularLoading
    default:
      return isBlogsLoading
    }
  }, [activeTab, isBlogsLoading, isFeaturedLoading, isTrendingLoading, isPopularLoading])

  const isError = useMemo(() => {
    switch (activeTab) {
    case 'featured':
      return isFeaturedError
    case 'trending':
      return isTrendingError
    case 'popular':
      return isPopularError
    default:
      return isBlogsError
    }
  }, [activeTab, isBlogsError, isFeaturedError, isTrendingError, isPopularError])

  const error = useMemo(() => {
    switch (activeTab) {
    case 'featured':
      return featuredError
    case 'trending':
      return trendingError
    case 'popular':
      return popularError
    default:
      return blogsError
    }
  }, [activeTab, blogsError, featuredError, trendingError, popularError])

  // Process sidebar data
  const staffPicksData: BlogCardType[] = useMemo(() => {
    const processed = processBlogData(staffPicksResponse, 'featured')
    return processed.blogs
  }, [staffPicksResponse])

  const availableTags = useMemo(() => {
    return processTagsData(tagsResponse)
  }, [tagsResponse])

  // Event handlers
  const handleTabChange = useCallback((tab: BlogTab) => {
    setActiveTab(tab)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', tab)
    params.delete('page') // Reset to first page when changing tabs
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  const handleCreateBlog = useCallback(() => {
    router.push('/blogs/create')
  }, [router])

  const handleBookmark = useCallback((blogId: string) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark blog:', blogId)
  }, [])

  const handleShare = useCallback((blogId: string) => {
    // TODO: Implement share functionality
    console.log('Share blog:', blogId)
  }, [])

  return (
    <div className="min-h-screen bg-black">
      {/* Combined Header and Navigation */}
      <BlogHeaderWithNavigation
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreateBlog={handleCreateBlog}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2">
            <BlogListingContent
              blogs={blogs}
              activeTab={activeTab}
              isLoading={isLoading}
              isError={isError}
              error={error ? new Error(extractErrorMessage(error)) : null}
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onCreateBlog={handleCreateBlog}
              onBookmark={handleBookmark}
              onShare={handleShare}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <BlogSidebar
              staffPicks={staffPicksData}
              tags={availableTags}
              isLoadingStaffPicks={isStaffPicksLoading}
              isLoadingTags={isTagsLoading}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
