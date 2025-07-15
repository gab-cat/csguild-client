'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Users, Tag, User, Settings, Eye, Clock, Check, AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { useProjectMembers } from '../../hooks/use-projects-queries';
import { useRoleMemberCounts, getRoleMemberCount } from '../../hooks/use-role-member-counts';
import type { ProjectCardType } from '../../types';

import { ProjectApplicationForm } from './project-application-form';

interface ProjectDetailClientProps {
  project: ProjectCardType;
  onClose: () => void;
}

// Component for expandable requirements text
function ExpandableRequirements({ requirements }: { requirements: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowToggle, setShouldShowToggle] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(textRef.current).lineHeight);
      const actualHeight = textRef.current.scrollHeight;
      const maxHeight = lineHeight * 2; // 2 lines
      
      setShouldShowToggle(actualHeight > maxHeight);
    }
  }, [requirements]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex-1">
      <p 
        ref={textRef}
        className={`text-gray-400 text-sm leading-relaxed transition-all duration-300 ${
          !isExpanded && shouldShowToggle ? 'line-clamp-2' : ''
        }`}
      >
        {requirements}
      </p>
      {shouldShowToggle && (
        <button
          onClick={handleToggle}
          className="flex items-center gap-1 mt-2 text-purple-400 hover:text-purple-300 text-xs font-medium transition-colors"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function ProjectDetailClient({ project, onClose }: ProjectDetailClientProps) {
  const { data: membersData, isLoading: isLoadingMembers } = useProjectMembers(project.slug)
  const { roleMemberCounts, isLoading: isLoadingCounts } = useRoleMemberCounts(
    project.slug, 
    project.roles, 
    true
  )

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
    case 'OPEN':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'IN_PROGRESS':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'COMPLETED':
      return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
    case 'CANCELLED':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
    case 'OPEN':
      return <AlertCircle className="w-4 h-4" />;
    case 'IN_PROGRESS':
      return <Clock className="w-4 h-4" />;
    case 'COMPLETED':
      return <Check className="w-4 h-4" />;
    case 'CANCELLED':
      return <X className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isOverdue = project.dueDate ? new Date(project.dueDate) < new Date() : false;
  const daysDiff = project.dueDate ? Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24)) : 0;

  return (
    <div className="w-full min-h-full grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Column - Project Details */}
      <div className="lg:col-span-3 space-y-4 min-w-0">
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Project Info */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-3 leading-tight">
                  {project.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(project.status)} border px-2 py-1 flex items-center gap-1.5`}>
                      {getStatusIcon(project.status)}
                      {project.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Due Date */}
                  {project.dueDate && (
                    <div className="flex items-center gap-2 text-gray-400">
                      <CalendarDays className="w-4 h-4" />
                      <span className={`text-sm font-medium ${
                        isOverdue ? 'text-red-400' : 
                          daysDiff <= 7 ? 'text-yellow-400' : 'text-gray-400'
                      }`}>
                        Due {formatDate(project.dueDate)}
                        {isOverdue && ' (Overdue)'}
                        {!isOverdue && daysDiff <= 7 && daysDiff > 0 && ` (${daysDiff} days left)`}
                      </span>
                    </div>
                  )}

                  {/* Project Owner */}
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      by {project.owner?.firstName || 'Unknown'} {project.owner?.lastName || 'User'}
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
                    <div className="text-xl font-bold text-white">{membersData?.filter((member) => member.status === "ACTIVE").length || 0}</div>
                    <div className="text-xs text-gray-400">current members</div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Eye className="w-4 h-4 text-green-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Applications</span>
                    </div>
                    <div className="text-xl font-bold text-white">{project.applicationCount}</div>
                    <div className="text-xs text-gray-400">pending review</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Settings className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Roles</span>
                    </div>
                    <div className="text-xl font-bold text-white">{project.roles?.length || 0}</div>
                    <div className="text-xs text-gray-400">open positions</div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Tags</span>
                    </div>
                    <div className="text-xl font-bold text-white">{project.tags?.length || 0}</div>
                    <div className="text-xs text-gray-400">technologies</div>
                  </div>
                </div>
              </div>

              {/* Project Owner Card */}
              <div className="lg:w-72 flex-shrink-0 mt-auto">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <h3 className="text-base font-semibold text-white mb-3">Project Lead</h3>
                  <div className="flex items-center gap-3">
                    {project.owner?.imageUrl ? (
                      <Image 
                        src={project.owner.imageUrl} 
                        alt={`${project.owner.firstName} ${project.owner.lastName}`}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-500/30"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {project.owner?.firstName ? project.owner.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <p className="text-white font-semibold">
                        {`${project.owner?.firstName || ''} ${project.owner?.lastName || ''}`.trim() || 'Unknown User'}
                      </p>
                      <p className="text-purple-400 text-sm font-medium">
                        @{project.owner?.username || 'unknown'}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        Created {new Date(project.createdAt || '').toLocaleDateString()}
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
                {project.description}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-400" />
              Tags
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
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
        {project.roles && project.roles.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Open Positions ({project.roles.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
              {project.roles.map((roleDto, index) => {
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
                        <ExpandableRequirements requirements={roleDto.requirements} />
                      )}
                      
                      {!roleDto.requirements && (
                        <div className="flex-1 flex items-center justify-center py-1">
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

        {/* Current Team */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Current Team ({membersData ? membersData.filter(member => member.status === 'ACTIVE').length : 0})
          </h2>
          {isLoadingMembers ? (
            <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-400 text-sm">Loading team members...</span>
              </div>
            </div>
          ) : membersData && membersData.filter(member => member.status === 'ACTIVE').length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-1 lg:grid-cols-2">
              {membersData.filter(member => member.status === 'ACTIVE').map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg hover:border-green-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    {member.user.imageUrl ? (
                      <Image 
                        src={member.user.imageUrl} 
                        alt={`${member.user.firstName} ${member.user.lastName}`}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        {member.user.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {`${member.user.firstName || ''} ${member.user.lastName || ''}`.trim() || 'Unknown User'}
                      </p>
                      <p className="text-green-400 text-sm font-medium truncate">
                        {member.projectRole?.role?.name || member.projectRole?.roleSlug || 'Team Member'}
                      </p>
                      <p className="text-gray-400 text-xs">
                        @{member.user.username || 'unknown'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        Joined {new Date(member.joinedAt || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : project.memberCount > 0 ? (
            <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
              <p className="text-gray-400 leading-relaxed text-sm">
                This project currently has <span className="text-white font-semibold">{project.memberCount}</span> active member{project.memberCount === 1 ? '' : 's'}. 
                Connect with the project lead to learn more about the team structure and collaboration style.
              </p>
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

        {/* Close Button for small screens */}
        <div className="flex justify-center lg:hidden pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50 transition-all px-8"
          >
            Close
          </Button>
        </div>
      </div>

      {/* Right Column - Application Form */}
      <div className="lg:col-span-2 min-w-0">
        <div className="sticky top-0 space-y-4">
          {/* Application Section Header */}
          <div className="flex items-start justify-between">
            <div className="text-left">
              <h2 className="text-xl font-bold text-white mb-2">Join This Project</h2>
              <p className="text-gray-400 text-sm">
                Ready to contribute? Apply for a role that matches your skills.
              </p>
            </div>
            {/* Close Button for larger screens */}
            <div className="hidden lg:block ml-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50 transition-all"
              >
                Close
              </Button>
            </div>
          </div>

          <ProjectApplicationForm 
            project={project} 
          />
        </div>
      </div>
    </div>
  );
}
