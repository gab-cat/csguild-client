'use client'

import { motion } from 'framer-motion'
import { 
  Scan, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  User,
  Building2,
  Clock,
  LogIn,
  LogOut,
  Timer
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import type { Facility, FacilityToggleResponse } from '../types'

interface RfidScannerProps {
  facilities: Facility[]
  setSelectedFacility: (facility: Facility) => void
  selectedFacility: Facility | null
  onScan: (rfidId: string) => Promise<void>
  isProcessing: boolean
  lastScanResult: FacilityToggleResponse | null
}

export function RfidScanner({ facilities, setSelectedFacility, selectedFacility, onScan, isProcessing, lastScanResult }: RfidScannerProps) {
  const [rfidInput, setRfidInput] = useState('')
  const rfidInputRef = useRef<HTMLInputElement>(null)

  // Auto-focus functionality
  useEffect(() => {
    const focusInput = () => {
      if (rfidInputRef.current && !isProcessing) {
        rfidInputRef.current.focus()
      }

      if (facilities.length > 0 && !selectedFacility) {
        setSelectedFacility(facilities[0])
      }
    }

    // Focus on mount
    focusInput()

    // Re-focus periodically to ensure it stays focused
    const interval = setInterval(focusInput, 1000)

    return () => clearInterval(interval)
  }, [facilities, isProcessing, selectedFacility, setSelectedFacility])

  // Handle RFID scan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!rfidInput.trim() || !selectedFacility || isProcessing) return
    
    try {
      await onScan(rfidInput.trim())
      setRfidInput('')
    } catch (error) {
      console.error('RFID scan error:', error)
    } finally {
      // Re-focus input after scan
      setTimeout(() => {
        if (rfidInputRef.current) {
          rfidInputRef.current.focus()
        }
      }, 100)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (durationMinutes: number | null) => {
    if (!durationMinutes) return null
    const hours = Math.floor(durationMinutes / 60)
    const minutes = durationMinutes % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Scanner Input */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
                <Scan className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">RFID Scanner</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <Input
                  ref={rfidInputRef}
                  value={rfidInput}
                  onChange={(e) => setRfidInput(e.target.value)}
                  placeholder="Scan your RFID card..."
                  className="h-12 text-base font-jetbrains bg-black/30 border-pink-500/30 focus:border-pink-400 focus:ring-pink-400/20 text-white placeholder:text-gray-400 pr-12"
                  disabled={isProcessing || !selectedFacility}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isProcessing ? (
                    <Loader2 className="h-4 w-4 animate-spin text-pink-400" />
                  ) : (
                    <Scan className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </form>

            {/* Status */}
            {selectedFacility ? (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <div className="text-sm">
                  <p className="text-green-300 font-medium">{selectedFacility.name}</p>
                  <p className="text-green-400 text-xs">{selectedFacility.location}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <AlertCircle className="h-4 w-4 text-orange-400" />
                <p className="text-sm text-orange-300">Select a facility to scan</p>
              </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>1. Select a facility below</p>
              <p>2. Tap your RFID card</p>
              <p>3. System will time you in/out</p>
            </div>

            {/* Processing State */}
            {isProcessing && (
              <div className="text-center p-3 rounded-lg bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30">
                <div className="flex items-center justify-center gap-2 text-pink-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Right Side - Session Data */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Session Data</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {lastScanResult ? (
              <div className="space-y-4">
                {/* Action Status */}
                <div className={`flex items-center gap-2 p-3 rounded-lg ${
                  lastScanResult.action === 'time-in' 
                    ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20' 
                    : 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20'
                }`}>
                  {lastScanResult.action === 'time-in' ? (
                    <LogIn className="h-5 w-5 text-green-400" />
                  ) : (
                    <LogOut className="h-5 w-5 text-blue-400" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${
                      lastScanResult.action === 'time-in' ? 'text-green-300' : 'text-blue-300'
                    }`}>
                      {lastScanResult.action === 'time-in' ? 'Timed In' : 'Timed Out'}
                    </p>
                    <p className="text-xs text-gray-400">{lastScanResult.details}</p>
                  </div>
                </div>

                {/* Student Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-pink-500/20">
                  <Avatar className="h-10 w-10 border-2 border-pink-500/30">
                    <AvatarImage src={lastScanResult.student.imageUrl} alt={lastScanResult.student.firstName} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white text-sm">
                      {getUserInitials(lastScanResult.student.firstName, lastScanResult.student.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {lastScanResult.student.firstName} {lastScanResult.student.lastName}
                    </p>
                    <p className="text-xs text-pink-400">{lastScanResult.student.course}</p>
                    <p className="text-xs text-gray-400">{lastScanResult.student.email}</p>
                  </div>
                </div>

                {/* Facility Info */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-black/30 border border-violet-500/20">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{lastScanResult.facility.name}</p>
                    <p className="text-xs text-violet-400">{lastScanResult.facility.location}</p>
                  </div>
                </div>

                {/* Time Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded bg-black/30">
                    <Clock className="h-4 w-4 text-green-400" />
                    <div className="text-sm">
                      <span className="text-gray-400">Time In:</span>
                      <span className="text-white ml-2">{formatTime(lastScanResult.session.timeIn)}</span>
                    </div>
                  </div>
                  
                  {lastScanResult.session.timeOut && (
                    <div className="flex items-center gap-2 p-2 rounded bg-black/30">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <div className="text-sm">
                        <span className="text-gray-400">Time Out:</span>
                        <span className="text-white ml-2">{formatTime(lastScanResult.session.timeOut)}</span>
                      </div>
                    </div>
                  )}
                  
                  {lastScanResult.session.durationMinutes ? (
                    <div className="flex items-center gap-2 p-2 rounded bg-black/30">
                      <Timer className="h-4 w-4 text-purple-400" />
                      <div className="text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">{formatDuration(lastScanResult.session.durationMinutes)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded bg-black/30">
                      <Timer className="h-4 w-4 text-purple-400" />
                      <div className="text-sm">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">0m</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No recent scan data</p>
                <p className="text-xs mt-1">Scan an RFID card to see session information</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 