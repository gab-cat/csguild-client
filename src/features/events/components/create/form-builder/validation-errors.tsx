import { AlertCircle } from 'lucide-react'
import React from 'react'

interface ValidationErrorsProps {
  errors: string[]
}

export function ValidationErrors({ errors }: ValidationErrorsProps) {
  if (errors.length === 0) return null

  return (
    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <h4 className="font-semibold text-red-400">Form Validation Errors</h4>
      </div>
      <ul className="space-y-1 text-sm text-red-300">
        {errors.map((error, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="block w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
            {error}
          </li>
        ))}
      </ul>
    </div>
  )
}
