'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Sparkles } from 'lucide-react'

export function EventsHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-6"
    >
      {/* Main Title */}
      <div className="space-y-4">
        <h1 className="text-4xl lg:text-7xl font-bold text-white font-space-grotesk tracking-tighter">
          CS Guild
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {' '}Events
          </span>
        </h1>
        <p className="text-lg tracking-tight text-gray-300 max-w-3xl mx-auto">
          Discover amazing events, connect with fellow developers, and grow your skills.
          Join the CS Guild community and be part of exciting learning experiences.
        </p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex backdrop-blur-xs flex-col items-center space-y-3 p-6 bg-gray-900/30 rounded-lg border border-gray-800"
        >
          <div className="p-3 bg-purple-600/20 rounded-full">
            <Calendar className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Browse Events</h3>
          <p className="text-sm text-gray-400 text-center">
            Explore workshops, meetups, and conferences across different technologies
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex backdrop-blur-xs flex-col items-center space-y-3 p-6 bg-gray-900/30 rounded-lg border border-gray-800"
        >
          <div className="p-3 bg-blue-600/20 rounded-full">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Join Community</h3>
          <p className="text-sm text-gray-400 text-center">
            Attend events, network with peers, and learn from industry experts
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex backdrop-blur-xs flex-col items-center space-y-3 p-6 bg-gray-900/30 rounded-lg border border-gray-800"
        >
          <div className="p-3 bg-green-600/20 rounded-full">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Create Events</h3>
          <p className="text-sm text-gray-400 text-center">
            Organize your own events and share knowledge with the community
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
