'use client'

import { Calendar, Clock, User, Users } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { useRegisterToEventMutation } from '../hooks'
import { EventDetailResponseDtoTypeEnum } from '../types'
import { eventUtils } from '../utils'

interface RegisterEventModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    slug: string
    title: string
    type: EventDetailResponseDtoTypeEnum
    description?: string
    details?: string
    startDate: string
    endDate?: string | null
    organizer: {
      firstName: string
      lastName: string
      username: string
    }
    tags?: string[]
  }
}

export function RegisterEventModal({ isOpen, onClose, event }: RegisterEventModalProps) {
  const registerMutation = useRegisterToEventMutation()

  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync(event.slug)
      onClose()
    } catch (error) {
      // Error is handled by the mutation
      console.error('Registration failed:', error)
    }
  }

  const isLoading = registerMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl tracking-tight font-bold">
              Register for <span className="text-purple-400">Event</span>
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Confirm your registration for this event
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Event Summary */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{event.title}</h3>
            
            {/* Date & Time */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-4 w-4 text-purple-400" />
              <span>{eventUtils.formatEventDate(event.startDate)}</span>
            </div>

            {event.endDate && (
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="h-4 w-4 text-purple-400" />
                <span>
                  Duration: {eventUtils.getEventDuration(event.startDate, event.endDate)}
                </span>
              </div>
            )}

            {/* Organizer */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <User className="h-4 w-4 text-green-400" />
              <span>
                Organized by {event.organizer.firstName} {event.organizer.lastName}
              </span>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-700/50 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge 
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-700/50 text-xs"
                  >
                    +{event.tags.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          <Separator className="bg-gray-800" />

          {/* Registration Info */}
          <div className="bg-gray-800/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-green-400">
              <Users className="h-4 w-4" />
              Registration Details
            </div>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• You will receive a confirmation email</li>
              <li>• Event updates will be sent to your email</li>
              <li>• You can check-in using your RFID card</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRegister}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registering...
              </div>
            ) : (
              'Confirm Registration'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
