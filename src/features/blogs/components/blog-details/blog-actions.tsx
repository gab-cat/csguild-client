'use client'

import { 
  Heart, 
  Bookmark, 
  Share2 
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { useLikeBlog, useUnlikeBlog, useBookmarkBlog, useUnbookmarkBlog } from '../../hooks'

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

  // Sync with props when they change
  useEffect(() => {
    setIsLiked(initialIsLiked)
    setIsBookmarked(initialIsBookmarked)
    setLikeCount(initialLikeCount)
  }, [initialIsLiked, initialIsBookmarked, initialLikeCount])

  const likeBlogMutation = useLikeBlog()
  const unlikeBlogMutation = useUnlikeBlog()
  const bookmarkBlogMutation = useBookmarkBlog()
  const unbookmarkBlogMutation = useUnbookmarkBlog()

  const handleLike = async () => {
    const newLikedState = !isLiked
    const originalLikeCount = likeCount
    
    // Optimistic update
    setIsLiked(newLikedState)
    setLikeCount(prev => newLikedState ? prev + 1 : prev - 1)
    
    try {
      if (newLikedState) {
        await likeBlogMutation.mutateAsync(blogSlug)
      } else {
        await unlikeBlogMutation.mutateAsync(blogSlug)
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
    }
  }

  const handleBookmark = async () => {
    const newBookmarkedState = !isBookmarked
    
    // Optimistic update
    setIsBookmarked(newBookmarkedState)
    
    try {
      if (newBookmarkedState) {
        await bookmarkBlogMutation.mutateAsync(blogSlug)
      } else {
        await unbookmarkBlogMutation.mutateAsync(blogSlug)
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
    }
  }

  const handleShare = () => {
    onShare?.()
  }

  const isLoading = likeBlogMutation.isPending || 
                   unlikeBlogMutation.isPending || 
                   bookmarkBlogMutation.isPending || 
                   unbookmarkBlogMutation.isPending

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          'gap-2 hover:bg-purple-500/20',
          isLiked && 'text-pink-400 hover:text-pink-300'
        )}
      >
        <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
        <span>{likeCount}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        disabled={isLoading}
        className={cn(
          'hover:bg-purple-500/20',
          isBookmarked && 'text-purple-400 hover:text-purple-300'
        )}
      >
        <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
      </Button>
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleShare}
        disabled={isLoading}
        className="hover:bg-purple-500/20 text-gray-300"
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
