"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"
import { cn } from "@/lib/utils"

interface DateTimePickerProps {
  value?: string
  onChange: (dateTime: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date and time",
  className,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = React.useState("")
  const isUpdatingFromProp = React.useRef(false)

  // Parse the value when it changes
  React.useEffect(() => {
    isUpdatingFromProp.current = true
    if (value) {
      const date = new Date(value)
      setSelectedDate(date)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      setSelectedTime(`${hours}:${minutes}`)
    } else {
      setSelectedDate(undefined)
      setSelectedTime("")
    }
    isUpdatingFromProp.current = false
  }, [value])

  // Update the datetime when date or time changes
  const updateDateTime = React.useCallback((date: Date | undefined, time: string) => {
    if (!isUpdatingFromProp.current && date && time) {
      const [hours, minutes] = time.split(':')
      const newDate = new Date(date)
      newDate.setHours(parseInt(hours, 10))
      newDate.setMinutes(parseInt(minutes, 10))
      newDate.setSeconds(0)
      newDate.setMilliseconds(0)
      onChange(newDate.toISOString())
    }
  }, [onChange])

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date && selectedTime) {
      updateDateTime(date, selectedTime)
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate && time) {
      updateDateTime(selectedDate, time)
    }
  }

  const formatDisplayValue = () => {
    if (!value) return placeholder
    const date = new Date(value)
    const dateStr = format(date, 'PPP')
    const timeStr = format(date, 'p')
    return `${dateStr} at ${timeStr}`
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
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDisplayValue()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-900/80 backdrop-blur-sm border-pink-400/50 rounded-md" align="start">
        <div className="p-4 space-y-4">
          <div className="">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateChange}
              disabled={(date) => date < new Date()}
              initialFocus
              className="bg-gray-800"
            />
          </div>
          
          {selectedDate && (
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Select time</span>
              </div>
              <TimePicker
                value={selectedTime}
                onChange={handleTimeChange}
                placeholder="Select time"
                className="bg-gray-800"

              />
            </div>
          )}
          
          {selectedDate && selectedTime && (
            <div className="border-t pt-4">
              <Button
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Confirm Selection
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
