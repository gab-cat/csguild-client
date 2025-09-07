'use client'

import { useQuery } from "convex-helpers/react/cache/hooks";
import { MessageCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/convex'

import type { BlogDetail, BlogComment, BlogCommentType } from '../../types'
import { toCommentType } from '../../types'

import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'

interface BlogCommentsSectionProps {
  blog: BlogDetail
}

export function BlogCommentsSection({ blog }: BlogCommentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Get comments using the blog ID from the prop
  const commentsData = useQuery(
    api.blogs.getCommentsForBlog,
    blog._id ? {
      blogId: blog._id,
      paginationOpts: {
        numItems: 10,
        cursor: currentPage > 1 ? ((currentPage - 1) * 10).toString() : null
      }
    } : "skip"
  )

  const isLoading = !commentsData
  const isError = !blog._id
  const error = !blog._id ? new Error('Blog not found') : null

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    setCurrentPage(1) // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Transform Convex comment data to internal BlogCommentType format
  const transformComments = (convexComments: NonNullable<typeof commentsData>['page']): BlogCommentType[] => {
    if (!convexComments) return []

    return convexComments.map(comment => toCommentType(comment as unknown as BlogComment))
  }

  // Calculate total pages from pagination data
  const totalPages = commentsData?.isDone ? currentPage : Math.max(currentPage + 1, 1)

  if (isError) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Comments ({blog.commentCount || 0})</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-red-400 mb-2">Failed to load comments</div>
          <div className="text-gray-400 text-sm">
            {error?.message || 'Something went wrong while loading comments'}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Please check your connection and try again
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            Comments ({blog.commentCount || 0})
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSortToggle}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            {sortOrder === 'desc' ? (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Newest first
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Oldest first
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Comment Form */}
          <CommentForm blogSlug={blog.slug} />

          {/* Comments List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i} 
                  className="space-y-3 animate-in fade-in slide-in-from-bottom-4"
                  style={{ 
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '400ms'
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-10 h-10 rounded-full bg-gray-800 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32 bg-gray-800 animate-pulse" />
                      <Skeleton className="h-20 w-full bg-gray-800 animate-pulse" />
                      <Skeleton className="h-3 w-24 bg-gray-800 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CommentList
              comments={commentsData?.page ? transformComments(commentsData.page) : []}
              blogSlug={blog.slug}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
