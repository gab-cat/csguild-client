'use client'

import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation } from 'convex/react'
import { useQuery } from 'convex-helpers/react/cache/hooks'
import { AnimatePresence, motion } from 'framer-motion'
import {  
  Search, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Eye
} from 'lucide-react'
import { useMemo, useState } from 'react'
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

type FlagStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED"
type FlagReason = "SPAM" | "HARASSMENT" | "HATE_SPEECH" | "INAPPROPRIATE_CONTENT" | "COPYRIGHT_VIOLATION" | "MISINFORMATION" | "VIOLENCE" | "ADULT_CONTENT" | "OTHER"

type BlogFlag = {
  _id: Id<'blogFlags'>
  blogId: Id<'blogs'>
  userSlug: string
  reason: FlagReason
  description?: string
  status: FlagStatus
  reviewedAt?: number
  reviewedBy?: string
  createdAt?: number
  blog?: {
    title: string
    slug: string
    status?: string
    moderationStatus?: string
    authorSlug: string
    flagCount?: number
  }
  flaggedBy?: {
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  }
  author?: {
    username?: string
    firstName?: string
    lastName?: string
    imageUrl?: string
  }
}

const flagStatusColors = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30',
  REVIEWED: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  RESOLVED: 'bg-green-500/10 text-green-500 border-green-500/30',
  DISMISSED: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
}

const flagReasonColors = {
  SPAM: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
  HARASSMENT: 'bg-red-500/10 text-red-500 border-red-500/30',
  HATE_SPEECH: 'bg-red-600/10 text-red-600 border-red-600/30',
  INAPPROPRIATE_CONTENT: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
  COPYRIGHT_VIOLATION: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
  MISINFORMATION: 'bg-yellow-600/10 text-yellow-600 border-yellow-600/30',
  VIOLENCE: 'bg-red-700/10 text-red-700 border-red-700/30',
  ADULT_CONTENT: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
  OTHER: 'bg-gray-500/10 text-gray-500 border-gray-500/30',
}

const flagReasonLabels = {
  SPAM: 'Spam',
  HARASSMENT: 'Harassment',
  HATE_SPEECH: 'Hate Speech',
  INAPPROPRIATE_CONTENT: 'Inappropriate Content',
  COPYRIGHT_VIOLATION: 'Copyright Violation',
  MISINFORMATION: 'Misinformation',
  VIOLENCE: 'Violence',
  ADULT_CONTENT: 'Adult Content',
  OTHER: 'Other',
}

