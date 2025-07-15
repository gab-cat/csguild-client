'use client'

import { CheckIcon, ChevronsUpDownIcon, Loader2, Save, X, Plus } from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/use-debounce'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { useUpdateProject, useUpdateProjectStatus, useRoles, useCreateRole } from '../../hooks/use-projects-queries'
import type { ProjectCardType, ProjectStatus, ProjectRole } from '../../types'

const projectStatuses: { value: ProjectStatus; label: string }[] = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

interface UpdateProjectModalProps {
  project: ProjectCardType
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function UpdateProjectModal({ 
  project, 
  isOpen, 
  onClose, 
  onSuccess 
}: UpdateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: project.title,
    description: project.description,
    status: project.status as ProjectStatus,
    tags: project.tags || [],
    roles: (project.roles || []).map(role => ({
      roleSlug: role.role?.slug || '',
      maxMembers: role.maxMembers || 1,
      requirements: role.requirements || '',
    })) as ProjectRole[],
  })
  
  const [tagInput, setTagInput] = useState('')
  const [statusOpen, setStatusOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [newRoleDescription, setNewRoleDescription] = useState('')
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)

  // Debounce the search term for roles
  const debouncedRoleSearch = useDebounce(roleSearchTerm, 300)

  const updateProjectMutation = useUpdateProject()
  const updateStatusMutation = useUpdateProjectStatus()
  const createRoleMutation = useCreateRole()
  const { data: rolesData, isLoading: rolesLoading } = useRoles({
    search: debouncedRoleSearch || undefined,
  })

  const availableRoles = rolesData?.data || []

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddRole = (roleSlug: string) => {
    const roleExists = formData.roles.some(role => role.roleSlug === roleSlug)
    if (!roleExists) {
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, {
          roleSlug,
          maxMembers: 1,
          requirements: '',
        }]
      }))
    }
  }

  const handleRemoveRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }))
  }

  const handleRoleChange = (index: number, field: 'maxMembers' | 'requirements', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.map((role, i) => 
        i === index 
          ? { ...role, [field]: field === 'maxMembers' ? Number(value) : value }
          : role
      )
    }))
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return

    try {
      const newRole = await createRoleMutation.mutateAsync({
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined,
      })

      showSuccessToast(
        'Role Created',
        `Role "${newRoleName}" has been created successfully.`
      )

      // Add the newly created role to the project
      handleAddRole(newRole.role.slug)
      
      // Reset form
      setNewRoleName('')
      setNewRoleDescription('')
      setShowCreateRole(false)
    } catch {
      showErrorToast(
        'Role Creation Failed',
        'Failed to create new role. Please try again.'
      )
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Handle status update separately if it changed
      if (formData.status !== project.status) {
        await updateStatusMutation.mutateAsync({
          slug: project.slug,
          status: formData.status,
        })
      }

      // Update project details
      await updateProjectMutation.mutateAsync({
        slug: project.slug,
        data: {
          title: formData.title,
          description: formData.description,
          tags: formData.tags,
          roles: formData.roles,
        },
      })

      showSuccessToast(
        'Project Updated',
        'Your project has been successfully updated.'
      )
      
      onSuccess?.()
      onClose()
    } catch (error: unknown) {
      showErrorToast(
        'Update Failed',
        (error as Error).message || 'Failed to update project. Please try again.'
      )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl bg-gray-950 border-gray-800 !max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white">
              Update Project
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Description */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-200">
                Project Title
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project title"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={4}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Project Status
            </Label>
            <Popover open={statusOpen} onOpenChange={setStatusOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={statusOpen}
                  className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  {formData.status
                    ? projectStatuses.find((status) => status.value === formData.status)?.label
                    : "Select status..."}
                  <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                <Command className="bg-gray-800 border-gray-700">
                  <CommandInput 
                    placeholder="Search status..." 
                    className="bg-gray-800 text-white placeholder:text-gray-400"
                  />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      {projectStatuses.map((status) => (
                        <CommandItem
                          key={status.value}
                          value={status.value}
                          onSelect={(currentValue) => {
                            setFormData(prev => ({
                              ...prev,
                              status: currentValue as ProjectStatus
                            }))
                            setStatusOpen(false)
                          }}
                          className="text-white hover:bg-gray-700"
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.status === status.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {status.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Tags Management */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-200">
              Technology Tags
            </Label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a technology tag..."
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gray-700 text-gray-200 hover:bg-gray-600"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2 text-gray-400 hover:text-white"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Roles Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-200">
                Project Roles
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateRole(!showCreateRole)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create New Role
              </Button>
            </div>

            {showCreateRole && (
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Role Name</Label>
                    <Input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g., Frontend Developer"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Description</Label>
                    <Input
                      type="text"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Optional description"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleCreateRole}
                    disabled={!newRoleName.trim() || createRoleMutation.isPending}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {createRoleMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin mr-1" />
                    ) : (
                      <Plus className="w-3 h-3 mr-1" />
                    )}
                    Create Role
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateRole(false)
                      setNewRoleName('')
                      setNewRoleDescription('')
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Existing Roles */}
            <div className="space-y-3">
              {formData.roles.map((role, index) => {
                const roleInfo = availableRoles.find(r => r.slug === role.roleSlug)
                return (
                  <div key={index} className="p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {roleInfo?.name || role.roleSlug}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs font-medium text-gray-300">Max Members</Label>
                        <Input
                          type="number"
                          min="1"
                          value={role.maxMembers}
                          onChange={(e) => handleRoleChange(index, 'maxMembers', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-300">Requirements</Label>
                        <Input
                          type="text"
                          value={role.requirements}
                          onChange={(e) => handleRoleChange(index, 'requirements', e.target.value)}
                          placeholder="Role requirements..."
                          className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add Existing Role */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-300">Add Existing Role</Label>
              <Popover open={roleDropdownOpen} onOpenChange={setRoleDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                    disabled={rolesLoading}
                  >
                    {rolesLoading ? 'Loading roles...' : 'Select a role to add...'}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                  <Command className="bg-gray-800 border-gray-700">
                    <CommandInput 
                      placeholder="Search roles..." 
                      className="bg-gray-800 text-white placeholder:text-gray-400"
                      value={roleSearchTerm}
                      onValueChange={setRoleSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {rolesLoading ? 'Searching roles...' : 'No roles found.'}
                      </CommandEmpty>
                      <CommandGroup>
                        {availableRoles
                          .filter(role => !formData.roles.some(projectRole => projectRole.roleSlug === role.slug))
                          .map((role) => (
                            <CommandItem
                              key={role.slug}
                              value={role.slug}
                              onSelect={() => {
                                handleAddRole(role.slug)
                                setRoleDropdownOpen(false)
                                setRoleSearchTerm('')
                              }}
                              className="text-white hover:bg-gray-700"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{role.name}</span>
                                {role.description && (
                                  <span className="text-xs text-gray-400">{String(role.description)}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateProjectMutation.isPending || updateStatusMutation.isPending}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProjectMutation.isPending || updateStatusMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {(updateProjectMutation.isPending || updateStatusMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Update Project
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
