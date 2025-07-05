'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Home, Bug, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                className="relative"
              >
                <AlertCircle className="h-24 w-24 text-red-400" />
                <Bug className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-pink-400" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-4 bg-red-500/20 rounded-full blur-sm"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Something went wrong
            </h1>
            <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
              An unexpected error occurred while processing your request. 
              Our development team has been notified and is working on a fix.
            </p>
            
            {/* Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-jetbrains text-sm text-red-400 bg-black/40 rounded-lg p-4 border border-red-500/30 text-left max-w-md mx-auto overflow-x-auto"
              >
                <div className="mb-2 text-pink-400">{"// Error Details:"}</div>
                <div className="text-xs text-gray-300 break-all">
                  {error.message}
                </div>
                {error.digest && (
                  <div className="mt-2 text-xs text-gray-400">
                    Error ID: {error.digest}
                  </div>
                )}
              </motion.div>
            )}

            {/* Production Error Message */}
            {process.env.NODE_ENV === 'production' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="font-jetbrains text-sm text-pink-400 bg-black/40 rounded-lg p-3 border border-pink-500/30 inline-block"
              >
                {"// Error: System encountered an unexpected exception"}
              </motion.div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={reset}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 px-6 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-gray-400 text-sm space-y-2"
          >
            <p>If this problem persists, please contact our support team.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link
                href="/dashboard"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-200 underline"
              >
                Dashboard
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/facilities"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-200 underline"
              >
                Facilities
              </Link>
              <span className="text-gray-600">•</span>
              <Link
                href="/login"
                className="text-pink-400 hover:text-pink-300 transition-colors duration-200 underline"
              >
                Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 