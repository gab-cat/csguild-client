'use client'

import { BarChart, FileText, TrendingUp, Users } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { FeedbackStatisticsDto } from '@generated/api-client'

interface FeedbackStatisticsProps {
  statistics: FeedbackStatisticsDto
  className?: string
}

export function FeedbackStatistics({ statistics, className }: FeedbackStatisticsProps) {
  const responseRate = Math.round(statistics.responseRate)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Responses</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.totalResponses}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Attendees</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{statistics.totalAttendees}</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-2 text-white">
              <span>{responseRate}%</span>
              <Badge 
                className={cn(
                  "text-xs",
                  responseRate >= 70 ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    responseRate >= 40 ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                )}
              >
                {responseRate >= 70 ? 'High' : responseRate >= 40 ? 'Medium' : 'Low'}
              </Badge>
            </div>
            <Progress value={responseRate} className="mt-2 bg-gray-800" />
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Field Statistics</CardTitle>
            <BarChart className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {statistics.fieldStats ? Object.keys(statistics.fieldStats).length : 0}
            </div>
            <p className="text-xs text-gray-400">
              Form fields analyzed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
