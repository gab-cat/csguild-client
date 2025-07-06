'use client'

import { motion } from 'framer-motion'
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* 404 Error Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent leading-none">
              404
            </h1>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-pink-500/20 rounded-full"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-500 rounded-full" />
            </motion.div>
          </motion.div>

          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center"
          >
            <div className="relative">
              <AlertTriangle className="h-16 w-16 text-pink-400" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-pink-500/20 rounded-full blur-sm"
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-300 max-w-lg mx-auto leading-relaxed">
              Oops! The page you&apos;re looking for seems to have vanished into the digital void. 
              It might have been moved, deleted, or never existed in the first place.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="font-space-mono text-sm text-pink-400 bg-black/40 rounded-lg p-3 border border-pink-500/30 inline-block"
            >
              {"// Error: Resource not found in current directory"}
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
            >
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 px-6 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-gray-400 text-sm space-y-2"
          >
            <p>Looking for something specific?</p>
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