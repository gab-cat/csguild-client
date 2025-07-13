'use client'

import { motion } from 'framer-motion'
import { LogIn, UserPlus, Lock } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/features/auth/stores/auth-store'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  fallback?: React.ReactNode
  title?: string
  description?: string
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  fallback,
  title = "Authentication Required",
  description = "Please sign in or create an account to continue."
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Loading...
          </h3>
          <p className="text-gray-400">
            Checking authentication status...
          </p>
        </div>
      </div>
    )
  }

  // If authentication is required and user is not authenticated, show auth prompt
  if (requireAuth && (!isAuthenticated || !user)) {
    // Return custom fallback if provided
    if (fallback) {
      return <>{fallback}</>
    }

    // Default authentication prompt
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-semibold text-white mb-3">
            {title}
          </h3>
          
          <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
            {description}
          </p>

          {/* Authentication Options */}
          <div className="space-y-4">
            {/* Sign In Button */}
            <Link href="/login" className="block">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="flex items-center justify-center gap-3">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In to Your Account</span>
                </div>
              </Button>
            </Link>

            {/* Register Button */}
            <Link href="/register" className="block">
              <Button 
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-purple-500/50 font-semibold py-3 rounded-xl transition-all"
              >
                <div className="flex items-center justify-center gap-3">
                  <UserPlus className="w-5 h-5" />
                  <span>Create New Account</span>
                </div>
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-700/50">
            <div className="text-sm text-gray-400 space-y-2">
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Join 10,000+ developers in CS Guild
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                Free to join, instant access
              </p>
              <p className="flex items-center justify-center gap-2">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                Connect, collaborate, and build together
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // User is authenticated or authentication is not required, render children
  return <>{children}</>
}
