'use client'

import { useMutation } from 'convex/react'
import { UserMinus, AlertTriangle } from 'lucide-react'
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
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { api } from '../../../../../convex/_generated/api'

// Define local member type that matches the expected structure
interface ProjectMember {
  id: string
  username: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  imageUrl: string | undefined
  status: "ACTIVE" | "INACTIVE" | "REMOVED"
  joinedAt: number | undefined
  role: {
    id: string
    name: string
    slug: string
  } | null
}

interface RemoveMemberDialogProps {
  isOpen: boolean
  onClose: () => void
  member: ProjectMember
  projectSlug: string
  projectTitle: string
}

export function RemoveMemberDialog({
  isOpen,
  onClose,
  member,
  projectSlug,
  projectTitle,
}: RemoveMemberDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  // @ts-ignore
  const removeProjectMember = useMutation(api.projects.removeProjectMember)

  const handleRemoveMember = async () => {
    if (!member.username) {
      return
    }

    const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User'

    try {
      setIsRemoving(true)

      await removeProjectMember({
        slug: projectSlug,
        memberUserSlug: member.username,
      })

      showSuccessToast(
        'Member Removed',
        memberName
          ? `${memberName} has been removed from the project`
          : 'Member has been removed from the project'
      )

      onClose()
    } catch (error) {
      showErrorToast(
        'Failed to Remove Member',
        error instanceof Error
          ? error.message
          : memberName
            ? `Failed to remove ${memberName}. Please try again.`
            : 'Failed to remove member. Please try again.'
      )
      console.error('Failed to remove member:', error)
    } finally {
      setIsRemoving(false)
    }
  }

  const memberName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown User'
  const roleName = member.role?.name || member.role?.slug || 'Team Member'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gray-800 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-red-400" />
            Remove Team Member
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            This action cannot be undone. The member will lose access to the project
            and their role slot will become available.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-yellow-400 font-medium text-sm">
                  Confirm Member Removal
                </p>
                <p className="text-yellow-300/80 text-sm">
                  You are about to remove <span className="font-semibold">{memberName}</span> 
                  {' '}from their role as <span className="font-semibold">{roleName}</span> 
                  {' '}in <span className="font-semibold">{projectTitle}</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
            <div className="flex items-center gap-3">
              {member.imageUrl ? (
                <Image
                  src={member.imageUrl}
                  alt={memberName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-600"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {member.firstName ? member.firstName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{memberName}</p>
                <p className="text-red-400 text-sm truncate">{roleName}</p>
                <p className="text-gray-400 text-xs truncate">
                  @{member.username || 'unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isRemoving}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRemoveMember}
            disabled={isRemoving}
            className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
          >
            {isRemoving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Removing...
              </div>
            ) : (
              <>
                <UserMinus className="w-4 h-4 mr-2" />
                Remove Member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
