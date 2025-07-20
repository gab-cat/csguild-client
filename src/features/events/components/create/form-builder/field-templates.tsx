import { Plus, Type, FileText, Circle, CheckSquare, ChevronDown, Star } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'

import type { FieldTemplate } from '../../../types'
import { FIELD_TEMPLATES } from '../../../types'

// Helper function to render icons from template
const renderTemplateIcon = (iconName: string) => {
  const iconMap = {
    'Type': Type,
    'FileText': FileText,
    'Circle': Circle,
    'CheckSquare': CheckSquare,
    'ChevronDown': ChevronDown,
    'Star': Star,
  }
  
  const IconComponent = iconMap[iconName as keyof typeof iconMap]
  return IconComponent ? <IconComponent className="h-5 w-5 text-pink-500" /> : null
}

interface FieldTemplatesProps {
  onAddField: (template: FieldTemplate) => void
}

export function FieldTemplates({ onAddField }: FieldTemplatesProps) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg shadow-xl shadow-purple-500/5">
      <div className="p-4 border-b border-gray-800/50">
        <h4 className="font-medium text-white">Add New Field</h4>
        <p className="text-sm text-gray-400 mt-1">Choose a field type to add to your form</p>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FIELD_TEMPLATES.map((template) => (
            <Button
              key={template.id}
              type="button"
              variant="outline"
              onClick={() => onAddField(template)}
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-800/50 hover:text-white transition-all duration-200 border-gray-700/50 group"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">
                {renderTemplateIcon(template.icon)}
              </span>
              <span className="text-xs text-center font-medium">{template.name}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface EmptyStateProps {
  onAddFirstField: () => void
}

export function EmptyState({ onAddFirstField }: EmptyStateProps) {
  return (
    <div className="border-dashed border-2 border-gray-700/50 bg-gray-900/30 rounded-lg">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-800/50 p-3 mb-4">
          <Plus className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="font-semibold text-white mb-2">No fields added yet</h3>
        <p className="text-sm text-gray-400 mb-4 max-w-sm">
          Start building your feedback form by adding fields from the templates above
        </p>
        <Button
          type="button"
          onClick={onAddFirstField}
          className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Field
        </Button>
      </div>
    </div>
  )
}
