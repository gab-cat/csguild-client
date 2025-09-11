'use client'

import { useQuery } from 'convex-helpers/react/cache/hooks'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Bookmark, 
  Share, 
  Flag, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Star,
  Pin,
  TrendingUp,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/convex'

export function BlogStatsOverview() {
  const stats = useQuery(api.blogs.getBlogOverallStats, {})

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-700 rounded w-2/3 mb-2" />
              <div className="h-8 bg-gray-600 rounded" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 mb-8"
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Total Blogs</span>
                <span className="sm:hidden">Total</span>
              </CardTitle>
              <div className="text-xl sm:text-2xl font-bold">{stats.overview.totalBlogs}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">{stats.recent.recentBlogs} new this week</span>
                <span className="sm:hidden">+{stats.recent.recentBlogs} this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Published</span>
                <span className="sm:hidden">Published</span>
              </CardTitle>
              <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.overview.publishedBlogs}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-green-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">{stats.recent.recentPublished} new this week</span>
                <span className="sm:hidden">+{stats.recent.recentPublished} this week</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Pending Review</span>
                <span className="sm:hidden">Pending</span>
              </CardTitle>
              <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stats.moderation.pendingModeration}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-gray-400">
                <span className="hidden sm:inline">Needs moderation</span>
                <span className="sm:hidden">Needs review</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                <Flag className="w-4 h-4" />
                <span className="hidden sm:inline">Flagged Content</span>
                <span className="sm:hidden">Flagged</span>
              </CardTitle>
              <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.moderation.highFlagBlogs}</div>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-red-400">
                <span className="hidden sm:inline">High priority flags</span>
                <span className="sm:hidden">High priority</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Engagement Stats */}
      <motion.div variants={item}>
        <Card className="border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Engagement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Views</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalViews.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Avg: {stats.engagement.averageViewsPerBlog}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Likes</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalLikes.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Avg: {stats.engagement.averageLikesPerBlog}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <MessageCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Comments</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalComments.toLocaleString()}</div>
                <div className="hidden sm:block text-xs text-gray-500">Total comments</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <Share className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Shares</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalShares.toLocaleString()}</div>
                <div className="hidden sm:block text-xs text-gray-500">Total shares</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <Bookmark className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Bookmarks</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalBookmarks.toLocaleString()}</div>
                <div className="hidden sm:block text-xs text-gray-500">Total bookmarks</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                  <Flag className="w-4 h-4 text-red-400" />
                  <span className="text-xs sm:text-sm text-gray-400">Flags</span>
                </div>
                <div className="text-lg sm:text-xl font-semibold">{stats.engagement.totalFlags.toLocaleString()}</div>
                <div className="hidden sm:block text-xs text-gray-500">Total flags</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Status & Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle>Content Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-sm">Published</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    {stats.overview.publishedBlogs}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <span className="text-sm">Drafts</span>
                  </div>
                  <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/30">
                    {stats.overview.draftBlogs}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    {stats.overview.pendingBlogs}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="text-sm">Archived</span>
                  </div>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                    {stats.overview.archivedBlogs}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle>Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Pending Review</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
                    {stats.moderation.pendingModeration}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Flagged</span>
                  </div>
                  <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                    {stats.moderation.flaggedBlogs}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Under Review</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                    {stats.moderation.underReviewBlogs}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Approved</span>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                    {stats.moderation.approvedBlogs}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Featured Content & Top Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle>Featured Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">Featured Blogs</span>
                  </div>
                  <div className="text-lg font-semibold">{stats.content.featuredBlogs}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pin className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Pinned Blogs</span>
                  </div>
                  <div className="text-lg font-semibold">{stats.content.pinnedBlogs}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle>Top Authors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topAuthors.map((author, index) => (
                  <div key={author.authorSlug} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-xs">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">{author.authorSlug}</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/30">
                      {author.count} {author.count === 1 ? 'blog' : 'blogs'}
                    </Badge>
                  </div>
                ))}
                {stats.topAuthors.length === 0 && (
                  <div className="text-center text-gray-500 text-sm py-4">
                    No authors yet
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default BlogStatsOverview
