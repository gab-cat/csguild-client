'use client';

import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Loader2, 
  Plus, 
  Tag, 
  Trash2, 
  Users, 
  X, 
  CheckIcon, 
  ChevronsUpDownIcon,
  FileText,
  Info,
  Hash,
  AlertTriangle,
  Shield,
  BookOpen,
  Lightbulb,
  Target,
  Rocket
} from 'lucide-react';
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
import { DialogTitle } from '@/components/ui/dialog';
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
    <div className="w-full max-w-7xl mx-auto">
      {/* Enhanced Header */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg blur-xl"></div>
        <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                Create New Project
              </DialogTitle>
              <p className="text-gray-400 text-sm">
                Bring your vision to life and find the perfect team to make it happen
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex items-center gap-1 text-purple-400 text-sm">
              <Target className="w-3 h-3" />
              <span>Project Details</span>
            </div>
            <div className="w-2 h-px bg-gray-600"></div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Users className="w-3 h-3" />
              <span>Team Structure</span>
            </div>
            <div className="w-2 h-px bg-gray-600"></div>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Rocket className="w-3 h-3" />
              <span>Launch</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Enhanced Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Form Fields */}
          <div className="xl:col-span-2 space-y-8">
            {/* Project Basics Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-3 h-3 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Project Basics</h3>
              </div>

              {/* Project Name */}
              <div className="space-y-2">
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Project Name * (e.g., AI-Powered Task Manager, E-commerce Platform)"
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all pl-10"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Choose a clear, descriptive name that reflects your project&apos;s purpose
                </p>
                {errors.title && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400" />
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="bg-gray-800/50 border-gray-700 text-white pl-10 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    title="Project Deadline (Optional)"
                  />
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Set a realistic deadline to help manage expectations and attract committed contributors
                </p>
                {errors.dueDate && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {errors.dueDate}
                  </p>
                )}
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

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-orange-400" />
                    <Input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add Technology/Skill (e.g., React, TypeScript, Node.js, Python, UI/UX)"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all pl-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={addTag}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white border-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  Add technologies, frameworks, and skills relevant to your project
                </p>
                
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
                    {formData.tags.map((tag, index) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="inline-flex items-center gap-1 bg-orange-600/20 text-orange-300 px-3 py-1.5 rounded-full text-sm border border-orange-500/30 hover:bg-orange-600/30 transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-400 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Team Structure Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Team Structure</h3>
              </div>

              {/* Role Requirements */}
              <div className="space-y-2">
                <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Popover 
                        open={roleComboboxOpen} 
                        onOpenChange={(open) => {
                          setRoleComboboxOpen(open);
                          if (!open) {
                            setRoleSearchQuery('');
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={roleComboboxOpen}
                            className="w-full justify-between bg-gray-800 border-gray-700 text-white hover:bg-gray-700 focus:ring-2 focus:ring-green-500/50"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-green-400" />
                              {newRole.slug
                                ? rolesData?.data?.find((role) => role.slug === newRole.slug)?.name || newRole.slug
                                : "Select role..."}
                            </div>
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
                                      setRoleSearchQuery('');
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
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        type="number"
                        value={newRole.maxMembers}
                        onChange={(e) => setNewRole(prev => ({ ...prev, maxMembers: parseInt(e.target.value) || 1 }))}
                        min="1"
                        max="10"
                        className="bg-gray-800 border-gray-700 text-white w-20 pl-8 focus:ring-2 focus:ring-green-500/50"
                        title="Number of positions"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={newRole.requirements}
                      onChange={(e) => setNewRole(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Role requirements (e.g., 3+ years React experience, UI/UX portfolio required)"
                      className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-green-500/50 transition-all"
                    />
                    <Button
                      type="button"
                      onClick={addRole}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white border-0"
                      disabled={!newRole.slug.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Define the roles you need and specific requirements for each position
                  </p>
                </div>

                {formData.roles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Added Roles ({formData.roles.length})
                    </h4>
                    {formData.roles.map((role, index) => {
                      const roleData = rolesData?.data?.find(r => r.slug === role.roleSlug);
                      return (
                        <motion.div
                          key={role.roleSlug}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg border border-gray-700/50 hover:border-green-500/30 transition-all"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                              <Users className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{roleData?.name || role.roleSlug}</span>
                                <span className="text-green-400 text-sm bg-green-500/20 px-2 py-1 rounded">×{role.maxMembers}</span>
                              </div>
                              {role.requirements && (
                                <p className="text-gray-400 text-sm mt-1">{role.requirements}</p>
                              )}
                            </div>
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
          </div>

          {/* Right Column - Description and Guidelines */}
          <div className="space-y-6">
            {/* Project Description */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <Label htmlFor="description" className="text-sm font-medium text-gray-200">
                  Project Description *
                </Label>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={`Describe your project in detail...

• What problem does it solve?
• What are the main features?
• What's your vision for the project?
• What experience level are you looking for?
• Any specific requirements or preferences?

Example: "We're building a modern task management app that helps remote teams stay organized. Looking for passionate developers to join our journey..."`}
                rows={22}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none h-full min-h-[500px] focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" />
                A detailed description attracts better contributors and sets clear expectations
              </p>
              {errors.description && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-blue-300">Tips for Success</h4>
              </div>
              <ul className="space-y-2 text-xs text-blue-200">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Be specific about your tech stack and requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include links to mockups, designs, or repositories if available</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mention your timeline and commitment expectations</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Highlight what contributors can learn or gain</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instructions and Guidelines */}
        <div className="space-y-6 pt-6 border-t border-gray-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project Guidelines */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <h4 className="text-sm font-semibold text-purple-300">Project Guidelines</h4>
              </div>
              <ul className="space-y-2 text-xs text-purple-200">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Ensure your project idea is original and feasible</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Provide clear communication channels (Discord, Slack, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Be responsive to applications and questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>Set up proper project management tools (GitHub, Trello, etc.)</span>
                </li>
              </ul>
            </div>

            {/* Community Standards */}
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-400" />
                <h4 className="text-sm font-semibold text-green-300">Community Standards</h4>
              </div>
              <ul className="space-y-2 text-xs text-green-200">
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Maintain a respectful and inclusive environment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Give proper credit to all contributors</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Follow intellectual property and licensing guidelines</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckIcon className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Resolve conflicts through constructive communication</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h4 className="text-sm font-semibold text-yellow-300">Terms & Conditions</h4>
            </div>
            <div className="space-y-3 text-xs text-gray-300">
              <p>
                By creating this project, you agree to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Provide accurate information about your project and requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Respect intellectual property rights and open-source licenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Maintain professional communication with all contributors</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Not use the platform for commercial recruitment without proper authorization</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Report any violations of community guidelines to the moderators</span>
                </li>
              </ul>
              <p className="pt-2 text-gray-400">
                Projects that violate these terms may be removed without notice. For questions, contact our support team.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Submit Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Info className="w-4 h-4" />
            <span>All fields marked with * are required</span>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 sm:flex-none border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Project...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Launch Project
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
