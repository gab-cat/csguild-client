'use client'

import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  MessageCircle, 
  Calendar, 
  Star,
  Shield,
  ExternalLink 
} from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { useOrganizerStatisticsQuery } from '../../hooks'
import { EventDetailResponseDto } from '../../types'

interface OrganizerCardProps {
  event: EventDetailResponseDto
}

export function OrganizerCard({ event }: OrganizerCardProps) {
  const organizer = event.organizer
  
  // Fetch organizer statistics
  const { data: statisticsData, isLoading: isLoadingStats } = useOrganizerStatisticsQuery(organizer.username)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg text-white">
            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg">
              <User className="h-5 w-5 text-emerald-400" />
            </div>
            Event Organizer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organizer Profile */}
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gradient-to-br from-emerald-500/30 to-teal-500/30">
                <AvatarImage 
                  src={typeof organizer.imageUrl === 'string' ? organizer.imageUrl : undefined} 
                  alt={`${organizer.firstName} ${organizer.lastName}`}
                />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-lg font-semibold">
                  {organizer.firstName[0]}{organizer.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-white text-lg">
                  {organizer.firstName} {organizer.lastName}
                </h3>
                <Badge 
                  variant="outline" 
                  className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-1">
                @{organizer.username}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                Event Organizer
              </div>
            </div>
          </div>

          <Separator className="bg-gray-800/70" />

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 bg-blue-500/20 rounded-md">
                <Mail className="h-4 w-4 text-blue-400" />
              </div>
              <span className="text-gray-400 min-w-0 flex-1 truncate">
                {organizer.email}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1.5 bg-purple-500/20 rounded-md">
                <MessageCircle className="h-4 w-4 text-purple-400" />
              </div>
              <span className="text-gray-400">
                Available for questions
              </span>
            </div>
          </div>

          {/* Organizer Stats */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-gray-800/30 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-white font-semibold">
                  {isLoadingStats ? '...' : 
                    statisticsData?.statistics?.averageRating 
                      ? statisticsData.statistics.averageRating.toFixed(1) 
                      : 'N/A'
                  }
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {isLoadingStats ? 'Loading...' : 
                  statisticsData?.statistics?.totalRatings 
                    ? `${statisticsData.statistics.totalRatings} rating${statisticsData.statistics.totalRatings !== 1 ? 's' : ''}`
                    : 'No ratings'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span className="text-white font-semibold">
                  {isLoadingStats ? '...' : 
                    statisticsData?.statistics?.totalEventsOrganized || 0
                  }
                </span>
              </div>
              <p className="text-xs text-gray-400">Events</p>
            </div>
          </div>

          {/* Rating Distribution (if available) */}
          {!isLoadingStats && statisticsData?.statistics?.ratingDistribution && statisticsData.statistics.totalRatings && statisticsData.statistics.totalRatings > 1 && (
            <div className="space-y-2">
              <h4 className="text-white text-sm font-medium">Rating Distribution</h4>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => {
                  const ratingKey = String(star) as keyof typeof statisticsData.statistics.ratingDistribution
                  const count = statisticsData.statistics.ratingDistribution?.[ratingKey] || 0
                  const percentage = statisticsData.statistics.totalRatings ? (count / statisticsData.statistics.totalRatings) * 100 : 0
                  
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400 w-2">{star}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
              size="sm"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium">
                {isLoadingStats ? 'Checking status...' : 
                  statisticsData?.statistics?.totalEventsOrganized && statisticsData.statistics.totalEventsOrganized > 0
                    ? 'Trusted Organizer'
                    : 'New Organizer'
                }
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {isLoadingStats ? 'Loading organizer info...' :
                statisticsData?.statistics?.totalEventsOrganized && statisticsData.statistics.totalEventsOrganized > 0
                  ? `Organized ${statisticsData.statistics.totalEventsOrganized} event${statisticsData.statistics.totalEventsOrganized !== 1 ? 's' : ''} with ${statisticsData.statistics.totalAttendees || 0} total attendees`
                  : 'New to organizing events on the platform'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
