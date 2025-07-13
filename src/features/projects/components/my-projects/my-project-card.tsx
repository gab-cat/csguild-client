'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Eye, Tag, Settings, MoreVertical } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { ProjectCardType } from '../../types'
import { RoleMemberDisplay } from '../role-member-display'

import { ApplicationsModal } from './applications-modal'
import { ProjectDetailsModal } from './project-details-modal'
import { UpdateProjectModal } from './update-project-modal'

interface MyProjectCardProps {
  project: ProjectCardType
  index?: number
}

export function MyProjectCard({ project, index = 0 }: MyProjectCardProps) {
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)

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

  const isOverdue = new Date(project.dueDate) < new Date()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group w-full"
    >
      <Card className="bg-gray-900/50 rounded-lg border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full flex flex-col w-full">
        <CardHeader className="space-y-2 pb-3">
          {/* Header Row: Title, Status, Due Date, Actions */}
          <div className="flex items-start justify-between gap-2 w-full">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight">
                {project.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-400 hover:text-white">
                    <MoreVertical className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem 
                    className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setIsDetailsModalOpen(true)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-gray-300 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Meta Row: Owner, Due Date, Stats */}
          <div className="flex items-center justify-between gap-2 w-full text-xs">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="w-5 h-5 flex-shrink-0">
                <AvatarImage src={project.owner?.imageUrl} alt={project.owner?.username} />
                <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                  {project.owner?.firstName?.[0] || 'U'}{project.owner?.lastName?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-gray-400 truncate">
                by {project.owner?.firstName || 'Unknown'} {project.owner?.lastName || 'User'}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 text-gray-400">
              <div className={`flex items-center gap-1 ${
                isOverdue ? 'text-red-400' : 'text-gray-400'
              }`}>
                <Calendar className="w-3 h-3" />
                <span>{formatDate(project.dueDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{project.memberCount || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                <span>{project.applicationCount || 0}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-3 py-0">
          {/* Description */}
          <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tags and Roles in two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tags */}
            <div className="space-y-1">
              <div className="flex flex-wrap gap-1">
                {project.tags?.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 px-2 py-0.5"
                  >
                    <Tag className="w-2.5 h-2.5 mr-1" />
                    {tag}
                  </Badge>
                ))}
                {(project.tags?.length || 0) > 2 && (
                  <Badge
                    variant="outline"
                    className="text-xs bg-gray-800/50 text-gray-300 border-gray-600 px-2 py-0.5"
                  >
                    +{(project.tags?.length || 0) - 2}
                  </Badge>
                )}
              </div>
            </div>

            {/* Roles Needed */}
            <div className="space-y-1">
              <RoleMemberDisplay 
                projectSlug={project.slug}
                roles={project.roles || []}
                compact={true}
                maxRolesShown={2}
                lazyLoad={true}
                customTitle="Roles"
                showRoleCount={true}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 pb-4">
          {/* Action Button */}
          <Dialog open={isApplicationsModalOpen} onOpenChange={setIsApplicationsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-9"
                disabled={(project.applicationCount || 0) === 0}
              >
                {(project.applicationCount || 0) === 0 
                  ? 'No Applications Yet' 
                  : `View Applications (${project.applicationCount || 0})`
                }
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-6xl bg-gray-950 !w-6xl !h-[95vh] overflow-hidden p-0 sm:!h-[90vh]">
              <DialogTitle className="sr-only">Applications for {project.title}</DialogTitle>
              <div className="h-full overflow-y-auto p-4 sm:p-6">
                <ApplicationsModal 
                  project={project} 
                  onClose={() => setIsApplicationsModalOpen(false)} 
                />
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={project}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        canEdit={true}
      />

      {/* Update Project Modal */}
      <UpdateProjectModal
        project={project}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh data or show success feedback
        }}
      />
    </motion.div>
  )
}
