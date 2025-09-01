'use client'

import { useState, useMemo } from 'react'

import type { BlogSummaryResponseDto } from '@generated/api-client'

import { BlogCard, BlogSkeleton } from '../shared'


interface BlogListProps {
  blogs: BlogSummaryResponseDto[]
  loading?: boolean
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  className?: string
  itemClassName?: string
  emptyMessage?: string
  skeletonCount?: number
}

export function BlogList({
  blogs,
  loading = false,
  variant = 'default',
  showActions = true,
  className = '',
  itemClassName = '',
  emptyMessage = 'No blogs found.',
  skeletonCount = 6
}: BlogListProps) {
  const [hoveredBlogId, setHoveredBlogId] = useState<string | null>(null)

  const renderedBlogs = useMemo(() => {
    return blogs.map((blog) => (
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
    ))
  }, [blogs, variant, showActions, itemClassName, hoveredBlogId])

  const skeletonBlogs = useMemo(() => {
    return Array.from({ length: skeletonCount }, (_, index) => (
      <div key={`skeleton-${index}`} className={itemClassName}>
        <BlogSkeleton variant={variant} showActions={showActions} />
      </div>
    ))
  }, [skeletonCount, variant, showActions, itemClassName])

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {skeletonBlogs}
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
    <div className={`space-y-6 ${className}`}>
      {renderedBlogs}
    </div>
  )
}
