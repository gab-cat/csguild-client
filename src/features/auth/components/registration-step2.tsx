'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft, ArrowRight, Loader2, Wifi, CheckCircle, AlertCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { registrationStep2Schema, type RegistrationStep2Data } from '../schemas'

interface RegistrationStep2Props {
  onNext: (data: RegistrationStep2Data) => void
  onBack: () => void
  initialData?: RegistrationStep2Data | null
}

export function RegistrationStep2({ onNext, onBack, initialData }: RegistrationStep2Props) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [scanTimeout, setScanTimeout] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RegistrationStep2Data>({
    resolver: zodResolver(registrationStep2Schema),
    mode: 'onBlur',
    defaultValues: initialData || undefined,
  })

  const watchedRfidId = watch('rfidId')

  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Start RFID scanning
  const handleStartScanning = () => {
    setIsScanning(true)
    setScanSuccess(false)
    setScanTimeout(false)
    
    // Focus on input field when scanning starts
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
    
    // Set 5-second timeout
    timeoutRef.current = setTimeout(() => {
      setIsScanning(false)
      setScanTimeout(true)
      // Auto-hide timeout message after 3 seconds
      setTimeout(() => setScanTimeout(false), 3000)
    }, 5000)
  }

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (watchedRfidId) {
      setScanSuccess(true)
      // Auto-hide success message after 2 seconds
      setTimeout(() => setScanSuccess(false), 2000)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isScanning && watchedRfidId) {
      e.preventDefault()
      stopScanning()
    }
  }

  // Handle input change during scanning
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('rfidId', value)
    
    // If there's a value and we're scanning, we can proceed
    if (value && isScanning) {
      // Optional: Auto-stop scanning after a short delay if user stops typing
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        if (isScanning && value) {
          stopScanning()
        }
      }, 1000) // 1 second delay after last input
    }
  }

  const onSubmit = async (data: RegistrationStep2Data) => {
    onNext(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* RFID Scanner Visual */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          {/* Scanner Area */}
          <div
            className={`w-64 h-40 rounded-xl border-2 border-dashed transition-all duration-300 flex items-center justify-center ${
              isScanning
                ? 'border-pink-400 bg-pink-500/10 animate-pulse'
                : scanSuccess
                  ? 'border-green-400 bg-green-500/10'
                  : scanTimeout
                    ? 'border-red-400 bg-red-500/10'
                    : 'border-gray-500 bg-gray-500/5'
            }`}
          >
            {isScanning ? (
              <div className="text-center">
                <Wifi className="h-8 w-8 text-pink-400 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-pink-400 font-medium">Scanning...</p>
                <p className="text-xs text-pink-300 mt-1">Enter RFID below or press Enter</p>
              </div>
            ) : scanSuccess ? (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-400 font-medium">Scan Complete!</p>
              </div>
            ) : scanTimeout ? (
              <div className="text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-400 font-medium">Scan Timeout</p>
                <p className="text-xs text-red-300 mt-1">Try scanning again</p>
              </div>
            ) : (
              <div className="text-center">
                <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Tap your student ID here</p>
              </div>
            )}
          </div>

          {/* Scanning Animation Rings */}
          {isScanning && (
            <>
              <div className="absolute inset-0 rounded-xl border-2 border-pink-400 animate-ping opacity-20" />
              <div className="absolute inset-2 rounded-lg border-2 border-pink-400 animate-ping opacity-30" style={{ animationDelay: '0.2s' }} />
              <div className="absolute inset-4 rounded-md border-2 border-pink-400 animate-ping opacity-40" style={{ animationDelay: '0.4s' }} />
            </>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold text-white">Connect Your Student ID</h3>
        <div className="space-y-2 text-gray-300">
          <p>Click &quot;Start Scanning&quot; to enable RFID input</p>
          <p className="text-sm text-gray-400">Enter your RFID ID and press Enter to complete the scan</p>
        </div>
      </div>

      {/* Scan Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          onClick={handleStartScanning}
          disabled={isScanning}
          variant="outline"
          className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 transition-all duration-300"
        >
          {isScanning ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Scanning... (5s timeout)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Start Scanning</span>
            </div>
          )}
        </Button>
      </div>

      {/* RFID Input */}
      <div className="space-y-2">
        <label htmlFor="rfidId" className="block text-sm font-medium text-gray-200">
          RFID ID {isScanning && <span className="text-pink-400">(Scanning enabled - Press Enter when done)</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('rfidId')}
            ref={inputRef}
            type="text"
            id="rfidId"
            placeholder={isScanning ? 'Enter RFID and press Enter...' : 'Start scanning to enable input'}
            disabled={!isScanning}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={`pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20 transition-all duration-300 ${
              !isScanning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
        {errors.rfidId && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.rfidId.message}
          </motion.p>
        )}
      </div>

      {/* Scan Timeout Message */}
      {scanTimeout && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Scan timeout - No RFID detected within 5 seconds</span>
          </div>
          <p className="text-sm text-red-300 mt-1">Please try scanning again or enter your RFID manually</p>
        </motion.div>
      )}

      {/* Current RFID Display */}
      {watchedRfidId && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-green-500/10 border border-green-500/20"
        >
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">RFID Connected:</span>
            <span className="font-space-mono">{watchedRfidId}</span>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="text-sm text-blue-300">
          <div className="font-space-mono mb-2">{"// Why do we need your RFID?"}</div>
          <ul className="space-y-1 text-blue-200">
            <li>• Quick login without passwords</li>
            <li>• Access to CS Guild facilities</li>
            <li>• Attendance tracking for events</li>
            <li>• Secure and convenient authentication</li>
          </ul>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 border-gray-500/50 text-gray-300 hover:bg-gray-500/10"
        >
          <div className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </div>
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting || !watchedRfidId}
          className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Continue to Review</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>
      </div>
    </form>
  )
}

export default RegistrationStep2 