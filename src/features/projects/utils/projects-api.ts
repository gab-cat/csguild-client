import { projectsApi as projectsClient, rolesApi } from '@/lib/api'
import type {
  ProjectListResponseDto,
  ProjectDetailDto,
  ProjectApplicationDto,
  ProjectMemberDto,
  CreateProjectDto,
  JoinProjectDto,
  UpdateProjectDto,
  ProjectCreateResponseDto,
  JoinProjectResponseDto,
  ReviewApplicationDto,
  ReviewApplicationResponseDto,
  MyProjectsResponseDto,
  MyApplicationsResponseDto,
  RoleListResponseDto,
  RoleResponseDto,
  CreateRoleDto,
  CreateRoleResponseDto,
} from '@generated/api-client'

export const projectsApi = {
  // Get all projects with filtering and pagination
  getProjects: async (params?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    tags?: string
    search?: string
    ownerSlug?: string
    page?: number
    limit?: number
    sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title'
    sortOrder?: 'asc' | 'desc'
  }): Promise<ProjectListResponseDto> => {
    const response = await projectsClient.projectsQueryControllerFindAll(params || {})
    return response.data
  },

  // Get project by slug
  getProjectBySlug: async (slug: string): Promise<ProjectDetailDto> => {
    const response = await projectsClient.projectsQueryControllerFindOne({ slug })
    return response.data
  },

  // Get project basic info
  getProjectBasic: async (slug: string): Promise<ProjectDetailDto> => {
    const response = await projectsClient.projectsQueryControllerGetProjectBasic({ slug })
    return response.data
  },

  // Get project members
  getProjectMembers: async (slug: string, roleSlug?: string): Promise<ProjectMemberDto[]> => {
    const response = await projectsClient.projectsQueryControllerGetProjectMembers({ 
      slug, 
      roleSlug 
    })
    return response.data
  },

  // Get project applications
  getProjectApplications: async (slug: string, roleSlug?: string): Promise<ProjectApplicationDto[]> => {
    const response = await projectsClient.projectsQueryControllerGetProjectApplications({ 
      slug, 
      roleSlug 
    })
    return response.data
  },

  // Get current user's projects
  getMyProjects: async (): Promise<MyProjectsResponseDto> => {
    const response = await projectsClient.projectsQueryControllerGetMyProjects()
    return response.data
  },

  // Get current user's applications
  getMyApplications: async (): Promise<MyApplicationsResponseDto> => {
    const response = await projectsClient.projectsQueryControllerGetMyApplications()
    return response.data
  },

  // Create new project
  createProject: async (data: CreateProjectDto): Promise<ProjectCreateResponseDto> => {
    const response = await projectsClient.projectsCommandControllerCreate({
      createProjectDto: data
    })
    return response.data
  },

  // Update project
  updateProject: async (slug: string, data: UpdateProjectDto): Promise<ProjectCreateResponseDto> => {
    const response = await projectsClient.projectsCommandControllerUpdate({
      slug,
      updateProjectDto: data
    })
    return response.data
  },

  // Update project status
  updateProjectStatus: async (slug: string, status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'): Promise<ProjectCreateResponseDto> => {
    const response = await projectsClient.projectsCommandControllerUpdateStatus({
      slug,
      updateProjectStatusDto: { status }
    })
    return response.data
  },

  // Delete project
  deleteProject: async (slug: string): Promise<void> => {
    await projectsClient.projectsCommandControllerRemove({ slug })
  },

  // Apply to join project
  joinProject: async (data: JoinProjectDto): Promise<JoinProjectResponseDto> => {
    const response = await projectsClient.projectsCommandControllerJoinProject({
      joinProjectDto: data
    })
    return response.data
  },

  // Review project application
  reviewApplication: async (data: ReviewApplicationDto): Promise<ReviewApplicationResponseDto> => {
    const response = await projectsClient.projectsCommandControllerReviewApplication({
      reviewApplicationDto: data
    })
    return response.data
  },

  // Get all roles for project creation
  getRoles: async (params?: {
    search?: string
    page?: number
    limit?: number
    sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'slug'
    sortOrder?: 'asc' | 'desc'
  }): Promise<RoleListResponseDto> => {
    const response = await rolesApi.rolesQueryControllerFindAll(params || {})
    return response.data
  },

  // Get role by slug
  getRoleBySlug: async (slug: string): Promise<RoleResponseDto> => {
    const response = await rolesApi.rolesQueryControllerFindBySlug({ slug })
    return response.data
  },

  // Create new role
  createRole: async (data: { name: string; description?: string }): Promise<CreateRoleResponseDto> => {
    const createRoleDto: CreateRoleDto = {
      name: data.name,
      description: data.description,
    }
    const response = await rolesApi.rolesCommandControllerCreate({
      createRoleDto
    })
    return response.data
  },
}
