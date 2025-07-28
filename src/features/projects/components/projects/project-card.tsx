'use client'

import { DialogTitle } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Calendar, Users, Eye, Tag, Share, Check, Bookmark, BookmarkCheck, Star } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { useAuthStore } from '@/features/auth'
import { useClipboard } from '@/hooks/use-clipboard'
import { showSuccessToast } from '@/lib/toast'

import { useSaveProject, useUnsaveProject } from '../../hooks'
import type { ProjectCardType } from '../../types'
import { RoleMemberDisplay } from '../role-member-display'

import { ProjectDetailClient } from './project-detail-client'

interface ProjectCardProps {
  project: ProjectCardType
  index?: number
  isSaved?: boolean
  isPinned?: boolean
}

export function ProjectCard({ project, index = 0, isSaved = false, isPinned = false }: ProjectCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { copied, copy } = useClipboard({
    onSuccess: () => {
      showSuccessToast(
        'Link Copied!', 
        'Project link has been copied to your clipboard'
      )
    }
  })

  const saveProjectMutation = useSaveProject()
  const unsaveProjectMutation = useUnsaveProject()

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      showSuccessToast('Sign In Required', 'Please sign in to save projects')
      return
    }

    try {
      if (isSaved) {
        await unsaveProjectMutation.mutateAsync(project.slug)
      } else {
        await saveProjectMutation.mutateAsync(project.slug)
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
      console.error('Error toggling save status:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'OPEN':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'COMPLETED':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const isOverdue = project.dueDate
    ? new Date(project.dueDate) < new Date()
    : false

  // Get looking for roles text
  const lookingForRoles = project.roles
    ?.filter(role => role.maxMembers > 0)
    ?.map(role => role.role?.name)
    ?.slice(0, 3)
    ?.join(', ') || 'contributors'

  const handleShare = async () => {
    const projectUrl = `${window.location.origin}/projects/${project.slug}`
    const shareText = `${project.title} is looking for ${lookingForRoles}! Check out this exciting project on CS Guild: ${projectUrl}`
    
    try {
      if (navigator.share && /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // Use native share on mobile devices
        await navigator.share({
          title: project.title,
          text: `${project.title} is looking for ${lookingForRoles}!`,
          url: projectUrl,
        })
      } else {
        // Fallback to clipboard copy
        await copy(shareText)
      }
    } catch {
      // If native share fails, fallback to clipboard
      await copy(shareText)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <Card className="bg-gray-900/50 pt-0 rounded-lg gap-4 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full flex flex-col overflow-hidden">
        {/* Pinned Indicator */}
        {isPinned && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-yellow-500/10 backdrop-blur-md text-yellow-500 text-xs font-medium py-1.5 rounded-b-lg flex items-center gap-1.5 border border-yellow-500/35 border-t-yellow-500/10 shadow-yellow-500/25 min-w-fix px-8 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-yellow-500" />
              <span className="tracking-wide text-xs font-medium">Featured</span>
            </div>
          </div>
        )}
        <CardHeader className={`space-y-3 pb-4 sm:px-6 sm:space-y-4 ${isPinned ? 'pt-10' : 'pt-6'}`}>
          {/* Status and Due Date */}
          <div className="flex items-center justify-between gap-2">
            <Badge className={`text-xs font-medium ${getStatusColor(project.status)} flex-shrink-0`}>
              {project.status.replace('_', ' ')}
            </Badge>
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-400' : 'text-gray-400'
            } flex-shrink-0`}>
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{formatDate(project.dueDate)}</span>
              <span className="sm:hidden">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
              <AvatarImage src={project.owner.imageUrl} alt={project.owner.username} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                {project.owner.firstName[0]}{project.owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs sm:text-sm text-gray-400 truncate">
              by {project.owner.firstName} {project.owner.lastName}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 px-4 sm:px-6 sm:space-y-4">
          {/* Description */}
          <p className="text-gray-300 text-xs sm:text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {project.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 px-2 py-0.5"
              >
                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                <span className="truncate max-w-16 sm:max-w-none">{tag}</span>
              </Badge>
            ))}
            {project.tags.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 px-2 py-0.5"
              >
                +{project.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Roles - Hidden on small screens, shown on medium+ */}
          <div className="hidden md:block">
            <RoleMemberDisplay 
              projectSlug={project.slug}
              roles={project.roles}
              compact={true}
              maxRolesShown={2}
              lazyLoad={true}
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4 px-4 sm:px-6 pb-4 sm:pb-2">
          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.memberCount}</span>
              </div>
              <span className="text-xs">Members</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{project.applicationCount}</span>
              </div>
              <span className="text-xs">Applications</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {/* Save Button */}
            {isAuthenticated && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSaveToggle}
                disabled={saveProjectMutation.isPending || unsaveProjectMutation.isPending}
                className={`border-gray-700 hover:bg-gray-800 hover:border-purple-500/50 p-2 ${
                  isSaved 
                    ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' 
                    : 'text-gray-300'
                }`}
                title={isSaved ? 'Unsave project' : 'Save project'}
              >
                {isSaved ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </Button>
            )}

            {/* Share Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50 p-2"
              title="Share project"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Share className="w-4 h-4" />
              )}
            </Button>

            {/* View Details Button */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3"
                >
                  <span className="text-sm">View</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[95vw] bg-gray-950 !w-[95vw] !h-[95vh] overflow-hidden p-0 sm:!max-w-[90vw] sm:!w-[90vw] sm:!h-[90vh]">
                <DialogTitle className='sr-only'>{project.title}</DialogTitle>
                <div className="h-full overflow-y-auto p-4 sm:p-6">
                  <ProjectDetailClient 
                    project={project} 
                    onClose={() => setIsDetailModalOpen(false)} 
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
