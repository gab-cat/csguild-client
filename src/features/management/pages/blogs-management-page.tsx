'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQuery } from 'convex/react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Search,
  Settings2,
  Eye,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Archive,
  Pin,
  Star,
  AlertTriangle,
  Trash2,
  FileText
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/use-debounce'
import { api, Id } from '@/lib/convex'

import { BlogFlagManagement } from '../components/blog-flag-management'
import { BlogStatsOverview } from '../components/blog-stats-overview'

type BlogStatus = "DRAFT" | "PUBLISHED" | "PENDING" | "ARCHIVED" | "DELETED"
type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED" | "UNDER_REVIEW"
type ModerationAction = "APPROVE" | "REJECT" | "FLAG" | "UNDER_REVIEW"

type Blog = {
  _id: Id<'blogs'>
  title: string
  slug: string
  subtitle?: string
  content: string
  excerpt?: string
  readingTime?: number
  wordCount?: number
  status?: BlogStatus
  moderationStatus?: ModerationStatus
  publishedAt?: number
  scheduledFor?: number
  lastEditedAt?: number
  metaDescription?: string
  metaKeywords?: string[]
  canonicalUrl?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
  shareCount?: number
  bookmarkCount?: number
  flagCount?: number
  authorSlug: string
  allowComments?: boolean
  allowBookmarks?: boolean
  allowLikes?: boolean
  allowShares?: boolean
  isPinned?: boolean
  isFeatured?: boolean
  createdAt?: number
  updatedAt?: number
  moderatedAt?: number
  moderatedBy?: string
  moderationNotes?: string
  author?: {
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  }
  categories?: Array<{
    name: string
    slug: string
    color?: string
  } | null>
  tags?: Array<{
    name: string
    slug: string
    color?: string
  } | null>
  coverImages?: Array<{
    id: Id<'blogCoverImages'>
    imageUrl: string
    altText?: string
    isMain?: boolean
  }>
}

const statusColors = {
  DRAFT: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
  PUBLISHED: 'bg-green-500/10 text-green-500 border-green-500/30',
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  ARCHIVED: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  DELETED: 'bg-red-500/10 text-red-500 border-red-500/30',
}

const moderationStatusColors = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  APPROVED: 'bg-green-500/10 text-green-500 border-green-500/30',
  REJECTED: 'bg-red-500/10 text-red-500 border-red-500/30',
  FLAGGED: 'bg-red-600/10 text-red-600 border-red-600/30',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
}

