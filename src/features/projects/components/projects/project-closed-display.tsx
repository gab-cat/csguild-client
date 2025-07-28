'use client'

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'

export function ProjectClosedDisplay() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-2xl blur-xl"></div>
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Project Applications Closed
        </h3>
        <p className="text-gray-400 mb-6 leading-relaxed">
          This project is currently not accepting new applications. The project owner may have reached their team capacity or the project may be in a different phase.
        </p>
        
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
          <p className="text-gray-300 text-sm">
            <strong>Want to stay updated?</strong> Keep an eye on this project for future opportunities, or explore other active projects that match your interests and skills.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
