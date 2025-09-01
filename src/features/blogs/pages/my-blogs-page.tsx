'use client'

import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar,
  BarChart3,
  BookOpen,
  Clock,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Target,
  Award
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { useAuthStore } from '@/features/auth'
import { MyBlogResponseDto } from '@generated/api-client'

import { 
  useMyBlogs, 
  useDeleteBlog, 
  usePublishBlog, 
  useUnpublishBlog,
  // useBlogAnalytics,
  useAuthorStats
} from '../hooks'
import type { BlogStatus } from '../types'

interface MyBlogsFilters {
  status?: BlogStatus
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount'
  sortOrder?: 'asc' | 'desc'
}

export default function MyBlogsPage() {
  const [filters, setFilters] = useState<MyBlogsFilters>({
    status: undefined,
    search: '',
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  })

  const { data: blogsData, isLoading, error } = useMyBlogs({
    status: filters.status,
    limit: 12,
    page: 1
  })

  // Get analytics data for future use
  // const { data: analyticsData } = useBlogAnalytics({
  //   timeframe: 'week'
  // })

  const { user } = useAuthStore()
  const { data: authorStatsData } = useAuthorStats(user?.username as string, true)

  const deleteBlogMutation = useDeleteBlog()
  const publishBlogMutation = usePublishBlog()
  const unpublishBlogMutation = useUnpublishBlog()

  const blogs = blogsData?.data || []
  const pagination = blogsData?.pagination

  // Calculate aggregated stats
  const totalViews = blogs.reduce((sum, blog) => sum + blog.viewCount, 0)
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likeCount, 0)
  const totalComments = blogs.reduce((sum, blog) => sum + blog.commentCount, 0)
  const totalBookmarks = blogs.reduce((sum, blog) => sum + blog.bookmarkCount, 0)
  const publishedBlogs = blogs.filter(b => b.status === 'PUBLISHED').length
  const draftBlogs = blogs.filter(b => b.status === 'DRAFT').length

  // Filter and sort blogs locally
  const filteredBlogs = blogs
    .filter(blog => {
      if (filters.search) {
        return blog.title.toLowerCase().includes(filters.search.toLowerCase()) ||
               blog.excerpt?.toLowerCase().includes(filters.search.toLowerCase())
      }
      return true
    })
    .sort((a, b) => {
      const aValue = a[filters.sortBy || 'updatedAt']
      const bValue = b[filters.sortBy || 'updatedAt']
      const order = filters.sortOrder === 'asc' ? 1 : -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * order
      }
      return 0
    })

  const handleDeleteBlog = async (slug: string) => {
    try {
      await deleteBlogMutation.mutateAsync(slug)
    } catch (error) {
      console.error('Failed to delete blog:', error)
    }
  }

  const handleTogglePublish = async (blog: MyBlogResponseDto) => {
    try {
      if (blog.status === 'PUBLISHED') {
        await unpublishBlogMutation.mutateAsync(blog.slug)
      } else {
        await publishBlogMutation.mutateAsync(blog.slug)
      }
    } catch (error) {
      console.error('Failed to toggle publish status:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'PUBLISHED': return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'DRAFT': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    case 'ARCHIVED': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to load your blogs
          </h2>
          <p className="text-gray-400">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Compact Header */}
      <header className="border-b border-gray-800 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">My Blogs</h1>
              <p className="text-sm text-gray-400">
                {pagination?.total || 0} blogs • {publishedBlogs} published • {draftBlogs} drafts
              </p>
            </div>
            <Link href="/blogs/create">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Blog
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          {/* Primary Stats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Blogs</p>
                <p className="text-xl font-bold text-white">{pagination?.total || 0}</p>
              </div>
              <BookOpen className="w-5 h-5 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Published</p>
                <p className="text-xl font-bold text-green-400">{publishedBlogs}</p>
              </div>
              <Eye className="w-5 h-5 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Drafts</p>
                <p className="text-xl font-bold text-gray-400">{draftBlogs}</p>
              </div>
              <EyeOff className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Views</p>
                <p className="text-xl font-bold text-blue-400">{totalViews.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Likes</p>
                <p className="text-xl font-bold text-red-400">{totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="w-5 h-5 text-red-400" />
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Engagement</p>
                <p className="text-xl font-bold text-yellow-400">
                  {totalViews > 0 ? Math.round(((totalLikes + totalComments) / totalViews) * 100) : 0}%
                </p>
              </div>
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions & Analytics Summary */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link href="/blogs/create" className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Blog
                  </Button>
                </Link>
                <Link href="/blogs/analytics" className="block">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="lg:w-2/3">
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Performance Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalComments}</p>
                  <p className="text-xs text-gray-400">Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{totalBookmarks}</p>
                  <p className="text-xs text-gray-400">Bookmarks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {blogs.length > 0 ? Math.round(totalViews / blogs.length) : 0}
                  </p>
                  <p className="text-xs text-gray-400">Avg Views</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {(authorStatsData as { totalBlogs?: number })?.totalBlogs || blogs.length}
                  </p>
                  <p className="text-xs text-gray-400">All Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Filters */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex items-center gap-2 flex-1">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search your blogs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="border-0 bg-transparent text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-3">
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => 
                  setFilters(prev => ({ 
                    ...prev, 
                    status: value === 'all' ? undefined : value as BlogStatus 
                  }))
                }
              >
                <SelectTrigger className="w-[130px] border-gray-700 bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split('-') as [typeof filters.sortBy, typeof filters.sortOrder]
                  setFilters(prev => ({ ...prev, sortBy, sortOrder }))
                }}
              >
                <SelectTrigger className="w-[140px] border-gray-700 bg-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="updatedAt-desc">Latest First</SelectItem>
                  <SelectItem value="updatedAt-asc">Oldest First</SelectItem>
                  <SelectItem value="viewCount-desc">Most Views</SelectItem>
                  <SelectItem value="likeCount-desc">Most Liked</SelectItem>
                  <SelectItem value="title-asc">A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Compact Blog List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No blogs found
            </h3>
            <p className="text-gray-400 mb-6">
              {filters.search || filters.status 
                ? 'No blogs match your current filters'
                : 'You haven\'t created any blogs yet'
              }
            </p>
            <Link href="/blogs/create">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Blog Info - Left Side */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {blog.title}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getStatusColor(blog.status)}`}
                      >
                        {blog.status}
                      </Badge>
                      {blog.isPinned && (
                        <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400">
                          Pinned
                        </Badge>
                      )}
                    </div>
                    
                    {blog.excerpt && (
                      <p className="text-sm text-gray-400 line-clamp-1 mb-2">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {blog.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {blog.commentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(blog.updatedAt)}
                      </span>
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(blog.publishedAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags - Middle */}
                  <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                    {blog.tags.slice(0, 2).map((tagItem) => (
                      <Badge 
                        key={tagItem.tag?.id || tagItem.tag?.slug}
                        variant="outline" 
                        className="text-xs border-purple-500/30 text-purple-400 px-2 py-0"
                      >
                        {tagItem.tag?.name}
                      </Badge>
                    ))}
                    {blog.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs text-gray-400 px-2 py-0">
                        +{blog.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Actions - Right Side */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/blogs/${blog.slug}/edit`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-purple-500/20 hover:text-purple-400"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTogglePublish(blog)}
                      disabled={publishBlogMutation.isPending || unpublishBlogMutation.isPending}
                      className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-400"
                    >
                      {blog.status === 'PUBLISHED' ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>

                    <Link href={`/blogs/${blog.slug}`}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-400"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700">
                        <DialogHeader>
                          <DialogTitle className="text-white">
                            Delete Blog
                          </DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Are you sure you want to delete &quot;{blog.title}&quot;? 
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" className="border-gray-700 text-gray-300">
                            Cancel
                          </Button>
                          <Button
                            onClick={() => handleDeleteBlog(blog.slug)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleteBlogMutation.isPending}
                          >
                            {deleteBlogMutation.isPending ? 'Deleting...' : 'Delete'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
