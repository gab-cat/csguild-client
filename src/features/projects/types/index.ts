// Project types based on Convex data structures

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

// Project role for form input/creation
export interface ProjectRoleFormData {
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
  roles: ProjectRoleFormData[]
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
export interface ExtendedProjectApplicationDto extends ProjectApplicationDto {
  reviewMessage?: string
  reviewedAt?: string
  project?: {
    id: string
    slug: string
    title: string
    description: string
    status: ProjectStatus
    dueDate?: number
    owner?: User | null
  } | null
  projectRole: {
    id: string
    role: Role | null
  }
  projectMember?: {
    id: string
    status: 'ACTIVE' | 'INACTIVE' | 'REMOVED'
    joinedAt?: number
  }
  reviewer?: User | null
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

// User type from Convex
export interface User {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}

// Application type from Convex
export interface ProjectApplicationDto {
  id: string
  projectSlug: string
  userSlug: string
  roleSlug: string
  message?: string
  status: ApplicationStatus
  appliedAt: number
  reviewedAt?: number
  reviewedBySlug?: string
  reviewMessage?: string
  user: User | null
  role: Role | null
}

// Role type from Convex
export interface Role {
  id: string
  name: string
  slug: string
  description?: string
}

// Project role type from Convex
export interface ProjectRole {
  id?: string
  _id?: string
  projectSlug: string
  roleSlug: string
  maxMembers?: number
  requirements?: string
  role: Role | null
}

// User role type from Convex
export interface UserRole {
  id: string
  name: string
  slug: string
  joinedAt: number
  status: string
}

// Project type from Convex queries
export interface Project {
  id: string
  slug: string
  title: string
  description: string
  tags: string[]
  dueDate: string | number | undefined
  status: ProjectStatus
  createdAt: number | undefined
  updatedAt: number | undefined
  owner: User | null
  roles: ProjectRole[]
  memberCount: number
  applicationCount?: number // For saved projects
  pendingApplicationsCount?: number // For owned/member projects
  savedAt?: number // For saved projects
  isOwner?: boolean // For owned/member projects
  userRole?: UserRole | null // For owned/member projects
}

// Project list response from Convex
export interface ProjectListResponse {
  data: Project[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// Saved projects response from Convex
export interface SavedProjectsResponse extends ProjectListResponse {
  data: (Project & { savedAt: number })[]
}

// Project card data for listing
export type ProjectCardType = Project

// Utility function to check if project has required data for card display
export function isValidProjectCard(project: Project): project is ProjectCardType {
  return !!(
    project.title &&
    project.description &&
    project.owner?.username
  )
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
