'use client'

import { useQuery } from '@tanstack/react-query'

import { facilitiesApi } from '../utils/facilities-api'

// Query keys
export const facilitiesQueryKeys = {
  all: ['facilities'] as const,
  lists: () => [...facilitiesQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => 
    [...facilitiesQueryKeys.lists(), { filters }] as const,
  details: () => [...facilitiesQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...facilitiesQueryKeys.details(), id] as const,
  activeSessions: (facilityId: string) => 
    [...facilitiesQueryKeys.all, 'activeSessions', facilityId] as const,
  usageHistory: (facilityId: string, page: number, limit: number) => 
    [...facilitiesQueryKeys.all, 'usageHistory', facilityId, page, limit] as const,
}

// Get all facilities
export function useFacilities() {
  return useQuery({
    queryKey: facilitiesQueryKeys.lists(),
    queryFn: facilitiesApi.getFacilities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time occupancy
  })
}

// Get facility by ID
export function useFacility(id: string) {
  return useQuery({
    queryKey: facilitiesQueryKeys.detail(id),
    queryFn: () => facilitiesApi.getFacilityById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time occupancy
  })
}

// Get active sessions for a facility (requires authentication)
export function useActiveSessions(facilityId: string) {
  return useQuery({
    queryKey: facilitiesQueryKeys.activeSessions(facilityId),
    queryFn: () => facilitiesApi.getActiveSessions(facilityId),
    enabled: !!facilityId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for real-time data
  })
}

// Get facility usage history (requires authentication)
export function useUsageHistory(
  facilityId: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: facilitiesQueryKeys.usageHistory(facilityId, page, limit),
    queryFn: () => facilitiesApi.getUsageHistory(facilityId, page, limit),
    enabled: !!facilityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
} 