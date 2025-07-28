'use client'

import { motion } from 'framer-motion'
import { 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Edit3, 
  Mail, 
  Shield, 
  User,
  XCircle,
  Upload
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth'

import type { UserProfileData } from '../types'

interface ProfileHeaderProps {
  user: UserProfileData
  isEditable?: boolean
  onEdit?: () => void
}

export function ProfileHeader({  isEditable = true, onEdit }: ProfileHeaderProps) {
  const { user } = useAuthStore();

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  if (!user) return null

  const formatJoinDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      })
    } catch {
      return 'Unknown'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
    case 'ADMIN':
      return 'from-red-500 to-pink-500'
    case 'STAFF':
      return 'from-blue-500 to-violet-500'
    case 'STUDENT':
      return 'from-green-500 to-emerald-500'
    default:
      return 'from-gray-500 to-slate-500'
    }
  }

  const getSignupMethodColor = (method?: string) => {
    switch (method) {
    case 'GOOGLE':
      return 'from-red-500 to-orange-500'
    case 'EMAIL':
      return 'from-blue-500 to-cyan-500'
    case 'FACEBOOK':
      return 'from-blue-600 to-blue-700'
    case 'APPLE':
      return 'from-gray-800 to-black'
    default:
      return 'from-gray-500 to-slate-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-900/20 to-violet-gray-950/20 border border-pink-500/20 backdrop-blur-sm rounded-lg p-8 hover:border-pink-500/40 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar Section */}
        <div className="relative group">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-pink-500/30 hover:border-pink-400/50 transition-colors">
            <AvatarImage 
              src={user.imageUrl} 
              alt={`${user.firstName} ${user.lastName}`}
              className='rounded-full object-cover'
            />
            <AvatarFallback className="bg-gradient-to-br rounded-full from-pink-500 to-violet-500 text-white text-2xl md:text-3xl font-bold">
              {getUserInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          
          {/* Upload hover overlay */}
          {isEditable && (
            <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
              <Upload className="h-6 w-6 text-white" />
            </div>
          )}
          
          {/* Status indicators */}
          <div className="absolute -bottom-2 -right-2 flex gap-1">
            {user.emailVerified && (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-black">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
            {user.hasRfidCard && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
                <CreditCard className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* User Information */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-pink-400 font-space-mono text-sm">
              {"// @" + user.username}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {user.roles.map((role) => (
              <Badge
                key={role}
                className={`bg-gradient-to-r ${getRoleColor(role)} text-white border-0`}
              >
                <Shield className="h-3 w-3 mr-1" />
                {role}
              </Badge>
            ))}
            
            {user.course && (
              <Badge variant="outline" className="border-violet-500/50 text-violet-300">
                {user.course}
              </Badge>
            )}
            
            {user.signupMethod && (
              <Badge
                className={`bg-gradient-to-r ${getSignupMethodColor(user.signupMethod)} text-white border-0`}
              >
                {user.signupMethod}
              </Badge>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300 justify-center md:justify-start">
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-pink-400" />
              <span>{user.email}</span>
              {user.emailVerified ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400" />
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-violet-400" />
              <span>Joined {formatJoinDate(user.createdAt)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-blue-400" />
              <span>ID: {user.id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {isEditable && (
          <Button
            onClick={onEdit}
            variant="outline"
            className="text-pink-400 border-pink-500/50 hover:bg-pink-500/10 hover:border-pink-400 self-center md:self-start"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>
    </motion.div>
  )
}
