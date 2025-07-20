'use client'

import { motion } from 'framer-motion'
import { ScanLine, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RfidScannerProps {
  onScan: (rfidId: string) => void
  isScanning: boolean
  lastScannedRfid: string | null
  disabled?: boolean
}

export function RfidScanner({ 
  onScan, 
  isScanning, 
  lastScannedRfid, 
  disabled = false 
}: RfidScannerProps) {
  const [scanBuffer, setScanBuffer] = useState('')
  const [isReady, setIsReady] = useState(false)
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scannerRef = useRef<HTMLDivElement>(null)

  // Handle RFID card scanning
  useEffect(() => {
    if (disabled) return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Only process if scanner is focused or in scanner area
      if (isScanning) return

      // Check if we're in an input field (exclude our scanner)
      const activeElement = document.activeElement
      if (activeElement && 
          activeElement.tagName === 'INPUT' && 
          activeElement.id !== 'rfid-scanner-input') {
        return
      }

      // RFID cards typically send data followed by Enter
      if (e.key === 'Enter' && scanBuffer.trim()) {
        e.preventDefault()
        onScan(scanBuffer.trim())
        setScanBuffer('')
      } else if (e.key.length === 1) {
        // Accumulate characters
        setScanBuffer(prev => prev + e.key)
        
        // Clear buffer after timeout (in case it's manual typing)
        if (scanTimeoutRef.current) {
          clearTimeout(scanTimeoutRef.current)
        }
        scanTimeoutRef.current = setTimeout(() => {
          setScanBuffer('')
        }, 1000)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    setIsReady(true)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current)
      }
    }
  }, [scanBuffer, onScan, isScanning, disabled])

  const handleManualScan = () => {
    if (scanBuffer.trim()) {
      onScan(scanBuffer.trim())
      setScanBuffer('')
    }
  }

  return (
    <motion.div 
      ref={scannerRef}
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200",
        !disabled && isReady && "border-blue-500/50 bg-blue-500/5 hover:border-blue-500/70",
        disabled && "border-gray-700 bg-gray-800/30 opacity-50",
        isScanning && "border-green-500/50 bg-green-500/5 animate-pulse"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scanner Icon */}
      <motion.div 
        className="flex justify-center mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {isScanning ? (
          <div className="relative">
            <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="h-2 w-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>
        ) : lastScannedRfid ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="h-12 w-12 text-green-500" />
          </motion.div>
        ) : disabled ? (
          <AlertCircle className="h-12 w-12 text-gray-500" />
        ) : (
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ScanLine className="h-12 w-12 text-blue-500" />
          </motion.div>
        )}
      </motion.div>

      {/* Scanner Status */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="font-medium text-white">
          {isScanning ? 'Processing...' : 
            lastScannedRfid ? 'Scan Complete' :
              disabled ? 'Scanner Disabled' : 'Ready to Scan'}
        </h3>
        
        <p className="text-sm text-gray-400">
          {isScanning ? 'Updating attendance record...' :
            lastScannedRfid ? `Processed RFID: ${lastScannedRfid}` :
              disabled ? 'Scanning is not available for this event' :
                'Tap an RFID card or enter manually below'}
        </p>
      </motion.div>

      {/* Current Buffer Display */}
      {scanBuffer && !disabled && (
        <motion.div 
          className="mt-4 p-3 bg-gray-800/50 rounded-lg"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-gray-300">
            Reading: <span className="font-mono text-blue-400">{scanBuffer}</span>
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              onClick={handleManualScan}
              className="mt-2"
              disabled={isScanning}
            >
              Process Scan
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* Scanner Instructions */}
      {!disabled && !isScanning && (
        <motion.div 
          className="mt-6 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <p>Hold an RFID card near the scanner or</p>
          <p>type the RFID ID manually below</p>
        </motion.div>
      )}

      {/* Hidden input for focus */}
      <input
        id="rfid-scanner-input"
        type="text"
        className="absolute -top-10 left-0 w-1 h-1 opacity-0 pointer-events-none"
        value={scanBuffer}
        onChange={() => {}} // Controlled by keydown event
        autoFocus={!disabled}
        tabIndex={disabled ? -1 : 0}
      />
    </motion.div>
  )
}
