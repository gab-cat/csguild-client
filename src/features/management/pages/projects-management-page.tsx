'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQuery } from 'convex/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search, Settings2, User, Calendar, Badge as BadgeIcon, Star } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/use-debounce'
import { api, Id } from '@/lib/convex'

type Project = {
  id: Id<'projects'>
  slug: string
  title: string
  description: string
  tags: string[]
  dueDate?: number
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  isFeatured: boolean
  createdAt?: number
  updatedAt?: number
  owner: {
    id: Id<'users'>
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  } | null
  memberCount: number
  applicationCount: number
}

const statusColors = {
  OPEN: 'bg-green-500/10 text-green-500 border-green-500/30',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  COMPLETED: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
  CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/30',
}

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export function ProjectsManagementPage() {
  const [queryText, setQueryText] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [selected, setSelected] = useState<Project | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<"OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "all">("all")
  const [selectedFeatured, setSelectedFeatured] = useState<"featured" | "non-featured" | "all">("all")
  const [page, setPage] = useState(1)
  const [allProjects, setAllProjects] = useState<Project[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [togglingProjects, setTogglingProjects] = useState<Set<string>>(new Set())
  const [parentRef] = useAutoAnimate()
  
  const debouncedQueryText = useDebounce(queryText, 300)

  // Use paginated query with search
  const projectsResult = useQuery(api.projects.getProjects, {
    search: debouncedQueryText && debouncedQueryText.trim() ? debouncedQueryText.trim() : undefined,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    isFeatured: selectedFeatured === "all" ? undefined : selectedFeatured === "featured",
    page: page,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  const updateProject = useMutation(api.projects.updateProject)
  const toggleProjectFeatured = useMutation(api.projects.toggleProjectFeatured)

  // Reset pagination when search query, status filter, or featured filter changes
  useEffect(() => {
    setPage(1)
    setAllProjects([])
    setHasMore(true)
  }, [debouncedQueryText, selectedStatus, selectedFeatured])

  // Update projects when paginated result changes
  useEffect(() => {
    if (projectsResult) {
      if (page === 1) {
        // First page or search reset
        setAllProjects(projectsResult.data)
      } else {
        // Append new page
        setAllProjects(prev => [...prev, ...projectsResult.data])
      }
      setHasMore(projectsResult.meta.page < projectsResult.meta.totalPages)
    }
  }, [projectsResult, page])

  const filtered = useMemo(() => allProjects, [allProjects])

  async function handleUpdate(form: FormData) {
    if (!selected) return
    
    try {
      const tagsValue = form.get('tags') as string
      const dueDateValue = form.get('dueDate') as string
      
      await updateProject({
        slug: selected.slug,
        title: String(form.get('title') || selected.title),
        description: String(form.get('description') || selected.description),
        tags: tagsValue ? tagsValue.split(',').map(tag => tag.trim()).filter(Boolean) : selected.tags,
        dueDate: dueDateValue || undefined,
        isFeatured: form.get('isFeatured') === 'true',
      })
      
      toast.success('Project updated')
      setEditOpen(false)
      setSelected(null)
      
      // Refresh data by resetting page
      setPage(1)
      setAllProjects([])
    } catch (error) {
      console.error('Update error:', error)
      toast.error('Failed to update project')
    }
  }

  function loadMore() {
    if (hasMore && projectsResult) {
      setPage(prev => prev + 1)
    }
  }

  async function handleToggleFeatured(projectSlug: string, currentIsFeatured: boolean) {
    // Prevent multiple clicks while toggling
    if (togglingProjects.has(projectSlug)) return

    try {
      // Add to toggling set
      setTogglingProjects(prev => new Set(prev).add(projectSlug))

      // Calculate new featured state
      const newIsFeatured = !currentIsFeatured

      // Update project featured status
      await toggleProjectFeatured({ slug: projectSlug, isFeatured: newIsFeatured })

      // Update local state immediately for better UX
      setAllProjects(prev => prev.map(project =>
        project.slug === projectSlug
          ? { ...project, isFeatured: newIsFeatured }
          : project
      ))

      // Show success message
      toast.success(`Project ${newIsFeatured ? 'featured' : 'unfeatured'} successfully`)
    } catch (error) {
      console.error('Toggle featured error:', error)
      toast.error('Failed to toggle project featured status')
    } finally {
      // Remove from toggling set
      setTogglingProjects(prev => {
        const newSet = new Set(prev)
        newSet.delete(projectSlug)
        return newSet
      })
    }
  }

  function formatDate(timestamp?: number) {
    if (!timestamp) return 'No due date'
    return new Date(timestamp).toLocaleDateString()
  }

  function getOwnerName(owner: Project['owner']) {
    if (!owner) return 'Unknown'
    return `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || owner.username || 'Unknown'
  }

  return (
    <motion.div className="container mx-auto px-0 py-8 max-w-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">Monitor, moderate, and manage projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "all")}>
            <SelectTrigger className="w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedFeatured} onValueChange={(value) => setSelectedFeatured(value as "featured" | "non-featured" | "all")}>
            <SelectTrigger className="w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
              <SelectValue placeholder="Filter by featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="non-featured">Non-Featured</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 border-gray-800 focus:border-gray-400 hover:border-gray-400"
              placeholder="Search projects"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div ref={parentRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((project) => (
          <div key={String(project.id)} className="rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-400 bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="font-medium truncate">{project.title}</h2>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${statusColors[project.status]}`}>
                      {statusLabels[project.status]}
                    </Badge>
                    {project.isFeatured && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5 border bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-pink-400/80 truncate mb-2">
                  by {getOwnerName(project.owner)}
                </p>
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleFeatured(project.slug, project.isFeatured)}
                  disabled={togglingProjects.has(project.slug)}
                  title={project.isFeatured ? "Remove from featured" : "Mark as featured"}
                >
                  <Star className={`w-4 h-4 ${project.isFeatured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'} ${togglingProjects.has(project.slug) ? 'animate-pulse' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  setSelected(project);
                  setEditOpen(true);
                }} title="Edit">
                  <Settings2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {project.memberCount} members
                </div>
                <div className="flex items-center gap-1">
                  <BadgeIcon className="w-3 h-3" />
                  {project.applicationCount} applications
                </div>
              </div>
              {project.dueDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(project.dueDate)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && filtered.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={!hasMore}
            className="border-gray-800 hover:border-gray-400"
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            Load More
          </Button>
        </div>
      )}

      {/* Edit Project Dialog */}
      <AnimatePresence>
        {editOpen && selected && (
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Project: {selected.title}</DialogTitle>
              </DialogHeader>
              <form
                className="space-y-4"
                action={async (formData) => {
                  await handleUpdate(formData)
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      defaultValue={selected.title} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={selected.status}>
                      <SelectTrigger className="border-gray-800 focus:border-gray-400 hover:border-gray-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OPEN">Open</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="isFeatured">Featured</Label>
                    <Select name="isFeatured" defaultValue={selected.isFeatured.toString()}>
                      <SelectTrigger className="border-gray-800 focus:border-gray-400 hover:border-gray-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Featured</SelectItem>
                        <SelectItem value="false">Not Featured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    defaultValue={selected.description} 
                    className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input 
                      id="tags" 
                      name="tags" 
                      defaultValue={selected.tags.join(', ')} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                      placeholder="e.g., web-dev, react, frontend"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input 
                      id="dueDate" 
                      name="dueDate" 
                      type="date"
                      defaultValue={selected.dueDate ? new Date(selected.dueDate).toISOString().split('T')[0] : ''} 
                      className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    />
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Project Info</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Owner:</span>
                      <p>{getOwnerName(selected.owner)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Members:</span>
                      <p>{selected.memberCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Applications:</span>
                      <p>{selected.applicationCount}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Created:</span>
                      <p>{selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => {
                    setEditOpen(false);
                    setSelected(null);
                  }}>Cancel</Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ProjectsManagementPage
