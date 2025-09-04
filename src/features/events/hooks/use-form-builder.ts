import { useState, useCallback } from 'react'

import type { FormField, FormBuilderState } from '../types'
import { FIELD_TEMPLATES } from '../types'
import { formBuilderUtils } from '../utils/form-builder-utils'

export interface UseFormBuilderReturn extends FormBuilderState {
  setIsPreviewMode: (isPreview: boolean) => void
  setActiveFieldId: (id: string | null) => void
  addField: (type: string) => void
  updateField: (fieldId: string, updates: Partial<FormField>) => void
  removeField: (fieldId: string) => void
  duplicateField: (fieldId: string) => void
  reorderFields: (fromIndex: number, toIndex: number) => void
  clearForm: () => void
  validateForm: () => { isValid: boolean; errors: string[] }
}

export function useFormBuilder(): UseFormBuilderReturn {
  const [fields, setFields] = useState<FormField[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const addField = useCallback((type: string) => {
    const template = FIELD_TEMPLATES.find(t => t.type === type)
    if (!template) return

    const newField: FormField = {
      id: formBuilderUtils.generateFieldId(),
      label: template.defaultConfig.label || 'New Field',
      type: template.type,
      required: template.defaultConfig.required || false,
      ...template.defaultConfig,
    }

    setFields(prev => [...prev, newField])
  }, [])

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ))
  }, [])

  const removeField = useCallback((fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId))
    if (activeFieldId === fieldId) {
      setActiveFieldId(null)
    }
  }, [activeFieldId])

  const duplicateField = useCallback((fieldId: string) => {
    setFields(prev => {
      const fieldToDuplicate = prev.find(field => field.id === fieldId)
      if (!fieldToDuplicate) return prev

      const duplicatedField: FormField = {
        ...fieldToDuplicate,
        id: formBuilderUtils.generateFieldId(),
        label: `${fieldToDuplicate.label} (Copy)`,
      }

      const fieldIndex = prev.findIndex(field => field.id === fieldId)
      const newFields = [...prev]
      newFields.splice(fieldIndex + 1, 0, duplicatedField)
      return newFields
    })
  }, [])

  const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const newFields = [...prev]
      const [removed] = newFields.splice(fromIndex, 1)
      newFields.splice(toIndex, 0, removed)
      return newFields
    })
  }, [])

  const clearForm = useCallback(() => {
    setFields([])
    setActiveFieldId(null)
  }, [])

  const validateForm = useCallback(() => {
    const errors: string[] = []

    if (fields.length === 0) {
      errors.push('Form must have at least one field')
      return { isValid: false, errors }
    }

    fields.forEach((field, index) => {
      const fieldNumber = index + 1

      if (!field.label?.trim()) {
        errors.push(`Field ${fieldNumber}: Label is required`)
      }

      const needsOptions = ['radio', 'checkbox', 'select'].includes(field.type)
      if (needsOptions) {
        if (!field.options || field.options.length < 2) {
          errors.push(`Field ${fieldNumber}: Choice fields must have at least 2 options`)
        }
        if (field.options?.some((option: string) => !option.trim())) {
          errors.push(`Field ${fieldNumber}: All options must have text`)
        }
      }

      if (field.type === 'rating') {
        const maxRating = field.maxRating || 5
        if (maxRating < 2 || maxRating > 10) {
          errors.push(`Field ${fieldNumber}: Rating scale must be between 2 and 10`)
        }
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }, [fields])

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
    validateForm,
  }
}
