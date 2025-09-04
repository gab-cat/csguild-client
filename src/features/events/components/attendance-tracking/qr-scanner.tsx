'use client'

import { Scanner } from '@yudiel/react-qr-scanner'
import { motion } from 'framer-motion'
import { QrCode, CameraOff, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import React, { useCallback, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QrScannerProps {
  onScan: (rfidId: string) => void
  isScanning: boolean
  lastScannedRfid: string | null
  disabled?: boolean
  errorMessage?: string | null
}

export function QrScanner({
  onScan,
  isScanning,
  lastScannedRfid,
  disabled = false,
  errorMessage = null
}: QrScannerProps) {
  const [error, setError] = useState<string | null>(null)
  const [lastDetectedAt, setLastDetectedAt] = useState<number>(0)

  const canUseCamera = useMemo(
    () => typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    []
  )

  const handleScan = useCallback(
    (results: Array<{ rawValue?: string }> | undefined) => {
      if (disabled || isScanning) return
      if (!results || results.length === 0) return
      const now = Date.now()
      if (now - lastDetectedAt <= 1200) return
      const value = (results[0]?.rawValue || '').trim()
      if (!value) return
      setLastDetectedAt(now)
      onScan(value)
    },
    [disabled, isScanning, lastDetectedAt, onScan]
  )

  const handleError = useCallback((e: unknown) => {
    setError(e instanceof Error ? e.message : 'Camera error')
  }, [])

  return (
    <motion.div
      className={cn(
        'relative rounded-lg overflow-hidden border border-gray-800 bg-gray-900',
        disabled && 'opacity-50 pointer-events-none'
      )}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-video bg-black">
        {/* Camera / Scanner */}
        {canUseCamera ? (
          <Scanner
            key={`${disabled}-${isScanning}`}
            onScan={handleScan}
            onError={handleError}
            sound={true}
            paused={disabled || isScanning}
            scanDelay={350}
            constraints={{ facingMode: 'environment' }}
            classNames={{ container: 'absolute inset-0 h-full w-full', video: 'object-cover h-full w-full' }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
            <CameraOff className="h-10 w-10 text-red-400" />
            <p className="text-sm text-red-300">Camera not available in this browser</p>
          </div>
        )}

        {/* loading overlay when processing a scan */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-green-400" />
            <p className="text-sm text-gray-200">Processing scan…</p>
          </div>
        )}

        {/* camera or domain error overlay */}
        {(error || errorMessage) && !isScanning && (
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <p className="text-sm text-red-300">{error || errorMessage}</p>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          {isScanning ? (
            <Loader2 className="h-4 w-4 text-green-500 animate-spin" />
          ) : lastScannedRfid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <QrCode className="h-4 w-4 text-blue-400" />
          )}
          <p className="text-sm text-white">
            {isScanning ? 'Processing scan…' : lastScannedRfid ? 'Scan complete' : error ? 'Camera error' : 'Point camera at a QR code'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setError(null)} disabled={disabled || isScanning}>
            Reset
          </Button>
          <Button type="button" size="sm" variant="secondary" onClick={() => setError(null)} disabled={disabled}>
            Clear Error
          </Button>
        </div>
      </div>

      {/* No offscreen canvas needed with @yudiel/react-qr-scanner */}
    </motion.div>
  )
}
