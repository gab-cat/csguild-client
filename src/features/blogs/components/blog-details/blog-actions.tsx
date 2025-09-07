'use client'

import { 
  Heart, 
  Bookmark, 
  Share2 
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'


interface BlogActionsProps {
  blogSlug: string
  initialLikeCount: number
  initialIsLiked?: boolean
  initialIsBookmarked?: boolean
  onLike?: (liked: boolean) => void
  onBookmark?: (bookmarked: boolean) => void
  onShare?: () => void
}

export function BlogActions({
  blogSlug,
  initialLikeCount,
  initialIsLiked = false,
  initialIsBookmarked = false,
  onLike,
  onBookmark,
  onShare
}: BlogActionsProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLoading, setIsLoading] = useState(false)

  // Sync with props when they change
  useEffect(() => {
    setIsLiked(initialIsLiked)
    setIsBookmarked(initialIsBookmarked)
    setLikeCount(initialLikeCount)
  }, [initialIsLiked, initialIsBookmarked, initialLikeCount])

  const likeBlogMutation = useMutation(api.blogs.likeBlog)
  const unlikeBlogMutation = useMutation(api.blogs.unlikeBlog)
  const bookmarkBlogMutation = useMutation(api.blogs.bookmarkBlog)
  const unbookmarkBlogMutation = useMutation(api.blogs.unbookmarkBlog)

  const handleLike = async () => {
    const newLikedState = !isLiked
    const originalLikeCount = likeCount

    // Set loading state
    setIsLoading(true)

    // Optimistic update
    setIsLiked(newLikedState)
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)

    try {
      if (newLikedState) {
        await likeBlogMutation({ slug: blogSlug })
      } else {
        await unlikeBlogMutation({ slug: blogSlug })
      }

      onLike?.(newLikedState)
      showSuccessToast(
        newLikedState ? 'Added to likes' : 'Removed from likes',
        newLikedState ? 'Blog added to your likes' : 'Blog removed from your likes'
      )
    } catch (error) {
      // Revert on error
      setIsLiked(initialIsLiked)
      setLikeCount(originalLikeCount)
      console.error('Failed to toggle like:', error)
    } finally {
      // Clear loading state
      setIsLoading(false)
    }
  }

  const handleBookmark = async () => {
    const newBookmarkedState = !isBookmarked

    // Set loading state
    setIsLoading(true)

    // Optimistic update
    setIsBookmarked(newBookmarkedState)

    try {
      if (newBookmarkedState) {
        await bookmarkBlogMutation({ slug: blogSlug })
      } else {
        await unbookmarkBlogMutation({ slug: blogSlug })
      }

      onBookmark?.(newBookmarkedState)
      showSuccessToast(
        newBookmarkedState ? 'Added to bookmarks' : 'Removed from bookmarks',
        newBookmarkedState ? 'Blog added to your bookmarks' : 'Blog removed from your bookmarks'
      )
    } catch (error) {
      // Revert on error
      setIsBookmarked(initialIsBookmarked)
      console.error('Failed to toggle bookmark:', error)
    } finally {
      // Clear loading state
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    onShare?.()
  }


  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          'gap-2 border-gray-600 hover:bg-purple-500/20 hover:border-purple-500/50',
          isLiked && 'text-pink-400 hover:text-pink-300 border-pink-500/50'
        )}
      >
        <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
        <span>{likeCount}</span>
        <span className="ml-1">{isLiked ? 'Unlike' : 'Like'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleBookmark}
        disabled={isLoading}
        className={cn(
          'gap-2 border-gray-600 hover:bg-purple-500/20 hover:border-purple-500/50',
          isBookmarked && 'text-purple-400 hover:text-purple-300 border-purple-500/50'
        )}
      >
        <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        <span>{isBookmarked ? 'Remove from bookmark' : 'Add to bookmark'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={isLoading}
        className="gap-2 border-gray-600 hover:bg-purple-500/20 hover:border-purple-500/50 text-gray-300"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </Button>
    </div>
  )
}
