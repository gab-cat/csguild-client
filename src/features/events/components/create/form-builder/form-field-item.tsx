import { Copy, Edit3, GripVertical, Trash2 } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import type { FormField } from '../../../types'
import { FIELD_TEMPLATES } from '../../../types'

import { FieldEditor } from './field-editor'
import { FieldPreview } from './field-preview'

interface FormFieldItemProps {
  field: FormField
  index: number
  isActive: boolean
  isPreviewMode: boolean
  onUpdate: (field: FormField) => void
  onRemove: () => void
  onDuplicate: () => void
  onSetActive: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}

export function FormFieldItem({
  field,
  index,
  isActive,
  isPreviewMode,
  onUpdate,
  onRemove,
  onDuplicate,
  onSetActive,
  onDragStart,
  onDragOver,
  onDrop,
}: FormFieldItemProps) {
  return (
    <div
      className={`transition-all duration-200 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg ${
        isActive && !isPreviewMode ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/20' : 'hover:shadow-md hover:shadow-purple-500/10'
      } ${!isPreviewMode ? 'cursor-move' : ''}`}
      draggable={!isPreviewMode}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="p-4 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isPreviewMode && (
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-gray-400 cursor-move hover:text-white transition-colors" />
                <span className="text-xs font-mono text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                  {index + 1}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs bg-gray-800/50 text-gray-300">
                {FIELD_TEMPLATES.find(t => t.type === field.type)?.name || field.type}
              </Badge>
              {field.required && (
                <Badge className="text-xs bg-red-500/20 text-red-400 border-red-500/30">
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
                onClick={onDuplicate}
                className="h-8 w-8 p-0 hover:bg-gray-800/50 text-gray-400 hover:text-white"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-800/50 text-gray-400 hover:text-white"
                    onClick={onSetActive}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md px-8 bg-gray-900/95 backdrop-blur-sm border-gray-800/50">
                  <SheetHeader className='px-0'>
                    <SheetTitle className="text-white text-2xl font-bold">Edit Field</SheetTitle>
                    <SheetDescription className="text-gray-400">
                      Customize the field settings and options
                    </SheetDescription>
                  </SheetHeader>
                  <FieldEditor
                    field={field}
                    onUpdate={onUpdate}
                    onCancel={() => {}}
                  />
                </SheetContent>
              </Sheet>
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-400 hover:bg-red-500/10"
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
  )
}
