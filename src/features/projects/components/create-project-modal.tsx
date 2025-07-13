'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Loader2, Plus, Tag, Trash2, Users, X, CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { showSuccessToast, showErrorToast } from '@/lib/toast';
import { cn } from '@/lib/utils';

import { useCreateProject } from '../hooks/use-projects-queries';
import { useRoles } from '../hooks/use-projects-queries';
import { createProjectSchema } from '../schemas';
import type { CreateProjectData } from '../types';

interface CreateProjectModalProps {
  onClose: () => void;
}

export function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: '',
    description: '',
    tags: [],
    dueDate: '',
    roles: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newRole, setNewRole] = useState({ slug: '', maxMembers: 1, requirements: '' });
  const [roleComboboxOpen, setRoleComboboxOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  const debouncedRoleSearch = useDebounce(roleSearchQuery, 500);

  const { mutate: createProject, isPending } = useCreateProject();
  const { data: rolesData, isLoading: isLoadingRoles } = useRoles({
    search: debouncedRoleSearch || undefined,
  });

  const validateForm = () => {
    try {
      createProjectSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      const fieldErrors: Record<string, string> = {};
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as { errors: Array<{ path: string[]; message: string }> };
        zodError.errors.forEach((err) => {
          if (err.path) {
            fieldErrors[err.path.join('.')] = err.message;
          }
        });
      }
      setErrors(fieldErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    createProject(formData, {
      onSuccess: () => {
        showSuccessToast('Project created successfully!');
        onClose();
      },
      onError: (error: unknown) => {
        showErrorToast('Failed to create project', error instanceof Error ? error.message : 'An error occurred');
      },
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addRole = () => {
    if (newRole.slug.trim() && newRole.maxMembers > 0) {
      setFormData(prev => ({
        ...prev,
        roles: [
          ...prev.roles,
          {
            roleSlug: newRole.slug.trim(),
            maxMembers: newRole.maxMembers,
            requirements: newRole.requirements.trim() || undefined,
          },
        ],
      }));
      setNewRole({ slug: '', maxMembers: 1, requirements: '' });
    }
  };

  const removeRole = (roleSlug: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.filter(role => role.roleSlug !== roleSlug),
    }));
  };

  return (
    <div className="w-full">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold text-white">
          Post New Project
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form Fields */}
          <div className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-gray-200">
                Project Name *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter project name"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              {errors.title && (
                <p className="text-red-400 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-gray-200">
                Due Date (Optional)
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white pl-10"
                />
              </div>
              {errors.dueDate && (
                <p className="text-red-400 text-sm">{errors.dueDate}</p>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-200">
                Tags
              </Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1 bg-purple-600/20 text-purple-300 px-2 py-1 rounded-md text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </div>

            {/* Role Requirements */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-200">
                Role Requirements
              </Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Popover 
                      open={roleComboboxOpen} 
                      onOpenChange={(open) => {
                        setRoleComboboxOpen(open);
                        if (!open) {
                          setRoleSearchQuery(''); // Clear search when combobox closes
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={roleComboboxOpen}
                          className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                        >
                          {newRole.slug
                            ? rolesData?.data?.find((role) => role.slug === newRole.slug)?.name || newRole.slug
                            : "Select role..."}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-700">
                        <Command>
                          <CommandInput 
                            placeholder="Search roles..." 
                            className="bg-gray-800 border-gray-700 text-white"
                            value={roleSearchQuery}
                            onValueChange={setRoleSearchQuery}
                          />
                          <CommandList>
                            <CommandEmpty className="text-gray-400 p-4">
                              {isLoadingRoles ? "Loading roles..." : "No role found."}
                            </CommandEmpty>
                            <CommandGroup>
                              {rolesData?.data?.map((role) => (
                                <CommandItem
                                  key={role.slug}
                                  value={role.slug}
                                  onSelect={(currentValue) => {
                                    setNewRole(prev => ({ 
                                      ...prev, 
                                      slug: currentValue === newRole.slug ? "" : currentValue 
                                    }));
                                    setRoleComboboxOpen(false);
                                    setRoleSearchQuery(''); // Clear search when role is selected
                                  }}
                                  className="text-white hover:bg-gray-700 cursor-pointer"
                                >
                                  <CheckIcon
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      newRole.slug === role.slug ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {role.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input
                    type="number"
                    value={newRole.maxMembers}
                    onChange={(e) => setNewRole(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 1 }))}
                    min="1"
                    max="10"
                    className="bg-gray-800 border-gray-700 text-white w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newRole.requirements}
                    onChange={(e) => setNewRole(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Requirements (optional)"
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                  <Button
                    type="button"
                    onClick={addRole}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {formData.roles.length > 0 && (
                <div className="space-y-2 mt-2">
                  {formData.roles.map((role) => {
                    const roleData = rolesData?.data?.find(r => r.slug === role.roleSlug);
                    return (
                      <motion.div
                        key={role.roleSlug}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{roleData?.name || role.roleSlug}</span>
                          <span className="text-gray-400">×{role.maxMembers}</span>
                          {role.requirements && (
                            <span className="text-gray-400 text-sm">({role.requirements})</span>
                          )}
                        </div>
                        <Button
                          type="button"
                          onClick={() => removeRole(role.roleSlug)}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Description Textarea */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-200">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your project, goals, and what you're looking for in team members..."
              rows={20}
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 resize-none h-full min-h-[500px]"
            />
            {errors.description && (
              <p className="text-red-400 text-sm">{errors.description}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
