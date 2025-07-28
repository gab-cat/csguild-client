'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface ApplicationsHeaderProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export function ApplicationsHeader({ pendingCount, approvedCount, rejectedCount }: ApplicationsHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
          <p className="text-gray-400">
            Track your project applications and their status
          </p>
        </div>
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-300">{pendingCount} Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-gray-300">{approvedCount} Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-gray-300">{rejectedCount} Rejected</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
