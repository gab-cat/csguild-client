'use client'

import { motion } from 'framer-motion'

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm rounded-2xl p-8"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Skeleton */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-pink-500/20 animate-pulse border-4 border-pink-500/30" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-violet-500/20 animate-pulse border-2 border-violet-500/30" />
          </div>

          {/* User Info Skeleton */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
              <div className="h-8 bg-pink-500/20 rounded-lg animate-pulse w-48 mx-auto md:mx-0" />
              <div className="h-4 bg-violet-500/20 rounded animate-pulse w-32 mx-auto md:mx-0" />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <div className="h-6 bg-pink-500/20 rounded-full animate-pulse w-16" />
              <div className="h-6 bg-violet-500/20 rounded-full animate-pulse w-20" />
              <div className="h-6 bg-purple-500/20 rounded-full animate-pulse w-14" />
            </div>
          </div>

          {/* Edit Button Skeleton */}
          <div className="h-10 bg-pink-500/20 rounded-xl animate-pulse w-24" />
        </div>
      </motion.div>

      {/* Content Sections Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-pink-500/20 rounded animate-pulse w-40" />
            <div className="h-8 bg-violet-500/20 rounded-lg animate-pulse w-16" />
          </div>
          
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-500/20 rounded animate-pulse w-20" />
                <div className="h-10 bg-black/40 border border-pink-500/20 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Account Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-violet-500/20 rounded animate-pulse w-44" />
            <div className="h-8 bg-pink-500/20 rounded-lg animate-pulse w-16" />
          </div>
          
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-500/20 rounded animate-pulse w-24" />
                <div className="h-10 bg-black/40 border border-violet-500/20 rounded-xl animate-pulse" />
              </div>
            ))}
            
            {/* Status indicators */}
            <div className="flex gap-2 mt-4">
              <div className="h-6 bg-green-500/20 rounded-full animate-pulse w-20" />
              <div className="h-6 bg-blue-500/20 rounded-full animate-pulse w-24" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 backdrop-blur-sm rounded-2xl p-6"
      >
        <div className="h-6 bg-purple-500/20 rounded animate-pulse w-32 mb-6" />
        
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-12 bg-purple-500/20 rounded-xl animate-pulse w-full" />
              <div className="h-4 bg-gray-500/20 rounded animate-pulse w-20 mx-auto" />
              <div className="h-6 bg-pink-500/20 rounded animate-pulse w-16 mx-auto" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
