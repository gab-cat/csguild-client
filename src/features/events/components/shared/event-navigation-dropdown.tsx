'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { ChevronDown, Calendar, Edit, MessageSquare, Users, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '@/features/auth'
import { api } from '@/lib/convex'
import { cn } from '@/lib/utils'


interface EventNavigationOption {
  key: 'detail' | 'edit' | 'responses' | 'attend'
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface EventNavigationDropdownProps {
  eventSlug: string
  currentPage: 'detail' | 'edit' | 'responses' | 'attend'
  onBack?: () => void
  className?: string
}

export function EventNavigationDropdown({ 
  eventSlug, 
  currentPage, 
  onBack,
  className 
}: EventNavigationDropdownProps) {
  const router = useRouter()

  const navigationOptions: EventNavigationOption[] = [
    {
      key: 'detail',
      label: 'Event Detail',
      href: `/events/${eventSlug}`,
      icon: Eye,
      description: 'View event information and register'
    },
    {
      key: 'edit',
      label: 'Edit Event',
      href: `/events/${eventSlug}/edit`,
      icon: Edit,
      description: 'Modify event details and settings'
    },
    {
      key: 'responses',
      label: 'Event Responses',
      href: `/events/${eventSlug}/responses`,
      icon: MessageSquare,
      description: 'View feedback and survey responses'
    },
    {
      key: 'attend',
      label: 'Attendance Tracking',
      href: `/events/${eventSlug}/attend`,
      icon: Users,
      description: 'Track and manage event attendance'
    }
  ]

  const currentOption = navigationOptions.find(option => option.key === currentPage)
  const CurrentIcon = currentOption?.icon || Calendar

  // @ts-ignore
  const event = useQuery(api.events.getEventBySlug, { slug: eventSlug });
  const { user } = useCurrentUser();

  const isOwner = event?.organizer?.username === user?.username;

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Back Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBack}
        className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 text-white"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {/* Event Navigation Dropdown */}
      {(isOwner ?     (<DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800/80 text-white border border-gray-700/50 gap-2"
          >
            <CurrentIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{currentOption?.label || 'Event Navigation'}</span>
            <span className="sm:hidden">Navigation</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="w-64 bg-gray-900/95 backdrop-blur-sm border-gray-700/50"
        >
          {navigationOptions.map((option) => {
            const IconComponent = option.icon
            const isCurrentPage = option.key === currentPage
            
            return (
              <DropdownMenuItem key={option.key} asChild>
                <Link
                  href={option.href}
                  className={cn(
                    'flex items-start gap-3 p-3 cursor-pointer transition-colors',
                    'hover:bg-gray-800/50 focus:bg-gray-800/50',
                    isCurrentPage && 'bg-purple-500/20 text-purple-300 border-l-2 border-purple-500'
                  )}
                >
                  <IconComponent 
                    className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      isCurrentPage ? 'text-purple-400' : 'text-gray-400'
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'text-sm font-medium',
                      isCurrentPage ? 'text-purple-300' : 'text-white'
                    )}>
                      {option.label}
                      {isCurrentPage && (
                        <span className="ml-2 text-xs text-purple-400">(Current)</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      {option.description}
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>) : null )}
    </div>
  )
}
