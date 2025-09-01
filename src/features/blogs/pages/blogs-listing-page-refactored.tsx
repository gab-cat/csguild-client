'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'

import { useDebounce } from '@/hooks/use-debounce'

import {
  BlogHeaderWithNavigation,
  BlogListingContent,
  BlogSidebar,
} from '../components/listing'
import { useBlogs, useTags, useFeaturedBlogs, useTrendingBlogs, usePopularBlogs } from '../hooks'
import type { BlogFiltersType, BlogCardType } from '../types'
import { processBlogData, processTagsData, extractErrorMessage } from '../utils/data-processing'

type BlogTab = 'all' | 'featured' | 'trending' | 'popular'

interface BlogFilter {
  categories: string[]
  tags: string[]
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending'
  status: 'all' | 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'
}

export default function BlogsListingPageRefactored() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
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
  const {
    data: blogsResponse,
    isLoading: isBlogsLoading,
    isError: isBlogsError,
    error: blogsError
  } = useBlogs(activeTab === 'all' ? apiFilters : {})

  const {
    data: featuredResponse,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
    error: featuredError
  } = useFeaturedBlogs(activeTab === 'featured' ? { limit: itemsPerPage, page: currentPage } : {})

  const {
    data: trendingResponse,
    isLoading: isTrendingLoading,
    isError: isTrendingError,
    error: trendingError
  } = useTrendingBlogs(activeTab === 'trending' ? { limit: itemsPerPage, timeframe: 'week' } : {})

  const {
    data: popularResponse,
    isLoading: isPopularLoading,
    isError: isPopularError,
    error: popularError
  } = usePopularBlogs(activeTab === 'popular' ? { limit: itemsPerPage, timeframe: 'month' } : {})

  // Get staff picks (featured blogs for sidebar)
  const { data: staffPicksResponse, isLoading: isStaffPicksLoading } = useFeaturedBlogs({ limit: 6 })

  // Categories and tags for recommendations
  const { data: tagsResponse, isLoading: isTagsLoading } = useTags({ onlyActive: true, limit: 20 })

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

    return processBlogData(currentData, activeTab)
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
