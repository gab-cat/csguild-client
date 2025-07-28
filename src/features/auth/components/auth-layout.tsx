'use client'

import { motion } from 'framer-motion'
import { Code2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

import { useAuthStore } from '../stores/auth-store'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle: string
  showBackButton?: boolean
}

export function AuthLayout({ children, title, subtitle, showBackButton = true }: AuthLayoutProps) {
  const { isAuthenticated, user } = useAuthStore()
  const needsProfileCompletion = !user?.rfidId

  if (isAuthenticated && !needsProfileCompletion) {
    return redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf6_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf6_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
      
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <div className="relative w-full max-w-lg z-10">
        {/* Back Button */}
        {showBackButton && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors duration-200 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-space-mono text-sm">{"// Back to home"}</span>
            </Link>
          </motion.div>
        )}

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm rounded-2xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-space-mono font-bold text-xl text-white tracking-tight">CS Guild</h1>
                <p className="font-space-mono text-xs text-pink-400">v2.0.dev</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tighter">{title}</h2>
              <p className="text-gray-300 text-sm md:text-base tracking-tightrt">{subtitle}</p>
              
              {/* Code comment */}
              <div className="inline-flex items-center gap-2 px-3 py-1 mt-4 rounded-full bg-gradient-to-r from-pink-500/10 to-violet-500/10 border border-pink-500/20">
                <span className="font-space-mono text-xs text-pink-400">{"// Where code meets community"}</span>
              </div>
            </motion.div>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {children}
          </motion.div>
        </motion.div>

        {/* Additional Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
            <Link 
              href="/help" 
              className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
            >
              Help
            </Link>
          </div>
          
          <div className="mt-4 font-space-mono text-xs text-gray-500">
            © 2023 CS Guild. All rights reserved.
          </div>
        </motion.div>
      </div>
    </div>
  )
} 