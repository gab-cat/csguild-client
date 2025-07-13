'use client'

import { useMemo } from 'react'

import type { ProjectRoleDto, ProjectMemberDto } from '@generated/api-client'

import { useProjectMembers } from './use-projects-queries'

interface RoleMemberCount {
  roleSlug: string
  currentMembers: number
  maxMembers: number
  availablePositions: number
}

/**
 * Hook to get member counts per role for a project
 * @param projectSlug - The project slug
 * @param roles - The project roles from the project data
 * @param enabled - Whether to fetch the data (defaults to true)
 * @returns Object with loading state, error, and role member counts
 */
export function useRoleMemberCounts(
  projectSlug: string, 
  roles: ProjectRoleDto[], 
  enabled: boolean = true
) {
  const { 
    data: members, 
    isLoading, 
    error 
  } = useProjectMembers(projectSlug, undefined, enabled)

  const roleMemberCounts = useMemo((): RoleMemberCount[] => {
    if (!members || !roles) {
      // Return default counts if data is not available
      return roles?.map(role => ({
        roleSlug: role.roleSlug,
        currentMembers: 0,
        maxMembers: role.maxMembers,
        availablePositions: role.maxMembers,
      })) || []
    }

    // Count members by role
    const memberCountsByRole = members.reduce((acc, member: ProjectMemberDto) => {
      if (member.status === 'ACTIVE') {
        acc[member.roleSlug] = (acc[member.roleSlug] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Map roles with their current member counts
    return roles.map(role => {
      const currentMembers = memberCountsByRole[role.roleSlug] || 0
      return {
        roleSlug: role.roleSlug,
        currentMembers,
        maxMembers: role.maxMembers,
        availablePositions: Math.max(0, role.maxMembers - currentMembers),
      }
    })
  }, [members, roles])

  return {
    roleMemberCounts,
    isLoading,
    error,
  }
}

/**
 * Get member count for a specific role
 * @param roleMemberCounts - Array of role member counts
 * @param roleSlug - The role slug to find
 * @returns The role member count or default values if not found
 */
export function getRoleMemberCount(
  roleMemberCounts: RoleMemberCount[], 
  roleSlug: string
): RoleMemberCount {
  return roleMemberCounts.find(count => count.roleSlug === roleSlug) || {
    roleSlug,
    currentMembers: 0,
    maxMembers: 0,
    availablePositions: 0,
  }
}

/**
 * Check if a role has available positions
 * @param roleMemberCounts - Array of role member counts
 * @param roleSlug - The role slug to check
 * @returns True if the role has available positions
 */
export function hasAvailablePositions(
  roleMemberCounts: RoleMemberCount[], 
  roleSlug: string
): boolean {
  const roleCount = getRoleMemberCount(roleMemberCounts, roleSlug)
  return roleCount.availablePositions > 0
}

/**
 * Get total available positions across all roles
 * @param roleMemberCounts - Array of role member counts
 * @returns Total number of available positions
 */
export function getTotalAvailablePositions(roleMemberCounts: RoleMemberCount[]): number {
  return roleMemberCounts.reduce((total, role) => total + role.availablePositions, 0)
}
