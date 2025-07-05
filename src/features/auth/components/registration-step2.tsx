'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CreditCard, ArrowLeft, ArrowRight, Loader2, Wifi, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
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

  // Simulate RFID scanning
  const handleStartScanning = () => {
    setIsScanning(true)
    setScanSuccess(false)
    
    // Simulate scanning delay
    setTimeout(() => {
      // Generate a mock RFID ID for demo purposes
      const mockRfidId = `RF${Date.now().toString().slice(-8)}`
      setValue('rfidId', mockRfidId)
      setIsScanning(false)
      setScanSuccess(true)
      
      // Auto-hide success message after 2 seconds
      setTimeout(() => setScanSuccess(false), 2000)
    }, 2000)
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
                  : 'border-gray-500 bg-gray-500/5'
            }`}
          >
            {isScanning ? (
              <div className="text-center">
                <Wifi className="h-8 w-8 text-pink-400 mx-auto mb-2 animate-bounce" />
                <p className="text-sm text-pink-400 font-medium">Scanning...</p>
              </div>
            ) : scanSuccess ? (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm text-green-400 font-medium">Scan Complete!</p>
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
          <p>Place your student RFID card or ID on the scanner area above</p>
          <p className="text-sm text-gray-400">This will link your account to your student ID for easy access</p>
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
              <span>Scanning...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Start Scanning</span>
            </div>
          )}
        </Button>
      </div>

      {/* Manual RFID Input */}
      <div className="space-y-2">
        <label htmlFor="rfidId" className="block text-sm font-medium text-gray-200">
          Or enter RFID manually
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CreditCard className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('rfidId')}
            type="text"
            id="rfidId"
            placeholder="RF001234567"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
          />
        </div>
        {errors.rfidId && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-jetbrains"
          >
            {"// " + errors.rfidId.message}
          </motion.p>
        )}
      </div>

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
            <span className="font-jetbrains">{watchedRfidId}</span>
          </div>
        </motion.div>
      )}

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <div className="text-sm text-blue-300">
          <div className="font-jetbrains mb-2">{"// Why do we need your RFID?"}</div>
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