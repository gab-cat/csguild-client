'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Calendar, User, FileText} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import type { ExtendedProjectApplicationDto } from '../../../types';

interface ApplicationMessageModalProps {
  application: ExtendedProjectApplicationDto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ApplicationMessageModal({ application, isOpen, onClose }: ApplicationMessageModalProps) {
  if (!application) return null;

  const projectTitle = application.project?.title || application.projectSlug;
  const roleName = application.projectRole.role?.name || application.roleSlug;
  const appliedDate = new Date(application.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-950 border-gray-800 p-0 overflow-hidden">
        {/* Gradient Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-xl" />
          <DialogHeader className="relative bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div className=''>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    Application Message
                    <p className="text-sm font-normal text-gray-400 mt-1">
                    Your message to the project team
                    </p>
                  </DialogTitle>
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
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 tracking-tight">Applied On</p>
                  <p className="text-white font-semibold">{appliedDate}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Message Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">Your Message</h3>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg blur-sm" />
              <div className="relative bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {application.message}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end gap-3 pt-4 border-t border-gray-800"
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                const encodedTitle = encodeURIComponent(projectTitle);
                window.location.href = `/projects?search=${encodedTitle}`;
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              View Project
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
