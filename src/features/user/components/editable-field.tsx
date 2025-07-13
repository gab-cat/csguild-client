'use client'

import { motion } from 'framer-motion'
import { Calendar, Check, X } from 'lucide-react'
import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import type { EditableFieldProps } from '../types'

export function EditableField({
  label,
  value,
  isEditing,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  onChange,
  onSave,
  onCancel,
}: EditableFieldProps) {
  // Initialize tempValue with proper date formatting for date inputs
  const getInitialValue = () => {
    if (!value) return ''
    if (type === 'date') {
      try {
        // Convert ISO string to YYYY-MM-DD format for date input
        return new Date(value).toISOString().split('T')[0]
      } catch {
        return ''
      }
    }
    return value
  }

  const [tempValue, setTempValue] = useState(getInitialValue())
  const [showCalendar, setShowCalendar] = useState(false)

  // Update tempValue when value prop changes
  useEffect(() => {
    if (!value) {
      setTempValue('')
      return
    }
    if (type === 'date') {
      try {
        // Convert ISO string to YYYY-MM-DD format for date input
        setTempValue(new Date(value).toISOString().split('T')[0])
      } catch {
        setTempValue('')
      }
    } else {
      setTempValue(value)
    }
  }, [value, type])

  const handleSave = () => {
    onChange?.(tempValue)
    onSave?.()
  }

  const handleCancel = () => {
    const resetValue = type === 'date' && value ? 
      new Date(value).toISOString().split('T')[0] : 
      (value || '')
    setTempValue(resetValue)
    onCancel?.()
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = date.toISOString().split('T')[0]
      setTempValue(formattedDate)
      onChange?.(formattedDate)
      setShowCalendar(false)
    }
  }

  const formatDisplayValue = (val: string | undefined) => {
    if (!val) return 'Not specified'
    
    if (type === 'date' && val) {
      try {
        return new Date(val).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return val
      }
    }
    
    return val
  }

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-300">
          {label}
          {required && <span className="text-pink-400 ml-1">*</span>}
        </Label>
        <div className="min-h-[42px] px-4 py-3 bg-black/40 border border-gray-700 rounded-xl text-white flex items-center">
          <span className={!value ? 'text-gray-400 italic' : ''}>
            {formatDisplayValue(value)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-2"
    >
      <Label className="text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-pink-400 ml-1">*</span>}
      </Label>
      
      <div className="flex gap-2">
        {type === 'date' ? (
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start bg-black/40 border-pink-500/30 text-white hover:bg-pink-500/10 hover:border-pink-400"
                disabled={disabled}
              >
                <Calendar className="mr-2 h-4 w-4 text-pink-400" />
                {tempValue ? formatDisplayValue(tempValue) : (placeholder || 'Select date')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-900/95 border-pink-500/20 backdrop-blur-md">
              <CalendarComponent
                mode="single"
                selected={tempValue ? new Date(tempValue) : undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                className="text-white"
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Input
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoFocus
          />
        )}
        
        <div className="flex gap-1">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || (required && !tempValue.trim())}
            className="bg-green-600 hover:bg-green-700 text-white border-green-500"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={disabled}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {required && !tempValue.trim() && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400 font-space-mono"
        >
          {"// " + `${label} is required`}
        </motion.p>
      )}
    </motion.div>
  )
}
