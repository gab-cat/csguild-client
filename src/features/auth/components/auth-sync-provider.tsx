'use client'

import { ReactNode } from 'react'

import { ProfileCompletionGuard } from './profile-completion-guard'

interface AuthSyncProviderProps {
  children: ReactNode
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  // Auth sync is now handled by Convex Auth directly
  // ProfileCompletionGuard handles Google OAuth profile completion redirects

  return (
    <ProfileCompletionGuard>
      {children}
    </ProfileCompletionGuard>
  )
}

export default AuthSyncProvider 