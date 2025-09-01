'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

interface RecommendedTopicsProps {
  tags: Tag[]
  isLoading?: boolean
}

export function RecommendedTopics({ tags, isLoading = false }: RecommendedTopicsProps) {
  if (isLoading) {
    return (
      <div className="bg-gray-900/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Trending Topics</h3>
        
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex items-center justify-between p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-700" />
                  <div className="h-4 bg-gray-700 rounded w-20" />
                </div>
                <div className="h-3 bg-gray-700 rounded w-12" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (tags.length === 0) {
    return null
  }

  return (
    <div className="bg-gray-900/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Trending Topics</h3>
      
      <div className="space-y-3">
        {tags.slice(0, 10).map((tag) => (
          <Link key={tag.id} href={`/blogs/tag/${tag.slug}`}>
            <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: tag.color || '#8b5cf6' 
                  }}
                />
                <span className="text-gray-300 group-hover:text-purple-400 transition-colors font-medium">
                  {tag.name}
                </span>
              </div>
              <span className="text-xs text-gray-500 group-hover:text-gray-400">
                {/* Mock post count - would come from API */}
                {Math.floor(Math.random() * 100) + 1} posts
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      <Link href="/blogs/topics">
        <Button variant="ghost" className="w-full mt-4 text-purple-400 hover:bg-purple-500/10">
          See all topics
        </Button>
      </Link>
    </div>
  )
}
