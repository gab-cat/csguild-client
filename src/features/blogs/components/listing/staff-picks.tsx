'use client'

import { Star } from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import type { BlogCardType } from '../../types'

interface StaffPicksProps {
  blogs: BlogCardType[]
  isLoading?: boolean
}

export function StaffPicks({ blogs, isLoading = false }: StaffPicksProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6 sticky top-8">
        <div className="flex items-center gap-2 mb-6">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Staff Picks</h3>
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-5 h-5 bg-gray-700 rounded-full" />
                <div className="h-3 bg-gray-700 rounded w-24" />
              </div>
              <div className="h-4 bg-gray-700 rounded w-full mb-2" />
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="flex items-center gap-3">
                <div className="h-2 bg-gray-700 rounded w-16" />
                <div className="h-2 bg-gray-700 rounded w-12" />
              </div>
              {index < 2 && <Separator className="mt-6 bg-gray-800" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (blogs.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6 sticky top-8">
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-white">Staff Picks</h3>
      </div>
      
      <div className="space-y-6">
        {blogs.slice(0, 3).map((blog, index) => (
          <div key={blog.id} className="group">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="w-5 h-5">
                <AvatarImage src={blog.author.imageUrl} />
                <AvatarFallback className="text-xs bg-purple-600 text-white">
                  {blog.author.firstName?.[0]}{blog.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-400">
                {blog.author.firstName} {blog.author.lastName}
              </span>
            </div>
            
            <Link href={`/blogs/${blog.slug}`}>
              <h4 className="font-medium text-white group-hover:text-purple-400 transition-colors leading-tight mb-2">
                {blog.title}
              </h4>
            </Link>
            
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}</span>
              <span>•</span>
              <span>{blog.readingTime || 5} min read</span>
            </div>
            
            {index < Math.min(blogs.length - 1, 2) && <Separator className="mt-6 bg-gray-800" />}
          </div>
        ))}
      </div>
      
      <Link href="/blogs?tab=featured">
        <Button variant="outline" className="w-full mt-6 border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400">
          See the full list
        </Button>
      </Link>
    </div>
  )
}
