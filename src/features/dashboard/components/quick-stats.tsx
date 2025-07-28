'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Building, 
  Code2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface StatsCardProps {
  title: string
  value: number
  subValue?: number
  subLabel?: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  iconColor: string
  isLoading?: boolean
  delay?: number
}

export function StatsCard({ 
  title, 
  value, 
  subValue, 
  subLabel, 
  icon: Icon, 
  gradient, 
  iconColor,
  isLoading = false,
  delay = 0
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20 bg-gray-700" />
            <Skeleton className="h-8 w-16 bg-gray-700" />
          </div>
          <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`${gradient} border-gray-500/20 p-6 group cursor-pointer`}>
        <div className="flex items-center justify-between">
          <div>
            <motion.p 
              className="text-gray-300 text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: delay + 0.2 }}
            >
              {title}
            </motion.p>
            <motion.p 
              className="text-2xl font-bold text-white mt-1"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3, type: "spring" }}
            >
              {value.toLocaleString()}
            </motion.p>
            {subValue !== undefined && subLabel && (
              <motion.div 
                className="flex items-center gap-1 mt-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 }}
              >
                <Badge 
                  variant="outline" 
                  className="border-green-500/30 text-green-400 text-xs"
                >
                  {subValue} {subLabel}
                </Badge>
              </motion.div>
            )}
          </div>
          <motion.div 
            className={`w-12 h-12 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: delay + 0.1, type: "spring" }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </Card>
    </motion.div>
  )
}

interface QuickStatsProps {
  stats: {
    facilities: {
      total: number
      active: number
      occupancy: number
    }
    projects: {
      total: number
      open: number
      myProjects: number
      myApplications: number
    }
    users: {
      total: number
    }
    isLoading: boolean
  }
}

export function QuickStats({ stats }: QuickStatsProps) {
  const statsData = [
    {
      title: "Active Facilities",
      value: stats.facilities.active,
      subValue: stats.facilities.occupancy,
      subLabel: "current users",
      icon: Building,
      gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/10",
      iconColor: "from-blue-500/20 to-blue-600/20",
    },
    {
      title: "Open Projects",
      value: stats.projects.open,
      subValue: stats.projects.total,
      subLabel: "total projects",
      icon: Code2,
      gradient: "bg-gradient-to-br from-green-500/10 to-green-600/10",
      iconColor: "from-green-500/20 to-green-600/20",
    },
    {
      title: "My Projects",
      value: stats.projects.myProjects,
      subValue: stats.projects.myApplications,
      subLabel: "applications",
      icon: TrendingUp,
      gradient: "bg-gradient-to-br from-pink-500/10 to-pink-600/10",
      iconColor: "from-pink-500/20 to-pink-600/20",
    },
    {
      title: "Guild Members",
      value: stats.users.total,
      icon: Users,
      gradient: "bg-gradient-to-br from-violet-500/10 to-violet-600/10",
      iconColor: "from-violet-500/20 to-violet-600/20",
    },
  ]

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {statsData.map((stat, index) => (
        <StatsCard
          key={stat.title}
          {...stat}
          isLoading={stats.isLoading}
          delay={index * 0.1}
        />
      ))}
    </motion.div>
  )
}
