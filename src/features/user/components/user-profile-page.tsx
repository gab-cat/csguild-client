'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import {
  Calendar as CalendarIcon,
  Info,
  Shield,
  UserCheck,
  Clock,
  Mail,
  Settings,
  Save,
  X,
  Edit3,
  Loader2,
  ChevronDown,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useCurrentUser } from '@/features/auth/hooks/use-current-user'
import { useMutation } from '@/lib/convex'
import { api } from '@/lib/convex'
import { showErrorToast, showInfoToast } from '@/lib/toast'

import { updateProfileSchema, type UpdateProfileFormData } from '../schemas'
import { formatDate, formatRelativeTime, getUserInitials, formatDateForInput } from '../utils/index'

import { ProfilePictureUpload } from './profile-picture-upload'
import { ProfileSkeleton } from './profile-skeleton'

export function UserProfilePage() {
  const { user, isAuthenticated, isLoading } = useCurrentUser()
  const updateProfileMutation = useMutation(api.users.updateCurrentUser)
  const resendVerificationMutation = useMutation(api.users.resendEmailVerification)
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})
  const [birthdateOpen, setBirthdateOpen] = useState(false)
  const [selectedBirthdate, setSelectedBirthdate] = useState<Date | undefined>()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      course: user?.course || '',
      birthdate: user?.birthdate ? formatDateForInput(new Date(user.birthdate)) : '',
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      const birthdateValue = user.birthdate ? formatDateForInput(new Date(user.birthdate)) : ''
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        course: user.course || '',
        birthdate: birthdateValue,
      })

      // Set birthdate for calendar component
      if (user.birthdate) {
        setSelectedBirthdate(new Date(user.birthdate))
      } else {
        setSelectedBirthdate(undefined)
      }
    }
  }, [user, form])

  // Show skeleton while loading
  if (isLoading || !isAuthenticated) {
    return <ProfileSkeleton />
  }

  // Redirect if no user
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">Please log in to view your profile.</p>
          <Button asChild>
            <a href="/auth/login">Log In</a>
          </Button>
        </div>
      </div>
    )
  }

  const startEditing = (section: string) => {
    setEditingSections(prev => ({ ...prev, [section]: true }))
    // Reset form values to current user data
    const birthdateValue = user.birthdate ? formatDateForInput(new Date(user.birthdate)) : ''
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      course: user.course || '',
      birthdate: birthdateValue,
    })

    // Reset birthdate calendar state
    if (user.birthdate) {
      setSelectedBirthdate(new Date(user.birthdate))
    } else {
      setSelectedBirthdate(undefined)
    }
  }

  const cancelEditing = (section: string) => {
    setEditingSections(prev => ({ ...prev, [section]: false }))
    // Reset form to current user values
    const birthdateValue = user.birthdate ? formatDateForInput(new Date(user.birthdate)) : ''
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      course: user.course || '',
      birthdate: birthdateValue,
    })

    // Reset birthdate calendar state
    if (user.birthdate) {
      setSelectedBirthdate(new Date(user.birthdate))
    } else {
      setSelectedBirthdate(undefined)
    }
  }

  // Handle birthdate selection from calendar
  const handleBirthdateSelect = (date: Date | undefined) => {
    setSelectedBirthdate(date)
    setBirthdateOpen(false)
    if (date) {
      // Use local date formatting to avoid timezone issues
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const formattedDate = `${year}-${month}-${day}`
      form.setValue('birthdate', formattedDate)
    } else {
      form.setValue('birthdate', '')
    }
  }

  const saveSection = async (section: string) => {
    const isValid = await form.trigger()
    if (!isValid) {
      showErrorToast('Validation Error', 'Please fix the validation errors before saving.')
      return
    }

    const formData = form.getValues()
    const updateData: Record<string, string | number> = {}

    // Only include changed fields
    if (section === 'personal') {
      if (formData.firstName !== user.firstName) updateData.firstName = formData.firstName || ''
      if (formData.lastName !== user.lastName) updateData.lastName = formData.lastName || ''
      if (formData.course !== user.course) updateData.course = formData.course || ''
      // Compare formatted dates to avoid false positives
      if (formData.birthdate !== (user.birthdate ? formatDateForInput(new Date(user.birthdate)) : '')) {
        // Convert date string to timestamp for Convex
        if (formData.birthdate) {
          const dateTimestamp = new Date(formData.birthdate).getTime()
          updateData.birthdate = dateTimestamp
        } else {
          // Allow clearing the birthdate by not including it in the update
          // The mutation handles optional fields correctly
        }
      }
    } else if (section === 'account') {
      if (formData.username !== user.username) updateData.username = formData.username || ''
      // Note: Email updates are not currently supported in the backend mutation
      // if (formData.email !== user.email) updateData.email = formData.email || ''
    }

    // Only make API call if there are changes
    if (Object.keys(updateData).length > 0) {
      try {
        setIsUpdating(true)
        await updateProfileMutation(updateData)
        setEditingSections(prev => ({ ...prev, [section]: false }))
        showInfoToast('Profile updated successfully!')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
        showErrorToast('Failed to update profile', errorMessage)
      } finally {
        setIsUpdating(false)
      }
    } else {
      setEditingSections(prev => ({ ...prev, [section]: false }))
      showInfoToast('No Changes', 'No changes detected.')
    }
  }

  const handleResendVerification = async () => {
    if (!user.email) {
      showErrorToast('Email Required', 'Email address is required to send verification.')
      return
    }

    try {
      setIsResending(true)
      await resendVerificationMutation({ email: user.email })
      showInfoToast(
        'Verification email sent!',
        'Check your inbox for a new verification code. It may take a few minutes to arrive.'
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend verification email'
      showErrorToast('Failed to send email', errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  const formatAccountAge = () => {
    try {
      if (!user.createdAt) return 'Unknown'
      const created = new Date(user.createdAt)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - created.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 30) {
        return `${diffDays} days`
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} month${months > 1 ? 's' : ''}`
      } else {
        const years = Math.floor(diffDays / 365)
        return `${years} year${years > 1 ? 's' : ''}`
      }
    } catch {
      return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="max-w-7xl mx-auto p-8 space-y-12">
        {/* Clean Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture Section */}
                <div className="relative flex-shrink-0">
                  <ProfilePictureUpload
                    currentImageUrl={user.imageUrl}
                    userInitials={getUserInitials(user.firstName, user.lastName)}
                    onUploadComplete={(imageUrl) => {
                      console.log('Profile picture updated:', imageUrl)
                    }}
                    className="relative"
                  />
                  {/* Verification Badge */}
                  {user.emailVerified && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-lg"
                    >
                      <UserCheck className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </div>

                {/* User Information */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  {/* Name and Username */}
                  <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-lg text-slate-300">@{user.username}</p>
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {user.emailVerified && (
                      <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {user.roles && user.roles.map((role: string) => (
                      <Badge key={role} variant="secondary" className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <Shield className="w-3 h-3 mr-1" />
                        {role}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-slate-300">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.course && (
                      <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-slate-300">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span>{user.course}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 justify-center md:justify-start text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>Joined {user.createdAt ? formatRelativeTime(user.createdAt) : 'Unknown'}</span>
                    </div>
                  </div>
                </div>

                {/* Action Section */}
                <div className="flex-shrink-0">
                  {!user.emailVerified && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-amber-500/50 hover:bg-amber-500/10 text-amber-300 hover:text-amber-200 transition-all duration-300"
                      onClick={handleResendVerification}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Verify Email
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Personal Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl shadow-2xl border border-white/10">
              <CardHeader className="pb-6">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <UserCheck className="w-5 h-5 text-purple-400" />
                      </div>
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Personal Information
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2 text-sm">
                      Manage your personal details and preferences
                    </CardDescription>
                  </div>
                  {!editingSections.personal ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing('personal')}
                        className="text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-full p-2 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEditing('personal')}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full p-2 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveSection('personal')}
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full p-2 transition-all duration-200"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-400" />
                        First Name
                      </Label>
                      {editingSections.personal ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Input
                            id="firstName"
                            {...form.register('firstName')}
                            className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:ring-purple-500/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                            placeholder="Enter first name"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-white font-medium">
                            {user.firstName || 'Not provided'}
                          </p>
                        </motion.div>
                      )}
                      {form.formState.errors.firstName && (
                        <motion.p
                          className="text-sm text-red-400 flex items-center gap-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <X className="w-3 h-3" />
                          {form.formState.errors.firstName.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-purple-400" />
                        Last Name
                      </Label>
                      {editingSections.personal ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Input
                            id="lastName"
                            {...form.register('lastName')}
                            className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-500 focus:border-purple-500/60 focus:ring-purple-500/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                            placeholder="Enter last name"
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-white font-medium">
                            {user.lastName || 'Not provided'}
                          </p>
                        </motion.div>
                      )}
                      {form.formState.errors.lastName && (
                        <motion.p
                          className="text-sm text-red-400 flex items-center gap-1"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <X className="w-3 h-3" />
                          {form.formState.errors.lastName.message}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="course" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      Course/Program
                    </Label>
                    {editingSections.personal ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Input
                          id="course"
                          {...form.register('course')}
                          className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-500 focus:border-blue-500/60 focus:ring-blue-500/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                          placeholder="e.g., Computer Science"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-white font-medium">
                          {user.course || 'Not provided'}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="birthdate" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-emerald-400" />
                      Birthdate
                    </Label>
                    {editingSections.personal ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Popover open={birthdateOpen} onOpenChange={setBirthdateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={birthdateOpen}
                              className="w-full justify-between bg-slate-800/60 border-slate-600/60 text-white hover:bg-slate-700/60 hover:border-emerald-500/60 rounded-lg backdrop-blur-sm transition-all duration-200 h-auto py-3 px-4"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <CalendarIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                                <span className="truncate text-left font-medium">
                                  {selectedBirthdate
                                    ? format(selectedBirthdate, 'PPP')
                                    : "Select your birthdate..."
                                  }
                                </span>
                              </div>
                              <ChevronDown className="h-4 w-4 shrink-0 opacity-60 transition-transform duration-200" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 bg-slate-900/95 border-slate-600/60 backdrop-blur-xl shadow-2xl rounded-xl" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedBirthdate}
                              onSelect={handleBirthdateSelect}
                              disabled={(date) =>
                                date > new Date() || date < new Date('1900-01-01')
                              }
                              initialFocus
                              className="rounded-xl border-0"
                              captionLayout="dropdown"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              defaultMonth={selectedBirthdate || new Date(2000, 0)}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-white font-medium">
                          {user.birthdate ? formatDate(user.birthdate) : 'Not provided'}
                        </p>
                      </motion.div>
                    )}
                    {/* Hidden input for form validation */}
                    {editingSections.personal && (
                      <input
                        {...form.register('birthdate')}
                        type="hidden"
                        value={selectedBirthdate ? selectedBirthdate.toISOString().split('T')[0] : ''}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
              <CardHeader className="pb-6">
                <div className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-3 text-xl">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                        <Settings className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        Account Settings
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-400 mt-2 text-sm">
                      Configure your account credentials and preferences
                    </CardDescription>
                  </div>
                  {!editingSections.account ? (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing('account')}
                        className="text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-full p-2 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="flex gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEditing('account')}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full p-2 transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveSection('account')}
                          disabled={isUpdating}
                          className="text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full p-2 transition-all duration-200"
                        >
                          {isUpdating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="username" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      Username
                    </Label>
                    {editingSections.account ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Input
                          id="username"
                          {...form.register('username')}
                          className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-500 focus:border-cyan-500/60 focus:ring-cyan-500/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                          placeholder="Enter username"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-white font-medium">
                          @{user.username}
                        </p>
                      </motion.div>
                    )}
                    {form.formState.errors.username && (
                      <motion.p
                        className="text-sm text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <X className="w-3 h-3" />
                        {form.formState.errors.username.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-gray-300 text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-400" />
                      Email Address
                    </Label>
                    {editingSections.account ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Input
                          id="email"
                          type="email"
                          {...form.register('email')}
                          className="bg-slate-800/60 border-slate-600/60 text-white placeholder:text-gray-500 focus:border-pink-500/60 focus:ring-pink-500/20 rounded-lg backdrop-blur-sm transition-all duration-200"
                          placeholder="Enter email address"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        className="px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-lg backdrop-blur-sm"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-white font-medium">
                          {user.email}
                        </p>
                      </motion.div>
                    )}
                    {form.formState.errors.email && (
                      <motion.p
                        className="text-sm text-red-400 flex items-center gap-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <X className="w-3 h-3" />
                        {form.formState.errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <Separator className="bg-slate-600/50" />

                  {/* Account Status */}
                  <div className="space-y-6">
                    <h4 className="font-semibold text-gray-200 text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-400" />
                      Account Status
                    </h4>

                    <motion.div
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/40 to-slate-800/60 border border-slate-700/50 rounded-xl backdrop-blur-sm"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                          <Mail className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-200">Email Verification</span>
                          <p className="text-xs text-gray-400">Secure your account</p>
                        </div>
                      </div>
                      <Badge
                        variant={user.emailVerified ? 'default' : 'destructive'}
                        className={user.emailVerified
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg'
                          : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg'
                        }
                      >
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </motion.div>
                  

                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-white/10 shadow-2xl">
            <CardHeader className="pb-8">
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <Info className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Account Overview
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                Your account statistics and activity summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                {/* Account Age */}
                <motion.div
                  className="text-center space-y-4 p-6 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-2xl border border-blue-500/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative w-14 h-14 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <CalendarIcon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-300 mb-1">Member Since</p>
                    <p className="text-3xl font-bold text-white mb-1">{formatAccountAge()}</p>
                    <p className="text-xs text-gray-400">{user.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
                  </div>
                </motion.div>

                {/* Roles */}
                <motion.div
                  className="text-center space-y-4 p-6 bg-gradient-to-br from-purple-500/15 to-pink-500/15 rounded-2xl border border-purple-500/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative w-14 h-14 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Shield className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-300 mb-1">Active Roles</p>
                    <p className="text-3xl font-bold text-white mb-2">{user.roles?.length || 0}</p>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {user.roles?.slice(0, 2).map((role: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-slate-700/60 text-gray-200 border-slate-600/50">
                          {role}
                        </Badge>
                      ))}
                      {user.roles && user.roles.length > 2 && (
                        <Badge variant="secondary" className="text-xs bg-slate-700/60 text-gray-200 border-slate-600/50">
                          +{user.roles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Sign-up Method */}
                <motion.div
                  className="text-center space-y-4 p-6 bg-gradient-to-br from-green-500/15 to-emerald-500/15 rounded-2xl border border-green-500/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20"></div>
                    <div className="relative w-14 h-14 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <UserCheck className="h-7 w-7 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-300 mb-1">Registration</p>
                    <p className="text-xl font-semibold text-white mb-1">
                      {user.signupMethod || 'Local'}
                    </p>
                    <p className="text-xs text-gray-400">Authentication Method</p>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
