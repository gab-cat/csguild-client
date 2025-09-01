'use client'

import { motion } from 'framer-motion'
import { Star, Clock, Eye, Heart, MessageCircle, Share, Bookmark } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

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
  
  const handleBookmark = () => {
    if (onBookmark) {
      onBookmark(blog.id)
    }
  }

  const handleShare = () => {
    if (onShare) {
      onShare(blog.id)
    }
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group ${isFeatured ? 'py-6 border-b border-gray-800' : 'py-4 border-b border-gray-800'}`}
    >
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          {/* Author info */}
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={blog.author.imageUrl} />
              <AvatarFallback className="text-xs bg-purple-600 text-white">
                {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link 
                href={`/blogs/author/${blog.author.username}`}
                className="hover:text-purple-400 transition-colors"
              >
                {blog.author.firstName} {blog.author.lastName}
              </Link>
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
            <Link href={`/blogs/${blog.slug}`}>
              <h2 className={`font-bold text-white group-hover:text-purple-400 transition-colors leading-tight mb-1 ${
                isFeatured ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'
              }`}>
                {blog.title}
              </h2>
            </Link>
            {blog.subtitle && (
              <p className="text-gray-400 text-base mb-2 leading-relaxed">
                {blog.subtitle}
              </p>
            )}
            {blog.excerpt && (
              <p className="text-gray-500 leading-relaxed text-sm">
                {blog.excerpt}
              </p>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {blog.readingTime || 5} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {blog.viewCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                {blog.likeCount}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {blog.commentCount}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBookmark}
                className={`p-1 h-6 transition-colors ${
                  blog.isBookmarked 
                    ? 'text-purple-400 hover:text-purple-300' 
                    : 'text-gray-500 hover:text-purple-400'
                }`}
              >
                <Bookmark className={`w-3 h-3 ${blog.isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="text-gray-500 hover:text-purple-400 p-1 h-6"
              >
                <Share className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cover image */}
        {blog.coverImages.length > 0 && (
          <div className={`${isFeatured ? 'w-32 h-20' : 'w-24 h-16'} md:${isFeatured ? 'w-40 h-24' : 'w-32 h-20'} flex-shrink-0`}>
            <Link href={`/blogs/${blog.slug}`}>
              <Image
                src={blog.coverImages[0].imageUrl || '/events-placeholder.png'}
                alt={blog.title}
                width={isFeatured ? 160 : 128}
                height={isFeatured ? 96 : 80}
                className="w-full h-full object-cover rounded-md group-hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>
        )}
      </div>
    </motion.article>
  )
}
