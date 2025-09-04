'use client'

import { motion } from 'framer-motion'
import { Users, UserCheck, Clock, TrendingUp } from 'lucide-react'
import React from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
// Using Convex query shape: attendeesData = { data: [...], meta: {...} }

interface AttendanceStatsProps {
  attendeesData: any
  isLoading: boolean
  sessionCountByUserId?: Record<string, number>
  activeUserIds?: Set<string>
}

export function AttendanceStats({ 
  attendeesData, 
  isLoading,
  sessionCountByUserId = {},
  activeUserIds = new Set<string>()
}: AttendanceStatsProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Attendance Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-700" />
                <Skeleton className="h-8 w-12 bg-gray-700" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16 bg-gray-700" />
                <Skeleton className="h-8 w-12 bg-gray-700" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-gray-700" />
                <Skeleton className="h-8 w-12 bg-gray-700" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 bg-gray-700" />
                <Skeleton className="h-8 w-12 bg-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  const attendees = (attendeesData?.data || []).map((a: any) => ({
    userId: a.userId as string,
    totalDuration: Math.round((a.totalDuration || 0) / 60000), // ms -> minutes
  }))
  const totalRegistered = attendees.length
  const checkedIn = attendees.reduce((acc: number, a: any) => acc + ((sessionCountByUserId[a.userId] || 0) > 0 ? 1 : 0), 0)
  const checkedInPercentage = totalRegistered > 0 ? (checkedIn / totalRegistered) * 100 : 0

  // Calculate average attendance time based on total duration
  const avgAttendanceTime = attendees.length > 0 
    ? Math.round(attendees.reduce((sum: number, attendee: any) => sum + (attendee.totalDuration || 0), 0) / attendees.length)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Attendance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Stats */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-400">Registered</span>
              </div>
              <div className="text-2xl font-bold text-white">{totalRegistered}</div>
            </div>
            
            <div className="text-center p-4 bg-gray-800/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <UserCheck className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-400">Checked In</span>
              </div>
              <div className="text-2xl font-bold text-white">{checkedIn}</div>
            </div>
          </motion.div>

          {/* Attendance Rate */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Attendance Rate</span>
              <span className="text-sm font-medium text-white">
                {checkedInPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${checkedInPercentage}%` }}
                transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="text-center p-3 bg-gray-800/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">Ave. Time</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {avgAttendanceTime > 0 ? `${avgAttendanceTime}m` : 'N/A'}
              </div>
            </div>
            
            <div className="text-center p-3 bg-gray-800/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <UserCheck className="h-4 w-4 text-green-400" />
                <span className="text-xs text-gray-400">Present</span>
              </div>
              <div className="text-lg font-semibold text-white">
                {checkedIn > 0 ? `${checkedIn}` : '0'}
              </div>
            </div>
          </motion.div>

          {/* Quick Insights */}
          {totalRegistered > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <h4 className="text-sm font-medium text-gray-300">Quick Insights</h4>
              <div className="text-xs text-gray-400 space-y-1">
                {checkedInPercentage >= 80 && (
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="h-1 w-1 bg-green-400 rounded-full" />
                    Excellent attendance rate
                  </div>
                )}
                {checkedInPercentage >= 60 && checkedInPercentage < 80 && (
                  <div className="flex items-center gap-2 text-yellow-400">
                    <div className="h-1 w-1 bg-yellow-400 rounded-full" />
                    Good attendance rate
                  </div>
                )}
                {checkedInPercentage < 60 && checkedInPercentage > 0 && (
                  <div className="flex items-center gap-2 text-orange-400">
                    <div className="h-1 w-1 bg-orange-400 rounded-full" />
                    Room for improvement
                  </div>
                )}
                {checkedIn === 0 && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="h-1 w-1 bg-gray-400 rounded-full" />
                    No check-ins yet
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
