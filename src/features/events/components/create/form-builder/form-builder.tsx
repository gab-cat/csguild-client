import React from 'react'

import { useFormBuilder } from '../../../hooks'
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
  const {
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
  } = useFormBuilder(initialFields)

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
    addField(template.type)
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
