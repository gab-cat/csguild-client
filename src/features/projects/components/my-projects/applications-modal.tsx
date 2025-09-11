'use client'

import { useMutation } from 'convex/react'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { Clock, CheckCircle, XCircle, User, MessageSquare, Calendar } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { api, Id } from '@/lib/convex'

import { hasReviewMessage } from '../../types'
import type { ProjectCardType, ReviewDecision } from '../../types'

interface ApplicationsModalProps {
  project: ProjectCardType
  onClose: () => void
}

export function ApplicationsModal({ project, onClose }: ApplicationsModalProps) {
  const [reviewingApplication, setReviewingApplication] = useState<string | null>(null)
  const [reviewMessages, setReviewMessages] = useState<Record<string, string>>({})
  const [showReviewForm, setShowReviewForm] = useState<Record<string, boolean>>({})
  
  // Use Convex queries and mutations directly
  // @ts-ignore
  const projectData = useQuery(api.projects.getProjectBySlug, { slug: project.slug })
  const applications = projectData?.applications || []
  const applicationsLoading = projectData === undefined
  const applicationsError = null // Convex handles errors differently

  const reviewApplicationMutation = useMutation(api.projects.reviewApplication)

  const handleReviewApplication = async (applicationId: string, decision: ReviewDecision) => {
    setReviewingApplication(applicationId)
    try {
      const reviewMessage = reviewMessages[applicationId] || (
        decision === 'APPROVED' ? 'Welcome to the project!' : 'Thank you for your interest.'
      )
      
      await reviewApplicationMutation({
        applicationId: applicationId as Id<'projectApplications'>,
        decision,
        reviewMessage,
      })
      
      // Clear the review form
      setReviewMessages(prev => {
        const newMessages = { ...prev }
        delete newMessages[applicationId]
        return newMessages
      })
      setShowReviewForm(prev => {
        const newForm = { ...prev }
        delete newForm[applicationId]
        return newForm
      })
    } finally {
      setReviewingApplication(null)
    }
  }

  const toggleReviewForm = (applicationId: string) => {
    setShowReviewForm(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }))
  }

  const updateReviewMessage = (applicationId: string, message: string) => {
    setReviewMessages(prev => ({
      ...prev,
      [applicationId]: message
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'PENDING':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'APPROVED':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'REJECTED':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'PENDING':
      return <Clock className="w-3 h-3" />
    case 'APPROVED':
      return <CheckCircle className="w-3 h-3" />
    case 'REJECTED':
      return <XCircle className="w-3 h-3" />
    default:
      return <Clock className="w-3 h-3" />
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pendingApplications = applications?.filter(app => app.status === 'PENDING') || []
  const reviewedApplications = applications?.filter(app => app.status !== 'PENDING') || []

  if (applicationsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="text-red-400 mb-4">
          <XCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-semibold mb-2">Failed to load applications</h2>
          <p className="text-gray-400">There was an error loading the applications. Please try again.</p>
        </div>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Close
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Applications</h2>
          <p className="text-gray-400">{project.title}</p>
          {applications && (
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{applications.length} total applications</span>
              <span>{pendingApplications.length} pending review</span>
              <span>{reviewedApplications.length} reviewed</span>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {applicationsLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-gray-900/50 border-gray-800">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-700" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                      <Skeleton className="h-3 w-24 bg-gray-700" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full bg-gray-700" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 bg-gray-700" />
                    <Skeleton className="h-8 w-20 bg-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : applications?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[40vh] text-center"
        >
          <User className="w-16 h-16 text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No applications yet</h3>
          <p className="text-gray-400">
            No one has applied to join this project yet. Share your project to attract applicants!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Pending Applications */}
          {pendingApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400" />
                Pending Review ({pendingApplications.length})
              </h3>
              <div className="space-y-4">
                {pendingApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/50 border-gray-800 hover:border-yellow-500/50 transition-colors">
                      <CardHeader className="">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={application.user?.imageUrl} alt={application.user?.username} />
                              <AvatarFallback className="bg-purple-500/20 text-purple-400">
                                {application.user?.firstName?.[0]}{application.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white">
                                  {application.user?.firstName || 'Unknown'} {application.user?.lastName || 'User'}
                                </h4>
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 text-xs">
                                  {application.role?.name || application.roleSlug}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400 flex items-center gap-1">
                                <User className="w-3 h-3" />
                                @{application.user?.username || 'unknown'}
                              </p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(application.status)} flex items-center gap-1`}>
                            {getStatusIcon(application.status)}
                            {application.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Main Content Row - Left to Right Layout */}
                        <div className="flex gap-6">
                          {/* Left Column - Application Details */}
                          <div className="flex-1 space-y-3">
                            {/* Application Message */}
                            {application.message && (
                              <div>
                                <p className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  Application Message:
                                </p>
                                <p className="text-gray-300 bg-gray-800/50 rounded-lg p-3 text-sm">
                                  {application.message}
                                </p>
                              </div>
                            )}

                            {/* Application Date */}
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              Applied on {application.appliedAt ? formatDate(application.appliedAt) : 'Unknown date'}
                            </div>
                          </div>

                          {/* Right Column - Review Actions */}
                          <div className="flex-shrink-0 w-80 space-y-3 mb-auto">
                            {/* Review Message Form */}
                            {showReviewForm[application.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3"
                              >
                                <Label className="text-sm text-gray-300 mb-2 block">Review Message</Label>
                                <Textarea
                                  value={reviewMessages[application.id] || ''}
                                  onChange={(e) => updateReviewMessage(application.id, e.target.value)}
                                  placeholder="Add a message to your review (optional)..."
                                  className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-400 min-h-[80px] resize-none rounded-lg focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                  maxLength={500}
                                />
                                <div className="text-xs text-gray-400 mt-1">
                                  {(reviewMessages[application.id] || '').length}/500 characters
                                </div>
                              </motion.div>
                            )}

                            {/* Action Buttons */}
                            <div className="space-y-2">
                              {!showReviewForm[application.id] && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleReviewForm(application.id)}
                                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Add Review Message
                                </Button>
                              )}
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleReviewApplication(application.id, 'APPROVED')}
                                  disabled={reviewingApplication === application.id}
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  {reviewingApplication === application.id ? 'Approving...' : 'Approve'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReviewApplication(application.id, 'REJECTED')}
                                  disabled={reviewingApplication === application.id}
                                  className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  {reviewingApplication === application.id ? 'Rejecting...' : 'Reject'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Reviewed Applications */}
          {reviewedApplications.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Reviewed Applications ({reviewedApplications.length})
              </h3>
              <div className="space-y-4">
                {reviewedApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (pendingApplications.length + index) * 0.1 }}
                  >
                    <Card className="bg-gray-900/30 border-gray-800 opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-6">
                          {/* Left Column - Application Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={application.user?.imageUrl} alt={application.user?.username} />
                                <AvatarFallback className="bg-gray-600 text-gray-300 text-xs">
                                  {application.user?.firstName?.[0]}{application.user?.lastName?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-gray-300">
                                  {application.user?.firstName || 'Unknown'} {application.user?.lastName || 'User'}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Applied for {application.role?.name || application.roleSlug}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column - Status and Review */}
                          <div className="flex-shrink-0 flex items-start gap-4">
                            {/* Review Message */}
                            {hasReviewMessage(application) && (
                              <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3 max-w-xs">
                                <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  Review Message:
                                </p>
                                <p className="text-gray-300 text-sm">
                                  {application.reviewMessage}
                                </p>
                              </div>
                            )}
                            
                            {/* Status Badge */}
                            <Badge className={`${getStatusColor(application.status)} flex items-center gap-1 text-xs`}>
                              {getStatusIcon(application.status)}
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
