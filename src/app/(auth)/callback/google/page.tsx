'use client'

import { Suspense } from 'react'

import { GoogleCallbackHandler } from '@/features/auth'


export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="max-w-md w-full space-y-6 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Authenticating with Google
          </h2>
          <p className="text-gray-400">
            Please wait while we complete your authentication...
          </p>
        </div>
        
        <Suspense fallback={
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        }>
          <GoogleCallbackHandler />
        </Suspense>
      </div>
    </div>
  )
} 