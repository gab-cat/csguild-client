'use client'

import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { CalendarView, FacilityStatusNotification } from '@/features/dashboard'
import { useFacilityStatus } from '@/features/dashboard/hooks/use-facility-status'

export default function DashboardPage() {
  const { user } = useCurrentUser()
  const { facility, isOpen, activeSessionsCount } = useFacilityStatus()

  const firstName = user?.firstName || 'User'

  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-8 py-6 max-w-full">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <motion.h1
                className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-white">Welcome back,</span> {firstName}!
              </motion.h1>
              <motion.p
                className="text-gray-300 text-sm flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Calendar className="w-4 h-4 text-pink-400" />
                Your calendar dashboard - manage your schedule and events
              </motion.p>
            </div>

            {/* Facility Status Notification */}
            <div className="flex-shrink-0">
              <FacilityStatusNotification
                facility={facility}
                isOpen={isOpen}
                activeSessionsCount={activeSessionsCount}
              />
            </div>
          </div>
        </motion.div>

        {/* Full Page Calendar */}
        <motion.div 
          className="h-[calc(100vh-180px)] min-h-[600px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CalendarView />
        </motion.div>
      </div>
    </div>
  )
}