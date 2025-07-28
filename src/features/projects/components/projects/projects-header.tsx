'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, Target } from 'lucide-react'

export function ProjectsHeader() {
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
            {' '}Projects
          </span>
        </h1>
        <p className="text-lg tracking-tight text-gray-300 max-w-3xl mx-auto">
          Discover exciting projects, collaborate with fellow developers, and build amazing things together.
          Join the CS Guild community and turn your ideas into reality.
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
            <Briefcase className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Browse Projects</h3>
          <p className="text-sm text-gray-400 text-center">
            Explore a variety of projects across different technologies and skill levels
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
          <h3 className="text-lg font-semibold text-white">Join Teams</h3>
          <p className="text-sm text-gray-400 text-center">
            Apply for roles that match your skills and interests in exciting projects
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex backdrop-blur-xs flex-col items-center space-y-3 p-6 bg-gray-900/30 rounded-lg border border-gray-800"
        >
          <div className="p-3 bg-green-600/20 rounded-full">
            <Target className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Create Projects</h3>
          <p className="text-sm text-gray-400 text-center">
            Start your own project and recruit talented members to bring your vision to life
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
