'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

import type { BlogCardType } from '../../types'

import { RecommendedTopics } from './recommended-topics'
import { StaffPicks } from './staff-picks'

interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

interface BlogSidebarProps {
  staffPicks: BlogCardType[]
  tags: Tag[]
  isLoadingStaffPicks?: boolean
  isLoadingTags?: boolean
}

export function BlogSidebar({ 
  staffPicks, 
  tags, 
  isLoadingStaffPicks = false,
  isLoadingTags = false 
}: BlogSidebarProps) {
  return (
    <div className="space-y-8">
      {/* Staff Picks */}
      <StaffPicks 
        blogs={staffPicks} 
        isLoading={isLoadingStaffPicks}
      />
      
      {/* Recommended Topics */}
      <RecommendedTopics 
        tags={tags} 
        isLoading={isLoadingTags}
      />
      
      {/* Who to follow - placeholder for future implementation */}
      <div className="bg-gray-900/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Who to follow</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-purple-600 text-white">AB</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-white text-sm">Author Name</div>
                <div className="text-xs text-gray-500">12k Followers</div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-gray-700 text-gray-400 hover:border-purple-500 hover:text-purple-400">
              Follow
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
