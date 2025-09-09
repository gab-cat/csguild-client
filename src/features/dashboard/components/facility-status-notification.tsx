'use client'

import { motion } from 'framer-motion'
import { Building2, Users, Clock } from 'lucide-react'

interface FacilityStatusNotificationProps {
  facility: {
    id: string
    name: string
    description?: string
    location?: string
  } | null
  isOpen: boolean
  activeSessionsCount: number
}

export function FacilityStatusNotification({
  facility,
  isOpen,
  activeSessionsCount,
}: FacilityStatusNotificationProps) {
  if (!facility || !isOpen) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative"
    >
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-400" />
            </div>
            {/* Pulsing indicator */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-green-400 text-sm truncate">
                {facility.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-green-300">
                <Clock className="w-3 h-3" />
                <span>Open Now</span>
              </div>
            </div>

            {facility.description && (
              <p className="text-xs text-gray-300 truncate mb-2">
                {facility.description}
              </p>
            )}

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-green-300">
                <Users className="w-3 h-3" />
                <span>{activeSessionsCount} active session{activeSessionsCount !== 1 ? 's' : ''}</span>
              </div>

              {facility.location && (
                <span className="text-xs text-gray-400">
                  {facility.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg blur-sm -z-10" />
      </div>
    </motion.div>
  )
}
