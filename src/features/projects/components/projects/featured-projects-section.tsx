'use client'

import { useQuery } from 'convex/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronUp, ChevronDown } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCurrentUser } from '@/features/auth'
import { api } from '@/lib/convex'

import { isValidProjectCard, Project } from '../../types'

import { ProjectCard } from './project-card'

// Custom hook for featured projects visibility
function useFeaturedProjectsVisibility() {
  const [cardsVisible, setCardsVisible] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('featuredProjectsCardsVisible')
    if (saved !== null) {
      setCardsVisible(JSON.parse(saved))
    }
  }, [])

  const toggleCards = () => {
    const newValue = !cardsVisible
    setCardsVisible(newValue)
    localStorage.setItem('featuredProjectsCardsVisible', JSON.stringify(newValue))
  }

  return {
    cardsVisible,
    toggleCards
  }
}

export function FeaturedProjectsSection() {
  const { isAuthenticated } = useCurrentUser()
  const { cardsVisible, toggleCards } = useFeaturedProjectsVisibility()

  // Get featured projects
  const featuredProjectsData = useQuery(api.projects.getFeaturedProjects, isAuthenticated ? { limit: 10 } : "skip")
  const isLoadingFeatured = featuredProjectsData === undefined

  // Always call useQuery but conditionally use the result
  const savedProjectsData = useQuery(api.projects.getSavedProjects, isAuthenticated ? { limit: 1000 } : "skip")

  // Create a Set of saved project slugs for efficient lookup
  const savedProjectSlugs = useMemo(() => {
    if (!isAuthenticated || !savedProjectsData?.data) {
      return new Set<string>()
    }
    return new Set(savedProjectsData.data.map((project: Project) => project.slug))
  }, [isAuthenticated, savedProjectsData])

  // Don't render anything if there are no featured projects or if loading
  if (isLoadingFeatured || !featuredProjectsData?.data?.length) {
    return null
  }

  const featuredProjects = featuredProjectsData.data.filter((project: Project) => isValidProjectCard(project))

  if (featuredProjects.length === 0) {
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
              <Star className="w-5 h-5 text-yellow-400" />
              <h2 className="text-lg sm:text-xl font-semibold text-white">Featured Projects</h2>
              <div className="text-sm text-gray-400">
                ({featuredProjects.length} {featuredProjects.length === 1 ? 'project' : 'projects'})
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
                {featuredProjects.map((project: Project, index: number) => {
                  const isSaved = savedProjectSlugs.has(project.slug)

                  return (
                    <div
                      key={project.id}
                      className="flex-shrink-0 w-72 sm:w-80 md:w-96"
                    >
                      <ProjectCard
                        project={project}
                        index={index}
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
export function FeaturedProjectsSectionSkeleton() {
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