export function BlogsManagementPage() {
  const [queryText, setQueryText] = useState('')
  const [moderationOpen, setModerationOpen] = useState(false)
  const [selected, setSelected] = useState<Blog | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<BlogStatus | "all">("all")
  const [selectedModerationStatus, setSelectedModerationStatus] = useState<ModerationStatus | "all">("all")
  const [moderationAction, setModerationAction] = useState<ModerationAction>("APPROVE")
  const [moderationNotes, setModerationNotes] = useState('')
  const [parentRef] = useAutoAnimate()
  
  const debouncedQueryText = useDebounce(queryText, 300)

  // Get blogs with filtering
  const blogsResult = useQuery(api.blogs.getBlogs, {
    paginationOpts: { numItems: 50, cursor: null },
    search: debouncedQueryText && debouncedQueryText.trim() ? debouncedQueryText.trim() : undefined,
    status: selectedStatus === "all" ? undefined : selectedStatus,
    includeAllStatuses: selectedStatus === "all", // Fetch all blogs when "all" is selected
    sortBy: "updatedAt",
    sortOrder: "desc",
  })

  // Blog management mutations
  const moderateBlog = useMutation(api.blogs.moderateBlog)
  const publishBlog = useMutation(api.blogs.publishBlog)
  const unpublishBlog = useMutation(api.blogs.unpublishBlog)
  const deleteBlog = useMutation(api.blogs.deleteBlog)
  const archiveBlog = useMutation(api.blogs.archiveBlog)
  const pinBlog = useMutation(api.blogs.pinBlog)
  const featureBlog = useMutation(api.blogs.featureBlog)

  // Memoize blogs data
  const blogs = useMemo(() => blogsResult?.page || [], [blogsResult?.page])

  // Filter by moderation status on frontend since it's not in the query
  const filtered = useMemo(() => {
    let result = blogs

    if (selectedModerationStatus !== "all") {
      result = result.filter(blog => blog.moderationStatus === selectedModerationStatus)
    }

    return result
  }, [blogs, selectedModerationStatus])

  async function handleModeration() {
    if (!selected) return
    
    try {
      await moderateBlog({
        blogId: selected._id,
        action: moderationAction,
        moderationNotes: moderationNotes.trim() || undefined,
      })
      
      toast.success(`Blog ${moderationAction.toLowerCase()}d successfully`)
      setModerationOpen(false)
      setSelected(null)
      setModerationNotes('')
      
    } catch (error) {
      console.error('Moderation error:', error)
      toast.error('Failed to moderate blog')
    }
  }

  async function handlePublish(slug: string) {
    try {
      await publishBlog({ slug })
      toast.success('Blog published successfully')
    } catch (error) {
      console.error('Publish error:', error)
      toast.error('Failed to publish blog')
    }
  }

  async function handleUnpublish(blogId: Id<'blogs'>) {
    try {
      await unpublishBlog({ blogId })
      toast.success('Blog unpublished successfully')
    } catch (error) {
      console.error('Unpublish error:', error)
      toast.error('Failed to unpublish blog')
    }
  }

  async function handleDelete(slug: string) {
    try {
      await deleteBlog({ slug })
      toast.success('Blog deleted successfully')
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete blog')
    }
  }

  async function handlePin(blogId: Id<'blogs'>) {
    try {
      await pinBlog({ blogId })
      toast.success('Blog pinned/unpinned successfully')
    } catch (error) {
      console.error('Pin error:', error)
      toast.error('Failed to pin/unpin blog')
    }
  }

  async function handleFeature(blogId: Id<'blogs'>) {
    try {
      await featureBlog({ blogId })
      toast.success('Blog featured/unfeatured successfully')
    } catch (error) {
      console.error('Feature error:', error)
      toast.error('Failed to feature/unfeature blog')
    }
  }

  async function handleArchive(blogId: Id<'blogs'>) {
    try {
      await archiveBlog({ blogId })
      toast.success('Blog archived successfully')
    } catch (error) {
      console.error('Archive error:', error)
      toast.error('Failed to archive blog')
    }
  }

  function formatDateTime(timestamp?: number) {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString()
  }

  function getAuthorName(author?: Blog['author']) {
    if (!author) return 'Unknown'
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username || 'Unknown'
  }

  function getModerationIcon(status?: ModerationStatus) {
    switch (status) {
    case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />
    case 'FLAGGED': return <Flag className="w-4 h-4 text-red-600" />
    case 'UNDER_REVIEW': return <Clock className="w-4 h-4 text-blue-500" />
    case 'PENDING':
    default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <motion.div className="container mx-auto px-0 py-8 max-w-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold">Blog Management</h1>
          <p className="text-sm text-muted-foreground">Monitor, moderate, and manage blog posts</p>
        </div>
      </div>

      {/* Blog Stats Overview */}
      <BlogStatsOverview />

      <Tabs defaultValue="blogs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="blogs">Blog Management</TabsTrigger>
          <TabsTrigger value="flags">Flag Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogs" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as BlogStatus | "all")}>
                <SelectTrigger className="w-full sm:w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedModerationStatus} onValueChange={(value) => setSelectedModerationStatus(value as ModerationStatus | "all")}>
                <SelectTrigger className="w-full sm:w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
                  <SelectValue placeholder="Filter by moderation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moderation</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="FLAGGED">Flagged</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8 border-gray-800 focus:border-gray-400 hover:border-gray-400"
                placeholder="Search blogs"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
              />
            </div>
          </div>

          <div ref={parentRef} className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {filtered.map((blog) => (
              <div key={blog._id} className="rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-400 bg-card text-card-foreground shadow-sm p-4 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getModerationIcon(blog.moderationStatus)}
                        <h2 className="font-medium truncate text-sm sm:text-base">{blog.title}</h2>
                      </div>
                      <div className="flex items-center gap-2">
                        {blog.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                        {blog.isFeatured && <Star className="w-3 h-3 text-purple-500" />}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {blog.status && (
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${statusColors[blog.status]}`}>
                          {blog.status}
                        </Badge>
                      )}
                      {blog.moderationStatus && (
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${moderationStatusColors[blog.moderationStatus]}`}>
                          {blog.moderationStatus}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-pink-400/80 truncate mb-2">
                      by {getAuthorName(blog.author)}
                    </p>

                    {blog.subtitle && (
                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">{blog.subtitle}</p>
                    )}

                    {(blog.categories && blog.categories.length > 0) && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {blog.categories.slice(0, 2).map((category, index) => (
                          category && (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {category.name || 'Unknown'}
                            </Badge>
                          )
                        ))}
                        {blog.categories.filter(Boolean).length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{blog.categories.filter(Boolean).length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex sm:flex-col gap-2">
                    <div className="flex gap-1 sm:flex-col">
                      <Button variant="ghost" size="icon" onClick={() => {
                        setSelected(blog);
                        setModerationOpen(true);
                      }} title="Moderate" className="h-8 w-8">
                        <Settings2 className="w-4 h-4" />
                      </Button>

                      {/* Publish button for non-published blogs */}
                      {(blog.status === "DRAFT" || blog.status === "PENDING") && (
                        <Button variant="ghost" size="icon" onClick={() => handlePublish(blog.slug)} title="Publish" className="h-8 w-8">
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Unpublish/Draft button for published or pending blogs */}
                      {(blog.status === "PUBLISHED" || blog.status === "PENDING") && (
                        <Button variant="ghost" size="icon" onClick={() => handleUnpublish(blog._id)} title="Make Draft" className="h-8 w-8">
                          <FileText className="w-4 h-4 text-orange-500" />
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-1 sm:flex-col">
                      <Button variant="ghost" size="icon" onClick={() => handlePin(blog._id)} title="Pin/Unpin" className="h-8 w-8">
                        <Pin className={`w-4 h-4 ${blog.isPinned ? 'text-yellow-500' : ''}`} />
                      </Button>

                      <Button variant="ghost" size="icon" onClick={() => handleFeature(blog._id)} title="Feature/Unfeature" className="h-8 w-8">
                        <Star className={`w-4 h-4 ${blog.isFeatured ? 'text-purple-500' : ''}`} />
                      </Button>

                      {/* Archive button - only for published blogs */}
                      {blog.status === "PUBLISHED" && (
                        <Button variant="ghost" size="icon" onClick={() => handleArchive(blog._id)} title="Archive" className="h-8 w-8">
                          <Archive className="w-4 h-4" />
                        </Button>
                      )}

                      {/* Delete button - always available, but with different styling for published */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(blog.slug)}
                        title="Delete"
                        className={`h-8 w-8 ${blog.status === "PUBLISHED" ? 'text-red-400 hover:text-red-500' : 'text-red-500 hover:text-red-600'}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      {blog.viewCount || 0} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-gray-400" />
                      {blog.likeCount || 0} likes
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-gray-400" />
                      {blog.commentCount || 0} comments
                    </div>
                    <div className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3 text-gray-400" />
                      {blog.bookmarkCount || 0} bookmarks
                    </div>
                  </div>

                  {blog.flagCount && blog.flagCount > 0 && (
                    <div className="flex items-center gap-1 text-red-400">
                      <Flag className="w-3 h-3" />
                      {blog.flagCount} flags
                    </div>
                  )}

                  <div className="text-gray-400 text-xs">
                    <div>Created: {formatDateTime(blog.createdAt)}</div>
                    {blog.publishedAt && <div>Published: {formatDateTime(blog.publishedAt)}</div>}
                    {blog.moderatedAt && (
                      <div>Moderated: {formatDateTime(blog.moderatedAt)} by {blog.moderatedBy}</div>
                    )}
                  </div>

                  {blog.readingTime && (
                    <div className="text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {blog.readingTime} min read
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-12 col-span-full">
                <div className="text-gray-400 mb-2">No blogs found</div>
                <div className="text-sm text-gray-500">Try adjusting your filters or search query</div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="flags">
          <BlogFlagManagement />
        </TabsContent>
      </Tabs>

      {/* Moderation Dialog */}
      <AnimatePresence>
        {moderationOpen && selected && (
          <Dialog open={moderationOpen} onOpenChange={setModerationOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Moderate Blog: {selected.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Blog Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Author:</span>
                      <p className="break-words">{getAuthorName(selected.author)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p>{selected.status || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Current Moderation:</span>
                      <p>{selected.moderationStatus || 'PENDING'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Flags:</span>
                      <p>{selected.flagCount || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Views:</span>
                      <p>{selected.viewCount || 0}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Likes:</span>
                      <p>{selected.likeCount || 0}</p>
                    </div>
                  </div>
                  
                  {selected.subtitle && (
                    <div className="mt-3">
                      <span className="text-gray-400">Subtitle:</span>
                      <p className="text-sm">{selected.subtitle}</p>
                    </div>
                  )}
                  
                  {selected.moderationNotes && (
                    <div className="mt-3">
                      <span className="text-gray-400">Previous Notes:</span>
                      <p className="text-sm bg-gray-700/30 p-2 rounded">{selected.moderationNotes}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="moderationAction">Moderation Action</Label>
                  <Select value={moderationAction} onValueChange={(value) => setModerationAction(value as ModerationAction)}>
                    <SelectTrigger className="border-gray-800 focus:border-gray-400 hover:border-gray-400">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVE">Approve</SelectItem>
                      <SelectItem value="REJECT">Reject</SelectItem>
                      <SelectItem value="FLAG">Flag</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="moderationNotes">Moderation Notes (Optional)</Label>
                  <Textarea 
                    id="moderationNotes" 
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    rows={3}
                    placeholder="Add notes about this moderation decision..."
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => {
                    setModerationOpen(false);
                    setSelected(null);
                    setModerationNotes('');
                  }} className="w-full sm:w-auto">Cancel</Button>
                  <Button onClick={handleModeration} className="w-full sm:w-auto">
                    {moderationAction} Blog
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default BlogsManagementPage
