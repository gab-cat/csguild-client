import { api } from '@/lib/api'

import type {
  Facility,
  FacilityToggleRequest,
  FacilityToggleResponse,
  FacilityStatusRequest,
  FacilityStatusResponse,
  FacilityUsage,
  FacilityUsageHistoryResponse
} from '../types'

// API endpoints
const FACILITIES_ENDPOINT = '/api/facilities'

export const facilitiesApi = {
  // Get all active facilities
  getFacilities: async (): Promise<Facility[]> => {
    return api.get<Facility[]>(FACILITIES_ENDPOINT)
  },

  // Get facility by ID
  getFacilityById: async (id: string): Promise<Facility> => {
    return api.get<Facility>(`${FACILITIES_ENDPOINT}/${id}`)
  },

  // Toggle facility access (time in/out)
  toggleFacilityAccess: async (data: FacilityToggleRequest): Promise<FacilityToggleResponse> => {
    return api.post<FacilityToggleResponse>(`${FACILITIES_ENDPOINT}/toggle`, data)
  },

  // Check facility usage status
  checkFacilityStatus: async (data: FacilityStatusRequest): Promise<FacilityStatusResponse> => {
    return api.post<FacilityStatusResponse>(`${FACILITIES_ENDPOINT}/status`, data)
  },

  // Get active sessions for a facility (requires authentication)
  getActiveSessions: async (facilityId: string): Promise<FacilityUsage[]> => {
    return api.get<FacilityUsage[]>(`${FACILITIES_ENDPOINT}/${facilityId}/active-sessions`)
  },

  // Get facility usage history (requires authentication)
  getUsageHistory: async (
    facilityId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<FacilityUsageHistoryResponse> => {
    return api.get<FacilityUsageHistoryResponse>(
      `${FACILITIES_ENDPOINT}/${facilityId}/usage-history?page=${page}&limit=${limit}`
    )
  },
} 