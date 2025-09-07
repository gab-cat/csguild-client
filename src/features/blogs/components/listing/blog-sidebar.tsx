'use client'


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
    </div>
  )
}
