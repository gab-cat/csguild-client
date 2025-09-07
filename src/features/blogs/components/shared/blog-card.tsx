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
import { useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
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

  console.log('blog', blog)
  
  // Sync with props when they change (in case of real-time updates)
  useEffect(() => {
    setIsLiked(blog.isLiked || false)
    setIsBookmarked(blog.isBookmarked || false)
    setLikeCount(blog.likeCount)
  }, [blog.isLiked, blog.isBookmarked, blog.likeCount])
  
  const likeBlogMutation = useMutation(api.blogs.likeBlog)
  const bookmarkBlogMutation = useMutation(api.blogs.bookmarkBlog)
  
  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const originalLikedState = isLiked
    const originalLikeCount = likeCount

    try {
      const result = await likeBlogMutation({ slug: blog.slug })

      // Update state based on the mutation result
      setIsLiked(result.liked)
      setLikeCount(result.likeCount)
    } catch (error) {
      // Revert on error
      setIsLiked(originalLikedState)
      setLikeCount(originalLikeCount)
      console.error('Failed to toggle like:', error)
    }
  }

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const originalBookmarkedState = isBookmarked

    try {
      const result = await bookmarkBlogMutation({ slug: blog.slug })

      // Update state based on the mutation result
      setIsBookmarked(result.bookmarked)
    } catch (error) {
      // Revert on error
      setIsBookmarked(originalBookmarkedState)
      console.error('Failed to toggle bookmark:', error)
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
          'group hover:shadow-lg transition-all duration-300 cursor-pointer',
          'bg-gray-900/50 border-gray-800 hover:border-purple-500/30 hover:bg-gray-900/70',
          'backdrop-blur-sm',
          className
        )}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              {coverImage && coverImage.imageUrl && coverImage.imageUrl.trim() ? (
                <div className="flex-shrink-0">
                  <Image
                    src={coverImage.imageUrl}
                    alt={coverImage.altText || blog.title}
                    width={120}
                    height={80}
                    className="rounded-md object-cover"
                  />
                </div>
              ) : null}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={blog.author.imageUrl || undefined} />
                    <AvatarFallback className="text-xs bg-purple-500/20 text-purple-200">
                      {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">
                    {blog.author.firstName} {blog.author.lastName}
                  </span>
                  {publishedDate && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="text-sm text-gray-400">{publishedDate}</span>
                    </>
                  )}
                </div>
                
                <h3 className="font-semibold line-clamp-2 text-white group-hover:text-purple-300 transition-colors">
                  {blog.title}
                </h3>
                
                {blog.excerpt && (
                  <p className="text-sm text-gray-400 line-clamp-2 mt-2">
                    {blog.excerpt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
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
          'group hover:shadow-2xl transition-all duration-300 cursor-pointer',
          'bg-gray-900/50 border-gray-800 hover:border-purple-500/50',
          'backdrop-blur-sm relative overflow-hidden',
          className
        )}>
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {coverImage && coverImage.imageUrl && coverImage.imageUrl.trim() ? (
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              <Image
                src={coverImage.imageUrl}
                alt={coverImage.altText || blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {blog.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                  Featured
                </Badge>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ) : null}
          
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10 border-2 border-purple-500/20">
                <AvatarImage src={blog.author.imageUrl || undefined} />
                <AvatarFallback className="bg-purple-500/20 text-purple-200">
                  {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm text-white">
                  {blog.author.firstName} {blog.author.lastName}
                </p>
                {publishedDate && (
                  <p className="text-xs text-gray-400">{publishedDate}</p>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              {blog.title}
            </h2>
            
            {blog.subtitle && (
              <p className="text-lg text-gray-300 mb-3">
                {blog.subtitle}
              </p>
            )}
            
            {blog.excerpt && (
              <p className="text-gray-400 line-clamp-3 mb-4">
                {blog.excerpt}
              </p>
            )}
            
            {(blog.tags?.length > 0 || blog.categories?.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories?.slice(0, 2).map((category) => (
                  <Badge key={category.id} className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">
                    {category.name}
                  </Badge>
                ))}
                {blog.tags?.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="border-gray-600 text-gray-300 hover:border-purple-500/50">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{blog.viewCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{blog.commentCount}</span>
              </div>
              {blog.readingTime && (
                <span>{blog.readingTime} min read</span>
              )}
            </div>
          </CardContent>
          
          {showActions && (
            <CardFooter className="px-6 py-4 border-t border-gray-800 bg-gray-900/30 relative">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={cn(
                      'gap-2 hover:bg-purple-500/20',
                      isLiked && 'text-pink-400 hover:text-pink-300'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', isLiked && 'fill-current')} />
                    <span>{likeCount}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="gap-2 hover:bg-purple-500/20 text-gray-300">
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
                      'hover:bg-purple-500/20',
                      isBookmarked && 'text-purple-400 hover:text-purple-300'
                    )}
                  >
                    <Bookmark className={cn('w-4 h-4', isBookmarked && 'fill-current')} />
                  </Button>
                  
                  <Button variant="ghost" size="sm" onClick={handleShare} className="hover:bg-purple-500/20 text-gray-300">
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
        'group hover:shadow-xl transition-all duration-300 cursor-pointer py-0',
        'bg-gray-900/50 border-gray-800 hover:border-purple-500/30 hover:bg-gray-900/70',
        'backdrop-blur-sm relative overflow-hidden',
        className
      )}>
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-4 relative">
          <div className="flex gap-4">
            {/* Content on the left */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <Avatar className="w-6 h-6 border border-purple-500/20">
                  <AvatarImage src={blog.author.imageUrl || undefined} />
                  <AvatarFallback className="text-xs bg-purple-500/20 text-purple-200">
                    {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-300">
                  {blog.author.firstName} {blog.author.lastName}
                </span>
                {publishedDate && (
                  <>
                    <span className="text-gray-600">·</span>
                    <span className="text-sm text-gray-400">{publishedDate}</span>
                  </>
                )}
              </div>

              <h3 className="font-semibold mb-2 line-clamp-2 text-white group-hover:text-purple-300 transition-colors">
                {blog.title}
              </h3>

              {blog.excerpt && (
                <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                  {blog.excerpt}
                </p>
              )}

              {(blog.tags?.length > 0 || blog.categories?.length > 0) && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {blog.categories?.slice(0, 1).map((category) => (
                    <Badge key={category.id} className="text-xs bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">
                      {category.name}
                    </Badge>
                  ))}
                  {blog.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-xs border-gray-600 text-gray-300 hover:border-purple-500/50">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
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
            </div>

            {/* Image on the right */}
            {coverImage && coverImage.imageUrl && coverImage.imageUrl.trim() ? (
              <div className="flex-shrink-0 relative">
                <div className="relative w-32 h-24 overflow-hidden rounded-lg">
                  <Image
                    src={coverImage.imageUrl}
                    alt={coverImage.altText || blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {blog.isFeatured && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
        
        {showActions && (
          <CardFooter className="px-4 py-3 border-t border-gray-800 bg-gray-900/30 relative">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(
                    'gap-1 h-8 px-2 hover:bg-purple-500/20',
                    isLiked && 'text-pink-400 hover:text-pink-300'
                  )}
                >
                  <Heart className={cn('w-3 h-3', isLiked && 'fill-current')} />
                  <span className="text-xs">{likeCount}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 hover:bg-purple-500/20 text-gray-300">
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
                    'h-8 px-2 hover:bg-purple-500/20',
                    isBookmarked && 'text-purple-400 hover:text-purple-300'
                  )}
                >
                  <Bookmark className={cn('w-3 h-3', isBookmarked && 'fill-current')} />
                </Button>
                
                <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-2 hover:bg-purple-500/20 text-gray-300">
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
