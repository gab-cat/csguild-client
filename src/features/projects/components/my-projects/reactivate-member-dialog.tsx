'use client'

import { UserPlus, AlertTriangle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useReactivateProjectMember } from '../../hooks/use-projects-queries'
import type { ProjectMemberDto } from '../../types'

interface ReactivateMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  member: ProjectMemberDto
  projectSlug: string
  projectTitle: string
}

export function ReactivateMemberDialog({
  isOpen,
  onClose,
  member,
  projectSlug,
  projectTitle,
}: ReactivateMemberDialogProps) {
  const [isReactivating, setIsReactivating] = useState(false)
  const reactivateProjectMember = useReactivateProjectMember()

  const handleReactivateMember = async () => {
    if (!member.user?.username) {
      return
    }

    const memberName = `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim() || 'Unknown User'

    try {
      setIsReactivating(true)
      
      await reactivateProjectMember.mutateAsync({
        slug: projectSlug,
        memberUserSlug: member.user.username,
        memberName,
      })

      onClose()
    } catch (error) {
      console.error('Failed to reactivate member:', error)
    } finally {
      setIsReactivating(false)
    }
  }

  const memberName = `${member.user?.firstName || ''} ${member.user?.lastName || ''}`.trim() || 'Unknown User'
  const roleName = member.projectRole?.role?.name || member.projectRole?.roleSlug || 'Team Member'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-green-400" />
            Reactivate Team Member
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This will restore the member&apos;s access to the project and their role slot
            will become occupied again.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-green-400 font-medium text-sm">
                  Confirm Member Reactivation
                </p>
                <p className="text-green-300/80 text-sm">
                  You are about to reactivate <span className="font-semibold">{memberName}</span> 
                  {' '}as <span className="font-semibold">{roleName}</span> 
                  {' '}in <span className="font-semibold">{projectTitle}</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {member.user?.imageUrl ? (
                <Image 
                  src={member.user.imageUrl} 
                  alt={memberName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {member.user?.firstName ? member.user.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{memberName}</p>
                <p className="text-green-400 text-sm truncate">{roleName}</p>
                <p className="text-gray-400 text-xs truncate">
                  @{member.user?.username || 'unknown'}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  Previously removed member
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isReactivating}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReactivateMember}
            disabled={isReactivating}
            className="bg-green-600 hover:bg-green-700 text-white min-w-[120px]"
          >
            {isReactivating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Reactivating...
              </div>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Reactivate Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
