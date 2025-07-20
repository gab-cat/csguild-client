"use client"

import { Clock } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value?: string
  onChange: (time: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [hours, setHours] = React.useState("")
  const [minutes, setMinutes] = React.useState("")

  // Parse the value when it changes
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(':')
      setHours(h || '')
      setMinutes(m || '')
    } else {
      setHours('')
      setMinutes('')
    }
  }, [value])

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '' || (/^\d{1,2}$/.test(inputValue) && parseInt(inputValue) >= 0 && parseInt(inputValue) <= 23)) {
      setHours(inputValue)
      if (inputValue && minutes) {
        const timeString = `${inputValue.padStart(2, '0')}:${minutes.padStart(2, '0')}`
        onChange(timeString)
      }
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '' || (/^\d{1,2}$/.test(inputValue) && parseInt(inputValue) >= 0 && parseInt(inputValue) <= 59)) {
      setMinutes(inputValue)
      if (hours && inputValue) {
        const timeString = `${hours.padStart(2, '0')}:${inputValue.padStart(2, '0')}`
        onChange(timeString)
      }
    }
  }

  const formatDisplayTime = () => {
    if (!value) return placeholder
    const [h, m] = value.split(':')
    const hour = parseInt(h)
    const minute = parseInt(m)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`
  }

  // Hard-coded time options to prevent dynamic generation issues
  const timeOptions = [
    { value: "09:00", display: "9:00 AM" },
    { value: "09:30", display: "9:30 AM" },
    { value: "10:00", display: "10:00 AM" },
    { value: "10:30", display: "10:30 AM" },
    { value: "11:00", display: "11:00 AM" },
    { value: "11:30", display: "11:30 AM" },
    { value: "12:00", display: "12:00 PM" },
    { value: "12:30", display: "12:30 PM" },
    { value: "13:00", display: "1:00 PM" },
    { value: "13:30", display: "1:30 PM" },
    { value: "14:00", display: "2:00 PM" },
    { value: "14:30", display: "2:30 PM" },
    { value: "15:00", display: "3:00 PM" },
    { value: "15:30", display: "3:30 PM" },
    { value: "16:00", display: "4:00 PM" },
    { value: "16:30", display: "4:30 PM" },
    { value: "17:00", display: "5:00 PM" },
    { value: "17:30", display: "5:30 PM" },
    { value: "18:00", display: "6:00 PM" },
    { value: "18:30", display: "6:30 PM" },
    { value: "19:00", display: "7:00 PM" },
    { value: "19:30", display: "7:30 PM" },
    { value: "20:00", display: "8:00 PM" },
    { value: "20:30", display: "8:30 PM" },
    { value: "21:00", display: "9:00 PM" },
    { value: "21:30", display: "9:30 PM" },
  ]

  const handleTimeOptionClick = (timeValue: string) => {
    onChange(timeValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {formatDisplayTime()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900/80 backdrop-blur-sm border-pink-400/50 rounded-md" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <Label htmlFor="hours" className="text-sm font-medium">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={handleHoursChange}
                placeholder="HH"
                className="mt-1"
              />
            </div>
            <div className="flex items-center justify-center pt-6">
              <span className="text-lg font-medium">:</span>
            </div>
            <div className="flex-1">
              <Label htmlFor="minutes" className="text-sm font-medium">
                Minutes
              </Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={handleMinutesChange}
                placeholder="MM"
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-2 block">Quick Select</Label>
            <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
              {timeOptions.map((time) => (
                <Button
                  key={time.value}
                  variant={value === time.value ? "default" : "ghost"}
                  size="sm"
                  className="text-xs justify-start"
                  onClick={() => handleTimeOptionClick(time.value)}
                >
                  {time.display}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
