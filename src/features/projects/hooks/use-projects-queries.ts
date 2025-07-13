'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  ProjectFilters,
  CreateProjectData,
  JoinProjectData,
  ReviewApplicationData,
  UpdateProjectDto,
} from '../types'
import { projectsApi } from '../utils/projects-api'

// Query keys
export const projectsQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsQueryKeys.all, 'list'] as const,
  list: (filters?: ProjectFilters) => 
    [...projectsQueryKeys.lists(), { filters }] as const,
  details: () => [...projectsQueryKeys.all, 'detail'] as const,
  detail: (slug: string) => [...projectsQueryKeys.details(), slug] as const,
  members: (slug: string, roleSlug?: string) => 
    [...projectsQueryKeys.all, 'members', slug, { roleSlug }] as const,
  applications: (slug: string, roleSlug?: string) => 
    [...projectsQueryKeys.all, 'applications', slug, { roleSlug }] as const,
  myProjects: () => [...projectsQueryKeys.all, 'myProjects'] as const,
  myApplications: () => [...projectsQueryKeys.all, 'myApplications'] as const,
  roles: () => ['roles'] as const,
  rolesList: (filters?: Record<string, unknown>) => 
    [...projectsQueryKeys.roles(), 'list', { filters }] as const,
  role: (slug: string) => [...projectsQueryKeys.roles(), slug] as const,
}

// Get all projects with filtering
export function useProjects(filters?: ProjectFilters) {
  return useQuery({
    queryKey: projectsQueryKeys.list(filters),
    queryFn: () => {
      const params = filters ? {
        status: filters.status,
        tags: filters.tags?.join(','),
        search: filters.search,
        ownerSlug: filters.ownerSlug,
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      } : undefined
      
      return projectsApi.getProjects(params)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get project by slug
export function useProject(slug: string) {
  return useQuery({
    queryKey: projectsQueryKeys.detail(slug),
    queryFn: () => projectsApi.getProjectBySlug(slug),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get project members
export function useProjectMembers(slug: string, roleSlug?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: projectsQueryKeys.members(slug, roleSlug),
    queryFn: () => projectsApi.getProjectMembers(slug, roleSlug),
    enabled: !!slug && enabled,
    staleTime: 2 * 60 * 1000,
  })
}

// Get project applications
export function useProjectApplications(slug: string, roleSlug?: string) {
  return useQuery({
    queryKey: projectsQueryKeys.applications(slug, roleSlug),
    queryFn: () => projectsApi.getProjectApplications(slug, roleSlug),
    enabled: !!slug,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get current user's projects
export function useMyProjects() {
  return useQuery({
    queryKey: projectsQueryKeys.myProjects(),
    queryFn: () => projectsApi.getMyProjects(),
    staleTime: 2 * 60 * 1000,
  })
}

// Get current user's applications
export function useMyApplications() {
  return useQuery({
    queryKey: projectsQueryKeys.myApplications(),
    queryFn: () => projectsApi.getMyApplications(),
    staleTime: 1 * 60 * 1000,
  })
}

// Get all roles for project creation
export function useRoles(filters?: {
  search?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'slug'
  sortOrder?: 'asc' | 'desc'
}) {
  return useQuery({
    queryKey: projectsQueryKeys.rolesList(filters),
    queryFn: () => projectsApi.getRoles(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes - roles don't change often
  })
}

// Get role by slug
export function useRole(slug: string) {
  return useQuery({
    queryKey: projectsQueryKeys.role(slug),
    queryFn: () => projectsApi.getRoleBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  })
}

// Create project mutation
export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectData) => projectsApi.createProject(data),
    onSuccess: () => {
      // Invalidate projects list and user's projects
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.myProjects() })
    },
  })
}

// Update project mutation
export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: UpdateProjectDto }) => 
      projectsApi.updateProject(slug, data),
    onSuccess: (_, { slug }) => {
      // Invalidate specific project and lists
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.myProjects() })
    },
  })
}

// Delete project mutation
export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => projectsApi.deleteProject(slug),
    onSuccess: () => {
      // Invalidate projects lists
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.myProjects() })
    },
  })
}

// Join project mutation
export function useJoinProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: JoinProjectData) => projectsApi.joinProject(data),
    onSuccess: (_, { projectSlug }) => {
      // Invalidate applications and user's applications
      queryClient.invalidateQueries({ 
        queryKey: projectsQueryKeys.applications(projectSlug) 
      })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.myApplications() })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.detail(projectSlug) })
    },
  })
}

// Review application mutation
export function useReviewApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ReviewApplicationData) => projectsApi.reviewApplication(data),
    onSuccess: () => {
      // Invalidate all applications and projects data
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.all })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })
}

// Create role mutation
export function useCreateRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => 
      projectsApi.createRole(data),
    onSuccess: () => {
      // Invalidate roles list
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.roles() })
    },
  })
}

// Update project status mutation
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, status }: { slug: string; status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' }) => 
      projectsApi.updateProjectStatus(slug, status),
    onSuccess: (_, { slug }) => {
      // Invalidate specific project and lists
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.detail(slug) })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectsQueryKeys.myProjects() })
    },
  })
}
