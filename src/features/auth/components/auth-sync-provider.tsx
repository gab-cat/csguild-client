'use client'

import { ReactNode } from 'react'

// import { useAuthSync } from '../hooks'
// import { useAuthStore } from '../stores/auth-store'

interface AuthSyncProviderProps {
  children: ReactNode
}

export function AuthSyncProvider({ children }: AuthSyncProviderProps) {
//   const { isInitializing } = useAuthSync()
//   const { isLoading } = useAuthStore()

  // Show loading state while initializing auth
  //   if (isInitializing || isLoading) {
  //     return (
  //       <div className="min-h-screen bg-black flex items-center justify-center">
  //         <div className="text-center space-y-4">
  //           <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto" />
  //           <p className="text-gray-300 font-jetbrains text-sm">
  //             {"// Syncing authentication state..."}
  //           </p>
  //         </div>
  //       </div>
  //     )
  //   }

  return <>{children}</>
}

export default AuthSyncProvider 