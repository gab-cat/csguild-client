'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showSuccessToast, showErrorToast, showInfoToast } from '@/lib/toast'

import type { 
  FacilityToggleRequest, 
  FacilityStatusRequest
} from '../types'
import { facilitiesApi } from '../utils/facilities-api'

import { facilitiesQueryKeys } from './use-facilities-queries'

// Toggle facility access (time in/out)
export function useFacilityToggle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FacilityToggleRequest) => 
      facilitiesApi.toggleFacilityAccess(data),
    onSuccess: (response) => {
      // Invalidate and refetch facilities to update occupancy
      queryClient.invalidateQueries({ queryKey: facilitiesQueryKeys.all })
      
      // Show success message based on action
      if (response.action === 'time-in') {
        showSuccessToast(
          'Time-in successful!',
          `Welcome, ${response.student.firstName}! You've checked in to ${response.facility.name}.`
        )
      } else {
        showInfoToast(
          'Time-out successful!',
          `See you later, ${response.student.firstName}! You've checked out from ${response.facility.name}.`
        )
      }
    },
    onError: (error: Error) => {
      showErrorToast(
        'RFID scan failed',
        error.message || 'Unable to process RFID scan. Please try again or contact support.'
      )
    },
  })
}

// Check facility status
export function useFacilityStatus() {
  return useMutation({
    mutationFn: (data: FacilityStatusRequest) => 
      facilitiesApi.checkFacilityStatus(data),
    onSuccess: (response) => {
      if (response.isCurrentlyInFacility) {
        showInfoToast(
          'Currently checked in',
          `Student is currently in the facility. Session started at ${new Date(response.currentSession?.timeIn || '').toLocaleTimeString()}.`
        )
      } else {
        showInfoToast(
          'Not currently in facility',
          'Student is not currently checked in to this facility.'
        )
      }
    },
    onError: (error: Error) => {
      showErrorToast(
        'Status check failed',
        error.message || 'Unable to check facility status. Please try again.'
      )
    },
  })
} 