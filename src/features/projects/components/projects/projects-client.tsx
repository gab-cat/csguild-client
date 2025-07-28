'use client'

import { motion } from 'framer-motion'
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useCallback, useMemo } from 'react'

import { AuthGuard } from '@/components/shared/auth-guard'
import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useAuthStore } from '@/features/auth'

import { useProjects, useProjectFilters, useSavedProjects } from '../../hooks'
import { toProjectCard } from '../../types'
import { CreateProjectModal } from '../create-project-modal'

import { PinnedProjectsSection } from './pinned-projects-section'
import { ProjectCard } from './project-card'
import { ProjectFiltersComponent } from './project-filters'


export function ProjectsClient() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const filters = useProjectFilters()
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)

  // Get regular projects (excluding pinned ones)
  const regularFilters = useMemo(() => ({
    ...filters,
    pinned: false, // Explicitly exclude pinned projects
  }), [filters])

  const { data: projectsData, isLoading, error } = useProjects(regularFilters)
  const { data: savedProjectsData } = useSavedProjects()

  // Create a set of saved project slugs for quick lookup
  const savedProjectSlugs = useMemo(() => {
    return new Set(savedProjectsData?.data?.map(project => project.slug) || [])
  }, [savedProjectsData])

  const handleCreateButtonClick = useCallback(() => {
    setIsProjectModalOpen(true)
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsProjectModalOpen(false)
  }, [])

  const handleClearFilters = useCallback(() => {
    router.push(window.location.pathname) // Clear all search params
  }, [router])

  const projects = projectsData?.data || []
  const validProjects = projects.map(toProjectCard).filter((p): p is NonNullable<typeof p> => p !== null)
  const totalProjects = projectsData?.pagination?.total || 0

  return (
    <div className="relative min-h-screen">
      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Pinned Projects Section */}
        <PinnedProjectsSection />

        {/* Filters and Create Button */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:w-auto">
            <ProjectFiltersComponent />
          </div>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
            onClick={handleCreateButtonClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Project
          </Button>

          {/* Project Modal with Auth Guard */}
          <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
            <DialogContent className={`${!isAuthenticated ? 'max-w-2xl bg-transparent border-none shadow-none' : 'max-w-7xl min-w-7xl max-h-[90vh] overflow-y-auto bg-gray-950 border border-gray-800'}`}>
              <AuthGuard 
                title="Authentication Required" 
                description="Please sign in or create an account to post a new project."
              >
                <CreateProjectModal onClose={handleCloseModal} />
              </AuthGuard>
            </DialogContent>
          </Dialog>
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
                {filters.tags?.length && ` tagged with "${filters.tags.join(', ')}"`}
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
            {validProjects.map((project, index) => (
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
              {(filters.search || filters.status || filters.tags?.length) && (
                <Button 
                  onClick={handleClearFilters}
                  variant="outline"
                  className="border-gray-700 text-gray-300"
                >
                  Clear Filters
                </Button>
              )}
              <Button 
                onClick={handleCreateButtonClick}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Project
              </Button>
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
