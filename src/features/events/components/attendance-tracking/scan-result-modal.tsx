'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, User, Clock, Award, Calendar } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ScanResultModalProps {
  isOpen: boolean
  onClose: () => void
  scanResult: {
    success: boolean
    rfidId: string
    timestamp: string
    userInfo?: {
      name: string
      username: string
      email: string
      imageUrl?: string
    }
    attendanceInfo?: {
      action: 'check-in' | 'check-out'
      totalDuration: number
      sessionCount: number
      isEligible: boolean
    }
    errorMessage?: string
  } | null
}

export function ScanResultModal({ isOpen, onClose, scanResult }: ScanResultModalProps) {
  // Auto-close after 3 seconds
  useEffect(() => {
    if (isOpen && scanResult) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, scanResult, onClose])

  if (!scanResult) return null

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className={cn(
              "w-full max-w-md mx-4 shadow-2xl border-2",
              scanResult.success 
                ? "bg-green-900/50 border-green-500/50" 
                : "bg-red-900/50 border-red-500/50"
            )}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  {/* Status Icon */}
                  <motion.div 
                    className="flex justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.2 
                    }}
                  >
                    {scanResult.success ? (
                      <CheckCircle className="h-16 w-16 text-green-400" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-400" />
                    )}
                  </motion.div>

                  {/* Status Message */}
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white">
                      {scanResult.success ? 'Scan Successful!' : 'Scan Failed'}
                    </h3>
                    
                    {scanResult.success ? (
                      <p className="text-green-300">
                        {scanResult.attendanceInfo?.action === 'check-in' ? 'User checked in' : 'User checked out'}
                      </p>
                    ) : (
                      <p className="text-red-300">
                        {scanResult.errorMessage || 'Unable to process scan'}
                      </p>
                    )}
                  </motion.div>

                  {/* RFID Info */}
                  <motion.div 
                    className="bg-gray-800/50 rounded-lg p-4 space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">RFID ID</span>
                      <span className="font-mono text-sm text-white">{scanResult.rfidId}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Time</span>
                      <span className="text-sm text-white">{formatTime(scanResult.timestamp)}</span>
                    </div>
                  </motion.div>

                  {/* User Info - Only show on success */}
                  {scanResult.success && scanResult.userInfo && (
                    <motion.div 
                      className="bg-gray-800/30 rounded-lg p-4 space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <div className="flex items-center gap-3">
                        {scanResult.userInfo.imageUrl ? (
                          <Image
                            src={scanResult.userInfo.imageUrl} 
                            alt={scanResult.userInfo.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        
                        <div className="text-left">
                          <h4 className="font-medium text-white">{scanResult.userInfo.name}</h4>
                          <p className="text-sm text-gray-400">@{scanResult.userInfo.username}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Attendance Stats - Only show on success */}
                  {scanResult.success && scanResult.attendanceInfo && (
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-blue-400" />
                          <span className="text-xs text-gray-400">Total Time</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {formatDuration(scanResult.attendanceInfo.totalDuration)}
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/30 rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-xs text-gray-400">Sessions</span>
                        </div>
                        <div className="text-lg font-semibold text-white">
                          {scanResult.attendanceInfo.sessionCount}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Eligibility Status - Only show on success */}
                  {scanResult.success && scanResult.attendanceInfo && (
                    <motion.div 
                      className={cn(
                        "flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                        scanResult.attendanceInfo.isEligible 
                          ? "bg-green-500/20 text-green-300" 
                          : "bg-orange-500/20 text-orange-300"
                      )}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: 0.7 }}
                    >
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {scanResult.attendanceInfo.isEligible ? 'Eligible for Certificate' : 'Not Eligible Yet'}
                      </span>
                    </motion.div>
                  )}

                  {/* Auto-close indicator */}
                  <motion.div 
                    className="flex items-center justify-center gap-2 text-xs text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.8 }}
                  >
                    <motion.div 
                      className="w-2 h-2 bg-gray-500 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span>Closing automatically...</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
