'use client';

import { motion } from 'framer-motion';
import { Search, Filter, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL';

const statusOptions: Array<{ value: ApplicationStatus; label: string; icon: React.ReactNode; color: string }> = [
  { 
    value: 'ALL', 
    label: 'All Status', 
    icon: <FileText className="w-4 h-4" />, 
    color: 'text-gray-400' 
  },
  { 
    value: 'PENDING', 
    label: 'Pending', 
    icon: <Clock className="w-4 h-4" />, 
    color: 'text-yellow-400' 
  },
  { 
    value: 'APPROVED', 
    label: 'Approved', 
    icon: <CheckCircle className="w-4 h-4" />, 
    color: 'text-green-400' 
  },
  { 
    value: 'REJECTED', 
    label: 'Rejected', 
    icon: <XCircle className="w-4 h-4" />, 
    color: 'text-red-400' 
  },
];

interface ApplicationsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: ApplicationStatus;
  onStatusFilterChange: (status: ApplicationStatus) => void;
}

export function ApplicationsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}: ApplicationsFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-6"
    >
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="py-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by project, role, or message..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-4 h-4" />
              <div className="flex gap-1">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="sm"
                    variant={statusFilter === option.value ? 'default' : 'outline'}
                    onClick={() => onStatusFilterChange(option.value)}
                    className={
                      statusFilter === option.value
                        ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
                    }
                  >
                    <span className={option.color}>{option.icon}</span>
                    <span className="ml-1">{option.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export type { ApplicationStatus };
