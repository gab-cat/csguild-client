'use client'

import type { UseMutationResult } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  User,
  MessageSquare,
  Shield,
  Check,
  Send,
} from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import { useRoleMemberCounts, getRoleMemberCount } from '../../hooks/use-role-member-counts'
import type { JoinProjectFormData } from '../../schemas'
import type { ProjectCardType, JoinProjectData, JoinProjectResponseDto } from '../../types'

interface ApplicationFormProps {
  project: ProjectCardType
  onSuccess?: () => void
  selectedRole: string
  setSelectedRole: (role: string) => void
  isRoleDropdownOpen: boolean
  setIsRoleDropdownOpen: (open: boolean) => void
  dropdownRef: React.RefObject<HTMLDivElement | null>
  joinProjectMutation: UseMutationResult<JoinProjectResponseDto, Error, JoinProjectData, unknown>
  form: UseFormReturn<JoinProjectFormData>
  messageValue: string
  acceptTerms: boolean
  selectedRoleInfo?: {
    requirements?: string
  }
  onSubmit: (data: JoinProjectFormData) => void
  setValue: (name: keyof JoinProjectFormData, value: string | boolean) => void
}

export function ApplicationForm({
  project,
  selectedRole,
  setSelectedRole,
  isRoleDropdownOpen,
  setIsRoleDropdownOpen,
  dropdownRef,
  joinProjectMutation,
  form,
  messageValue,
  acceptTerms,
  selectedRoleInfo,
  onSubmit,
  setValue
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form

  // Get role member counts to filter available positions
  const { roleMemberCounts, isLoading: isLoadingCounts } = useRoleMemberCounts(
    project.slug, 
    project.roles, 
    true
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <Label className="text-white font-semibold">Choose Your Role</Label>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full bg-gray-800/50 border border-gray-600 text-white px-4 py-3 rounded-xl flex items-center justify-between hover:bg-gray-700/50 hover:border-purple-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <span className={selectedRole ? 'text-white' : 'text-gray-400'}>
                  {selectedRole 
                    ? (project.roles.find(r => r.role.slug === selectedRole)?.role.name || selectedRole)
                    : 'Select a role to apply for'
                  }
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isRoleDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 right-0 z-20 mt-2 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  {isLoadingCounts ? (
                    <div className="px-4 py-6 text-center">
                      <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <div className="text-gray-400 text-sm">Loading available positions...</div>
                    </div>
                  ) : (
                    <>
                      {project.roles.filter(roleInfo => {
                        // Filter roles that have available positions
                        const memberCount = getRoleMemberCount(roleMemberCounts, roleInfo.roleSlug)
                        return memberCount.availablePositions > 0
                      }).map((roleInfo, index) => {
                        const memberCount = getRoleMemberCount(roleMemberCounts, roleInfo.roleSlug)
                        return (
                          <motion.button
                            key={roleInfo.role.slug}
                            type="button"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => {
                              const roleSlug = roleInfo.role.slug || roleInfo.role.name || ''
                              if (roleSlug) {
                                setSelectedRole(roleSlug)
                                setValue('roleSlug', roleSlug)
                                setIsRoleDropdownOpen(false)
                              }
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors text-white border-b border-gray-700 last:border-b-0 group"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-white group-hover:text-purple-300 transition-colors">
                                  {roleInfo.role.name || roleInfo.role.slug}
                                </div>
                                {roleInfo.requirements && (
                                  <div className="text-xs text-gray-400 mt-1 line-clamp-2 pr-2">
                                    {roleInfo.requirements}
                                  </div>
                                )}
                              </div>
                              <div className="text-right flex-shrink-0 ml-3">
                                <div className="text-sm font-medium text-green-400">
                                  {memberCount.availablePositions}/{roleInfo.maxMembers}
                                </div>
                                <div className="text-xs text-gray-400">available</div>
                              </div>
                            </div>
                          </motion.button>
                        )
                      })}
                      {project.roles.filter(roleInfo => {
                        const memberCount = getRoleMemberCount(roleMemberCounts, roleInfo.roleSlug)
                        return memberCount.availablePositions > 0
                      }).length === 0 && (
                        <div className="px-4 py-6 text-center">
                          <div className="text-gray-400 text-sm">
                            No positions available at the moment
                          </div>
                          <div className="text-gray-500 text-xs mt-1">
                            All roles are currently filled
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </div>
            {errors.roleSlug?.message && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.roleSlug.message}
              </p>
            )}
          </div>

          {/* Role Requirements Display */}
          {selectedRoleInfo?.requirements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl"
            >
              <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500/30 rounded flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                </div>
                Role Requirements
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {selectedRoleInfo?.requirements}
              </p>
            </motion.div>
          )}

          {/* Application Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-3 h-3 text-white" />
              </div>
              <Label className="text-white font-semibold">Your Application</Label>
            </div>
            <div className="relative">
              <Textarea
                {...register('message')}
                placeholder="Tell us about your experience, skills, and why you're excited about this project..."
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[120px] resize-none rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded">
                {messageValue?.length || 0}/500
              </div>
            </div>
            {errors.message?.message && (
              <p className="text-red-400 text-sm flex items-center gap-1">
                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                {errors.message.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Terms & Conditions</h4>
                  <div className="text-gray-400 text-sm space-y-2 leading-relaxed">
                    <p>By submitting this application, you agree to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Maintain professionalism and respect in all project communications</li>
                      <li>Commit to the project timeline and deliverables if accepted</li>
                      <li>Share relevant work progress and communicate any blockers promptly</li>
                      <li>Respect intellectual property and confidentiality requirements</li>
                      <li>Follow CS Guild&apos;s community guidelines and code of conduct</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0 mt-1">
                  <input
                    type="checkbox"
                    {...register('acceptTerms')}
                    className="sr-only peer"
                    id="acceptTerms"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="w-5 h-5 border-2 border-gray-600 rounded flex items-center justify-center cursor-pointer transition-all hover:border-purple-500/50 peer-checked:bg-gradient-to-br peer-checked:from-purple-500 peer-checked:to-pink-500 peer-checked:border-transparent group"
                  >
                    <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                  </label>
                </div>
                <label htmlFor="acceptTerms" className="text-gray-300 text-sm cursor-pointer leading-relaxed">
                  I have read and agree to the terms and conditions outlined above, and I understand my responsibilities as a potential project contributor.
                </label>
              </div>
              
              {errors.acceptTerms?.message && (
                <p className="text-red-400 text-sm flex items-center gap-1 mt-2">
                  <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                  {errors.acceptTerms.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={joinProjectMutation.isPending || !acceptTerms}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none"
          >
            {joinProjectMutation.isPending ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting Application...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Send className="w-5 h-5" />
                <span>Submit Application</span>
              </div>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
