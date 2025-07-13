'use client'

import { useQuery } from '@tanstack/react-query'

import { useCurrentUser } from '@/features/user/hooks/use-user-queries'
import { facilitiesApi, projectsApi, usersApi } from '@/lib/api'
import type { 
  FacilityResponseDto, 
  ProjectSummaryDto, 
  ProjectApplicationDto,
  UserResponseDto
} from '@generated/api-client'

// Query keys
export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
  recentActivity: () => [...dashboardQueryKeys.all, 'recentActivity'] as const,
}

interface ActivityItem {
  id: string
  title: string
  time: string
  type: 'application' | 'project' | 'facility'
  status?: string
  projectSlug?: string
}

// Dashboard statistics
export function useDashboardStats() {
  const { user, isAuthenticated } = useCurrentUser()

  const facilitiesQuery = useQuery({
    queryKey: ['facilities', 'list'],
    queryFn: async () => {
      const response = await facilitiesApi.facilitiesControllerGetFacilities()
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const projectsQuery = useQuery({
    queryKey: ['projects', 'list', { status: 'OPEN' }],
    queryFn: async () => {
      const response = await projectsApi.projectsQueryControllerFindAll({
        status: 'OPEN',
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })

  const myProjectsQuery = useQuery({
    queryKey: ['projects', 'myProjects'],
    queryFn: async () => {
      const response = await projectsApi.projectsQueryControllerGetMyProjects()
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })

  const myApplicationsQuery = useQuery({
    queryKey: ['projects', 'myApplications'],
    queryFn: async () => {
      const response = await projectsApi.projectsQueryControllerGetMyApplications()
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000,
  })

  const allUsersQuery = useQuery({
    queryKey: ['users', 'list'],
    queryFn: async () => {
      const response = await usersApi.usersControllerGetUsers()
      return response.data
    },
    enabled: isAuthenticated && (user?.roles?.includes('STAFF') || user?.roles?.includes('ADMIN')),
    staleTime: 5 * 60 * 1000,
  })

  return {
    facilities: {
      data: facilitiesQuery.data as FacilityResponseDto[] | undefined,
      isLoading: facilitiesQuery.isLoading,
      error: facilitiesQuery.error,
    },
    projects: {
      data: projectsQuery.data,
      isLoading: projectsQuery.isLoading,
      error: projectsQuery.error,
    },
    myProjects: {
      data: myProjectsQuery.data,
      isLoading: myProjectsQuery.isLoading,
      error: myProjectsQuery.error,
    },
    myApplications: {
      data: myApplicationsQuery.data,
      isLoading: myApplicationsQuery.isLoading,
      error: myApplicationsQuery.error,
    },
    users: {
      data: allUsersQuery.data as UserResponseDto[] | undefined,
      isLoading: allUsersQuery.isLoading,
      error: allUsersQuery.error,
    },
  }
}

// Recent activity based on real data
export function useRecentActivity() {
  const { isAuthenticated } = useCurrentUser()
  
  const myProjectsQuery = useQuery({
    queryKey: ['projects', 'myProjects'],
    queryFn: async () => {
      const response = await projectsApi.projectsQueryControllerGetMyProjects()
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000,
  })

  const myApplicationsQuery = useQuery({
    queryKey: ['projects', 'myApplications'],
    queryFn: async () => {
      const response = await projectsApi.projectsQueryControllerGetMyApplications()
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000,
  })

  // Transform data into activity items
  const activityItems: ActivityItem[] = []

  // Add recent project applications
  if (myApplicationsQuery.data?.applications) {
    myApplicationsQuery.data.applications.slice(0, 3).forEach((application: ProjectApplicationDto) => {
      activityItems.push({
        id: `application-${application.id}`,
        title: `Applied to "${application.projectRole?.role?.name}" role in project`,
        time: application.createdAt,
        type: 'application' as const,
        status: application.status,
        projectSlug: application.projectSlug,
      })
    })
  }

  // Add recent projects user is part of
  if (myProjectsQuery.data?.ownedProjects) {
    myProjectsQuery.data.ownedProjects.slice(0, 2).forEach((project: ProjectSummaryDto) => {
      activityItems.push({
        id: `project-owned-${project.id}`,
        title: `Working on "${project.title}" (Owner)`,
        time: project.createdAt,
        type: 'project' as const,
        status: project.status,
        projectSlug: project.slug,
      })
    })
  }

  // Add member projects
  if (myProjectsQuery.data?.memberProjects) {
    myProjectsQuery.data.memberProjects.slice(0, 2).forEach((project: ProjectSummaryDto) => {
      activityItems.push({
        id: `project-member-${project.id}`,
        title: `Working on "${project.title}" (Member)`,
        time: project.createdAt,
        type: 'project' as const,
        status: project.status,
        projectSlug: project.slug,
      })
    })
  }

  // Sort by time (most recent first)
  activityItems.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return {
    data: activityItems.slice(0, 5), // Show only 5 most recent
    isLoading: myApplicationsQuery.isLoading || myProjectsQuery.isLoading,
    error: myApplicationsQuery.error || myProjectsQuery.error,
  }
}

// Quick stats for the dashboard cards
export function useQuickStats() {
  const stats = useDashboardStats()
  
  return {
    facilities: {
      total: stats.facilities.data?.length || 0,
      active: stats.facilities.data?.filter(f => f.isActive).length || 0,
      occupancy: stats.facilities.data?.reduce((acc, f) => acc + (f.currentOccupancy || 0), 0) || 0,
    },
    projects: {
      total: stats.projects.data?.pagination?.total || 0,
      open: stats.projects.data?.data?.filter(p => p.status === 'OPEN').length || 0,
      myProjects: (stats.myProjects.data?.ownedProjects?.length || 0) + (stats.myProjects.data?.memberProjects?.length || 0),
      myApplications: stats.myApplications.data?.applications?.length || 0,
    },
    users: {
      total: stats.users.data?.length || 0,
    },
    isLoading: Object.values(stats).some(stat => stat.isLoading),
  }
}
