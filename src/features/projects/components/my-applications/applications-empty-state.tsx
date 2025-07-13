'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';

import type { ApplicationStatus } from './applications-filters';

interface ApplicationsEmptyStateProps {
  searchQuery: string;
  statusFilter: ApplicationStatus;
  hasAnyApplications: boolean;
}

export function ApplicationsEmptyState({ 
  searchQuery, 
  statusFilter, 
  hasAnyApplications 
}: ApplicationsEmptyStateProps) {
  const isFiltered = searchQuery || statusFilter !== 'ALL';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col items-center justify-center min-h-[40vh] text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl" />
        <div className="relative w-20 h-20 bg-gray-800/50 border border-gray-700/50 rounded-full flex items-center justify-center backdrop-blur-sm">
          <FileText className="w-10 h-10 text-gray-500" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">
        {isFiltered ? 'No applications found' : 'No applications yet'}
      </h2>
      
      <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
        {isFiltered 
          ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
          : 'You haven\'t applied to any projects yet. Start by browsing available projects and find opportunities that match your skills!'}
      </p>
      
      {!hasAnyApplications && (
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/projects'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium px-6 py-2.5"
          >
            Browse Projects
          </Button>
          <p className="text-xs text-gray-500">
            Discover exciting projects and join amazing teams
          </p>
        </div>
      )}
    </motion.div>
  );
}
