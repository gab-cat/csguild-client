'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Eye, Heart, MessageCircle, Share, Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
import { showSuccessToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import type { BlogCardType } from '../../types'

interface BlogItemProps {
  blog: BlogCardType
  index: number
  isFeatured?: boolean
  onBookmark?: (blogId: string) => void
  onShare?: (blogId: string) => void
}

export function BlogItem({
  blog,
  index,
  isFeatured = false,
  onBookmark,
  onShare
}: BlogItemProps) {
  // Use server-provided state directly - component will re-render when queries are invalidated
  const isLiked = blog.isLiked || false
  const isBookmarked = blog.isBookmarked || false
  const likeCount = blog.likeCount || 0

  // Mutations - these will trigger query invalidation and cause the component to re-render with updated server state
  const likeBlogMutation = useMutation(api.blogs.likeBlog)
  const bookmarkBlogMutation = useMutation(api.blogs.bookmarkBlog)

  const handleLike = async () => {
    try {
      await likeBlogMutation({ slug: blog.slug })
      showSuccessToast(
        !isLiked ? 'Added to likes' : 'Removed from likes',
        !isLiked ? 'Blog added to your likes' : 'Blog removed from your likes'
      )
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      await bookmarkBlogMutation({ slug: blog.slug })
      onBookmark?.(blog.id)
      showSuccessToast(
        !isBookmarked ? 'Added to bookmarks' : 'Removed from bookmarks',
        !isBookmarked ? 'Blog added to your bookmarks' : 'Blog removed from your bookmarks'
      )
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(blog.id)
    } else {
      // Default share behavior
      const url = `${window.location.origin}/blogs/${blog.slug}`
      const title = blog.title

      if (navigator.share) {
        navigator.share({ title, text: blog.excerpt || blog.title, url })
      } else {
        navigator.clipboard.writeText(url)
      }
    }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group hover:shadow-xl transition-all duration-200 cursor-pointer hover:bg-gray-900/80 px-4 rounded-t-lg ${isFeatured ? 'py-6 border-b border-gray-800' : 'py-4 border-b border-gray-800'}`}
    >
      <Link href={`/blogs/${blog.slug}`} className="block">
        <div className="flex gap-4 items-start">
          <div className="flex-1">
            {/* Author info */}
            <div className="flex items-center gap-2 mb-4">
              <Avatar className="w-5 h-5">
                <AvatarImage src={blog.author.imageUrl} />
                <AvatarFallback className="text-xs bg-purple-600 text-white">
                  {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="hover:text-purple-400 transition-colors cursor-pointer">
                  {blog.author.firstName} {blog.author.lastName}
                </span>
                <span>•</span>
                <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}</span>
                {blog.isPinned && (
                  <>
                    <span>•</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  </>
                )}
                {blog.isFeatured && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">Featured</Badge>
                  </>
                )}
              </div>
            </div>

            {/* Title and content */}
            <div className="mb-3">
              <h2 className={`font-bold text-white group-hover:text-purple-400 transition-colors leading-tight mb-2 ${
                isFeatured ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
              }`}>
                {blog.title}
              </h2>
              {blog.excerpt && (
                <p className="text-gray-500 leading-relaxed text-sm line-clamp-2 min-h-[2.8rem] overflow-hidden">
                  {blog.excerpt}
                </p>
              )}
            </div>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <Clock className="w-3 h-3" />
                {blog.readingTime || 5} min
              </span>
              <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <Eye className="w-3 h-3" />
                {blog.viewCount.toLocaleString()} views
              </span>
              <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <Heart className={cn("w-3 h-3", isLiked && "text-pink-400 fill-current")} />
                {likeCount} likes
              </span>
              <span className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
                <MessageCircle className="w-3 h-3" />
                {blog.commentCount} comments
              </span>
            </div>
          </div>

          {/* Cover image */}
          {blog.coverImages.length > 0 && (
            <div className={`${isFeatured ? 'w-32 h-20' : 'w-24 h-16'} md:${isFeatured ? 'w-40 h-24' : 'w-32 h-20'} flex-shrink-0`}>
              <Image
                src={blog.coverImages[0].imageUrl || '/events-placeholder.png'}
                alt={blog.title}
                width={isFeatured ? 160 : 128}
                height={isFeatured ? 96 : 80}
                className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
              />
            </div>
          )}
        </div>
      </Link>

      {/* Action buttons - outside the Link so they don't trigger navigation */}
      <div className="flex self-start w-min items-center justify-end gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLike}
          className={cn(
            'border-gray-600 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200',
            isLiked && 'text-pink-400 hover:text-pink-300 border-pink-500/50'
          )}
        >
          <Heart className={cn('w-3 h-3 mr-1', isLiked && 'fill-current')} />
          {likeCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleBookmark}
          className={cn(
            'border-gray-600 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all duration-200',
            isBookmarked && 'text-purple-400 hover:text-purple-300 border-purple-500/50'
          )}
        >
          <Bookmark className={cn('w-3 h-3 mr-1', isBookmarked && 'fill-current')} />
          {isBookmarked ? 'Saved' : 'Save'}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="border-gray-600 text-gray-400 hover:text-purple-400 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-200"
        >
          <Share className="w-3 h-3 mr-1" />
          Share
        </Button>
      </div>
    </motion.article>
  )
}
