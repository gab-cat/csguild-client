'use client'

import { motion } from 'framer-motion'
import { Code2 } from 'lucide-react'

import { 
  QuickStats, 
  RecentActivity, 
  QuickActions, 
  Notifications,
  UserProgress 
} from '@/features/dashboard'
import { 
  useQuickStats, 
  useRecentActivity 
} from '@/features/dashboard/hooks/use-dashboard-stats'
import { useCurrentUser } from '@/features/user/hooks/use-user-queries'

export default function DashboardPage() {
  const { user } = useCurrentUser()
  const stats = useQuickStats()
  const recentActivity = useRecentActivity()

  const firstName = user?.firstName || 'User'

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Animated Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Welcome back, {firstName}! 👋
          </motion.h1>
          <motion.p 
            className="text-gray-300 font-jetbrains flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Code2 className="w-4 h-4 text-pink-400" />
            {"// Your CS Guild command center"}
          </motion.p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <QuickStats stats={stats} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity - Takes up 2 columns on large screens */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <RecentActivity 
              activities={recentActivity.data} 
              isLoading={recentActivity.isLoading} 
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {/* Quick Actions */}
            <QuickActions />

            {/* Notifications */}
            <Notifications />

            {/* User Progress */}
            <UserProgress stats={stats} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}