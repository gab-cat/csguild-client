'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Info, 
  Shield, 
  UserCheck,
  Clock,
  Mail,
  CreditCard,
  Settings,
  Save,
  X,
  Edit3,
  Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { showErrorToast, showInfoToast } from '@/lib/toast'

import { useCurrentUser, useUpdateProfile, useResendEmailVerification } from '../hooks'
import { updateProfileSchema, type UpdateProfileFormData } from '../schemas'
import { formatDate, formatRelativeTime, getUserInitials, formatDateForInput } from '../utils'

import { ProfileSkeleton } from './profile-skeleton'

export function UserProfilePage() {
  const { user, isAuthenticated, isLoading } = useCurrentUser()
  const updateProfileMutation = useUpdateProfile()
  const resendVerificationMutation = useResendEmailVerification()
  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({})

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
      course: user?.course || '',
      birthdate: formatDateForInput(user?.birthdate),
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        course: user.course || '',
        birthdate: formatDateForInput(user.birthdate),
      })
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
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      course: user.course || '',
      birthdate: formatDateForInput(user.birthdate),
    })
  }

  const cancelEditing = (section: string) => {
    setEditingSections(prev => ({ ...prev, [section]: false }))
    // Reset form to current user values
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      email: user.email || '',
      course: user.course || '',
      birthdate: formatDateForInput(user.birthdate),
    })
  }

  const saveSection = async (section: string) => {
    const isValid = await form.trigger()
    if (!isValid) {
      showErrorToast('Validation Error', 'Please fix the validation errors before saving.')
      return
    }

    const formData = form.getValues()
    const updateData: Record<string, string> = {}

    // Only include changed fields
    if (section === 'personal') {
      if (formData.firstName !== user.firstName) updateData.firstName = formData.firstName || ''
      if (formData.lastName !== user.lastName) updateData.lastName = formData.lastName || ''
      if (formData.course !== user.course) updateData.course = formData.course || ''
      // Compare formatted dates to avoid false positives
      if (formData.birthdate !== formatDateForInput(user.birthdate)) {
        updateData.birthdate = formData.birthdate || ''
      }
    } else if (section === 'account') {
      if (formData.username !== user.username) updateData.username = formData.username || ''
      if (formData.email !== user.email) updateData.email = formData.email || ''
    }

    // Only make API call if there are changes
    if (Object.keys(updateData).length > 0) {
      try {
        await updateProfileMutation.mutateAsync(updateData)
        setEditingSections(prev => ({ ...prev, [section]: false }))
      } catch (error) {
        console.error('Failed to update profile:', error)
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
      await resendVerificationMutation.mutateAsync({ email: user.email })
    } catch (error) {
      console.error('Failed to resend verification:', error)
    }
  }

  const formatAccountAge = () => {
    try {
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
    <div className="max-w-6xl w-6xl mx-auto p-6 space-y-8">
      {/* Sleek Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <Card className="bg-gradient-to-r from-gray-900/95 via-purple-900/20 to-pink-900/20 border-gray-700/50 backdrop-blur-md shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              {/* Compact Avatar */}
              <div className="relative">
                <Avatar className="w-16 h-16 ring-2 ring-purple-500/30 ring-offset-2 ring-offset-gray-900 transition-all duration-300 hover:ring-purple-400/50 rounded-full border-0">
                  <AvatarImage 
                    src={user.imageUrl} 
                    alt={`${user.firstName} ${user.lastName}`}
                    className="rounded-full object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-pink-500 to-violet-500 text-white text-xl font-bold">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <UserCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Compact User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-white truncate">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center gap-2 text-xs">
                    {user.emailVerified && (
                      <Badge className="bg-green-600/80 hover:bg-green-600 px-2 py-0.5 text-xs">
                        Verified
                      </Badge>
                    )}
                    {user.hasRfidCard && (
                      <Badge className="bg-blue-600/80 hover:bg-blue-600 px-2 py-0.5 text-xs">
                        <CreditCard className="w-3 h-3 mr-1" />
                        RFID
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                  <span className="font-medium">@{user.username}</span>
                  <span className="text-gray-400">•</span>
                  <span>{user.course || 'No course specified'}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>Joined {formatRelativeTime(user.createdAt)}</span>
                  {user.roles.length > 0 && (
                    <>
                      <span>•</span>
                      <Shield className="w-3 h-3" />
                      <span>{user.roles.length} role{user.roles.length > 1 ? 's' : ''}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Verification Action */}
              {!user.emailVerified && (
                <div className="flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-yellow-500/50 hover:bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1.5"
                    onClick={handleResendVerification}
                    disabled={resendVerificationMutation.isPending}
                  >
                    {resendVerificationMutation.isPending ? (
                      <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    ) : (
                      <Mail className="w-3 h-3 mr-1.5" />
                    )}
                    Verify Email
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Personal Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Manage your personal details and preferences
                </CardDescription>
              </div>
              {!editingSections.personal ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing('personal')}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelEditing('personal')}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveSection('personal')}
                    disabled={updateProfileMutation.isPending}
                    className="text-gray-400 hover:text-green-400"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    {editingSections.personal ? (
                      <Input
                        id="firstName"
                        {...form.register('firstName')}
                        className="bg-gray-800/50 border-gray-600"
                        placeholder="Enter first name"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                        {user.firstName || 'Not provided'}
                      </p>
                    )}
                    {form.formState.errors.firstName && (
                      <p className="text-sm text-red-400">{form.formState.errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    {editingSections.personal ? (
                      <Input
                        id="lastName"
                        {...form.register('lastName')}
                        className="bg-gray-800/50 border-gray-600"
                        placeholder="Enter last name"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                        {user.lastName || 'Not provided'}
                      </p>
                    )}
                    {form.formState.errors.lastName && (
                      <p className="text-sm text-red-400">{form.formState.errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course" className="text-gray-300">Course/Program</Label>
                  {editingSections.personal ? (
                    <Input
                      id="course"
                      {...form.register('course')}
                      className="bg-gray-800/50 border-gray-600"
                      placeholder="e.g., Computer Science"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                      {user.course || 'Not provided'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate" className="text-gray-300">Birthdate</Label>
                  {editingSections.personal ? (
                    <Input
                      id="birthdate"
                      type="date"
                      {...form.register('birthdate')}
                      className="bg-gray-800/50 border-gray-600"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                      {user.birthdate ? formatDate(user.birthdate) : 'Not provided'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gray-900/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-400" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Configure your account credentials and preferences
                </CardDescription>
              </div>
              {!editingSections.account ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEditing('account')}
                  className="text-gray-400 hover:text-white"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => cancelEditing('account')}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => saveSection('account')}
                    disabled={updateProfileMutation.isPending}
                    className="text-gray-400 hover:text-green-400"
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  {editingSections.account ? (
                    <Input
                      id="username"
                      {...form.register('username')}
                      className="bg-gray-800/50 border-gray-600"
                      placeholder="Enter username"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                      @{user.username}
                    </p>
                  )}
                  {form.formState.errors.username && (
                    <p className="text-sm text-red-400">{form.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  {editingSections.account ? (
                    <Input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="bg-gray-800/50 border-gray-600"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-800/30 rounded-md text-white">
                      {user.email}
                    </p>
                  )}
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <Separator className="bg-gray-700" />

                {/* Account Status */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-300">Account Status</h4>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">Email Verification</span>
                    </div>
                    <Badge
                      variant={user.emailVerified ? 'default' : 'destructive'}
                      className={user.emailVerified 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                      }
                    >
                      {user.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">RFID Card</span>
                    </div>
                    <Badge
                      variant={user.hasRfidCard ? 'default' : 'outline'}
                      className={user.hasRfidCard 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'border-gray-600 text-gray-400'
                      }
                    >
                      {user.hasRfidCard ? 'Registered' : 'Not Registered'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Statistics Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              Account Overview
            </CardTitle>
            <CardDescription>
              Your account statistics and activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {/* Account Age */}
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Member Since</p>
                  <p className="text-2xl font-bold text-white">{formatAccountAge()}</p>
                  <p className="text-xs text-gray-500">{formatDate(user.createdAt)}</p>
                </div>
              </div>
              
              {/* Roles */}
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Active Roles</p>
                  <p className="text-2xl font-bold text-white">{user.roles.length}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {user.roles.slice(0, 2).map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                    {user.roles.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{user.roles.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sign-up Method */}
              <div className="text-center space-y-3 p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Registration</p>
                  <p className="text-lg font-semibold text-white">
                    {user.signupMethod || 'Local'}
                  </p>
                  <p className="text-xs text-gray-500">Authentication Method</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
