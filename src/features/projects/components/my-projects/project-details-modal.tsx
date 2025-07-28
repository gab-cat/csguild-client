'use client'

import { motion } from 'framer-motion'
import { CalendarDays, Users, Tag, User, Settings, Eye, X, Edit, Clock, Check, AlertCircle, UserMinus, UserPlus } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { useProject, useProjectMembers } from '../../hooks/use-projects-queries'
import { useRoleMemberCounts, getRoleMemberCount } from '../../hooks/use-role-member-counts'
import type { ProjectCardType, ProjectMemberDto } from '../../types'

import { ReactivateMemberDialog } from './reactivate-member-dialog'
import { RemoveMemberDialog } from './remove-member-dialog'
import { UpdateProjectModal } from './update-project-modal'

interface ProjectDetailsModalProps {
  project: ProjectCardType
  isOpen: boolean
  onClose: () => void
  canEdit?: boolean
}

export function ProjectDetailsModal({ 
  project, 
  isOpen, 
  onClose, 
  canEdit = false 
}: ProjectDetailsModalProps) {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [memberToRemove, setMemberToRemove] = useState<ProjectMemberDto | null>(null)
  const [memberToReactivate, setMemberToReactivate] = useState<ProjectMemberDto | null>(null)
  
  const { data: fullProject } = useProject(project.slug)
  const { data: members } = useProjectMembers(project.slug)
  const { roleMemberCounts, isLoading: isLoadingCounts } = useRoleMemberCounts(
    project.slug, 
    fullProject?.roles || project.roles || [], 
    true
  )

  const displayProject = fullProject || project

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
    case 'open':
      return 'bg-green-500/20 text-green-400 border-green-500/50'
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50'
    case 'completed':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50'
    case 'cancelled':
      return 'bg-red-500/20 text-red-400 border-red-500/50'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
    case 'open':
      return <AlertCircle className="w-4 h-4" />
    case 'in_progress':
      return <Clock className="w-4 h-4" />
    case 'completed':
      return <Check className="w-4 h-4" />
    case 'cancelled':
      return <X className="w-4 h-4" />
    default:
      return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isOverdue = displayProject.dueDate ? new Date(displayProject.dueDate) < new Date() : false
  const daysDiff = displayProject.dueDate ? Math.ceil((new Date(displayProject.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="!max-w-6xl bg-gray-950 border-gray-800 !w-[90vw] !h-[90vh] p-0">
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <DialogHeader className="flex-shrink-0 px-4 py-3 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-white">
                  Project Details
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUpdateModal(true)}
                      className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Project
                    </Button>
                  )}
                </div>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-0">
              <div className="space-y-4">{/* space-y-8 changed to space-y-4 */}
                {/* Hero Section */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
                  <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Project Info */}
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
                          {displayProject.title}
                        </h1>
                        
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {/* Status */}
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(displayProject.status)} border px-2 py-1 flex items-center gap-1.5`}>
                              {getStatusIcon(displayProject.status)}
                              {displayProject.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>

                          {/* Due Date */}
                          <div className="flex items-center gap-2 text-gray-400">
                            <CalendarDays className="w-4 h-4" />
                            <span className={`text-sm font-medium ${
                              isOverdue ? 'text-red-400' : 
                                daysDiff <= 7 ? 'text-yellow-400' : 'text-gray-400'
                            }`}>
                              Due {displayProject.dueDate ? formatDate(displayProject.dueDate) : 'No due date'}
                              {isOverdue && ' (Overdue)'}
                              {!isOverdue && daysDiff <= 7 && daysDiff > 0 && ` (${daysDiff} days left)`}
                            </span>
                          </div>

                          {/* Project Owner */}
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              by {displayProject.owner?.firstName || 'Unknown'} {displayProject.owner?.lastName || 'User'}
                            </span>
                          </div>
                        </div>

                        {/* Project Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Users className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Team Size</span>
                            </div>
                            <div className="text-xl font-bold text-white">{'memberCount' in displayProject ? displayProject.memberCount : members?.length || 0}</div>
                            <div className="text-xs text-gray-400">current members</div>
                          </div>
                          
                          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-green-400" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Applications</span>
                            </div>
                            <div className="text-xl font-bold text-white">{'applicationCount' in displayProject ? displayProject.applicationCount : 0}</div>
                            <div className="text-xs text-gray-400">pending review</div>
                          </div>

                          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Settings className="w-4 h-4 text-blue-400" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Roles</span>
                            </div>
                            <div className="text-xl font-bold text-white">{displayProject.roles?.length || 0}</div>
                            <div className="text-xs text-gray-400">open positions</div>
                          </div>

                          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                            <div className="flex items-center gap-2 mb-1">
                              <Tag className="w-4 h-4 text-orange-400" />
                              <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</span>
                            </div>
                            <div className="text-xl font-bold text-white">{displayProject.tags?.length || 0}</div>
                            <div className="text-xs text-gray-400">technologies</div>
                          </div>
                        </div>
                      </div>

                      {/* Project Owner Card */}
                      <div className="lg:w-72 flex-shrink-0 h-full mt-auto">
                        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 mt-auto">
                          <h3 className="text-base font-semibold text-white mb-3">Project Lead</h3>
                          <div className="flex items-center gap-3">
                            {displayProject.owner?.imageUrl ? (
                              <Image 
                                src={displayProject.owner.imageUrl} 
                                alt={`${displayProject.owner.firstName} ${displayProject.owner.lastName}`}
                                width={48}
                                height={48}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {displayProject.owner?.firstName ? displayProject.owner.firstName.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div>
                              <p className="text-white font-semibold">
                                {`${displayProject.owner?.firstName || ''} ${displayProject.owner?.lastName || ''}`.trim() || 'Unknown User'}
                              </p>
                              <p className="text-purple-400 text-sm font-medium">
                                @{displayProject.owner?.username || 'unknown'}
                              </p>
                              <p className="text-gray-400 text-xs mt-1">
                                Created {new Date(displayProject.createdAt || '').toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-3">
                  <h2 className="text-lg font-bold text-white">About This Project</h2>
                  <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {displayProject.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Stack */}
                {displayProject.tags && displayProject.tags.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-400" />
                      Technology Stack
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {displayProject.tags.map((tag, index) => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                          <div className="relative bg-gray-800 border border-gray-700 rounded-full px-4 py-1 hover:border-purple-500/50 transition-colors">
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                              {tag}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Open Positions */}
                {displayProject.roles && displayProject.roles.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Open Positions ({displayProject.roles.length})
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                      {displayProject.roles.map((roleDto, index) => {
                        const memberCount = getRoleMemberCount(roleMemberCounts, roleDto.roleSlug)
                        const isAvailable = memberCount.availablePositions > 0
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="relative p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:border-purple-500/30 transition-all h-full flex flex-col">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                                    <Users className="w-4 h-4 text-purple-400" />
                                  </div>
                                  <h4 className="text-white font-semibold text-base">
                                    {roleDto.role?.name || roleDto.role?.slug || roleDto.roleSlug || 'Unknown Role'}
                                  </h4>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  {isLoadingCounts ? (
                                    <div className="text-lg font-bold text-gray-400 flex items-center gap-1">
                                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                      <span>...</span>
                                    </div>
                                  ) : (
                                    <>
                                      <div className={`text-lg font-bold ${isAvailable ? 'text-green-400' : 'text-red-400'}`}>
                                        {memberCount.currentMembers}/{memberCount.maxMembers}
                                      </div>
                                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                                        {isAvailable ? 'available' : 'filled'}
                                      </div>
                                      {isAvailable && (
                                        <div className="text-xs text-green-400 mt-1">
                                          {memberCount.availablePositions} open
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              
                              {roleDto.requirements && (
                                <div className="flex-1">
                                  <h5 className="text-sm font-medium text-gray-300 mb-2">Requirements:</h5>
                                  <p className="text-gray-400 text-sm leading-relaxed">
                                    {roleDto.requirements}
                                  </p>
                                </div>
                              )}
                              
                              {!roleDto.requirements && (
                                <div className="flex-1 flex items-center justify-center py-4">
                                  <p className="text-gray-500 text-sm italic">
                                    No specific requirements listed
                                  </p>
                                </div>
                              )}
                              
                              {!isLoadingCounts && !isAvailable && (
                                <div className="mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                                  <p className="text-red-400 text-xs text-center">
                                    Position currently filled
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Team Section */}
                <div className="grid grid-cols-1 gap-4">

                  {/* Current Team */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-400" />
                      Team Members ({'memberCount' in displayProject ? displayProject.memberCount : members?.length || 0})
                    </h2>
                    {members && members.length > 0 ? (
                      <div className="space-y-4">
                        {/* Active Members */}
                        <div className="space-y-4">
                          <h3 className="text-md font-semibold text-green-400 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Active Members ({members.filter(m => m.status === 'ACTIVE').length})
                          </h3>
                          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                            {members.filter(member => member.status === 'ACTIVE').map((member, index) => (
                              <motion.div
                                key={member.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:border-green-500/30 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  {member.user?.imageUrl ? (
                                    <Image 
                                      src={member.user.imageUrl} 
                                      alt={`${member.user.firstName} ${member.user.lastName}`}
                                      width={48}
                                      height={48}
                                      className="w-12 h-12 rounded-full object-cover ring-2 ring-green-500/30"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                      {member.user?.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold truncate">
                                      {`${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim() || 'Unknown User'}
                                    </p>
                                    <p className="text-green-400 text-sm font-medium truncate">
                                      {member.projectRole?.role?.name || member.projectRole?.roleSlug || 'Team Member'}
                                    </p>
                                    <p className="text-purple-400 text-xs truncate">
                                      @{member.user?.username || 'unknown'}
                                    </p>
                                    <p className="text-gray-400 text-xs truncate">
                                      {member.user?.email || 'Email not available'}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                    <div className="text-xs text-gray-400">
                                      Joined {new Date(member.joinedAt || '').toLocaleDateString()}
                                    </div>
                                    {canEdit && (
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => setMemberToRemove(member)}
                                        className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-600/50 hover:border-red-600/70 h-8 px-2"
                                      >
                                        <UserMinus className="w-3 h-3 mr-1" />
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Inactive Members */}
                        {members.filter(m => m.status === 'REMOVED').length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-md font-semibold text-gray-400 flex items-center gap-2">
                              <UserMinus className="w-4 h-4" />
                              Removed Members ({members.filter(m => m.status === 'REMOVED').length})
                            </h3>
                            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                              {members.filter(member => member.status === 'REMOVED').map((member, index) => (
                                <motion.div
                                  key={member.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="p-4 bg-gray-800/20 border border-gray-700/30 rounded-lg hover:border-yellow-500/30 transition-all opacity-75"
                                >
                                  <div className="flex items-center gap-3">
                                    {member.user?.imageUrl ? (
                                      <Image 
                                        src={member.user.imageUrl} 
                                        alt={`${member.user.firstName} ${member.user.lastName}`}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-500/30 grayscale"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {member.user?.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-gray-300 font-semibold truncate">
                                        {`${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim() || 'Unknown User'}
                                      </p>
                                      <p className="text-gray-400 text-sm font-medium truncate">
                                        {member.projectRole?.role?.name || member.projectRole?.roleSlug || 'Team Member'}
                                      </p>
                                      <p className="text-gray-500 text-xs truncate">
                                        @{member.user?.username || 'unknown'}
                                      </p>
                                      <p className="text-red-400 text-xs truncate">
                                        Removed from project
                                      </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                      <div className="text-xs text-gray-500">
                                        Previously joined {new Date(member.joinedAt || '').toLocaleDateString()}
                                      </div>
                                      {canEdit && (
                                        <Button
                                          size="sm"
                                          onClick={() => setMemberToReactivate(member)}
                                          className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/50 hover:border-green-600/70 h-8 px-2"
                                        >
                                          <UserPlus className="w-3 h-3 mr-1" />
                                          Reactivate
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg text-center">
                        <Users className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">No team members yet</p>
                        <p className="text-gray-500 text-xs">
                          Be the first to join this project!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Project Modal */}
      {showUpdateModal && (
        <UpdateProjectModal
          project={project}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          onSuccess={() => setShowUpdateModal(false)}
        />
      )}

      {/* Remove Member Dialog */}
      {memberToRemove && (
        <RemoveMemberDialog
          isOpen={!!memberToRemove}
          onClose={() => setMemberToRemove(null)}
          member={memberToRemove}
          projectSlug={project.slug}
          projectTitle={project.title}
        />
      )}

      {/* Reactivate Member Dialog */}
      {memberToReactivate && (
        <ReactivateMemberDialog
          isOpen={!!memberToReactivate}
          onClose={() => setMemberToReactivate(null)}
          member={memberToReactivate}
          projectSlug={project.slug}
          projectTitle={project.title}
        />
      )}
    </>
  )
}
