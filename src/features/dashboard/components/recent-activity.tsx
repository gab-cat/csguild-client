'use client'

import { motion } from 'framer-motion'
import { 
  Clock, 
  Code2, 
  FileText, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ActivityItem {
  id: string
  title: string
  time: string
  type: 'application' | 'project' | 'facility'
  status?: string
  projectSlug?: string
}

interface ActivityItemProps {
  item: ActivityItem
  index: number
}

function ActivityItemComponent({ item, index }: ActivityItemProps) {
  const getIcon = () => {
    switch (item.type) {
    case 'application':
      return FileText
    case 'project':
      return Code2
    case 'facility':
      return TrendingUp
    default:
      return FileText
    }
  }

  const getStatusIcon = () => {
    switch (item.status) {
    case 'APPROVED':
      return CheckCircle
    case 'REJECTED':
      return XCircle
    case 'PENDING':
      return AlertCircle
    default:
      return null
    }
  }

  const getStatusColor = () => {
    switch (item.status) {
    case 'APPROVED':
      return 'text-green-400'
    case 'REJECTED':
      return 'text-red-400'
    case 'PENDING':
      return 'text-yellow-400'
    case 'OPEN':
      return 'text-blue-400'
    case 'IN_PROGRESS':
      return 'text-purple-400'
    case 'COMPLETED':
      return 'text-green-400'
    default:
      return 'text-gray-400'
    }
  }

  const getTypeColor = () => {
    switch (item.type) {
    case 'application':
      return 'from-blue-500/20 to-cyan-500/20'
    case 'project':
      return 'from-green-500/20 to-emerald-500/20'
    case 'facility':
      return 'from-purple-500/20 to-violet-500/20'
    default:
      return 'from-pink-500/20 to-rose-500/20'
    }
  }

  const Icon = getIcon()
  const StatusIcon = getStatusIcon()
  const timeAgo = new Date(item.time).toLocaleDateString()

  const content = (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-200 group"
    >
      <motion.div 
        className={`w-10 h-10 bg-gradient-to-br ${getTypeColor()} rounded-lg flex items-center justify-center flex-shrink-0`}
        whileHover={{ rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <motion.p 
          className="text-white font-medium text-sm group-hover:text-gray-100 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {item.title}
        </motion.p>
        <motion.p 
          className="text-gray-400 text-xs flex items-center gap-1 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.3 }}
        >
          <Clock className="w-3 h-3" />
          {timeAgo}
        </motion.p>
      </div>

      <div className="flex items-center gap-2">
        {item.status && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
          >
            <Badge 
              variant="outline" 
              className={`border-gray-600/50 ${getStatusColor()} text-xs flex items-center gap-1`}
            >
              {StatusIcon && <StatusIcon className="w-3 h-3" />}
              {item.status.toLowerCase()}
            </Badge>
          </motion.div>
        )}
        
        <motion.div
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          whileHover={{ x: 3 }}
        >
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </motion.div>
      </div>
    </motion.div>
  )

  if (item.projectSlug) {
    return (
      <Link href={`/projects/${item.projectSlug}`} className="block">
        {content}
      </Link>
    )
  }

  return content
}

interface RecentActivityProps {
  activities: ActivityItem[]
  isLoading: boolean
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  if (isLoading) {
    return (
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32 bg-gray-700" />
          <Skeleton className="h-8 w-20 bg-gray-700" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50">
              <Skeleton className="w-10 h-10 rounded-lg bg-gray-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-3 w-24 bg-gray-700" />
              </div>
              <Skeleton className="h-6 w-16 bg-gray-700" />
            </div>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <motion.h2 
            className="text-xl font-semibold text-white flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp className="w-5 h-5 text-pink-400" />
            Recent Activity
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-pink-400 hover:text-pink-300 hover:bg-pink-500/10"
            >
              View All
            </Button>
          </motion.div>
        </div>

        <div className="space-y-3">
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <ActivityItemComponent 
                key={activity.id} 
                item={activity} 
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center py-8"
            >
              <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No recent activity to show</p>
              <p className="text-gray-500 text-xs mt-1">
                Start by applying to projects or creating new ones!
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
