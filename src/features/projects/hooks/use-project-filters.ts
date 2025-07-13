'use client'

import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

import type { ProjectFilters, ProjectStatus } from '../types'

export function useProjectFilters(): ProjectFilters {
  const searchParams = useSearchParams()
  
  return useMemo(() => {
    console.log('useProjectFilters - computing filters from searchParams:', Object.fromEntries(searchParams))
    const params = new URLSearchParams(searchParams)
    const filters: ProjectFilters = {
      // Set default values
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }
    
    // Override with URL params if they exist
    if (params.get('search')) filters.search = params.get('search') as string
    if (params.get('status')) filters.status = params.get('status') as ProjectStatus
    if (params.get('sortBy')) filters.sortBy = params.get('sortBy') as 'createdAt' | 'updatedAt' | 'dueDate' | 'title'
    if (params.get('sortOrder')) filters.sortOrder = params.get('sortOrder') as 'asc' | 'desc'
    if (params.get('tags')) filters.tags = params.get('tags')?.split(',').filter(Boolean)
    if (params.get('page')) filters.page = parseInt(params.get('page') as string) || 1
    if (params.get('limit')) filters.limit = parseInt(params.get('limit') as string) || 12
    
    console.log('useProjectFilters - computed filters:', filters)
    return filters
  }, [searchParams])
}
