'use client'

import { useMutation, useQuery } from 'convex/react'
import { 
  CheckIcon, 
  ChevronsUpDownIcon, 
  Loader2, 
  Save, 
  X, 
  Plus,
  FileText,
  Info,
  Hash,
  Lightbulb,
  Target,
  Settings,
  Tag,
  Users,
  Trash2
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/use-debounce'
import { showSuccessToast, showErrorToast } from '@/lib/toast'
import { cn } from '@/lib/utils'

import { api } from '../../../../../convex/_generated/api'
import type { ProjectCardType, ProjectStatus, ProjectRoleFormData } from '../../types'

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
    })) as ProjectRoleFormData[],
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
  // @ts-ignore
  const updateProjectMutation = useMutation(api.projects.updateProject)
  const createRoleMutation = useMutation(api.projects.createRole)
  const rolesData = useQuery(api.projects.getRoles, {
    search: debouncedRoleSearch || undefined,
  })

  const availableRoles = rolesData?.data || []
  const rolesLoading = rolesData === undefined

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
      const newRole: ProjectRoleFormData = {
        roleSlug,
        maxMembers: 1,
        requirements: '',
      }
      setFormData(prev => ({
        ...prev,
        roles: [...prev.roles, newRole]
      }))
    }
  }

  const handleRemoveRole = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }))
  }

  const handleRoleChange = (index: number, field: keyof ProjectRoleFormData, value: string | number) => {
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
      const newRole = await createRoleMutation({
        name: newRoleName.trim(),
        description: newRoleDescription.trim() || undefined,
      })

      showSuccessToast(
        'Role Created',
        `Role "${newRoleName}" has been created successfully.`
      )

      // Add the newly created role to the project
      handleAddRole(newRole.slug)
      
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
      // Update project details
      await updateProjectMutation({
        slug: project.slug,
        title: formData.title,
        description: formData.description,
        tags: formData.tags,
        roles: formData.roles,
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
      <DialogContent className="!max-w-7xl bg-gray-950 border-gray-800 !max-h-[90vh] overflow-y-auto">
        {/* Enhanced Header */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white">
                  Update Project
                </DialogTitle>
                <p className="text-gray-400 text-sm">
                  Modify your project details and keep your team updated
                </p>
              </div>
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center gap-1 text-blue-400 text-sm">
                <Target className="w-3 h-3" />
                <span>Project Settings</span>
              </div>
              <div className="w-2 h-px bg-gray-600"></div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Users className="w-3 h-3" />
                <span>Team Management</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Form Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Main Form Fields */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* Project Basics Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-3 h-3 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Project Basics</h3>
                </div>

                {/* Project Title */}
                <div className="space-y-2">
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Project Title *"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Update your project name to reflect current scope or direction
                  </p>
                </div>

                {/* Project Status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-gray-200">Project Status</span>
                  </div>
                  <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={statusOpen}
                        className="w-full justify-between bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 focus:ring-2 focus:ring-green-500/50"
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4 text-green-400" />
                          {formData.status
                            ? projectStatuses.find((status) => status.value === formData.status)?.label
                            : "Select status..."}
                        </div>
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
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Keep your team informed about project progress
                  </p>
                </div>
              </div>

              {/* Technology Stack Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Hash className="w-3 h-3 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Technology Stack</h3>
                </div>

                {/* Tags Management */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                      <Input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add Technology/Skill (e.g., React, TypeScript, Node.js)"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all pl-10"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white border-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Update your tech stack to reflect current project requirements
                  </p>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-orange-600/20 text-orange-300 hover:bg-orange-600/30 border border-orange-500/30 px-3 py-1.5"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2 text-orange-400 hover:text-red-400 transition-colors"
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
            </div>

            {/* Right Column - Description and Team Management */}
            <div className="space-y-6">
              {/* Project Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                    Project Description *
                  </Label>
                </div>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project goals, current progress, and what you're looking for in team members..."
                  rows={18}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  required
                />
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Keep your team informed about project evolution and current needs
                </p>
              </div>

              {/* Update Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-semibold text-blue-300">Update Best Practices</h4>
                </div>
                <ul className="space-y-2 text-xs text-blue-200">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Communicate major changes to your team first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Update status regularly to keep contributors engaged</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Adjust role requirements based on project evolution</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Team Structure Section */}
          <div className="space-y-6 pt-6 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Team Structure</h3>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateRole(!showCreateRole)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-2 focus:ring-green-500/50"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create New Role
              </Button>
            </div>

            {showCreateRole && (
              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="w-4 h-4 text-green-400" />
                  <h4 className="text-sm font-semibold text-green-300">Create New Role</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Role Name *</Label>
                    <Input
                      type="text"
                      value={newRoleName}
                      onChange={(e) => setNewRoleName(e.target.value)}
                      placeholder="e.g., Frontend Developer"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-300">Description</Label>
                    <Input
                      type="text"
                      value={newRoleDescription}
                      onChange={(e) => setNewRoleDescription(e.target.value)}
                      placeholder="Optional description"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleCreateRole}
                    disabled={!newRoleName.trim()}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {false ? (
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
                    className="text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Existing Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.roles.map((role, index) => {
                const roleInfo = availableRoles.find(r => r.slug === role.roleSlug)
                return (
                  <div key={index} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:border-green-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-white font-medium text-sm flex-1">
                          {roleInfo?.name || role.roleSlug}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Max:</span>
                          <Input
                            type="number"
                            min="1"
                            value={role.maxMembers}
                            onChange={(e) => handleRoleChange(index, 'maxMembers', e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white focus:ring-2 focus:ring-green-500/50 w-16 h-8 text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRole(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-gray-300">Requirements</Label>
                      <Input
                        type="text"
                        value={role.requirements}
                        onChange={(e) => handleRoleChange(index, 'requirements', e.target.value)}
                        placeholder="Role requirements..."
                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-green-500/50"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Add Existing Role */}
            <div className="bg-gray-800/20 border border-gray-700/30 rounded-lg p-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-green-400" />
                  Add Existing Role
                </Label>
                <Popover open={roleDropdownOpen} onOpenChange={setRoleDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 focus:ring-2 focus:ring-green-500/50"
                      disabled={rolesLoading}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-green-400" />
                        {rolesLoading ? 'Loading roles...' : 'Select a role to add...'}
                      </div>
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
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Choose from existing roles or create new ones to match your project needs
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Submit Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-700/50">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Info className="w-4 h-4" />
              <span>Changes will be applied immediately after saving</span>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={false}
                className="flex-1 sm:flex-none border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={false}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
              >
                {false ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Project...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
