'use client'

import { DialogTitle } from '@radix-ui/react-dialog'
import { motion } from 'framer-motion'
import { Calendar, Users, Eye, Tag } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

import type { ProjectCardType } from '../../types'
import { RoleMemberDisplay } from '../role-member-display'

import { ProjectDetailClient } from './project-detail-client'

interface ProjectCardProps {
  project: ProjectCardType
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Card className="bg-gray-900/50 rounded-lg border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-full flex flex-col">
        <CardHeader className="space-y-4">
          {/* Status and Due Date */}
          <div className="flex items-center justify-between">
            <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </Badge>
            <div className={`flex items-center gap-1 text-xs ${
              isOverdue ? 'text-red-400' : 'text-gray-400'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(project.dueDate)}</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
              {project.title}
            </h3>
          </div>

          {/* Owner */}
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={project.owner.imageUrl} alt={project.owner.username} />
              <AvatarFallback className="bg-purple-500/20 text-purple-400 text-xs">
                {project.owner.firstName[0]}{project.owner.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-400">
              by {project.owner.firstName} {project.owner.lastName}
            </span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {/* Description */}
          <p className="text-gray-300 text-sm line-clamp-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs bg-gray-800/50 text-gray-300 border-gray-600"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge
                variant="outline"
                className="text-xs bg-gray-800/50 text-gray-300 border-gray-600"
              >
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* Roles */}
          <RoleMemberDisplay 
            projectSlug={project.slug}
            roles={project.roles}
            compact={true}
            maxRolesShown={2}
            lazyLoad={true}
          />
        </CardContent>

        <CardFooter className="flex items-center justify-between pt-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{project.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{project.applicationCount} applications</span>
            </div>
          </div>

          {/* Action Button */}
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                View Details
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
        </CardFooter>
      </Card>
    </motion.div>
  )
}
