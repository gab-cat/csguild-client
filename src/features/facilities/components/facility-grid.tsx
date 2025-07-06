'use client'

import { motion } from 'framer-motion'
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle, 
  Clock,
  Zap,
  ArrowRight
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import type { Facility } from '../types'

interface FacilityGridProps {
  facilities: Facility[]
  selectedFacility: Facility | null
  onFacilitySelect: (facility: Facility) => void
  isLoading?: boolean
}

export function FacilityGrid({ 
  facilities, 
  selectedFacility, 
  onFacilitySelect, 
  isLoading = false 
}: FacilityGridProps) {
  const getOccupancyStatus = (facility: Facility) => {
    const percentage = (facility.currentOccupancy / facility.capacity) * 100
    
    if (percentage === 0) return { label: 'Empty', variant: 'secondary' as const, color: 'text-gray-400' }
    if (percentage >= 100) return { label: 'Full', variant: 'destructive' as const, color: 'text-red-400' }
    if (percentage >= 80) return { label: 'Busy', variant: 'secondary' as const, color: 'text-orange-400' }
    return { label: 'Available', variant: 'default' as const, color: 'text-green-400' }
  }

  const getOccupancyColor = (facility: Facility) => {
    const percentage = (facility.currentOccupancy / facility.capacity) * 100
    
    if (percentage === 0) return 'bg-gray-500'
    if (percentage >= 100) return 'bg-red-500'
    if (percentage >= 80) return 'bg-orange-500'
    return 'bg-gradient-to-r from-green-500 to-emerald-500'
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-pink-500/20 rounded animate-pulse" />
                    <div className="h-3 bg-violet-500/20 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 bg-pink-500/20 rounded animate-pulse" />
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-violet-500/20 rounded animate-pulse w-20" />
                  <div className="h-6 bg-pink-500/20 rounded animate-pulse w-16" />
                </div>
                <div className="h-2 bg-gray-500/20 rounded animate-pulse" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Available Facilities</h2>
            <div className="flex items-center gap-2 mt-1">
              <Zap className="h-3 w-3 text-pink-400" />
              <span className="font-jetbrains text-xs text-pink-400">
                {"// Click to select a facility"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Updates every 30s</span>
        </div>
      </motion.div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility, index) => {
          const isSelected = selectedFacility?.id === facility.id
          const status = getOccupancyStatus(facility)
          
          return (
            <motion.div
              key={facility.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`
                  cursor-pointer transition-all duration-300 group backdrop-blur-sm
                  ${isSelected 
              ? 'bg-gradient-to-br from-pink-900/40 to-violet-900/40 border-pink-400/60 shadow-lg shadow-pink-500/20' 
              : 'bg-gradient-to-br from-pink-900/20 to-violet-900/20 border-pink-500/30 hover:from-pink-900/30 hover:to-violet-900/30 hover:border-pink-400/50'
            }
                `}
                onClick={() => onFacilitySelect(facility)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        className={`
                          w-10 h-10 rounded-lg flex items-center justify-center shadow-lg
                          ${isSelected 
              ? 'bg-gradient-to-br from-pink-500 to-violet-500' 
              : 'bg-gradient-to-br from-pink-500/60 to-violet-500/60 group-hover:from-pink-500 group-hover:to-violet-500'
            }
                        `}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Building2 className="h-5 w-5 text-white" />
                      </motion.div>
                      
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white group-hover:text-pink-100 transition-colors">
                          {facility.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-pink-400" />
                          <span className="text-xs text-pink-400 font-jetbrains">
                            {facility.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      </motion.div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors line-clamp-2">
                    {facility.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-pink-400" />
                      <span className="text-sm font-medium text-white">
                        {facility.currentOccupancy}/{facility.capacity}
                      </span>
                    </div>
                    
                    <Badge 
                      variant={status.variant}
                      className={`
                        ${status.color} font-jetbrains text-xs
                        ${isSelected ? 'bg-green-500/20 text-green-300 border-green-500/30' : ''}
                      `}
                    >
                      {isSelected ? 'Selected' : status.label}
                    </Badge>
                  </div>
                  
                  {/* Occupancy Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className={`h-2 rounded-full ${getOccupancyColor(facility)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(facility.currentOccupancy / facility.capacity) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">
                        {Math.round((facility.currentOccupancy / facility.capacity) * 100)}% occupied
                      </span>
                      <span className="text-gray-400">
                        {facility.capacity - facility.currentOccupancy} available
                      </span>
                    </div>
                  </div>
                  
                  {/* Select Button */}
                  <motion.div
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300
                      ${isSelected 
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300' 
              : 'bg-gradient-to-r from-pink-500/10 to-violet-500/10 border-pink-500/20 text-pink-400 group-hover:from-pink-500/20 group-hover:to-violet-500/20 group-hover:border-pink-400/30'
            }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium text-sm">Selected</span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-sm">Select Facility</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
} 