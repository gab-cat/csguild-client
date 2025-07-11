import { configuration } from '@/lib/api'
import { FacilitiesApi, FacilitiesControllerGetFacilityUsageHistory200Response, FacilityResponseDto, FacilityToggleDto, FacilityToggleResponseDto, FacilityUsageResponseDto, FacilityUsageStatusDto, FacilityUsageStatusResponseDto } from '@generated/api-client'


const facilities = new FacilitiesApi(configuration)

export const facilitiesApi = {
  // Get all active facilities
  getFacilities: async (): Promise<FacilityResponseDto[]> => {
    const response = await facilities.facilitiesControllerGetFacilities()
    return response.data
  },

  // Get facility by ID
  getFacilityById: async (id: string): Promise<FacilityResponseDto> => {
    const response = await facilities.facilitiesControllerGetFacility({
      id: id
    })
    return response.data
  },

  // Toggle facility access (time in/out)
  toggleFacilityAccess: async (data: FacilityToggleDto): Promise<FacilityToggleResponseDto> => {
    const response = await facilities.facilitiesControllerToggleFacilityAccess({
      facilityToggleDto: data
    })
    return response.data
  },

  // Check facility usage status
  checkFacilityStatus: async (data: FacilityUsageStatusDto): Promise<FacilityUsageStatusResponseDto> => {
    const response = await facilities.facilitiesControllerGetUsageStatus({
      facilityUsageStatusDto: data
    })
    return response.data
  },

  // Get active sessions for a facility (requires authentication)
  getActiveSessions: async (facilityId: string): Promise<FacilityUsageResponseDto[]> => {
    const response = await facilities.facilitiesControllerGetActiveSessions({
      id: facilityId
    })
    return response.data
  },

  // Get facility usage history (requires authentication)
  getUsageHistory: async (
    facilityId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<FacilitiesControllerGetFacilityUsageHistory200Response> => {
    const response = await facilities.facilitiesControllerGetFacilityUsageHistory({
      id: facilityId,
      page: page,
      limit: limit
    })
    return response.data
  },
} 