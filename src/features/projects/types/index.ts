// Project types based on API documentation
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
  ProjectSummaryDto,
} from '@generated/api-client'

// Re-export API types for convenience
export type {
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
  ProjectSummaryDto,
}

// Project status enum
export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// Application status enum
export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

// Review decision enum
export type ReviewDecision = 'APPROVED' | 'REJECTED'

// Project filters for query parameters
export interface ProjectFilters {
  status?: ProjectStatus
  tags?: string[]
  search?: string
  ownerSlug?: string
  page?: number
  limit?: number
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'title'
  sortOrder?: 'asc' | 'desc'
  pinned?: boolean
}

// Project role for creation
export interface ProjectRole {
  roleSlug: string
  maxMembers: number
  requirements?: string
}

// Extended project creation data
export interface CreateProjectData {
  title: string
  description: string
  tags: string[]
  dueDate: string
  roles: ProjectRole[]
}

// Join project application data
export interface JoinProjectData {
  projectSlug: string
  roleSlug: string
  message: string
}

// Application review data
export interface ReviewApplicationData {
  applicationId: string
  decision: ReviewDecision
  reviewMessage?: string
}

// Remove member data
export interface RemoveMemberData {
  slug: string
  memberUserSlug: string
}

// Extended application type that includes review information and full project data
export interface ExtendedProjectApplicationDto extends Omit<ProjectApplicationDto, 'projectRole'> {
  reviewMessage?: string
  reviewedAt?: string
  project: {
    title: string
    slug: string
    description: string
  },
  projectRole: {
    id: string
    role?: {
      id: string
      name: string
      slug: string
    }
    project?: {
      id: string
      title: string
      slug: string
      description: string
      status: ProjectStatus
      owner?: {
        id: string
        username: string
        firstName: string
        lastName: string
        imageUrl?: string
      }
    }
  }
}

// Type guard to check if application has review data
export function hasReviewMessage(
  application: unknown
): application is ExtendedProjectApplicationDto & { reviewMessage: string } {
  return typeof application === 'object' && application !== null && 'reviewMessage' in application && typeof (application as { reviewMessage?: string }).reviewMessage === 'string'
}

// Type guard to check if application has project data
export function hasProjectData(
  application: unknown
): application is ExtendedProjectApplicationDto & { projectRole: { project: NonNullable<ExtendedProjectApplicationDto['projectRole']['project']> } } {
  return typeof application === 'object' && application !== null && 
         'projectRole' in application && 
         typeof (application as { projectRole?: unknown }).projectRole === 'object' &&
         (application as { projectRole: { project?: unknown } }).projectRole?.project != null
}

// Project card data for listing - now extends ProjectSummaryDto but makes dueDate required
export interface ProjectCardType extends Omit<ProjectSummaryDto, 'dueDate'> {
  dueDate: string
}

// Utility function to convert ProjectSummaryDto to ProjectCard
export function toProjectCard(summary: ProjectSummaryDto): ProjectCardType | null {
  if (!summary.dueDate) {
    return null // Skip projects without due dates
  }
  
  return {
    ...summary,
    dueDate: summary.dueDate,
  }
}

// Utility function to convert ProjectDetailDto to ProjectCard
export function toProjectCardFromDetail(detail: ProjectDetailDto, memberCount: number = 0, applicationCount: number = 0): ProjectCardType | null {
  if (!detail.dueDate) {
    return null // Skip projects without due dates
  }
  
  return {
    id: detail.id,
    slug: detail.slug,
    title: detail.title,
    description: detail.description,
    tags: detail.tags,
    dueDate: detail.dueDate,
    status: detail.status,
    createdAt: detail.createdAt,
    owner: detail.owner,
    roles: detail.roles,
    memberCount,
    applicationCount,
  } as ProjectCardType
}

// API Error types
export interface ProjectApiError {
  statusCode: number
  message: string
  error?: string
}

// Form states
export interface ProjectFormState {
  isLoading: boolean
  error: string | null
  success: boolean
}

export interface ApplicationFormState {
  isLoading: boolean
  error: string | null
  success: boolean
  applicationId?: string
}
