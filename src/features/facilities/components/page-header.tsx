'use client'

import { motion } from 'framer-motion'
import {  
  Scan, 
  Zap, 
  Clock,
} from 'lucide-react'
import { useEffect, useState } from 'react'



export function PageHeader() {
  const [formattedTime, setFormattedTime] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      {/* Main Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        
        <div className="relative bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/30 backdrop-blur-xs rounded-2xl p-4 md:px-8 md:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/20 to-violet-500/20 border border-pink-500/30 backdrop-blur-sm">
                  <Zap className="h-3 w-3 text-pink-400" />
                  <span className="font-space-mono text-xs text-pink-300">
                    {"// Access control system"}
                  </span>
                </div>
              </motion.div>

              <motion.h1 
                className="text-2xl md:text-3xl font-bold text-white tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Facility{" "}
                <span className="bg-gradient-to-r from-pink-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Access Control
                </span>
              </motion.h1>

              <motion.p 
                className="text-sm text-gray-200 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Select a facility and scan your RFID card to seamlessly check in and out. 
                Monitor real-time occupancy and access CS Guild facilities with ease.
              </motion.p>

              <motion.div
                className="flex items-center gap-2 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                suppressHydrationWarning={true}
                suppressContentEditableWarning
              >
                <Clock className="h-4 w-4 text-pink-400" />
                <span className="text-gray-400">

                  Live data • Updates every 30 seconds • Last updated: {formattedTime}
                </span>
              </motion.div>
            </div>

            {/* Visual Element */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/30 backdrop-blur-sm flex items-center justify-center">
                  <motion.div
                    className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg"
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Scan className="h-8 w-8 text-white" />
                  </motion.div>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-3xl blur-xl opacity-50" />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
      </motion.div>
    </div>
  )
} 