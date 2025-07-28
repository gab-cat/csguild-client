'use client'

import { DialogTitle } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'

import { useProject, useProjectMembers, useProjectApplications } from '../../hooks/use-projects-queries'
import { toProjectCardFromDetail } from '../../types'

import { ProjectDetailClient } from './project-detail-client'

interface ProjectDetailPageClientProps {
  slug: string
}

export function ProjectDetailPageClient({ slug }: ProjectDetailPageClientProps) {
  const router = useRouter()
  const { data: projectData, isLoading: isLoadingProject, error: projectError } = useProject(slug)
  const { data: membersData, isLoading: isLoadingMembers } = useProjectMembers(slug)
  const { data: applicationsData, isLoading: isLoadingApplications } = useProjectApplications(slug)

  const handleClose = useCallback(() => {
    router.push('/projects')
  }, [router])

  // Auto-focus management for accessibility
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleClose])

  const isLoading = isLoadingProject || isLoadingMembers || isLoadingApplications

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-400">Loading project details...</span>
        </div>
      </div>
    )
  }

  if (projectError || !projectData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 mb-4 text-xl font-semibold">
            Project Not Found
          </div>
          <div className="text-gray-400 mb-6">
            The project you&apos;re looking for doesn&apos;t exist or may have been removed.
          </div>
          <Button 
            onClick={handleClose}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  // Calculate member and application counts
  const memberCount = membersData?.length || 0
  const applicationCount = applicationsData?.length || 0

  const project = toProjectCardFromDetail(projectData, memberCount, applicationCount)
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <div className="text-red-400 mb-4 text-xl font-semibold">
            Invalid Project Data
          </div>
          <div className="text-gray-400 mb-6">
            The project data could not be processed properly.
          </div>
          <Button 
            onClick={handleClose}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Back button for mobile/fallback */}
      <div className="mb-4 lg:hidden">
        <Button
          onClick={handleClose}
          variant="outline"
          className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Button>
      </div>

      {/* Modal that opens immediately */}
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="!max-w-[95vw] bg-gray-950 !w-[95vw] !h-[95vh] overflow-hidden p-0 sm:!max-w-[90vw] sm:!w-[90vw] sm:!h-[90vh]">
          <DialogTitle className='sr-only'>{project.title}</DialogTitle>
          <div className="h-full overflow-y-auto p-4 sm:p-6">
            <ProjectDetailClient 
              project={project} 
              onClose={handleClose} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
