'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  User, 
  GraduationCap, 
  CreditCard, 
  ArrowRight, 
  ArrowLeft, 
  Loader2,
  Wifi,
  CheckCircle,
  AlertCircle,
  Check,
  ChevronsUpDown
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { useUpdateUserProfileMutation } from '../hooks'
import { googleUserUpdateSchema, type GoogleUserUpdateData } from '../schemas'
import { useAuthStore } from '../stores/auth-store'

// Predefined course options
const courseOptions = [
  { value: 'bs-computer-science', label: 'BS Computer Science' },
  { value: 'bs-information-technology', label: 'BS Information Technology' },
  { value: 'bs-information-systems', label: 'BS Information Systems' },
  { value: 'bs-digital-illustration-animation', label: 'BS Digital Illustration and Animation' },
  { value: 'custom', label: 'Other (specify below)' },
]

export function GoogleProfileCompletionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading } = useAuthStore()
  const [isScanning, setIsScanning] = useState(false)
  const [scanSuccess, setScanSuccess] = useState(false)
  const [scanTimeout, setScanTimeout] = useState(false)
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false)
  const [birthdateCalendarOpen, setBirthdateCalendarOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [customCourse, setCustomCourse] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date>()
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const rfidInputRef = useRef<HTMLInputElement>(null)
  const updateProfileMutation = useUpdateUserProfileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<GoogleUserUpdateData>({
    resolver: zodResolver(googleUserUpdateSchema),
    mode: 'onBlur',
  })

  const watchedRfidId = watch('rfidId')

  useEffect(() => {    
    // Pre-fill form with existing user data if available
    if (user) {
      // Only pre-fill if user is a Google OAuth user
      if (user.signupMethod === 'GOOGLE') {
        reset({
          username: user.username || '',
          birthdate: user.birthdate || '',
          course: user.course || '',
          rfidId: user.hasRfidCard ? undefined : '',
        })
        
        // Set course dropdown based on existing data
        if (user.course) {
          const predefinedCourse = courseOptions.find(option => option.label === user.course)
          if (predefinedCourse) {
            setSelectedCourse(predefinedCourse.value)
          } else {
            setSelectedCourse('custom')
            setCustomCourse(user.course)
          }
        }
        
        // Set birthdate for calendar
        if (user.birthdate) {
          setSelectedDate(new Date(user.birthdate))
        }
      }
    }
  }, [user, searchParams, reset])

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Start RFID scanning
  const handleStartScanning = () => {
    setIsScanning(true)
    setScanSuccess(false)
    setScanTimeout(false)
    
    // Focus on input field when scanning starts
    setTimeout(() => {
      rfidInputRef.current?.focus()
    }, 100)
    
    // Set 5-second timeout
    timeoutRef.current = setTimeout(() => {
      setIsScanning(false)
      setScanTimeout(true)
      // Auto-hide timeout message after 3 seconds
      setTimeout(() => setScanTimeout(false), 3000)
    }, 5000)
  }

  // Stop scanning
  const stopScanning = () => {
    setIsScanning(false)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (watchedRfidId) {
      setScanSuccess(true)
      // Auto-hide success message after 2 seconds
      setTimeout(() => setScanSuccess(false), 2000)
    }
  }

  // Handle Enter key press for RFID
  const handleRfidKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isScanning && watchedRfidId) {
      e.preventDefault()
      stopScanning()
      // Trigger form submission
      handleSubmit(onSubmit)()
    }
  }

  // Handle RFID input change during scanning
  const handleRfidInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('rfidId', value)
    
    // If there's a value and we're scanning, auto-stop after delay
    if (value && isScanning) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        if (isScanning && value) {
          stopScanning()
        }
      }, 1000)
    }
  }

  // Handle course selection
  const handleCourseSelect = (value: string) => {
    setSelectedCourse(value)
    setCourseDropdownOpen(false)
    
    if (value === 'custom') {
      setValue('course', customCourse)
    } else {
      const selectedOption = courseOptions.find(option => option.value === value)
      if (selectedOption) {
        setValue('course', selectedOption.label)
        setCustomCourse('')
      }
    }
  }

  // Handle custom course input
  const handleCustomCourseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomCourse(value)
    setValue('course', value)
  }

  // Handle calendar date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date)
      // Format date as YYYY-MM-DD for the input
      const formattedDate = date.toISOString().split('T')[0]
      setValue('birthdate', formattedDate)
      setBirthdateCalendarOpen(false)
    }
  }

  const onSubmit = async (data: GoogleUserUpdateData) => {
    try {
      // Remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
      ) as GoogleUserUpdateData

      await updateProfileMutation.mutateAsync(cleanData)
      window.location.reload()
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  const handleBack = () => {
    router.push('/login')
  }

  const getRequiredFields = () => {
    if (!user) return []
    
    const required = []
    // Only show required fields for Google OAuth users with incomplete profiles
    if (user.signupMethod === 'GOOGLE') {
      if (!user.birthdate) required.push('birthdate')
      if (!user.course) required.push('course')
      if (!user.hasRfidCard) required.push('rfidId')
      if (!user.username) required.push('username')
    }
    
    return required
  }

  const requiredFields = getRequiredFields()

  // Show loading state while user data is loading
  if (isLoading || !user) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  // Let middleware handle redirects for non-Google users and complete profiles
  // This component should only render for Google OAuth users with incomplete profiles

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        
        {/* User Info Display */}
        <div className="mt-4 p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
          <div className="flex items-center justify-center mb-4">
            <Avatar className="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
              <AvatarImage src={user.imageUrl} alt={`${user.firstName} ${user.lastName}`} className='rounded-full' />
              <AvatarFallback>
                <User className="w-8 h-8 text-white" />
              </AvatarFallback>
            </Avatar>
          </div>
          <p className="text-sm text-pink-400 font-space-mono mb-2">
            {"// Connected as"}
          </p>
          <p className="text-white font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Username Field */}
        {requiredFields.includes('username') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="username" className="text-gray-200">
              Username (optional)
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5 z-10" />
              <Input
                {...register('username')}
                id="username"
                type="text"
                placeholder="Enter your username"
                className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
              />
            </div>
            {/* Fixed height container for error messages to prevent layout shift */}
            <div className="h-4">
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 font-space-mono"
                >
                  {"// " + errors.username.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Birthdate Field */}
        {requiredFields.includes('birthdate') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="birthdate" className="text-gray-200">
              Birthdate
            </Label>
            <div className="flex gap-2">
              {/* Date Input */}
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5 z-10" />
                <Input
                  {...register('birthdate')}
                  id="birthdate"
                  type="date"
                  className="w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                />
              </div>
              {/* Calendar Popup Button */}
              <Popover open={birthdateCalendarOpen} onOpenChange={setBirthdateCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white hover:bg-black/40 hover:border-pink-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black/90 border-pink-500/50" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="rounded-md border-none"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Fixed height container for error messages to prevent layout shift */}
            <div className="h-4">
              {errors.birthdate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 font-space-mono"
                >
                  {"// " + errors.birthdate.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Course Field */}
        {requiredFields.includes('course') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            <Label htmlFor="course" className="text-gray-200">
              Course
            </Label>
            <div className="space-y-3">
              {/* Course Dropdown */}
              <div className="relative">
                <Popover open={courseDropdownOpen} onOpenChange={setCourseDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={courseDropdownOpen}
                      className="w-full justify-between pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white hover:bg-black/40 hover:border-pink-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                    >
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5" />
                      <span className="flex-1 text-left ml-6">
                        {selectedCourse
                          ? courseOptions.find((course) => course.value === selectedCourse)?.label
                          : "Select your course..."}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 bg-black/90 border-pink-500/50">
                    <Command>
                      <CommandInput 
                        placeholder="Search courses..." 
                        className="text-white placeholder:text-gray-400"
                      />
                      <CommandList>
                        <CommandEmpty className="text-gray-400 p-4">No course found.</CommandEmpty>
                        <CommandGroup>
                          {courseOptions.map((course) => (
                            <CommandItem
                              key={course.value}
                              value={course.value}
                              onSelect={(currentValue) => handleCourseSelect(currentValue)}
                              className="text-white hover:bg-pink-500/20 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCourse === course.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {course.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Custom Course Input (shown when "Other" is selected) */}
              {selectedCourse === 'custom' && (
                <div className="relative">
                  <Input
                    value={customCourse}
                    onChange={handleCustomCourseChange}
                    type="text"
                    placeholder="Enter your course name"
                    className="w-full pl-4 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300"
                  />
                </div>
              )}
            </div>
            {/* Fixed height container for error messages to prevent layout shift */}
            <div className="h-4">
              {errors.course && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 font-space-mono"
                >
                  {"// " + errors.course.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* RFID Field with Scanning */}
        {requiredFields.includes('rfidId') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <Label htmlFor="rfidId" className="text-gray-200">
              RFID Card ID (optional)
            </Label>

            {/* RFID Scanner Visual */}
            <div className="flex justify-center">
              <div className="relative">
                {/* Scanner Area */}
                <div
                  className={cn(
                    "w-64 h-24 rounded-xl mt-4 border-2 border-dashed transition-all duration-300 flex items-center justify-center",
                    isScanning
                      ? "border-pink-400 bg-pink-500/10 animate-pulse"
                      : scanSuccess
                        ? "border-green-400 bg-green-500/10"
                        : scanTimeout
                          ? "border-red-400 bg-red-500/10"
                          : "border-gray-500 bg-gray-500/5"
                  )}
                >
                  {isScanning ? (
                    <div className="text-center">
                      <Wifi className="h-5 w-5 text-pink-400 mx-auto mb-1 animate-bounce" />
                      <p className="text-xs text-pink-400 font-medium">Scanning...</p>
                    </div>
                  ) : scanSuccess ? (
                    <div className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mx-auto mb-1" />
                      <p className="text-xs text-green-400 font-medium">Scan Complete!</p>
                    </div>
                  ) : scanTimeout ? (
                    <div className="text-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mx-auto mb-1" />
                      <p className="text-xs text-red-400 font-medium">Scan Timeout</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Tap your student ID</p>
                    </div>
                  )}
                </div>

                {/* Scanning Animation Rings */}
                {isScanning && (
                  <>
                    <div className="absolute inset-0 rounded-xl border-2 border-pink-400 animate-ping opacity-20" />
                    <div className="absolute inset-2 rounded-lg border-2 border-pink-400 animate-ping opacity-30" style={{ animationDelay: '0.2s' }} />
                  </>
                )}
              </div>
            </div>

            {/* Scan Button */}
            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleStartScanning}
                disabled={isScanning}
                variant="outline"
                size="sm"
                className="border-pink-500/50 text-pink-300 hover:bg-pink-500/10 transition-all duration-300"
              >
                {isScanning ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Scanning...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Wifi className="h-4 w-4" />
                    <span>Start Scanning</span>
                  </div>
                )}
              </Button>
            </div>

            {/* RFID Input */}
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pink-400 h-5 w-5 z-10" />
              <Input
                {...register('rfidId')}
                ref={rfidInputRef}
                id="rfidId"
                type="text"
                placeholder={isScanning ? 'Enter RFID and press Enter...' : 'Start scanning to enable input'}
                disabled={!isScanning}
                onChange={handleRfidInputChange}
                onKeyPress={handleRfidKeyPress}
                className={cn(
                  "w-full pl-10 pr-4 py-3 bg-black/30 border-pink-500/50 rounded-xl text-white placeholder-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all duration-300",
                  !isScanning && "opacity-50 cursor-not-allowed"
                )}
              />
            </div>

            {/* Scan Status Messages */}
            {scanTimeout && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 rounded-lg bg-red-500/10 border border-red-500/20"
              >
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-xs">Scan timeout - Try again</span>
                </div>
              </motion.div>
            )}

            {/* Current RFID Display */}
            {watchedRfidId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 rounded-lg bg-green-500/10 border border-green-500/20"
              >
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-xs font-medium">RFID: </span>
                  <span className="text-xs font-space-mono">{watchedRfidId}</span>
                </div>
              </motion.div>
            )}

            {/* Fixed height container for error messages to prevent layout shift */}
            <div className="h-4">
              {errors.rfidId && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-red-400 font-space-mono"
                >
                  {"// " + errors.rfidId.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}

        {/* Info Message */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-blue-400 font-space-mono">
            {"// You can skip optional fields and complete them later in your profile settings"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="flex-1 border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting || updateProfileMutation.isPending}
            className="flex-1 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25"
          >
            {isSubmitting || updateProfileMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Complete Profile</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 