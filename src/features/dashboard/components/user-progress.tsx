'use client'

import { motion } from 'framer-motion'
import { Trophy, Target } from 'lucide-react'

import { Card } from '@/components/ui/card'

interface ProgressItemProps {
  title: string
  current: number
  total: number
  color: string
  delay?: number
}

function ProgressItem({ title, current, total, color, delay = 0 }: ProgressItemProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  
  const getGradient = () => {
    switch (color) {
    case 'text-blue-400':
      return 'from-blue-500 to-cyan-500'
    case 'text-green-400':
      return 'from-green-500 to-emerald-500'
    case 'text-pink-400':
      return 'from-pink-500 to-violet-500'
    default:
      return 'from-gray-500 to-gray-600'
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="space-y-3"
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-300 text-sm font-medium">{title}</span>
        <motion.span 
          className={`text-sm font-semibold ${color}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {current}/{total} ({percentage}%)
        </motion.span>
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.1 }}
        className="origin-left"
      >
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full bg-gradient-to-r ${getGradient()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

interface UserProgressProps {
  stats: {
    projects: {
      myProjects: number
      myApplications: number
    }
    isLoading: boolean
  }
}

export function UserProgress({ stats }: UserProgressProps) {
  if (stats.isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
            <div className="w-24 h-5 bg-gray-700 rounded animate-pulse" />
          </div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between">
                <div className="w-32 h-4 bg-gray-700 rounded animate-pulse" />
                <div className="w-12 h-4 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="w-full h-2 bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  const progressItems = [
    {
      title: "Active Projects",
      current: stats.projects.myProjects,
      total: Math.max(stats.projects.myProjects + 2, 5), // Simulate a goal
      color: "text-blue-400"
    },
    {
      title: "Applications Sent",
      current: stats.projects.myApplications,
      total: Math.max(stats.projects.myApplications + 1, 3), // Simulate a goal
      color: "text-green-400"
    },
    {
      title: "Profile Completion",
      current: 85, // This could come from actual profile data
      total: 100,
      color: "text-pink-400"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <motion.h3 
          className="text-lg font-semibold text-white mb-6 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Trophy className="w-5 h-5 text-yellow-400" />
          Your Progress
        </motion.h3>
        
        <div className="space-y-6">
          {progressItems.map((item, index) => (
            <ProgressItem
              key={item.title}
              {...item}
              delay={0.1 * index + 0.4}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 pt-4 border-t border-gray-700/50"
        >
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-4 h-4" />
              <span>Next Goal</span>
            </div>
            <span className="text-violet-400 font-medium">Join 1 more project</span>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  )
}
