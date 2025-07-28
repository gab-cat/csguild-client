'use client'

import { motion } from 'framer-motion'
import { Edit3, Save, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { ProfileSectionProps } from '../types'

export function ProfileSection({
  title,
  isEditable = true,
  isEditing = false,
  onEdit,
  onSave,
  onCancel,
  children,
}: ProfileSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-pink-900/20 to-violet-900/20 border border-pink-500/20 backdrop-blur-sm rounded-2xl p-6 hover:border-pink-500/40 transition-all duration-300"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          {title}
        </h3>
        
        {isEditable && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={onSave}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancel}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                className="text-pink-400 border-pink-500/50 hover:bg-pink-500/10 hover:border-pink-400"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  )
}
