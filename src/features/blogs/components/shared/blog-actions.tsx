import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface BlogActionsProps {
  blogSlug: string
  isLiked?: boolean
  isBookmarked?: boolean
  likeCount: number
  commentCount: number
  onLike?: () => void
  onUnlike?: () => void
  onBookmark?: () => void
  onUnbookmark?: () => void
  onShare?: () => void
  onComment?: () => void
  onReport?: () => void
  onCopyLink?: () => void
  variant?: 'default' | 'compact' | 'minimal'
  orientation?: 'horizontal' | 'vertical'
  showCounts?: boolean
  className?: string
  canReport?: boolean
}

export function BlogActions({
  blogSlug,
  isLiked = false,
  isBookmarked = false,
  likeCount,
  commentCount,
  onLike,
  onUnlike,
  onBookmark,
  onUnbookmark,
  onShare,
  onComment,
  onReport,
  onCopyLink,
  variant = 'default',
  orientation = 'horizontal',
  showCounts = true,
  className,
  canReport = true
}: BlogActionsProps) {
  const handleLike = () => {
    if (isLiked && onUnlike) {
      onUnlike()
    } else if (!isLiked && onLike) {
      onLike()
    }
  }

  const handleBookmark = () => {
    if (isBookmarked && onUnbookmark) {
      onUnbookmark()
    } else if (!isBookmarked && onBookmark) {
      onBookmark()
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare()
    } else {
      // Default share behavior
      if (navigator.share) {
        navigator.share({
          url: `/blogs/${blogSlug}`,
          title: 'Check out this blog post!'
        })
      } else if (onCopyLink) {
        onCopyLink()
      } else {
        navigator.clipboard.writeText(`${window.location.origin}/blogs/${blogSlug}`)
      }
    }
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(
        'flex items-center gap-1',
        orientation === 'vertical' && 'flex-col',
        className
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'gap-1 h-8 px-2',
            isLiked && 'text-red-500 hover:text-red-600'
          )}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          {showCounts && <span className="text-xs">{formatCount(likeCount)}</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="gap-1 h-8 px-2"
        >
          <MessageCircle className="w-4 h-4" />
          {showCounts && <span className="text-xs">{formatCount(commentCount)}</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="h-8 px-2"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn(
        'flex items-center gap-2',
        orientation === 'vertical' && 'flex-col',
        className
      )}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              'gap-2',
              isLiked && 'text-red-500 hover:text-red-600'
            )}
          >
            <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
            {showCounts && <span>{formatCount(likeCount)}</span>}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            {showCounts && <span>{formatCount(commentCount)}</span>}
          </Button>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={cn(
              isBookmarked && 'text-blue-500 hover:text-blue-600'
            )}
          >
            <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Default variant with dropdown menu
  return (
    <div className={cn(
      'flex items-center justify-between',
      orientation === 'vertical' && 'flex-col gap-4',
      className
    )}>
      <div className={cn(
        'flex items-center gap-2',
        orientation === 'vertical' && 'flex-col'
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className={cn(
            'gap-2',
            isLiked && 'text-red-500 hover:text-red-600'
          )}
        >
          <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
          {showCounts && <span>{formatCount(likeCount)}</span>}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onComment}
          className="gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          {showCounts && <span>{formatCount(commentCount)}</span>}
        </Button>
      </div>
      
      <div className={cn(
        'flex items-center gap-2',
        orientation === 'vertical' && 'flex-col'
      )}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={cn(
            isBookmarked && 'text-blue-500 hover:text-blue-600'
          )}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" title="More options">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onCopyLink || (() => {
              navigator.clipboard.writeText(`${window.location.origin}/blogs/${blogSlug}`)
            })}>
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              Share via...
            </DropdownMenuItem>
            {canReport && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onReport}
                  className="text-destructive focus:text-destructive"
                >
                  Report
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
