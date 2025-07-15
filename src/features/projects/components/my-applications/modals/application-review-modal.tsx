'use client';

import { motion } from 'framer-motion';
import { Shield, Calendar, User, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { ExtendedProjectApplicationDto } from '../../../types';

interface ApplicationReviewModalProps {
  application: ExtendedProjectApplicationDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationReviewModal({ application, isOpen, onClose }: ApplicationReviewModalProps) {
  const router = useRouter();
  if (!application) return null;
  
  const projectTitle = application.project?.title || application.projectSlug;
  const roleName = application.projectRole.role?.name || application.roleSlug;
  const reviewedDate = application.reviewedAt 
    ? new Date(application.reviewedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Not reviewed yet';

  const getStatusConfig = (status: string) => {
    switch (status) {
    case 'APPROVED':
      return {
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/50',
        gradientFrom: 'from-green-600/20',
        gradientTo: 'to-emerald-600/20'
      };
    case 'REJECTED':
      return {
        icon: XCircle,
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/50',
        gradientFrom: 'from-red-600/20',
        gradientTo: 'to-rose-600/20'
      };
    case 'PENDING':
      return {
        icon: Clock,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/50',
        gradientFrom: 'from-yellow-600/20',
        gradientTo: 'to-amber-600/20'
      };
    default:
      return {
        icon: AlertTriangle,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/50',
        gradientFrom: 'from-gray-600/20',
        gradientTo: 'to-slate-600/20'
      };
    }
  };

  const statusConfig = getStatusConfig(application.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-950 border-gray-800 p-0 overflow-hidden">
        {/* Dynamic Gradient Header based on status */}
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradientFrom} via-purple-600/20 ${statusConfig.gradientTo} blur-xl`} />
          <DialogHeader className="relative bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border flex items-center justify-center`}>
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Application Review
                  </DialogTitle>
                  <p className="text-sm text-gray-400 mt-1">
                    Review feedback from the project team
                  </p>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 tracking-tight">Project</p>
                  <p className="text-white font-semibold">{projectTitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 tracking-tight">Role</p>
                  <p className="text-white font-semibold">{roleName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:col-span-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 tracking-tight">Reviewed On</p>
                  <p className="text-white font-semibold">{reviewedDate}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Status Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
              <h3 className="text-lg font-bold text-white">Application Status</h3>
            </div>
            
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${statusConfig.gradientFrom} ${statusConfig.gradientTo} rounded-lg blur-sm`} />
              <div className={`relative ${statusConfig.bgColor} ${statusConfig.borderColor} border rounded-lg p-4 backdrop-blur-sm`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                  <div>
                    <p className={`text-xl font-bold ${statusConfig.color}`}>
                      {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                    </p>
                    <p className="text-gray-200 text-sm">
                      {application.status === 'APPROVED' && 'Congratulations! Your application has been accepted.'}
                      {application.status === 'REJECTED' && 'Your application was not accepted this time.'}
                      {application.status === 'PENDING' && 'Your application is currently under review.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Review Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Review Feedback</h3>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg blur-sm" />
              <div className="relative bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                {application.reviewMessage ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                      {application.reviewMessage}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-gray-400 text-sm mb-1">No review feedback yet</p>
                    <p className="text-gray-500 text-xs">
                      {application.status === 'PENDING' 
                        ? 'The project team hasn\'t provided feedback yet. Please wait for them to review your application.'
                        : 'The project team didn\'t provide additional feedback for this application.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-3 pt-4 border-t border-gray-800"
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
            >
              Close
            </Button>
            {application.status === 'REJECTED' && (
              <Button
                onClick={() => router.push('/projects')}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Find More Projects
              </Button>
            )}
            {application.status === 'APPROVED' && (
              <Button
                onClick={() => {
                  router.push(`/projects/${application.projectSlug}`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                View Project
              </Button>
            )}
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
