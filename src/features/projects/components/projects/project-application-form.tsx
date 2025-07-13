'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { AuthGuard } from '@/components/shared/auth-guard'
import { showSuccessToast, showErrorToast } from '@/lib/toast'

import { useJoinProject, useMyApplications } from '../../hooks/use-projects-queries'
import { joinProjectSchema, type JoinProjectFormData } from '../../schemas'
import type { ProjectCardType } from '../../types'


import { ApplicationForm } from './application-form'
import { ExistingApplicationDisplay } from './existing-application-display'
import { ProjectClosedDisplay } from './project-closed-display'

interface ProjectApplicationFormProps {
  project: ProjectCardType
  onSuccess?: () => void
}

export function ProjectApplicationForm({ project, onSuccess }: ProjectApplicationFormProps) {
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const joinProjectMutation = useJoinProject()
  const { data: myApplicationsData, isLoading: isLoadingApplications } = useMyApplications()

  const form = useForm<JoinProjectFormData>({
    resolver: zodResolver(joinProjectSchema),
    defaultValues: {
      projectSlug: project.slug,
      roleSlug: '',
      message: '',
      acceptTerms: false,
    },
  })

  const {
    reset,
    setValue,
    watch,
  } = form

  const messageValue = watch('message')
  const acceptTerms = watch('acceptTerms')

  // Check if user has already applied to this project
  const existingApplication = myApplicationsData?.applications?.find(
    app => app.projectSlug === project.slug
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const onSubmit = async (data: JoinProjectFormData) => {
    try {
      // Remove acceptTerms from the data sent to API as it's not part of the API schema
      const apiData = {
        projectSlug: data.projectSlug,
        roleSlug: data.roleSlug,
        message: data.message,
      }
      await joinProjectMutation.mutateAsync(apiData)
      showSuccessToast('Application Submitted', 'Your application has been sent to the project owner for review.')
      reset({
        projectSlug: project.slug,
        roleSlug: '',
        message: '',
        acceptTerms: false,
      })
      setSelectedRole('')
      onSuccess?.()
    } catch {
      showErrorToast('Application Failed', 'There was an error submitting your application. Please try again.')
    }
  }

  const selectedRoleInfo = project.roles.find(role => role.role.slug === selectedRole)
  const isProjectOpen = project.status === 'OPEN'

  // Show loading state while checking applications
  if (isLoadingApplications) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-500/20 rounded-2xl blur-xl"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Loading...
          </h3>
          <p className="text-gray-400">
            Checking your application status...
          </p>
        </div>
      </div>
    )
  }

  // Show project closed state if not open
  if (!isProjectOpen) {
    return <ProjectClosedDisplay />
  }

  return (
    <AuthGuard
      title="Join This Project"
      description="Sign in to your CS Guild account to apply for this project and start collaborating with other developers."
    >
      {/* Show existing application if user has already applied */}
      {existingApplication ? (
        <ExistingApplicationDisplay 
          existingApplication={existingApplication}
          project={project}
        />
      ) : (
        <ApplicationForm 
          project={project}
          onSuccess={onSuccess}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          isRoleDropdownOpen={isRoleDropdownOpen}
          setIsRoleDropdownOpen={setIsRoleDropdownOpen}
          dropdownRef={dropdownRef}
          joinProjectMutation={joinProjectMutation}
          form={form}
          messageValue={messageValue}
          acceptTerms={acceptTerms}
          selectedRoleInfo={selectedRoleInfo}
          onSubmit={onSubmit}
          setValue={setValue}
        />
      )}
    </AuthGuard>
  )
}
