import { CheckCircle, Code } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

import type { FormField } from '../../../types'

interface FormSummaryProps {
  fields: FormField[]
  onValidateForm: () => boolean
  onExportForm: () => void
}

export function FormSummary({ fields, onValidateForm, onExportForm }: FormSummaryProps) {
  if (fields.length === 0) return null

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-lg">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
          <div className="flex items-center gap-4">
            <span className="font-medium text-white">
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
            <div className="w-px h-4 bg-gray-700/50" />
            <span className="text-gray-400">
              {fields.filter(f => f.required).length} required
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              type="button"
              onClick={onValidateForm}
              className="text-xs hover:bg-gray-800/50"
            >
              <CheckCircle className="h-3 w-3 mr-2" />
              Validate
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              type="button"
              onClick={onExportForm}
              className="text-xs hover:bg-gray-800/50"
            >
              <Code className="h-3 w-3 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
