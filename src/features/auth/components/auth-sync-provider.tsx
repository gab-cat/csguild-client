'use client'

import { ReactNode } from 'react'

import { useAuthSync } from '../hooks/use-auth-sync'

interface AuthSyncProviderProps {
  children: ReactNode
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
  // Initialize auth sync - this sets up automatic validation
  useAuthSync()

  // No loading UI needed since validation happens in background
  // and the app should remain functional even during validation
  return <>{children}</>
}

export default AuthSyncProvider 