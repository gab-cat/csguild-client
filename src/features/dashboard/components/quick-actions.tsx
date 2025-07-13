'use client'

import { motion } from 'framer-motion'
import { 
  Code2, 
  BookOpen, 
  MessageSquare,
  Plus,
  Search,
  Bell,
  ArrowRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface QuickActionProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  variant?: 'primary' | 'secondary'
  badge?: string
  delay?: number
}

function QuickActionItem({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  variant = 'secondary',
  badge,
  delay = 0 
}: QuickActionProps) {
  const isPrimary = variant === 'primary'
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={href}>
        <Button 
          className={`w-full justify-between h-auto p-4 ${
            isPrimary 
              ? 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0' 
              : 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-600/50 text-gray-300 hover:text-white'
          } group transition-all duration-200`}
          variant={isPrimary ? 'default' : 'outline'}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                isPrimary ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-600/50'
              }`}
              whileHover={{ rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{title}</span>
                {badge && (
                  <Badge 
                    className={`text-xs ${
                      isPrimary 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-pink-500/20 text-pink-400 border-pink-500/30'
                    }`}
                  >
                    {badge}
                  </Badge>
                )}
              </div>
              <p className={`text-xs ${isPrimary ? 'text-white/80' : 'text-gray-400'} mt-0.5`}>
                {description}
              </p>
            </div>
          </div>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ x: 3 }}
          >
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </Button>
      </Link>
    </motion.div>
  )
}

export function QuickActions() {
  const actions = [
    {
      title: "Browse Projects",
      description: "Find exciting projects to join",
      icon: Search,
      href: "/projects",
      variant: 'primary' as const,
    },
    {
      title: "Create Project",
      description: "Start your own project",
      icon: Plus,
      href: "/projects/create",
      variant: 'secondary' as const,
    },
    {
      title: "View Facilities",
      description: "Check lab availability",
      icon: BookOpen,
      href: "/facilities",
      variant: 'secondary' as const,
    },
    {
      title: "Join Community",
      description: "Connect with guild members",
      icon: MessageSquare,
      href: "/community",
      variant: 'secondary' as const,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <motion.h3 
          className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Code2 className="w-5 h-5 text-violet-400" />
          Quick Actions
        </motion.h3>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <QuickActionItem
              key={action.title}
              {...action}
              delay={0.1 * index + 0.3}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  )
}

interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning'
  title: string
  message: string
  time?: string
}

interface NotificationsProps {
  notifications?: NotificationItem[]
}

export function Notifications({ notifications = [] }: NotificationsProps) {
  const defaultNotifications: NotificationItem[] = [
    {
      id: '1',
      type: 'info',
      title: 'New Projects Available',
      message: '5 new projects posted this week',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'success',
      title: 'Application Status',
      message: 'Your application was reviewed',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Facility Reminder',
      message: 'Remember to log out of Lab 1',
      time: '3 hours ago'
    },
  ]

  const displayNotifications = notifications.length > 0 ? notifications : defaultNotifications

  const getNotificationColor = (type: string) => {
    switch (type) {
    case 'success':
      return 'bg-green-500/10 border-green-500/20 text-green-300'
    case 'warning':
      return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300'
    case 'info':
    default:
      return 'bg-blue-500/10 border-blue-500/20 text-blue-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gray-900/50 border-gray-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <motion.h3 
            className="text-lg font-semibold text-white flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Bell className="w-5 h-5 text-blue-400" />
            Notifications
            <Badge className="bg-pink-500 text-white text-xs">
              {displayNotifications.length}
            </Badge>
          </motion.h3>
        </div>
        <div className="space-y-3">
          {displayNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${getNotificationColor(notification.type)}`}
            >
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-xs opacity-80 mt-0.5">{notification.message}</p>
              {notification.time && (
                <p className="text-xs opacity-60 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {notification.time}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
