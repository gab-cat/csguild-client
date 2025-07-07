'use client'

import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { 
  useFacilities, 
  useFacilityToggle,
  RfidScanner,
  FacilityGrid,
  type Facility,
  type FacilityToggleResponse,
  PageHeader
} from '@/features/facilities'

export function FacilitiesClient() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
  const [lastScanResult, setLastScanResult] = useState<FacilityToggleResponse | null>(null)
  const [isReading, setIsReading] = useState(false)

  // API hooks
  const { data: facilities, isLoading, error } = useFacilities()
  const toggleMutation = useFacilityToggle()

  // Handle RFID scan
  const handleRfidScan = async (rfidId: string) => {
    if (!selectedFacility) return
    setIsReading(true)

    try {
      const result = await toggleMutation.mutateAsync({
        rfidId,
        facilityId: selectedFacility.id
      })
      setLastScanResult(result)
    } catch (error) {
      console.error('RFID toggle error:', error)
    } finally {
      setTimeout(() => {
        setIsReading(false)
      }, 2000)
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
                  <p className="text-red-300 mb-4">
                    {error instanceof Error ? error.message : 'An unexpected error occurred while loading facilities.'}
                  </p>
                  <div className="text-sm text-red-400 font-space-mono">
                    {"// Please try refreshing the page or contact support if the issue persists"}
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
      {/* RFID Scanner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
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
