'use client'

import { format } from 'date-fns'
import { Eye, Mail } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { FeedbackResponseDto, EventFeedbackResponsesDtoForm } from '@generated/api-client'

import { UserResponseDialog } from './user-response-dialog'

interface FeedbackResponsesListProps {
  responses: FeedbackResponseDto[]
  form?: EventFeedbackResponsesDtoForm
  isLoading?: boolean
  className?: string
}

interface ResponseItemProps {
  response: FeedbackResponseDto
  form?: EventFeedbackResponsesDtoForm
}

function ResponseItem({ response, form }: ResponseItemProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const getInitials = (firstName: unknown, lastName: unknown, username: string): string => {
    const first = typeof firstName === 'string' ? firstName[0] : ''
    const last = typeof lastName === 'string' ? lastName[0] : ''
    return (first + last).toUpperCase() || username[0]?.toUpperCase() || 'U'
  }

  const getDisplayName = (firstName: unknown, lastName: unknown, username: string): string => {
    const first = typeof firstName === 'string' ? firstName : ''
    const last = typeof lastName === 'string' ? lastName : ''
    const fullName = `${first} ${last}`.trim()
    return fullName || username
  }

  const userInitials = getInitials(response.user.firstName, response.user.lastName, response.user.username)
  const userName = getDisplayName(response.user.firstName, response.user.lastName, response.user.username)
  const userImage = typeof response.user.imageUrl === 'string' ? response.user.imageUrl : undefined

  return (
    <>
      <Card className="w-full bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg hover:bg-gray-800/50 transition-colors duration-200">
        <CardHeader 
          className="cursor-pointer"
          onClick={() => setIsDialogOpen(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                <AvatarImage 
                  src={userImage} 
                  alt={userName}
                />
                <AvatarFallback className="text-sm bg-gray-700 text-gray-300">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center space-x-2 min-w-0">
                  <h4 className="font-medium text-white truncate">{userName}</h4>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {response.user.email}
                </p>
                <div className="flex items-center space-x-2 text-xs mt-1 text-gray-500">
                  <span>
                    Submitted {format(new Date(response.submittedAt), 'MMM d, yyyy')} at{' '}
                    {format(new Date(response.submittedAt), 'h:mm a')}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
                {Object.keys(response.responses).length} responses
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-700/50"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDialogOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">View responses</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <UserResponseDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        response={response}
        form={form}
      />
    </>
  )
}

export function FeedbackResponsesList({ 
  responses, 
  form, 
  isLoading = false, 
  className 
}: FeedbackResponsesListProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }, (_, i) => (
          <Card key={i} className="animate-pulse bg-gray-900/50 backdrop-blur-sm border-gray-800/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-700 rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/6" />
                </div>
                <div className="h-6 w-16 bg-gray-700 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (responses.length === 0) {
    return (
      <Card className={cn("bg-gray-900/50 backdrop-blur-sm border-gray-800/50 shadow-lg", className)}>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-white">No Responses Yet</h3>
            <p className="text-gray-400 text-sm">
              No feedback responses have been submitted for this event yet.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Feedback Responses ({responses.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {responses.map((response) => (
          <ResponseItem 
            key={response.id} 
            response={response} 
            form={form}
          />
        ))}
      </div>
    </div>
  )
}
