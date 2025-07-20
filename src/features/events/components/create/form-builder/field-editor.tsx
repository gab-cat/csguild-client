import { AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import type { FormField } from '../../../types'

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onCancel: () => void
}

export function FieldEditor({ field, onUpdate, onCancel }: FieldEditorProps) {
  const [editedField, setEditedField] = React.useState<FormField>(field)
  const [errors, setErrors] = React.useState<string[]>([])

  const handleSave = () => {
    // Validate the field before saving
    const validation = validateField(editedField)
    if (validation.isValid) {
      onUpdate(editedField)
      setErrors([])
    } else {
      setErrors(validation.errors)
    }
  }

  const updateField = (updates: Partial<FormField>) => {
    setEditedField(prev => ({ ...prev, ...updates }))
    setErrors([]) // Clear errors when field is updated
  }

  const validateField = (fieldToValidate: FormField): { isValid: boolean; errors: string[] } => {
    const validationErrors: string[] = []

    if (!fieldToValidate.label?.trim()) {
      validationErrors.push('Field label is required')
    }

    const needsOptions = ['radio', 'checkbox', 'select'].includes(fieldToValidate.type)
    if (needsOptions) {
      if (!fieldToValidate.options || fieldToValidate.options.length < 2) {
        validationErrors.push('Choice fields must have at least 2 options')
      }
      if (fieldToValidate.options?.some(option => !option.trim())) {
        validationErrors.push('All options must have text')
      }
    }

    if (fieldToValidate.type === 'rating') {
      const maxRating = fieldToValidate.maxRating || 5
      if (maxRating < 2 || maxRating > 10) {
        validationErrors.push('Rating scale must be between 2 and 10')
      }
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors
    }
  }

  const addOption = () => {
    const newOptions = [...(editedField.options || []), `Option ${(editedField.options?.length || 0) + 1}`]
    updateField({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = editedField.options?.filter((_, i) => i !== index) || []
    updateField({ options: newOptions })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editedField.options || [])]
    newOptions[index] = value
    updateField({ options: newOptions })
  }

  const needsOptions = ['radio', 'checkbox', 'select'].includes(editedField.type)

  return (
    <div className="space-y-6 pt-6">
      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Please fix the following errors:</span>
          </div>
          <ul className="space-y-1 text-xs text-red-300">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="block w-1 h-1 bg-red-400 rounded-full mt-1.5 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Field Label */}
      <div className="space-y-2">
        <Label htmlFor="field-label" className="text-sm font-medium text-white">
          Field Label <span className="text-red-400">*</span>
        </Label>
        <Input
          id="field-label"
          value={editedField.label}
          onChange={(e) => updateField({ label: e.target.value })}
          placeholder="Enter field label"
          className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
        />
      </div>

      {/* Field Description */}
      <div className="space-y-2">
        <Label htmlFor="field-description" className="text-sm font-medium text-white">
          Description <span className="text-xs text-gray-400">(optional)</span>
        </Label>
        <Textarea
          id="field-description"
          value={editedField.description || ''}
          onChange={(e) => updateField({ description: e.target.value })}
          placeholder="Add a helpful description for this field"
          rows={3}
          className="resize-none bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
        />
      </div>

      {/* Text Field Placeholder */}
      {editedField.type === 'text' && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder" className="text-sm font-medium text-white">
            Placeholder Text
          </Label>
          <Input
            id="field-placeholder"
            value={editedField.placeholder || ''}
            onChange={(e) => updateField({ placeholder: e.target.value })}
            placeholder="Enter placeholder text"
            className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
          />
        </div>
      )}

      {/* Rating Scale Configuration */}
      {editedField.type === 'rating' && (
        <div className="space-y-2">
          <Label htmlFor="max-rating" className="text-sm font-medium text-white">
            Maximum Rating
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="max-rating"
              type="number"
              min="2"
              max="10"
              value={editedField.maxRating || 5}
              onChange={(e) => updateField({ maxRating: parseInt(e.target.value) || 5 })}
              className="w-20 bg-gray-800/50 border-gray-700/50 text-white focus:border-purple-500 focus:ring-purple-500/20"
            />
            <div className="flex gap-1">
              {Array.from({ length: editedField.maxRating || 5 }).map((_, index) => (
                <span key={index} className="text-xl text-yellow-500">★</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Rating scale from 1 to {editedField.maxRating || 5} stars
          </p>
        </div>
      )}

      {/* Options for Choice Fields */}
      {needsOptions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-white">
              Options <span className="text-red-400">*</span>
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              className="h-8 px-3 border-gray-700/50 hover:bg-gray-800/50 text-white"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            {editedField.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-mono text-gray-400 bg-gray-800/50 px-2 py-1 rounded min-w-[24px] text-center">
                    {index + 1}
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={editedField.options && editedField.options.length <= 1}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {editedField.options && editedField.options.length >= 8 && (
            <p className="text-xs text-gray-400">
              Consider limiting options to improve user experience
            </p>
          )}
        </div>
      )}

      {/* Required Field Toggle */}
      <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
        <input
          type="checkbox"
          id="field-required"
          checked={editedField.required || false}
          onChange={(e) => updateField({ required: e.target.checked })}
          className="w-4 h-4 rounded border-2 border-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
        />
        <div className="flex-1">
          <Label htmlFor="field-required" className="text-sm font-medium cursor-pointer text-white">
            Required field
          </Label>
          <p className="text-xs text-gray-400 mt-1">
            Users must fill this field before submitting
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-700/50">
        <Button 
          type="button" 
          onClick={handleSave} 
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          disabled={!editedField.label?.trim()}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 border-gray-700/50 hover:bg-gray-800/50"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
