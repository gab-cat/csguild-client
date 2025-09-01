'use client'

import { useState, useMemo } from 'react'

import type { BlogSummaryResponseDto } from '@generated/api-client'

import { BlogCard, BlogSkeleton } from '../shared'

interface BlogGridProps {
  blogs: BlogSummaryResponseDto[]
  loading?: boolean
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  columns?: 1 | 2 | 3 | 4
  className?: string
  itemClassName?: string
  emptyMessage?: string
  skeletonCount?: number
  featuredFirst?: boolean
}

export function BlogGrid({
  blogs,
  loading = false,
  variant = 'default',
  showActions = true,
  columns = 3,
  className = '',
  itemClassName = '',
  emptyMessage = 'No blogs found.',
  skeletonCount = 6,
  featuredFirst = true
}: BlogGridProps) {
  const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null)

  const sortedBlogs = useMemo(() => {
    if (!featuredFirst) return blogs
    
    return [...blogs].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return 0
    })
  }, [blogs, featuredFirst])

  const featuredBlog = useMemo(() => {
    return featuredFirst && sortedBlogs.find(blog => blog.isFeatured)
  }, [sortedBlogs, featuredFirst])

  const regularBlogs = useMemo(() => {
    return featuredFirst && featuredBlog 
      ? sortedBlogs.filter(blog => !blog.isFeatured)
      : sortedBlogs
  }, [sortedBlogs, featuredBlog, featuredFirst])

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  const skeletonBlogs = useMemo(() => {
    return Array.from({ length: skeletonCount }, (_, index) => (
      <div key={`skeleton-${index}`} className={itemClassName}>
        <BlogSkeleton 
          variant={index === 0 && featuredFirst ? 'featured' : variant} 
          showActions={showActions} 
        />
      </div>
    ))
  }, [skeletonCount, variant, showActions, itemClassName, featuredFirst])

  if (loading) {
    return (
      <div className={className}>
        {featuredFirst && (
          <div className="mb-8">
            <BlogSkeleton variant="featured" showActions={showActions} />
          </div>
        )}
        <div className={`grid gap-6 ${columnClasses[columns]}`}>
          {skeletonBlogs}
        </div>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Featured Blog */}
      {featuredBlog && (
        <div className="mb-8">
          <BlogCard
            blog={featuredBlog}
            variant="featured"
            showActions={showActions}
            className="transition-all duration-200"
          />
        </div>
      )}

      {/* Regular Blog Grid */}
      {regularBlogs.length > 0 && (
        <div className={`grid gap-6 ${columnClasses[columns]}`}>
          {regularBlogs.map((blog) => (
            <div
              key={blog.id}
              className={itemClassName}
              onMouseEnter={() => setHoveredBlogId(blog.id)}
              onMouseLeave={() => setHoveredBlogId(null)}
            >
              <BlogCard
                blog={blog}
                variant={variant}
                showActions={showActions}
                className={`transition-all duration-200 ${
                  hoveredBlogId && hoveredBlogId !== blog.id ? 'opacity-70' : ''
                }`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
