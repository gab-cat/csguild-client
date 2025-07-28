'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control';
import { usePagination } from '@/hooks/use-pagination';

import { useMyApplications } from '../../hooks/use-projects-queries';
import type { ExtendedProjectApplicationDto } from '../../types';

import {
  ApplicationsHeader,
  ApplicationsFilters,
  ApplicationsTable,
  ApplicationsEmptyState,
  ApplicationsLoading,
  ApplicationsError,
  ApplicationMessageModal,
  ApplicationReviewModal,
  type ApplicationStatus
} from './';

export function MyApplicationsPageClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>('ALL');
  const [selectedApplication, setSelectedApplication] = useState<ExtendedProjectApplicationDto | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const { data: applicationsData, isLoading, error } = useMyApplications();

  // Get filtered applications first
  const allFilteredApplications = (applicationsData?.applications as ExtendedProjectApplicationDto[] || []).filter((application) => {
    const projectTitle = application.projectRole.project?.title || application.projectSlug;
    const roleName = application.projectRole.role?.name || application.roleSlug;
    
    const matchesSearch = 
      projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (application.message && application.message.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Initialize pagination with filtered applications count
  const pagination = usePagination({
    defaultPage: 1,
    defaultLimit: 12,
    total: allFilteredApplications.length
  });

  // Get paginated applications
  const startIndex = (pagination.page - 1) * pagination.limit;
  const endIndex = startIndex + pagination.limit;
  const paginatedApplications = allFilteredApplications.slice(startIndex, endIndex);

  const openMessageModal = (application: ExtendedProjectApplicationDto) => {
    setSelectedApplication(application);
    setIsMessageModalOpen(true);
  };

  const openReviewModal = (application: ExtendedProjectApplicationDto) => {
    setSelectedApplication(application);
    setIsReviewModalOpen(true);
  };

  // Loading state
  if (isLoading) {
    return <ApplicationsLoading />;
  }

  // Error state
  if (error) {
    return <ApplicationsError error={error} />;
  }

  // No data state
  if (!applicationsData?.applications || applicationsData.applications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <ApplicationsHeader 
            pendingCount={0}
            approvedCount={0}
            rejectedCount={0}
          />
          <ApplicationsEmptyState
            searchQuery=""
            statusFilter="ALL"
            hasAnyApplications={false}
          />
        </div>
      </div>
    );
  }

  // Calculate stats
  const pendingCount = applicationsData.applications.filter(app => app.status === 'PENDING').length;
  const approvedCount = applicationsData.applications.filter(app => app.status === 'APPROVED').length;
  const rejectedCount = applicationsData.applications.filter(app => app.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ApplicationsHeader 
          pendingCount={pendingCount}
          approvedCount={approvedCount}
          rejectedCount={rejectedCount}
        />

        {/* Search and Filters */}
        <ApplicationsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Applications Content */}
        {allFilteredApplications.length === 0 ? (
          <ApplicationsEmptyState
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            hasAnyApplications={true}
          />
        ) : (
          <div className="space-y-6">
            <ApplicationsTable
              applications={paginatedApplications}
              onViewMessage={openMessageModal}
              onViewReview={openReviewModal}
            />

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SimplePaginationControl
                currentPage={pagination.page}
                currentLimit={pagination.limit}
                total={allFilteredApplications.length}
                showLimitSelector={true}
                showInfo={true}
                className="mt-6"
              />
            </motion.div>
          </div>
        )}

        {/* Modals */}
        <ApplicationMessageModal
          application={selectedApplication}
          isOpen={isMessageModalOpen}
          onClose={() => {
            setIsMessageModalOpen(false);
            setSelectedApplication(null);
          }}
        />

        <ApplicationReviewModal
          application={selectedApplication}
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedApplication(null);
          }}
        />
      </div>
    </div>
  );
}
