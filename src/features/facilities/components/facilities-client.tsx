'use client'

import { useMutation } from 'convex/react'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  RfidScanner,
  FacilityQrScanner,
  FacilityGrid,
  PageHeader
} from '@/features/facilities'
import type { Facility, FacilityToggleResponse } from '@/features/facilities/types'
import { api, Id } from '@/lib/convex'
import { showErrorToast, showSuccessToast } from '@/lib/toast'

export function FacilitiesClient() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [lastScanResult, setLastScanResult] = useState<FacilityToggleResponse | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [scanMode] = useState<'rfid' | 'qr'>('rfid')
  const [lastScannedRfid, setLastScannedRfid] = useState<string | null>(null)

  const facilitiesData = useQuery(api.facilities.getFacilities, {})
  const toggleMutation = useMutation(api.facilities.toggleFacilityAccess)

  // Transform Convex data to match expected Facility type
  const facilities = facilitiesData?.map(facility => ({
    ...facility,
    currentOccupancy: facility.occupancy.current,
    description: facility.description || '',
    location: facility.location || '',
    isActive: facility.isActive ?? true,
    createdAt: new Date(facility.createdAt || Date.now()).toISOString(),
    updatedAt: new Date(facility.updatedAt || Date.now()).toISOString(),
  })) || []

  // Loading and error states
  const isLoading = facilitiesData === undefined
  const error = null // Convex handles errors differently, will be handled in mutation

  // Handle RFID scan
  const handleRfidScan = async (rfidId: string) => {
    if (!selectedFacility) return
    setIsReading(true)
    // Clear previous successful state to avoid showing stale success on errors
    setLastScanResult(null)
    setLastScannedRfid(rfidId)

    try {
      const result = await toggleMutation({
        rfidId,
        facilityId: selectedFacility.id as Id<"facilities"> // Type assertion for Convex compatibility
      })

      console.log('Result:', result.user)

      // Convert Convex response to expected format
      const scanResult: FacilityToggleResponse = {
        message: result.message,
        statusCode: result.success ? 200 : 400,
        action: (result.action === 'checkin' ? 'time-in' : 'time-out'),
        details: result.message,
        student: {
          id: result.user.id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          username: result.user.username,
          email: result.user.email || '',
          course: result.user.course || '', 
          imageUrl: result.user.imageUrl || ''
        },
        facility: result.facility,
        session: {
          id: result.sessionId,
          timeIn: new Date((result.sessionTimeIn ?? result.timestamp)).toISOString(),
          timeOut: (result.sessionTimeOut != null) ? new Date(result.sessionTimeOut).toISOString() : null,
          isActive: result.action === 'checkin',
          durationMinutes: typeof result.durationMinutes === 'number' ? result.durationMinutes : null,
        }
      }

      setLastScanResult(scanResult)
      showSuccessToast(result.message)
    } catch (error: unknown) {
      console.error('RFID toggle error:', error)
      // Show a generic error message regardless of server error details
      showErrorToast('The user does not exist, or your connection is unstable. Please try again later.')
      // Re-throw so child components (e.g., input form) can reflect failure UI
      throw error
    } finally {
      setTimeout(() => {
        setIsReading(false)
        // Reset QR status text after a short delay so the card returns to normal color
        setLastScannedRfid(null)
      }, 1000)
    }
  }

  // Handle facility selection
  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <PageHeader />
        <main className="flex-1">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-50 z-50 rounded-2xl" />
          <div className="container mx-auto px-6 py-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 text-red-400 mb-4">
                    <XCircle className="h-6 w-6" />
                    <h2 className="text-xl font-bold">Failed to Load Facilities</h2>
                  </div>
                  <div className="text-sm text-red-400 font-space-mono">
                    Please try refreshing the page or contact support if the issue persists.
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="relative z-10 container mx-auto px-6 py-8 space-y-8">
      {/* Page Header */}
      <PageHeader />
      {/* Scanner (QR camera view can be shown in addition to RFID input/session) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {scanMode === 'qr' && (
          <div className="mb-6">
            <FacilityQrScanner
              onScan={handleRfidScan}
              isScanning={isReading}
              lastScannedRfid={lastScannedRfid}
              disabled={!selectedFacility}
              errorMessage={!selectedFacility ? 'Select a facility to start scanning' : null}
            />
          </div>
        )}
        <RfidScanner
          facilities={facilities || []}
          setSelectedFacility={handleFacilitySelect}
          selectedFacility={selectedFacility}
          onScan={handleRfidScan}
          isProcessing={isReading}
          lastScanResult={lastScanResult}
        />
      </motion.div>

      {/* Facilities Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <FacilityGrid
          facilities={facilities || []}
          selectedFacility={selectedFacility}
          onFacilitySelect={handleFacilitySelect}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Status Footer */}
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400 font-space-mono">
            {"// System status: Online • Real-time data sync active"}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
