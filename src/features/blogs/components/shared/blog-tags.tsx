import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BlogSummaryResponseDtoTagsInner } from '@generated/api-client'

interface BlogTagsProps {
  tags?: BlogSummaryResponseDtoTagsInner[]
  categories?: BlogSummaryResponseDtoTagsInner[]
  maxTags?: number
  maxCategories?: number
  showCategories?: boolean
  showTags?: boolean
  className?: string
  tagClassName?: string
  categoryClassName?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'secondary' | 'outline'
  clickable?: boolean
}

export function BlogTags({
  tags = [],
  categories = [],
  maxTags = 3,
  maxCategories = 2,
  showCategories = true,
  showTags = true,
  className,
  tagClassName,
  categoryClassName,
  size = 'default',
  variant = 'default',
  clickable = true
}: BlogTagsProps) {
  const displayCategories = showCategories ? categories.slice(0, maxCategories) : []
  const displayTags = showTags ? tags.slice(0, maxTags) : []
  
  if (displayCategories.length === 0 && displayTags.length === 0) {
    return null
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm',
    lg: 'text-base px-3 py-1'
  }

  const categoryVariant = variant === 'default' ? 'secondary' : variant
  const tagVariant = variant === 'default' ? 'outline' : variant

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* Categories */}
      {displayCategories.map((category) => {
        const content = (
          <Badge
            key={category.id}
            variant={categoryVariant}
            className={cn(
              sizeClasses[size],
              categoryClassName,
              clickable && 'hover:bg-secondary/80 cursor-pointer transition-colors'
            )}
          >
            {category.name}
          </Badge>
        )

        return clickable ? (
          <Link
            key={category.id}
            href={`/blogs?category=${category.name}`}
            className="no-underline"
          >
            {content}
          </Link>
        ) : (
          content
        )
      })}

      {/* Tags */}
      {displayTags.map((tag) => {
        const content = (
          <Badge
            key={tag.id}
            variant={tagVariant}
            className={cn(
              sizeClasses[size],
              tagClassName,
              clickable && 'hover:bg-muted/80 cursor-pointer transition-colors'
            )}
          >
            {tag.name}
          </Badge>
        )

        return clickable ? (
          <Link
            key={tag.id}
            href={`/blogs?tag=${tag.name}`}
            className="no-underline"
          >
            {content}
          </Link>
        ) : (
          content
        )
      })}

      {/* Show more indicator */}
      {(categories.length > maxCategories || tags.length > maxTags) && (
        <Badge variant="outline" className={cn(sizeClasses[size], 'text-muted-foreground')}>
          +{(categories.length - maxCategories) + (tags.length - maxTags)} more
        </Badge>
      )}
    </div>
  )
}
