'use client'

import { format } from 'date-fns'
import { Star, User } from 'lucide-react'
import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { FeedbackResponseDto, EventFeedbackResponsesDtoForm } from '@generated/api-client'

interface UserResponseDialogProps {
  isOpen: boolean
  onClose: () => void
  response: FeedbackResponseDto
  form?: EventFeedbackResponsesDtoForm
}

export function UserResponseDialog({ 
  isOpen, 
  onClose, 
  response, 
  form 
}: UserResponseDialogProps) {
  const formatResponseValue = (value: unknown): string => {
    if (value === null || value === undefined) return 'No response'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (Array.isArray(value)) return value.join(', ')
    return String(value)
  }

  const getResponseLabel = (fieldId: string): string => {
    if (!form?.fields) return fieldId
    const field = form.fields.find(f => f.id === fieldId)
    return field?.label || fieldId
  }

  const renderResponseValue = (fieldId: string, value: unknown) => {
    const field = form?.fields?.find(f => f.id === fieldId)
    
    // Handle rating fields with star display
    if (field?.type === 'rating') {
      const numValue = typeof value === 'string' ? parseInt(value, 10) : Number(value)
      if (!isNaN(numValue)) {
        return (
          <div className="flex items-center space-x-1">
            {Array.from({ length: field.maxRating || 5 }, (_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < numValue 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'text-gray-600'
                )}
              />
            ))}
            <span className="text-sm text-gray-400 ml-2">
              ({numValue}/{field.maxRating || 5})
            </span>
          </div>
        )
      }
    }

    // Handle radio fields with badges (includes select-like fields from the API)
    if (field?.type === 'radio' && value) {
      return (
        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
          {formatResponseValue(value)}
        </Badge>
      )
    }

    // Handle checkbox fields - convert comma-separated string to array if needed
    if (field?.type === 'checkbox') {
      let checkboxValues: string[] = []
      
      if (Array.isArray(value)) {
        checkboxValues = value.map(String)
      } else if (typeof value === 'string' && value.includes(',')) {
        checkboxValues = value.split(',').map(v => v.trim()).filter(Boolean)
      } else if (value) {
        checkboxValues = [String(value)]
      }

      if (checkboxValues.length > 0) {
        return (
          <div className="flex flex-wrap gap-1">
            {checkboxValues.map((item, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                {item}
              </Badge>
            ))}
          </div>
        )
      }
    }

    // Handle long text responses (textarea)
    if (field?.type === 'textarea' && value) {
      const text = String(value)
      
      return (
        <div className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {text}
          </p>
        </div>
      )
    }

    // Handle regular text fields
    if (field?.type === 'text' && value) {
      const text = String(value)
      
      return (
        <div className="bg-gray-800/20 rounded-md p-2 border border-gray-700/30">
          <p className="text-sm text-gray-300">
            {text}
          </p>
        </div>
      )
    }

    // Handle any unknown field types that might have options (like select) as badges
    if (field?.options && field.options.length > 0 && value) {
      return (
        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
          {formatResponseValue(value)}
        </Badge>
      )
    }

    // Default formatting for unknown types or empty values
    if (!value || value === '') {
      return (
        <span className="text-sm text-gray-500 italic">
          No response provided
        </span>
      )
    }

    return (
      <span className="text-sm text-gray-300">
        {formatResponseValue(value)}
      </span>
    )
  }

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader className="border-b border-gray-800 pb-4">
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
              <AvatarImage 
                src={userImage} 
                alt={userName}
              />
              <AvatarFallback className="bg-gray-700 text-gray-300">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <h3 className="text-lg font-semibold text-white">{userName}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-400">
                <span>{response.user.email}</span>

              </div>
              <span className="text-xs text-gray-400 mt-1">
                  Submitted {format(new Date(response.submittedAt), 'MMM d, yyyy')} at{' '}
                {format(new Date(response.submittedAt), 'h:mm a')}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-medium text-white">Feedback Responses</h4>
            <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-300">
              {Object.keys(response.responses).length} responses
            </Badge>
          </div>

          {Object.keys(response.responses).length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto h-12 w-12 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-gray-400">No responses submitted</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(response.responses).map(([fieldId, value]) => (
                <div key={fieldId} className="border-l-2 border-purple-500/30 bg-gray-800/20 rounded-r-lg pl-4 pr-4 py-4">
                  <div className="flex flex-col space-y-3">
                    <label className="text-sm font-bold text-gray-400 leading-relaxed">
                      {getResponseLabel(fieldId)}
                    </label>
                    <Separator className="mb-4 bg-white/30" />
                    <div>
                      {renderResponseValue(fieldId, value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
