import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import type { FormField } from '../../../types'
import { FIELD_TEMPLATES } from '../../../types'

interface FieldPreviewProps {
  field: FormField
}

export function FieldPreview({ field }: FieldPreviewProps) {
  const renderPreview = () => {
    switch (field.type) {
    case 'text':
      return (
        <Input
          placeholder={field.placeholder || 'Enter text...'}
          disabled
          className="bg-gray-800/30 border-gray-700/50 cursor-not-allowed text-white placeholder:text-gray-400"
        />
      )
    case 'textarea':
      return (
        <Textarea
          placeholder={field.placeholder || 'Enter your response...'}
          disabled
          rows={3}
          className="bg-gray-800/30 border-gray-700/50 cursor-not-allowed resize-none text-white placeholder:text-gray-400"
        />
      )
    case 'radio':
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input 
                type="radio" 
                disabled 
                className="w-4 h-4 text-purple-500 border-2 border-gray-700/50 cursor-not-allowed focus:ring-purple-500/20"
                name={`preview-${field.id}`}
              />
              <span className="text-sm text-white">{option}</span>
            </div>
          ))}
        </div>
      )
    case 'checkbox':
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input 
                type="checkbox" 
                disabled 
                className="w-4 h-4 text-purple-500 border-2 border-gray-700/50 rounded cursor-not-allowed focus:ring-purple-500/20"
              />
              <span className="text-sm text-white">{option}</span>
            </div>
          ))}
        </div>
      )
    case 'select':
      return (
        <div className="relative">
          <select 
            disabled 
            className="w-full p-3 border border-gray-700/50 rounded-md bg-gray-800/30 text-white cursor-not-allowed appearance-none focus:ring-purple-500/20"
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )
    case 'rating':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: field.maxRating || 5 }).map((_, index) => (
              <button
                key={index}
                type="button"
                disabled
                className="text-2xl text-yellow-500 hover:text-yellow-400 transition-colors cursor-not-allowed"
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Rate from 1 to {field.maxRating || 5} stars
          </p>
        </div>
      )
    default:
      return (
        <div className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-md text-center">
          <span className="text-sm text-gray-400">Unknown field type: {field.type}</span>
        </div>
      )
    }
  }

  return (
    <div className="space-y-3">
      {/* Field Label */}
      <div className="flex items-center gap-2">
        <Label className="text-sm font-medium text-white">
          {field.label}
          {field.required && <span className="text-red-400 ml-1">*</span>}
        </Label>
        {field.required && (
          <Badge className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 border-red-500/30">
            Required
          </Badge>
        )}
      </div>

      {/* Field Description */}
      {field.description && (
        <p className="text-xs text-gray-400 leading-relaxed">
          {field.description}
        </p>
      )}

      {/* Field Input */}
      <div className="space-y-1">
        {renderPreview()}
      </div>

      {/* Field Metadata */}
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700/30">
        <span className="text-xs text-gray-400">
          Type: {FIELD_TEMPLATES.find(t => t.type === field.type)?.name || field.type}
        </span>
        {field.options && field.options.length > 0 && (
          <>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {field.options.length} option{field.options.length !== 1 ? 's' : ''}
            </span>
          </>
        )}
        {field.type === 'rating' && (
          <>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              Max: {field.maxRating || 5} stars
            </span>
          </>
        )}
      </div>
    </div>
  )
}
