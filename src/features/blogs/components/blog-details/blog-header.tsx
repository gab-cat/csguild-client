'use client'

import { formatDistanceToNow } from 'date-fns'
import { 
  Calendar, 
  Clock, 
  Eye, 
  Tag 
} from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import type { BlogDetailResponseDto } from '../../types'

interface BlogHeaderProps {
  blog: BlogDetailResponseDto
}

export function BlogHeader({ blog }: BlogHeaderProps) {
  const publishedDate = blog.publishedAt ? new Date(blog.publishedAt) : new Date(blog.createdAt)
  const readingTime = blog.readingTime || Math.ceil((blog.content?.length || 0) / 1000)

  return (
    <div className="space-y-6">
      {/* Categories and tags */}
      {(blog.categories?.length > 0 || blog.tags?.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {blog.categories?.map((category) => (
            <Link key={category.id} href={`/blogs/category/${category.slug}`}>
              <Badge className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">
                {category.name}
              </Badge>
            </Link>
          ))}
          {blog.tags?.map((tag) => (
            <Link key={tag.id} href={`/blogs/tag/${tag.slug}`}>
              <Badge variant="outline" className="border-gray-600 text-gray-300 hover:border-purple-500/50">
                <Tag className="w-3 h-3 mr-1" />
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
        {blog.title}
      </h1>

      {/* Subtitle */}
      {blog.subtitle && (
        <p className="text-xl text-gray-300 leading-relaxed">
          {blog.subtitle}
        </p>
      )}

      {/* Author and meta info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-purple-500/20">
            <AvatarImage src={blog.author.imageUrl || undefined} />
            <AvatarFallback className="bg-purple-500/20 text-purple-200">
              {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link 
              href={`/blogs/author/${blog.author.username}`}
              className="font-medium text-white hover:text-purple-400 transition-colors"
            >
              {blog.author.firstName} {blog.author.lastName}
            </Link>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDistanceToNow(publishedDate, { addSuffix: true })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readingTime} min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {blog.viewCount.toLocaleString()} views
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Featured badge */}
          {blog.isFeatured && (
            <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              Featured
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
