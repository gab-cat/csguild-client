'use client'

import { motion } from 'framer-motion'
import { Users, Loader2 } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

import type { ProjectRoleDto } from '@generated/api-client'

import { useRoleMemberCounts, getRoleMemberCount } from '../hooks/use-role-member-counts'

interface RoleMemberDisplayProps {
  projectSlug: string
  roles: ProjectRoleDto[]
  compact?: boolean
  maxRolesShown?: number
  lazyLoad?: boolean // When true, only loads data when component becomes visible or on hover
  customTitle?: string // Custom title for the roles section
  showRoleCount?: boolean // Whether to show role count in title
}

export function RoleMemberDisplay({ 
  projectSlug, 
  roles, 
  compact = false, 
  maxRolesShown = 10,
  lazyLoad = false,
  customTitle,
  showRoleCount = false
}: RoleMemberDisplayProps) {
  const [shouldLoadData, setShouldLoadData] = useState(!lazyLoad)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Use Intersection Observer to detect when component is visible
  useEffect(() => {
    if (!lazyLoad || shouldLoadData) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setShouldLoadData(true)
          // Once we've loaded, we don't need to observe anymore
          observer.disconnect()
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the component is visible
        rootMargin: '50px', // Start loading 50px before it comes into view
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [lazyLoad, shouldLoadData])
  
  const { roleMemberCounts, isLoading, error } = useRoleMemberCounts(
    projectSlug, 
    roles, 
    shouldLoadData // Only fetch data when we should load it
  )

  if (error) {
    // Fallback to showing without member counts
    const title = customTitle || 'Roles Needed'
    const titleWithCount = showRoleCount ? `${title} (${roles.length})` : title
    
    return (
      <div className="space-y-2" ref={containerRef}>
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {titleWithCount}
        </h4>
        <div className="space-y-1">
          {roles.slice(0, maxRolesShown).map((roleInfo, roleIndex) => (          
            <div key={roleIndex} className="flex items-center justify-between text-xs">
              <span className="text-gray-300 truncate flex-1">
                {roleInfo.role?.name || roleInfo.role?.slug || roleInfo.roleSlug || 'Unknown Role'}
              </span>
              <span className="text-gray-400 ml-2 flex-shrink-0">
              ?/{roleInfo.maxMembers}
              </span>
            </div>
          ))}
          {roles.length > maxRolesShown && (
            <div className="text-xs text-gray-400">
              +{roles.length - maxRolesShown} more{showRoleCount ? ' roles' : ''}
            </div>
          )}
        </div>
      </div>
    )
  }

  if (compact) {
    const title = customTitle || 'Roles Needed'
    const titleWithCount = showRoleCount ? `${title} (${roles.length})` : title
    
    return (
      <div 
        className="space-y-2" 
        ref={containerRef}
      >
        <h4 className="text-sm font-medium text-gray-400 flex items-center gap-1">
          <Users className="w-4 h-4" />
          {titleWithCount}
          {isLoading && <Loader2 className="w-3 h-3 animate-spin" />}
        </h4>
        <div className="space-y-1">
          {roles.slice(0, maxRolesShown).map((roleInfo, roleIndex) => {
            const memberCount = getRoleMemberCount(roleMemberCounts, roleInfo.roleSlug)
            const showLoadingOrDefault = !shouldLoadData || isLoading
            return (
              <div key={roleIndex} className="flex items-center justify-between text-xs">
                <span className="text-gray-300 truncate flex-1">
                  {roleInfo.role?.name || roleInfo.role?.slug || roleInfo.roleSlug || 'Unknown Role'}
                </span>
                <span className={`ml-2 flex-shrink-0 ${
                  showLoadingOrDefault 
                    ? 'text-gray-400' 
                    : memberCount.availablePositions > 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                }`}>
                  {showLoadingOrDefault 
                    ? `?/${roleInfo.maxMembers}`
                    : `${memberCount.currentMembers}/${memberCount.maxMembers}`
                  }
                </span>
              </div>
            )
          })}
          {roles.length > maxRolesShown && (
            <div className="text-xs text-gray-400">
              +{roles.length - maxRolesShown} more{showRoleCount ? ' roles' : ''}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Full detailed view for project detail page
  return (
    <div className="space-y-3" ref={containerRef}>
      {roles.map((roleDto, index) => {
        const memberCount = getRoleMemberCount(roleMemberCounts, roleDto.roleSlug)
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center justify-between p-4 bg-gray-800/40 border border-gray-700/50 rounded-xl hover:border-purple-500/30 transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold text-base">
                    {roleDto.role?.name || roleDto.role?.slug || roleDto.roleSlug || 'Unknown Role'}
                  </h4>
                  {memberCount.availablePositions === 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                      Full
                    </span>
                  )}
                </div>
                {roleDto.requirements && (
                  <p className="text-gray-400 text-sm leading-relaxed ml-11">
                    {roleDto.requirements}
                  </p>
                )}
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className={`text-xl font-bold ${memberCount.availablePositions > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    `${memberCount.currentMembers}/${memberCount.maxMembers}`
                  )}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  positions
                </div>
                {!isLoading && memberCount.availablePositions > 0 && (
                  <div className="text-xs text-green-400 mt-1">
                    {memberCount.availablePositions} available
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
