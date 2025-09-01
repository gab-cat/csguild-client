import { Heart, MessageCircle, Share2, Bookmark, Eye, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogStatsProps {
  viewCount: number
  likeCount: number
  commentCount: number
  shareCount?: number
  bookmarkCount?: number
  isLiked?: boolean
  isBookmarked?: boolean
  onLike?: () => void
  onBookmark?: () => void
  onShare?: () => void
  readingTime?: number | null
  variant?: 'default' | 'minimal' | 'detailed'
  orientation?: 'horizontal' | 'vertical'
  showLabels?: boolean
  interactive?: boolean
  className?: string
}

export function BlogStats({
  viewCount,
  likeCount,
  commentCount,
  shareCount,
  bookmarkCount,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  onShare,
  readingTime,
  variant = 'default',
  orientation = 'horizontal',
  showLabels = false,
  interactive = true,
  className
}: BlogStatsProps) {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const StatItem = ({ 
    icon: Icon, 
    count, 
    label, 
    onClick, 
    isActive = false, 
    activeColor = 'text-red-500' 
  }: {
    icon: React.ElementType
    count: number | string
    label?: string
    onClick?: () => void
    isActive?: boolean
    activeColor?: string
  }) => {
    const content = (
      <>
        <Icon className={cn(
          'w-4 h-4',
          isActive && activeColor,
          isActive && Icon === Heart && 'fill-current',
          isActive && Icon === Bookmark && 'fill-current'
        )} />
        <span className={cn(
          'text-sm',
          isActive && activeColor
        )}>
          {typeof count === 'number' ? formatCount(count) : count}
        </span>
        {showLabels && label && (
          <span className="text-xs text-muted-foreground">{label}</span>
        )}
      </>
    )

    if (interactive && onClick) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={cn(
            'gap-1 h-auto p-1',
            orientation === 'vertical' ? 'flex-col' : 'flex-row'
          )}
        >
          {content}
        </Button>
      )
    }

    return (
      <div className={cn(
        'flex items-center gap-1 text-muted-foreground',
        orientation === 'vertical' && 'flex-col'
      )}>
        {content}
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(
        'flex items-center gap-3 text-sm text-muted-foreground',
        orientation === 'vertical' && 'flex-col gap-2',
        className
      )}>
        <StatItem icon={Eye} count={viewCount} label="views" />
        <StatItem 
          icon={Heart} 
          count={likeCount} 
          label="likes"
          onClick={onLike}
          isActive={isLiked}
        />
        <StatItem icon={MessageCircle} count={commentCount} label="comments" />
        {readingTime && (
          <span className="text-xs text-muted-foreground">
            {readingTime} min read
          </span>
        )}
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={cn(
        'grid gap-4',
        orientation === 'horizontal' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1',
        className
      )}>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Eye className="w-5 h-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{formatCount(viewCount)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Views</p>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className={cn(
              'w-5 h-5',
              isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground'
            )} />
            <span className="text-2xl font-bold">{formatCount(likeCount)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Likes</p>
          {interactive && onLike && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onLike}
              className="mt-1 h-auto p-1 text-xs"
            >
              {isLiked ? 'Unlike' : 'Like'}
            </Button>
          )}
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <MessageCircle className="w-5 h-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{formatCount(commentCount)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Comments</p>
        </div>

        {shareCount !== undefined && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Share2 className="w-5 h-5 text-muted-foreground" />
              <span className="text-2xl font-bold">{formatCount(shareCount)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Shares</p>
            {interactive && onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="mt-1 h-auto p-1 text-xs"
              >
                Share
              </Button>
            )}
          </div>
        )}

        {bookmarkCount !== undefined && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Bookmark className={cn(
                'w-5 h-5',
                isBookmarked ? 'text-blue-500 fill-current' : 'text-muted-foreground'
              )} />
              <span className="text-2xl font-bold">{formatCount(bookmarkCount)}</span>
            </div>
            <p className="text-sm text-muted-foreground">Bookmarks</p>
            {interactive && onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                className="mt-1 h-auto p-1 text-xs"
              >
                {isBookmarked ? 'Remove' : 'Bookmark'}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn(
      'flex items-center gap-4',
      orientation === 'vertical' && 'flex-col gap-2',
      className
    )}>
      <StatItem icon={Eye} count={viewCount} label="views" />
      <StatItem 
        icon={Heart} 
        count={likeCount} 
        label="likes"
        onClick={onLike}
        isActive={isLiked}
      />
      <StatItem icon={MessageCircle} count={commentCount} label="comments" />
      
      {shareCount !== undefined && (
        <StatItem 
          icon={Share2} 
          count={shareCount} 
          label="shares"
          onClick={onShare}
        />
      )}
      
      {bookmarkCount !== undefined && (
        <StatItem 
          icon={Bookmark} 
          count={bookmarkCount} 
          label="bookmarks"
          onClick={onBookmark}
          isActive={isBookmarked}
          activeColor="text-blue-500"
        />
      )}
      
      {readingTime && (
        <div className="flex items-center gap-1 text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm">{readingTime} min read</span>
        </div>
      )}
    </div>
  )
}
