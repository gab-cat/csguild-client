'use client'

import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, Bookmark, Share2, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { BlogSummaryResponseDto } from '@generated/api-client'

interface BlogCardProps {
  blog: BlogSummaryResponseDto
  variant?: 'default' | 'compact' | 'featured'
  showActions?: boolean
  className?: string
}

export function BlogCard({ 
  blog, 
  variant = 'default', 
  showActions = true,
  className 
}: BlogCardProps) {
  // Use the actual values from the API response
  const [isLiked, setIsLiked] = useState(blog.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked || false)
  const [likeCount, setLikeCount] = useState(blog.likeCount)
  
  // Sync with props when they change (in case of real-time updates)
  useEffect(() => {
    setIsLiked(blog.isLiked || false)
    setIsBookmarked(blog.isBookmarked || false)
    setLikeCount(blog.likeCount)
  }, [blog.isLiked, blog.isBookmarked, blog.likeCount])
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic update
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    
    // TODO: Implement actual API call
    try {
      // await blogsActionsApiUtils.likeBlog(blog.slug)
    } catch (error) {
      // Revert on error
      setIsLiked(blog.isLiked || false)
      setLikeCount(blog.likeCount)
      console.error('Failed to like blog:', error)
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic update
    setIsBookmarked(!isBookmarked)
    
    // TODO: Implement actual API call
    try {
      // await blogsActionsApiUtils.bookmarkBlog(blog.slug)
    } catch (error) {
      // Revert on error
      setIsBookmarked(blog.isBookmarked || false)
      console.error('Failed to bookmark blog:', error)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: `/blogs/${blog.slug}`
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.slug}`)
    }
  }

  const coverImage = blog.coverImages?.[0]
  const publishedDate = blog.publishedAt ? 
    formatDistanceToNow(new Date(blog.publishedAt), { addSuffix: true }) : 
    null

  if (variant === 'compact') {
    return (
      <Link href={`/blogs/${blog.slug}`}>
        <Card className={cn(
          'group hover:shadow-lg transition-all duration-200 cursor-pointer',
          'border-border/50 hover:border-border',
          className
        )}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              {coverImage && (
                <div className="flex-shrink-0">
                  <Image
                    src={coverImage.imageUrl || ''}
                    alt={coverImage.altText || blog.title}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={blog.author.imageUrl || undefined} />
                    <AvatarFallback className="text-xs">
                      {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {blog.author.firstName} {blog.author.lastName}
                  </span>
                  {publishedDate && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{publishedDate}</span>
                    </>
                  )}
                </div>
                
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                
                {blog.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                    {blog.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{blog.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{blog.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={`/blogs/${blog.slug}`}>
        <Card className={cn(
          'group hover:shadow-lg transition-all duration-200 cursor-pointer',
          'border-border/50 hover:border-border bg-gradient-to-br from-background to-secondary/20',
          className
        )}>
          {coverImage && (
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={coverImage.imageUrl || ''}
                alt={coverImage.altText || blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {blog.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
          )}
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src={blog.author.imageUrl || undefined} />
                <AvatarFallback>
                  {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">
                  {blog.author.firstName} {blog.author.lastName}
                </p>
                {publishedDate && (
                  <p className="text-xs text-muted-foreground">{publishedDate}</p>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
              {blog.title}
            </h2>
            
            {blog.subtitle && (
              <p className="text-lg text-muted-foreground mb-3">
                {blog.subtitle}
              </p>
            )}
            
            {blog.excerpt && (
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {blog.excerpt}
              </p>
            )}
            
            {(blog.tags?.length > 0 || blog.categories?.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories?.slice(0, 2).map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
                {blog.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.viewCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.commentCount}</span>
              </div>
              {blog.readingTime && (
                <span>{blog.readingTime} min read</span>
              )}
            </div>
          </CardContent>
          
          {showActions && (
            <CardFooter className="px-6 py-4 border-t border-border/50">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
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
                    <span>{likeCount}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>{blog.commentCount}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBookmark}
                    className={cn(
                      'gap-2',
                      isBookmarked && 'text-blue-500 hover:text-blue-600'
                    )}
                  >
                    <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={`/blogs/${blog.slug}`}>
      <Card className={cn(
        'group hover:shadow-lg transition-all duration-200 cursor-pointer',
        'border-border/50 hover:border-border',
        className
      )}>
        {coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={coverImage.imageUrl || ''}
              alt={coverImage.altText || blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {blog.isFeatured && (
              <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                Featured
              </Badge>
            )}
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="w-6 h-6">
              <AvatarImage src={blog.author.imageUrl || undefined} />
              <AvatarFallback className="text-xs">
                {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {blog.author.firstName} {blog.author.lastName}
            </span>
            {publishedDate && (
              <>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">{publishedDate}</span>
              </>
            )}
          </div>
          
          <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          
          {blog.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
              {blog.excerpt}
            </p>
          )}
          
          {(blog.tags?.length > 0 || blog.categories?.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.categories?.slice(0, 1).map((category) => (
                <Badge key={category.id} variant="secondary" className="text-xs">
                  {category.name}
                </Badge>
              ))}
              {blog.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="outline" className="text-xs">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{blog.viewCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              <span>{blog.commentCount}</span>
            </div>
            {blog.readingTime && (
              <span>{blog.readingTime} min read</span>
            )}
          </div>
        </CardContent>
        
        {showActions && (
          <CardFooter className="px-4 py-3 border-t border-border/50">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    'gap-1 h-8 px-2',
                    isLiked && 'text-red-500 hover:text-red-600'
                  )}
                >
                  <Heart className={cn('w-3 h-3', isLiked && 'fill-current')} />
                  <span className="text-xs">{likeCount}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-1 h-8 px-2">
                  <MessageCircle className="w-3 h-3" />
                  <span className="text-xs">{blog.commentCount}</span>
                </Button>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={cn(
                    'h-8 px-2',
                    isBookmarked && 'text-blue-500 hover:text-blue-600'
                  )}
                >
                  <Bookmark className={cn('w-3 h-3', isBookmarked && 'fill-current')} />
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2">
                  <Share2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