export function BlogFlagManagement() {
  const [queryText, setQueryText] = useState('')
  const [reviewOpen, setReviewOpen] = useState(false)
  const [selected, setSelected] = useState<BlogFlag | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<FlagStatus | "all">("all")
  const [selectedReason, setSelectedReason] = useState<FlagReason | "all">("all")
  const [reviewNotes, setReviewNotes] = useState('')
  const [parentRef] = useAutoAnimate()
  
  const debouncedQueryText = useDebounce(queryText, 300)

  // Get flags with filtering
  const flagsResult = useQuery(api.blogs.getBlogFlags, {
    paginationOpts: { numItems: 50, cursor: null },
    status: selectedStatus === "all" ? undefined : selectedStatus,
    reason: selectedReason === "all" ? undefined : selectedReason,
  })

  // Flag review mutation
  const reviewFlag = useMutation(api.blogs.reviewFlag)

  const flags = flagsResult?.page || []

  // Filter by search text on frontend
  const filtered = useMemo(() => {
    if (!debouncedQueryText.trim()) return flags
    
    const searchLower = debouncedQueryText.toLowerCase()
    return flags.filter(flag => 
      flag.blog?.title?.toLowerCase().includes(searchLower) ||
      flag.flaggedBy?.username?.toLowerCase().includes(searchLower) ||
      flag.author?.username?.toLowerCase().includes(searchLower) ||
      flag.description?.toLowerCase().includes(searchLower)
    )
  }, [flags, debouncedQueryText])

  async function handleReview(action: "RESOLVE" | "DISMISS") {
    if (!selected) return
    
    try {
      await reviewFlag({
        flagId: selected._id,
        action,
        notes: reviewNotes.trim() || undefined,
      })
      
      toast.success(`Flag ${action.toLowerCase()}d successfully`)
      setReviewOpen(false)
      setSelected(null)
      setReviewNotes('')
      
    } catch (error) {
      console.error('Review error:', error)
      toast.error(`Failed to ${action.toLowerCase()} flag`)
    }
  }

  function formatDateTime(timestamp?: number) {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleString()
  }

  function getUserName(user?: BlogFlag['flaggedBy']) {
    if (!user) return 'Unknown'
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown'
  }

  function getFlagIcon(status: FlagStatus) {
    switch (status) {
    case 'RESOLVED': return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'DISMISSED': return <XCircle className="w-4 h-4 text-gray-500" />
    case 'REVIEWED': return <Clock className="w-4 h-4 text-blue-500" />
    case 'PENDING':
    default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Flag Management</h2>
            <p className="text-sm text-muted-foreground">Review and manage reported blog content</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as FlagStatus | "all")}>
              <SelectTrigger className="w-full sm:w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="DISMISSED">Dismissed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedReason} onValueChange={(value) => setSelectedReason(value as FlagReason | "all")}>
              <SelectTrigger className="w-full sm:w-48 border-gray-800 focus:border-gray-400 hover:border-gray-400">
                <SelectValue placeholder="Filter by reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                <SelectItem value="SPAM">Spam</SelectItem>
                <SelectItem value="HARASSMENT">Harassment</SelectItem>
                <SelectItem value="HATE_SPEECH">Hate Speech</SelectItem>
                <SelectItem value="INAPPROPRIATE_CONTENT">Inappropriate Content</SelectItem>
                <SelectItem value="COPYRIGHT_VIOLATION">Copyright Violation</SelectItem>
                <SelectItem value="MISINFORMATION">Misinformation</SelectItem>
                <SelectItem value="VIOLENCE">Violence</SelectItem>
                <SelectItem value="ADULT_CONTENT">Adult Content</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8 border-gray-800 focus:border-gray-400 hover:border-gray-400"
              placeholder="Search flags"
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div ref={parentRef} className="space-y-4">
        {filtered.map((flag) => (
          <div key={flag._id} className="rounded-xl border border-gray-800 transition-all duration-300 hover:border-gray-400 bg-card text-card-foreground shadow-sm p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {getFlagIcon(flag.status)}
                  <h3 className="font-medium truncate">{flag.blog?.title || 'Deleted Blog'}</h3>
                  <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${flagStatusColors[flag.status]}`}>
                    {flag.status}
                  </Badge>
                  <Badge variant="outline" className={`text-xs px-2 py-0.5 border ${flagReasonColors[flag.reason]}`}>
                    {flagReasonLabels[flag.reason]}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-400">Flagged by:</span>
                      <span className="truncate">{getUserName(flag.flaggedBy)}</span>
                    </div>

                    {flag.blog && (
                      <div className="flex items-center gap-2 min-w-0">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-400">Author:</span>
                        <span className="truncate">{getUserName(flag.author)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-400">Flagged:</span>
                      <span className="text-xs sm:text-sm">{formatDateTime(flag.createdAt)}</span>
                    </div>

                    {flag.blog && (
                      <>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-400">Status:</span>
                          <span>{flag.blog.status || 'Unknown'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-400">Total:</span>
                          <span>{flag.blog.flagCount || 0}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {flag.reviewedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-400">Reviewed:</span>
                      <span className="text-xs sm:text-sm">{formatDateTime(flag.reviewedAt)}</span>
                      {flag.reviewedBy && <span className="hidden sm:inline">by {flag.reviewedBy}</span>}
                    </div>
                  )}
                </div>
                
                {flag.description && (
                  <div className="mt-3 p-3 bg-gray-800/30 rounded-lg">
                    <span className="text-gray-400 text-sm">Description:</span>
                    <p className="text-sm mt-1">{flag.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                {flag.status === "PENDING" && (
                  <Button variant="ghost" size="icon" onClick={() => {
                    setSelected(flag);
                    setReviewOpen(true);
                  }} title="Review Flag">
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                
                {flag.blog && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => window.open(`/blogs/${flag.blog?.slug}`, '_blank')} 
                    title="View Blog"
                  >
                    <FileText className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No flags found</div>
          <div className="text-sm text-gray-500">Try adjusting your filters or search query</div>
        </div>
      )}

      {/* Review Flag Dialog */}
      <AnimatePresence>
        {reviewOpen && selected && (
          <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4 sm:mx-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Review Flag: {selected.blog?.title || 'Deleted Blog'}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Flag Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Reason:</span>
                      <p className="break-words">{flagReasonLabels[selected.reason]}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Flagged by:</span>
                      <p className="break-words">{getUserName(selected.flaggedBy)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Date:</span>
                      <p className="text-xs sm:text-sm">{formatDateTime(selected.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Status:</span>
                      <p>{selected.status}</p>
                    </div>
                  </div>
                  
                  {selected.description && (
                    <div className="mt-3">
                      <span className="text-gray-400">Description:</span>
                      <p className="text-sm bg-gray-700/30 p-2 rounded mt-1">{selected.description}</p>
                    </div>
                  )}
                </div>
                
                {selected.blog && (
                  <div className="bg-gray-800/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Blog Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Author:</span>
                        <p className="break-words">{getUserName(selected.author)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <p>{selected.blog.status || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Moderation:</span>
                        <p>{selected.blog.moderationStatus || 'PENDING'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Total Flags:</span>
                        <p>{selected.blog.flagCount || 0}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
                  <Textarea 
                    id="reviewNotes" 
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    className="border-gray-800 focus:border-gray-400 hover:border-gray-400" 
                    rows={3}
                    placeholder="Add notes about your review decision..."
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => {
                    setReviewOpen(false);
                    setSelected(null);
                    setReviewNotes('');
                  }} className="w-full sm:w-auto">Cancel</Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview("DISMISS")}
                    className="w-full sm:w-auto border-gray-600 hover:border-gray-400"
                  >
                    Dismiss Flag
                  </Button>
                  <Button onClick={() => handleReview("RESOLVE")} className="w-full sm:w-auto">
                    Resolve Flag
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

export default BlogFlagManagement
