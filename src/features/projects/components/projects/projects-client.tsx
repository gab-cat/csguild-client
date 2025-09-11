'use client'

import { useQuery } from 'convex/react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { api } from '@/lib/convex'

import { isValidProjectCard, Project } from '../../types'

import { FeaturedProjectsSection } from './featured-projects-section'
import { PinnedProjectsSection } from './pinned-projects-section'
import { ProjectCard } from './project-card'
import { ProjectFiltersComponent } from './project-filters'


// Define the filters type to match Convex query expectations
type ProjectFilters = {
  page: number
  limit: number
  sortBy: 'createdAt' | 'updatedAt' | 'dueDate' | 'title'
  sortOrder: 'asc' | 'desc'
  search?: string
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  tags?: string // Convex expects string, will be split by comma in query
  includeFeatured?: boolean
}

type RegularProjectFilters = ProjectFilters & {
  pinned: boolean
  includeFeatured: boolean
}

export function ProjectsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useCurrentUser()
  // Inline filter logic from useProjectFilters
  const filters = useMemo((): ProjectFilters => {
    const params = new URLSearchParams(searchParams)
    const filters: ProjectFilters = {
      // Set default values
      page: 1,
      limit: 12,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
    }

    // Override with URL params if they exist
    if (params.get('search')) filters.search = params.get('search')!
    if (params.get('status')) {
      const status = params.get('status') as 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
      if (['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
        filters.status = status
      }
    }
    if (params.get('sortBy')) {
      const sortBy = params.get('sortBy') as 'createdAt' | 'updatedAt' | 'dueDate' | 'title'
      if (['createdAt', 'updatedAt', 'dueDate', 'title'].includes(sortBy)) {
        filters.sortBy = sortBy
      }
    }
    if (params.get('sortOrder')) {
      const sortOrder = params.get('sortOrder') as 'asc' | 'desc'
      if (['asc', 'desc'].includes(sortOrder)) {
        filters.sortOrder = sortOrder
      }
    }
    if (params.get('tags')) {
      filters.tags = params.get('tags')! // Keep as string for Convex
    }
    if (params.get('page')) {
      const page = parseInt(params.get('page')!)
      if (!isNaN(page) && page > 0) {
        filters.page = page
      }
    }
    if (params.get('limit')) {
      const limit = parseInt(params.get('limit')!)
      if (!isNaN(limit) && limit > 0) {
        filters.limit = limit
      }
    }

    return filters
  }, [searchParams])

  // Get regular projects (excluding pinned and featured ones)
  const regularFilters = useMemo((): RegularProjectFilters => ({
    ...filters,
    pinned: false, // Explicitly exclude pinned projects
    includeFeatured: false, // Explicitly exclude featured projects
  }), [filters])

  // Use Convex queries directly

  // Always fetch projects
  const projectsQuery = useQuery(api.projects.getProjects, regularFilters)
  const savedProjectsQuery = useQuery(api.projects.getSavedProjects, isAuthenticated ? { limit: 1000 } : "skip")

  const projectsData = projectsQuery
  const savedProjectsData = savedProjectsQuery
  const isLoading = projectsQuery === undefined
  const error = null // Convex handles errors differently

  // Create a set of saved project slugs for quick lookup
  const savedProjectSlugs = useMemo(() => {
    return new Set(savedProjectsData?.data?.map((project: Project) => project.slug) || [])
  }, [savedProjectsData])


  const handleClearFilters = useCallback(() => {
    router.push(window.location.pathname) // Clear all search params
  }, [router])

  const projects = projectsData?.data || []
  const validProjects = projects.filter(isValidProjectCard)
  const totalProjects = projectsData?.meta?.total || 0

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Featured Projects Section */}
        <FeaturedProjectsSection />

        {/* Pinned Projects Section */}
        <PinnedProjectsSection />

        {/* Filters only (Create button removed for public pages) */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <ProjectFiltersComponent />
          </div>

        </div>

        {/* Results Summary */}
        {!isLoading && (
          <div className="text-gray-400 text-sm">
            {totalProjects > 0 ? (
              <>
                Showing {validProjects.length} of {totalProjects} projects
                {filters.page && filters.page > 1 && ` (page ${filters.page})`}
                {filters.search && ` for "${filters.search}"`}
                {filters.status && ` with status "${filters.status}"`}
                {filters.tags && ` tagged with "${filters.tags}"`}
              </>
            ) : (
              <>No projects found matching your criteria</>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-400">Loading projects...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="text-red-400 mb-4">
              Failed to load projects. Please try again.
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-gray-700 text-gray-300"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && validProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {validProjects.map((project: Project, index: number) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isSaved={savedProjectSlugs.has(project.slug)}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && validProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {filters.search || filters.status || filters.tags?.length
                ? 'No projects match your current filters.'
                : 'No projects available yet.'
              }
            </div>
            <div className="space-x-4">
              {(filters.search || filters.status || filters.tags) && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Pagination Control */}
        {!isLoading && !error && validProjects.length > 0 && (
          <div className="mt-8">
            <SimplePaginationControl 
              currentPage={filters.page || 1}
              currentLimit={filters.limit || 12}
              total={totalProjects}
              showLimitSelector={true}
              limitOptions={[6, 12, 24, 48]}
              className="justify-between"
            />
          </div>
        )}
      </div>
    </div>
  )
}
