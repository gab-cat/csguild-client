'use client'

import { motion } from 'framer-motion'
import { UserPlus, Calendar, Clock, Users } from 'lucide-react'
import React from 'react'

import { AuthGuard } from '@/components/shared/auth-guard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuthStore } from '@/features/auth/stores/auth-store'

import { EventDetailResponseDto } from '../../types'

interface RegistrationSectionProps {
  event: EventDetailResponseDto
  onRegister: () => void
  isCompleted: boolean
}

export function RegistrationSection({ onRegister, isCompleted }: RegistrationSectionProps) {
  const { isAuthenticated } = useAuthStore()
  const [showAuthGuard, setShowAuthGuard] = React.useState(false)

  if (isCompleted) {
    return null
  }

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      onRegister()
    } else {
      setShowAuthGuard(true)
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border-purple-500/30 overflow-hidden">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center space-y-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full inline-block">
                <UserPlus className="h-8 w-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Join this Event</h3>
                <p className="text-sm text-gray-300">
                  Register now to secure your spot and receive event updates
                </p>
              </div>
            </div>

            {/* Registration Benefits */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-white">What you&apos;ll get:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="h-1.5 w-1.5 bg-purple-400 rounded-full" />
                  Event reminders and updates
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="h-1.5 w-1.5 bg-pink-400 rounded-full" />
                  Access to event materials
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="h-1.5 w-1.5 bg-blue-400 rounded-full" />
                  Networking opportunities
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <div className="h-1.5 w-1.5 bg-green-400 rounded-full" />
                  Certificate of attendance
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium h-12"
                size="lg"
                onClick={handleRegisterClick}
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Register Now
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600"
                size="sm"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-6 pt-4 border-t border-gray-800/50">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>Free to join</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Instant confirmation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Auth Guard Modal - Only shown when unauthorized user clicks register */}
      {showAuthGuard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <AuthGuard
              requireAuth={true}
              title="Sign in to Register"
              description="Please sign in to register for this event and receive updates."
            >
              {/* This content won't be shown since the user is not authenticated */}
              <div />
            </AuthGuard>
            
            {/* Close button */}
            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowAuthGuard(false)}
                className="text-gray-400 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
