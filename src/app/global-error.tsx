'use client'

import { motion } from 'framer-motion'
import { RefreshCw, Home, Zap, AlertTriangle } from 'lucide-react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html>
      <body className="bg-black text-white">
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
              {/* Critical Error Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                    className="relative"
                  >
                    <AlertTriangle className="h-32 w-32 text-red-400" />
                    <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-12 w-12 text-yellow-400" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -inset-6 bg-red-500/20 rounded-full blur-sm"
                  />
                </div>
              </motion.div>

              {/* Critical Error Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h1 className="text-5xl md:text-6xl font-bold text-white">
                  Critical Error
                </h1>
                <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
                  A critical system error has occurred that prevents the application from functioning properly. 
                  This is a serious issue that requires immediate attention.
                </p>
                
                {/* Error Details */}
                {process.env.NODE_ENV === 'development' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-mono text-sm text-red-400 bg-black/60 rounded-lg p-4 border border-red-500/50 text-left max-w-md mx-auto overflow-x-auto"
                  >
                    <div className="mb-2 text-yellow-400 font-semibold">{"// CRITICAL ERROR DETAILS:"}</div>
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
                    className="font-mono text-sm text-red-400 bg-black/60 rounded-lg p-3 border border-red-500/50 inline-block"
                  >
                    {"// CRITICAL: System core failure detected"}
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
                <button
                  onClick={reset}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-red-500/25 border-none cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2 inline" />
                  Restart Application
                </button>

                <button
                  onClick={() => window.location.href = '/'}
                  className="border border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 px-6 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300 cursor-pointer"
                >
                  <Home className="h-4 w-4 mr-2 inline" />
                  Force Reload Home
                </button>
              </motion.div>

              {/* Critical Warning */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="text-gray-400 text-sm space-y-2 border border-red-500/30 rounded-lg p-4 bg-red-500/5"
              >
                <div className="text-red-400 font-semibold">⚠️ CRITICAL SYSTEM ERROR</div>
                <p>
                  This error indicates a fundamental issue with the application core. 
                  If restarting doesn&apos;t resolve the issue, please contact the development team immediately.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </body>
    </html>
  )
} 