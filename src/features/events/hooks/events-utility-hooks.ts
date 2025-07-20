'use client'

import { useState } from 'react'

import type { EventFiltersSchemaType } from '../schemas'
import type { FormField } from '../types'
import { formBuilderUtils } from '../utils'

// Hook for managing event filters with URL sync
export const useEventFilters = () => {
  // This would typically integrate with Next.js router for URL sync
  // For now, we'll return a basic implementation
  
  return {
    filters: {} as EventFiltersSchemaType,
    updateFilters: (newFilters: Partial<EventFiltersSchemaType>) => {
      // Update URL and state
      console.log('Updating filters:', newFilters)
    },
    clearFilters: () => {
      // Clear all filters
      console.log('Clearing filters')
    },
  }
}

// Hook for form builder state management
export const useFormBuilder = (initialFields?: FormField[]) => {
  const [fields, setFields] = useState<FormField[]>(initialFields || [])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const addField = (type: string) => {
    const newField = formBuilderUtils.getDefaultFieldConfig(type) as unknown as FormField
    setFields(prev => [...prev, newField])
    setActiveFieldId(newField.id)
  }

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }

  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId))
    if (activeFieldId === fieldId) {
      setActiveFieldId(null)
    }
  }

  const duplicateField = (fieldId: string) => {
    const fieldToDuplicate = fields.find(field => field.id === fieldId)
    if (fieldToDuplicate) {
      const duplicatedField = {
        ...fieldToDuplicate,
        id: formBuilderUtils.generateFieldId(),
        label: `${fieldToDuplicate.label} (Copy)`
      }
      setFields(prev => [...prev, duplicatedField])
      setActiveFieldId(duplicatedField.id)
    }
  }

  const reorderFields = (startIndex: number, endIndex: number) => {
    setFields(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }

  const clearForm = () => {
    setFields([])
    setActiveFieldId(null)
    setIsPreviewMode(false)
  }

  const initializeFields = (newFields: FormField[]) => {
    setFields(newFields)
    setActiveFieldId(null)
    setIsPreviewMode(false)
  }

  const validateForm = () => {
    const errors: string[] = []
    
    if (fields.length === 0) {
      errors.push('At least one field is required')
    }

    fields.forEach((field, index) => {
      const validation = formBuilderUtils.validateFieldConfig(field as unknown as Record<string, unknown>)
      if (!validation.isValid) {
        errors.push(`Field ${index + 1}: ${validation.errors.join(', ')}`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  return {
    fields,
    isPreviewMode,
    activeFieldId,
    setIsPreviewMode,
    setActiveFieldId,
    addField,
    updateField,
    removeField,
    duplicateField,
    reorderFields,
    clearForm,
    initializeFields,
    validateForm,
  }
}
