'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Calendar as CalendarIcon, GraduationCap, ArrowRight, Loader2, ChevronDown, Check } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

import { COURSE_OPTIONS } from '../constants/course-options'
import { registrationStep1Schema, type RegistrationStep1Data } from '../schemas'

interface RegistrationStep1Props {
  onNext: (data: RegistrationStep1Data) => void
  initialData?: RegistrationStep1Data | null
}

export function RegistrationStep1({ onNext, initialData }: RegistrationStep1Props) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [customCourse, setCustomCourse] = useState('')
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [birthdateOpen, setBirthdateOpen] = useState(false)
  const [selectedBirthdate, setSelectedBirthdate] = useState<Date | undefined>()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<RegistrationStep1Data>({
    resolver: zodResolver(registrationStep1Schema),
    mode: 'onBlur',
    defaultValues: initialData || undefined,
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const watchedCourse = watch('course')

  useEffect(() => {
    if (initialData) {
      reset(initialData)
      
      // Set course dropdown based on existing data
      if (initialData.course) {
        const predefinedCourse = COURSE_OPTIONS.find(option => option.label === initialData.course)
        if (predefinedCourse) {
          setSelectedCourse(predefinedCourse.value)
        } else {
          setSelectedCourse('others')
          setCustomCourse(initialData.course)
        }
      }
      
      // Set birthdate from existing data
      if (initialData.birthdate) {
        // Parse date string safely without timezone issues
        const dateString = initialData.birthdate
        if (dateString.includes('-')) {
          const [year, month, day] = dateString.split('-').map(Number)
          setSelectedBirthdate(new Date(year, month - 1, day))
        } else {
          setSelectedBirthdate(new Date(initialData.birthdate))
        }
      }
    }
  }, [initialData, reset])

  // Handle course selection
  const handleCourseSelect = (value: string) => {
    setSelectedCourse(value)
    setCourseDropdownOpen(false)
    
    if (value === 'others') {
      setValue('course', customCourse)
    } else {
      const selectedOption = COURSE_OPTIONS.find(option => option.value === value)
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

  // Handle birthdate selection
  const handleBirthdateSelect = (date: Date | undefined) => {
    setSelectedBirthdate(date)
    setBirthdateOpen(false)
    if (date) {
      // Use local date formatting to avoid timezone issues
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      setValue('birthdate', formattedDate)
    } else {
      setValue('birthdate', '')
    }
  }

  const onSubmit = async (data: RegistrationStep1Data) => {
    onNext(data)
  }

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true)
    // Use the existing Google login from auth API
    const googleOAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`
    window.location.href = googleOAuthUrl
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-200">
            First Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('firstName')}
              type="text"
              id="firstName"
              placeholder="John"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="given-name"
            />
          </div>
          {errors.firstName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.firstName.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-200">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('lastName')}
              type="text"
              id="lastName"
              placeholder="Doe"
              className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="family-name"
            />
          </div>
          {errors.lastName && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.lastName.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('email')}
            type="email"
            id="email"
            placeholder="student@university.edu"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="email"
          />
        </div>
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-200">
          Username <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-pink-400" />
          </div>
          <Input
            {...register('username')}
            type="text"
            id="username"
            placeholder="johndoe123"
            className="pl-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
            autoComplete="username"
          />
        </div>
        {errors.username && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 font-space-mono"
          >
            {"// " + errors.username.message}
          </motion.p>
        )}
      </div>

      {/* Course and Birthdate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="course" className="block text-sm font-medium text-gray-200">
            Course/Program
          </label>
          <div className="space-y-3">
            {/* Course Dropdown */}
            <div className="relative">
              <Popover open={courseDropdownOpen} onOpenChange={setCourseDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={courseDropdownOpen}
                    className="w-full justify-between bg-black/40 border-pink-500/30 text-white hover:bg-black/60 hover:border-pink-400 h-auto py-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <GraduationCap className="h-4 w-4 text-pink-400 shrink-0" />
                      <span className="truncate text-left">
                        {selectedCourse 
                          ? COURSE_OPTIONS.find(option => option.value === selectedCourse)?.label || customCourse || "Select course..."
                          : "Select course..."
                        }
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-black/90 border-pink-500/50">
                  <Command>
                    <CommandInput placeholder="Search courses..." className="text-white" />
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandGroup>
                      {COURSE_OPTIONS.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleCourseSelect(option.value)}
                          className="text-white hover:bg-pink-500/10"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourse === option.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Custom Course Input (shown when "Others" is selected) */}
            {selectedCourse === 'others' && (
              <div className="relative">
                <Input
                  value={customCourse}
                  onChange={handleCustomCourseChange}
                  type="text"
                  placeholder="Enter your course name"
                  className="w-full pl-4 pr-4 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
                />
              </div>
            )}
          </div>
          {errors.course && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.course.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-200">
            Birthdate
          </label>
          <Popover open={birthdateOpen} onOpenChange={setBirthdateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={birthdateOpen}
                className="w-full justify-between bg-black/40 border-pink-500/30 text-white hover:bg-black/60 hover:border-pink-400 h-auto py-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <CalendarIcon className="h-4 w-4 text-pink-400 shrink-0" />
                  <span className="truncate text-left">
                    {selectedBirthdate 
                      ? format(selectedBirthdate, 'PPP')
                      : "Select your birthdate..."
                    }
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-black/90 border-pink-500/50" align="start">
              <Calendar
                mode="single"
                selected={selectedBirthdate}
                onSelect={handleBirthdateSelect}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
                className="rounded-md border-0"
                captionLayout="dropdown"
                fromYear={1900}
                toYear={new Date().getFullYear()}
                defaultMonth={selectedBirthdate || new Date(2000, 0)}
              />
            </PopoverContent>
          </Popover>
          {/* Hidden input for form validation */}
          <input
            {...register('birthdate')}
            type="hidden"
            value={selectedBirthdate ? selectedBirthdate.toISOString().split('T')[0] : ''}
          />
          {errors.birthdate && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.birthdate.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-200">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Create password"
              className="pl-10 pr-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.password.message}
            </motion.p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-pink-400" />
            </div>
            <Input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="Confirm password"
              className="pl-10 pr-10 bg-black/40 border-pink-500/30 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-pink-400/20"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-pink-400 hover:text-pink-300 transition-colors"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-red-400 font-space-mono"
            >
              {"// " + errors.confirmPassword.message}
            </motion.p>
          )}
        </div>
      </div>

      {/* Next Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl shadow-pink-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span>Continue to RFID Setup</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-pink-500/20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-black px-2 text-gray-400 font-space-mono">{"// Or continue with"}</span>
        </div>
      </div>

      {/* Google Signup Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        disabled={isGoogleLoading}
        className="w-full border-pink-500/50 text-pink-300 hover:bg-pink-500/10 py-3 rounded-xl bg-black/30 backdrop-blur-sm hover:border-pink-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <div className="flex items-center gap-3">
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          <span>{isGoogleLoading ? 'Redirecting...' : 'Continue with Google'}</span>
        </div>
      </Button>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-pink-400 hover:text-pink-300 font-semibold transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </form>
  )
}

export default RegistrationStep1 