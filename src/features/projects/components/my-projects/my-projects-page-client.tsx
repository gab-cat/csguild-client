'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, FolderOpen } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useState, useMemo } from 'react'

import { SimplePaginationControl } from '@/components/shared/simple-pagination-control'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { api } from '@/lib/convex'

import { isValidProjectCard } from '../../types'
import type { Project, ProjectStatus } from '../../types'
import { CreateProjectModal } from '../create-project-modal'
import { ProjectCard } from '../projects/project-card'

import { MyProjectCard } from './my-project-card'

export function MyProjectsPageClient() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
  const [activeTab, setActiveTab] = useState<'owned' | 'member' | 'saved'>('owned')

  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const currentLimit = parseInt(searchParams.get('limit') || '12', 10)

  // @ts-ignore
  const myProjectsData = useQuery(api.projects.getMyProjects)
  const savedProjectsData = useQuery(api.projects.getSavedProjects, {
    page: currentPage,
    limit: currentLimit,
  })

  const isLoading = myProjectsData === undefined
  const isSavedLoading = savedProjectsData === undefined
  const error = null

  // Get filtered owned projects
  const allFilteredOwnedProjects = useMemo(() => {
    return ((myProjectsData?.owned || []) as unknown as Project[])
      .filter(isValidProjectCard)
      .filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter
        return matchesSearch && matchesStatus
      })
  }, [myProjectsData?.owned, searchQuery, statusFilter])

  // Get filtered member projects
  const allFilteredMemberProjects = useMemo(() => {
    return ((myProjectsData?.member || []) as unknown as Project[])
      .filter(isValidProjectCard)
      .filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter
        return matchesSearch && matchesStatus
      })
  }, [myProjectsData?.member, searchQuery, statusFilter])

  // Get filtered saved projects
  const allFilteredSavedProjects = useMemo(() => {
    return ((savedProjectsData?.data || []) as unknown as Project[])
      .filter(isValidProjectCard)
      .filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             project.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || project.status === statusFilter
        return matchesSearch && matchesStatus
      })
  }, [savedProjectsData?.data, searchQuery, statusFilter])

  // Current projects to display based on active tab
  const currentProjects = useMemo(() => {
    if (activeTab === 'owned') return allFilteredOwnedProjects
    if (activeTab === 'member') return allFilteredMemberProjects
    return allFilteredSavedProjects
  }, [activeTab, allFilteredOwnedProjects, allFilteredMemberProjects, allFilteredSavedProjects])

  // Get paginated projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * currentLimit
    const endIndex = startIndex + currentLimit
    return currentProjects.slice(startIndex, endIndex)
  }, [currentProjects, currentPage, currentLimit])

  // Early loading return
  if (isLoading || (activeTab === 'saved' && isSavedLoading)) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
                <p className="text-gray-400">Loading your projects...</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                      <Skeleton className="h-5 w-24 bg-gray-700" />
                    </div>
                    <Skeleton className="h-7 w-full bg-gray-700" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full bg-gray-700" />
                      <Skeleton className="h-4 w-32 bg-gray-700" />
                    </div>
                    <Skeleton className="h-16 w-full bg-gray-700" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 bg-gray-700" />
                      <Skeleton className="h-6 w-20 bg-gray-700" />
                    </div>
                    <Skeleton className="h-9 w-full bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="text-red-400 mb-4">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Failed to load your projects</h2>
              <p className="text-gray-400 mb-2">There was an error loading your projects. Please try again.</p>
              <p className="text-xs text-gray-500">
                Error: Unknown error occurred
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!myProjectsData) {
    return (
      <div className="min-h-screen p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No project data available</h2>
            <p className="text-gray-400">Unable to load project information at this time.</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter owned projects based on search and status

  const statusOptions: Array<{ value: ProjectStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ]

  // Safe access to project counts
  const totalOwnedProjects = myProjectsData?.owned?.length || 0
  const totalMemberProjects = myProjectsData?.member?.length || 0
  const totalSavedProjects = savedProjectsData?.meta?.total || 0

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
              <p className="text-gray-400">
                Manage your posted projects and review applications from other members
              </p>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
              Create Project
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="!max-w-7xl !w-7xl max-h-[95vh] overflow-y-auto bg-gray-950 border-gray-800"
                showCloseButton={false}
              >
                <CreateProjectModal onClose={() => setIsCreateModalOpen(false)} />
              </DialogContent>
            </Dialog>

          </div>
        </motion.div>

        {/* Tab Navigation and Content */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'owned' | 'member' | 'saved')}
          className="w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            <TabsList className="bg-gray-900/80 border border-gray-800 h-12 p-1 rounded-lg">
              <TabsTrigger 
                value="owned"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md font-medium"
              >
                My Projects ({myProjectsData?.owned?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="member"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md font-medium"
              >
                Member Of ({myProjectsData?.member?.length || 0})
              </TabsTrigger>
              <TabsTrigger 
                value="saved"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-md font-medium"
              >
                Saved ({savedProjectsData?.meta?.total || 0})
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Search and Filters */}
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
                      placeholder="Search your projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                          onClick={() => setStatusFilter(option.value)}
                          className={
                            statusFilter === option.value
                              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-600'
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tab Content */}
          <TabsContent value="owned" className="mt-0">
            {activeTab === 'owned' && (
              <>
                {/* Projects List */}
                {allFilteredOwnedProjects.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center min-h-[40vh] text-center"
                  >
                    <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {searchQuery || statusFilter !== 'ALL' ? 'No projects found' : 'No owned projects yet'}
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                      {searchQuery || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'You haven\'t created any projects yet. Start by creating your first project!'}
                    </p>
                    {(!searchQuery && statusFilter === 'ALL') && (
                      <Button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {paginatedProjects.map((project, index) => (
                        <MyProjectCard
                          key={project.slug}
                          project={project}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    <SimplePaginationControl
                      key={`pagination-${activeTab}`}
                      currentPage={currentPage}
                      currentLimit={currentLimit}
                      total={allFilteredOwnedProjects.length}
                      showLimitSelector={true}
                      showInfo={true}
                      className="mt-6"
                    />
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="member" className="mt-0">
            {activeTab === 'member' && (
              <>
                {/* Projects List */}
                {allFilteredMemberProjects.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center min-h-[40vh] text-center"
                  >
                    <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {searchQuery || statusFilter !== 'ALL' ? 'No projects found' : 'Not a member of any projects yet'}
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                      {searchQuery || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'You haven\'t joined any projects yet. Browse available projects to find opportunities!'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {paginatedProjects.map((project, index) => (
                        <MyProjectCard
                          key={project.slug}
                          project={project}
                          index={index}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    <SimplePaginationControl
                      key={`pagination-${activeTab}`}
                      currentPage={currentPage}
                      currentLimit={currentLimit}
                      total={allFilteredMemberProjects.length}
                      showLimitSelector={true}
                      showInfo={true}
                      className="mt-6"
                    />
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-0">
            {activeTab === 'saved' && (
              <>
                {/* Projects List */}
                {allFilteredSavedProjects.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center justify-center min-h-[40vh] text-center"
                  >
                    <FolderOpen className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {searchQuery || statusFilter !== 'ALL' ? 'No projects found' : 'No saved projects yet'}
                    </h2>
                    <p className="text-gray-400 mb-6 max-w-md">
                      {searchQuery || statusFilter !== 'ALL' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'You haven\'t saved any projects yet. Start exploring projects and save the ones that interest you!'}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {paginatedProjects.map((project, index) => (
                        <ProjectCard
                          key={project.slug}
                          project={project}
                          index={index}
                          isSaved={true}
                          isPinned={false}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    <SimplePaginationControl
                      key={`pagination-${activeTab}`}
                      currentPage={currentPage}
                      currentLimit={currentLimit}
                      total={allFilteredSavedProjects.length}
                      showLimitSelector={true}
                      showInfo={true}
                      className="mt-6"
                    />
                  </motion.div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        {myProjectsData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center text-gray-400"
          >
            <p>
              Showing {paginatedProjects.length} of {currentProjects.length} {
                activeTab === 'owned' ? 'owned' : 
                  activeTab === 'member' ? 'member' : 
                    'saved'
              } projects
              {activeTab === 'owned' && totalMemberProjects > 0 && (
                <span> • You&apos;re also a member of {totalMemberProjects} other projects</span>
              )}
              {activeTab === 'owned' && totalSavedProjects > 0 && (
                <span> • You have {totalSavedProjects} saved projects</span>
              )}
              {activeTab === 'member' && totalOwnedProjects > 0 && (
                <span> • You own {totalOwnedProjects} projects</span>
              )}
              {activeTab === 'member' && totalSavedProjects > 0 && (
                <span> • You have {totalSavedProjects} saved projects</span>
              )}
              {activeTab === 'saved' && totalOwnedProjects > 0 && (
                <span> • You own {totalOwnedProjects} projects</span>
              )}
              {activeTab === 'saved' && totalMemberProjects > 0 && (
                <span> • You&apos;re a member of {totalMemberProjects} projects</span>
              )}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
