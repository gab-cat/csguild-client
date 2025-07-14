'use client'

import { UserMinus, UserPlus, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MemberStatusIndicatorProps {
  projectSlug: string
  applicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  memberStatus?: 'ACTIVE' | 'INACTIVE' | 'UNKNOWN'
  isProjectOwner?: boolean
  onReactivate?: () => void
  compact?: boolean
}

export function MemberStatusIndicator({ 
  // projectSlug, // Currently unused but kept for future API integration
  applicationStatus, 
  memberStatus = 'UNKNOWN',
  isProjectOwner = false,
  onReactivate,
  compact = false
}: MemberStatusIndicatorProps) {
  const [isRequesting, setIsRequesting] = useState(false)

  const handleRequestReactivation = async () => {
    setIsRequesting(true)
    try {
      // This would make an API call to request reactivation
      // For now, just show a toast
      toast.info('Reactivation request sent to project owner')
    } catch (error) {
      console.error('Failed to request reactivation:', error)
      toast.error('Failed to send reactivation request')
    } finally {
      setIsRequesting(false)
    }
  }

  // Don't show anything for non-approved applications
  if (applicationStatus !== 'APPROVED') {
    return null
  }

  // Show different indicators based on member status
  if (memberStatus === 'ACTIVE') {
    return (
      <Badge
        variant="outline"
        className="text-xs bg-green-500/10 text-green-400 border-green-500/30"
      >
        <UserPlus className="w-3 h-3 mr-1" />
        Active Member
      </Badge>
    )
  }

  if (memberStatus === 'INACTIVE') {
    return (
      <div className={`flex ${compact ? 'flex-col gap-1' : 'items-center gap-2'}`}>
        <Badge
          variant="outline"
          className="text-xs bg-red-500/10 text-red-400 border-red-500/30"
        >
          <UserMinus className="w-3 h-3 mr-1" />
          Removed
        </Badge>
        
        {!compact && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <AlertTriangle className="w-3 h-3" />
              <span>You were removed from this project</span>
            </div>
            
            {isProjectOwner && onReactivate && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReactivate}
                className="h-6 px-2 text-xs bg-green-600/10 text-green-400 border-green-600/30 hover:bg-green-600/20"
              >
                Reactivate
              </Button>
            )}
            
            {!isProjectOwner && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRequestReactivation}
                disabled={isRequesting}
                className="h-6 px-2 text-xs bg-blue-600/10 text-blue-400 border-blue-600/30 hover:bg-blue-600/20"
              >
                {isRequesting ? 'Requesting...' : 'Request Reactivation'}
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  // Unknown status - could be that we can't determine or the API doesn't provide this info
  return (
    <Badge
      variant="outline"
      className="text-xs bg-gray-500/10 text-gray-400 border-gray-500/30"
    >
      <UserPlus className="w-3 h-3 mr-1" />
      Member Status Unknown
    </Badge>
  )
}
