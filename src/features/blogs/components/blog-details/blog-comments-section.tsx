'use client'

import { MessageCircle, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useCommentsForBlog } from '../../hooks'
import type { BlogDetailResponseDto } from '../../types'

import { CommentForm } from './comment-form'
import { CommentList } from './comment-list'

interface BlogCommentsSectionProps {
  blog: BlogDetailResponseDto
}

export function BlogCommentsSection({ blog }: BlogCommentsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [currentPage, setCurrentPage] = useState('1')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const {
    data: commentsData,
    isLoading,
    isError,
    error
  } = useCommentsForBlog(
    blog.slug,
    {
      page: currentPage,
      limit: '10',
      sort: `createdAt:${sortOrder}`
    }
  )

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
    setCurrentPage('1') // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page.toString())
  }

  if (isError) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Comments ({blog.commentCount})</h3>
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
            Comments ({blog.commentCount})
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
              comments={commentsData?.data || []}
              blogSlug={blog.slug}
              currentPage={parseInt(currentPage)}
              totalPages={commentsData?.pagination?.pages || 1}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}
