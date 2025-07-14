'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle,
  Clock,
  HelpCircle,
  MessageSquare,
  XCircle,
  UserX,
} from 'lucide-react'

import { useCurrentUserMembershipStatus } from '../../hooks/use-projects-queries'
import type { ProjectCardType } from '../../types'

interface ExistingApplicationDisplayProps {
  existingApplication: {
    status: string
    roleSlug: string
    createdAt: string
    reviewMessage?: string
  }
  project: ProjectCardType
  isRemoved?: boolean
}

function hasReviewMessage(application: { reviewMessage?: string }): boolean {
  return Boolean(application.reviewMessage && application.reviewMessage.trim().length > 0)
}

export function ExistingApplicationDisplay({ existingApplication, project, isRemoved }: ExistingApplicationDisplayProps) {
  const { isRemoved: membershipIsRemoved, isActive } = useCurrentUserMembershipStatus(project.slug)
  
  // Use the passed isRemoved prop if available, otherwise use the hook result
  const userIsRemoved = isRemoved ?? membershipIsRemoved

  const getStatusInfo = () => {
    // Special case: User was approved but then removed from the project
    if (existingApplication.status === 'APPROVED' && userIsRemoved) {
      return {
        color: 'from-orange-600/20 to-red-600/20',
        iconBg: 'bg-orange-500/20',
        iconColor: 'text-orange-400',
        title: 'Membership Removed',
        message: 'You were previously approved for this project but have since been removed. To rejoin this project, please contact the project lead directly.',
        icon: UserX,
        showContactLead: true
      }
    }

    switch (existingApplication.status) {
    case 'PENDING':
      return {
        color: 'from-yellow-600/20 to-orange-600/20',
        iconBg: 'bg-yellow-500/20',
        iconColor: 'text-yellow-400',
        title: 'Application Submitted',
        message: 'Your application is currently under review. We\'ll notify you once the project owner makes a decision.',
        icon: Clock,
        showContactLead: false
      }
    case 'APPROVED':
      // Regular approved case (still active member)
      return {
        color: 'from-green-600/20 to-emerald-600/20',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-400',
        title: 'Application Approved',
        message: isActive 
          ? 'Congratulations! You are an active member of this project. You should receive further instructions from the project owner soon.'
          : 'Congratulations! Your application has been approved. You should receive further instructions from the project owner soon.',
        icon: CheckCircle,
        showContactLead: false
      }
    case 'REJECTED':
      return {
        color: 'from-red-600/20 to-pink-600/20',
        iconBg: 'bg-red-500/20',
        iconColor: 'text-red-400',
        title: 'Application Not Approved',
        message: 'Unfortunately, your application was not approved for this project. Don\'t be discouraged - there are many other opportunities available!',
        icon: XCircle,
        showContactLead: false
      }
    default:
      return {
        color: 'from-gray-600/20 to-gray-500/20',
        iconBg: 'bg-gray-500/20',
        iconColor: 'text-gray-400',
        title: 'Application Status Unknown',
        message: "We're having trouble determining your application status. Please try refreshing the page.",
        icon: HelpCircle,
        showContactLead: false
      }
    }
  }

  const statusInfo = getStatusInfo()
  const appliedRole = project.roles.find(role => role.role.slug === existingApplication.roleSlug)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div className={`absolute inset-0 bg-gradient-to-r ${statusInfo.color} rounded-2xl blur-xl`}></div>
      <div className="relative bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8">
        <div className="text-center">
          <div className={`w-16 h-16 ${statusInfo.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <statusInfo.icon className={`w-8 h-8 ${statusInfo.iconColor}`} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {statusInfo.title}
          </h3>
          <p className="text-gray-400 mb-6 leading-relaxed">
            {statusInfo.message}
          </p>
          
          {/* Application Details */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Application Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Applied for:</span>
                <span className="text-white">{appliedRole?.role.name || existingApplication.roleSlug}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Applied on:</span>
                <span className="text-white">
                  {new Date(existingApplication.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`${statusInfo.iconColor} font-medium capitalize`}>
                  {existingApplication.status.toLowerCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Review Message */}
          {hasReviewMessage(existingApplication) && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Review Message
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                {existingApplication.reviewMessage}
              </p>
            </div>
          )}

          {/* Action based on status */}
          {existingApplication.status === 'PENDING' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl">
              <p className="text-yellow-300 text-sm">
                <strong>What&apos;s next?</strong> The project owner will review your application and get back to you. 
                This usually takes 1-3 business days.
              </p>
            </div>
          )}

          {existingApplication.status === 'APPROVED' && !statusInfo.showContactLead && (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl">
              <p className="text-green-300 text-sm">
                <strong>Next steps:</strong> Check your email for project details and communication channels. 
                The project owner should contact you with further instructions.
              </p>
            </div>
          )}

          {existingApplication.status === 'REJECTED' && (
            <div className="bg-purple-500/10 border border-purple-500/30 p-4 rounded-xl">
              <p className="text-purple-300 text-sm">
                <strong>Keep exploring!</strong> Check out other projects that match your skills and interests. 
                Every application is a learning opportunity.
              </p>
            </div>
          )}

          {/* Contact Lead Option for Removed Members */}
          {statusInfo.showContactLead && (
            <div className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-xl">
              <div className="text-center">
                <p className="text-orange-300 text-sm mb-3">
                  <strong>Want to rejoin?</strong> Contact the project lead to discuss re-joining this project.
                </p>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                  <p className="text-gray-300 text-sm">
                    <strong>Project Lead:</strong> {project.owner?.firstName} {project.owner?.lastName}
                  </p>
                  <p className="text-purple-400 text-sm">
                    {project.owner?.email ?? project.owner?.username ?? 'No contact info available'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
