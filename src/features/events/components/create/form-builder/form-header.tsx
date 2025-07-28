import { CheckCircle, Download, Edit3, Eye, MoreHorizontal, RefreshCw } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import type { FormField } from '../../../types'

interface FormHeaderProps {
  isPreviewMode: boolean
  fields: FormField[]
  onSetPreviewMode: (mode: boolean) => void
  onValidateForm: () => boolean
  onExportForm: () => void
  onClearForm: () => void
  showClearDialog: boolean
  onSetShowClearDialog: (show: boolean) => void
}

export function FormHeader({
  isPreviewMode,
  fields,
  onSetPreviewMode,
  onValidateForm,
  onExportForm,
  onClearForm,
  showClearDialog,
  onSetShowClearDialog,
}: FormHeaderProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-900/50 backdrop-blur-sm rounded-lg border border-gray-800/50 shadow-xl shadow-purple-500/5">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">Feedback Form Builder</h3>
          <p className="text-sm text-gray-400">
            Create custom fields to collect feedback from attendees
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant={isPreviewMode ? "outline" : "default"}
            size="sm"
            onClick={() => onSetPreviewMode(false)}
            className="flex-1 sm:flex-none"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => onSetPreviewMode(true)}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-gray-700/50 hover:bg-gray-800/50">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-900/95 backdrop-blur-sm border-gray-800/50">
              <DropdownMenuItem onClick={onValidateForm} className="hover:bg-gray-800/50">
                <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Form
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onExportForm} 
                disabled={fields.length === 0}
                className="hover:bg-gray-800/50"
              >
                <Download className="h-4 w-4 mr-2" />
                  Export JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onSetShowClearDialog(true)}
                disabled={fields.length === 0}
                className="text-red-400 focus:text-red-400 hover:bg-red-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All Fields
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Clear Form Dialog */}
      <Dialog open={showClearDialog} onOpenChange={onSetShowClearDialog}>
        <DialogContent className="bg-gray-900/95 backdrop-blur-sm border-gray-800/50">
          <DialogHeader>
            <DialogTitle className="text-white">Clear All Fields</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 mb-4">
            Are you sure you want to clear all fields? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => onSetShowClearDialog(false)}
              className="border-gray-700/50 hover:bg-gray-800/50"
            >
              Cancel
            </Button>
            <Button 
              onClick={onClearForm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
