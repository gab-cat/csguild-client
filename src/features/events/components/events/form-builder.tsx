import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Edit3, 
  Eye, 
  Code, 
  Copy,
  AlertCircle,
  Download,
  RefreshCw,
  CheckCircle,
  MoreHorizontal,
  Type,
  FileText,
  Circle,
  CheckSquare,
  ChevronDown,
  Star
} from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

import { useFormBuilder } from '../../hooks/use-form-builder'
import type { FormField, FieldTemplate } from '../../types'
import { FIELD_TEMPLATES } from '../../types'

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
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null
}

interface FormBuilderProps {
  initialFields?: FormField[]
  onFieldsChange?: (fields: FormField[]) => void
  className?: string
}

interface FieldEditorProps {
  field: FormField
  onUpdate: (field: FormField) => void
  onCancel: () => void
}

// Field Editor Component
function FieldEditor({ field, onUpdate, onCancel }: FieldEditorProps) {
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
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-md">
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
          className="w-full bg-gray-800 border-gray-600 text-white"
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
          className="resize-none bg-gray-800 border-gray-600 text-white"
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
            className="bg-gray-800 border-gray-600 text-white"
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
              className="w-20 bg-gray-800 border-gray-600 text-white"
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
              className="h-8 px-3 border-gray-600 hover:bg-gray-800"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {editedField.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded min-w-6 text-center">
                    {index + 1}
                  </span>
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  disabled={editedField.options && editedField.options.length <= 1}
                  className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-900/20"
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
      <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-md">
        <input
          type="checkbox"
          id="field-required"
          checked={editedField.required || false}
          onChange={(e) => updateField({ required: e.target.checked })}
          className="w-4 h-4 rounded border-2 border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
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
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <Button 
          type="button" 
          onClick={handleSave} 
          className="flex-1"
          disabled={!editedField.label?.trim()}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          className="flex-1 border-gray-600 hover:bg-gray-800"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}

// Field Preview Component
function FieldPreview({ field }: { field: FormField }) {
  const renderPreview = () => {
    switch (field.type) {
    case 'text':
      return (
        <Input
          placeholder={field.placeholder || 'Enter text...'}
          disabled
          className="bg-gray-800/50 border-gray-600 cursor-not-allowed text-white"
        />
      )
    case 'textarea':
      return (
        <Textarea
          placeholder={field.placeholder || 'Enter your response...'}
          disabled
          rows={3}
          className="bg-gray-800/50 border-gray-600 cursor-not-allowed resize-none text-white"
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
                className="w-4 h-4 text-blue-500 border-2 border-gray-600 cursor-not-allowed"
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
                className="w-4 h-4 text-blue-500 border-2 border-gray-600 rounded cursor-not-allowed"
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
            className="w-full p-3 border border-gray-600 rounded-md bg-gray-800/50 text-white cursor-not-allowed appearance-none"
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
        <div className="p-4 bg-gray-800/50 border border-gray-600 rounded-md text-center">
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
          <Badge className="text-xs px-2 py-0.5 bg-red-600 text-white">
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
      <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
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

// Main Form Builder Component
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
    validateForm,
  } = useFormBuilder()

  const [showClearDialog, setShowClearDialog] = React.useState(false)
  const [validationErrors, setValidationErrors] = React.useState<string[]>([])

  // Initialize fields if provided
  React.useEffect(() => {
    if (initialFields.length > 0 && fields.length === 0) {
      // Set initial fields somehow - need to implement this in the hook
    }
  }, [initialFields, fields.length])

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
        requiredFields: fields.filter((f: FormField) => f.required).length,
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-gray-900 rounded-lg border border-gray-700">
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
            onClick={() => setIsPreviewMode(false)}
            className="flex-1 sm:flex-none"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            type="button"
            variant={isPreviewMode ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreviewMode(true)}
            className="flex-1 sm:flex-none"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          
          {!isPreviewMode && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleValidateForm}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Form
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportForm} disabled={fields.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowClearDialog(true)}
                  disabled={fields.length === 0}
                  className="text-red-400 focus:text-red-400"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear All Fields
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <h4 className="font-semibold text-red-400">Form Validation Errors</h4>
          </div>
          <ul className="space-y-1 text-sm text-red-300">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="block w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Field Templates (only show in edit mode) */}
      {!isPreviewMode && (
        <div className="bg-gray-900 rounded-lg border border-gray-700">
          <div className="p-4 border-b border-gray-700">
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
                  onClick={() => addFieldFromTemplate(template)}
                  className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-gray-800 hover:text-white transition-colors border-gray-600"
                >
                  {renderTemplateIcon(template.icon)}
                  <span className="text-xs text-center font-medium">{template.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-4">
        {fields.length === 0 ? (
          <div className="border-dashed border-2 border-gray-600 bg-gray-900 rounded-lg">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-800 p-3 mb-4">
                <Code className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">No fields added yet</h3>
              <p className="text-sm text-gray-400 mb-4 max-w-sm">
                Start building your feedback form by adding fields from the templates above
              </p>
              {!isPreviewMode && (
                <Button
                  type="button"
                  onClick={() => addFieldFromTemplate(FIELD_TEMPLATES[0])}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Field
                </Button>
              )}
            </div>
          </div>
        ) : (
          fields.map((field: FormField, index: number) => (
            <div
              key={field.id}
              className={`transition-all duration-200 bg-gray-900 border border-gray-700 rounded-lg ${
                activeFieldId === field.id && !isPreviewMode ? 'ring-2 ring-blue-400 shadow-lg' : 'hover:shadow-md'
              } ${!isPreviewMode ? 'cursor-move' : ''}`}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <div className="p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {!isPreviewMode && (
                      <div className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                        <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {index + 1}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-200">
                        {FIELD_TEMPLATES.find(t => t.type === field.type)?.name || field.type}
                      </Badge>
                      {field.required && (
                        <Badge className="text-xs bg-red-600 text-white">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {!isPreviewMode && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateField(field.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setActiveFieldId(field.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md px-8">
                          <SheetHeader>
                            <SheetTitle>Edit Field</SheetTitle>
                            <SheetDescription>
                              Customize the field settings and options
                            </SheetDescription>
                          </SheetHeader>
                          <FieldEditor
                            field={field}
                            onUpdate={(updatedField) => {
                              updateField(field.id, updatedField)
                              setActiveFieldId(null)
                            }}
                            onCancel={() => setActiveFieldId(null)}
                          />
                        </SheetContent>
                      </Sheet>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <FieldPreview field={field} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Summary */}
      {fields.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
              <div className="flex items-center gap-4">
                <span className="font-medium text-white">
                  {fields.length} field{fields.length !== 1 ? 's' : ''}
                </span>
                <div className="w-px h-4 bg-gray-600" />
                <span className="text-gray-400">
                  {fields.filter((f: FormField) => f.required).length} required
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={handleValidateForm}
                  className="text-xs hover:bg-gray-700"
                >
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Validate
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={handleExportForm}
                  className="text-xs hover:bg-gray-700"
                >
                  <Code className="h-3 w-3 mr-2" />
                  Export JSON
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Form Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Clear All Fields</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 mb-4">
            Are you sure you want to clear all fields? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowClearDialog(false)}
              className="border-gray-600 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleClearForm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Clear All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FormBuilder
