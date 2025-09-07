'use client'

import { useQuery } from "convex-helpers/react/cache/hooks";
import { formatDistanceToNow } from 'date-fns'
import { 
  Heart, 
  Reply, 
  MoreHorizontal, 
  Flag, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import React, { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMutation } from '@/lib/convex'
import { api, Id } from '@/lib/convex'
import { cn } from '@/lib/utils'

import type { BlogCommentType, BlogComment } from '../../types'
import { toCommentType } from '../../types'
import { Pagination } from '../shared/pagination'

import { CommentForm } from './comment-form'

interface CommentItemProps {
  comment: BlogCommentType
  blogSlug: string
  depth?: number
  onReply?: () => void
}

function CommentItem({ comment, blogSlug, depth = 0, onReply }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false)
  const [likeCount, setLikeCount] = useState(comment.likeCount)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const likeCommentMutation = useMutation(api.blogs.likeComment)
  const deleteCommentMutation = useMutation(api.blogs.deleteComment)
  const flagCommentMutation = useMutation(api.blogs.flagComment)

  // Fetch replies when needed (only if comment has replies and user wants to see them)
  const repliesQuery = useQuery(
    api.blogs.getCommentReplies,
    showReplies && (comment.replyCount || 0) > 0 ? { parentCommentId: comment.id as Id<"blogComments"> } : "skip"
  )

  // Transform Convex reply data to BlogCommentType format
  const transformReply = (reply: unknown): BlogCommentType => {
    return toCommentType(reply as BlogComment)
  }

  // Get the replies to display
  const displayReplies = repliesQuery ? repliesQuery.map(transformReply) : []
  const hasReplies = (comment.replyCount || 0) > 0
  const repliesLoading = !repliesQuery && showReplies && (comment.replyCount || 0) > 0
  const repliesError = false // Convex queries don't throw errors in the same way

  // Determine if we should show the "Show replies" button
  const shouldShowRepliesButton = hasReplies

  const handleLike = async () => {
    const originalLikedState = isLiked
    const originalLikeCount = likeCount

    try {
      const result = await likeCommentMutation({ commentId: comment.id as Id<"blogComments"> })

      // Update state based on the mutation result
      setIsLiked(result.liked)
      setLikeCount(result.likeCount)
    } catch (error) {
      // Revert on error
      setIsLiked(originalLikedState)
      setLikeCount(originalLikeCount)
      console.error('Failed to toggle comment like:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      await deleteCommentMutation({ commentId: comment.id as Id<"blogComments"> })
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const handleFlag = async () => {
    try {
      await flagCommentMutation({
        commentId: comment.id as Id<"blogComments">,
        reason: 'INAPPROPRIATE_CONTENT',
        description: 'Flagged for review'
      })
    } catch (error) {
      console.error('Failed to flag comment:', error)
    }
  }

  const handleReplyToggle = () => {
    setShowReplyForm(!showReplyForm)
    onReply?.()
  }

  const handleReplySubmitted = () => {
    setShowReplyForm(false)
  }

  const isLoading = false // Convex mutations don't expose pending state in the same way

  const maxDepth = 3 // Limit nesting depth

  return (
    <div className={cn(
      'space-y-3 transition-all duration-200 hover:bg-gray-800/20 rounded-lg p-2 -m-2',
      depth > 0 && 'ml-6 border-l border-gray-700 pl-4'
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="w-8 h-8 border border-gray-700">
          <AvatarImage src={comment.author.imageUrl || undefined} />
          <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
            {comment.author.firstName?.[0]}{comment.author.lastName?.[0]}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-2">
          {/* Comment header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white text-sm">
                {comment.author.firstName} {comment.author.lastName}
              </span>
              <span className="text-xs text-gray-400">
                @{comment.author.username}
              </span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
              {(comment.createdAt !== comment.updatedAt) && (
                <>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">edited</span>
                </>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                <DropdownMenuItem 
                  onClick={handleFlag}
                  disabled={isLoading}
                  className="text-gray-300 hover:bg-gray-700"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                
                {/* Show edit/delete only for comment author */}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-gray-700"
                  disabled={true} // TODO: Implement edit functionality
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Comment content */}
          <div className="text-gray-300 text-sm leading-relaxed">
            {comment.content}
          </div>

          {/* Comment actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLoading}
              className={cn(
                'h-8 px-2 gap-1 text-xs hover:bg-gray-800',
                isLiked
                  ? 'text-pink-400 hover:text-pink-300'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <Heart className={cn('w-3 h-3', isLiked && 'fill-current')} />
              <span>{likeCount}</span>
            </Button>

            {depth < maxDepth && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplyToggle}
                disabled={isLoading}
                className="h-8 px-2 gap-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Reply className="w-3 h-3" />
                Reply
              </Button>
            )}

            {/* Show replies button - made subtle and inline */}
            {shouldShowRepliesButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
                disabled={isLoading || repliesLoading}
                className={cn(
                  "h-8 px-2 gap-1 text-xs transition-all duration-200 border",
                  showReplies
                    ? "text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border-gray-700"
                )}
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    <span className="hidden sm:inline">Hide</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    {repliesLoading ? (
                      <span className="hidden sm:inline">Loading...</span>
                    ) : (
                      <span className="hidden sm:inline">{comment.replyCount} replies</span>
                    )}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reply form with animation */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showReplyForm 
            ? "opacity-100 max-h-96 mt-3" 
            : "opacity-0 max-h-0"
        )}
      >
        {showReplyForm && (
          <div className="ml-11 animate-in slide-in-from-top-2 duration-300">
            <CommentForm
              blogSlug={blogSlug}
              parentId={comment.id}
              onCommentSubmitted={handleReplySubmitted}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
              showAvatar={false}
            />
          </div>
        )}
      </div>

      {/* Nested replies with animation */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showReplies && shouldShowRepliesButton 
            ? "opacity-100 max-h-screen" 
            : "opacity-0 max-h-0"
        )}
      >
        {shouldShowRepliesButton && (
          <div className="space-y-3 pt-3">
            {repliesLoading && (
              <div className="ml-11 text-gray-400 text-sm animate-pulse">
                Loading replies...
              </div>
            )}
            {repliesError && (
              <div className="ml-11 text-red-400 text-sm">
                Failed to load replies
              </div>
            )}
            {displayReplies && displayReplies.length > 0 && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                {displayReplies.map((reply, index) => (
                  <div
                    key={reply.id}
                    className="animate-in fade-in slide-in-from-left-4"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationDuration: '300ms'
                    }}
                  >
                    <CommentItem
                      comment={reply}
                      blogSlug={blogSlug}
                      depth={depth + 1}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface CommentListProps {
  comments: BlogCommentType[]
  blogSlug: string
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CommentList({
  comments,
  blogSlug,
  currentPage,
  totalPages,
  onPageChange
}: CommentListProps) {
  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-gray-400 mb-2">No comments yet</div>
        <div className="text-gray-500 text-sm">
          Be the first to share your thoughts!
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comments */}
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div
            key={comment.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ 
              animationDelay: `${index * 100}ms`,
              animationDuration: '400ms'
            }}
          >
            <CommentItem
              comment={comment}
              blogSlug={blogSlug}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}
