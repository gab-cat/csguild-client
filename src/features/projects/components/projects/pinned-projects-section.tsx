'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pin, ChevronUp, ChevronDown } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/features/auth'

import { usePinnedProjects, usePinnedProjectsVisibility, useSavedProjects } from '../../hooks'
import { toProjectCard } from '../../types'

import { ProjectCard } from './project-card'

export function PinnedProjectsSection() {
  const { isAuthenticated } = useAuthStore()
  const { data: pinnedProjectsData, isLoading, error } = usePinnedProjects()
  
  // Only fetch saved projects if authenticated
  const { data: savedProjectsData } = useSavedProjects(
    { limit: 1000 },
    isAuthenticated // Only fetch if authenticated
  )
  
  const { cardsVisible, toggleCards } = usePinnedProjectsVisibility()

  // Create a Set of saved project slugs for efficient lookup
  const savedProjectSlugs = useMemo(() => {
    if (!isAuthenticated || !savedProjectsData?.data) {
      return new Set<string>()
    }
    return new Set(savedProjectsData.data.map(project => project.slug))
  }, [isAuthenticated, savedProjectsData])

  // Don't render anything if there are no pinned projects or if loading/error
  if (isLoading || error || !pinnedProjectsData?.data?.length) {
    return null
  }

  const pinnedProjects = pinnedProjectsData.data
    .map(toProjectCard)
    .filter((p): p is NonNullable<typeof p> => p !== null)

  if (pinnedProjects.length === 0) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Pin className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Featured Projects</h2>
              <div className="text-sm text-gray-400">
                ({pinnedProjects.length} {pinnedProjects.length === 1 ? 'project' : 'projects'})
              </div>
            </div>
            
            {/* Toggle Cards Button */}
            <Button
              variant="outline"
              size="default"
              onClick={toggleCards}
              className="text-gray-300 border-gray-600 hover:text-white hover:bg-gray-800/50 hover:border-gray-500 px-4 py-2"
            >
              {cardsVisible ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Hide Cards
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Show Cards
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Horizontal Scrolling Container */}
        <AnimatePresence>
          {cardsVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
                {pinnedProjects.map((project, index) => {
                  const isSaved = savedProjectSlugs.has(project.slug)
                  
                  return (
                    <div
                      key={project.id}
                      className="flex-shrink-0 w-72 sm:w-80 md:w-96"
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                        isPinned={true}
                        isSaved={isSaved}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Gradient Fade on Right */}
              <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-gray-950 to-transparent pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

// Loading state component
export function PinnedProjectsSectionSkeleton() {
  return (
    <div className="mb-8">
      {/* Section Header Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
        <div className="w-32 h-6 bg-gray-700 rounded animate-pulse" />
        <div className="w-20 h-5 bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Horizontal Scrolling Container Skeleton */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-80">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-20 h-6 bg-gray-700 rounded animate-pulse" />
                    <div className="w-24 h-5 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-7 bg-gray-700 rounded animate-pulse" />
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-700 rounded-full animate-pulse" />
                    <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-16 bg-gray-700 rounded animate-pulse" />
                  <div className="flex gap-2">
                    <div className="w-16 h-6 bg-gray-700 rounded animate-pulse" />
                    <div className="w-20 h-6 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-9 bg-gray-700 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
