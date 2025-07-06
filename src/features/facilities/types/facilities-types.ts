// Facility types based on API documentation

export interface Facility {
  id: string
  name: string
  description: string
  location: string
  capacity: number
  currentOccupancy: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FacilityStudent {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  imageUrl?: string
  course: string
}

export interface FacilitySession {
  id: string
  timeIn: string
  timeOut: string | null
  isActive: boolean
  durationMinutes: number | null
}

export interface FacilityUsage {
  id: string
  student: FacilityStudent
  facility: Pick<Facility, 'id' | 'name' | 'location'>
  timeIn: string
  timeOut: string | null
  isActive: boolean
  durationMinutes: number | null
}

// Request types
export interface FacilityToggleRequest {
  rfidId: string
  facilityId: string
}

export interface FacilityStatusRequest {
  rfidId: string
  facilityId: string
}

// Response types
export interface FacilityToggleResponse {
  message: string
  statusCode: number
  action: 'time-in' | 'time-out'
  details: string
  student: FacilityStudent
  facility: Pick<Facility, 'id' | 'name' | 'location'>
  session: FacilitySession
}

export interface FacilityStatusResponse {
  message: string
  statusCode: number
  isCurrentlyInFacility: boolean
  currentSession: FacilityUsage | null
}

export interface FacilityUsageHistoryResponse {
  data: FacilityUsage[]
  total: number
  page: number
  limit: number
}

// API Error types
export interface FacilityApiError {
  statusCode: number
  message: string
  error: string
} 