'use client'

import React, { useState, useCallback } from 'react'

import type { FormField, FieldTemplate } from '../../../types'
import { FIELD_TEMPLATES } from '../../../types'

import { EmptyState, FieldTemplates } from './field-templates'
import { FormFieldItem } from './form-field-item'
import { FormHeader } from './form-header'
import { FormSummary } from './form-summary'
import { ValidationErrors } from './validation-errors'

interface FormBuilderProps {
  initialFields?: FormField[]
  onFieldsChange?: (fields: FormField[]) => void
  className?: string
}

export function FormBuilder({ initialFields = [], onFieldsChange, className }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null)

  const addField = useCallback((template: FieldTemplate) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      ...template.defaultConfig,
      label: template.defaultConfig.label || template.name,
      type: template.type,
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
    const fieldToDuplicate = fields.find(field => field.id === fieldId)
    if (fieldToDuplicate) {
      const newField: FormField = {
        ...fieldToDuplicate,
        id: `field-${Date.now()}`,
        label: `${fieldToDuplicate.label} (Copy)`,
      }
      setFields(prev => [...prev, newField])
    }
  }, [fields])

  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    setFields(prev => {
      const result = Array.from(prev)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
    })
  }, [])

  // Update parent when fields change
  React.useEffect(() => {
    onFieldsChange?.(fields)
  }, [fields, onFieldsChange])

  const clearForm = useCallback(() => {
    setFields([])
    setActiveFieldId(null)
    setIsPreviewMode(false)
  }, [])

  const initializeFields = useCallback((newFields: FormField[]) => {
    setFields(newFields)
  }, [])

  const validateForm = useCallback(() => {
    const errors: string[] = []
    fields.forEach((field, index) => {
      if (!field.label.trim()) {
        errors.push(`Field ${index + 1}: Label is required`)
      }
      if (field.required === undefined) {
        field.required = false
      }
    })
    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [fields])

  const [showClearDialog, setShowClearDialog] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])

  // Initialize fields if provided and not already initialized
  React.useEffect(() => {
    if (initialFields.length > 0 && fields.length === 0) {
      initializeFields(initialFields)
    }
  }, [initialFields, fields.length, initializeFields])

  React.useEffect(() => {
    onFieldsChange?.(fields)
  }, [fields, onFieldsChange])

  const addFieldFromTemplate = (template: FieldTemplate) => {
    addField(template)
  }

  const handleValidateForm = () => {
    const validation = validateForm()
    setValidationErrors(validation.errors)
    return validation.isValid
  }

  const handleExportForm = () => {
    const formData = {
      fields,
      metadata: {
        createdAt: new Date().toISOString(),
        version: '1.0.0',
        fieldCount: fields.length,
        requiredFields: fields.filter(f => f.required).length,
      }
    }
    
    const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'feedback-form.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearForm = () => {
    clearForm()
    setValidationErrors([])
    setShowClearDialog(false)
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'))
    if (dragIndex !== dropIndex) {
      reorderFields(dragIndex, dropIndex)
    }
  }

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 ${className || ''}`}>
      {/* Header */}
      <FormHeader
        isPreviewMode={isPreviewMode}
        fields={fields}
        onSetPreviewMode={setIsPreviewMode}
        onValidateForm={handleValidateForm}
        onExportForm={handleExportForm}
        onClearForm={handleClearForm}
        showClearDialog={showClearDialog}
        onSetShowClearDialog={setShowClearDialog}
      />

      {/* Validation Errors */}
      <ValidationErrors errors={validationErrors} />

      {/* Field Templates (only show in edit mode) */}
      {!isPreviewMode && (
        <FieldTemplates onAddField={addFieldFromTemplate} />
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <EmptyState onAddFirstField={() => addFieldFromTemplate(FIELD_TEMPLATES[0])} />
        ) : (
          fields.map((field, index) => (
            <FormFieldItem
              key={field.id}
              field={field}
              index={index}
              isActive={activeFieldId === field.id}
              isPreviewMode={isPreviewMode}
              onUpdate={(updatedField) => {
                updateField(field.id, updatedField)
                setActiveFieldId(null)
              }}
              onRemove={() => removeField(field.id)}
              onDuplicate={() => duplicateField(field.id)}
              onSetActive={() => setActiveFieldId(field.id)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            />
          ))
        )}
      </div>

      {/* Form Summary */}
      <FormSummary
        fields={fields}
        onValidateForm={handleValidateForm}
        onExportForm={handleExportForm}
      />
    </div>
  )
}

export default FormBuilder
