'use client';

import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, FileText, FolderOpen, User2Icon, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { ExtendedProjectApplicationDto } from '../../types';
import { MemberStatusIndicator } from '../shared/member-status-indicator';

interface ApplicationsTableProps {
  applications: ExtendedProjectApplicationDto[];
  onViewMessage: (application: ExtendedProjectApplicationDto) => void;
  onViewReview: (application: ExtendedProjectApplicationDto) => void;
}

export function ApplicationsTable({ applications, onViewMessage, onViewReview }: ApplicationsTableProps) {
  const router = useRouter();
  const getStatusIcon = (status: string) => {
    switch (status) {
    case 'PENDING':
      return <Clock className="w-4 h-4 text-yellow-400" />;
    case 'APPROVED':
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    case 'REJECTED':
      return <XCircle className="w-4 h-4 text-red-400" />;
    default:
      return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'PENDING':
      return 'text-yellow-400';
    case 'APPROVED':
      return 'text-green-400';
    case 'REJECTED':
      return 'text-red-400';
    default:
      return 'text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Table */}
      <Card className="bg-gray-900/50 border-gray-800 overflow-hidden">
        <CardContent className="p-0 py-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-300 font-semibold"><p className='flex items-center'><FolderOpen className="size-4 mr-2" />Project</p></TableHead>
                <TableHead className="text-gray-300 font-semibold"><p className='flex items-center'><User2Icon className="size-4 mr-2" />Role</p></TableHead>
                <TableHead className="text-gray-300 font-semibold"><p className='flex items-center'><Clock className="size-4 mr-2" />Status</p></TableHead>
                <TableHead className="text-gray-300 font-semibold"><p className='flex items-center'><Calendar className="size-4 mr-2" />Applied Date</p></TableHead>
                <TableHead className="text-gray-300 font-semibold"><p className='flex items-center'><User2Icon className="size-4 mr-2" />Actions</p></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application, index) => {
                const projectTitle = application.project?.title || application.projectSlug;
                const roleName = application.projectRole.role?.name || application.roleSlug;
                const appliedDate = new Date(application.createdAt).toLocaleDateString();
                
                return (
                  <motion.tr
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-gray-800 hover:bg-gray-800/30 transition-colors"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <Button
                          variant="link"
                          className="text-purple-400 hover:text-purple-300 p-0 h-auto font-medium text-left justify-start group"
                          onClick={() => {
                            router.push(`/projects/${application.projectSlug}`);
                          }}
                        >
                          <span className="group-hover:underline">{projectTitle}</span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-300 font-medium">{roleName}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(application.status)}
                          <span className={`${getStatusColor(application.status)} font-medium`}>
                            {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                          </span>
                        </div>
                        {/* Show member status for approved applications */}
                        <MemberStatusIndicator
                          projectSlug={application.projectSlug}
                          applicationStatus={application.status as 'PENDING' | 'APPROVED' | 'REJECTED'}
                          memberStatus="ACTIVE" // This would be determined by actual API data
                          compact={true}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-400">{appliedDate}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {application.message && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 hover:text-purple-300 transition-colors"
                            onClick={() => onViewMessage(application)}
                          >
                            View Message
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50 hover:text-purple-300 transition-colors"
                          onClick={() => onViewReview(application)}
                        >
                          View Review
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
